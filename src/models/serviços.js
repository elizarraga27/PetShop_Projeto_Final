const mongoose = require("mongoose");

const servicoSchema = mongoose.Schema({
    nome: {
        type: String,
        required: true
    },
    valor: {
        type: Number,
        required: true
    },
    descrição: {
        type: String,
        required: false
    }
});

module.exports = mongoose.model('servico', servicoSchema);