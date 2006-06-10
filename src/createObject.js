/*
  Copyright (c) 2006, Tim Becker All rights reserved.
  
  Redistribution and use in source and binary forms, with or without
  modification, are permitted provided that the following conditions are
  met:
  
      * Redistributions of source code must retain the above copyright
        notice, this list of conditions and the following disclaimer.
      * Redistributions in binary form must reproduce the above copyright
        notice, this list of conditions and the following disclaimer in
        the documentation and/or other materials provided with the
        distribution.
  
  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS
  IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED
  TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A
  PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER
  OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
  PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
  PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
  SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/


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



