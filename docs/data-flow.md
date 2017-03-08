# Data flow in DDL

1. The user changes a user input.
1. The Gatherer's event listener detects the change.
  1. The Gatherer collects all relevant filter and attribute information from the DOM.
  1. The Gatherer constructs new appender factories for the DDLCanvas and sets them as necessary.
  1. The Gatherer filters the data and constructs scales as necessary, then passes them to the DDLCanvas.
1. The Gatherer calls renderData() on its DDLCanvas.
  1. The DDLCanvas passes the data and its options (including the scales?) to its appender factories, generating appenders.
  1. The DDLCanvas renders axes, if any.
  1. The DDLCanvas renders a tooltip, if any.
  1. The DDLCanvas renders a plot.
  1. The DDLCanvas renders a legend??
