"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var readline = require("readline");
var https = require("https");
var Converter = (function () {
    function Converter() {
        var _this = this;
        var urls = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            urls[_i] = arguments[_i];
        }
        this._sensitiveWordMap = new Map();
        this.isReady = Promise.all(Array.from(new Set(urls), function (url) { return new Promise(function (resolve, reject) {
            if (fs.existsSync(url)) {
                try {
                    readline.createInterface({
                        input: fs.createReadStream(url, { encoding: 'UTF-8' })
                    }).on('line', function (line) {
                        if (line) {
                            _this._addWordToMap(line);
                        }
                    }).once('close', function () {
                        resolve();
                    });
                }
                catch (error) {
                    reject(error);
                }
            }
            else if (url.startsWith('https://')) {
                https.get(url, function (response) {
                    if (response.statusCode != 200) {
                        reject(new Error(response.statusCode + " " + response.statusMessage + " on '" + url + "'"));
                    }
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
                        resolve();
                    });
                }).on('error', function (error) {
                    reject(error);
                });
            }
            else {
                reject(new Error("'" + url + "' is an invalid path or no such file, please check. (Only support HTTPS)"));
            }
        }); })).then(function (_) { return _this; });
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