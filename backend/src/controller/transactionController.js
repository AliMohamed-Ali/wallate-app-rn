import { sql } from "../config/db.js";
export async function getTransactionsByUserId(req, res) {
  const { userId } = req.params;
  try {
    const transactions =
      await sql`SELECT * FROM transactions WHERE user_id = ${userId}`;
    res.json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function addTransaction(req, res) {
  const { user_id, title, amount, category } = req.body;
  if (!user_id || !title || !amount || !category) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  try {
    const transaction =
      await sql`INSERT INTO transactions (user_id, title, amount, category) VALUES (${user_id}, ${title}, ${amount}, ${category}) RETURNING *`;
    res.status(201).json(transaction[0]);
    console.log("Transaction created successfully:", transaction[0]);
  } catch {
    console.error("Error creating transaction:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function deleteTransaction(req, res) {
  const { id } = req.params;
  if (isNaN(parseInt(id))) {
    return res.status(400).json({ error: "Invalid transaction ID" });
  }
  try {
    const transaction =
      await sql`DELETE FROM transactions WHERE id = ${id} RETURNING *`;
    if (transaction.length === 0) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    console.error("Error deleting transaction:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
export async function getSummaryByUserId(req, res) {
  const { userId } = req.params;
  try {
    const balanceResult = await sql`
    SELECT COALESCE(SUM(amount), 0) as balance
    FROM transactions
    WHERE user_id = ${userId}
  `;
    const incomeResult = await sql`
    SELECT COALESCE(SUM(amount), 0) as income
    FROM transactions
    WHERE user_id = ${userId} AND amount > 0
  `;
    const expenseResult = await sql`
    SELECT COALESCE(SUM(amount), 0) as expense
    FROM transactions
    WHERE user_id = ${userId} AND amount < 0
  `;
    const transactions = {
      balance: balanceResult[0].balance,
      income: incomeResult[0].income,
      expense: expenseResult[0].expense,
    };
    res.status(200).json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
