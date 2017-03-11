var UpdaterFactoryFactory = require('./updater_factory_factory');

function makeTooltipFactory(attrName) {
  var tooltipFactory = new UpdaterFactoryFactory();
  tooltipFactory.setInnerHTMLSetter(function(dataPoint) {
    return `<p>${dataPoint[attrName]}</p>`;
  });
  return tooltipFactory.toFactory();
}

function makeBasicPlayerTooltipFactory() {
  var basicPlayerTooltipFactory = new UpdaterFactoryFactory();
  basicPlayerTooltipFactory.setInnerHTMLSetter(function(playerSeason) {
    console.log(playerSeason);
    return `<h4>${playerSeason.name}</h4>
            <p>${playerSeason.team} ${playerSeason.position}</p>
            <p>${playerSeason.season-1}-${playerSeason.season}</p>`;
  });
  return basicPlayerTooltipFactory.toFactory();
}

module.exports = { makeTooltipFactory, makeBasicPlayerTooltipFactory };
