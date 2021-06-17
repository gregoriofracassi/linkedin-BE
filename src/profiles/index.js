import express from "express"
import q2m from "query-to-mongo"
import createError from "http-errors"
import multer from "multer"
import { v2 as cloudinary } from "cloudinary"
import { CloudinaryStorage } from "multer-storage-cloudinary"
import ProfileModel from "./schema.js"
import ExperienceModel from "../experience/schema.js"
import { pipeline } from "stream"
import { generatePDFStream } from "../lib/pdf.js"

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
    next(createError(500, "An error occurred while getting profiles"))
  }
})

profileRouter.get("/:id", async (req, res, next) => {
  try {
    const profile = await ProfileModel.findById(req.params.id)
    if (profile) {
      res.send(profile)
    } else {
      next(createError(404, `Profile ${req.params.id} not found`))
    }
  } catch (error) {
    console.log(error)
    next(createError(500, "An error occurred while saving new profile"))
  }
})

profileRouter.get("/:id/experiences", async (req, res, next) => {
  try {
    const profile = await ProfileModel.findById(req.params.id)
    if (profile) {
      const experiences = await ExperienceModel.find({ profile: req.params.id })
      res.send(experiences)
    } else {
      next(createError(404, `Profile ${req.params.id} not found`))
    }
  } catch (error) {
    console.log(error)
    next(createError(500, "An error occurred while saving new profile"))
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
      next(createError(404, `Profile ${req.params.id} not found`))
    }
  } catch (error) {
    console.log(error)
    next(createError(500, "An error occurred while modifying a profile"))
  }
})

profileRouter.delete("/:id", async (req, res, next) => {
  try {
    const profile = await ProfileModel.findByIdAndDelete(req.params.id)
    if (profile) {
      res.send(profile)
    } else {
      next(createError(404, `Profile ${req.params.id} not found`))
    }
  } catch (error) {
    console.log(error)
    next(createError(500, "An error occurred while deleting a profile"))
  }
})

const cloudinaryStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "Linkedin-clone",
  },
})

profileRouter.post(
  "/:id/imageupload",
  multer({ storage: cloudinaryStorage }).single("avatar"),
  async (req, res, next) => {
    try {
      const profile = await ProfileModel.findByIdAndUpdate(
        req.params.id,
        { image: req.file.path },
        { runValidators: true, new: true }
      )
      if (profile) {
        res.send(profile)
      } else {
        next(
          createError(404, { message: `profile ${req.params.id} not found` })
        )
      }
    } catch (error) {
      next(createError(500, "An error occurred while uploading profile avatar"))
    }
  }
)

profileRouter.get("/:id/pdfDownload", async (req, res, next) => {
  try {
    const profile = await ProfileModel.findById(req.params.id)
    const experiences = await ExperienceModel.find({ profile: req.params.id })
    console.log(experiences)
    const source = generatePDFStream(profile, experiences)
    const destination = res
    res.setHeader("Content-Disposition", "attachment; filename=export.pdf")
    pipeline(source, destination, (err) => next(err))
  } catch (error) {
    next(error)
  }
})

export default profileRouter
