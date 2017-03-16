# Data Don't Lie

Data Don't Lie is an NBA statistical visualization tool. It allows users to create and explore interactive charts made with basketball statistical data.

## Design

DDL was built to enforce the following dataflow:

1. The user makes a change to an input element controlling the data being plotted.
2. This change triggers an event in the Gatherer object, which collects all the information from the user inputs and filters the data.
3. The Gatherer creates a new UpdaterFactory and attaches it to a DDLCanvas instance.
3. The DDLCanvas uses the UpdaterFactory to create a plot and render it onto the DOM.

## Features

### Chart

DDL's chart is built using an inline SVG element. Shapes are rendered onto it using D3.js.

### Gatherer

The Gatherer class puts listeners on appropriate elements to rerender when the user wishes to see a different view of the data. It also keeps track of some data itself; for instance, it saves precomputed bounds, allowing us to "pin" the scales so that they don't change when we filter the data differently.

### Updaters

The Updater pattern is the core of Data Don't Lie. An updater is a function with signature `(data, options) => (data-joined D3 selection) => (updated D3 selection)`. The first call, passing in (data, options), allows us to precompute scaling functions and other things that need access to the entire data set under consideration. The second call actually updates the visual properties of the data-joined D3 selection.

There is also an UpdaterFactoryFactory class which allows for easy construction of updater functions.

This is a very powerful and general pattern allowing for easy maintenance and extensibility.

### DDLCanvas

The DDLCanvas class is a wrapper around the SVG HTML element. It allows you to set an updater factory and render data to the canvas with a single method call. It also provides height and width information to the Gatherer object.

## Libraries

DDL was built with D3.js.

## Future Directions
