import { body } from "express-validator"

export const bodyValidator = [
  body("title").exists().withMessage("theres no title"),
  body("category").exists().withMessage("theres no category"),
  body("cover").exists().withMessage("please add an image as cover"),
]
