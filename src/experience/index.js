import express from 'express';
import ExperienceModel from './schema.js';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

import { parse } from 'json2csv';
import { pipeline } from 'stream';
import multer from 'multer';

const cloudinaryStorage = new CloudinaryStorage({
	cloudinary,
	params: {
		folder: 'Products-Images',
	},
});

const experienceRoutes = express.Router(); //express constructor to create router

experienceRoutes.get('/', async (req, res, next) => {
	try {
		const experiences = await ExperienceModel.find({}).populate('profile');
		res.status(200).send(experiences);
	} catch (error) {
		next(error);
	}
});

experienceRoutes.get('/:id', async (req, res, next) => {
	try {
		const experience = await ExperienceModel.findById(req.params.id).exec();
		res.status(200).send(experience);
	} catch (error) {
		next(error);
	}
});

experienceRoutes.post('/', async (req, res, next) => {
	try {
		const newExperience = await ExperienceModel.create(req.body);
		res.status(201).send(newExperience);
	} catch (error) {
		console.log(error);
		next(error);
	}
});
experienceRoutes.put('/:id', async (req, res, next) => {
	try {
		const modifiedExperience = await ExperienceModel.findByIdAndUpdate(
			req.params.id,
			req.body,
			{ new: true, runValidators: true }
		);
		res.send(modifiedExperience);
	} catch (error) {
		next(error);
	}
});
experienceRoutes.delete('/:id', async (req, res, next) => {
	try {
		const deletedExperience = await ExperienceModel.findByIdAndDelete(
			req.params.id
		);
		res.status(200).send(deletedExperience);
	} catch (error) {
		next(error);
	}
});

experienceRoutes.post(
	'/:id/picture',
	multer({ storage: cloudinaryStorage }).single('expPicture'),
	async (req, res, next) => {
		try {
			const experiencePicture = await ExperienceModel.findByIdAndUpdate(
				req.params.id,
				{ image: req.file.path },
				{ runValidators: true, new: true }
			);

			if (experiencePicture) {
				res.send(experiencePicture);
			} else {
				next(
					createError(404, {
						message: `experience ${req.params.id} not found`,
					})
				);
			}
		} catch (error) {
			next(error);
		}
	}
);

experienceRoutes.get('/:username/experiences/CSV', async (req, res, next) => {
	try {
		const allExperiences = await ExperienceModel.find();

		const fields = [
			'_id',
			'role',
			'company',
			'startDate',
			'endDate',
			'description',
			'area',
		];
		const options = { fields };
		const csv = parse(allExperiences, options);
		console.log(csv);
		res.setHeader('Content-Disposition', 'attachment; filename = export.csv');
		res.send(csv);
	} catch (error) {
		console.log(error);
		next(error);
	}
});

export default experienceRoutes;
