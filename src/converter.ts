import * as fs from 'fs';
import * as readline from 'readline';
import * as https from 'https';

export class Converter {

  private _sensitiveWordMap: Map<string, any> = new Map();
  public isReady: Promise<Converter>;

  constructor(...urls: string[]) {
    this.isReady = Promise.all(
      Array.from(new Set(urls), url => new Promise(  // Deduplication
        (resolve, reject) => {
          if (fs.existsSync(url)) {  // Check local file
            try {
              readline.createInterface({
                input: fs.createReadStream(
                  url, { encoding: 'UTF-8' }
                )
              }).on('line', line => {
                if (line) {
                  this._addWordToMap(line);
                }
              }).once('close', () => {
                resolve();
              });
            } catch (error) {
              reject(error);
            }
          } else if (url.startsWith('https://')) {  // HTTPS only
            https.get(url, response => {
              if (response.statusCode != 200) {
                reject(new Error(
                  `${response.statusCode} ${response.statusMessage} on '${url}'`
                ));
              }
              let rawData: string = '';
              response.on('data', chunk => {
                rawData += chunk;
              }).on('end', () => {
                for (const line of rawData.split('\n')) {
                  if (line) {
                    this._addWordToMap(line);
                  }
                }
                resolve();
              });
            }).on('error', error => {
              reject(error);
            });
          } else {  // Invalid URL
            reject(new Error(
              `'${url}' is an invalid path or no such file, please check. (Only support HTTPS)`
            ));
          }
        })
      )
    ).then(_ => this);  // Return the converter
  }

  _addWordToMap(word: string): void {
    let subMap = this._sensitiveWordMap;
    for (const char of word.trim()) {
      if (!subMap.has(char)) {
        subMap.set(char, new Map([
          ['isEnd', false]
        ]));
      }
      subMap = subMap.get(char);
    }
    subMap.set('isEnd', true);
  }

  convert(source: string, substitute: string = '*'): string {
    let target: string = source;
    for (let i = 0; i < source.length; i++) {
      if (source[i] != substitute && this._sensitiveWordMap.has(source[i])) {
        let subMap = this._sensitiveWordMap.get(source[i]);
        if (subMap.get('isEnd')) {  // Match single character
          // console.log(`${i}: ${source[i]} -> ${substitute}`);
          target = target.replace(source[i], substitute);
        }
        for (let j = i + 1; j < source.length; j++) {
          if (subMap.has(source[j])) {
            subMap = subMap.get(source[j]);
            if (subMap.get('isEnd')) {
              // console.log(`${i}: ${source.substring(i, j + 1)} -> ${substitute.repeat(j - i + 1)}`);
              target = target.replace(
                source.substring(i, j + 1),
                substitute.repeat(j - i + 1)
              );
              i = j;
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
      if (this._sensitiveWordMap.has(source[i])) {
        let subMap = this._sensitiveWordMap.get(source[i]);
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
              i = j;
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
