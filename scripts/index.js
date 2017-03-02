var d3 = require('d3');
var DDLCanvas = require('./ddl_canvas');
var AppenderFactoryFactory = require('./appender_factory_factory');

function simpleAttrSetterFactory(propName, propTransform) {
  return function(dataPoint, idx, dataOptions) {
    return propTransform(dataPoint[propName], dataOptions);
  };
}

var picker = function(player) {
  switch(player.position) {
    case "PG":
      return "red";
    case "SG":
      return "orange";
    case "SF":
      return "yellow";
    case "PF":
      return "green";
    case "C":
      return "blue";
  }
};

function makeScatterPlotFactory(attrX, attrY,
          attrArea = "minutes",
          baseRadius = 10,
          colorPicker = picker) {
  var circleFactory = new AppenderFactoryFactory("circle");
  circleFactory.setDataPrecomputer(function(data) {
    var xBounds = d3.extent(data.map(function(d) { return d[attrX]; }));
    var yBounds = d3.extent(data.map(function(d) { return d[attrY]; }));
    var avgRadius = d3.mean(data.map(function(d) { return Math.sqrt(d[attrArea]); }));
    return {
      xBounds: xBounds,
      yBounds: yBounds,
      avgRadius: avgRadius
    };
  });
  circleFactory.addAttributeSetter('cx',
  simpleAttrSetterFactory(attrX, function(x, dataOptions) {
    return dataOptions.width * (x - dataOptions.xBounds[0]) / (dataOptions.xBounds[1] - dataOptions.xBounds[0]);
  }));
  circleFactory.addAttributeSetter('cy',
  simpleAttrSetterFactory(attrY, function(y, dataOptions) {
    return dataOptions.height * (dataOptions.yBounds[1] - y) / (dataOptions.yBounds[1] - dataOptions.yBounds[0]);
  }));
  circleFactory.addAttributeSetter('r',
  simpleAttrSetterFactory(attrArea, function(a, dataOptions) {
    return baseRadius * ( Math.sqrt(a) / dataOptions.avgRadius );
  }));
  circleFactory.addAttributeSetter('fill', colorPicker);
  circleFactory.addAttributeSetter('player',
  simpleAttrSetterFactory("playerId", function(x) { return x; }));

  return circleFactory.toFactory();
}

document.addEventListener("DOMContentLoaded", function() {
  window.d3 = d3;

  var canvas = new DDLCanvas("chart");
  var attrXSelector = document.getElementById("attrX");
  var attrYSelector = document.getElementById("attrY");


  canvas.setAppenderFactory(makeScatterPlotFactory(attrXSelector.value, attrYSelector.value));
  canvas.renderData(window.nbaData);

  document.getElementById("attrSelectorForms").addEventListener("change", e => {
    canvas.clearCanvas();
    canvas.setAppenderFactory(makeScatterPlotFactory(attrXSelector.value, attrYSelector.value));
    canvas.renderData(window.nbaData);
  });

  document.getElementById("filters").addEventListener("change", e => {
    canvas.clearCanvas();
    canvas.clearFilters();
    var posFilters = document.getElementsByClassName('posFilter');
    var posList = [];
    [].forEach.call(posFilters, function(el) { if (el.checked) posList.push(el.value); });
    canvas.addFilter(function(d) { return posList.includes(d.position); });
    var spanFilters = document.getElementsByClassName('spanFilter');
    [].forEach.call(spanFilters, function(el) { canvas.addFilter(el.data-filter); });
    canvas.renderData(window.nbaData);
  });
});
