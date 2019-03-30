# Sensitive Word Converter

A sensitive word converter/validator based on DFA.

[![Travis (.com)](https://img.shields.io/travis/com/m8524769/sensitive-word-converter.svg?style=flat-square)](https://travis-ci.com/m8524769/sensitive-word-converter)
[![npm](https://img.shields.io/npm/v/sensitive-word-converter.svg?style=flat-square)](https://www.npmjs.com/package/sensitive-word-converter)
[![npm](https://img.shields.io/npm/dt/sensitive-word-converter.svg?style=flat-square)](https://www.npmjs.com/package/sensitive-word-converter)

### Getting Started

```shell
$ npm i sensitive-word-converter
```

### Usage

```typescript
import { Converter } from 'sensitive-word-converter';

// A text file containing sensitive words is required (can be an url)
const converter = new Converter('./sensitiveWords.txt');
converter.isReady.then(() => {

  // Sensitive word: He, World
  let s0 = converter.convert('Hello World');
  console.log(s0);  // **llo *****

  // Sensitive word: 你好骚啊
  let s1 = converter.convert('你好骚啊！');
  console.log(s1);  // ****！

  // Sensitive word: 哈
  let s2 = converter.convert('哈哈哈哈啪！', '喵');
  console.log(s2);  // 喵喵喵喵啪！

  // String validation
  let r0 = converter.validate('Hello World');
  console.log(r0);  // { pass: false, sensitiveWords: Set { 'He', 'World' } }

}).catch(e => {
  console.error(e);
  // Handle error
})
```

### Sensitive Words Example

- [fwwdn/sensitive-stop-words](https://github.com/fwwdn/sensitive-stop-words)

- [observerss/textfilter](https://github.com/observerss/textfilter)

- [57ing/Sensitive-word](https://github.com/57ing/Sensitive-word)

- [qloog/sensitive_words](https://github.com/qloog/sensitive_words)

### Todo List

- [X] String validation
- [ ] Random substitute symbol
- [ ] Craw word list with Python
- [X] Construct the Converter with fileURL
- [ ] Ignore special symbols in strings
- [ ] Add support for multi-file word lists

### For Developers/Testers

```shell
$ git clone --depth=1 https://github.com/m8524769/sensitive-word-converter.git
$ cd ./sensitive-word-converter
$ npm i --only=dev
$ npm run build
$ npm test
```

### [ISC License](LICENSE)

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fm8524769%2Fsensitive-word-converter.svg?type=small)](https://app.fossa.com/projects/git%2Bgithub.com%2Fm8524769%2Fsensitive-word-converter?ref=badge_small)
