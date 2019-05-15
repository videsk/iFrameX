# iFrameX

iFrameX is a javascript class for generate iframes with a really simple schema, also have a EventListener natively for postMessages.

This library is not compatible with IE11. Is designed only for modern browsers.

:rotating_light: **CAUTION! Never send password or credentials via postMessages, can be intercepted by others scripts.**

## Index

- [Demo](https://github.com/matiaslopezd/iFrameX#demo)
- [How to use](https://github.com/matiaslopezd/iFrameX#how-to-use)
- [Configuration](https://github.com/matiaslopezd/iFrameX#configuration)
  - [attr](https://github.com/matiaslopezd/iFrameX#attr)
  - [content](https://github.com/matiaslopezd/iFrameX#content)
    - type
    - append
    - content
    - attr
  - [append](https://github.com/matiaslopezd/iFrameX#append)
  - [config](https://github.com/matiaslopezd/iFrameX#config)
    - debug
    - action
- [License](https://github.com/matiaslopezd/iFrameX#license)

## Demo

[Demo here](https://matiaslopezd.github.io/iFrameX/examples/)

## How to use

Use iFrameX is really easy only need two things:

```js
const iframe = new iFrameX({...}); // ... is the configuration
```
```js
iframe.init();
```

## Configuration

Configuration is a object can accept these parameters:

- attr: _`Object` with attributes of iframe_,
- content: _`Object` or `Array` with a content of iframe_,
- append: _`String` of element where append iframe in query format_,
- config: _`Object` with some settings parameters_,

### attr

```js
attr: {
  width: 100,
  height: 100,
  class: 'myiframe'
},
```

### content

This allow add elements in `Object` format. Can set these parameters:

- type: _`String` value of element to create. `REQUIRED`_,
- append: _`String` value of element where append the new element to create. By default is `body`. `OPTIONAL`_,
- content: _`String` value of content element, can be `HTML`, `Javascript`, `CSS`, etc. `OPTIONAL`_,
- attr: _`Object` value of attibutes of element. `OPTIONAL`_

**Object example**
```js
content: {
  type: script,
  append: 'body'
  content: `alert('This executed from iframe')`,
  attr: {
    async: true
  },
},
```

**Array example**
```js
content: [
  {
    type: 'script',
    append: 'body',
    content: `alert('This executed from iframe')`,
    attr: {
      async: true
    },
  },
  {
    type: 'link',
    append: 'head',
    attr: {
      href: 'https://cdn.example.com/assets/css/main.css' ,
      rel: 'stylesheet'
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
]
```

### append

Set where is appended the iframe and the append value need be in elements query selector format. Read more about elements query selector format [here](https://developer.mozilla.org/es/docs/Web/API/Document/querySelector).

```js
append: 'body',
```
```js
append: '#myid',
```
```js
append: '[data-id="893283420949032"]',
```

### config

In config parameters you can activate debug mode `true/false` for show errors and set the action function for postMessage.

```js
config: {
  debug: true,
  action: function (msg) {
    // Your function code. Please read more about postMessage - https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage
  },
},
```

## License

MIT Lincense - By Matias Lopez for Videsk™
