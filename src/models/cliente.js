const mongoose = require("mongoose");

const clienteSchema = mongoose.Schema({
    nome: {
        type: String,
        required: true
    },
    sobrenome: {
        type: String,
        required: true
    },
    cpf: {
        type: Number,
        required: true
    },
    telefone: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    endereço: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('cliente', clienteSchema);