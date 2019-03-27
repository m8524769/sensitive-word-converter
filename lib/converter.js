"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var readline = require("readline");
var Converter = (function () {
    function Converter(filePath) {
        var _this = this;
        this.sensitiveWordMap = new Map();
        var lineReader = readline.createInterface({
            input: fs.createReadStream(filePath, { encoding: 'UTF-8' })
        });
        lineReader.on('line', function (line) {
            if (line) {
                var subMap = _this.sensitiveWordMap;
                for (var _i = 0, line_1 = line; _i < line_1.length; _i++) {
                    var c = line_1[_i];
                    if (!subMap.has(c)) {
                        subMap.set(c, new Map([
                            ['isEnd', false]
                        ]));
                    }
                    subMap = subMap.get(c);
                }
                subMap.set('isEnd', true);
            }
        });
    }
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
    Converter.prototype.convert = function (source, substitute) {
        if (substitute === void 0) { substitute = '*'; }
        console.log(this.sensitiveWordMap);
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
    return Converter;
}());
exports.Converter = Converter;
//# sourceMappingURL=converter.js.map