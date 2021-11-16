/**
 * @export
 * @param {string} html Representing a single element
 * @return {ChildNode}
 */
export function htmlToElement(html) {
  const template = document.createElement('template');
  // Never return a text node of whitespace as the result
  html = html.trim();
  template.innerHTML = html;
  return template.content.firstChild;
}

/**
 * @export
 * @param {string} html Representing any number of sibling elements
 * @return {NodeList}
 */
export function htmlToElements(html) {
  const template = document.createElement('template');
  // Never return a text node of whitespace as the result
  html = html.trim();
  template.innerHTML = html;
  return template.content.childNodes;
}
