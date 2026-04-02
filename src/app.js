import express from "express";
import cors from "cors";

const app = express();

//express config
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

//cors config
app.use(cors({
    origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(",") : "http://localhost:1573",
    credentials:true,
    methods: ["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
    allowedHeaders: ["Authorization","Content-Type"]
}));

//Routes
import healtcheckRouter from "./routes/healthcheck.routes.js"
app.use("/api/v1/healthcheck",healtcheckRouter);

export default app;
