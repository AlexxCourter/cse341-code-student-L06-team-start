const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;
const { idSchema, contactSchema, contactUpdateSchema } = require('../validation/validation_schema');
require('express-async-errors');
const httpError = require('http-errors');

const getAll = async (req, res) => {
  const result = await mongodb.getDb().db('contacts').collection('contacts').find();
  result.toArray().then((lists) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(lists);
  });
};

const getSingle = async (req, res) => {
  let userId = req.params.id;
  try{
    //validate
    userId = await idSchema.validateAsync( { _id: userId} );
    userId = userId._id;
  } 
  catch (e) {
    throw new httpError(400, "Id is malformed.");
  }
  try {
    userId = new ObjectId(userId);
  }
  catch (e) {
    throw new httpError(400, e.message);
  }
  
  const result = await mongodb.getDb().db('contacts').collection('contacts').find({ _id: userId });
  result.toArray().then((lists) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(lists[0]);
  });
};

const createContact = async (req, res) => {
  let contact = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    favoriteColor: req.body.favoriteColor,
    birthday: req.body.birthday
  }; 

  console.log(contact);
  try {
    //validate
    contact = await contactSchema.validateAsync(contact);
  }
  catch (e) {
    throw new httpError(400, "Contact information is malformed.");
  }
  const response = await mongodb.getDb().db('contacts').collection('contacts').insertOne(contact);
  if (response.acknowledged) {
    res.status(201).json(response);
  } else {
    //res.status(500).json(response.error || 'Some error occurred while creating the contact.');
    throw new httpError(500, "Some error occurred while creating the contact.");
  }
};

const updateContact = async (req, res) => {
  let userId = req.params.id;
  try{
    //validate
    userId = await idSchema.validateAsync( { _id: userId} );
    userId = userId._id;
  } 
  catch (e) {
    throw new httpError(400, "Id is malformed.");
  }

  try {
    userId = new ObjectId(userId);
  }
  catch (e) {
    throw new httpError(400, e.message);
  }
  // be aware of updateOne if you only want to update specific fields
    let contact = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    favoriteColor: req.body.favoriteColor,
    birthday: req.body.birthday
  };
  try {
    contact = await contactUpdateSchema.validateAsync(contact);
  }
  catch (e) {
    throw new httpError(400, "Contact information is malformed.");
  }
  const response = await mongodb
    .getDb()
    .db('contacts')
    .collection('contacts')
    .replaceOne({ _id: userId }, contact);
  console.log(response);
  if (response.modifiedCount > 0) {
    res.status(204).send();
  } else {
    //res.status(500).json(response.error || 'Some error occurred while updating the contact.');
    throw new httpError(500, 'Some error occurred while updating the contact.');
  }
};

const deleteContact = async (req, res) => {
  let userId = req.params.id;
  try{
    //validate
    userId = await idSchema.validateAsync( { _id: userId} );
    userId = userId._id;
  } 
  catch (e) {
    throw new httpError(400, "Id is malformed.");
  }

  try {
    userId = new ObjectId(userId);
  }
  catch (e) {
    throw new httpError(400, e.message);
  }

  const response = await mongodb.getDb().db('contacts').collection('contacts').remove({ _id: userId }, true);
  console.log(response);
  if (response.deletedCount > 0) {
    res.status(204).send();
  } else {
    //res.status(500).json(response.error || 'Some error occurred while deleting the contact.');
    throw new httpError(500, 'Some error occurred while deleting the contact.');
  }
};

module.exports = {
  getAll,
  getSingle,
  createContact,
  updateContact,
  deleteContact
};
