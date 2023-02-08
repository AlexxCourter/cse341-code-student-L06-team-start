const Joi = require('@hapi/joi');

const idSchema = Joi.object({
    _id: Joi.string().alphanum().required()
});

const contactSchema = Joi.object({
    firstName: Joi.string().pattern(/^[a-zA-Z]+$/).lowercase().required(),
    lastName: Joi.string().pattern(/^[a-zA-Z]+$/).lowercase().required(),
    email: Joi.string().email().lowercase().required(),
    favoriteColor: Joi.string().alphanum().lowercase().required(),
    birthday: Joi.string().required()
});

const contactUpdateSchema = Joi.object({
	firstName: Joi.string().pattern(/^[a-zA-Z]+$/).lowercase(),
	lastName: Joi.string().pattern(/^[a-zA-Z]+$/).lowercase(),
	email: Joi.string().email().lowercase(),
	favoriteColor: Joi.string().alphanum().lowercase(),
	birthday: Joi.string()
});

module.exports = {
    idSchema,
    contactSchema,
    contactUpdateSchema
};