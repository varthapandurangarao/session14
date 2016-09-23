app.get ('/products' , function (req , res){
var queryparams = req.query;
var filteproducts = products;

// validation descripton
if(queryparms.hasOwnproperty('d') && queryparams.d.length > 0){
	filteproducts = _.filter(filteproducts ,function(obj){
		return obj.description.toLowerCase().indexOf(queryparams.d.toLowerCase()) > -1;
	});
}


//validation name
if(queryparams.hasOwnproperty('n') && queryparams.n.length > 0){
	filterproducts = _.filter(filterproducts , function(obj){
		return obj.name.toLowerCase().indexOf(queryparams.n.toLowerCase()) > -1;

	});
}

//valdation price using
if((queryparams.hasOwnproperty('max') && queryparams.max.length > 0 ) && 
	(queryparams.hasOwnproperty('min') && queryparams.min.length > 0 )){

	filterproducts = _.filter(filterproducts ,function(obj){
		return obj.price > queryparams.min && obj.price < queryparams.max;
	});
}else if(queryparams.hasOwnproperty('max') && queryparams.max.length() > 0){
	filterproducts = _.filter(filterproducts ,function(obj){
		return obj.price < queryparams.max;
	});
}else if(queryparams.hasOwnproperty('min') && queryparams.min.length() > 0){
	filterproducts = _.filter(filterproducts , function(obj){
		return obj.price > queryparams.min;
	})
}


});
