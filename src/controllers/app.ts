import { Context } from "hono";
import { db } from "../../db/client.js";
import { z } from "zod";
import { NeonDbError } from "@neondatabase/serverless";

// Validation schema for expenses
const expenseValidation = z.object({
  amount: z.number(),
  description: z.string().regex(/^[a-zA-Z]+$/),
  category: z.string().regex(/^[a-zA-Z]+$/),
});

// Get all expenses
export const getExpenses = async (c: Context) => {
  try {
    const expenses = await db`SELECT * FROM expenses`;
    return c.json({ expenses }, 200);
  } catch (error) {
    console.error("Error fetching expenses:", error);
    return c.json({ message: "Internal Server Error" }, 500);
  }
};

// Add a new expense
export const addExpense = async (c: Context) => {
  try {
    const body = await c.req.json();
    const validBody = expenseValidation.safeParse(body);

    if (!validBody.success) {
      return c.json({ message: "Invalid Input" }, 400);
    }

    const { amount, description, category } = validBody.data;

    // Insert the new expense into the database
    await db`INSERT INTO expenses (amount, description, category) VALUES (${amount}, ${description}, ${category})`;

    return c.json({ message: "Expense entered successfully" }, 200);
  } catch (error) {
    console.error("Error adding expense:", error);
    return c.json({ message: "Internal Server Error" }, 500);
  }
};

// Delete an expense by ID

export const deleteExpense = async (c: Context) => {
  try {
    const id = Number(c.req.param('id'));
    const idSchema = z.number().int().positive();
    const validId = idSchema.safeParse(id);

    if (!validId.success) {
      return c.json({ message: "Invalid Input" }, 400);
    }

    const deleted = db`DELETE FROM expenses WHERE id=id RETURNING id`
    if (!deleted) {
      return c.json({ message: "Expense not found" }, 400)
    }
    return c.json({ message: "Expense Deleted" }, 200)
  }
  catch (error) {
    return c.json({ message: "Internal Server Error" }, 500)
  }
};

