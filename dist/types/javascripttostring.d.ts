export interface IJ2SOptions {
    includeFunctionProperties?: boolean;
    includeFunctionPrototype?: boolean;
}
/**
 * Converts JavaScript value to string
 * @param value the value of any type
 * @param options [optional] The options of conversion
 */
declare function javaScriptToString(value: any, options?: IJ2SOptions): string;
export default javaScriptToString;
