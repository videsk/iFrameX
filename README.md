![iFrameX](https://user-images.githubusercontent.com/23618492/57744560-b3314280-7697-11e9-819f-010a7c39247a.png)

iFrameX is a javascript class for generate iframes with a really simple schema, also have a custom event listener.

This library is not compatible with IE11. Is designed only for modern browsers.

:rotating_light: **CAUTION! Never send passwords or credentials via a custom event, can be intercepted by others scripts.**

## Index

- [Demo](https://github.com/videsk/iFrameX#demo)
- [How to use](https://github.com/videsk/iFrameX#how-to-use)
- [Params](https://github.com/videsk/iFrameX#configuration)
  - [attributes](https://github.com/videsk/iFrameX#attr)
  - [content](https://github.com/videsk/iFrameX#content)
  - [container](https://github.com/videsk/iFrameX#append)
  - [options](https://github.com/videsk/iFrameX#config)
    - debug
    - action
- [Custom event listener and PostMessage](https://github.com/videsk/iFrameX#send-postmessage)
- [Some known bugs](https://github.com/videsk/iFrameX#some-known-bugs)
- [License](https://github.com/videsk/iFrameX#license)

## Demo

[Demo here](https://videsk.github.io/iFrameX/examples/)

## How to use

Use iFrameX is really easy, only need do two things:

```js
const iframe = new iFrameX(options);
iframe.create();
```

## Params

Params is an object can accept these parameters:

- attributes: `Object` with attributes of iframe.
- content: `Object` or `Array` with a content of iframe.
- container: `String` or `DOM` element where append iframe in query format.
- options: `Object` with some settings parameters.

### attributes

```js
const attributes = {
  width: 100,
  height: 100,
  class: 'myiframe'
};
```

### content

This allows adding elements in `Object` schema. Can set these parameters in object:

- type: `String` value of element to create. `REQUIRED`
- append: `String` value of element where append the new element to create. By default is `body`. `OPTIONAL`
- content: `String` value of content element, can be `HTML`, `Javascript`, `CSS`, etc. `OPTIONAL`
- attr: `Object` value of attributes of element. `OPTIONAL`

**Object example**
```js
const content = {
  type: script,
  append: 'body',
  content: `alert('This executed from iframe')`,
  attr: {
    async: true
  },
};
```

**Array example**
```js
const content = [
  {
    type: 'link',
    append: 'head',
    attr: {
      href: 'https://cdn.example.com/assets/css/main.css' ,
      rel: 'stylesheet'
    },
  },
  {
    type: 'script',
    append: 'body',
    content: `alert('This executed from iframe')`,
    attr: {
      async: true
    },
  },
  {
    type: 'button',
    content: `My button`,
    attr: {
      class: 'mybutton',
      onclick: 'myFunction()'
    },
  },
];
```

### container

Set where is appended the iframe, and the append value need be in elements query selector format. Read more about elements query selector format [here](https://developer.mozilla.org/es/docs/Web/API/Document/querySelector).

By default, will be appended into `body` tag.

```js
const append = '#myid';
const append = '[data-id="893283420949032"]';
const append = document.querySelector('#my-container');
```

### options

In options parameter you can set:

- `ìd`: `String` Custom if of iFrame
- `eventName`: `String` Custom event name from iframe
- `gateway`: `Function` Function to handle the custom event from iframe

```js
const options = {
  id: 'my-custom-iframe-id',
  eventName: 'MyCustomEventName',
  gateway: function HandleEvent(data) {
    doSomething(data);
  },
};
```

## Custom event listener and PostMessage
This provides the ability of listen custom events from iframe in a simple way.

To use it you need set `eventName` in `options` and `gateway` with a function can handle the event.

### Listen event comes from iframe in parent

If you want provide states of HTML elements, data or anything you want from iframe to parent can use this feature, like this:

```js
const options = {
    eventName: 'CustomEventName',
    gateway: function HandleEvent(data) {
        // Here data schema depend how you send from iframe
        doSomething(data);
    },
}; 

// Example content code in multiple lines
(() => {
    // This is how you can send from iframe to parent
    const event = new CustomEvent("CustomEventName", { detail: {date: new Date()} });
    window.parent.document.dispatchEvent(event);
})();

const content = {
    type: 'script',
    content: '(() => window.parent.document.dispatchEvent(new CustomEvent("CustomEventName", { detail: {date: new Date()} })))()', // Example content in one line
}; 

const iframe = new IframeX({content, options});
iframe.create();
```

The above example code, create an iframe and when this will render, sent custom event `CustomEventName` with data, that contains an `Object` with `date: new Date()`. (Obviously data is completely customizable)

### Listen event in iframe from parent

To listen events in iframe that comes from outside is really simple:

**In iframe**
```js
function newMessage(event) {
    const data = event.detail;
    doSomething(data);
}

window.addEventListener('CustomEventName', newMessage);
```

**In parent**
```js
iframe.sendMessage('CustomEventName', {date: new Date()});
```

**Is too important the event listener on iframe will set before send the event from the parent. Is highly recommended set event listener on iframe before all scripts on the body!** 

### Why not use PostMessage?

Because you need set `message` listener before iframe will render on a parent. And can't create multiples custom events before and after iframe was rendered.

That means pass all data via PostMessage making too complex handle different events and data.

If you're curious is possible handle multiple events with PostMessage with the following schema:

```js
window.addEventListener('message', newMessage);

function newMessage(event) {
    const {event, data} = event.data;
    eventHandler(event, data); // In this function need use if or key object access by event name.   
}
```

**You can use PostMessage in parallel with iFrameX!**


## Some known bugs
If have error with injection of content, try change order in object `content` of scripts that block the DOM draw, and move to the final.
For example `alert('hi')` block DOM drawing, try move to the final and works!.

[Issue #1](https://github.com/videsk/iFrameX/issues/1).

## License

LGPL-2.1 License - By Videsk™
