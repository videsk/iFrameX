const iFrameX = class {
  /*
  **  iFrameX - Created by Matias Lopez for Videsk™
  **  Iframe generator for append elements without limitations
  **  for modern browsers.
  **  
  **  MIT License for Commercial or non commercial use
  */

  constructor ({ attr , content , append , config }) {
    // Iframe attributes
    this.attr = attr || {};
    // Elements with attributes for append in to iframe
    this.content = content || [];
    // Element where append the iframe, by default is body
    this.body = document.querySelector(append) || document.querySelector('body');
    // Default id for know if exist the iframe
    this.id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    // Array events
    this.events = [];
    // Iframe like Node
    this.iframe = null;
    // Debug mode
    this.debug = config.debug || false;
    // Action for postMessage
    this.action = (typeof config.action === 'function') ? config.action : function (msg) {};
  };
  
  init() {
    // Check if exist iframe
    this._createIframe((iframe) => {
      if (iframe) {
        // Check if the content is a array and have elements
        this._addElements(this.content);
      }
    });
  };

  _createIframe(callback) {
    if (!this.iframe) {
      // Create iframe element
      let iframe = document.createElement('iframe');
      // Set id for get after
      iframe.setAttribute('iframe-id', this.id);
      // Create array with the custom attributes of iframe
      const attr = Object.keys(this.attr);
      // Check if exist attributes
      if (attr.length > 0) {
        // Map attributes
        attr.map((i) => {
          // Add mapped attributes to iframe
          iframe.setAttribute(i, this.attr[i]);
        });
      }
      // Append iframe to custom or default element
      this.body.appendChild(iframe);
      // Set Node to var
      this.iframe = document.querySelector(`[iframe-id="${this.id}"]`);
      // Add messages eventlistener
      this._addEventListener();
      // Execute callback if is a function
      (typeof callback === 'function') && callback(iframe);
    } else {
      // Return if the iframe exist
      console.error('An iframe already exists, please instance a new iFrameX. Read docs here: https://github.com/matiaslopezd/iframex');
      // Return callback with a null
      (typeof callback === 'function') && callback(null);
    }
  };

  _addElements(elements){
    // Create the element
    function _createAndBind(i){
      // Create element with type key
      const el = document.createElement(i.type);
      // Check if exist content key and append to element
      if (i.content && i.content !== '') {
        if (i.type === 'script' || i.type === 'style') {
          el.appendChild(document.createTextNode(i.content));
        } else {
          el.innerHTML = i.content;
        }
      };
      // Check if exist attr key and map keys of object of array
      (i.attr) && Object.keys(i.attr).map((a) => {
        // Set attribute based in key and value
        el.setAttribute(a, i.attr[a]);
      });
      return el;
    }
    // Check if elements is a array
    if (Array.isArray(elements) && elements.length > 0) {
      // Map elements
      elements.map((obj) => {
        // Add to iframe
        let el = (!obj.append) ? 'body' : obj.append;
        setTimeout(() => this.iframe.contentWindow.document.querySelector(el).appendChild(_createAndBind(obj)), 1);
      });
    } else if(typeof elements === 'object') {
      // Add single element
      let el = (!elements.append) ? 'body' : elements.append;
      setTimeout(() => this.iframe.contentWindow.document.querySelector(el).appendChild(_createAndBind(elements)), 1);
    }
  };

  _addEventListener(){
    // Add message eventlistener to iframe
    this._addElements({ type: 'script', content: this._bindEvent('window', `'message'`, this.action) });
  };

  _bindEvent(element, eventName, eventHandler) {
    let event = null;
    element = (element === 'window') ? element : `document.querySelector(${element})`;
    // Add listener
    if (window.addEventListener) {
      event = `${element}.addEventListener(${eventName}, ${eventHandler}, false);`
    // Compatibility with IE8
    } else if (window.attachEvent) {
      event = `${element}.attachEvent(on${eventName}, ${eventHandler});`
    }
    return event;
  };
};