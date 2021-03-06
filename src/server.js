import express from "express"
import listEndpoints from "express-list-endpoints"
import cors from "cors"
import profilesRoutes from "./profiles/index.js"
import postsRoutes from "./posts/index.js"
import experienceRoutes from "../src/experience/index.js"

import {
  badRequestErrorHandler,
  notFoundErrorHandler,
  forbiddenErrorHandler,
  catchAllErrorHandler,
} from "./errorHandlers.js"
import mongoose from "mongoose"
import commentsRoutes from "../src/comments/index.js"

const server = express()

const port = process.env.PORT || 3001

const whitelist = [process.env.FRONTEND_DEV_URL, process.env.FRONTEND_CLOUD_URL]

const corsOptions = {
  origin: function (origin, next) {
    if (!origin || whitelist.includes(origin)) {
      next(null, true)
    } else {
      next(new Error("Origin is not supported!"))
    }
  },
}

// const publicFolderPath = join(
//   getCurrentFolderPath(import.meta.url),
//   "../public"
// )

// *********MIDDLEWARES*********
// server.use(express.static(publicFolderPath))
server.use(express.json()) //json acceptance
server.use(cors(corsOptions))

// ********ROUTES*********
server.use("/profiles", profilesRoutes)
server.use("/experiences", experienceRoutes)
server.use("/posts", postsRoutes)
server.use("/comments", commentsRoutes)
// server.use("/experiences", experiencesRoutes)

// ********ERROR MIDDLEWARES**********
server.use(badRequestErrorHandler)
server.use(notFoundErrorHandler)
server.use(forbiddenErrorHandler)
server.use(catchAllErrorHandler)

console.table(listEndpoints(server))
// console.log(process.env.MONGO_CONNECTION)
mongoose
  .connect(process.env.MONGO_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(
    server.listen(port, () => {
      console.log("Running on port", port)
    })
  )
  .catch((err) => console.log(err))
