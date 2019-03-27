import * as fs from 'fs';
import * as readline from 'readline';

export class Converter {

  private sensitiveWordMap: Map<string, any> = new Map();

  constructor(filePath: string = 'sensitiveWords.txt') {
    const lineReader = readline.createInterface({
      input: fs.createReadStream(
        filePath, { encoding: 'UTF-8' }
      )
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
    });
  }

  validate(source: string): Object {
    let pass: boolean = true;
    let sensitiveWords: Set<string> = new Set();
    for (let i = 0; i < source.length; i++) {
      if (this.sensitiveWordMap.has(source[i])) {
        let subMap = this.sensitiveWordMap.get(source[i]);
        if (subMap.get('isEnd')) {  // Single character
          sensitiveWords.add(source[i]);
          pass = false;
        }
        for (let j = i+1; j < source.length; j++) {
          if (subMap.has(source[j])) {
            subMap = subMap.get(source[j]);
            if (subMap.get('isEnd')) {
              sensitiveWords.add(source.substring(i, j + 1));
              pass = false;
              break;
            }
          } else {
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

  convert(source: string, substitute: string = '*'): string {
    // console.log(this.sensitiveWordMap);
    let target: string = source;
    for (let i = 0; i < source.length; i++) {
      if (source[i] != substitute && this.sensitiveWordMap.has(source[i])) {
        let subMap = this.sensitiveWordMap.get(source[i]);
        if (subMap.get('isEnd')) {  // Single character
          // console.log('Found ' + source[i]);
          // console.log('ReplaceTo ' + substitute);
          target = target.replace(source[i], substitute);
          // console.log('Result ' + target);
        }
        for (let j = i+1; j < source.length; j++) {
          if (subMap.has(source[j])) {
            subMap = subMap.get(source[j]);
            if (subMap.get('isEnd')) {
              // console.log('Found ' + source.substring(i, j + 1));
              // console.log('ReplaceTo ' + substitute.repeat(j - i + 1));
              target = target.replace(
                source.substring(i, j + 1),
                substitute.repeat(j - i + 1)
              );
              // console.log('Result ' + target);
              break;
            }
          } else {
            break;
          }
        }
      }
    }
    return target;
  }

}
