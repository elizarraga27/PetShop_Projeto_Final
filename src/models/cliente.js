const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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
        required  : [ true, 'Se precisa cpf' ],
        maxlength : [ 11, 'O cpf tem que ter 11 numero'],
        minlength : [ 11, 'O cpf tem que ter 11 numero'],
        unique    : [ true, 'cpf já existe']
        
    },
    telefone: {
        type: Number,
        required  : [ true, 'Se precisa numero de telefone' ],
        unique    : [ true, 'telefone já existe']
    },
    email: {
        type: String,
        unique    : [ true, 'email já existe'], 
        required  : [ true, 'Se precisa email' ], 
        maxlength : [ 100, 'El correo no puede exceder los 100 caracteres'],
        regex     : function( value ) {
          var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return re.test(String(value).toLowerCase());
        }
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