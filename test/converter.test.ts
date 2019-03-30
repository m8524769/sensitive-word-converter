import { Converter } from '../src';
import { expect } from 'chai';

describe("Converter test", () => {

  // Only support local file test
  const converter = new Converter('./sensitiveWords.txt');

  it("Test 0", () => {
    const source = 'hhhhhhhychhh';
    const target = 'hhhhhh***hhh';
    expect(converter.convert(source)).to.equal(target);
  });

  it("Test 1", () => {
    const source = 'hello worlds';
    const target = '**llo *****s';
    expect(converter.convert(source)).to.equal(target);
  });

  it("Test 2", () => {
    const source = '哈哈哈哈啪！';
    const target = '喵喵喵喵啪！';
    expect(converter.convert(source, '喵')).to.equal(target);
  });

  it("Test 3", () => {
    const source = '你好骚啊！';
    const target = '****！';
    expect(converter.convert(source)).to.equal(target);
  });

  it("Validation Test", () => {
    const source = 'hello worlds';
    const returnValue = converter.validate(source);
    expect(returnValue).to.include({
      pass: false
    });
  });

});
