import mongoose from "mongoose"

// const { Schema, model } = mongoose

const Schema = mongoose.Schema
const model = mongoose.model

const CommentSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "Profile",
      required: true,
      default: "60cc390714e1940015400b79",
    },
    comment: {
      type: String,
      required: true,
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
  },
  { timestamps: true }
)

export default model("Comment", CommentSchema)
