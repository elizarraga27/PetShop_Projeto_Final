const express = require("express");
const produtoSchema = require("../models/produtos");

const router = express.Router();

//get all produtos
router.get('/produtos', (req,res) => {
    produtoSchema
    .find()
    .then((data) => res.status(200).json(data))
    .catch((err) => res.status(400).json({message: err}));
});

// create produto
router.post('/produtos', (req,res) => {
    const produto = produtoSchema(req.body);
    produto
    .save()
    .then((data) => res.status(200).json(data))
    .catch((err) => res.status(400).json({message: err}));
});

//get produto
router.get('/produtos/:id', (req,res) => {
    const { id } = req.params;
    produtoSchema
    .findById(id)
    .then((data) => res.status(200).json(data))
    .catch((err) => res.status(400).json({message: err}));
});

//update produto
router.put('/produtos/:id', (req,res) => {
    const { id } = req.params;
    const {nome, valor, descrição } = req.body;
    produtoSchema
    .updateOne({ _id: id }, { $set: {nome, valor, descrição }})
    .then((data) => res.status(200).json(data))
    .catch((err) => res.status(400).json({message: err}));
});

//delete serviço
router.delete('/produtos/:id', (req,res) => {
    const { id } = req.params;
    produtoSchema
    .remove({ _id: id })
    .then((data) => res.status(200).json(data))
    .catch((err) => res.status(400).json({message: err}));
});


module.exports = router;