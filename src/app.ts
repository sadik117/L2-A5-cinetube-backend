import express, { type Application, type Request, type Response } from "express";
import routes from "./routes/router";
import { auth } from "./lib/auth";
import { toNodeHandler } from "better-auth/node";
import cors from "cors"
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { globalErrorHandler } from "./middleware/errorHandler";

const app: Application = express();

dotenv.config();

app.use(
  "/api/v1/payment/webhook",
  express.raw({ type: "application/json" })
);

app.use(express.json());
app.use(cors({
    origin: "http://localhost:3000", 
    credentials: true,              
    allowedHeaders: ["Content-Type", "Authorization", "Origin"],             
}));

app.use(cookieParser());

// Better Auth Route 
app.all("/api/auth/*splat", toNodeHandler(auth));

//  API Routes 
app.use("/api/v1", routes);

// Global Error Handler
app.use(globalErrorHandler);

//  Root Route 
app.get("/", (req: Request, res: Response) => {
  res.send("Hello, Enjoy CineTube!!");
});


export default app;