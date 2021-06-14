import mongoose from "mongoose"

const { Schema, model } = mongoose

const PostSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    cover: {
      type: String,
    },
    readTime: {
      value: {
        type: Number,
      },
      unit: {
        type: String,
      },
    },
    author: {
      name: {
        type: String,
      },
      avatar: {
        type: String,
      },
    },
    content: {
      type: String,
      required: true,
    },
    author: [{ type: Schema.Types.ObjectId, required: true, ref: "Author" }],
    likedBy: [{ type: Schema.Types.ObjectId, ref: "Author" }],
    comments: [
      {
        author: { type: Schema.Types.ObjectId, required: true, ref: "Author" },
        content: String,
      },
    ],
  },
  { timestamps: true }
)

export default model("Post", PostSchema)
