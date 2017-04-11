var d3 = require('d3');
var makeFilterSpan = require('./make_filter_span');
var attrs = require('./attrs');
var alphabet = require('alphabet');

function makeRandomSlug() {
  var slug = "";
  for (var i = 0; i < 8; i++) {
    slug = slug.concat(alphabet[Math.floor(alphabet.length * Math.random())]);
  }
  return slug;
}

function makeFilterFunction(filter) {
  switch (filter.type) {
    case "position":
      return function(d) { return filter.data.list.includes(d.position) };
    default:
      switch(filter.data.comparator) {
        case ">=":
          return function(d) { return d[filter.data.attribute] >= filter.data.threshold };
        case "=":
          return function(d) { return d[filter.data.attribute] === filter.data.threshold };
        case "<=":
          return function(d) { return d[filter.data.attribute] <= filter.data.threshold };
        default:
          throw new Error("Invalid comparator!");
      }
  }
}

function Gatherer(factories, canvas, domElements) {
  this.factories = factories;
  this.canvas = canvas;
  this.attrSelectors = domElements.attrSelectors;
  this.filterContainer = domElements.filterContainer;
  this.newFilterForm = domElements.newFilterForm;
  this.highlightInput = domElements.highlightInput;
  this.render = this.render.bind(this);
  this.filters = [];
  this.data = [];
  this.pin = { attrArea: true };
  this.renderOptions = { scales: {}, labels: {} };
  this.addListeners();
}

Gatherer.prototype.addListeners = function () {
  var render = this.render;
  var unpinScale = this.unpinScale.bind(this);
  [].forEach.call(this.attrSelectors, function(s) {s.addEventListener("change", function() {
    unpinScale(s.parentNode.id);
    render();
  }); });
  this.filterContainer.addEventListener("change", render);
  this.newFilterForm.addEventListener("submit", function(e) {
    e.preventDefault();
    var attrName = document.getElementById("filter-attr").value;
    var comp = document.getElementById("comparator").value;
    var thresholdEl = document.getElementById("threshold");
    var threshold = thresholdEl.value;
    thresholdEl.value = "";
    document.getElementById("span-filter-container").append(makeFilterSpan(attrName, comp, threshold));
    e.currentTarget.className = "hidden";
    render();
  });
  this.filterContainer.addEventListener("click", function(e) {
    if (e.target.className === "span-filter") {
      e.target.remove();
      render();
    }
  });
  this.highlightInput.addEventListener("change", function(e) {
    if (e.currentTarget.value.length >= 3) {
      render();
    }
  });
};


Gatherer.prototype.filter = function (data) {
  var filterFunctions = this.filters.map(makeFilterFunction);
  return data.filter(function(d) {
    return filterFunctions.every(function(f) { return f(d); } );
  });
};

Gatherer.prototype.gatherAttributeSelectors = function () {
  var selections = {};
  [].forEach.call(this.attrSelectors, function (selector) {
    selections[selector.parentNode.id] = selector.value;
  });
  return selections;
};

Gatherer.prototype.gatherFilters = function () {
  var posFilters = document.getElementsByClassName('posFilter');
  var posList = [];
  [].forEach.call(posFilters, function(el) { if (el.checked) posList.push(el.value); });
  var filterList = [ { type: "position", data: { list: posList }}]
  var minYearFilter = document.getElementById('start-season-selector');
  var maxYearFilter = document.getElementById('end-season-selector');
  filterList.push({ type: "minSeason", data: { attribute: "season", comparator: ">=", threshold: parseInt(minYearFilter.value)}});
  filterList.push({ type: "maxSeason", data: { attribute: "season", comparator: "<=", threshold: parseInt(maxYearFilter.value)}});
  var spanFilters = document.getElementsByClassName('span-filter');
  [].forEach.call(spanFilters, function(el) { filterList.push(el.data); });
  this.filters = filterList;
};

Gatherer.prototype.getHighlight = function () {
  var highlightName = this.highlightInput.value;
  if (highlightName.length < 3) {
    return function(name) { return false; };
  } else {
    return function(name) { return name.toLowerCase().includes(highlightName.toLowerCase()); };
  }
};

Gatherer.prototype.makeFactories = function (selectors) {
  var attrHighlight = "name";
  var factories = {};
  var that = this;
  Object.keys(this.factories).forEach(function(id) {
    factories[id] = that.factories[id](selectors, attrHighlight);
  });
  return factories;
};

Gatherer.prototype.makeOptions = function (data) {
  var attrSelectors = this.gatherAttributeSelectors();
  var scales = {
    x: this.pin["attrX"] ? this.renderOptions.scales.x : d3.scaleLinear()
         .domain(d3.extent(data.map(function(d) { return d[attrSelectors.attrX]; })))
         .range([10, this.canvas.width() - 10]),
    y: this.pin["attrY"] ? this.renderOptions.scales.y : d3.scaleLinear()
         .domain(d3.extent(data.map(function(d) { return d[attrSelectors.attrY]; })))
         .range([this.canvas.height() - 10, 10]),
    a: this.pin["attrArea"] ? this.renderOptions.scales.a : d3.scaleLinear()
         .domain(d3.extent(data.map(function(d) { return d[attrSelectors.attrArea]; })))
         .range([5, 20])
  };
  var labels = {
    x: attrs.basicAttributes[attrSelectors.attrX],
    y: attrs.basicAttributes[attrSelectors.attrY]
  };
  this.renderOptions = {
    scales: scales,
    labels: labels,
    highlight: this.getHighlight()
  };
};

Gatherer.prototype.pinScale = function(attrName) {
  this.pin[attrName] = true;
};

Gatherer.prototype.render = function () {
  this.gatherFilters();
  console.log(this.gatherAttributeSelectors());
  var factories = this.makeFactories(this.gatherAttributeSelectors());
  this.canvas.setUpdaterFactory(factories.main);
  this.canvas.addTooltips(factories.tooltip);
  var filteredData = this.addHighlights(this.filter(this.data), this.getHighlight());
  this.makeOptions(filteredData);
  this.canvas.renderData(filteredData, this.renderOptions);
};

Gatherer.prototype.addHighlights = function(data, highlight) {
  var attrHighlight = "name";
  var newData = data.map(function(d) { d.highlight = highlight(d[attrHighlight]); return d; });
  return newData;
};

Gatherer.prototype.serializeToUrl = function() {
  this.gatherFilters();
  var slug = makeRandomSlug();
  database.ref(slug).set({
    "attrSelectors": this.gatherAttributeSelectors(),
    "filters": this.filters
  });
  return `www.harrisonrbrown.com/ddl/index.html?v=${slug}`;
}

Gatherer.prototype.setData = function(data) {
  this.data = data;
};

Gatherer.prototype.unpinScale = function (attrName) {
  this.pin[attrName] = false;
};

module.exports = Gatherer;
