function main() {}

window.addEventListener("load", main);

// Removes the contents of the given DOM element (equivalent to elem.innerHTML = '' but faster)
function emptyDOM(elem) {
	while (elem.firstChild) elem.removeChild(elem.firstChild);
}

// Creates a DOM element from the given HTML string
function createDOM(htmlString) {
	let template = document.createElement("template");
	template.innerHTML = htmlString.trim();
	return template.content.firstChild;
}
