const mongoose = require("mongoose");

const atendimentoSchema = mongoose.Schema({
    data: {
        type: String,
        required: true
    },

    horario: {
        type: Number,
        required: false
    }
})

module.exports = mongoose.model('atendimento', atendimentoSchema);