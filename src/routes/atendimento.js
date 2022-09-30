const express = require("express");
const atendimento = require("../models/atendimento");
const atendimentoSchema = require("../models/atendimento");
const cliente = require("../models/cliente");

const router = express.Router();

//get all clientes
//router.get('/atendimentos', (req,res) => {
   // atendimentoSchema
   // .find()
   // .then((data) => res.json(data))
    //.catch((err) => res.json({message: err}));
//});

// create cliente
router.post('/atendimentos', (req,res) => {
    const atendimento = atendimentoSchema(req.body);
    atendimento
    .save()
    .then((data) => res.json(data))
    .catch((err) => res.json({message: err}));
});
//Get All atendimentos
router.get('/atendimentos', (req,res) => {

atendimento.
  find().
  populate('cliente')
  .populate('pet')
  .populate('produto')
  .then((data) => res.json(data))
  .catch((err) => res.json({message: err}));
  
});

//get Id atendimento

router.get('/atendimentos/:id', (req,res) => {
  const { id } = req.params;
  atendimentoSchema
  .findById(id)
  .populate('cliente')
  .populate('pet')
  .populate('produto')
  .populate('serviço')
  .then((data) => res.status(200).json(data))
  .catch((err) => res.status(400).json({message: err}));
});

//Update Atendimento

router.put('/atendimentos/:id', (req,res) => {
  const { id } = req.params;
  const {cliente, pet, produto, serviço } = req.body;
  atendimentoSchema
  .updateOne({ _id: id }, { $set: {cliente, pet, produto, serviço }})
  .then((data) => res.json(data))
  .catch((err) => res.json({message: err}));
});

//delete atendimento
router.delete('/atendimentos/:id', (req,res) => {
  const { id } = req.params;
  atendimentoSchema
  .remove({ _id: id })
  .then((data) => res.status(200).json(data))
  .catch((err) => res.status(400).json({message: err}));
});



module.exports = router;