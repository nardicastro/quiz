var models = require('../models/models.js');

//Autiload - faztoriza el código si la ruta incluye :quizId
exports.load = function(req,res,next,quizId){
  models.Quiz.findById(quizId).then(
    function(quiz) {
      if (quiz) {
        req.quiz = quiz;
        next();
      } else { next(new Error('No existe quizId=' + quizId)); }
    }
  ).catch(function(error) { next(error); });
};

exports.index = function(req,res,next)
{
  if(req.query.search) {
    req.query.search  = ('%' + req.query.search.trim() + '%')
						.replace(/\s+/g, '%')
						.toUpperCase();
    models.Quiz.findAll({where:["upper(pregunta) like ?", req.query.search], order: 'pregunta ASC'})
    .then(function(quizes)
    {
      res.render('quizes/index.ejs',{ quizes: quizes,filtro: req.query.search});
    }).catch(function(error) { next(error); });
  }
  else {
    models.Quiz.findAll()
    		.then(
    			function(quizes) {
    					res.render('quizes/index', {quizes: quizes, filtro:'*'});
    			}
    		).catch(function(error) { next(error);})
  }
};

//GET /quizes/:id
exports.show = function(req,res) {
    res.render('quizes/show',{quiz: req.quiz});
};

//GET /quizes/answer
exports.answer = function(req, res)
{
  var resultado = 'Incorrecto';
  if (req.query.respuesta === req.quiz.respuesta)
  {
    resultado = 'Correcto';
  }
  res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado});
};
