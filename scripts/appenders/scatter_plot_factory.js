var AppenderFactoryFactory = require('./appender_factory_factory');
var makeCircleFactory = require('./circle_factory');
var makeToolTipFactory = require('./tooltip_factory');

function makeScatterPlotFactory(attrX, attrY, attrName = "playerId", attrArea = "minutes") {
  var scatterPlotFactory = new AppenderFactoryFactory('g');
  scatterPlotFactory.addSubFactory(makeCircleFactory(attrX, attrY));
  scatterPlotFactory.addSubFactory(makeToolTipFactory(attrName));
  return scatterPlotFactory.toFactory();
}

module.exports = makeScatterPlotFactory;
