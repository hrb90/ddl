var d3 = require('d3');


function DDLCanvas(svgId) {
  this.svgId = svgId;
  this.canvas = d3.select(`#${svgId}`);
  this.filters = [];
  this.pinBounds = false;
  this.updaterFactory = function() { return function() { }; };
  this.tooltipFactory = null;
}

DDLCanvas.prototype.addAxes = function (options) {
  this.canvas.selectAll('.axis').remove();
  if (options.scales.x) {
    var xAxis = d3.axisTop(options.scales.x);
    this.canvas.append('g')
      .attr('class', 'axis')
      .attr('transform', `translate(0, ${this.height() + 5})`)
      .call(xAxis);
  }
  if (options.labels.x) {
    this.canvas.append('text')
      .attr('class', 'axis')
      .attr('transform', `translate(${this.width() / 2}, ${this.height() + 20})`)
      .text(options.labels.x);
  }
  if (options.scales.y) {
    var yAxis = d3.axisRight(options.scales.y);
    this.canvas.append("g")
      .attr('class', 'axis')
      .attr("transform", "translate(-10, 0)")
      .call(yAxis);
  }
  if (options.labels.y) {
    this.canvas.append('text')
      .attr('class', 'axis')
      .attr('transform', `translate(-14, ${this.height() / 2})rotate(270)`)
      .text(options.labels.y);
  }
};

DDLCanvas.prototype.addTooltips = function(tooltipFactory) {
  this.tooltipFactory = tooltipFactory;
};

DDLCanvas.prototype.clearCanvas = function () {
  this.canvas.selectAll("circle").remove();
  this.canvas.selectAll('g').remove();
  this.canvas.selectAll('text').remove();
};

DDLCanvas.prototype.getFactoryOptions = function (options) {
  return Object.assign({
    width: this.width(),
    height: this.height(),
  }, options);
};


DDLCanvas.prototype.height = function () {
  return this.canvas.nodes()[0].height.baseVal.value;
};

DDLCanvas.prototype.renderData = function (data, options) {
  var updater = this.updaterFactory(data, this.getFactoryOptions(options));
  this.addAxes(options);
  var tooltipupdater, tooltip;
  if (this.tooltipFactory) {
    d3.select('body').selectAll('.tooltip').remove();
    tooltip = d3.select('body').append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0);
    tooltipupdater = this.tooltipFactory(data, this.getFactoryOptions(options));
  }
  var plot = this.canvas.selectAll('.ddl-element').data(data, function(d) { return d.playerId + d.season + d.highlight; });
  plot.exit().remove();
  plot = updater(plot.enter().append('circle').attr('class', 'ddl-element').merge(plot));

  if (tooltipupdater) {
    plot.on("mouseover", function(d) {
      tooltip.transition().duration(200).style("opacity", 0.9);
      tooltip.style("left", (d3.event.pageX) + "px")
        .style("top", (d3.event.pageY - 28) + "px")
        .style("color", "black");
      tooltip.html(`<h4>${d.name}</h4>
              <p>${d.team} ${d.position}</p>
              <p>${d.season-1}-${d.season}</p>`);
    })
    .on("mouseout", function() {
      tooltip.transition().duration(200).style("opacity", 0);
    });
  }
};

DDLCanvas.prototype.removeTooltips = function () {
  this.tooltipFactory = null;
};

DDLCanvas.prototype.setUpdaterFactory = function (updaterFactory) {
  this.updaterFactory = updaterFactory;
};

DDLCanvas.prototype.width = function () {
  return this.canvas.nodes()[0].width.baseVal.value;
};

module.exports = DDLCanvas;
