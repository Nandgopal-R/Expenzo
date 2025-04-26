import { Context } from "hono";
import { z } from "zod";
import { neon } from '@neondatabase/serverless'
import { env } from 'hono/adapter'

// Validation schema for expenses
const expenseValidation = z.object({
  amount: z.number(),
  description: z.string().regex(/^[a-zA-Z]+$/),
  category: z.string().regex(/^[a-zA-Z]+$/),
});

// Get all expenses
export const getExpenses = async (c: Context) => {
  try {
    const { DATABASE_URL } = env<{ DATABASE_URL: string }>(c)
    const db = neon(DATABASE_URL)

    const expenses = await db.query(`SELECT * FROM expenses`);
    return c.json({ expenses }, 200);
  } catch (error) {
    console.error("Error fetching expenses:", error);
    return c.json({ message: "Internal Server Error" }, 500);
  }
};

// Add a new expense
export const addExpense = async (c: Context) => {
  try {
    const { DATABASE_URL } = env<{ DATABASE_URL: string }>(c)
    const db = neon(DATABASE_URL)

    const body = await c.req.json();
    const validBody = expenseValidation.safeParse(body);

    if (!validBody.success) {
      return c.json({ message: "Invalid Input" }, 400);
    }

    const { amount, description, category } = validBody.data;

    // Insert the new expense into the database
    await db.query(
      `INSERT INTO expenses (amount, description, category) VALUES ($1, $2, $3)`,
      [amount, description, category]
    );

    return c.json({ message: "Expense entered successfully" }, 200);
  } catch (error) {
    console.error("Error adding expense:", error);
    return c.json({ message: "Internal Server Error", error: error }, 500);
  }
};

// Delete an expense by ID

export const deleteExpense = async (c: Context) => {
  try {
    const { DATABASE_URL } = env<{ DATABASE_URL: string }>(c)
    const db = neon(DATABASE_URL)

    const id = Number(c.req.param('id'));
    const idSchema = z.number().int().positive();
    const validId = idSchema.safeParse(id);

    if (!validId.success) {
      return c.json({ message: "Invalid Input" }, 400);
    }

    const deleted = await db.query(`DELETE FROM expenses WHERE id=$1 RETURNING id`, [id]);
    if (deleted.values.length == 0) {
      return c.json({ message: "Expense not found" }, 400)
    }
    return c.json({ message: "Expense Deleted" }, 200)
  }
  catch (error) {
    return c.json({ message: "Internal Server Error" }, 500)
  }
};

