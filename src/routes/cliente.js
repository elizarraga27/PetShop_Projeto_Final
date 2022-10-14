const express = require("express");
const clienteSchema = require("../models/cliente");

const router = express.Router();

//get todos clientes
router.get('/clientes', (req, res) => {
    clienteSchema
    .find()
    .then((data) => res.json({ Clientes: data}))
    .catch((err) => res.json({message: err}));
});

//get cliente pela id
router.get('/cliente/:id', (req, res) => {
    const { id } = req.params;
    clienteSchema
    .findById(id)
    .then((data) =>{
        
        if(data == null){
            res.status(404).json({ message: 'id não encontrado, a id não existe', id})
            return;
        }
        else{
            res.status(200).json({Cliente: data})
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
router.get('/cliente/cpf/:cpf', (req, res) => {
    const {cpf}  = req.params;
    const validateCpf = (cpf) => {
        const re = /^([0-9]{3}\.?[0-9]{3}\.?[0-9]{3}\-?[0-9]{2}|[0-9]{2}\.?[0-9]{3}\.?[0-9]{3}\/?[0-9]{4}\-?[0-9]{2})$/;
        return re.test(cpf);
    };
    clienteSchema
    .findOne({ cpf: cpf})
    .then((data) =>{
        if(!validateCpf(cpf)){
            res.status(400).json({ message: 'cpf inserido é invalido', cpf})
            return;
        }
        if(data == null){
            res.status(404).json({ message: 'cpf não encontrado, cpf não cadastrado', cpf})
            return;
        }
        else{
            res.status(200).json({ Cliente: data })
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
router.post('/cliente', async (req, res) => {
    const cliente = clienteSchema(req.body);
    try{
        const newCliente = await cliente.save(cliente)
        res.status(201).json({ Novo_Cliente: newCliente})
    }
   
    catch(err){
        if(err.name == "ValidationError"){
            res.status(400).json({message: err})
            return;
        }
        if(err.code == 11000){
            res.status(400).json({ message: 'cpf já existe' })
            return;
        }
        else{
            res.status(500).json({message: err});
        }

    } 
});

//update cliente pela id
router.put('/cliente/:id', async (req, res) => {
    const  {id}  = req.params;
    const cliente = await clienteSchema.findOne({ _id: id });
    const  {nome, sobrenome, cpf, telefone, email, endereço } = req.body;

    try{

        if(!cliente){
        res.status(404).json({ message: 'id não encontrado, id não existe', id })
        return;
      }
        else{
        cliente.set(req.body);
         await  cliente.save();
        res.status(200).json({ message: 'os dados do cliente foi atualizado com sucesso!', cliente})
        }
        
    }
    catch(err){
      
        if(err.name == "ValidationError"){
            res.status(400).json({message: err})
            return;
        }
        if(err.code == 11000){
            res.status(400).json({ message: 'cpf já existe'})
            return;
        }
        else{
            res.status(500).json({message: err});
        }

    } 

});

//update cliente pelo cpf
router.put('/cliente/cpf/:cpf', async (req, res) => {
    
    const {cpf}  = req.params;
    const cliente = await clienteSchema.findOne( { cpf: cpf} );
    const {nome, sobrenome, telefone, email, endereço} = req.body;
    const validateCpf = (cpf) => {
        const re = /^([0-9]{3}\.?[0-9]{3}\.?[0-9]{3}\-?[0-9]{2}|[0-9]{2}\.?[0-9]{3}\.?[0-9]{3}\/?[0-9]{4}\-?[0-9]{2})$/;
        return re.test(cpf);
    };
   
   try{

    if(!validateCpf(cpf)){
        res.status(400).json({ message: 'cpf invalido', cpf})
        return;
    } 
        
    if(!cliente){
        res.status(404).json({ message: 'cpf não encontrado, cpf não cadastrado', cpf})
        return;
    } 
    else{
        cliente.set(req.body);
         await  cliente.save();
        res.status(200).json({ message: 'os dados do cliente foi atualizado com sucesso!', cliente})
    }
        
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
   
//delete cliente pela id
router.delete('/cliente/:id', (req, res) => {
const { id } = req.params;

        clienteSchema
        .findOneAndDelete({ _id: id })
        .then((data) =>{
            if(data == null){
                res.status(404).json({ message: 'id não encontrado, id não existe', id})
                return;
            }
            else{
                res.status(200).json({ message: 'o cliente foi excluido com sucesso!' })
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

//delete pelo cpf
router.delete('/cliente/cpf/:cpf', (req, res) => {
    const { cpf } = req.params;
    const validateCpf = (cpf) => {
        const re = /^([0-9]{3}\.?[0-9]{3}\.?[0-9]{3}\-?[0-9]{2}|[0-9]{2}\.?[0-9]{3}\.?[0-9]{3}\/?[0-9]{4}\-?[0-9]{2})$/;
        return re.test(cpf);
    };
        clienteSchema
        .findOneAndDelete({ cpf: cpf })
        .then((data) =>{
            if(!validateCpf(cpf)){
                res.status(400).json({ message: 'cpf invalido', cpf })
                return;
            }
            if(data == null){
                res.status(404).json({ message: 'cpf não encontrado, cpf não existe', cpf })
                return;
            }
        
            else{
                res.status(200).json({ message: 'o cliente foi excluido com sucesso!' })
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






module.exports = router;