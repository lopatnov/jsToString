import getObjectType from "get-internal-type";

export interface IJ2SOptions {
  includeFunctionProperties?: boolean;
  includeFunctionPrototype?: boolean;
}

/**
 * Converts to string the value, if it wasn't before
 * @param value the value, that converts to string
 * @param references the references to stringified objects
 */
function stringify(
  value: any,
  options: IJ2SOptions,
  references?: any[]
): string {
  let referenceValues: any[] = references || [value];
  switch (getObjectType(value)) {
    case "undefined":
      return "undefined";
    case "null":
      return "null";
    case "boolean":
    case "regexp":
      return String(value);
    case "string":
      return JSON.stringify(value);
    case "number":
      if (Number.isNaN(value)) {
        return "Number.NaN";
      }
      switch (value) {
        case Number.POSITIVE_INFINITY:
          return "Number.POSITIVE_INFINITY";
        case Number.NEGATIVE_INFINITY:
          return "Number.NEGATIVE_INFINITY";
        case Number.EPSILON:
          return "Number.EPSILON";
        case Number.MAX_SAFE_INTEGER:
          return "Number.MAX_SAFE_INTEGER";
        case Number.MIN_SAFE_INTEGER:
          return "Number.MIN_SAFE_INTEGER";
        case Number.MAX_VALUE:
          return "Number.MAX_VALUE";
        case Number.MIN_VALUE:
          return "Number.MIN_VALUE";
        default:
          return String(value);
      }
    case "bigint":
      return `BigInt(${value})`;
    case "symbol":
      switch (value) {
        case Symbol.asyncIterator:
        case Symbol.hasInstance:
        case Symbol.isConcatSpreadable:
        case Symbol.iterator:
        case Symbol.match:
        case Symbol.prototype:
        case Symbol.replace:
        case Symbol.search:
        case Symbol.species:
        case Symbol.split:
        case Symbol.toPrimitive:
        case Symbol.toStringTag:
        case Symbol.unscopables:
          return value.description;
        default:
          let description = value.description ? `"${value.description}"` : "";
          return `Symbol(${description})`;
      }
    case "date":
      if (isNaN(value.getTime())) {
        return `new Date(${value.toString()})`;
      }
      return `new Date(${value.toISOString()})`;
    case "error":
      let message = JSON.stringify(value.message),
        fileName = JSON.stringify(value.fileName),
        lineNumber = JSON.stringify(value.lineNumber);
      return `new Error(${message}, ${fileName}, ${lineNumber})`;
    case "array":
      if (value.length === 0) return "[]";
      value[0] = strignifyRef(value[0], options, referenceValues);
      let arrayValues = value.reduce(
        (x1: any, x2: any) =>
          `${x1}, ${strignifyRef(x2, options, referenceValues)}`
      );
      return `[${arrayValues}]`;
    case "set":
      let setValues: string[] = [];

      value.forEach((value1: any, value2: any, set: Set<any>) => {
        setValues.push(strignifyRef(value2, options, referenceValues));
      });

      if (setValues.length === 0) return "new Set()";

      return `new Set([${setValues.join(", ")}])`;
    case "map":
      let mapValues: string[] = [];

      value.forEach((indexValue: any, key: any) => {
        mapValues.push(
          `[${strignifyRef(key, options, referenceValues)}, ${strignifyRef(
            indexValue,
            options,
            referenceValues
          )}]`
        );
      });

      if (mapValues.length === 0) return "new Map()";

      return `new Map([${mapValues.join(", ")}])`;
    case "object":
      let objectValues = [];

      for (let propertyName in value) {
        if (value.hasOwnProperty(propertyName))
          objectValues.push(
            `${propertyName}: ${strignifyRef(
              value[propertyName],
              options,
              referenceValues
            )}`
          );
      }

      if (objectValues.length === 0) return "{}";

      return `{\n${objectValues.join(",\n")}\n}`;
    case "function":
      let functionName = value.name || "anonymousFunction";
      let functionObject = "";
      let functionPrototype = "";

      if (options.includeFunctionProperties) {
        for (let propertyName in value) {
          if (value.hasOwnProperty(propertyName))
            functionObject += `${functionName}.${propertyName} = ${strignifyRef(
              value[propertyName],
              options,
              referenceValues
            )};\n`;
        }
      }

      if (options.includeFunctionPrototype) {
        for (let propertyName in value.prototype) {
          if (value.prototype.hasOwnProperty(propertyName))
            functionObject += `${functionName}.prototype.${propertyName} = ${strignifyRef(
              value.prototype[propertyName],
              options,
              referenceValues
            )};\n`;
        }
      }

      if (!functionObject && !functionPrototype) {
        return String(value);
      }
      return `(function(){\n var ${functionName} = ${String(
        value
      )};\n ${functionObject}\n ${functionPrototype}\n return ${functionName};\n}())`;
    default:
      return JSON.stringify(value);
  }
}

/**
 * Stringify the value, if it wasn't before
 * @param value the value, that converts to string
 * @param references the references to stringified objects
 */
function strignifyRef(
  value: any,
  options: IJ2SOptions,
  references: any[]
): string {
  if (references.indexOf(value) < 0) {
    let referencesLength = references.length;
    references.push(value);
    let refString = stringify(value, options, references);
    references.splice(referencesLength);
    return refString;
  }
  return "null";
}

/**
 * Converts JavaScript value to string
 * @param value the value of any type
 * @param options [optional] The options of conversion
 */
function javaScriptToString(value: any, options?: IJ2SOptions): string {
  let opt: IJ2SOptions = options || {};
  if (opt.includeFunctionProperties === undefined)
    opt.includeFunctionProperties = true;
  if (opt.includeFunctionPrototype === undefined)
    opt.includeFunctionPrototype = true;

  return stringify(value, opt);
}

export default javaScriptToString;
