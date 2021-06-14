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

    const profiles = await ProfileModel.find({ name: "Dan" })
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
    console.log("our request", req.query)
    const profile = await ProfileModel.findById(req.params.id)
    if (profile) {
      res.send(profile)
    } else {
      next(createError(404, `Profile ${req.params.id} not found`))
    }
  } catch (error) {
    console.log(error)
    next(createError(500, "An error occurred while saving new author"))
  }
})

profileRouter.put("/:id", async (req, res, next) => {
  try {
    const modifiedProfile = await ProfileModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        runValidators: true,
        new: true,
      }
    )
    if (modifiedProfile) {
      res.send(modifiedProfile)
    } else {
      next(createError(404, `Author ${req.params.id} not found`))
    }
  } catch (error) {
    console.log(error)
    next(createError(500, "An error occurred while modifying an author"))
  }
})

profileRouter.delete("/:id", async (req, res, next) => {
  try {
    const profile = await ProfileModel.findByIdAndDelete(req.params.id)
    if (profile) {
      res.send(profile)
    } else {
      next(createError(404, `Author ${req.params.id} not found`))
    }
  } catch (error) {
    console.log(error)
    next(createError(500, "An error occurred while deleting an author"))
  }
})

export default profileRouter
