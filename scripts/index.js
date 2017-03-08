var d3 = require('d3');
var DDLCanvas = require('./ddl_canvas');
var makeCircleFactory = require('./appenders/circle_factory');
var TooltipFactories = require('./appenders/tooltip_factory');
var Gatherer = require('./gatherer');
var makeFilterSpan = require('./make_filter_span');
var attributes = require('./attrs');
var nbaData = require('../data/all_data.json');

function populateSelectors(selectors) {
  Object.keys(attributes.basicAttributes).forEach(function(attr) {
    selectors.append("option")
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
    selectors.selectAll(".filter")
      .append("option")
      .attr("value", attr)
      .text(attributes.filterAttributes[attr]);
  });
}

function addClickers() {
  document.getElementById("attr-selector-clicker").addEventListener("click", function() {
    var forms = document.getElementById("attrSelectorForms");
    forms.className = forms.className === "hidden" ? "" : "hidden";
  });

  document.getElementById("filter-clicker").addEventListener("click", function() {
    var filters = document.getElementById("filters");
    filters.className = filters.className === "hidden" ? "" : "hidden";
  });
}

document.addEventListener('DOMContentLoaded', function () {
  var canvas = new DDLCanvas("chart");
  var attrSelectors = d3.selectAll('.attr-selector');
  populateSelectors(attrSelectors);
  var gatherer = new Gatherer({
    main: makeCircleFactory,
    tooltip: TooltipFactories.makeBasicPlayerTooltipFactory
  }, canvas, {
    attrSelectors: document.getElementsByClassName('attr-selector'),
    filterContainer: document.getElementById('filters'),
    newFilterForm: document.getElementById('new-filter-form')
  });
  gatherer.setData(nbaData);
  gatherer.render();
  addClickers();
  document.getElementById("span-filter-container").append(makeFilterSpan("minutes", ">=", "400"));
});
