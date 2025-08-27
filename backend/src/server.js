import express from "express";
import dotenv from "dotenv";
import { initDB } from "./config/db.js";
import ratelimiter from "./middleware/ratelimiter.js";
import transactionRouter from "./router/transactionRouter.js";
dotenv.config();

const app = express();

const PORT = process.env.PORT || 5001;

app.use(ratelimiter);
app.use(express.json());
app.use("/api/transactions", transactionRouter);

initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
