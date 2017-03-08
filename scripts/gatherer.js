var d3 = require('d3');
var makeFilterSpan = require('./make_filter_span');

function Gatherer(factories, canvas, domElements) {
  this.factories = factories;
  this.canvas = canvas;
  this.attrSelectors = domElements.attrSelectors;
  this.filterContainer = domElements.filterContainer;
  this.newFilterForm = domElements.newFilterForm;
  this.render = this.render.bind(this);
  this.filters = [];
  this.data = [];
  this.addListeners();
}

Gatherer.prototype.addListeners = function () {
  var render = this.render;
  [].forEach.call(this.attrSelectors, function(s) {s.addEventListener("change", render); });
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
  var spanFilters = document.getElementsByClassName('span-filter');
  [].forEach.call(spanFilters, function(el) { filterList.push(el.data.filter); });
  this.filters = filterList;
};

Gatherer.prototype.makeFactories = function (selectors) {
  var factories = {};
  var that = this;
  Object.keys(this.factories).forEach(function(id) {
    factories[id] = that.factories[id](selectors);
  });
  return factories;
};

Gatherer.prototype.render = function () {
  this.canvas.clearCanvas();
  this.gatherFilters();
  var factories = this.makeFactories(this.gatherAttributeSelectors());
  this.canvas.setAppenderFactory(factories.main);
  this.canvas.addTooltips(factories.tooltip);
  this.canvas.renderData(this.filter(this.data));
};

Gatherer.prototype.setData = function(data) {
  this.data = data;
};

module.exports = Gatherer;
