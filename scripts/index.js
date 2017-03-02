var d3 = require('d3');
var DDLCanvas = require('./ddl_canvas');
var AppenderFactoryFactory = require('./appender_factory_factory');

function simpleAttrSetterFactory(propName, propTransform) {
  return function(dataPoint, idx, dataOptions) {
    return propTransform(dataPoint[propName], dataOptions);
  };
}

document.addEventListener("DOMContentLoaded", function() {
  window.d3 = d3;

  var canvas = new DDLCanvas("chart");
  var attrX = "stlPct";
  var attrY = "blkPct";

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

  var circleFactory = new AppenderFactoryFactory("circle");
  circleFactory.setDataPrecomputer(function(data) {
    var xBounds = d3.extent(data.map(function(d) { return d[attrX]; }));
    var yBounds = d3.extent(data.map(function(d) { return d[attrY]; }));
    var avgSqrtMins = d3.mean(data.map(function(d) { return Math.sqrt(d.minutes); }));
    return {
      xBounds: xBounds,
      yBounds: yBounds,
      avgSqrtMins: avgSqrtMins
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
    simpleAttrSetterFactory("minutes", function(mins, dataOptions) {
      return 10 * ( Math.sqrt(mins) / dataOptions.avgSqrtMins );
    }));
  circleFactory.addAttributeSetter('fill', picker);
  circleFactory.addAttributeSetter('player',
    simpleAttrSetterFactory("playerId", function(x) { return x; }));

  canvas.setAppenderFactory(circleFactory.toFactory());
  canvas.renderData(window.nbaData);
});
