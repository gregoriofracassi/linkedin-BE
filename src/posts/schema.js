import mongoose from "mongoose"
import createError from "http-errors"

const { Schema, model } = mongoose

const PostSchema = new Schema({
  text: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "Profile",
    required: true,
    default: "60cc390714e1940015400b79",
  },
  username: {
    type: String,
  },
  image: {
    type: String,
    deafult:
      "https://upload.wikimedia.org/wikipedia/commons/d/de/Windows_live_square.JPG",
  },
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
})

PostSchema.post("validate", function (error, doc, next) {
  if (error) {
    const err = createError(400, error)
    next(err)
  } else {
    next()
  }
})

export default model("Post", PostSchema)
