

function isA (obj, type) {
	return obj.constructor.prototype == type.prototype
}

function isInt (obj) {
	if (!isA(obj,Number)) return false
	return (obj % 1) == 0
}

function isFloat(obj) {
	if (!isA(obj,Number)) return false
	return !isInt(obj)
}
/*TESTS
	Tests, not for production
*/
type_basics_tests = [
		function() { return isA("hallo",String)},
		function() { x=1; return isInt(x)},
		function() { x=1.5; return isFloat(x)},
		function() { x=1; return !isFloat(x)},
		function() { x=1.5; return !isInt(x)},
		function() { return isA([],Array)}
	]

