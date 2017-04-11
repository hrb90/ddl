var attrs = require('./attrs');

function makeFilterSpan(attrName, comparator, threshold) {
  var filterSpan = document.createElement("span");
  var attrMap = Object.assign({}, attrs.basicAttributes, attrs.filterAttributes);
  filterSpan.className = "span-filter";
  filterSpan.innerText = `${attrMap[attrName]} ${comparator} ${threshold}`;
  filterSpan.data = { type: "comparison", data :
    { attribute: attrName, comparator: comparator, threshold: threshold } };
  return filterSpan;
}

module.exports = makeFilterSpan;
