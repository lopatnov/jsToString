"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var get_internal_type_1 = __importDefault(require("get-internal-type"));
function numberToString(value) {
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
function symbolToString(value) {
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
            var description = value.description ? "\"" + value.description + "\"" : "";
            return "Symbol(" + description + ")";
    }
}
function dateToString(value) {
    if (isNaN(value.getTime())) {
        return "new Date(" + value.toString() + ")";
    }
    return "new Date(" + value.toISOString() + ")";
}
function errorToString(value) {
    var message = JSON.stringify(value.message), fileName = JSON.stringify(value.fileName), lineNumber = JSON.stringify(value.lineNumber);
    return "new Error(" + message + ", " + fileName + ", " + lineNumber + ")";
}
function arrayToString(value, options, history) {
    if (value.length === 0)
        return "[]";
    var zeroValue = value[0], strZeroValue = stringifyRef(value[0], options, history);
    var arrayValues = value.reduce(function (x1, x2) {
        return (x1 === zeroValue ? strZeroValue : x1) + ", " + stringifyRef(x2, options, history);
    });
    return "[" + arrayValues + "]";
}
function typedArrayToString(value, options, history) {
    var arr = Array.from(value), arrString = arrayToString(arr, options, history), constructorName = value.constructor.name;
    return "new " + constructorName + "(" + arrString + ")";
}
function setToString(value, options, history) {
    var setValues = [];
    value.forEach(function (value1, value2, set) {
        setValues.push(stringifyRef(value2, options, history));
    });
    if (setValues.length === 0)
        return "new Set()";
    return "new Set([" + setValues.join(", ") + "])";
}
function mapToString(value, options, history) {
    var mapValues = [];
    value.forEach(function (indexValue, key) {
        mapValues.push("[" + stringifyRef(key, options, history) + ", " + stringifyRef(indexValue, options, history) + "]");
    });
    if (mapValues.length === 0)
        return "new Map()";
    return "new Map([" + mapValues.join(", ") + "])";
}
function objectToString(value, options, history) {
    var objectValues = [];
    for (var propertyName in value) {
        if (value.hasOwnProperty(propertyName)) {
            var propertyValue = stringifyRef(value[propertyName], options, history);
            if (propertyValue !== "undefined") {
                objectValues.push(propertyName + ": " + propertyValue);
            }
        }
    }
    if (objectValues.length === 0)
        return "{}";
    return "{\n" + objectValues.join(",\n") + "\n}";
}
function functionPropertiesToString(functionName, value, options, history) {
    var result = "";
    for (var propertyName in value) {
        if (value.hasOwnProperty(propertyName)) {
            var propertyValue = stringifyRef(value[propertyName], options, history);
            if (propertyValue !== "undefined") {
                result += functionName + "." + propertyName + " = " + propertyValue + ";\n";
            }
        }
    }
    return result;
}
function functionToString(value, options, history) {
    var functionName = value.name || "anonymousFunction";
    var functionObject = options.includeFunctionProperties
        ? functionPropertiesToString(functionName, value, options, history)
        : "";
    var functionPrototype = options.includeFunctionPrototype
        ? functionPropertiesToString(functionName + ".prototype", value.prototype, options, history)
        : "";
    if (!functionObject && !functionPrototype) {
        return String(value);
    }
    return "(function(){\n var " + functionName + " = " + String(value) + ";\n " + functionObject + "\n " + functionPrototype + "\n return " + functionName + ";\n}())";
}
function arrayBufferToString(value, options, history) {
    if (!options.includeBuffers)
        return "undefined";
    var str = typedArrayToString(new Int8Array(value), options, history);
    return "(" + str + ").buffer";
}
function dataViewToString(value, options, history) {
    if (!options.includeBuffers)
        return "undefined";
    var bufString = arrayBufferToString(value.buffer, options, history);
    return "new DataView(" + bufString + ", " + value.byteOffset + ", " + value.byteLength + ")";
}
/**
 * Converts to string the value, if it wasn't before
 * @param value the value, that converts to string
 * @param references the references to stringified objects
 */
function stringify(value, options, history) {
    switch (get_internal_type_1.default(value)) {
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
            return "BigInt(" + value + ")";
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
    if (history.references.indexOf(value) < 0) {
        var objectType = get_internal_type_1.default(value);
        var referencesLength = history.references.length;
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
        var refString = stringify(value, options, history);
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
    return "null";
}
/**
 * Converts JavaScript value to string
 * @param value the value of any type
 * @param options [optional] The options of conversion
 */
function javaScriptToString(value, options) {
    var opt = options || {};
    if (opt.includeFunctionProperties === undefined)
        opt.includeFunctionProperties = true;
    if (opt.includeFunctionPrototype === undefined)
        opt.includeFunctionPrototype = true;
    if (opt.includeBuffers === undefined)
        opt.includeBuffers = true;
    if (opt.nestedObjectsAmount === undefined)
        opt.nestedObjectsAmount = Number.POSITIVE_INFINITY;
    if (opt.nestedArraysAmount === undefined)
        opt.nestedArraysAmount = Number.POSITIVE_INFINITY;
    if (opt.nestedFunctionsAmount === undefined)
        opt.nestedFunctionsAmount = Number.POSITIVE_INFINITY;
    return stringify(value, opt, {
        references: [value],
        nestedObjectsLeft: opt.nestedObjectsAmount,
        nestedArraysLeft: opt.nestedArraysAmount,
        nestedFunctionsLeft: opt.nestedFunctionsAmount
    });
}
exports.default = javaScriptToString;
//# sourceMappingURL=javascripttostring.js.map