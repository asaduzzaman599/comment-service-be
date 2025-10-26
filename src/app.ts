import express from "express"
import cors from "cors"
import { AppRouter } from "./app/router"
import { errorHandler } from "./app/middlewares/global-error"

const app = express()

app.use(cors({
        credentials: true,
        origin: ["http://localhost:5173/"]
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

//routes
app.use("/api/v1", AppRouter)
app.get('/', (req, res) => {
        res.send('Hello World!')
        })
app.use(errorHandler);

export default app;