var getObjectType = (function () {
    var types = {}, typesToString = types.toString;
    [
        "Boolean",
        "Number",
        "String",
        "Function",
        "Array",
        "Date",
        "RegExp",
        "Object",
        "Error"
    ].forEach(function (name) {
        types["[object " + name + "]"] = name.toLowerCase();
    });
    return function (obj) {
        return obj == null
            ? obj + ""
            : typeof obj === "object" || typeof obj === "function"
                ? types[typesToString.call(obj)] || "object"
                : typeof obj;
    };
}());
/**
   * Converts JavaScript value to string
   * @param obj the value of any type
   */
function javaScriptToString(obj) {
    var prop, str = [];
    switch (getObjectType(obj)) {
        case "undefined":
            return String(obj);
        case "object":
            for (prop in obj) {
                if (obj.hasOwnProperty(prop))
                    str.push(prop + ": " + javaScriptToString(obj[prop]));
            }
            return "{" + str.join(",") + "}";
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
        default:
            str.push(JSON.stringify(obj));
    }
    return str.join(",");
}
exports.default = javaScriptToString;
//# sourceMappingURL=javascripttostring.es5.js.map
