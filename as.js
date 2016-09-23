//E-commerce business logic
//-------------------------------
var express = require('express');
var bodyparser =require('body-parser');
var _ = require('underscore');

var app = express();
var port = process.env.port  || 8080;

var products = [];
var productnextid = 1;

var categories = [];
var categorynextid = 1;

	app.use(bodyparser.json());

//**********PRODUCTDS Wise***************

//GET API products
//-------------------
	app.get ('/' , function(req ,res){
		res.send('API products');
	});

//GET products
//--------------
	app.get ('/products' , function(req ,res){
		var queryparams = req.query;
		var filterproducts = products;
//description validation
	if(queryparams.hasOwnProperty('d') && queryparams.d.length > 0){
		filterproducts = _.filter(filterproducts , function(obj){
		return obj.description.toLowerCase().indexOf(queryparams.d.toLowerCase()) > -1;
		});
	   }
//validation of name	   	
	   	if(queryparams.hasOwnProperty('n') && queryparams.n.length > 0){
			filterproducts = _.filter(filterproducts , function(obj){
			return obj.name.toLowerCase().indexOf(queryparams.n.toLowerCase()) > -1;
		});
	   }
//validation of price	   
	   		if(queryparams.hasOwnProperty('q') && queryparams.q.length > 0){
				filterproducts = _.filter(filterproducts , function(obj){
				return obj.quantity >= queryparams.q;
		});
	   }
//validation on max/min	   
		   		if(queryparams.hasOwnProperty('max') && queryparams.hasOwnProperty('min')){
					filterproducts = _.filter(filterproducts , function(obj){
					return queryparams.min < obj.price && obj.price < queryparams.max;
		});
	   }else if(queryparams.hasOwnProperty('max')){
	   		filterproducts = _.filter(filterproducts , function(obj){
	   			return obj.price < queryparams.max;
	   			});
	   }else if(queryparams.hasOwnProperty('min')){
	   		filterproducts = _.filter(filterproducts , function(obj){
	   			return obj.price > queryparams.min;

	   });
	}
	   res.json(filterproducts);
	});

//GET products/ID
//---------------
	app.get ('/products/:id' , function(req ,res){

	var productid = parseInt(req.params.id , 10);
	var matchedproduct ;

	products.forEach(function(obj){

		if(productid === obj.id){
			matchedproduct = obj;
		}
	});

	if(matchedproduct){
		res.json(matchedproduct);
	}else{
		res.status(404).json({"error" : "provide valid id"});;
	}


});

//get products/id
//---------------
app.get ('/products/:id' , function(req ,res){

	var productid = parseInt(req.params.id , 10);
	var matchedproduct = _.findWhere(products, {id: productid});

	if(matchedproduct){
		res.json(matchedproduct);
	}else{
		res.status(404).json({"error" : "provide valid id"});
	}
});

//POST products
//-------------------
	app.post('/products' , function(req , res){

//use_.pick
//-----------------
		var body = _.pick(req.body , 'description' , 'name' ,'id','price' , 'quantity');
 
		
		if(!_.isString(body.description) || body.description.trim().length === 0 ||
		   !_.isString(body.name) || body.name.trim().length === 0 ||
		   _.isString(body.price) ){

		return res.status(400).json({"error": "enter required data "});
		
		}
//set body.description,name to be terminated
//------------------------------------------
	body.description = body.description.trim();
	body.name = body.name.trim();
		body.id = productnextid++;

		products.push(body);

		res.json(body);
	});

//delete/products/id
//--------------------------
	app.delete('/products/:id', function(req , res){
		var productid = parseInt(req.params.id , 10);
		var matchedproduct = _.findWhere(products , {id : productid});

			if(!matchedproduct){
				res.status(400).json("{error : no product is found with that id}");
			}else{
				products = _.without(products , matchedproduct);
				res.json(matchedproduct);

			}
	});


//put/products/id
//-----------------
			app.put('/products/:id' , function(req , res){
			var productid = parseInt(req.params.id , 10);
			var matchedproduct = _.findWhere(products , {id : productid});
			var body = _.pick(req.body , 'description' , 'name' ,'id','price' , 'quantity' );
			var validattributes = {};

			if(!matchedproduct){
				return res.status(400).json("{error : no product is found with that id}");
			}

//product name
			if(body.hasOwnProperty('name') && _.isString(body.name)){
				validattributes.name = body.name;
			}else if(body.hasOwnProperty('name')){
				return res.status(400).json("{error : enter string}");
			}
//description

			if(body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0){
				validattributes.description = body.description;
			}else if(body.hasOwnProperty('description')){
				return res.status(400).json("{error : enter string}");
			}
//price			
			if(body.hasOwnProperty('price') && !_.isString(body.price)){
				validattributes.price = body.price;
			}else if(body.hasOwnProperty('price')){
				return res.status(400).json("{error : enter number}");
			}

			_.extend(matchedproduct , validattributes);
			res.json(matchedproduct);
	});

//**********CATEGORIES WISE PRODUCTDS***************

//GET categories
//--------------
	app.get ('/categories' , function(req ,res){
		var queryparams1 = req.query;
		var filtercategories = categories;

	if(queryparams1.hasOwnProperty('d') && queryparams1.d.length > 0){
			filtercategories = _.filter(filtercategories , function(obj){
			return obj.description.toLowerCase().indexOf(queryparams1.d.toLowerCase()) > -1;
		});
	   }
	   if(queryparams1.hasOwnProperty('n') && queryparams1.n.length > 0){
			filtercategories = _.filter(filtercategories , function(obj){
			return obj.name.toLowerCase().indexOf(queryparams1.n.toLowerCase()) > -1;
		});
	   }
		res.json(filtercategories);
	});

//GET categories/ID
//---------------
	app.get ('/categories/:id' , function(req ,res){

	var categoryid = parseInt(req.params.id , 10);
	var matchedcategory;

	categories.forEach(function(obj){

		if(categoryid === obj.id){
			matchedcategory = obj;
		}
	});

	if(matchedcategory){
		res.json(matchedcategory);
	}else{
		res.status(404).json({"error" : "provide valid id"});;
	}


});

//get categories/id
//---------------
	app.get ('/categories/:id' , function(req ,res){

	var categoryid = parseInt(req.params.id , 10);
	var matchedcategory = _.findWhere(categories, {id: categoryid});

	if(matchedcategory){
		res.json(matchedcategory);
	}else{
		res.status(404).json({"error" : "provide valid id"});
	}
});

//POST categories
//-------------------
	app.post('/categories' , function(req , res){

//use_.pick
//-----------------
		var body = _.pick(req.body , 'description' , 'name' ,'id');

 		if(!_.isString(body.description) || body.description.trim().length === 0 ||
		   !_.isString(body.name) || body.name.trim().length === 0  ){

		return res.status(400).json({"error": "enter required data "});
		
		}
//set body.description,name to be terminated
//------------------------------------------
	body.description = body.description.trim();
	body.name = body.name.trim();
		body.id = categorynextid++;

		categories.push(body);

		res.json(body);
	});

//delete/categories/id
//--------------------------
	app.delete('/categories/:id', function(req , res){
		var categoryid = parseInt(req.params.id , 10);
		var matchedcategory = _.findWhere(categories , {id : categoryid});

			if(!matchedcategory){
				res.status(400).json("{error : no product is found with that id}");
			}else{
				categories = _.without(categories , matchedcategory);
				res.json(matchedcategory);

			}
	});


//put/categories/id
//-----------------
			app.put('/categories/:id' , function(req , res){
			var categoryid = parseInt(req.params.id , 10);
			var matchedcategory = _.findWhere(categories , {id : categoryid});
			var body = _.pick(req.body , 'description' , 'name' ,'id' );
			var validattributes = {};

			if(!matchedcategory){
				return res.status(400).json("{error : no product is found with that id}");
			}

//categories name
			if(body.hasOwnProperty('name') && _.isString(body.name)){
				validattributes.name = body.name;
			}else if(body.hasOwnProperty('name')){
				return res.status(400).json("{error : enter string}");
			}
//description

			if(body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0){
				validattributes.description = body.description;
			}else if(body.hasOwnProperty('description')){
				return res.status(400).json("{error : enter string}");
			}
		
			_.extend(matchedcategory, validattributes);
			res.json(matchedcategory);
	});

	app.listen(port , function(){
		console.log("server started " + port + " !");
	});

//*********************end************