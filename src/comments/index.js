import express from "express"
import createError from "http-errors"
import multer from "multer"
import { v2 as cloudinary } from "cloudinary"
import { CloudinaryStorage } from "multer-storage-cloudinary"
import ProfileModel from "./schema.js"
import PostModel from "../posts/schema.js"
import CommentModel from "../comments/schema.js"

const commentRouter = express.Router()

commentRouter.post("/", async (req, res, next) => {
  try {
    const newComment = new CommentModel(req.body)
    const { _id } = await newComment.save()
    const post = await PostModel.findById(req.body.post)
    post.comments.push(newComment)
    res.status(201).send(_id)
  } catch (error) {
    console.log(error)
    next(createError(500, "An error occurred while saving new comment"))
  }
})

commentRouter.get("/", async (req, res, next) => {
  try {
    const comments = await CommentModel.find().populate(["user", "post"])
    res.send(comments)
  } catch (error) {
    console.log(error)
    next(createError(500, "An error occurred while getting comments"))
  }
})

commentRouter.get("/:id", async (req, res, next) => {
  try {
    const comment = await CommentModel.findById(req.params.id)
    if (comment) {
      res.send(comment)
    } else {
      next(createError(404, `comment ${req.params.id} not found`))
    }
  } catch (error) {
    console.log(error)
    next(createError(500, "An error occurred while saving new comment"))
  }
})

commentRouter.put("/:id", async (req, res, next) => {
  try {
    const modifiedComment = await CommentModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        runValidators: true,
        new: true,
      }
    )
    if (modifiedComment) {
      res.send(modifiedComment)
    } else {
      next(createError(404, `Comment ${req.params.id} not found`))
    }
  } catch (error) {
    console.log(error)
    next(createError(500, "An error occurred while modifying a Comment"))
  }
})

commentRouter.delete("/:id", async (req, res, next) => {
  try {
    const comment = await CommentModel.findByIdAndDelete(req.params.id)
    if (comment) {
      res.send(`${comment._id} comment has been deleted`)
    } else {
      next(createError(404, `comment ${req.params.id} not found`))
    }
  } catch (error) {
    console.log(error)
    next(createError(500, "An error occurred while deleting a comment"))
  }
})

export default commentRouter
