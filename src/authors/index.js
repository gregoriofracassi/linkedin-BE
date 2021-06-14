import express from "express"
import q2m from "query-to-mongo"
import createError from "http-errors"

import AuthorModel from "./schema.js"

const authorsRouter = express.Router()

authorsRouter.post("/", async (req, res, next) => {
  try {
    const newAuthor = new AuthorModel(req.body)
    const { _id } = await newAuthor.save()

    res.status(201).send(_id)
  } catch (error) {
    console.log(error)
    next(createError(500, "An error occurred while saving new author"))
  }
})

authorsRouter.get("/", async (req, res, next) => {
  try {
    const query = q2m(req.query)
    const total = await AuthorModel.countDocuments(query.criteria)

    const authors = await AuthorModel.find(query.criteria, query.options.fields)
      .skip(query.options.skip)
      .limit(query.options.limit)
      .sort(query.options.sort)

    res.send({ links: query.links("/author", total), total, authors })
  } catch (error) {
    console.log(error)
    next(error)
  }
})

authorsRouter.get("/:id", async (req, res, next) => {
  try {
    const author = await AuthorModel.findById(req.params.id)
    if (author) {
      res.send(author)
    } else {
      next(createError(404, `Author ${req.params.id} not found`))
    }
  } catch (error) {
    console.log(error)
    next(error)
  }
})

authorsRouter.put("/:id", async (req, res, next) => {
  try {
    const modifiedAuthor = await AuthorModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        runValidators: true,
        new: true,
      }
    )
    if (modifiedAuthor) {
      res.send(modifiedAuthor)
    } else {
      next(createError(404, `Author ${req.params.id} not found`))
    }
  } catch (error) {
    console.log(error)
    next(error)
  }
})

authorsRouter.delete("/:id", async (req, res, next) => {
  try {
    const author = await AuthorModel.findByIdAndDelete(req.params.id)
    if (author) {
      res.send(author)
    } else {
      next(createError(404, `Author ${req.params.id} not found`))
    }
  } catch (error) {
    console.log(error)
    next(error)
  }
})

export default authorsRouter
