const express = require("express");
const petSchema = require("../models/pet");

const router = express.Router();

//get all pets
router.get('/pets', (req,res) => {
    petSchema
    .find()
    .then((data) => res.status(200).json(data))
    .catch((err) => res.status(400).json({message: err}));
});

// create pet
router.post('/pets', (req,res) => {
    const pet = petSchema(req.body);
    pet
    .save()
    .then((data) => res.status(200).json(data))
    .catch((err) => res.status(400).json({message: err}));
});

//get pet
router.get('/pets/:id', (req,res) => {
    const { id } = req.params;
    petSchema
    .findById(id)
    .then((data) => res.status(200).json(data))
    .catch((err) => res.status(400).json({message: err}));
});

//update pet
router.put('/pets/:id', (req,res) => {
    const { id } = req.params;
    const {nome, idade, Peso, raça, tipo } = req.body;
    petSchema
    .updateOne({ _id: id }, { $set: {nome, idade, Peso, raça, tipo }})
    .then((data) => res.status(200).json(data))
    .catch((err) => res.status(400).json({message: err}));
});

//delete a cliente
router.delete('/pets/:id', (req,res) => {
    const { id } = req.params;
    petSchema
    .remove({ _id: id })
    .then((data) => res.status(200).json(data))
    .catch((err) => res.status(400).json({message: err}));
});


module.exports = router;