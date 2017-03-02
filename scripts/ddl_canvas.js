var d3 = require('d3');

function DDLCanvas(svgId) {
  this.svgId = svgId;
  this.canvas = d3.select(`#${svgId}`);
  this.filters = [];
  this.pinBounds = false;
  this.showOutliers = false;
  this.appenderFactory = function() { return function() { }; };
}

DDLCanvas.prototype.addFilter = function(filter) {
  this.filters.push(filter);
};

DDLCanvas.prototype.clearCanvas = function () { };

DDLCanvas.prototype.clearFilters = function () {
  this.filters = [];
};

DDLCanvas.prototype.excludeOutliers = function () {
  this.showOutliers = false;
};

DDLCanvas.prototype.filter = function (data) {
  var myFilters = this.filters.slice(0);
  if (!this.showOutliers) {
    myFilters.push(function(d) { return d.minutes > 100; });
  }
  return data.filter(function(d) {
    return myFilters.every(function(f) { return f(d); } );
  });
};

DDLCanvas.prototype.getFactoryOptions = function () {
  return {
    width: this.canvas.nodes()[0].width.baseVal.value,
    height: this.canvas.nodes()[0].height.baseVal.value,
    pinBounds: this.pinBounds,
    showOutliers: this.showOutliers
  };
};

DDLCanvas.prototype.includeOutliers = function () {
  this.showOutliers = true;
};

DDLCanvas.prototype.pinBoundaries = function () {
  this.pinBounds = true;
};

DDLCanvas.prototype.renderData = function (data) {
  var filteredData = this.filter(data);
  var appender = this.appenderFactory(filteredData, this.getFactoryOptions());
  console.log(appender);
  this.canvas.selectAll(`#${this.svgId}`)
    .data(filteredData)
    .enter()
    .append(appender);
};

DDLCanvas.prototype.setAppenderFactory = function (appenderFactory) {
  this.appenderFactory = appenderFactory;
};

DDLCanvas.prototype.unpinBoundaries = function () {
  this.pinBounds = false;
};

module.exports = DDLCanvas;
