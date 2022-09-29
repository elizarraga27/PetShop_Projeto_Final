const express = require("express");
const servicoSchema = require("../models/serviço");

const router = express.Router();

//get all serviços
router.get('/servicos', (req,res) => {
    servicoSchema
    .find()
    .then((data) => res.status(200).json(data))
    .catch((err) => res.status(400).json({message: err}));
});

// create serviço
router.post('/servicos', (req,res) => {
    const servico = servicoSchema(req.body);
    servico
    .save()
    .then((data) => res.status(200).json(data))
    .catch((err) => res.status(400).json({message: err}));
});

//get serviço
router.get('/servicos/:id', (req,res) => {
    const { id } = req.params;
    servicoSchema
    .findById(id)
    .then((data) => res.status(200).json(data))
    .catch((err) => res.status(400).json({message: err}));
});

//update serviço
router.put('/servicos/:id', (req,res) => {
    const { id } = req.params;
    const {nome, valor, descrição } = req.body;
    servicoSchema
    .updateOne({ _id: id }, { $set: {nome, valor, descrição }})
    .then((data) => res.status(200).json(data))
    .catch((err) => res.status(400).json({message: err}));
});

//delete serviço
router.delete('/servicos/:id', (req,res) => {
    const { id } = req.params;
    servicoSchema
    .remove({ _id: id })
    .then((data) => res.status(200).json(data))
    .catch((err) => res.status(400).json({message: err}));
});


module.exports = router;