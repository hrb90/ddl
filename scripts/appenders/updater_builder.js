var d3 = require('d3');

function UpdaterBuilder(attrSetters = {}) {
  this.attrSetters = attrSetters;
  this.innerHTMLSetter = function () { return ""; };
  this.precomputeDataOptions = function(data) { return {}; };
}

UpdaterBuilder.prototype.addAttributeSetter = function (attrName, setter) {
  this.attrSetters[attrName] = setter;
};


UpdaterBuilder.prototype.clearAttributeSetters = function () {
  this.attrSetters = {};
};

UpdaterBuilder.prototype.setDataPrecomputer = function (precomputer) {
  this.precomputeDataOptions = precomputer;
};

UpdaterBuilder.prototype.setInnerHTMLSetter = function (innerHTMLSetter) {
  this.innerHTMLSetter = innerHTMLSetter;
};


UpdaterBuilder.prototype.build = function () {
  var that = this;
  return function(data, options) {
    var dataDigest = that.precomputeDataOptions(data, options);
    return function(selection) {
      Object.keys(that.attrSetters).forEach(function(attrName) {
        selection.attr(attrName, function(d, idx) {
          return that.attrSetters[attrName](d, idx, Object.assign({}, options, dataDigest));
        });
      });
      selection.html(function(d, idx) {
        return that.innerHTMLSetter(d, idx, Object.assign({}, options, dataDigest));
      });
      return selection;
    };
  };
};

module.exports = UpdaterBuilder;
