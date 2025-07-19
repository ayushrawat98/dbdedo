import express from "express"
import cors from "cors"
import DBRouter from "./route.js"
import { Logger } from "./util.js"


//initialize app
const app = express()

//middleware
app.use(cors())
app.use(express.json({limit : '3kb'}))
app.use(Logger)

//routes
app.use("", DBRouter)

//error handler
app.use((err, req, res, next) => {
  return res.status(500).json(err.message)
})

//start the server
app.listen(3000, () => {
    console.log("Server started")
})