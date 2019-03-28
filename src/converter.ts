import * as fs from 'fs';
import * as readline from 'readline';

export class Converter {

  private sensitiveWordMap: Map<string, any> = new Map();
  public isReady: Promise<any>;

  constructor(filePath: string) {
    this.isReady = new Promise((resolve, reject) => {
      try {
        readline.createInterface({
          input: fs.createReadStream(
            filePath, { encoding: 'UTF-8' }
          )
        }).on('line', line => {
          if (line) {
            let subMap = this.sensitiveWordMap;
            for (const c of line) {
              if (!subMap.has(c)) {
                subMap.set(c, new Map([
                  ['isEnd', false]
                ]));
              }
              subMap = subMap.get(c);
            }
            subMap.set('isEnd', true);
          }
        }).once('close', () => {
          resolve(undefined);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  convert(source: string, substitute: string = '*'): string {
    let target: string = source;
    for (let i = 0; i < source.length; i++) {
      if (source[i] != substitute && this.sensitiveWordMap.has(source[i])) {
        let subMap = this.sensitiveWordMap.get(source[i]);
        if (subMap.get('isEnd')) {  // Single character
          // console.log(`${i}: ${source[i]} -> ${substitute}`);
          target = target.replace(source[i], substitute);
        }
        for (let j = i+1; j < source.length; j++) {
          if (subMap.has(source[j])) {
            subMap = subMap.get(source[j]);
            if (subMap.get('isEnd')) {
              // console.log(`${i}: ${source.substring(i, j + 1)} -> ${substitute.repeat(j - i + 1)}`);
              target = target.replace(
                source.substring(i, j + 1),
                substitute.repeat(j - i + 1)
              );
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

  validate(source: string): Object {
    let pass: boolean = true;
    let sensitiveWords: Set<string> = new Set();
    for (let i = 0; i < source.length; i++) {
      if (this.sensitiveWordMap.has(source[i])) {
        let subMap = this.sensitiveWordMap.get(source[i]);
        if (subMap.get('isEnd')) {
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

}
