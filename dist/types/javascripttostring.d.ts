export interface IJ2SOptions {
    /** Include function's own enumerable properties. @defaultValue true */
    includeFunctionProperties?: boolean;
    /** Include function's prototype properties. @defaultValue true */
    includeFunctionPrototype?: boolean;
    /** Include ArrayBuffer and TypedArray contents. @defaultValue true */
    includeBuffers?: boolean;
    /** Max depth for nested objects. @defaultValue Number.POSITIVE_INFINITY */
    nestedObjectsAmount?: number;
    /** Max depth for nested arrays. @defaultValue Number.POSITIVE_INFINITY */
    nestedArraysAmount?: number;
    /** Max depth for nested functions. @defaultValue Number.POSITIVE_INFINITY */
    nestedFunctionsAmount?: number;
}
/**
 * Converts JavaScript value to string
 * @param value the value of any type
 * @param options [optional] The options of conversion
 */
declare function javaScriptToString(value: any, options?: IJ2SOptions): string;
export default javaScriptToString;
