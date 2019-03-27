# Sensitive Word Converter

A sensitive word converter/validator based on DFA.

![npm](https://img.shields.io/npm/v/sensitive-word-converter.svg?style=flat-square)
![GitHub package.json version](https://img.shields.io/github/package-json/v/m8524769/sensitive-word-converter.svg?style=flat-square)
![npm](https://img.shields.io/npm/dt/sensitive-word-converter.svg?style=flat-square)

### Getting Started

```shell
$ npm i sensitive-word-converter
```

### Usage
```typescript
import { Converter } from 'sensitive-word-converter';

// A text file containing sensitive words is required
const converter = new Converter('./sensitiveWords.txt');
converter.ready.then(() => {

  // Sensitive word: He, World
  let s0 = converter.convert('Hello World');
  console.log(s0);  // **llo *****

  // Sensitive word: 你好骚啊
  let s1 = converter.convert('你好骚啊！');
  console.log(s1);  // ****！

  // Sensitive word: 哈
  let s2 = converter.convert('哈哈哈哈啪！', '喵');
  console.log(s2);  // 喵喵喵喵啪！

  // String verification
  let r0 = converter.validate('Hello World');
  console.log(r0);  // { pass: false, sensitiveWords: Set { 'He', 'World' } }

})
```

### [ISC License](LICENSE)
