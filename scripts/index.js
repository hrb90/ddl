var d3 = require('d3');
var DDLCanvas = require('./ddl_canvas');
var makeCircleFactory = require('./appenders/circle_factory');
var TooltipFactories = require('./appenders/tooltip_factory');
var makeFilterSpan = require('./make_filter_span');
var attributes = require('./attrs');
var nbaData = require('../data/all_data.json');


document.addEventListener("DOMContentLoaded", function() {
  window.d3 = d3;

  var canvas = new DDLCanvas("chart");
  canvas.addTooltips(TooltipFactories.makeBasicPlayerTooltipFactory());
  var attrXSelector = document.getElementById("attrX");
  var attrYSelector = document.getElementById("attrY");
  var attrAreaSelector = document.getElementById("attrArea");


  function gatherAndReRender() {
    canvas.clearCanvas();
    canvas.clearFilters();
    canvas.setAppenderFactory(makeCircleFactory(attrXSelector.value,
      attrYSelector.value, attrAreaSelector.value));
    var posFilters = document.getElementsByClassName('posFilter');
    var posList = [];
    [].forEach.call(posFilters, function(el) { if (el.checked) posList.push(el.value); });
    canvas.addFilter(function(d) { return posList.includes(d.position); });
    var spanFilters = document.getElementsByClassName('span-filter');
    [].forEach.call(spanFilters, function(el) { canvas.addFilter(el.data.filter); });
    canvas.renderData(nbaData);
  }

  var attrSelectors = d3.selectAll('.attr-selector');

  Object.keys(attributes.basicAttributes).forEach(function(attr) {
    attrSelectors.append("option")
      .attr("class", attr)
      .attr("value", attr)
      .text(attributes.basicAttributes[attr]);
  });

  d3.select("#attrX")
    .select(".usgPct")
    .attr("selected", true);

  d3.select("#attrY")
    .select(".astPct")
    .attr("selected", true);

  d3.select("#attrArea")
    .select(".minutes")
    .attr("selected", true);

  Object.keys(attributes.filterAttributes).forEach(function(attr) {
    attrSelectors.selectAll(".filter")
      .append("option")
      .attr("value", attr)
      .text(attributes.filterAttributes[attr]);
  });

  document.getElementById("attr-selector-clicker").addEventListener("click", function() {
    var forms = document.getElementById("attrSelectorForms");
    forms.className = forms.className === "hidden" ? "" : "hidden";
  });

  document.getElementById("filter-clicker").addEventListener("click", function() {
    var filters = document.getElementById("filters");
    filters.className = filters.className === "hidden" ? "" : "hidden";
  });

  document.getElementById("attrSelectorForms").addEventListener("change", gatherAndReRender);

  document.getElementById("span-filter-container").append(makeFilterSpan("minutes", ">=", "400"));

  document.getElementById("filters").addEventListener("change", gatherAndReRender);

  document.getElementById("span-filter-container").addEventListener("click", function(e) {
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
    document.getElementById("span-filter-container").append(makeFilterSpan(attrName, comp, threshold));
    e.currentTarget.className = "hidden";
    gatherAndReRender();
  });

  gatherAndReRender();
});
