const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const validateEmail = (email) => {
    const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email);
};
const validateTelefone = (telefone) => {
    const re = /^[0-9]{2}([0-9]{8}|[0-9]{9})/;
    return re.test(telefone);
};
const validateCpf = (cpf) => {
    const re = /^([0-9]{3}\.?[0-9]{3}\.?[0-9]{3}\-?[0-9]{2}|[0-9]{2}\.?[0-9]{3}\.?[0-9]{3}\/?[0-9]{4}\-?[0-9]{2})$/;
    return re.test(cpf);
};




const clienteSchema = mongoose.Schema({
    nome: {
        type: String,
        required  : [ true, 'Se precisa o nome' ], 
        maxlength : [ 50, 'O nome não pode ter 50 caracteres'],
        minlength : [ 3, 'O nome não poder ter menos de 3 letras']
    },
    sobrenome: {
        type: String,
        required  : [ true, 'Se precisa Sobrenome' ], 
        maxlength : [ 50, 'O Sobrenome não pode ter 50 caracteres'],
        minlength : [ 3, 'O Sobrenome não poder ter menos de 3 letras']
    },
    cpf: {
        type: Number,
        unique: true,
        required  : [ true, 'Se precisa cpf' ],
        validate: [validateCpf, "cpf invalido"],
        match: [
            /^([0-9]{3}\.?[0-9]{3}\.?[0-9]{3}\-?[0-9]{2}|[0-9]{2}\.?[0-9]{3}\.?[0-9]{3}\/?[0-9]{4}\-?[0-9]{2})$/,
          "cpf invalido",
        ]
        
        
    },
    telefone: {
        type: Number,
        required  : [ true, 'Se precisa numero de telefone' ],
        validate: [validateTelefone, "telefone invalido"],
        match: [
            /^[0-9]{2}([0-9]{8}|[0-9]{9})/,
          "telefone invalido",
        ],
    },
    email: {
        type: String,
        required  : [ true, 'Se precisa email' ],
        validate: [validateEmail, "email invalido"],
        match: [
          /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
          "email invalido",
        ],
    },
    endereço: {
        type: String,
        required  : [ true, 'Se precisa endereço' ]
    }
    
    
    
},
    {
        timestamps: true,
        versionKey: false
    }
);

module.exports = mongoose.model('cliente', clienteSchema);