var d3 = require('d3');
var DDLCanvas = require('./ddl_canvas');
var circleUpdaterFactory = require('./appenders/circle_factory');
var TooltipFactories = require('./appenders/tooltip_factory');
var Gatherer = require('./gatherer');
var makeFilterSpan = require('./make_filter_span');
var attributes = require('./attrs');
var nbaData = require('../data/placeholder_data.json');

function populateYearSelectors(data, startYear, endYear) {
  var selectors = d3.selectAll(".season-selector");
  selectors.selectAll("option").remove();
  var yearExtent = d3.extent(data, function(d){ return d.season; });
  d3.range(yearExtent[0], yearExtent[1] + 1).forEach(function(year) {
    selectors.append("option")
      .attr("class", `yr${year}`)
      .attr("value", year)
      .text(`${year-1}-${year}`);
  });

  d3.select("#start-season-selector")
    .select(`.yr${startYear}`)
    .attr("selected", true);

  d3.select("#end-season-selector")
    .select(`.yr${endYear}`)
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
  document.getElementById("new-filter-button").addEventListener("click", function(e) {
    document.getElementById("new-filter-form").className = "";
  });

  document.getElementById("glossary-link").addEventListener("click", function() {
    document.getElementById("glossary").className = "full-page";
    document.getElementById("how-to").className = "hidden";
    document.getElementById("main").className = "hidden";
  });

  document.getElementById("glossary-close").addEventListener("click", function() {
    document.getElementById("glossary").className = "hidden";
    document.getElementById("main").className = "";
  });

  document.getElementById("howto-link").addEventListener("click", function() {
    document.getElementById("how-to").className = "full-page";
    document.getElementById("glossary").className = "hidden";
    document.getElementById("main").className = "hidden";
  });

  document.getElementById("howto-close").addEventListener("click", function() {
    document.getElementById("how-to").className = "hidden";
    document.getElementById("main").className = "";
  });
}

function addPinner(attrName, gatherer) {
  var pinIcon = document.getElementById(attrName).getElementsByTagName("i")[0];
  pinIcon.addEventListener("click", function() {
    if (pinIcon.className.includes("pinned")) {
      pinIcon.className = "fa fa-map-pin";
      gatherer.unpinScale(attrName);
      gatherer.render();
    } else {
      pinIcon.className = "fa fa-map-pin pinned";
      gatherer.pinScale(attrName);
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
  populateYearSelectors(nbaData, 2016, 2017);
  var gatherer = new Gatherer({
    main: circleUpdaterFactory,
    tooltip: TooltipFactories.makeBasicPlayerTooltipFactory
  }, canvas, {
    attrSelectors: document.getElementsByClassName('graph-selector'),
    filterContainer: document.getElementById('filters'),
    newFilterForm: document.getElementById('new-filter-form'),
    highlightInput: document.getElementById('highlight-input')
  });
  ["attrX",
   "attrY",
   "attrArea"].forEach(function(name) { addPinner(name, gatherer); });
  addClickers();
  document.getElementById("span-filter-container").append(makeFilterSpan("minutes", ">=", "400"));
  gatherer.setData(nbaData);
  d3.json("data/all_data.json", function(error, data){
    if (!error) {
      gatherer.setData(data);
      populateYearSelectors(data, 2016, 2017);
    }
  });
  gatherer.render();
});
