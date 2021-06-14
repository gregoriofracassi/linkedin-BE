import mongoose from "mongoose"
import createError from "http-errors"

const { Schema, model } = mongoose

const AuthorSchema = new Schema({
  name: { type: String, required: true },
  surname: { type: String, required: true },
})

AuthorSchema.post("validate", function (error, doc, next) {
  if (error) {
    const err = createError(400, error)
    next(err)
  } else {
    next()
  }
})

export default model("Author", AuthorSchema)
