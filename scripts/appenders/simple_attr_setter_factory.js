function simpleAttrSetterFactory(propName, propTransform) {
  return function(dataPoint, idx, dataOptions) {
    return propTransform(dataPoint[propName], dataOptions);
  };
}

module.exports = simpleAttrSetterFactory;
