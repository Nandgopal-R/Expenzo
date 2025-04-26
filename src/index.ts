import { Hono } from 'hono'
import { getExpenses, addExpense, deleteExpense } from "./controllers/app"

const app = new Hono()

app.get('/expenzo', (c) => {
  return c.text('Hi from expenzo!')
})

app.get('/expenses', getExpenses)
app.post('/expenses', addExpense)
app.delete('/delete/:id', deleteExpense)

export default app
