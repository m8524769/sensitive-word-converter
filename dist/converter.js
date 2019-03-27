"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const readline = require("readline");
class Converter {
    constructor(filePath = 'sensitiveWords.txt') {
        this.sensitiveWordMap = new Map();
        const lineReader = readline.createInterface({
            input: fs.createReadStream(filePath, { encoding: 'UTF-8' })
        });
        lineReader.on('line', line => {
            if (line) {
                let subMap = this.sensitiveWordMap;
                for (let c of line) {
                    if (!subMap.has(c)) {
                        subMap.set(c, new Map([
                            ['isEnd', false]
                        ]));
                    }
                    subMap = subMap.get(c);
                }
                subMap.set('isEnd', true);
            }
            console.log(this.sensitiveWordMap);
        });
    }
    validate(source) {
        let pass = true;
        let sensitiveWords = new Set();
        for (let i = 0; i < source.length; i++) {
            if (this.sensitiveWordMap.has(source[i])) {
                let subMap = this.sensitiveWordMap.get(source[i]);
                if (subMap.get('isEnd')) {
                    sensitiveWords.add(source[i]);
                    pass = false;
                }
                for (let j = i + 1; j < source.length; j++) {
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
    }
    convert(source, substitute = '*') {
        let target = source;
        for (let i = 0; i < source.length; i++) {
            if (source[i] != substitute && this.sensitiveWordMap.has(source[i])) {
                let subMap = this.sensitiveWordMap.get(source[i]);
                if (subMap.get('isEnd')) {
                    target = target.replace(source[i], substitute);
                }
                for (let j = i + 1; j < source.length; j++) {
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
    }
}
exports.Converter = Converter;
//# sourceMappingURL=converter.js.map