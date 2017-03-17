var UpdaterBuilder = require('./updater_builder');
var attributeMap = require('../attrs');

function makeTooltipFactory(attrName) {
  var tooltipBuilder = new UpdaterBuilder();
  tooltipBuilder.setInnerHTMLSetter(function(dataPoint) {
    return `<p>${dataPoint[attrName]}</p>`;
  });
  return tooltipBuilder.build();
}

function makeBasicPlayerTooltipFactory(attrs) {
  var basicPlayerTooltipBuilder = new UpdaterBuilder();
  basicPlayerTooltipBuilder.setInnerHTMLSetter(function(playerSeason) {
    return `<h4>${playerSeason.name}</h4>
            <p>${playerSeason.team} ${playerSeason.position}</p>
            <p>${playerSeason.season-1}-${playerSeason.season}</p>
            ${Object.values(attrs).map(function(attr) {
              return `<p>${attributeMap.basicAttributes[attr]}: ${playerSeason[attr]}</p>`;
            }).join('')}`;
  });
  return basicPlayerTooltipBuilder.build();
}

module.exports = { makeTooltipFactory, makeBasicPlayerTooltipFactory };
