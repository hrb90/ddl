var d3 = require('d3');


function DDLCanvas(svgId) {
  this.svgId = svgId;
  this.canvas = d3.select(`#${svgId}`);
  this.filters = [];
  this.pinBounds = false;
  this.appenderFactory = function() { return function() { }; };
  this.tooltipFactory = null;
}

DDLCanvas.prototype.addAxes = function (options) {
  if (options.scales.x) {
    var xAxis = d3.axisTop(options.scales.x);
    this.canvas.append('g')
      .attr('transform', `translate(0, ${this.height() + 5})`)
      .call(xAxis);
  }
  if (options.labels.x) {
    this.canvas.append('text')
      .attr('transform', `translate(${this.width() / 2}, ${this.height() + 20})`)
      .text(options.labels.x);
  }
  if (options.scales.y) {
    var yAxis = d3.axisRight(options.scales.y);
    this.canvas.append("g")
      .attr("transform", "translate(-10, 0)")
      .call(yAxis);
  }
  if (options.labels.y) {
    this.canvas.append('text')
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
  var appender = this.appenderFactory(data, this.getFactoryOptions(options));
  this.addAxes(options);
  var tooltipAppender, tooltip;
  if (this.tooltipFactory) {
    tooltip = d3.select('body').append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0);
    tooltipAppender = this.tooltipFactory(data, this.getFactoryOptions(options));
  }
  var plot = this.canvas.selectAll(`#${this.svgId}`)
    .data(data)
    .enter()
    .append(appender);
  if (tooltipAppender) {
    plot.on("mouseover", function(d) {
      tooltip.transition().duration(200).style("opacity", 0.9);
      tooltip.style("left", (d3.event.pageX) + "px")
        .style("top", (d3.event.pageY - 28) + "px")
        .style("color", "black");
      tooltip.html(tooltipAppender(d).outerHTML);
    })
    .on("mouseout", function() {
      tooltip.transition().duration(200).style("opacity", 0);
    });
  }
};

DDLCanvas.prototype.removeTooltips = function () {
  this.tooltipFactory = null;
};

DDLCanvas.prototype.setAppenderFactory = function (appenderFactory) {
  this.appenderFactory = appenderFactory;
};

DDLCanvas.prototype.width = function () {
  return this.canvas.nodes()[0].width.baseVal.value;
};

module.exports = DDLCanvas;
