var d3 = require('d3');

window.d3 = d3;

var chart = d3.select(".chart");
var chartHeight = chart.height;
var chartWidth = chart.width;

// Takes in x, y, radius attributes and a callback function that produces a color
// As well as the dimensions of your canvas
// Returns a function that transforms data into a very easy-to-use form for D3
function prepForScatterChart(attrX, attrY, attrRadius, colorPicker, dimensions) {
  return function(data) {
    var xExtremes = { min: Infinity, max: -Infinity};
    var yExtremes = { min: Infinity, max: -Infinity};
    var totalRadius = 0;
    console.log(data);
    data.forEach(function(d) {
      xExtremes = { min: Math.min(xExtremes.min, d[attrX]),
                    max: Math.max(xExtremes.max, d[attrX])};
      yExtremes = { min: Math.min(yExtremes.min, d[attrY]),
                    max: Math.max(yExtremes.max, d[attrY])};
      totalRadius += d[attrRadius];
    });

    function transX(x) {
      return dimensions.x * (x - xExtremes.min)/(xExtremes.max - xExtremes.min);
    }

    function transY(y) {
      return dimensions.y * (yExtremes.max - y)/(yExtremes.max - yExtremes.min);
    }

    function transRad(rad) {
      return dimensions.avgRad * rad * data.length / totalRadius;
    }

    return data.map(function(d) {
      return {
        x: transX(d[attrX]),
        y: transY(d[attrY]),
        radius: transRad(d[attrRadius]),
        color: colorPicker(d),
        name: d.playerId
      };
    });
  };
}

var picker = function(player) {
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

document.addEventListener("DOMContentLoaded", function() {
  var dims = { x: 1200, y: 600, avgRad: 10 };
  var chart = d3.select("#chart")
    .attr("height", dims.y)
    .attr("width", dims.x);

  var transformer = prepForScatterChart("stlPct", "blkPct", "minutes", picker, dims);

  chart.selectAll("#chart")
  .data(transformer(window.nbaData))
  .enter()
  .append("circle")
  .attr("cx", function(d) { return d.x; })
  .attr("cy", function(d) { return d.y; })
  .attr("r", function(d) { return d.radius; })
  .attr("fill", function(d) { return d.color; })
  .attr("player", function(d) { return d.name; });
});
