import mongoose from "mongoose"

const { Schema, model } = mongoose

/*
 {
        "_id": "5d925e677360c41e0046d1f5",  //server generated
        "role": "CTO",
        "company": "Strive School",
        "startDate": "2019-06-16T22:00:00.000Z",
        "endDate": "2019-06-16T22:00:00.000Z", //could be null
        "description": "Doing stuff here and there",
        "area": "Berlin",
        "username": "admin",
        "createdAt": "2019-09-30T19:58:31.019Z",  //server generated
        "updatedAt": "2019-09-30T19:58:31.019Z",  //server generated
        "image": ... //server generated on upload, set a default here
    }
*/
const ExperienceSchema = new Schema(
  {
    role: {
      type: String,
      required: true,
    },
    company: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
    },
    description: {
      type: String,
    },
    area: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default:
        "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fyt3.ggpht.com%2F-MlnvEdpKY2w%2FAAAAAAAAAAI%2FAAAAAAAAAAA%2FtOyTWDyUvgQ%2Fs900-c-k-no-mo-rj-c0xffffff%2Fphoto.jpg&f=1&nofb=1",
    },
    profile: {
      type: Schema.Types.ObjectId,
      ref: "Profile",
      default: "60cc390714e1940015400b79",
    },
  },
  { timestamps: true }
)

export default model("Experience", ExperienceSchema)
