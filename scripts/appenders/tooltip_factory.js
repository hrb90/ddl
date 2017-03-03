var AppenderFactoryFactory = require('./appender_factory_factory');

function makeTooltipFactory(attrName) {
  var tooltipFactory = new AppenderFactoryFactory('div');
  tooltipFactory.setInnerHTMLSetter(function(dataPoint) {
    return `<p>${dataPoint[attrName]}</p>`;
  });
  return tooltipFactory.toFactory();
}

function makeBasicPlayerTooltipFactory() {
  var basicPlayerTooltipFactory = new AppenderFactoryFactory('div');
  basicPlayerTooltipFactory.setInnerHTMLSetter(function(playerSeason) {
    return `<h4>${playerSeason.name}</h4>
            <p>${playerSeason.team}</p>
            <p>${playerSeason.position}</p>`;
  });
  return basicPlayerTooltipFactory.toFactory();
}

module.exports = { makeTooltipFactory, makeBasicPlayerTooltipFactory };
