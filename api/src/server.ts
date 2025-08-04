import { builder } from "./builder";

const server = async () => {
  try {
    const application = builder();

    (await application).listen({
      port: 3333,
      host: "0.0.0.0",
    });

    console.log("Server running on http://localhost:3333");
  } catch (err) {
    console.log("Application error");
    process.exit(1);
  } finally {
  }
};

server();
