
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
