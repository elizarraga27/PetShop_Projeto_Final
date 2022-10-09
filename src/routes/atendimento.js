const express = require("express");
const atendimento = require("../models/atendimento");
const atendimentoSchema = require("../models/atendimento");
const cliente = require("../models/cliente");

const router = express.Router();


// create cliente
router.post('/atendimentos', async (req,res) => {
  const atendimento = atendimentoSchema(req.body);
  try{
      const newAtendimento = await atendimento.save(atendimento)
      res.status(200).json(newAtendimento)
  }
 
  catch(err){
      if(err.name == "ValidationError"){
          res.status(400).json({message: err})
          return;
      }
      if(err.code == 11000){
          res.status(400).send('numero de ordem já existe')
          return;
      }
      else{
          res.status(500).json({message: err});
      }

  } 
});
//Get All atendimentos
router.get('/atendimentos', (req,res) => {

atendimento
  .find()
  .populate({path:'cliente', select: 'nome cpf'})
  .populate({path:'pet', select:'nome tipo'})
  .populate({path:'produto', select:'nome valor'})
  .populate({path:'serviço', select:'nome valor'})
  .then((data) => res.json(data))
  .catch((err) => res.json({message: err}));
  
});

//get pelo cpf
router.get('/atendimentos/cpf/:cpf', (req,res) => {
  const {cpf}  = req.params;
  atendimentoSchema
  .findOne({ cpf: cpf})
  .populate({path:'cliente', select: 'nome cpf'})
  .populate({path:'pet', select:'nome tipo'})
  .populate({path:'produto', select:'nome valor'})
  .populate({path:'serviço', select:'nome valor'})
  .then((data) => res.json(data))
  .catch((err) => res.json({message: err}));
});

//get Id atendimento

router.get('/atendimentos/:id', (req,res) => {
  const { id } = req.params;
  atendimentoSchema
  .findById(id)
  .populate({path:'cliente', select: 'nome cpf'})
  .populate({path:'pet', select:'nome tipo'})
  .populate({path:'produto', select:'nome valor'})
  .populate({path:'serviço', select:'nome valor'})
  .then((data) => res.status(200).json(data))
  .catch((err) => res.status(400).json({message: err}));
});

//get pelo numero de ordem
router.get('/atendimentos/nroOrdem/:nroOrdem', (req,res) => {
  const { nroOrdem }  = req.params;
  atendimentoSchema
  .findOne({ nroOrdem: nroOrdem})
  .populate({path:'cliente', select: 'nome cpf'})
  .populate({path:'pet', select:'nome tipo'})
  .populate({path:'produto', select:'nome valor'})
  .populate({path:'serviço', select:'nome valor'})
  .then((data) => res.json(data))
  .catch((err) => res.json({message: err}));
});

//Update Atendimento

router.put('/atendimentos/:id', (req,res) => {
  const { id } = req.params;
  const { nroOrdem, cliente, pet, produto, serviço } = req.body;
  atendimentoSchema
  .updateOne({ _id: id }, { $set: { nroOrdem, cliente, pet, produto, serviço }})
  .then((data) => res.json(data))
  .catch((err) => res.json({message: err}));
});

//update pelo cpf
router.put('/atendimentos/cpf/:cpf', (req,res) => {
  const { cpf } = req.params;
  const { nroOrdem, cliente, pet, produto, serviço } = req.body;
  atendimentoSchema
  .updateOne({ cpf: cpf }, { $set: { nroOrdem, cliente, pet, produto, serviço }})
  .then((data) => res.json(data))
  .catch((err) => res.json({message: err}));
});

//update pelo numero de ordem
router.put('/atendimentos/nroOrdem/:nroOrdem', (req,res) => {
  const { nroOrdem } = req.params;
  const { cliente, pet, produto, serviço } = req.body;
  atendimentoSchema
  .updateOne({ nroOrdem: nroOrdem }, { $set: { cliente, pet, produto, serviço }})
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

//delete atendimento pelo cpf
router.delete('/atendimentos/cpf/:cpf', (req,res) => {
  const { cpf } = req.params;
  atendimentoSchema
  .remove({ cpf: cpf })
  .then((data) => res.status(200).json(data))
  .catch((err) => res.status(400).json({message: err}));
});

//delete atendimento pelo numero ordem
router.delete('/atendimentos/nroOrdem/:nroOrdem', (req,res) => {
  const { nroOrdem } = req.params;
  atendimentoSchema
  .remove({ nroOrdem: nroOrdem })
  .then((data) => res.status(200).json(data))
  .catch((err) => res.status(400).json({message: err}));
});



module.exports = router;