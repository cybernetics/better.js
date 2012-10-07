/**
 * @namespace Strong typing for javascript
 */
var StrongTypeChecker	= {};

/**
 * function wrapper to check the type of function parameters and return value
 * @param  {Function} originalFn  the function to wrap
 * @param  {Array} paramsTypes allowed types for the paramter. array with each item is the allowed types for this parameter.
 * @param  {Array} returnTypes allowed types for the return value
 * @return {boolean} return isValid, so true if types matche, false otherwise
 */
StrongTypeChecker.checkFunctionTypes	= function(originalFn, paramsTypes, returnTypes){
	return function(){
		// check parameters type
		console.assert(arguments.length <= paramsTypes.length, 'funciton received '+arguments.length+' parameters but recevied only '+returnTypes.length+'!');
		for(var i = 0; i < paramsTypes.length; i++){
			var isValid	= StrongTypeChecker.checkValueType(arguments[i], paramsTypes[i]);			
			console.assert(isValid, 'argument['+i+'] type is invalid. MUST be of type', paramsTypes[i], 'It is ===', arguments[i])
		}
		// forward the call to the original function
		var result	= originalFn.apply(this, arguments);
		// check the result type
		var isValid	= StrongTypeChecker.checkValueType(result, returnTypes);			
		console.assert(isValid, 'invalid type for returned value. MUST be of type', returnTypes, 'It is ===', result);
		// return the result
		return result;
	}
}

/**
 * Check the type of a value
 * @param  {*} value the value to check
 * @param  {Array.<function>} types the types allowed for this variable
 * @return {boolean} return isValid, so true if types matche, false otherwise
 */
StrongTypeChecker.checkValueType	= function(value, types){
	// handle parameter polymorphism
	if( types instanceof Array === false )	types	= [types];
	// go thru each type
	var result	= false;
	types.forEach(function(type){
		if( type === Number ){
			var valid	= typeof(value) === 'number';
		}else if( type === String ){
			var valid	= typeof(value) === 'string';			
		}else {
			var valid	= value instanceof type;
		}
		result	= result || valid;
	})
	// return the just computed result
	return result;
}

// export the namespace in node.js - if running in node.js
if( typeof(window) === 'undefined' )	module.exports	= StrongTypeChecker;