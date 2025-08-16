import axios from "axios";
import { faker } from "@faker-js/faker/locale/pt_BR";
import { cpf as cpfValidator } from "cpf-cnpj-validator";
const api = axios.create({
  baseURL: "http://localhost:3001",
  withCredentials: true,
});
// npx tsx src/tests/create-employee-test.ts
interface Employee {
  name: string;
  email: string;
  cpf: string;
  phone: string;
  position: string;
  birth_date?: string;
  department_id: string;
}

async function login(): Promise<string> {
  try {
    const response = await api.post("api/auth/login", {
      email: "gabs4@email.com",
      password: "12345678",
    });

    if (!response.headers["set-cookie"]) {
      console.error("Estrutura inesperada da resposta:", response.data);
      throw new Error("Resposta do login não contém cookie");
    }

    const cookie = response.headers["set-cookie"][0];
    console.log("Cookie obtido:", cookie!.split(";")[0]);
    return cookie!;
  } catch (error) {
    console.error("Erro detalhado no login:", {
      status: (error as any).response?.status,
      data: (error as any).response?.data,
      message: (error as any).message,
    });
    throw new Error("Falha no login - Verifique credenciais e endpoint");
  }
}

function generateRandomEmployee(): Employee {
  return {
    name: faker.person.fullName(),
    email: faker.internet.email().toLowerCase(),
    cpf: cpfValidator.generate(),
    phone: `9${faker.string.numeric(8)}`,
    position: faker.person.jobTitle(),
    // birth_date: faker.date.birthdate({ min: 18, max: 65, mode: "age" }).toISOString().split("T")[0],
    birth_date: "2001-08-18",
    department_id: "729dd11e-45d7-4184-9544-372f237b8dd4",
  };
}

async function createEmployeeWithAuth(cookie: string): Promise<void> {
  const employee = generateRandomEmployee();

  try {
    const response = await api.post("/api/employee/", employee, {
      headers: {
        Cookie: cookie,
      },
    });
    console.log(`✅ ${employee.name} criado com sucesso`);
  } catch (error) {
    console.error(`❌ Erro ao criar ${employee.name}:`, {
      status: (error as any).response?.status,
      error: (error as any).response?.data?.message || (error as any).message,
      cpf: employee.cpf,
    });
  }
}

async function runStressTest() {
  try {
    const quantity = 10000;
    console.log("🔒 Tentando login...");
    const cookie = await login();

    console.log("👥 Criando employees...");
    for (let i = 0; i < quantity; i++) {
      await createEmployeeWithAuth(cookie);
      // await new Promise((resolve) => setTimeout(resolve, 500));
    }
  } catch (error) {
    console.error("🚨 Erro crítico:", (error as any).message);
  } finally {
    console.log("🏁 Processo concluído");
  }
}

runStressTest();
