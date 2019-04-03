import { Converter } from '../src';
import { expect } from 'chai';

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

    let tests = [
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

    tests.forEach(test => {
      it(test.name, () => {
        expect(cvt.convert.apply(cvt, test.args))
          .to.equal(test.expect);
      })
    })

  });

  describe('#validate()', () => {
    it('hello world', () => {
      expect(cvt.validate('hello world'))
        .to.include({
          pass: false
        });
    });
  });

});
