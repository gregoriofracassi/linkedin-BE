import express from "express"
import uniqid from "uniqid"
import { bodyValidator } from "./validation.js"
import { validationResult } from "express-validator"
import createError from "http-errors"
import { getPosts, writePosts } from "../lib/fs-tools.js"
import multer from "multer"
import { writeAuthorImg, writePostCover } from "../lib/fs-tools.js"
import { generatePDFStream } from "../lib/pdf.js"
import { pipeline } from "stream"
import PostModel from "./schema.js"
import q2m from "query-to-mongo"

const postsRouter = express.Router()

postsRouter.get("/", async (req, res, next) => {
  try {
    const query = q2m(req.query)
    console.log(query)
    const total = await PostModel.countDocuments(query.criteria)
    const posts = await PostModel.find(query.criteria, query.options.fields)
      .populate(["author", "likedBy"])
      .sort(query.options.sort)
      .skip(query.options.skip)
      .limit(query.options.limit)
    res.send({ link: query.links("/posts", total), total, posts })
  } catch (error) {
    console.log(error)
    next(createError(500, "An error occurred while getting post"))
  }
})

postsRouter.post("/", async (req, res, next) => {
  try {
    const newPost = new PostModel(req.body)
    const response = await newPost.save()
    res.status(201).send(response._id)
  } catch (error) {
    console.log(error)
    if (error.name === "ValidationError") {
      next(createError(400, error))
    } else {
      next(createError(500, error))
    }
  }
})

postsRouter.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id
    const post = await PostModel.findById(id).populate([
      "author",
      "likedBy",
      "comments.author",
    ])
    if (post) {
      res.send(post)
    } else {
      next(createError(404, `Post ${req.params.id} not found`))
    }
  } catch (error) {
    console.log(error)
    next(createError(500, "An error occurred while getting post"))
  }
})

postsRouter.put("/:id", async (req, res, next) => {
  try {
    const post = await PostModel.findByIdAndUpdate(req.params.id, req.body, {
      runValidators: true,
      new: true,
    })
    if (post) {
      res.send(post)
    } else {
      next(createError(404, `Post ${req.params.id} not found`))
    }
  } catch (error) {
    console.log(error)
    next(createError(500, "An error occurred while modifying post"))
  }
})

postsRouter.delete("/:id", async (req, res, next) => {
  try {
    const post = await PostModel.findByIdAndDelete(req.params.id)
    if (post) {
      res.status(204).send(`Succesfully deleted post ${req.params.id}`)
    } else {
      next(createError(404, `Post ${req.params.id} not found`))
    }
  } catch (error) {
    console.log(error)
    next(createError(500, "An error occurred while deleting the post"))
  }
})

postsRouter.post("/:id/comments", async (req, res, next) => {
  try {
    console.log("adding comment")
    const comment = req.body
    const post = await PostModel.findById(req.params.id)
    if (post) {
      const updatePostComments = await PostModel.findByIdAndUpdate(
        req.params.id,
        {
          $push: {
            comments: comment,
          },
        },
        {
          runValidators: true,
          new: true,
        }
      )
      res.status(201).send(updatePostComments)
    } else {
      next(createError(404, "post not found"))
    }
  } catch (error) {
    next(createError(500, "an error occurred while adding a comment"))
  }
})

postsRouter.get("/:id/comments", async (req, res, next) => {
  try {
    const post = await PostModel.findById(req.params.id, { comments: 1 })
    if (post) {
      res.send(post.comments)
    } else {
      next(404, "no post found with this id")
    }
  } catch (error) {
    console.log(error)
    next(createError(500, "an error occurred while getting posts comments"))
  }
})

postsRouter.get("/:id/comments/:commentId", async (req, res, next) => {
  try {
    const post = await PostModel.findOne(
      {
        _id: req.params.id,
      },
      {
        comments: {
          $elemMatch: { _id: req.params.commentId },
        },
      }
    )
    if (post) {
      const { comments } = post
      if (comments && comments.length > 0) {
        res.send(comments[0])
      } else {
        next(createError(404, "no comments found for this post"))
      }
    } else {
      next(createError(404, "no posts found with this id"))
    }
  } catch (error) {
    console.log(error)
    next(
      createError(
        500,
        "An error occurred while retrievieng a comment from the given post"
      )
    )
  }
})

postsRouter.put("/:id/comments/:commentId", async (req, res, next) => {
  try {
    const post = await PostModel.findOneAndUpdate(
      {
        _id: req.params.id,
        "comments._id": req.params.commentId,
      },
      {
        $set: { "comments.$": req.body },
      },
      {
        runValidators: true,
        new: true,
      }
    )
    if (post) {
      res.send(post)
    } else {
      next(createError(404, "no post found with this id"))
    }
  } catch (error) {
    console.log(error)
    next(
      createError(
        500,
        "an error occurred while updating a comment on the given post"
      )
    )
  }
})

postsRouter.delete("/:id/comments/:commentId", async (req, res, next) => {
  try {
    const post = await PostModel.findByIdAndUpdate(
      req.params.id,
      {
        $pull: {
          comments: { _id: req.params.commentId },
        },
      },
      {
        new: true,
      }
    )
    if (post) {
      res.send(post)
    } else {
      next(createError(404, "No post found with this id"))
    }
  } catch (error) {
    console.log(error)
    next(
      createError(
        500,
        "an error occurred while deleting a comment for a given post"
      )
    )
  }
})

postsRouter.post("/:id/like", async (req, res, next) => {
  try {
    console.log("adding like")
    const post = await PostModel.findById(req.params.id)
    if (post) {
      const updatedPost = await PostModel.findByIdAndUpdate(
        req.params.id,
        {
          $push: {
            likedBy: req.body.id,
          },
        },
        {
          runValidators: true,
          new: true,
        }
      )
      res.status(201).send({ totalPostLikes: updatedPost.likedBy.length })
    } else {
      next(createError(404, "no posts found with this id"))
    }
  } catch (error) {
    console.log(error)
    next(createError(500, "an error occurred while liking this post"))
  }
})

// postsRouter.post("/:id/comments", async (req, res, next) => {
//   try {
//     const posts = await getPosts()
//     const post = posts.find((p) => p._id === req.params.id)
//     const comments = post.comments
//     const newComment = { ...req.body, createdAt: new Date() }
//     comments.push(newComment)
//     const remainPosts = posts.filter((p) => p._id !== req.params.id)
//     post.comments = comments
//     remainPosts.push(post)
//     await writePosts(remainPosts)

//     res.send(remainPosts)
//   } catch (error) {
//     console.log(error)
//     next(error)
//   }
// })

// postsRouter.post("/", bodyValidator, async (req, res, next) => {
//   try {
//     const errors = validationResult(req)
//     if (!errors.isEmpty()) {
//       next(createError(400, { errorList: errors }))
//     } else {
//       const posts = await getPosts()
//       const newPost = {
//         ...req.body,
//         _id: uniqid(),
//         createdAt: new Date(),
//         comments: [],
//       }
//       posts.push(newPost)
//       await writePosts(posts)

//       res.status(201).send({ id: newPost._id })
//     }
//   } catch (error) {
//     console.log(error)
//     next(error)
//   }
// })

// postsRouter.get("/:id/comments", async (req, res, next) => {
//   try {
//     const posts = await getPosts()
//     const post = posts.find((p) => p._id === req.params.id)

//     res.send(post.comments)
//   } catch (error) {
//     console.log(error)
//     next(error)
//   }
// })

// postsRouter.post(
//   "/:id/uploadCover",
//   multer().single("cover"),
//   async (req, res, next) => {
//     try {
//       console.log("trying to upload")
//       const posts = await getPosts()
//       const post = posts.find((p) => p._id === req.params.id)
//       await writePostCover(req.file.originalname, req.file.buffer)
//       post.cover = `http://localhost:3001/img/postCover/${req.file.originalname}`
//       const remainPosts = posts.filter((p) => p._id !== req.params.id)
//       remainPosts.push(post)
//       await writePosts(remainPosts)
//       res.send()
//     } catch (error) {
//       console.log(error)
//       next(error)
//     }
//   }
// )

// postsRouter.get("/:id/pdfDownload", async (req, res, next) => {
//   const posts = await getPosts()
//   const post = posts.find((p) => p._id === req.params.id)
//   try {
//     const source = generatePDFStream(post)
//     const destination = res
//     res.setHeader("Content-Disposition", "attachment; filename=export.pdf")
//     pipeline(source, destination, (err) => next(err))
//   } catch (error) {
//     next(error)
//   }
// })

export default postsRouter
