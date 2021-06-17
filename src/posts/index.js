import express from "express"
import q2m from "query-to-mongo"
import createError from "http-errors"
import multer from "multer"
import { v2 as cloudinary } from "cloudinary"
import { CloudinaryStorage } from "multer-storage-cloudinary"
import ProfileModel from "./schema.js"
import PostModel from "../posts/schema.js"

const postRouter = express.Router()

postRouter.post("/", async (req, res, next) => {
  try {
    const newPost = new PostModel(req.body)
    const { _id } = await newPost.save()

    res.status(201).send(_id)
  } catch (error) {
    console.log(error)
    next(createError(500, "An error occurred while saving new author"))
  }
})

postRouter.get("/", async (req, res, next) => {
  try {
    const query = q2m(req.query)
    const total = await PostModel.countDocuments(query.criteria)

    const posts = await PostModel.find(query.criteria, query.options.fields)
      .skip(query.options.skip)
      .limit(query.options.limit)
      .sort(query.options.sort)

    res.send({ links: query.links("/post", total), total, posts })
  } catch (error) {
    console.log(error)
    next(createError(500, "An error occurred while getting posts"))
  }
})

postRouter.get("/:id", async (req, res, next) => {
  try {
    console.log("our request", req.query)
    const post = await PostModel.findById(req.params.id)
    if (post) {
      res.send(post)
    } else {
      next(createError(404, `post ${req.params.id} not found`))
    }
  } catch (error) {
    console.log(error)
    next(createError(500, "An error occurred while saving new post"))
  }
})

postRouter.put("/:id", async (req, res, next) => {
  try {
    const modifiedPost = await PostModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        runValidators: true,
        new: true,
      }
    )
    if (modifiedPost) {
      res.send(modifiedPost)
    } else {
      next(createError(404, `Post ${req.params.id} not found`))
    }
  } catch (error) {
    console.log(error)
    next(createError(500, "An error occurred while modifying a Post"))
  }
})

postRouter.delete("/:id", async (req, res, next) => {
  try {
    const post = await PostModel.findByIdAndDelete(req.params.id)
    if (post) {
      res.send(post)
    } else {
      next(createError(404, `post ${req.params.id} not found`))
    }
  } catch (error) {
    console.log(error)
    next(createError(500, "An error occurred while deleting a post"))
  }
})

const cloudinaryStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "Linkedin-clone",
  },
})

postRouter.post(
  "/:id/imageupload",
  multer({ storage: cloudinaryStorage }).single("cover"),
  async (req, res, next) => {
    try {
      const post = await PostModel.findByIdAndUpdate(
        req.params.id,
        { image: req.file.path },
        { runValidators: true, new: true }
      )
      if (post) {
        res.send(post)
      } else {
        next(createError(404, { message: `post ${req.params.id} not found` }))
      }
    } catch (error) {
      next(createError(500, "An error occurred while uploading post avatar"))
    }
  }
)

export default postRouter
