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
router.get('/atendimentos', (req,res) => {

atendimento.
  find().
  populate('cliente')
  .then((data) => res.json(data))
  .catch((err) => res.json({message: err}));
  
});

module.exports = router;