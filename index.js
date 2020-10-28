const iFrameX = require('./src');

if (typeof module !== 'undefined') {
    module.exports = exports = iFrameX;
}

if (typeof define === 'function' && define.amd) {
    define('iFrameX', [], function() {
        return iFrameX;
    });
}
