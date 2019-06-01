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
    name: 'Test Suite #1',
    testCases: [
      {
        name: 'he, world',
        args: ['hello world'],
        expect: '**llo *****'
      },
      {
        name: '哈 -> 喵',
        args: ['哈哈哈哈啪！', '喵'],
        expect: '喵喵喵喵啪！'
      },
      {
        name: '你好骚啊',
        args: ['你好骚啊！'],
        expect: '****！'
      },
    ]
  },
  {
    name: 'Test Suite #2',
    testCases: [
      {
        name: 'hyc -> _',
        args: ['cccchycccc', '_'],
        expect: 'cccc___ccc'
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
