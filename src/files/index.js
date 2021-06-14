import express from "express"
import { writeAuthorImg, writePostCover } from "../lib/fs-tools.js"
import multer from "multer"
import { pipeline } from "stream"
import { generatePDFStream } from "../lib/pdf.js"

const filesRouter = express.Router()

filesRouter.post(
  "/userImg/upload",
  multer().single("avatar"),
  async (req, res, next) => {
    try {
      console.log("trying to upload")
      await writeAuthorImg(req.file.originalname, req.file.buffer)
      res.send()
    } catch (error) {
      console.log(error)
      next(error)
    }
  }
)

filesRouter.post(
  "/postCover/upload",
  multer().single("cover"),
  async (req, res, next) => {
    try {
      console.log("req.file.originalname")
      await writePostCover(req.file.originalname, req.file.buffer)
      res.send()
    } catch (error) {
      console.log(error)
      next(error)
    }
  }
)

filesRouter.get("/pdfDownload", async (req, res, next) => {
  try {
    const source = generatePDFStream()
    const destination = res
    res.setHeader("Content-Disposition", "attachment; filename=export.pdf")
    pipeline(source, destination, (err) => next(err))
  } catch (error) {
    next(error)
  }
})

export default filesRouter
