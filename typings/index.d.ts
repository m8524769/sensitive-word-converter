export declare class Converter {

  constructor(filePath: string)

  convert(source: string, substitute: string): string
  convert(source: string): string
  validate(source: string): Object

}
