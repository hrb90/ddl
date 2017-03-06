#Executive Summary

My first attempt at building Data Don't Lie was not a failure, but neither was it an unqualified success. In this document I will attempt to note what worked well, what didn't, and what can be improved in a rewrite.

##What Worked

The central pattern of DDL is the appender factory, which is a function with signature (data, options) => (dataPoint, idx) => SVG element. A wrapper class around our SVG canvas tracks one (or several!) of these factories; when we want to chart some data, we invoke the appender factory method with the data (and options derived from the canvas element, such as its width and height), and pass the returned function to D3's `append` method.

There are a number of advantages to this pattern. It is very flexible, allowing for a great deal of code reuse to create the main plot, axes, tooltips, etc. It also saves computation time as we can compute scales, etc. when the factory is initially invoked with the data.

##What Didn't

DDL was built without any particular data flow architecture in mind, which wound up being kind of a disaster. First, because of data flow problems, we had to modify our appender factory pattern from the beautifully functional (data, options) => (dataPoint, idx) => SVG element to (data, options) => { object one of whose properties is a function (dataPoint, idx) => SVG element }. It also made it much more difficult to implement desired features such as boundary pinning or even axes.

In addition, the lack of an explicit feature list or timeline forced me to use what should have been development time planning out, in a haphazard way, what would be the next feature to build. A lack of planning at the start of the project cost me a great amount of time during development.

##Plans for v2.0

DDL v2.0 will include a well-designed data flow structure, a stricter adherence to useful creational patterns, and will be developed with an explicit feature list in mind.
