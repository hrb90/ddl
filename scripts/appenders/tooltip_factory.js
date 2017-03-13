var UpdaterFactoryFactory = require('./updater_factory_factory');
var attributeMap = require('../attrs');

function makeTooltipFactory(attrName) {
  var tooltipFactory = new UpdaterFactoryFactory();
  tooltipFactory.setInnerHTMLSetter(function(dataPoint) {
    return `<p>${dataPoint[attrName]}</p>`;
  });
  return tooltipFactory.toFactory();
}

function makeBasicPlayerTooltipFactory(attrs) {
  var basicPlayerTooltipFactory = new UpdaterFactoryFactory();
  basicPlayerTooltipFactory.setInnerHTMLSetter(function(playerSeason) {
    return `<h4>${playerSeason.name}</h4>
            <p>${playerSeason.team} ${playerSeason.position}</p>
            <p>${playerSeason.season-1}-${playerSeason.season}</p>
            ${Object.values(attrs).map(function(attr) {
              return `<p>${attributeMap.basicAttributes[attr]}: ${playerSeason[attr]}</p>`;
            }).join('')}`;
  });
  return basicPlayerTooltipFactory.toFactory();
}

module.exports = { makeTooltipFactory, makeBasicPlayerTooltipFactory };
