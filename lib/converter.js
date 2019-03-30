"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var readline = require("readline");
var http = require("https");
var Converter = (function () {
    function Converter(url) {
        var _this = this;
        this.sensitiveWordMap = new Map();
        this.isReady = new Promise(function (resolve, reject) {
            if (fs.existsSync(url)) {
                try {
                    readline.createInterface({
                        input: fs.createReadStream(url, { encoding: 'UTF-8' })
                    }).on('line', function (line) {
                        if (line) {
                            _this.addWordToMap(line);
                        }
                    }).once('close', function () {
                        resolve(_this);
                    });
                }
                catch (error) {
                    reject(error);
                }
            }
            else {
                http.get(url, function (response) {
                    var rawData = '';
                    response.on('data', function (chunk) {
                        rawData += chunk;
                    }).on('end', function () {
                        for (var _i = 0, _a = rawData.split('\n'); _i < _a.length; _i++) {
                            var line = _a[_i];
                            if (line) {
                                _this.addWordToMap(line);
                            }
                        }
                        resolve(_this);
                    });
                }).on('error', function (error) {
                    reject(error);
                });
            }
        });
    }
    Converter.prototype.addWordToMap = function (word) {
        var subMap = this.sensitiveWordMap;
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
            if (source[i] != substitute && this.sensitiveWordMap.has(source[i])) {
                var subMap = this.sensitiveWordMap.get(source[i]);
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
            if (this.sensitiveWordMap.has(source[i])) {
                var subMap = this.sensitiveWordMap.get(source[i]);
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