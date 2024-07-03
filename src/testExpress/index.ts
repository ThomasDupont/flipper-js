import express from 'express'
import router from '../router/flipper.router'
import { User } from '../user'

const app = express()
const PORT = 3999

void User.addUser('admin', 'password')

app.use(router)

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
