var d3 = require('d3');
var DDLCanvas = require('./ddl_canvas');
var makeScatterPlotFactory = require('./appenders/circle_factory');
var makeFilterSpan = require('./make_filter_span');
var nbaData = require('../data/all_data.json');


document.addEventListener("DOMContentLoaded", function() {
  window.d3 = d3;

  var canvas = new DDLCanvas("chart");
  var attrXSelector = document.getElementById("attrX");
  var attrYSelector = document.getElementById("attrY");

  function gatherAndReRender() {
    canvas.clearCanvas();
    canvas.clearFilters();
    canvas.setAppenderFactory(makeScatterPlotFactory(attrXSelector.value, attrYSelector.value));
    var posFilters = document.getElementsByClassName('posFilter');
    var posList = [];
    [].forEach.call(posFilters, function(el) { if (el.checked) posList.push(el.value); });
    canvas.addFilter(function(d) { return posList.includes(d.position); });
    var spanFilters = document.getElementsByClassName('span-filter');
    [].forEach.call(spanFilters, function(el) { canvas.addFilter(el.data.filter); });
    canvas.renderData(nbaData);
  }

  document.getElementById("attrSelectorForms").addEventListener("change", gatherAndReRender);

  document.getElementById("filters").append(makeFilterSpan("minutes", ">=", "400"));

  document.getElementById("filters").addEventListener("change", gatherAndReRender);

  document.getElementById("filters").addEventListener("click", function(e) {
    if (e.target.className === "span-filter") {
     e.target.remove();
     gatherAndReRender();
    }
  });

  document.getElementById("new-filter-button").addEventListener("click", function(e) {
    document.getElementById("new-filter-form").className = "";
  });

  document.getElementById("new-filter-form").addEventListener("submit", function(e) {
    e.preventDefault();
    var attrName = document.getElementById("filter-attr").value;
    var comp = document.getElementById("comparator").value;
    var thresholdEl = document.getElementById("threshold");
    var threshold = thresholdEl.value;
    thresholdEl.value = "";
    document.getElementById("filters").append(makeFilterSpan(attrName, comp, threshold));
    e.currentTarget.className = "hidden";
    gatherAndReRender();
  });

  gatherAndReRender();
});
