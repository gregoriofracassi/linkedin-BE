import mongoose from 'mongoose';
import createError from 'http-errors';

const { Schema, model } = mongoose;
// const model = mongoose.model
// const Schema = mongoose.Schema

const ProfileSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	surname: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	bio: {
		type: String,
		required: true,
	},
	title: {
		type: String,
		required: true,
	},
	image: {
		type: String,
	},
	username: {
		type: String,
		required: true,
	},
});

ProfileSchema.post('validate', function (error, doc, next) {
	if (error) {
		const err = createError(400, error);
		next(err);
	} else {
		next();
	}
});

export default model('Profile', ProfileSchema);

//  {
//       "_id": "5d84937322b7b54d848eb41b", //server generated
//       "name": "Diego",
//       "surname": "Banovaz",
//       "email": "diego@strive.school",
//       "bio": "SW ENG",
//       "title": "COO @ Strive School",
//       "area": "Berlin",
//       "image": ..., //server generated on upload, set a default here
//       "username": "admin",
//       "createdAt": "2019-09-20T08:53:07.094Z", //server generated
//       "updatedAt": "2019-09-20T09:00:46.977Z", //server generated
//   }
