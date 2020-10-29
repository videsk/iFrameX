/**
 * @name iFrameX
 * @author Videsk™
 * @license LGPL-2.1
 *
 * Javascript Iframe generator with dynamic content injection like HTML,
 * CSS, scripts, etc. and iframe custom event listener.
 *
*/

module.exports = class iFrameX {
  /**
   * Create iframe with custom attributes and dynamic content with object schema
   * @class iFrameX
   * @param attributes={} {Object} - List of iframe attributes
   * @param container="body" {String|Object} - Container where iframe will append
   * @param content=[] {Array|Object} - List of elements want append into iframe
   * @param options={} {Object} - Options of iframe
   * @param options.id {String} - Set custom id
   * @param options.eventName {String} - Event name want listen from iframe
   * @param options.gateway {Function} - Function want handle every event comes from iframe
   */
  constructor ({
    attributes = {},
    container = 'body',
    content = [],
    options = {}
  }) {
    this.attr = attributes;
    this.content = content;
    this.container = (typeof container === 'string') ? document.querySelector(container) : container;
    this.id = options.id || Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    this.eventName = options.eventName;
    this.gateway = options.gateway || function(){};
    this.iframe = null;
  };

  /**
   * Function to create iframe based on constructor params
   * @public
   */
  create() {
    return new Promise(resolve => {
      this.render();
      this.addElements(this.content);
      if (this.eventName) this.addIframeEventListener();
      this.iframe.addEventListener('load', resolve);
    });
  };

  /**
   * Send data from parent to iframe
   * @param name {String} - Event name
   * @param data {*} - Anything you want
   * @public
   */
  sendMessage(name = this.eventName, data) {
    const event = new CustomEvent(name, {detail: data});
    this.iframe.document.dispatchEvent(event);
  }

  /**
   * Add iframe event listener
   * @public
   */
  addIframeEventListener() {
    const {contentWindow} = this.iframe;
    window.addEventListener(this.eventName, message => (message.source === contentWindow) && this.gateway(message.detail));
  }

  /**
   * Create iframe with attributes and append custom elements
   * @public
   */
  render() {
    if (this.iframe) throw new Error('An iframe already exists, please instance a new iFrameX. Read docs here: https://github.com/videsk/iframex');
    const iframe = document.createElement('iframe');
    this.attr['data-iframe-id'] = this.id;
    Object.keys(this.attr).forEach(key => iframe.setAttribute(key, this.attr[key]));
    if (this.container) this.container.appendChild(iframe);
    else throw new Error('The container selector is not valid.');
    this.iframe = iframe;
  }

  /**
   * Add elements
   * @param elements {Object} - List of elements
   * @public
   */
  addElements(elements) {
    if (Array.isArray(elements)) this._addByObject(elements);
    else if (typeof elements === 'object') this._addByArray(elements);
  }

  /**
   * Create and bind element
   * @param objectElement {Object} - Schema of element
   * @param objectElement.type {String} - HTML tag
   * @param objectElement.append {String} - DOM querySelector in string
   * @param objectElement.content {String} - Content of element in HTML or plain text
   * @param objectElement.attr {Object} - List of attributes of element in key-value format
   * @returns {Object}
   * @private
   */
  _createAndBind(objectElement) {
    const {type, content} = objectElement;
    const element = document.createElement(type);
    if (!content) return; //TODO: This maybe avoid add empty elements
    if (['style', 'script'].includes(type)) element.appendChild(document.createTextNode(content));
    else element.innerText = content;
    return element;
  }

  /**
   * Add elements by array of objects
   * @param elements {[Object]} - Array with elements in object format
   * @private
   */
  _addByArray(elements) {
    const isValidArray = Array.isArray(elements) && elements.length > 0;
    if (!isValidArray) return console.warn('No elements found in array elements.');
    elements.forEach(element => this._addByObject(element));
  }

  /**
   * Add only one element by object structure
   * @param element
   * @private
   */
  _addByObject(element) {
    const isValidObject = Object.keys(element).length > 0;
    if (!isValidObject) return console.warn('No element found in object elements.');
    this._delayRenderHack(element);
  }

  /**
   * This avoid errors with render on Firefox (Gecko engine)
   * @param element {Object} - Element want render
   * @private
   */
  _delayRenderHack(element) {
    const {append = 'body'} = element;
    setTimeout(() => this.iframe.contentWindow.document.querySelector(append).appendChild(this._createAndBind(element)), 1);
  }
};
