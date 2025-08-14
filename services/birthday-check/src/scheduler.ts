import * as cron from "node-cron";
import { DatabaseService } from "./database";
import { enqueueBirthdayProcess } from "./queue";

const BATCH_SIZE = Number(process.env.BIRTHDAY_BATCH_SIZE ?? 100);
const BATCH_DELAY_MS = Number(process.env.BIRTHDAY_BATCH_DELAY_MS ?? 1000);

const processBirthdayCheck = async () => {
  const startTime = new Date();
  console.log(`[scheduler] starting birthday check at ${startTime.toISOString()}`);

  try {
    // Contar total de employees com aniversário
    const totalEmployees = await DatabaseService.countUpcomingBirthdays();
    console.log(`[scheduler] found ${totalEmployees} employees with upcoming birthdays`);

    if (totalEmployees === 0) {
      console.log(`[scheduler] no employees to process, skipping`);
      return;
    }

    const totalPages = Math.ceil(totalEmployees / BATCH_SIZE);
    console.log(`[scheduler] processing ${totalPages} batches of ${BATCH_SIZE} employees each`);

    let processedCount = 0;

    // Processar em lotes para não sobrecarregar
    for (let page = 0; page < totalPages; page++) {
      console.log(`[scheduler] processing batch ${page + 1}/${totalPages}`);

      const employees = await DatabaseService.getUpcomingBirthdays(page, BATCH_SIZE);

      // Enfileirar cada employee individual para processamento
      const enqueuePromises = employees.map(async (employee, index) => {
        try {
          await enqueueBirthdayProcess(employee, {
            delay: index * 100, // Pequeno delay entre jobs para evitar picos
          });
          processedCount++;
        } catch (error) {
          console.error(`[scheduler] failed to enqueue employee ${employee.employee.id}:`, error);
        }
      });

      await Promise.allSettled(enqueuePromises);

      // Delay entre lotes para controlar carga
      if (page < totalPages - 1) {
        console.log(`[scheduler] waiting ${BATCH_DELAY_MS}ms before next batch`);
        await new Promise((resolve) => setTimeout(resolve, BATCH_DELAY_MS));
      }
    }

    const endTime = new Date();
    const duration = endTime.getTime() - startTime.getTime();

    console.log(`[scheduler] birthday check completed in ${duration}ms`);
    console.log(`[scheduler] processed ${processedCount}/${totalEmployees} employees successfully`);
  } catch (error) {
    console.error(`[scheduler] birthday check failed:`, error);
  }
};

const startScheduler = () => {
  // Executar a cada 12 horas (às 00:00 e 12:00)
  const cronExpression = "0 0,12 * * *";

  console.log(`[scheduler] starting birthday scheduler with cron: ${cronExpression}`);

  cron.schedule(
    cronExpression,
    () => {
      console.log(`[scheduler] cron job triggered at ${new Date().toISOString()}`);
      processBirthdayCheck();
    },
    {
      timezone: process.env.TIMEZONE ?? "America/Sao_Paulo",
    }
  );

  // Executar uma vez na inicialização para teste (opcional)
  if (process.env.NODE_ENV === "development") {
    console.log(`[scheduler] running initial check for development`);
    setTimeout(() => {
      processBirthdayCheck();
    }, 5000); // 5 segundos após o start
  }
};

export const BirthdayScheduler = {
  start: startScheduler,
  runOnce: processBirthdayCheck,
};
