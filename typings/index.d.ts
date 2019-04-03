export declare class Converter {

  /**
   * Whether the Converter is ready to work.
   */
  isReady: Promise<Converter>

  /**
   * @param {...string} urls Paths of text files containing sensitive words, one word for each line.
   * - _Only support URLs with HTTPS._
   * - _Local file is recommended._
   * @constructor A sensitive word converter
   */
  constructor(...urls: string[])

  /**
   * @param {string} source The string you want to convert.
   * @param {string=} substitute The character used to replace sensitive word.
   * - _Default: '*'._
   * @returns {string} A string whose sensitive words were replaced by substitutes.
   */
  convert(source: string, substitute?: string): string

  /**
   * @param {string} source A string to check for sensitive words inside.
   * @returns {Object} An Object like {
   *   pass: boolean,
   *   sensitiveWords: Set {}
   * }
   */
  validate(source: string): Object

}
