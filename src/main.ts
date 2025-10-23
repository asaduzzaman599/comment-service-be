import express from "express"
import config from "./app/config"
const app = express()

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(config.PORT, () => {
  console.log(`Server listening on port ${config.PORT}`)
})