
function ObjectCreator ( n, e ) {
	var functions = {}
	this.objName = n
	this.ext = e

	this.addFunction = function (name,func ) {
		functions[name]=func
	}

	this.create = function () {
		str=this.objName+" = function () {\n"
//		str="function __"+this.objName+" () {\n"

		str+="\n}\n"
		if (this.ext) {
			str+=this.objName+".prototype=new "+this.ext+"()\n"
		} else {
//			print (this.ext)
		}
//		str += this.objName + "= __"+this.objName; 
		
		try {
		
			print (str)
			eval (str)
		} catch (except) {
			alert(except)
		}
		
		cons = eval(this.objName)

		for (var func in functions) {
			cons.prototype[func] = functions[func]	
		}
		


	}
	
}





function Funktion (funcName, numParams, body) {
	this.funcName = funcName
	this.numParams = numParams
	this.body = body
	
	this.toString = function () {
		str = "function ("
		first = true
		for (var i = 0; i!=numParams; ++i) {
			if (!first){
				str += ", "
			} else {
				first = false	
			}
			str += "param"+(i+1)
		}
		str += ") {\n\t\t"+body+"\n\t}\n"
		return str
	}
}



