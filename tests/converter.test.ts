import { Converter } from '../src';
import { expect } from 'chai';

describe("Converter test", () => {
  const converter = new Converter();
  it("Test1 success", () => {
    const source = 'hello worlds';
    const target = '**llo *****s';
    expect(converter.convert(source)).to.equal(target);
  });
  it("Test2 success", () => {
    const source = '哈哈哈哈啪！';
    const target = '喵喵喵喵啪！';
    expect(converter.convert(source, '喵')).to.equal(target);
  });
  it("Test3 success", () => {
    const source = '你好骚啊！';
    const target = '****！';
    expect(converter.convert(source)).to.equal(target);
  });
});
