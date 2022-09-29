const mongoose = require("mongoose");

const petSchema = mongoose.Schema({
    nome: {
        type: String,
        required: true
    },
    idade: {
        type: Number,
        required: true
    },
    Peso: {
        type: Number,
        required: true
    },
    raça: {
        type: String,
        required: true
    },
    
    tipo: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('pet', petSchema);