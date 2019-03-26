import * as fs from 'fs';
import * as readline from 'readline';

export class Converter {

  private sensitiveWordMap: Map<string, any> = new Map();
  private filePath: string = 'sensitiveWords.txt';
  private lineReader = readline.createInterface({
    input: fs.createReadStream(
      this.filePath, { encoding: 'UTF-8' }
    )
  });

  constructor() {
    this.lineReader.on('line', line => {
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
    })
  }

  convert(source: string, substitute: string = '*'): string {
    // console.log(this.sensitiveWordMap);
    let target: string = source;
    for (let i = 0; i < source.length; i++) {
      let subMap = this.sensitiveWordMap;
      if (!subMap.has(source[i])) {
        continue;
      } else {
        // console.log(source[i])
        subMap = subMap.get(source[i]);
        if (subMap.get('isEnd') === true) {  // Single character
          console.log('found ' + source[i]);
          console.log('replaceTo ' + substitute);
          target = target.replace(source[i], substitute);
          console.log(target);
        }
        for (let j = i+1; j < source.length; j++) {
          if (subMap.has(source[j])) {
            subMap = subMap.get(source[j]);
            if (subMap.get('isEnd') === true) {
              console.log('found ' + source.substring(i, j+1));
              console.log('replaceTo ' + substitute.repeat(j-i+1));
              target = target.replace(
                source.substring(i, j + 1),
                substitute.repeat(j - i + 1)
              );
              console.log(target);
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
