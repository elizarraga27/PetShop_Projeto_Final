const express = require("express");
const petSchema = require("../models/pet");

const router = express.Router();

//get all pets
router.get('/pets', (req,res) => {
    petSchema
    .find()
    .populate('tutor')
    .then((data) => res.status(200).json(data))
    .catch((err) => res.status(400).json({message: err}));
});

// create pet
router.post('/pets', async (req,res) => {
    const pet = petSchema(req.body);
    try{
        const newPet = await pet.save(pet)
        res.status(200).json(newPet)
    }
   
    catch(err){
        if(err.name == "ValidationError"){
            res.status(400).json({message: err})
            return;
        }
        if(err.code == 11000){
            res.status(400).send('numero de pet já existe')
            return;
        }
        else{
            res.status(500).json({message: err});
        }

    } 
});


//get pet
router.get('/pets/:id', (req,res) => {
    const { id } = req.params;
    petSchema
    .findById(id)
    .populate('tutor')
    .then((data) => res.status(200).json(data))
    .catch((err) => res.status(400).json({message: err}));
});

//Get pet pela Cpf do tutor
router.get('/pets/cpf/:cpf', (req,res) => {
    const {cpf}  = req.params;
    petSchema
    .findOne({ cpf: cpf})
    .populate('tutor')
    .then((data) => res.json(data))
    .catch((err) => res.json({message: err}));
});

//Get pet pelo numero do pet
router.get('/pets/nroPet/:nroPet', (req,res) => {
    const {nroPet}  = req.params;
    petSchema
    .findOne({ nroPet: nroPet})
    .populate('tutor')
    .then((data) => res.json(data))
    .catch((err) => res.json({message: err}));
});

//update pet pela id
router.put('/pets/:id', (req,res) => {
    const { id } = req.params;
    const { nroPet, nome, idade, peso, raça, tipo, tutor } = req.body;
    petSchema
    .updateOne({ _id: id }, { $set: { nroPet, nome, idade, peso, raça, tipo, tutor }})
    .then((data) => res.status(200).json(data))
    .catch((err) => res.status(400).json({message: err}));
});

//update pet pela cpf do tutor
router.put('/pets/cpf/:cpf', (req,res) => {
    const { cpf } = req.params;
    const { nroPet, nome, idade, peso, raça, tipo, tutor } = req.body;
    petSchema
    .updateOne({ cpf: cpf }, { $set: { nroPet, nome, idade, peso, raça, tipo, tutor }})
    .then((data) => res.status(200).json(data))
    .catch((err) => res.status(400).json({message: err}));
});

//update pet pelo numero de pet
router.put('/pets/nroPet/:nroPet', (req,res) => {
    const { nroPet } = req.params;
    const {nome, idade, peso, raça, tipo, tutor } = req.body;
    petSchema
    .updateOne({ nroPet: nroPet }, { $set: {nome, idade, peso, raça, tipo, tutor }})
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

//delete pelo cpf
router.delete('/pets/cpf/:cpf', (req,res) => {
    const {cpf}  = req.params;
    petSchema
    .remove({ cpf: cpf})
    .then((data) => res.json(data))
    .catch((err) => res.json({message: err}));
});

//delete pelo numero de pet
router.delete('/pets/nroPet/:nroPet', (req,res) => {
    const {nroPet}  = req.params;
    petSchema
    .remove({ nroPet: nroPet})
    .then((data) => res.json(data))
    .catch((err) => res.json({message: err}));
});


module.exports = router;