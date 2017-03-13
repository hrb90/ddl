var attrs = require('./attrs');

function makeFilterSpan(attrName, comparator, threshold) {
  var filterSpan = document.createElement("span");
  var attrMap = Object.assign({}, attrs.basicAttributes, attrs.filterAttributes);
  filterSpan.className = "span-filter";
  filterSpan.innerText = `${attrMap[attrName]} ${comparator} ${threshold}`;
  filterSpan.data = { filter: function (d) {
      switch(comparator) {
        case "<=":
          return d[attrName] <= (+threshold);
        case "=":
          return d[attrName] === (+threshold);
        case ">=":
          return d[attrName] >= (+threshold);
      }
    }
  };
  return filterSpan;
}

module.exports = makeFilterSpan;
