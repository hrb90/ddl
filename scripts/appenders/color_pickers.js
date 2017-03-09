var positionPicker = function(player) {
  switch(player.position) {
    case "PG":
      return "red";
    case "SG":
      return "orange";
    case "SF":
      return "yellow";
    case "PF":
      return "green";
    case "C":
      return "blue";
  }
};

module.exports = { positionPicker };
