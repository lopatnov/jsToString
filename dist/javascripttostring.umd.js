(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, global.javaScriptToString = factory());
}(this, function () { 'use strict';

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
            var objectType = getInternalType(value);
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

    return javaScriptToString;

}));
//# sourceMappingURL=javascripttostring.umd.js.map
