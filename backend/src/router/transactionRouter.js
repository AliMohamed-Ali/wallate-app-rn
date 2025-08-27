import express from "express";
import {
  addTransaction,
  deleteTransaction,
  getSummaryByUserId,
  getTransactionsByUserId,
} from "../controller/transactionController.js";

const router = express.Router();

router.get("/:userId", getTransactionsByUserId);

router.post("/", addTransaction);

router.delete("/:id", deleteTransaction);

router.get("/summary/:userId", getSummaryByUserId);

export default router;
