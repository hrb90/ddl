var d3 = require('d3');
var AppenderFactoryFactory = require('./appender_factory_factory');
var simpleAttrSetterFactory = require('./simple_attr_setter_factory');
var colorPickers = require('./color_pickers.js');

function makeScatterPlotFactory(attrX, attrY,
          attrArea = "minutes",
          baseRadius = 10,
          colorPicker = colorPickers.positionPicker) {
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

module.exports = makeScatterPlotFactory;
