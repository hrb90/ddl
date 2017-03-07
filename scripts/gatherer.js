var d3 = require('d3');
var makeFilterSpan = require('./make_filter_span');

function Gatherer(factories, canvas, attrSelectors, filterContainer, newFilterForm) {
  this.factories = factories;
  this.canvas = canvas;
  this.attrSelectors = attrSelectors;
  this.filterContainer = filterContainer;
  this.newFilterForm = newFilterForm;
  var render = this.render.bind(this);
  this.filters = [];
  this.data = [];

  this.attrSelectors.addEventListener("change", render);
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
}

Gatherer.prototype.filter = function () {
  var that = this;
  return data.filter(function(d) {
    return that.filters.every(function(f) { return f(d); } );
  });
};

Gatherer.prototype.gatherAttributeSelectors = function () {

};

Gatherer.prototype.gatherFilters = function () {
  var posFilters = document.getElementsByClassName('posFilter');
  var posList = [];
  [].forEach.call(posFilters, function(el) { if (el.checked) posList.push(el.value); });
  var filterList = [ function(d) { return posList.includes(d.position); } ];
  var spanFilters = document.getElementsByClassName('span-filter');
  [].forEach.call(spanFilters, function(el) { filterList.push(el.data.filter); });
  return filterList;
};

Gatherer.prototype.render = function () {
  this.canvas.clearCanvas();
  var factories = this.factories(this.gatherAttributeSelectors());
  this.canvas.setAppenderFactory(factories.main);
  this.canvas.addTooltips(factories.tooltip);

};

Gatherer.prototype.setData = function(data) {
  this.data = data;
};
