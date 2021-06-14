import express from "express"
import q2m from "query-to-mongo"
import createError from "http-errors"

import ProfileModel from "./schema.js"

const profileRouter = express.Router()

profileRouter.post("/", async (req, res, next) => {
  try {
    const newProfile = new ProfileModel(req.body)
    const { _id } = await newProfile.save()

    res.status(201).send(_id)
  } catch (error) {
    console.log(error)
    next(createError(500, "An error occurred while saving new author"))
  }
})

profileRouter.get("/", async (req, res, next) => {
  try {
    const query = q2m(req.query)
    const total = await ProfileModel.countDocuments(query.criteria)

    const profiles = await ProfileModel.find(
      query.criteria,
      query.options.fields
    )
      .skip(query.options.skip)
      .limit(query.options.limit)
      .sort(query.options.sort)

    res.send({ links: query.links("/profile", total), total, profiles })
  } catch (error) {
    console.log(error)
    next(error)
  }
})

profileRouter.get("/:id", async (req, res, next) => {
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

profileRouter.put("/:id", async (req, res, next) => {
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

profileRouter.delete("/:id", async (req, res, next) => {
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

export default profileRouter
