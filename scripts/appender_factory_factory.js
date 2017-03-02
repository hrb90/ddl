var d3 = require('d3');

function AppenderFactoryFactory(baseType = "g", subFactories = [], attrSetters = {}) {
  this.baseType = baseType;
  this.subFactories = subFactories;
  this.attrSetters = attrSetters;
  this.precomputeDataOptions = function(data) { return data; };
}

AppenderFactoryFactory.prototype.addAttributeSetter = function (attrName, setter) {
  this.attrSetters[attrName] = setter;
};

AppenderFactoryFactory.prototype.addSubFactory = function (factory) {
  this.subFactories.push(factory);
};

AppenderFactoryFactory.prototype.clearAttributeSetters = function () {
  this.attrSetters = {};
};
AppenderFactoryFactory.prototype.clearSubFactories = function () {
  this.subFactories = [];
};

AppenderFactoryFactory.prototype.setBaseType = function () {
  this.baseType = baseType;
};

AppenderFactoryFactory.prototype.setDataPrecomputer = function (precomputer) {
  this.precomputeDataOptions = precomputer;
};


AppenderFactoryFactory.prototype.toFactory = function () {
  var that = this;
  return function(data, options) {
    var dataDigest = that.precomputeDataOptions(data, options);
    return function(dataPoint, idx) {
      var newDOMElement = document.createElementNS(d3.namespaces.svg, that.baseType);
      newDOMElement.className = "ddl-element";

      for (var i = 0; i < that.subFactories.length; i++) {
        var child = that.subFactories[i](data, options)(dataPoint, idx);
        newDOMElement.append(child);
      }

      Object.keys(that.attrSetters).forEach(function(attrName) {
        newDOMElement.setAttribute(attrName, that.attrSetters[attrName](dataPoint, idx, Object.assign({}, options, dataDigest)));
      });

      return newDOMElement;
    };
  };
};

module.exports = AppenderFactoryFactory;
