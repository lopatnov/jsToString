"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var get_internal_type_1 = __importDefault(require("get-internal-type"));
/**
 * Converts JavaScript value to string
 * @param obj the value of any type
 */
function javaScriptToString(obj) {
    var prop, str = [];
    switch (get_internal_type_1.default(obj)) {
        case "undefined":
            return String(obj);
        case "object":
            if (obj instanceof Map) {
                var stringParams_1 = [];
                obj.forEach(function (value, key) {
                    stringParams_1.push("[" + javaScriptToString(key) + "," + javaScriptToString(value) + "]");
                });
                str.push("new Map([" + stringParams_1.join(",") + "])");
            }
            if (obj instanceof Set) {
                var stringParams_2 = [];
                obj.forEach(function (value1, value2, set) {
                    stringParams_2.push(javaScriptToString(value2));
                });
                str.push("new Set([" + stringParams_2.join(",") + "])");
            }
            else {
                for (prop in obj) {
                    if (obj.hasOwnProperty(prop))
                        str.push(prop + ": " + javaScriptToString(obj[prop]));
                }
                return "{" + str.join(",") + "}";
            }
            break;
        case "regexp":
            str.push(obj.toString());
            break;
        case "array":
            for (prop = 0; prop < obj.length; prop++) {
                str.push(javaScriptToString(obj[prop]));
            }
            return "[" + str.join(",") + "]";
        case "function":
            str.push(obj.toString());
            break;
        case "date":
            if (isNaN(obj.getTime())) {
                str.push("new Date(" + obj.toString() + ")");
            }
            else {
                str.push("new Date(" + obj.toISOString() + ")");
            }
            break;
        case "bigint":
            str.push("BigInt(" + obj + ")");
            break;
        case "number":
            if (Number.isNaN(obj)) {
                str.push("Number.NaN");
            }
            else {
                switch (obj) {
                    case Number.POSITIVE_INFINITY:
                        str.push("Number.POSITIVE_INFINITY");
                        break;
                    case Number.NEGATIVE_INFINITY:
                        str.push("Number.NEGATIVE_INFINITY");
                        break;
                    case Number.EPSILON:
                        str.push("Number.EPSILON");
                        break;
                    case Number.MAX_SAFE_INTEGER:
                        str.push("Number.MAX_SAFE_INTEGER");
                        break;
                    case Number.MIN_SAFE_INTEGER:
                        str.push("Number.MIN_SAFE_INTEGER");
                        break;
                    case Number.MAX_VALUE:
                        str.push("Number.MAX_VALUE");
                        break;
                    case Number.MIN_VALUE:
                        str.push("Number.MIN_VALUE");
                        break;
                    default:
                        str.push(JSON.stringify(obj));
                }
            }
            break;
        case "error":
            var message = JSON.stringify(obj.message), fileName = JSON.stringify(obj.fileName), lineNumber = JSON.stringify(obj.lineNumber);
            str.push("new Error(" + message + ", " + fileName + ", " + lineNumber + ")");
            break;
        case "symbol":
            var description = obj.description ? "\"" + obj.description + "\"" : '';
            str.push("Symbol(" + description + ")");
            break;
        default:
            str.push(JSON.stringify(obj));
    }
    return str.join(",");
}
exports.default = javaScriptToString;
//# sourceMappingURL=javascripttostring.js.map