var d3 = require('d3');
var UpdaterBuilder = require('./updater_builder');
var simpleAttrSetterFactory = require('./simple_attr_setter_factory');
var colorPickers = require('./color_pickers.js');
var attrMap = require('../attrs');

function circleUpdaterFactory(attrs,
          attrHighlight,
          fillPicker = colorPickers.positionPicker) {
  var attrX = attrs.attrX;
  var attrY = attrs.attrY;
  var attrArea = attrs.attrArea;
  var circleFactory = new UpdaterBuilder();
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
      highlight: options.highlight || function() { return false; }
    };
  });
  circleFactory.addAttributeSetter('cx',
    simpleAttrSetterFactory(attrX, function(x, options) { return options.xScale(x); }));
  circleFactory.addAttributeSetter('cy',
    simpleAttrSetterFactory(attrY, function(y, options) { return options.yScale(y); }));
  circleFactory.addAttributeSetter('r',
    simpleAttrSetterFactory(attrArea, function(a, options) { return options.aScale(a); }));
  circleFactory.addAttributeSetter('stroke', colorPickers.strokePicker);
  circleFactory.addAttributeSetter('stroke-width', function() { return 3; });
  circleFactory.addAttributeSetter('fill', fillPicker);
  circleFactory.addAttributeSetter('player',
  simpleAttrSetterFactory("playerId", function(x) { return x; }));
  circleFactory.addAttributeSetter('opacity', function(d) {
    return d.highlight ? 0.8 : 0.6;
  } );
  circleFactory.addAttributeSetter('class', function(d) {
    return d.highlight ? "ddl-element highlighted" : "ddl-element";
  });

  return circleFactory.build();
}

module.exports = circleUpdaterFactory;
