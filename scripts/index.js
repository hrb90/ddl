var d3 = require('d3');
var DDLCanvas = require('./ddl_canvas');
var makeCircleFactory = require('./appenders/circle_factory');
var TooltipFactories = require('./appenders/tooltip_factory');
var Gatherer = require('./gatherer');
var makeFilterSpan = require('./make_filter_span');
var attributes = require('./attrs');
var nbaData = require('../data/dev_data.json');

function populateYearSelectors() {
  var selectors = d3.selectAll(".season-selector");
  d3.range(1980, 2018).forEach(function(year) {
    selectors.append("option")
      .attr("class", `yr${year}`)
      .attr("value", year)
      .text(`${year-1}-${year}`);
  });

  d3.select("#start-season-selector")
    .select(".yr2001")
    .attr("selected", true);

  d3.select("#end-season-selector")
    .select(".yr2017")
    .attr("selected", true);
}

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

  document.getElementById("new-filter-button").addEventListener("click", function(e) {
    document.getElementById("new-filter-form").className = "";
  });

  document.getElementById("glossary-link").addEventListener("click", function() {
    document.getElementById("glossary").className = "full-page";
    document.getElementById("main").className = "hidden";
  });

  document.getElementById("glossary-close").addEventListener("click", function() {
    document.getElementById("glossary").className = "hidden";
    document.getElementById("main").className = "";
  });

  document.getElementById("howto-link").addEventListener("click", function() {
    document.getElementById("how-to").className = "full-page";
    document.getElementById("main").className = "hidden";
  });

  document.getElementById("howto-close").addEventListener("click", function() {
    document.getElementById("how-to").className = "hidden";
    document.getElementById("main").className = "";
  });
}

function addPinner(gatherer) {
  var pinIcon = document.getElementById("pin-icon");
  pinIcon.addEventListener("click", function() {
    if (pinIcon.className.includes("pinned")) {
      pinIcon.className = "fa fa-map-pin";
      gatherer.unpinBounds();
      gatherer.render();
    } else {
      pinIcon.className = "fa fa-map-pin pinned";
      gatherer.pinBounds();
    }
  });
  document.getElementById('attrSelectorForms').addEventListener("change", function() {
    pinIcon.className = "fa fa-map-pin";
  });
}

document.addEventListener('DOMContentLoaded', function () {
  var canvas = new DDLCanvas("chart");
  var attrSelectors = d3.selectAll('.attr-selector');
  populateSelectors(attrSelectors);
  populateYearSelectors();
  var gatherer = new Gatherer({
    main: makeCircleFactory,
    tooltip: TooltipFactories.makeBasicPlayerTooltipFactory
  }, canvas, {
    attrSelectors: document.getElementsByClassName('graph-selector'),
    filterContainer: document.getElementById('filters'),
    newFilterForm: document.getElementById('new-filter-form'),
    highlightInput: document.getElementById('highlight-input')
  });
  addPinner(gatherer);
  addClickers();
  document.getElementById("span-filter-container").append(makeFilterSpan("minutes", ">=", "400"));
  gatherer.setData(nbaData);
  gatherer.render();
});
