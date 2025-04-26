import { Hono } from "hono";
import { getExpenses, addExpense, deleteExpense } from "../controllers/app"

const expenseRoutes = new Hono()

expenseRoutes.get('/expenses', getExpenses)
expenseRoutes.post('/expenses', addExpense)
expenseRoutes.delete('/delete/:id', deleteExpense)

export default expenseRoutes
