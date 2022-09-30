const express = require("express");
const clienteSchema = require("../models/cliente");

const router = express.Router();

//get all clientes
router.get('/clientes', (req,res) => {
    clienteSchema
    .find()
    .populate('pets')
    .then((data) => res.json(data))
    .catch((err) => res.json({message: err}));
});

//get a cliente
router.get('/clientes/:id', (req,res) => {
    const { id } = req.params;
    clienteSchema
    .findById(id)
    .populate('pets')
    .then((data) => res.json(data))
    .catch((err) => res.json({message: err}));
});

// create cliente
router.post('/clientes', (req,res) => {
    const cliente = clienteSchema(req.body);
    cliente
    .save()
    .then((data) => res.json(data))
    .catch((err) => res.json({message: err}));
});

//update a cliente
router.put('/clientes/:id', (req,res) => {
    const { id } = req.params;
    const {nome, sobrenome, cpf, telefone, email, endereço, pets } = req.body;
    clienteSchema
    .updateOne({ _id: id }, { $set: {nome, sobrenome, cpf, telefone, email, endereço, pets }})
    .then((data) => res.json(data))
    .catch((err) => res.json({message: err}));
});

//delete a cliente
router.delete('/clientes/:id', (req,res) => {
    const { id } = req.params;
    clienteSchema
    .remove({ _id: id })
    .then((data) => res.json(data))
    .catch((err) => res.json({message: err}));
});



module.exports = router;