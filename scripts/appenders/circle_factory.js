var d3 = require('d3');
var AppenderFactoryFactory = require('./appender_factory_factory');
var simpleAttrSetterFactory = require('./simple_attr_setter_factory');
var colorPickers = require('./color_pickers.js');
var attrMap = require('../attrs');

function makeCircleFactory(attrs,
          baseRadius = 10,
          colorPicker = colorPickers.positionPicker) {
  var attrX = attrs.attrX;
  var attrY = attrs.attrY;
  var attrArea = attrs.attrArea;
  var circleFactory = new AppenderFactoryFactory("circle");
  circleFactory.setDataPrecomputer(function(data, options) {
    var xScale = options.xScale || d3.scaleLinear()
                .domain(d3.extent(data.map(function(d) { return d[attrX]; })))
                .range([10, options.width - 10]);
    var yScale = options.yScale || d3.scaleLinear()
                .domain(d3.extent(data.map(function(d) { return d[attrY]; })))
                .range([options.height - 10, 10]);
    var avgRadius = d3.mean(data.map(function(d) { return Math.sqrt(d[attrArea]); }));
    return {
      xScale: xScale,
      yScale: yScale,
      avgRadius: avgRadius,
      xLabel: attrMap.basicAttributes[attrX],
      yLabel: attrMap.basicAttributes[attrY]
    };
  });
  circleFactory.addAttributeSetter('cx',
    simpleAttrSetterFactory(attrX, function(x, dataOptions) { return dataOptions.xScale(x); }));
  circleFactory.addAttributeSetter('cy',
    simpleAttrSetterFactory(attrY, function(y, dataOptions) { return dataOptions.yScale(y); }));
  circleFactory.addAttributeSetter('r',
    simpleAttrSetterFactory(attrArea, function(a, dataOptions) {
      return baseRadius * ( Math.sqrt(a) / dataOptions.avgRadius );
    })
  );
  var zIdx = 0;
  circleFactory.addAttributeSetter('fill', colorPicker);
  circleFactory.addAttributeSetter('player',
  simpleAttrSetterFactory("playerId", function(x) { return x; }));
  circleFactory.addAttributeSetter('opacity', function() { return 0.8; } );

  return circleFactory.toFactory();
}

module.exports = makeCircleFactory;
