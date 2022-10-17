const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const atendimentoSchema = mongoose.Schema({
    nroOrdem: {
        type: Number,
        unique: true,
        required: [ true, 'se precisa numero de ordem']
    },
    cliente: {type: Schema.ObjectId, ref: 'cliente',  required  : [ true, 'Se precisa Cliente' ] },
    serviço: [{type: Schema.ObjectId, ref: 'servico' }],
    produto: [{type: Schema.ObjectId, ref: 'produto' }]
   
},
{
    timestamps: true,
    versionKey: false
}
)

module.exports = mongoose.model('atendimento', atendimentoSchema);