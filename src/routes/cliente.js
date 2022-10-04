const express = require("express");
const clienteSchema = require("../models/cliente");

const router = express.Router();

//get all clientes
router.get('/clientes', (req,res) => {
    clienteSchema
    .find()
    .then((data) => res.json(data))
    .catch((err) => res.json({message: err}));
});

//get a cliente
router.get('/clientes/:id', (req,res) => {
    const { id } = req.params;
    clienteSchema
    .findById(id)
    .then((data) => res.json(data))
    .catch((err) => res.json({message: err}));
});
//get pelo cpf
router.get('/clientes/cpf/:cpf', (req,res) => {
    const {cpf}  = req.params;
    clienteSchema
    .findOne({ cpf: cpf})
    .then((data) => res.json(data))
    .catch((err) => res.json({message: err}));
});


// create cliente
router.post('/clientes', async (req,res) => {
    const cliente = clienteSchema(req.body);
    try{
        const newCliente = await cliente.save(cliente)
        res.status(200).json(newCliente)
    }
   
    catch(err){
        if(err.name == "ValidationError"){
            res.status(400).json({message: err})
            return;
        }
        else{
            res.status(500).json({message: err});
        }

    } 
});

//update a cliente
router.put('/clientes/:id', (req,res) => {
    const { id } = req.params;
    const {nome, sobrenome, cpf, telefone, email, endereço } = req.body;
    clienteSchema
    .updateOne({ _id: id }, { $set: {nome, sobrenome, cpf, telefone, email, endereço }})
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

//delete pelo cpf
router.delete('/clientes/cpf/:cpf', (req,res) => {
    const {cpf}  = req.params;
    clienteSchema
    .remove({ cpf: cpf})
    .then((data) => res.json(data))
    .catch((err) => res.json({message: err}));
});






module.exports = router;