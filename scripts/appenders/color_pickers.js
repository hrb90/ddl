var positionPicker = function(player) {
  var colorPairs = [];
  switch(player.position) {
    case "PG":
      colorPairs = ["red", "#e51616"];
      break;
    case "SG":
      colorPairs = ["orange", "#e59d16"];
      break;
    case "SF":
      colorPairs = ["yellow", "#e5e516"];
      break;
    case "PF":
      colorPairs = ["green", "#16e516"];
      break;
    case "C":
      colorPairs = ["blue", "#1616e5"];
      break;
  }
  return player.highlight ? colorPairs[0] : colorPairs[1];
};

module.exports = { positionPicker };
