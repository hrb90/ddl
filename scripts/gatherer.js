var d3 = require('d3');
var makeFilterSpan = require('./make_filter_span');
var attrs = require('./attrs');

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
  this.pin = false;
  this.renderOptions = { scales: {}, labels: {} };
  this.addListeners();
}

Gatherer.prototype.addListeners = function () {
  var render = this.render;
  var unpinBounds = this.unpinBounds.bind(this);
  [].forEach.call(this.attrSelectors, function(s) {s.addEventListener("change", function() {
    unpinBounds();
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
  var that = this;
  return data.filter(function(d) {
    return that.filters.every(function(f) { return f(d); } );
  });
};

Gatherer.prototype.gatherAttributeSelectors = function () {
  var selections = {};
  [].forEach.call(this.attrSelectors, function (selector) {
    selections[selector.id] = selector.value;
  });
  return selections;
};

Gatherer.prototype.gatherFilters = function () {
  var posFilters = document.getElementsByClassName('posFilter');
  var posList = [];
  [].forEach.call(posFilters, function(el) { if (el.checked) posList.push(el.value); });
  var filterList = [ function(d) { return posList.includes(d.position); } ];
  var minYearFilter = document.getElementById('start-season-selector');
  var maxYearFilter = document.getElementById('end-season-selector');
  filterList.push(function(d) { return d.season >= parseInt(minYearFilter.value); });
  filterList.push(function(d) { return d.season <= parseInt(maxYearFilter.value); });
  var spanFilters = document.getElementsByClassName('span-filter');
  [].forEach.call(spanFilters, function(el) { filterList.push(el.data.filter); });
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
  var scales = this.pin ? this.renderOptions.scales : {
    x: d3.scaleLinear()
         .domain(d3.extent(data.map(function(d) { return d[attrSelectors.attrX]; })))
         .range([10, this.canvas.width() - 10]),
    y: d3.scaleLinear()
         .domain(d3.extent(data.map(function(d) { return d[attrSelectors.attrY]; })))
         .range([this.canvas.height() - 10, 10]),
    a: d3.scaleLinear()
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

Gatherer.prototype.pinBounds = function() {
  this.pin = true;
};

Gatherer.prototype.render = function () {
  this.gatherFilters();
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

Gatherer.prototype.setData = function(data) {
  this.data = data;
};

Gatherer.prototype.unpinBounds = function () {
  this.pin = false;
};

module.exports = Gatherer;
