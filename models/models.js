var path = require('path');

// Carga modelo ORM
var Sequelize = require('sequelize');

// Usar BBDD SQLite:
var sequelize = new Sequelize(null, null, null,
                    {dialect: "sqlite", storage: "quiz.sqlite"}
                  );

// importar la definición de la tabla Quiz en quiz.js
var Quiz = sequelize.import(path.join(__dirname,'quiz'));

exports.Quiz = Quiz; // exportar definición de tabla Quiz

// sequelize.sync() crea e inicializa tabla de preguntas en DB
sequelize.sync().then(function(){
  //success(...) ejecuta el manejador una vez creda la tabla
    Quiz.count().then(function(count){
    if (count===0){
      Quiz.create({pregunta: 'Capital de Italia',
                   respuesta: 'Roma'
                 }).then(function(){console.log('Base de datos inicializada')});
    };
  });
});
