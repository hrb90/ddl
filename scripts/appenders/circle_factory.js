var d3 = require('d3');
var AppenderFactoryFactory = require('./appender_factory_factory');
var simpleAttrSetterFactory = require('./simple_attr_setter_factory');
var colorPickers = require('./color_pickers.js');
var attrMap = require('../attrs');

function makeCircleFactory(attrs,
          attrHighlight,
          colorPicker = colorPickers.positionPicker) {
  var attrX = attrs.attrX;
  var attrY = attrs.attrY;
  var attrArea = attrs.attrArea;
  var circleFactory = new AppenderFactoryFactory("circle");
  circleFactory.setDataPrecomputer(function(data, options) {
    options.scales = options.scales || {};
    var xScale = options.scales.x || d3.scaleLinear()
                .domain(d3.extent(data.map(function(d) { return d[attrX]; })))
                .range([10, options.width - 10]);
    var yScale = options.scales.y || d3.scaleLinear()
                .domain(d3.extent(data.map(function(d) { return d[attrY]; })))
                .range([options.height - 10, 10]);
    var aScale = options.scales.a || d3.scaleLinear()
                .domain(d3.extent(data.map(function(d) { return d[attrArea]; })))
                .range([5, 20]);
    return {
      xScale: xScale,
      yScale: yScale,
      aScale: aScale,
      xLabel: attrMap.basicAttributes[attrX],
      yLabel: attrMap.basicAttributes[attrY],
      highlight: options.highlight || function(name) { return name.includes("sheed"); }
    };
  });
  circleFactory.addAttributeSetter('cx',
    simpleAttrSetterFactory(attrX, function(x, options) { return options.xScale(x); }));
  circleFactory.addAttributeSetter('cy',
    simpleAttrSetterFactory(attrY, function(y, options) { return options.yScale(y); }));
  circleFactory.addAttributeSetter('r',
    simpleAttrSetterFactory(attrArea, function(a, options) { return options.aScale(a); }));
  circleFactory.addAttributeSetter('stroke',
    simpleAttrSetterFactory(attrHighlight, function(h, options) {
      return options.highlight(h) ? 'black' : 'none';
    }));
  var zIdx = 0;
  circleFactory.addAttributeSetter('fill', colorPicker);
  circleFactory.addAttributeSetter('player',
  simpleAttrSetterFactory("playerId", function(x) { return x; }));
  circleFactory.addAttributeSetter('opacity', function() { return 0.8; } );

  return circleFactory.toFactory();
}

module.exports = makeCircleFactory;
