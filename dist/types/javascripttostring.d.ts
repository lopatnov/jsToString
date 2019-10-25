/**
 * Converts JavaScript value to string
 * @param value the value, that converts to string
 * @param references the references to stringified objects
 */
export declare function stringify(value: any, references?: any[]): string;
/**
 * Converts JavaScript value to string
 * @param value the value of any type
 */
declare function javaScriptToString(value: any): string;
export default javaScriptToString;
