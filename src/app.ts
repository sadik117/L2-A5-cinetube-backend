import express, { type Application, type Request, type Response } from "express";
import routes from "./routes/router";
import { auth } from "./lib/auth";
import { toNodeHandler } from "better-auth/node";
import cors from "cors"


const app: Application = express();

app.use(express.json());
app.use(cors({
    origin: "http://localhost:3000", 
    credentials: true,              
    allowedHeaders: ["Content-Type", "Authorization", "Origin"],             
}));

// Better Auth Route 
app.all("/api/auth/*splat", toNodeHandler(auth));

//  API Routes 
app.use("/api/v1", routes);

//  Root Route 
app.get("/", (req: Request, res: Response) => {
  res.send("Hello, Enjoy CineTube!!");
});


export default app;