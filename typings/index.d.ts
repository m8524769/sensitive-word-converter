export declare class Converter {

  /**
   * Whether the Converter is ready to work.
   */
  isReady: Promise<any>

  /**
   *
   * @param filePath A text file containing sensitive words. (one word for each line)
   */
  constructor(filePath: string)

  /**
   * Returns a string whose sensitive words were replaced by substitutes.
   * @param source The string you want to convert.
   * @param substitute The character used to replace sensitive word, Default: '*'.
   */
  convert(source: string, substitute?: string): string

  /**
   * Return an Object {
   *   pass: boolean,
   *   sensitiveWords: Set {}
   * }
   * @param source A string to check for sensitive words inside.
   */
  validate(source: string): Object

}
