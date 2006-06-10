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




function makeElement (elementName, text) {
	node = document.createElement(elementName)
	if (text)
		node.appendChild(document.createTextNode(text))
	return node
}

function appendAttribute (node, name, value) {
	attr = document.createAttribute(name)
	attr.nodeValue=value
	node.setAttributeNode(attr)
}

function makeLink (url,text, target) {
	node = makeElement ("a", text)
	appendAttribute(node, "href", url)
	
	if (target) {
		appendAttribute(node, "target", target)
	}
	return node
}

function makeDiv(clas, text){
	node = makeElement("div", text)
	appendAttribute(node, "class", clas)
	return node	
}


function makeBr () {
	return document.createElement("br")
}

function formToObject (form) {
	obj = new Object()
	for (i=0; i!=form.length; ++i) {
		if (form[i].name && form[i].name!="") {
			obj[form[i].name] = form[i].value	
		}
	}
	return obj
}
