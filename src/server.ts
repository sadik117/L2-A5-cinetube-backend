import app from "./app.js";
import { prisma } from "./lib/prisma";

const port = process.env.PORT;


async function server() {
  try {
    await prisma.$connect();

    app.listen(port, () => {
      console.log(`Server is running at ${port}`);
    });

  } catch (error) {
    console.log(error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

server();