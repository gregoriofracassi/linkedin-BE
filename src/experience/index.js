import express from 'express';
import ExperienceModel from './schema.js';
import q2m from 'query-to-mongo';

const experienceRoutes = express.Router(); //express constructor to create router

experienceRoutes.get('/', async (req, res, next) => {
	try {
		const experiences = await ExperienceModel.find({});
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
experienceRoutes.get('/', async (req, res, next) => {
	try {
	} catch (error) {
		next(error);
	}
});
experienceRoutes.get('/', async (req, res, next) => {
	try {
	} catch (error) {
		next(error);
	}
});

export default experienceRoutes;
