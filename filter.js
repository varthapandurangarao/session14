var express = require('express');
var bodyparser =require('body-parser');
var _ = require('underscore');

var app = express();
var port = process.env.port  || 8080;
var todos = [];
var todonextid = 1;

	app.use(bodyparser.json());

//GET API TODO
	app.get ('/' , function(req ,res){
		res.send('API TODO');
	});

//GET TODOS ? COMPLETED = TRUE
	app.get ('/todos' , function(req ,res){
		var queryParams = req.query;
		var filtertodos = todos;
		
		if(queryParams.hasOwnProperty('completed') && queryParams.completed === 'true'){
			filtertodos = _.where(filtertodos , {completed : true});	
		}else if(queryParams.hasOwnProperty('completed') && queryParams.completed === 'false'){
			filtertodos = _.where(filtertodos , {completed : false});	

		}
		res.json(filtertodos);
	});

//GET TODOS/ID
	app.get ('/todos/:id' , function(req ,res){

	var todoid = parseInt(req.params.id , 10);
	var matchedtodo ;

	todos.forEach(function(obj){

		if(todoid === obj.id){
			matchedtodo = obj;
		}
	});

	if(matchedtodo){
		res.json(matchedtodo);
	}else{
		res.status(404).json({"error" : "provide valid id"});;
	}


});

//get todo/id

app.get ('/todos/:id' , function(req ,res){

	var todoid = parseInt(req.params.id , 10);
	var matchedtodo = _.findWhere(todos, {id: todoid});

	if(matchedtodo){
		res.json(matchedtodo);
	}else{
		res.status(404).json({"error" : "provide valid id"});
	}
});

//POST TODOS
	app.post('/todos' , function(req , res){

//use_.pick

		var body = _.pick(req.body , 'description' , 'completed' ,'id');
 
		
		if(!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0){

		return res.status(400).json({"error": "required data enter"});
		
		}

//set body.description to be terminated
	body.description = body.description.trim();
		body.id = todonextid++;

		todos.push(body);

		res.json(body);
	});

//delete/todos/id
	app.delete('/todos/:id', function(req , res){
		console.log('haiii');
		var todoid = parseInt(req.params.id , 10);
		var matchedtodo = _.findWhere(todos , {id : todoid});

			if(!matchedtodo){
				res.status(400).json("{error : no todo is found with that id}");
			}else{
				todos = _.without(todos , matchedtodo);
				res.json(matchedtodo);

			}
	});


//put/todos/id

	app.put('/todos/:id' , function(req , res){
			var todoid = parseInt(req.params.id , 10);
			var matchedtodo = _.findWhere(todos , {id : todoid});
			var body = _.pick(req.body , 'description' , 'completed' );
			var validattributes = {};

			if(!matchedtodo){
				return res.status(400).json("{error : no todo is found with that id}");
			}
//completed
			if(body.hasOwnProperty('completed') && _.isBoolean(body.completed)){
				validattributes.completed = body.completed;
			}else if(body.hasOwnProperty('completed')){
				return res.status(400).json("{error : please enter string}");
			}
//description trime using
			body.description = body.description.trim();
//description			
			if(body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0){
				validattributes.description = body.description;
			}else if(body.hasOwnProperty('description')){
				return res.status(400).json("{error : enter string}");
			}

			_.extend(matchedtodo , validattributes);
			res.json(matchedtodo);
	});

	app.listen(port , function(){
		console.log("server started " + port + " !");
	})
