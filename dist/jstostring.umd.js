(function (factory) {
  typeof define === 'function' && define.amd ? define(factory) :
  factory();
}(function () { 'use strict';

  let types = {};
  let typesToString = types.toString;
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
  function Type(obj) {
      return obj == null
          ? obj + ""
          : typeof obj === "object" || typeof obj === "function"
              ? types[typesToString.call(obj)] || "object"
              : typeof obj;
  }
  function jsToString(obj) {
      let prop, str = [];
      switch (Type(obj)) {
          case "undefined":
              return String(obj);
          case "object":
              for (prop in obj) {
                  if (obj.hasOwnProperty(prop))
                      str.push(prop + ": " + jsToString(obj[prop]));
              }
              return "{" + str.join(",") + "}";
          case "array":
              for (prop = 0; prop < obj.length; prop++) {
                  str.push(jsToString(obj[prop]));
              }
              return "[" + str.join(",") + "]";
          case "function":
              str.push(obj.toString());
              break;
          case "number":
              if (Number.isNaN(obj)) {
                  str.push("Number.NaN");
              }
              else if (Number.POSITIVE_INFINITY === obj ||
                  Number.NEGATIVE_INFINITY === obj) {
                  str.push(Number.POSITIVE_INFINITY === obj
                      ? "Number.POSITIVE_INFINITY"
                      : "Number.NEGATIVE_INFINITY");
              }
              else {
                  str.push(JSON.stringify(obj));
              }
              break;
          default:
              str.push(JSON.stringify(obj));
      }
      return str.join(",");
  }
  exports.default = jsToString;

}));
//# sourceMappingURL=jstostring.umd.js.map
