const express = require("express");
const clienteSchema = require("../models/cliente");

const router = express.Router();

//get todos clientes
router.get('/clientes', (req,res) => {
    clienteSchema
    .find()
    .then((data) => res.json(data))
    .catch((err) => res.json({message: err}));
});

//get cliente pela id
router.get('/clientes/:id', (req,res) => {
    const { id } = req.params;
    clienteSchema
    .findById(id)
    .then((data) =>{
        
        if(data == null){
            res.status(400).send('id não existe')
            return;
        }
        else{
            res.status(200).json(data)
        }
        

    })
    .catch((err) =>{
    if(err.name == 'CastError'){
        res.status(400).json({message: err});
        return;
    }
 
    else {res.status(500).json({message: err});
            return;
        }
})


});
//get pelo cpf
router.get('/clientes/cpf/:cpf', (req,res) => {
    const {cpf}  = req.params;
    const validateCpf = (cpf) => {
        const re = /^([0-9]{3}\.?[0-9]{3}\.?[0-9]{3}\-?[0-9]{2}|[0-9]{2}\.?[0-9]{3}\.?[0-9]{3}\/?[0-9]{4}\-?[0-9]{2})$/;
        return re.test(cpf);
    };
    clienteSchema
    .findOne({ cpf: cpf})
    .then((data) =>{
        if(!validateCpf(cpf)){
            res.status(400).send('cpf invalido')
            return;
        }
        if(data == null){
            res.status(400).send('cpf não cadastrado')
            return;
        }
        else{
            res.status(200).json(data)
        }
        

    })
    .catch((err) =>{
    if(err.name == 'CastError'){
        res.status(400).json({message: err});
        return;
    }
 
    else {res.status(500).json({message: err});
            return;
        }
})


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
        if(err.code == 11000){
            res.status(400).send('cpf já existe')
            return;
        }
        else{
            res.status(500).json({message: err});
        }

    } 
});

//update cliente pela id
router.put('/clientes/:id', async (req,res) => {
    const  {id}  = req.params;
    const cliente = await clienteSchema.findById(id);
    const  {nome, sobrenome, cpf, telefone, email, endereço } = req.body;

    try{
        
        cliente.set(req.body);
         await  cliente.save();
        res.status(200).send('cliente atualizada')
    }
    catch(err){
        if(err.name == "ValidationError"){
            res.status(400).json({message: err})
            return;
        }
        if(err.code == 11000){
            res.status(400).send('cpf já existe')
            return;
        }
        else{
            res.status(500).json({message: err});
        }

    } 

    


   
    

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