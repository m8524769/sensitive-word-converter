import { Converter } from '../src';
import { expect } from 'chai';

interface TestSuite {
  name: string;
  testCases: TestCase[];
}

interface TestCase {
  name: string;
  args: string[];
  expect: string;
}

const TEST_SUITES: TestSuite[] = [
  {
    name: '空值测试',
    testCases: [
      {
        name: '默认替换字符',
        args: [''],
        expect: ''
      },
      {
        name: '指定替换字符',
        args: ['', '_'],
        expect: ''
      },
    ]
  },
  {
    name: '西文敏感词测试',
    testCases: [
      {
        name: '无敏感词',
        args: ['safe'],
        expect: 'safe'
      },
      {
        name: '单个敏感词',
        args: ['hello'],
        expect: '**llo'
      },
      {
        name: '多个敏感词（分离）',
        args: ['hello world'],
        expect: '**llo *****'
      },
      {
        name: '多个敏感词（相连）',
        args: ['hehello'],
        expect: '****llo'
      },
      {
        name: '完全匹配',
        args: ['world'],
        expect: '*****'
      },
      {
        name: '单字母敏感词',
        args: ['x'],
        expect: '*'
      },
      {
        name: '指定替换字符',
        args: ['hello', '_'],
        expect: '__llo'
      },
    ]
  },
  {
    name: '中文敏感词测试',
    testCases: [
      {
        name: '无敏感词',
        args: ['你好啊'],
        expect: '你好啊'
      },
      {
        name: '单个敏感词',
        args: ['哈麻批'],
        expect: '*麻批'
      },
      {
        name: '多个敏感词（分离）',
        args: ['哈麻批呦哈麻批'],
        expect: '*麻批呦*麻批'
      },
      {
        name: '多个敏感词（相连）',
        args: ['哈哈哈哈哈麻批'],
        expect: '*****麻批'
      },
      {
        name: '完全匹配',
        args: ['你好骚啊'],
        expect: '****'
      },
      {
        name: '单汉字敏感词',
        args: ['哈'],
        expect: '*'
      },
      {
        name: '指定替换中文',
        args: ['哈哈哈哈啪！', '喵'],
        expect: '喵喵喵喵啪！'
      },
    ]
  },
  {
    name: '敏感数字测试',
    testCases: [
      {
        name: '无敏感数字',
        args: ['12345'],
        expect: '12345'
      },
      {
        name: '单个敏感数字',
        args: ['12345996'],
        expect: '12345***'
      },
      {
        name: '多个敏感数字（分离）',
        args: ['996345996'],
        expect: '***345***'
      },
      {
        name: '多个敏感数字（相连）',
        args: ['123996996'],
        expect: '123******'
      },
      {
        name: '完全匹配',
        args: ['996'],
        expect: '***'
      },
      {
        name: '指定替换字符',
        args: ['12345996', '_'],
        expect: '12345___'
      },
    ]
  },
  {
    name: '特殊符号测试',
    testCases: [
      {
        name: '无敏感词',
        args: ['( •̀ ω •́ )✧'],
        expect: '( •̀ ω •́ )✧'
      },
      {
        name: '有敏感词',
        args: ['ヾ(≧▽≦*)o'],
        expect: '********'
      },
      {
        name: '指定替换字符',
        args: ['ヾ(≧▽≦*)o', '_'],
        expect: '________'
      },
    ]
  },
  {
    name: '表情符号测试',
    testCases: [
      {
        name: '无敏感表情',
        args: ['🤣🤣🤣'],
        expect: '🤣🤣🤣'
      },
      {
        name: '有敏感表情',
        args: ['🙄🙄🙄'],
        expect: '******'
      },
      {
        name: '指定替换字符',
        args: ['🙄🙄🙄', '_'],
        expect: '______'
      },
    ]
  },
  {
    name: '敏感词位置测试',
    testCases: [
      {
        name: '位于字符串开头',
        args: ['heend'],
        expect: '**end'
      },
      {
        name: '位于字符串中部',
        args: ['frontheend'],
        expect: 'front**end'
      },
      {
        name: '位于字符串末尾',
        args: ['fronthe'],
        expect: 'front**'
      },
    ]
  },
  {
    name: '特殊情况',
    testCases: [
      {
        name: '包含默认替换字符',
        args: ['*****'],
        expect: '*****'
      },
      {
        name: '包含指定替换字符',
        args: ['_____', '_'],
        expect: '_____'
      },
      {
        name: '指定替换字符为表情符号',
        args: ['🙄🙄🙄', '🤣'],
        expect: '🤣🤣🤣'
      },
      {
        name: '指定替换字符为空',
        args: ['hello', ''],
        expect: 'llo'
      },
    ]
  },
];

describe('Converter', () => {

  let cvt: Converter;

  before(async () => {
    await new Converter(
      './sensitiveWords.txt',
      'https://raw.githubusercontent.com/fwwdn/sensitive-stop-words/master/%E5%B9%BF%E5%91%8A.txt'
    ).isReady.then(converter => {
      cvt = converter;
    });
  });

  describe('#convert()', () => {
    TEST_SUITES.forEach(testSuite => {
      describe(testSuite.name, () => {
        testSuite.testCases.forEach(testCase => {
          it(testCase.name, () => {
            expect(cvt.convert.apply(cvt, testCase.args))
              .to.equal(testCase.expect);
          });
        });
      });
    });
  });

});
