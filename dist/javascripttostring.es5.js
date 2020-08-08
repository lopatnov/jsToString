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
var counter = 0;
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
    var arrayValues = value.reduce(function (x1, x2, index) {
        history.references.push(index.toString());
        var str = !!x1 ? x1 + ", " : '';
        str += stringifyRef(x2, options, history);
        history.references.pop();
        return str;
    }, '');
    return attachActions(getLocalRefs(value), "[" + arrayValues + "]");
}
function getLocalRefs(value) {
    return refs.filter(function (x) { return x.source === value; });
}
function attachActions(localRefs, result) {
    if (localRefs.length > 0) {
        counter = (counter++) % Number.MAX_SAFE_INTEGER;
        var localName_1 = "___j2s_" + counter;
        var actions = localRefs.reduce(function (x1, x2) {
            var action = converToAction(localName_1, x2);
            refs.splice(refs.indexOf(x2), 1);
            return x1 + action;
        }, '');
        return "(function(){ var " + localName_1 + " = " + result + "; " + actions + " return " + localName_1 + "; }())";
    }
    return result;
}
function converToAction(localName, r) {
    var destIndex = r.historyRef.indexOf(r.source);
    if (destIndex < 0) {
        return '';
    }
    var dest = r.historyRef.slice(destIndex);
    var sourceObj;
    var path = '';
    for (var i = 0; i < dest.length; i++) {
        var destObj = dest[i];
        if (destObj === r.source) {
            path = localName;
            sourceObj = r.source;
        }
        else if (typeof destObj === 'string') {
            path += "['" + destObj.replace(/'/gi, '\\\'') + "']";
            sourceObj = sourceObj[destObj];
        }
        else if (destObj !== sourceObj) {
            return '';
        }
    }
    return path + " = " + localName + "; ";
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
            history.references.push(propertyName);
            var propertyValue = stringifyRef(value[propertyName], options, history);
            history.references.pop();
            if (propertyValue !== "undefined") {
                objectValues.push(propertyName + ": " + propertyValue);
            }
        }
    }
    if (objectValues.length === 0)
        return "{}";
    return attachActions(getLocalRefs(value), "{\n" + objectValues.join(",\n") + "\n}");
}
function functionPropertiesToString(functionName, value, options, history) {
    var result = "";
    for (var propertyName in value) {
        if (value.hasOwnProperty(propertyName)) {
            history.references.push(propertyName);
            var propertyValue = stringifyRef(value[propertyName], options, history);
            history.references.pop();
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
    history.references.push('prototype');
    var functionPrototype = options.includeFunctionPrototype
        ? functionPropertiesToString(functionName + ".prototype", value.prototype, options, history)
        : "";
    history.references.pop();
    if (!functionObject && !functionPrototype) {
        return String(value);
    }
    return attachActions(getLocalRefs(value), "(function(){\n var " + functionName + " = " + String(value) + ";\n " + functionObject + "\n " + functionPrototype + "\n return " + functionName + ";\n}())");
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
    var index = history.references.indexOf(value);
    if (index < 0 || typeof (history.references[index]) === 'string') {
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
    else {
        refs.push({
            historyRef: history.references.slice(0),
            source: value
        });
    }
    return "null";
}
/**
 * Converts JavaScript value to string
 * @param value the value of any type
 * @param options [optional] The options of conversion
 */
function javaScriptToString(value, options) {
    options = options || {};
    var concreteOptions = {
        includeFunctionProperties: options.includeFunctionProperties === undefined
            ? true
            : options.includeFunctionProperties,
        includeFunctionPrototype: options.includeFunctionPrototype === undefined
            ? true
            : options.includeFunctionPrototype,
        includeBuffers: options.includeBuffers === undefined ? true : options.includeBuffers,
        nestedObjectsAmount: options.nestedObjectsAmount === undefined
            ? Number.POSITIVE_INFINITY
            : options.nestedObjectsAmount,
        nestedArraysAmount: options.nestedArraysAmount === undefined
            ? Number.POSITIVE_INFINITY
            : options.nestedArraysAmount,
        nestedFunctionsAmount: options.nestedFunctionsAmount === undefined
            ? Number.POSITIVE_INFINITY
            : options.nestedFunctionsAmount
    };
    return stringify(value, concreteOptions, {
        references: [value],
        nestedObjectsLeft: concreteOptions.nestedObjectsAmount,
        nestedArraysLeft: concreteOptions.nestedArraysAmount,
        nestedFunctionsLeft: concreteOptions.nestedFunctionsAmount
    });
}

export default javaScriptToString;
//# sourceMappingURL=javascripttostring.es5.js.map
