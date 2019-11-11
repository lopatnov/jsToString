import getObjectType from "get-internal-type";

export interface IJ2SOptions {
  includeFunctionProperties?: boolean;
  includeFunctionPrototype?: boolean;
}

function numberToString(value: number): string {
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
    case Math.PI:
      return "Math.PI";
    case Math.E:
      return "Math.E";
    case Math.LN10:
      return "Math.LN10";
    case Math.LN2:
      return "Math.LN2";
    case Math.LOG10E:
      return "Math.LOG10E";
    case Math.LOG2E:
      return "Math.LOG2E";
    case Math.SQRT1_2:
      return "Math.SQRT1_2";
    case Math.SQRT2:
      return "Math.SQRT2";
    default:
      return String(value);
  }
}

function symbolToString(value: any): string {
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
}

function dateToString(value: Date): string {
  if (isNaN(value.getTime())) {
    return `new Date(${value.toString()})`;
  }
  return `new Date(${value.toISOString()})`;
}

function errorToString(value: any): string {
  let message = JSON.stringify(value.message),
    fileName = JSON.stringify(value.fileName),
    lineNumber = JSON.stringify(value.lineNumber);
  return `new Error(${message}, ${fileName}, ${lineNumber})`;
}

function arrayToString(
  value: Array<any>,
  options: IJ2SOptions,
  referenceValues: any[]
): string {
  if (value.length === 0) return "[]";
  value[0] = stringifyRef(value[0], options, referenceValues);
  let arrayValues = value.reduce(
    (x1: any, x2: any) => `${x1}, ${stringifyRef(x2, options, referenceValues)}`
  );
  return `[${arrayValues}]`;
}

function setToString(
  value: Set<any>,
  options: IJ2SOptions,
  referenceValues: any[]
): string {
  let setValues: string[] = [];

  value.forEach((value1: any, value2: any, set: Set<any>) => {
    setValues.push(stringifyRef(value2, options, referenceValues));
  });

  if (setValues.length === 0) return "new Set()";

  return `new Set([${setValues.join(", ")}])`;
}

function mapToString(
  value: Map<any, any>,
  options: IJ2SOptions,
  referenceValues: any[]
): string {
  let mapValues: string[] = [];

  value.forEach((indexValue: any, key: any) => {
    mapValues.push(
      `[${stringifyRef(key, options, referenceValues)}, ${stringifyRef(
        indexValue,
        options,
        referenceValues
      )}]`
    );
  });

  if (mapValues.length === 0) return "new Map()";

  return `new Map([${mapValues.join(", ")}])`;
}

function objectToString(
  value: any,
  options: IJ2SOptions,
  referenceValues: any[]
): string {
  let objectValues = [];

  for (let propertyName in value) {
    if (value.hasOwnProperty(propertyName))
      objectValues.push(
        `${propertyName}: ${stringifyRef(
          value[propertyName],
          options,
          referenceValues
        )}`
      );
  }

  if (objectValues.length === 0) return "{}";

  return `{\n${objectValues.join(",\n")}\n}`;
}

function functionToString(
  value: any,
  options: IJ2SOptions,
  referenceValues: any[]
): string {
  let functionName = value.name || "anonymousFunction";
  let functionObject = "";
  let functionPrototype = "";

  if (options.includeFunctionProperties) {
    for (let propertyName in value) {
      if (value.hasOwnProperty(propertyName))
        functionObject += `${functionName}.${propertyName} = ${stringifyRef(
          value[propertyName],
          options,
          referenceValues
        )};\n`;
    }
  }

  if (options.includeFunctionPrototype) {
    for (let propertyName in value.prototype) {
      if (value.prototype.hasOwnProperty(propertyName))
        functionObject += `${functionName}.prototype.${propertyName} = ${stringifyRef(
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
      return String(value);
    case "regexp":
      return String(value);
    case "string":
      return JSON.stringify(value);
    case "number":
      return numberToString(value);
    case "bigint":
      return `BigInt(${value})`;
    case "symbol":
      return symbolToString(value);
    case "date":
      return dateToString(value);
    case "error":
      return errorToString(value);
    case "array":
      return arrayToString(value, options, referenceValues);
    case "set":
      return setToString(value, options, referenceValues);
    case "map":
      return mapToString(value, options, referenceValues);
    case "object":
      return objectToString(value, options, referenceValues);
    case "function":
      return functionToString(value, options, referenceValues);
    default:
      return JSON.stringify(value);
  }
}

/**
 * Stringify the value, if it wasn't before
 * @param value the value, that converts to string
 * @param references the references to stringified objects
 */
function stringifyRef(
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
