import getObjectType from "@lopatnov/get-internal-type";

export interface IJ2SOptions {
  includeFunctionProperties?: boolean; // default true
  includeFunctionPrototype?: boolean; // default true
  includeBuffers?: boolean; // default true
  nestedObjectsAmount?: number; // default Number.POSITIVE_INFINITY
  nestedArraysAmount?: number; // default Number.POSITIVE_INFINITY
  nestedFunctionsAmount?: number; // default Number.POSITIVE_INFINITY
}

interface RefInstance {
  historyRef: Array<any>,
  source: any
}

var refs: RefInstance[] = [];
var counter = 0;

interface IJ2SHistory {
  references: any[];
  nestedObjectsLeft: number;
  nestedArraysLeft: number;
  nestedFunctionsLeft: number;
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
  history: IJ2SHistory
): string {
  if (value.length === 0) return "[]";
  let arrayValues = value.reduce(
    (x1: any, x2: any, index: number) => {
      history.references.push(index.toString());
      let str = !!x1 ? `${x1}, ` : '';
      str += stringifyRef(x2,options,history);
      history.references.pop();
      return str;
    }, '');
  return attachActions(getLocalRefs(value), `[${arrayValues}]`);
}

function getLocalRefs(value: any) {
  return refs.filter(x => x.source === value)
}

function attachActions(localRefs: RefInstance[], result: string) {
  if (localRefs.length > 0) {
    counter = (counter++) % Number.MAX_SAFE_INTEGER;
    const localName = `___j2s_${counter}`;
    const actions = localRefs.reduce((x1: string, x2: RefInstance) => {
      const action = converToAction(localName, x2);
      refs.splice(refs.indexOf(x2), 1);
      return x1 + action;
    }, '');
    return `(function(){ var ${localName} = ${result}; ${actions} return ${localName}; }())`;
  }
  return result;
}

function converToAction(localName: string, r: RefInstance) {
  const destIndex = r.historyRef.indexOf(r.source);
  if (destIndex < 0) {
    return '';
  }

  const dest = r.historyRef.slice(destIndex);
  let sourceObj: any;
  let path = '';
  for (let i = 0; i < dest.length; i++) {
    const destObj = dest[i];
    if (destObj === r.source) {
      path = localName;
      sourceObj = r.source;
    } else if (typeof destObj === 'string') {
      path += `['${destObj.replace(/'/gi, '\\\'')}']`;
      sourceObj = sourceObj[destObj];
    } else if (destObj !== sourceObj) {
      return '';
    }
  }

  return `${path} = ${localName}; `;
}

function typedArrayToString(
  value: any,
  options: IJ2SOptions,
  history: IJ2SHistory
): string {
  let arr = Array.from(value),
    arrString = arrayToString(arr, options, history),
    constructorName = value.constructor.name;
  return `new ${constructorName}(${arrString})`;
}

function setToString(
  value: Set<any>,
  options: IJ2SOptions,
  history: IJ2SHistory
): string {
  let setValues: string[] = [];

  value.forEach((value1: any, value2: any, set: Set<any>) => {
    setValues.push(stringifyRef(value2, options, history));
  });

  if (setValues.length === 0) return "new Set()";

  return `new Set([${setValues.join(", ")}])`;
}

function mapToString(
  value: Map<any, any>,
  options: IJ2SOptions,
  history: IJ2SHistory
): string {
  let mapValues: string[] = [];

  value.forEach((indexValue: any, key: any) => {
    mapValues.push(
      `[${stringifyRef(key, options, history)}, ${stringifyRef(
        indexValue,
        options,
        history
      )}]`
    );
  });

  if (mapValues.length === 0) return "new Map()";

  return `new Map([${mapValues.join(", ")}])`;
}

function objectToString(
  value: any,
  options: IJ2SOptions,
  history: IJ2SHistory
): string {
  let objectValues = [];

  for (let propertyName in value) {
    if (value.hasOwnProperty(propertyName)) {
      history.references.push(propertyName);
      let propertyValue = stringifyRef(value[propertyName], options, history);
      history.references.pop();
      if (propertyValue !== "undefined") {
        objectValues.push(`${propertyName}: ${propertyValue}`);
      }
    }
  }

  if (objectValues.length === 0) return "{}";

  return attachActions(getLocalRefs(value), `{\n${objectValues.join(",\n")}\n}`);
}

function functionPropertiesToString(
  functionName: string,
  value: any,
  options: IJ2SOptions,
  history: IJ2SHistory
): string {
  let result = "";
  for (let propertyName in value) {
    if (value.hasOwnProperty(propertyName)) {
      history.references.push(propertyName);
      let propertyValue = stringifyRef(value[propertyName], options, history);
      history.references.pop();
      if (propertyValue !== "undefined") {
        result += `${functionName}.${propertyName} = ${propertyValue};\n`;
      }
    }
  }
  return result;
}

function functionToString(
  value: any,
  options: IJ2SOptions,
  history: IJ2SHistory
): string {
  let functionName = value.name || "anonymousFunction";
  let functionObject = options.includeFunctionProperties
    ? functionPropertiesToString(functionName, value, options, history)
    : "";
  history.references.push('prototype');
  let functionPrototype = options.includeFunctionPrototype
    ? functionPropertiesToString(
        `${functionName}.prototype`,
        value.prototype,
        options,
        history
      )
    : "";
  history.references.pop();

  if (!functionObject && !functionPrototype) {
    return String(value);
  }

  return attachActions(getLocalRefs(value), `(function(){\n var ${functionName} = ${String(
    value
  )};\n ${functionObject}\n ${functionPrototype}\n return ${functionName};\n}())`);
}

function arrayBufferToString(
  value: ArrayBuffer,
  options: IJ2SOptions,
  history: IJ2SHistory
): string {
  if (!options.includeBuffers) return "undefined";
  let str = typedArrayToString(new Int8Array(value), options, history);
  return `(${str}).buffer`;
}

function dataViewToString(
  value: DataView,
  options: IJ2SOptions,
  history: IJ2SHistory
): string {
  if (!options.includeBuffers) return "undefined";
  let bufString = arrayBufferToString(value.buffer, options, history);
  return `new DataView(${bufString}, ${value.byteOffset}, ${value.byteLength})`;
}

/**
 * Converts to string the value, if it wasn't before
 * @param value the value, that converts to string
 * @param references the references to stringified objects
 */
function stringify(
  value: any,
  options: IJ2SOptions,
  history: IJ2SHistory
): string {
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
      return arrayToString(value, options, history);
    case "typedarray":
      return typedArrayToString(value, options, history);
    case "set":
      return setToString(value, options, history);
    case "map":
      return mapToString(value, options, history);
    case "object":
      return objectToString(value, options, history);
    case "function":
    case "generatorfunction":
      return functionToString(value, options, history);
    case "arraybuffer":
      return arrayBufferToString(value, options, history);
    case "dataview":
      return dataViewToString(value, options, history);
    case "promise":
    case "generator":
      return "undefined";
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
  history: IJ2SHistory
): string {
  const index = history.references.indexOf(value);
  if (index < 0 || typeof(history.references[index]) === 'string') {
    let objectType = getObjectType(value);
    let referencesLength = history.references.length;
    history.references.push(value);
    switch (objectType) {
      case "object":
        if (history.nestedObjectsLeft <= 0) return "undefined";
        history.nestedObjectsLeft--;
        break;
      case "array":
      case "typedarray":
        if (history.nestedArraysLeft <= 0) return "undefined";
        history.nestedArraysLeft--;
        break;
      case "function":
      case "generatorfunction":
        if (history.nestedFunctionsLeft <= 0) return "undefined";
        history.nestedFunctionsLeft--;
        break;
    }

    let refString = stringify(value, options, history);

    history.references.splice(referencesLength);
    switch (objectType) {
      case "object":
        history.nestedObjectsLeft++;
        break;
      case "array":
      case "typedarray":
        history.nestedArraysLeft++;
        break;
      case "function":
      case "generatorfunction":
        history.nestedFunctionsLeft++;
        break;
    }

    return refString;
  } else {
    refs.push({
      historyRef: history.references.slice(0),
      source: value
    })
  }
  return "null";
}

/**
 * Converts JavaScript value to string
 * @param value the value of any type
 * @param options [optional] The options of conversion
 */
function javaScriptToString(value: any, options?: IJ2SOptions): string {
  options = options || {};
  let concreteOptions: IJ2SOptions = {
    includeFunctionProperties:
      options.includeFunctionProperties === undefined
        ? true
        : options.includeFunctionProperties,
    includeFunctionPrototype:
      options.includeFunctionPrototype === undefined
        ? true
        : options.includeFunctionPrototype,
    includeBuffers:
      options.includeBuffers === undefined ? true : options.includeBuffers,
    nestedObjectsAmount:
      options.nestedObjectsAmount === undefined
        ? Number.POSITIVE_INFINITY
        : options.nestedObjectsAmount,
    nestedArraysAmount:
      options.nestedArraysAmount === undefined
        ? Number.POSITIVE_INFINITY
        : options.nestedArraysAmount,
    nestedFunctionsAmount:
      options.nestedFunctionsAmount === undefined
        ? Number.POSITIVE_INFINITY
        : options.nestedFunctionsAmount
  };

  return stringify(value, concreteOptions, {
    references: [value],
    nestedObjectsLeft: concreteOptions.nestedObjectsAmount as number,
    nestedArraysLeft: concreteOptions.nestedArraysAmount as number,
    nestedFunctionsLeft: concreteOptions.nestedFunctionsAmount as number
  });
}

export default javaScriptToString;
