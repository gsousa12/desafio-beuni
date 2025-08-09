import { birthdayQueue } from "./queue";

export function startProducer() {
  const intervalMs = 10_000;

  const enqueue = async () => {
    const payload = {
      now: new Date().toISOString(),
    };

    await birthdayQueue.add("birthday-check", payload, {
      removeOnComplete: 100,
      removeOnFail: 100,
    });

    console.log("[producer] enqueued job with payload:", payload);
  };

  enqueue().catch((e) => console.error("[producer] initial enqueue error:", e));
  setInterval(() => {
    enqueue().catch((e) => console.error("[producer] interval enqueue error:", e));
  }, intervalMs);
}
