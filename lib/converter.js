"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var readline = require("readline");
var https = require("https");
var Converter = (function () {
    function Converter() {
        var urls = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            urls[_i] = arguments[_i];
        }
        var _this = this;
        this._sensitiveWordMap = new Map();
        var requests = [];
        Array.from(new Set(urls)).forEach(function (url) {
            requests.push(new Promise(function (resolve, reject) {
                if (fs.existsSync(url)) {
                    try {
                        readline.createInterface({
                            input: fs.createReadStream(url, { encoding: 'UTF-8' })
                        }).on('line', function (line) {
                            if (line) {
                                _this._addWordToMap(line);
                            }
                        }).once('close', function () {
                            resolve(_this);
                        });
                    }
                    catch (error) {
                        reject(error);
                    }
                }
                else if (/^https:\/\/.+/.test(url)) {
                    https.get(url, function (response) {
                        var rawData = '';
                        response.on('data', function (chunk) {
                            rawData += chunk;
                        }).on('end', function () {
                            for (var _i = 0, _a = rawData.split('\n'); _i < _a.length; _i++) {
                                var line = _a[_i];
                                if (line) {
                                    _this._addWordToMap(line);
                                }
                            }
                            resolve(_this);
                        });
                    }).on('error', function (error) {
                        reject(error);
                    });
                }
                else {
                    reject("The URL: '" + url + "' is invalid or no such file, please check. (Only support HTTPS)");
                }
            }));
        });
        this.isReady = Promise.all(requests);
    }
    Converter.prototype._addWordToMap = function (word) {
        var subMap = this._sensitiveWordMap;
        for (var _i = 0, _a = word.trim(); _i < _a.length; _i++) {
            var char = _a[_i];
            if (!subMap.has(char)) {
                subMap.set(char, new Map([
                    ['isEnd', false]
                ]));
            }
            subMap = subMap.get(char);
        }
        subMap.set('isEnd', true);
    };
    Converter.prototype.convert = function (source, substitute) {
        if (substitute === void 0) { substitute = '*'; }
        var target = source;
        for (var i = 0; i < source.length; i++) {
            if (source[i] != substitute && this._sensitiveWordMap.has(source[i])) {
                var subMap = this._sensitiveWordMap.get(source[i]);
                if (subMap.get('isEnd')) {
                    target = target.replace(source[i], substitute);
                }
                for (var j = i + 1; j < source.length; j++) {
                    if (subMap.has(source[j])) {
                        subMap = subMap.get(source[j]);
                        if (subMap.get('isEnd')) {
                            target = target.replace(source.substring(i, j + 1), substitute.repeat(j - i + 1));
                            i = j;
                            break;
                        }
                    }
                    else {
                        break;
                    }
                }
            }
        }
        return target;
    };
    Converter.prototype.validate = function (source) {
        var pass = true;
        var sensitiveWords = new Set();
        for (var i = 0; i < source.length; i++) {
            if (this._sensitiveWordMap.has(source[i])) {
                var subMap = this._sensitiveWordMap.get(source[i]);
                if (subMap.get('isEnd')) {
                    sensitiveWords.add(source[i]);
                    pass = false;
                }
                for (var j = i + 1; j < source.length; j++) {
                    if (subMap.has(source[j])) {
                        subMap = subMap.get(source[j]);
                        if (subMap.get('isEnd')) {
                            sensitiveWords.add(source.substring(i, j + 1));
                            pass = false;
                            i = j;
                            break;
                        }
                    }
                    else {
                        break;
                    }
                }
            }
        }
        return {
            "pass": pass,
            "sensitiveWords": sensitiveWords
        };
    };
    return Converter;
}());
exports.Converter = Converter;
//# sourceMappingURL=converter.js.map