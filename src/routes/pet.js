const express = require("express");
const petSchema = require("../models/pet");
const clienteSchema = require("../models/cliente");

const router = express.Router();

//get todas as pets
router.get('/pets', (req, res) => {
    petSchema
    .find()
    .populate('tutor')
    .then((data) => res.json({ Pets: data }))
    .catch((err) => res.json({ message: err }));
});

// create pet
router.post('/pet', async (req, res) => {
    const { nroPet, nome, idade, peso, raça, tipo, tutorCpf } = req.body;
    const cpfId = await clienteSchema.findOne({ cpf: tutorCpf });
    
    const validateCpf = (cpf) => {
        const re = /^([0-9]{3}\.?[0-9]{3}\.?[0-9]{3}\-?[0-9]{2}|[0-9]{2}\.?[0-9]{3}\.?[0-9]{3}\/?[0-9]{4}\-?[0-9]{2})$/;
        return re.test(cpf);
    };
    
    try{
           if(!tutorCpf){
                res.status(400).json({ erro: 'precisa inserir cpf'})
                return;
           }

           if(!validateCpf(tutorCpf)){
                res.status(400).json({ message: 'cpf invalido', tutorCpf})
                return;
           } 
        
           if(!cpfId){
                res.status(404).json({ message: 'tutor não encontrado, cliente não cadastrado', tutorCpf})
                return
           }
           else{
                const tutor = cpfId._id;
                const pet = petSchema({ nroPet, nome, idade, peso, raça, tipo, tutor });
                const newPet = await pet.save(pet)
                res.status(201).json({ Novo_Pet: newPet })
           }
    }
   
    catch(err){
        if(err.name == "ValidationError"){
           res.status(400).json({message: err})
            return;
        }
        if(err.code == 11000){
            res.status(400).json({ message: 'numero de pet já existe' })
           return;
        }
        else{
            res.status(500).json({message: err});
        }

    } 
});



//get pet pela id
router.get('/pet/:id', (req, res) => {
    const { id } = req.params;
    petSchema
    .findById(id)
    .populate('tutor')
    .then((data) =>{
        
        if(data == null){
            res.status(404).json({ message: 'id não encontrado, a id não existe', id})
            return;
        }
        else{
            res.status(200).json({ Pet: data })
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



//Get pet pelo numero do pet
router.get('/pet/nroPet/:nroPet', (req, res) => {
    const {nroPet}  = req.params;
    petSchema
    .findOne({ nroPet: nroPet })
    .populate('tutor')
    .then((data) =>{
        
        if(data == null){
            res.status(404).json({ message: 'numero de pet não encontrado, numero de pet não cadastrado', nroPet})
            return;
        }
        else{
            res.status(200).json({ Pet: data })
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

//get pet pela cpf do tutor
router.get('/pet/cpf/:cpf', async (req, res) => {
    const  {cpf}  = req.params;
    const cliente = await clienteSchema.findOne({cpf});
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
        const clienteId = cliente._id;
        const tutorId = await petSchema.find({ tutor: clienteId}).populate('tutor');
        const tutorVal = await petSchema.findOne({ tutor: clienteId});
            if(!tutorVal){
                res.status(404).json({ message: 'Pet não encontrado, o cliente existe mais não tem pet cadastrado', cpf })
                return;
            }
            else{    
                res.status(200).json({ pet: tutorId})
                return;
            }
    }
        
    }
    
    
    catch(err){
        res.status(500).json({message: err});
        } 
 
});


//update pet pela id
router.put('/pet/:id', async (req, res) => {
    const { id } = req.params;
    const pet = await petSchema.findOne({ _id: id });
    const { nroPet, nome, idade, peso, raça, tipo, tutorCpf } = req.body;
    
    try{

        if(!pet){
        res.status(404).json({ message: 'id não encontrado, id não existe', id })
        return;
        }
        
       if(!tutorCpf){
            pet.set( req.body );
            await  pet.save();
            res.status(200).json({ message: 'Dados de pet atualizado', pet })
            }
       if(tutorCpf){
            const cpfId = await clienteSchema.findOne({ cpf: tutorCpf });
            const validateCpf = (cpf) => {
                const re = /^([0-9]{3}\.?[0-9]{3}\.?[0-9]{3}\-?[0-9]{2}|[0-9]{2}\.?[0-9]{3}\.?[0-9]{3}\/?[0-9]{4}\-?[0-9]{2})$/;
                return re.test(cpf);
            };

                    if(!validateCpf(tutorCpf)){
                        res.status(400).json({ message: 'cpf invalido', tutorCpf})
                        return;
                    }
                    
                    if(!cpfId){
                        res.status(404).json({ message: 'tutor não encontrado, cliente não cadastrado', tutorCpf})
                        return;
                    }

                    else{
                        const tutor = cpfId._id;
                        pet.set({ nroPet, nome, idade, peso, raça, tipo, tutor });
                        await  pet.save();
                        res.status(200).json({ message: 'Dados de pet atualizado', pet })
                    }
                
            }
        
        
    }
    catch(err){
      
        if(err.name == "ValidationError"){
            res.status(400).json({message: err})
            return;
        }
        if(err.code == 11000){
            res.status(400).json({ message: 'Numero de pet já existe'})
            return;
        }
        else{
            res.status(500).json({message: err});
        }

    } 

});


//update pet pelo numero de pet
router.put('/pet/nroPet/:nroPet', async (req, res) => {
    const { nroPet } = req.params;
    const pet = await petSchema.findOne({ nroPet: nroPet });
    const { nome, idade, peso, raça, tipo, tutorCpf } = req.body;
    
    try{

        if(!pet){
        res.status(404).json({ message: 'numero de pet não encontrado, numero de pet não existe', nroPet })
        return;
        }
        
       if(!tutorCpf){
            pet.set( req.body );
            await  pet.save();
            res.status(200).json({ message: 'Dados de pet atualizado', pet })
            }
       if(tutorCpf){
            const cpfId = await clienteSchema.findOne({ cpf: tutorCpf });
            const validateCpf = (cpf) => {
                const re = /^([0-9]{3}\.?[0-9]{3}\.?[0-9]{3}\-?[0-9]{2}|[0-9]{2}\.?[0-9]{3}\.?[0-9]{3}\/?[0-9]{4}\-?[0-9]{2})$/;
                return re.test(cpf);
            };

                    if(!validateCpf(tutorCpf)){
                        res.status(400).json({ message: 'cpf invalido', tutorCpf})
                        return;
                    }
                    
                    if(!cpfId){
                        res.status(404).json({ message: 'tutor não encontrado, cliente não cadastrado', tutorCpf})
                        return;
                    }

                    else{
                        const tutor = cpfId._id;
                        pet.set({ nroPet, nome, idade, peso, raça, tipo, tutor });
                        await  pet.save();
                        res.status(200).json({ message: 'Dados de pet atualizado', pet })
                    }
                
            }
        
        
    }
    catch(err){
      
        if(err.name == "ValidationError"){
            res.status(400).json({message: err})
            return;
        }
        if(err.code == 11000){
            res.status(400).json({ message: 'Numero de pet já existe'})
            return;
        }
        else{
            res.status(500).json({message: err});
        }

    } 
});

//delete pet pela id
router.delete('/pet/:id', (req, res) => {
    const { id } = req.params;
    petSchema
    .findOneAndDelete({ _id: id })
    .then((data) =>{
        if(data == null){
            res.status(404).json({ message: 'id não encontrado, id não existe', id})
            return;
        }
        else{
            res.status(200).json({ message: 'a pet foi excluido com sucesso!' })
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


//delete pelo numero de pet
router.delete('/pet/nroPet/:nroPet', (req, res) => {
    const {nroPet} = req.params;
    petSchema
    .findOneAndDelete({ nroPet: nroPet })
    .then((data) =>{
        
        if(data == null){
            res.status(404).json({ message: 'numero de pet não encontrado, numero de pet não existe', nroPet })
            return;
        }
    
        else{
            res.status(200).json({ message: 'a pet foi excluido com sucesso!' })
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