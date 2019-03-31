export declare class Converter {

  /**
   * Whether the Converter is ready to work.
   */
  isReady: Promise<any>

  /**
   * @param {string[]} urls Paths of text files containing sensitive words, one word for each line. (Local file is recommended)
   * @constructor A sensitive word converter
   */
  constructor(...urls: string[])

  /**
   * @param {string} source The string you want to convert.
   * @param {string=} substitute The character used to replace sensitive word, Default: '*'.
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
