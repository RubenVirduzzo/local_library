// //Importar Mongo
// const { query } = require("express");
// var mongoose = require("mongoose");

// //Se define el esquema
// var Schema = mongoose.Schema;

// var SomeModelSchema = new Schema({
//     a_string: String,
//     a_date: Date,
//     name: String,
//     binary: Buffer,
//     living: Boolean,
//     update: {type: Date, default:Date.now()},
//     age: {type:Number, min: 18, max:65, required: true},
//     mixed: Schema.Types.Mixed,
//     _someId: Schema.Types.ObjectId,
//     array: [],
//     offstring: [String],
//     nested: {stuff: {type: String, lowercase: true, trim:true}}
// });

// //Crear un modelo
// var SomeModel = mongoose.model('SomeModel', SomeModelSchema);



// var SomeModelShame2 = new Schema({
//     a_string: String
// });

// //Crear un modelo
// var SoneModel = mongoose.model('SomeModel', SomeModelSchema2);

// //Creamos una instancia
// var someModelInstance = new SomeModel({name: 'awesome'});
// //Guardar la instancia del modelo con calback
// someModelInstance.save(function(err){
//     if (err) return handleError(err);
// });

// //definir instancia y guardar al mismo tiempo
// SomeModel.create({nombre: 'awesome'}, function(err, domeModelInstance){
//     if (err) return handleError(err);
// })


// //Crear un modelo
// var Atleta = mongoose.model('SomeModel', schema);

// //Econtrar todos los ateltas queexisten por nombre y edad
// Atletas.find({'sport':'Tennis'}, 'name age', function(err, athletes){
//     if (err) return handleError(err);
// })


// query.select('name');
// query.select('name age city:')

// query.sort({age: -1});

// query.excute(function(err, athletes){
//     if (err) return handleError(err);
// })