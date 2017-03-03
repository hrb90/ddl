function makeFilterSpan(attrName, comparator, threshold) {
  var filterSpan = document.createElement("span");
  filterSpan.className = "span-filter";
  filterSpan.innerText = `${attrName} ${comparator} ${threshold}`;
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
