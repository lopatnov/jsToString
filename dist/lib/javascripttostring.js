'use strict';

var types = {}, typesToString = types.toString, buildInList = [
    "Boolean",
    "Number",
    "String",
    "Function",
    "Array",
    "Date",
    "RegExp",
    "Object",
    "Error",
    "Promise",
    "Generator",
    "GeneratorFunction",
    "ArrayBuffer",
    "DataView"
], typedArrays = [
    "Int8Array",
    "Uint8Array",
    "Uint8ClampedArray",
    "Int16Array",
    "Uint16Array",
    "Int32Array",
    "Uint32Array",
    "Float32Array",
    "Float64Array",
    "BigInt64Array",
    "BigUint64Array"
], maps = ["Map", "WeakMap"], sets = ["Set", "WeakSet"];
buildInList.forEach(function (name) {
    types["[object " + name + "]"] = name.toLowerCase();
});
maps.forEach(function (name) {
    types["[object " + name + "]"] = "map";
});
sets.forEach(function (name) {
    types["[object " + name + "]"] = "set";
});
typedArrays.forEach(function (name) {
    types["[object " + name + "]"] = "typedarray";
});
function getInternalType(obj) {
    return obj == null
        ? obj + ""
        : typeof obj === "object" || typeof obj === "function"
            ? types[typesToString.call(obj)] || "object"
            : typeof obj;
}

var refs = [];
var crossRefs = [];
var counter = 0;
function fillNativeFunctions(ext, obj, objName, fromPrototype = true) {
    const arrNames = Object.getOwnPropertyNames(fromPrototype ? obj.prototype : obj);
    const protoPath = fromPrototype ? ".prototype." : ".";
    for (const name of arrNames) {
        if (["caller", "callee", "arguments"].indexOf(name) < 0) {
            ext[`${objName}${protoPath}${name}`] = fromPrototype ? obj.prototype[name] : obj[name];
        }
    }
}
const nativeFunctions = (() => {
    const functions = {};
    fillNativeFunctions(functions, Array, "Array", false);
    fillNativeFunctions(functions, Array, "Array");
    fillNativeFunctions(functions, JSON, "JSON", false);
    fillNativeFunctions(functions, Object, "Object", false);
    fillNativeFunctions(functions, Object, "Object");
    fillNativeFunctions(functions, Function, "Function", false);
    fillNativeFunctions(functions, Function, "Function");
    fillNativeFunctions(functions, Date, "Date", false);
    fillNativeFunctions(functions, String, "String");
    functions.Function = Function;
    return functions;
})();
function numberToString(value) {
    if (Number.isNaN(value)) {
        return "Number.NaN";
    }
    if (Object.is(value, -0)) {
        return "-0";
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
function symbolToString(value) {
    switch (value) {
        case Symbol.asyncIterator:
        case Symbol.hasInstance:
        case Symbol.isConcatSpreadable:
        case Symbol.iterator:
        case Symbol.match:
        case Symbol.replace:
        case Symbol.search:
        case Symbol.species:
        case Symbol.split:
        case Symbol.toPrimitive:
        case Symbol.toStringTag:
        case Symbol.unscopables:
            return value.description;
        case Symbol.prototype:
            return "Symbol.prototype";
        default:
            const registryKey = Symbol.keyFor(value);
            if (registryKey !== undefined) {
                return `Symbol.for(${JSON.stringify(registryKey)})`;
            }
            const description = value.description !== undefined ? JSON.stringify(value.description) : "";
            return `Symbol(${description})`;
    }
}
function dateToString(value) {
    if (isNaN(value.getTime())) {
        return "new Date(NaN)";
    }
    return `new Date("${value.toISOString()}")`;
}
function regexpToString(value) {
    const str = String(value);
    if (value.lastIndex !== 0) {
        return `(function(){ var r = ${str}; r.lastIndex = ${value.lastIndex}; return r; }())`;
    }
    return str;
}
function errorToString(value) {
    var _a;
    const message = JSON.stringify(value.message);
    const errorClass = ((_a = value.constructor) === null || _a === void 0 ? void 0 : _a.name) || "Error";
    const knownErrors = [
        "Error", "TypeError", "RangeError", "ReferenceError",
        "SyntaxError", "URIError", "EvalError"
    ];
    if (knownErrors.includes(errorClass)) {
        return `new ${errorClass}(${message})`;
    }
    return `new Error(${message})`;
}
function arrayToString(value, options, history) {
    if (value.length === 0)
        return "[]";
    const parts = [];
    for (let i = 0; i < value.length; i++) {
        if (!(i in value)) {
            parts.push("");
        }
        else {
            const key = i.toString();
            history.references.push(key);
            history.currentPath.push(key);
            parts.push(stringifyRef(value[i], options, history));
            history.currentPath.pop();
            history.references.pop();
        }
    }
    return attachActions(getLocalRefs(value), `[${parts.join(", ")}]`);
}
function getLocalRefs(value) {
    return refs.filter((x) => x.source === value);
}
function attachActions(localRefs, result) {
    if (localRefs.length > 0) {
        counter = (counter + 1) % Number.MAX_SAFE_INTEGER;
        const localName = `___j2s_${counter}`;
        const actions = localRefs.reduce((x1, x2) => {
            const action = converToAction(localName, x2);
            refs.splice(refs.indexOf(x2), 1);
            return x1 + action;
        }, "");
        return `(function(){ var ${localName} = ${result}; ${actions} return ${localName}; }())`;
    }
    return result;
}
function converToAction(localName, r) {
    const destIndex = r.historyRef.indexOf(r.source);
    if (destIndex < 0) {
        return "";
    }
    const dest = r.historyRef.slice(destIndex);
    let sourceObj;
    let path = "";
    for (let i = 0; i < dest.length; i++) {
        const destObj = dest[i];
        if (destObj === r.source) {
            path = localName;
            sourceObj = r.source;
        }
        else if (typeof destObj === "string") {
            path += `['${destObj.replace(/'/gi, "\\'")}']`;
            sourceObj = sourceObj[destObj];
        }
        else if (destObj !== sourceObj) {
            return "";
        }
    }
    return `${path} = ${localName}; `;
}
function typedArrayToString(value, options, history) {
    const arr = Array.from(value), arrString = arrayToString(arr, options, history), constructorName = value.constructor.name;
    return `new ${constructorName}(${arrString})`;
}
function setToString(value, options, history) {
    const setValues = [];
    value.forEach((_, value2) => {
        setValues.push(stringifyRef(value2, options, history));
    });
    if (setValues.length === 0)
        return "new Set()";
    return `new Set([${setValues.join(", ")}])`;
}
function mapToString(value, options, history) {
    const mapValues = [];
    value.forEach((indexValue, key) => {
        mapValues.push(`[${stringifyRef(key, options, history)}, ${stringifyRef(indexValue, options, history)}]`);
    });
    if (mapValues.length === 0)
        return "new Map()";
    return `new Map([${mapValues.join(", ")}])`;
}
function objectToString(value, options, history) {
    const objectValues = [];
    for (let propertyName in value) {
        if (Object.prototype.hasOwnProperty.call(value, propertyName)) {
            history.references.push(propertyName);
            history.currentPath.push(propertyName);
            const propertyValue = stringifyRef(value[propertyName], options, history);
            history.currentPath.pop();
            history.references.pop();
            if (propertyValue !== "undefined") {
                if (!/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(propertyName)) {
                    const escaped = propertyName.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
                    propertyName = `"${escaped}"`;
                }
                objectValues.push(`${propertyName}: ${propertyValue}`);
            }
        }
    }
    if (objectValues.length === 0)
        return "{}";
    return attachActions(getLocalRefs(value), `{\n${objectValues.join(",\n")}\n}`);
}
function functionPropertiesToString(functionName, value, options, history) {
    let result = "";
    for (const propertyName in value) {
        if (Object.prototype.hasOwnProperty.call(value, propertyName)) {
            history.references.push(propertyName);
            history.currentPath.push(propertyName);
            const propertyValue = stringifyRef(value[propertyName], options, history);
            history.currentPath.pop();
            history.references.pop();
            if (propertyValue !== "undefined") {
                if (/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(propertyName)) {
                    result += `${functionName}.${propertyName} = ${propertyValue};\n`;
                }
                else {
                    const escaped = propertyName.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
                    result += `${functionName}["${escaped}"] = ${propertyValue};\n`;
                }
            }
        }
    }
    return result;
}
function functionToString(value, options, history) {
    const functionName = value.name || "anonymousFunction";
    const functionObject = options.includeFunctionProperties
        ? functionPropertiesToString(functionName, value, options, history)
        : "";
    history.references.push("prototype");
    history.currentPath.push("prototype");
    const functionPrototype = options.includeFunctionPrototype
        ? functionPropertiesToString(`${functionName}.prototype`, value.prototype, options, history)
        : "";
    history.currentPath.pop();
    history.references.pop();
    let functionStr = String(value);
    if (functionStr.indexOf("[native code]") > -1 && functionStr.length < 100) {
        for (const nfName in nativeFunctions) {
            if (nativeFunctions[nfName] === value) {
                functionStr = nfName;
            }
        }
    }
    if (!functionObject && !functionPrototype) {
        return functionStr;
    }
    return attachActions(getLocalRefs(value), `(function(){\n var ${functionName} = ${String(functionStr)};\n ${functionObject}\n ${functionPrototype}\n return ${functionName};\n}())`);
}
function arrayBufferToString(value, options, history) {
    if (!options.includeBuffers)
        return "undefined";
    const str = typedArrayToString(new Int8Array(value), options, history);
    return `(${str}).buffer`;
}
function dataViewToString(value, options, history) {
    if (!options.includeBuffers)
        return "undefined";
    const bufString = arrayBufferToString(value.buffer, options, history);
    return `new DataView(${bufString}, ${value.byteOffset}, ${value.byteLength})`;
}
/**
 * Converts to string the value, if it wasn't before
 * @param value the value, that converts to string
 * @param references the references to stringified objects
 */
function stringify(value, options, history) {
    switch (getInternalType(value)) {
        case "undefined":
            return "undefined";
        case "null":
            return "null";
        case "boolean":
            return String(value);
        case "regexp":
            return regexpToString(value);
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
function stringifyRef(value, options, history) {
    const isRefType = (typeof value === "object" && value !== null) || typeof value === "function";
    const index = history.references.indexOf(value);
    // Cross-reference: object was already stringified in a different branch
    if (isRefType && history.visited.has(value) && index < 0) {
        crossRefs.push({
            destPath: [...history.currentPath],
            sourcePath: history.visited.get(value) || [],
        });
        return "null";
    }
    if (index < 0 || typeof history.references[index] === "string") {
        const objectType = getInternalType(value);
        const referencesLength = history.references.length;
        // Track first-seen path for reference types
        if (isRefType && !history.visited.has(value)) {
            history.visited.set(value, [...history.currentPath]);
        }
        history.references.push(value);
        switch (objectType) {
            case "object":
                if (history.nestedObjectsLeft <= 0)
                    return "undefined";
                history.nestedObjectsLeft--;
                break;
            case "array":
            case "typedarray":
                if (history.nestedArraysLeft <= 0)
                    return "undefined";
                history.nestedArraysLeft--;
                break;
            case "function":
            case "generatorfunction":
                if (history.nestedFunctionsLeft <= 0)
                    return "undefined";
                history.nestedFunctionsLeft--;
                break;
        }
        const refString = stringify(value, options, history);
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
    }
    else {
        // Circular reference: back-reference to an ancestor in current path
        refs.push({
            historyRef: history.references.slice(0),
            source: value,
        });
    }
    return "null";
}
function attachCrossRefActions(localCrossRefs, result) {
    if (localCrossRefs.length === 0) {
        return result;
    }
    counter = (counter + 1) % Number.MAX_SAFE_INTEGER;
    const localName = `___j2s_${counter}`;
    const actions = localCrossRefs
        .map((cr) => {
        const destAccessor = cr.destPath.map((p) => `['${p.replace(/'/gi, "\\'")}']`).join("");
        const srcAccessor = cr.sourcePath.map((p) => `['${p.replace(/'/gi, "\\'")}']`).join("");
        return `${localName}${destAccessor} = ${localName}${srcAccessor}; `;
    })
        .join("");
    return `(function(){ var ${localName} = ${result}; ${actions}return ${localName}; }())`;
}
/**
 * Converts JavaScript value to string
 * @param value the value of any type
 * @param options [optional] The options of conversion
 */
function javaScriptToString(value, options) {
    options = options || {};
    const concreteOptions = {
        includeFunctionProperties: options.includeFunctionProperties === undefined ? true : options.includeFunctionProperties,
        includeFunctionPrototype: options.includeFunctionPrototype === undefined ? true : options.includeFunctionPrototype,
        includeBuffers: options.includeBuffers === undefined ? true : options.includeBuffers,
        nestedObjectsAmount: options.nestedObjectsAmount === undefined ? Number.POSITIVE_INFINITY : options.nestedObjectsAmount,
        nestedArraysAmount: options.nestedArraysAmount === undefined ? Number.POSITIVE_INFINITY : options.nestedArraysAmount,
        nestedFunctionsAmount: options.nestedFunctionsAmount === undefined ? Number.POSITIVE_INFINITY : options.nestedFunctionsAmount,
    };
    // Clear global state before conversion
    refs = [];
    crossRefs = [];
    counter = 0;
    const visited = new Map();
    visited.set(value, []);
    const result = stringify(value, concreteOptions, {
        references: [value],
        nestedObjectsLeft: concreteOptions.nestedObjectsAmount,
        nestedArraysLeft: concreteOptions.nestedArraysAmount,
        nestedFunctionsLeft: concreteOptions.nestedFunctionsAmount,
        visited,
        currentPath: [],
    });
    // Handle circular references at the top level (Issue #1)
    const circularResult = attachActions(getLocalRefs(value), result);
    // Handle cross-references between different branches
    return attachCrossRefActions(crossRefs, circularResult);
}

module.exports = javaScriptToString;
//# sourceMappingURL=javascripttostring.js.map
