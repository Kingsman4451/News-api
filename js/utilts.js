// call elements from html
let $ = function (element, node = document) {
  return node.querySelector(element)
}

// create elements
let createElement = function (tagName, className, text) {
  let element = document.createElement(tagName);
  if (className) {
    element.setAttribute("class", className);
  }
  if (text) {
    element.textContent = text;
  }

  return element;
}
