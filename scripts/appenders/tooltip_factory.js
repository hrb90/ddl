var AppenderFactoryFactory = require('./appender_factory_factory');

function makeToolTipFactory(attrName) {
  var tooltipFactory = new AppenderFactoryFactory('div');
  tooltipFactory.setInnerHTMLSetter(function(dataPoint) {
    return `<p>${dataPoint[attrName]}</p>`;
  });
  return tooltipFactory.toFactory();
}

module.exports = makeToolTipFactory;
