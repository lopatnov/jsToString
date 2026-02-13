var inputEl = document.getElementById("input");
var outputEl = document.getElementById("output");
var verifyEl = document.getElementById("verify");
var inputBadge = document.getElementById("input-badge");
var outputBadge = document.getElementById("output-badge");
var verifyBadge = document.getElementById("verify-badge");
var copyInputBtn = document.getElementById("copy-input-btn");
var copyOutputBtn = document.getElementById("copy-output-btn");
var examplesEl = document.getElementById("examples");
var optFuncProps = document.getElementById("opt-func-props");
var optFuncProto = document.getElementById("opt-func-proto");
var optBuffers = document.getElementById("opt-buffers");
var optNestedObjects = document.getElementById("opt-nested-objects");
var optNestedArrays = document.getElementById("opt-nested-arrays");
var optNestedFunctions = document.getElementById("opt-nested-functions");

var examples = {
  "simple-object": 'return {\n  name: "Alex",\n  age: 30,\n  active: true\n};',
  "nested-object": 'return {\n  friend1: "Shurik",\n  friend2: "Alex",\n  friends: {\n    friend3: 123456,\n    friend4: {},\n    friend5: ["Hola", "amigo"],\n    friend6: () => {\n      console.log("How you doing?");\n    }\n  }\n};',
  "array": 'return ["Hello", "World", 42, true, null, { nested: "object" }];',
  "function-props": 'function Simple(title) {\n  this.title = title || "world";\n}\n\nSimple.count = 0;\n\nSimple.prototype.show = function() {\n  Simple.count++;\n  console.log("title =", this.title);\n};\n\nreturn Simple;',
  "circular-ref": 'var obj = { name: "root", value: 42 };\nobj.self = obj;\nreturn obj;',
  "cross-ref": 'var shared = { value: 42 };\nvar obj = {\n  first: shared,\n  second: shared,\n  nested: { third: shared }\n};\nreturn obj;',
  "complex-graph": 'var node1 = { id: 1, connections: [] };\nvar node2 = { id: 2, connections: [] };\nvar node3 = { id: 3, connections: [] };\n\nnode1.connections.push(node2, node3);\nnode2.connections.push(node1, node3);\nnode3.connections.push(node1, node2);\n\nreturn { nodes: [node1, node2, node3], root: node1 };',
  "mixed-types": 'return {\n  string: "hello",\n  number: 3.14,\n  bigint: BigInt(9007199254740991),\n  boolean: true,\n  nil: null,\n  undef: undefined,\n  regex: /test/gi,\n  date: new Date("2026-01-01"),\n  set: new Set([1, 2, 3]),\n  map: new Map([["key", "value"]]),\n  fn: function greet(name) { return "hello " + name; }\n};'
};

function updateInputBadge() {
  inputBadge.textContent = inputEl.value.length + " chars";
}

updateInputBadge();

inputEl.addEventListener("input", updateInputBadge);

examplesEl.addEventListener("change", function () {
  var key = this.value;
  if (key && examples[key]) {
    inputEl.value = examples[key];
    updateInputBadge();
    this.value = "";
  }
});

function getOptions() {
  var opts = {};
  opts.includeFunctionProperties = optFuncProps.checked;
  opts.includeFunctionPrototype = optFuncProto.checked;
  opts.includeBuffers = optBuffers.checked;
  var no = optNestedObjects.value;
  if (no !== "") opts.nestedObjectsAmount = parseInt(no, 10);
  var na = optNestedArrays.value;
  if (na !== "") opts.nestedArraysAmount = parseInt(na, 10);
  var nf = optNestedFunctions.value;
  if (nf !== "") opts.nestedFunctionsAmount = parseInt(nf, 10);
  return opts;
}

function resetOptions() {
  optFuncProps.checked = true;
  optFuncProto.checked = true;
  optBuffers.checked = true;
  optNestedObjects.value = "";
  optNestedArrays.value = "";
  optNestedFunctions.value = "";
}

document.getElementById("reset-options-btn").addEventListener("click", resetOptions);

document.getElementById("run-btn").addEventListener("click", run);
document.getElementById("clear-btn").addEventListener("click", function () {
  inputEl.value = "";
  updateInputBadge();
  outputEl.textContent = 'Click "Convert to String" to see the result';
  outputEl.className = "output-area empty";
  verifyEl.textContent = "The output string will be evaluated back to verify correctness";
  verifyEl.className = "verify-area empty";
  outputBadge.classList.add("hidden");
  copyOutputBtn.classList.add("hidden");
  verifyBadge.classList.add("hidden");
});

function copyToClipboard(text, btn) {
  navigator.clipboard.writeText(text).then(function () {
    var original = btn.textContent;
    btn.textContent = "Copied!";
    btn.classList.add("copied");
    setTimeout(function () {
      btn.textContent = original;
      btn.classList.remove("copied");
    }, 1500);
  });
}

copyInputBtn.addEventListener("click", function () {
  copyToClipboard(inputEl.value, this);
});

copyOutputBtn.addEventListener("click", function () {
  var text = outputEl.textContent;
  if (text && !outputEl.classList.contains("empty")) {
    copyToClipboard(text, this);
  }
});

inputEl.addEventListener("keydown", function (e) {
  if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
    e.preventDefault();
    run();
  }
  if (e.key === "Tab") {
    e.preventDefault();
    var start = this.selectionStart;
    var end = this.selectionEnd;
    this.value = this.value.substring(0, start) + "  " + this.value.substring(end);
    this.selectionStart = this.selectionEnd = start + 2;
  }
});

function run() {
  var code = inputEl.value.trim();
  if (!code) return;

  var value;
  try {
    var fn = new Function(code);
    value = fn();
  } catch (err) {
    showOutput("Function execution error:\n" + err.message, true);
    showVerify("", true, "Skipped — input error");
    return;
  }

  var str;
  try {
    str = javaScriptToString(value, getOptions());
  } catch (err) {
    showOutput("javaScriptToString error:\n" + err.message, true);
    showVerify("", true, "Skipped — conversion error");
    return;
  }

  showOutput(str, false);

  try {
    var restored = new Function("return " + str)();
    var preview = formatPreview(restored, 3);
    showVerify(preview, false, "Eval OK");
  } catch (err) {
    showVerify("Eval error: " + err.message, true, "Eval Failed");
  }
}

function showOutput(text, isError) {
  outputEl.textContent = text;
  outputEl.className = "output-area" + (isError ? " error" : "");
  outputBadge.classList.remove("hidden");
  if (isError) {
    outputBadge.textContent = "Error";
    outputBadge.className = "badge badge-error";
    copyOutputBtn.classList.add("hidden");
  } else {
    outputBadge.textContent = text.length + " chars";
    outputBadge.className = "badge badge-info";
    copyOutputBtn.classList.remove("hidden");
  }
}

function showVerify(text, isError, label) {
  if (!text && label) {
    verifyEl.textContent = label;
    verifyEl.className = "verify-area" + (isError ? " error" : " empty");
  } else {
    verifyEl.textContent = text;
    verifyEl.className = "verify-area" + (isError ? " error" : "");
  }
  verifyBadge.classList.remove("hidden");
  if (isError) {
    verifyBadge.textContent = label || "Error";
    verifyBadge.className = "badge badge-error";
  } else {
    verifyBadge.textContent = label || "OK";
    verifyBadge.className = "badge badge-success";
  }
}

function formatPreview(val, depth) {
  if (depth <= 0) return "...";
  if (val === null) return "null";
  if (val === undefined) return "undefined";
  if (typeof val === "string") return JSON.stringify(val);
  if (typeof val === "number" || typeof val === "boolean") return String(val);
  if (typeof val === "bigint") return val + "n";
  if (typeof val === "symbol") return val.toString();
  if (typeof val === "function") return val.name ? "[Function: " + val.name + "]" : "[Function]";
  if (val instanceof RegExp) return String(val);
  if (val instanceof Date) return val.toISOString();
  if (val instanceof Set) {
    return "Set(" + val.size + ") {" + [...val].map(function(v) { return formatPreview(v, depth - 1); }).join(", ") + "}";
  }
  if (val instanceof Map) {
    var entries = [];
    val.forEach(function(v, k) { entries.push(formatPreview(k, depth - 1) + " => " + formatPreview(v, depth - 1)); });
    return "Map(" + val.size + ") {" + entries.join(", ") + "}";
  }
  if (Array.isArray(val)) {
    if (val.length === 0) return "[]";
    var items = val.map(function(v) { return formatPreview(v, depth - 1); });
    return "[" + items.join(", ") + "]";
  }
  if (typeof val === "object") {
    var keys = Object.keys(val);
    if (keys.length === 0) return "{}";
    var props = keys.slice(0, 10).map(function(k) {
      var v = val[k];
      if (v === val) return k + ": [Circular]";
      return k + ": " + formatPreview(v, depth - 1);
    });
    if (keys.length > 10) props.push("... +" + (keys.length - 10) + " more");
    return "{" + props.join(", ") + "}";
  }
  return String(val);
}
