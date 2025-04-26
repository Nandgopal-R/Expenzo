import { Hono } from 'hono'
import expenseRoutes from './routes/appRoutes'

const app = new Hono()

app.get('/expenzo', (c) => {
  return c.text('Hi from expenzo!')
})

app.route('/expenzo', expenseRoutes)

export default app
