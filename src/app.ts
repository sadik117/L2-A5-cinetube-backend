import express, { type Application, type Request, type Response } from "express";
import routes from "./routes/router";
import { auth } from "./lib/auth";
import { toNodeHandler } from "better-auth/node";


const app: Application = express();

app.use(express.json());

// Better Auth Route 
app.all("/api/v1/auth/*splat", toNodeHandler(auth));

//  API Routes 
app.use("/api/v1", routes);

//  Root Route 
app.get("/", (req: Request, res: Response) => {
  res.send("Hello, Enjoy CineTube!!");
});


export default app;