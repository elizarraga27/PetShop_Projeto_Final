const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const atendimentoSchema = mongoose.Schema({
    cliente: {type: Schema.ObjectId, ref: 'cliente',  required  : [ true, 'Se precisa Cliente' ] },
    pet: {type: Schema.ObjectId, ref: 'pet',  required  : [ true, 'Se precisa pet' ] },
    serviço: {type: Schema.ObjectId, ref: 'serviço' },
    produto: {type: Schema.ObjectId, ref: 'produto' }
   
},
{
    timestamps: true,
    versionKey: false
}
)

module.exports = mongoose.model('atendimento', atendimentoSchema);