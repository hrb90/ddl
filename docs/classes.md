# Classes

## Gatherer

Collects and preprocesses data about what we want to render from user inputs on the DOM

### scales

### filters

### pinBoundaries()

### unpinBoundaries()

Self-explanatory.

## DDLCanvas

Wrapper around the svg element that D3 renders onto.

### canvas

Reference to the SVG element in the DOM

### filters

An array of filters. A filter is just a function that takes a data point and returns a boolean indicating whether it should be plotted.

### appenderFactory

A function that takes in dimensions and returns a function that takes (dataPoint, idx, data) and returns an SVG element corresponding to that datapoint.

### clearCanvas()

Clears the canvas.

### renderData(data)

Takes an array of data and renders it onto the canvas.

### setAppenderFactory(appenderFactory)

Obvious.

## UpdaterFactoryFactory

Constructs AppenderFactories.

### attributeSetters

Associative array of functions with signature (dataPoint, idx, dataOptions) that compute an attribute's value. The keys are the attribute names.

### addAttributeSetter(attrName, setter)

Does what you think it does.

### clearAttributeSetters()

### setBaseType(type)

Sets the type of DOM element the AppenderFactory will return.

### toFactory()

Returns an AppenderFactory.
