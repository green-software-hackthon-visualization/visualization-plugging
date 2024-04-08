# Visualization plugin

## Overview
The Visualization plugin is designed to enhance the user experience by providing a graphical representation of carbon emissions data or all-arounds output data generated from your manifests file. By incorporating this plugin into the manifests file, you can transform the raw output data into an intuitive HTML file with visualizations, enabling better understanding and analysis of the outputs (e.g. carbon emissions associated with cpu/utilization).
## Key Features
Converts impact frame output into HTML files with interactive visualizations.
Provides insights among different types of “outputs” through charts and graphs.
Enhances readability and comprehension of carbon footprint information.
# Parameters

## Plugin config

Required fields:

- `output-path`: The full file path to write the exported html file.


## Inputs

The inputs should be in the standard format provided by the IF project.

## Outputs

This plugin will write externally to disk as html file and pass the inputs directly as output.

## Implementation

To run the plugin, you must first create an instance of `VisualizationPlugin` and call its `execute()` function with the desired inputs

```typescript
import {VisualizationPlugin} from 'lib';
const output = VisualizationPlugin();
const result = await output.execute([
  {
    timestamp: '2023-07-06T00:00',
    duration: 1,
    'operational-carbon': 0.02,
    'carbon-embodied': 5,
    energy: 3.5,
    carbon: 5.02,
  },
]);
```

## Example manifest

IF users will typically call the plugin as part of a pipeline defined in a `manifest`
file. In this case, instantiating the plugin is handled by
`ie` and does not have to be done explicitly by the user.
The following is an example `manifest` that calls `<your manifeast file name>.yml`:

```yaml
name: visualization-plugin-demo
description:
tags:
aggregation:
  metrics:
    - "carbon"
  type: "both"
initialize:
  plugins:
    "teads-curve":
      path: "@grnsft/if-unofficial-plugins"
      method: TeadsCurve
      global-config:
        interpolation: spline
    "sci-e":
      path: "@grnsft/if-plugins"
      method: SciE
    "sci-m":
      path: "@grnsft/if-plugins"
      method: SciM
    "sci-o":
      path: "@grnsft/if-plugins"
      method: SciO
    "sci":
      path: "@grnsft/if-plugins"
      method: Sci
      global-config:
        functional-unit: "requests"
        functional-unit-time: "1 minute"
    "time-sync":
      method: TimeSync
      path: "builtin"
      global-config:
        start-time: "2023-12-12T00:00:00.000Z"
        end-time: "2023-12-12T00:01:00.000Z"
        interval: 5
        allow-padding: true
    "group-by":
      path: builtin
      method: GroupBy
    "visualization-plugin":
      verbose: false
      method: VisualizationPlugin
      path: "visualization-plugin"
tree:
  children:
    child-1:
      pipeline:
        - teads-curve
        - sci-e
        - sci-m
        - sci-o
        - time-sync
        - sci
      config:
        group-by:
          group:
            - region
            - cloud/instance-type
      defaults:
        cpu/thermal-design-power: 100
        grid/carbon-intensity: 800
        device/emissions-embodied: 1533.120 # gCO2eq
        time-reserved: 3600 # 1hr in seconds
        device/expected-lifespan: 94608000 # 3 years in seconds
        resources-reserved: 1
        resources-total: 8
        functional-unit-time: "1 min"
      inputs:
        - timestamp: "2023-12-12T00:00:00.000Z"
          cloud/instance-type: A1
          region: uk-west
          duration: 1
          cpu/utilization: 10
        - timestamp: "2023-12-12T00:00:01.000Z"
          duration: 5
          cpu/utilization: 20
          cloud/instance-type: A1
          region: uk-west
        - timestamp: "2023-12-12T00:00:06.000Z"
          duration: 7
          cpu/utilization: 15
          cloud/instance-type: A1
          region: uk-west
        - timestamp: "2023-12-12T00:00:13.000Z"
          duration: 30
          cloud/instance-type: A1
          region: uk-west
          cpu/utilization: 15
    child-2:
      pipeline:
        - teads-curve
        - sci-e
        - sci-m
        - sci-o
        - time-sync
        - sci
        - visualization-plugin
      config:
        group-by:
          group:
            - region
            - cloud/instance-type
        visualization-plugin:
          output-path: visualization/outputs-child2.html # define what you want output html path
      defaults:
        cpu/thermal-design-power: 100
        grid/carbon-intensity: 800
        device/emissions-embodied: 1533.120 # gCO2eq
        time-reserved: 3600 # 1hr in seconds
        device/expected-lifespan: 94608000 # 3 years in seconds
        resources-reserved: 1
        resources-total: 8
        functional-unit-time: "1 min"
      inputs:
        - timestamp: "2023-12-12T00:00:00.000Z"
          duration: 1
          cpu/utilization: 30
          cloud/instance-type: A1
          region: uk-west
        - timestamp: "2023-12-12T00:00:01.000Z"
          duration: 5
          cpu/utilization: 28
          cloud/instance-type: A1
          region: uk-west
        - timestamp: "2023-12-12T00:00:06.000Z"
          duration: 7
          cpu/utilization: 40
          cloud/instance-type: A1
          region: uk-west
        - timestamp: "2023-12-12T00:00:13.000Z"
          duration: 30
          cpu/utilization: 33
          cloud/instance-type: A1
          region: uk-west
```

You can run this example `manifest` by saving it as `<your manifest file name>.yml` and executing the following command from the project root:

```sh
npm i -g @grnsft/if
npm i -g @grnsft/if-plugins
ie --manifest <your manifest file name>.yml
```

The html will be created at the `output-path`.

## Interpretation
Open the generated HTML file in a web browser to view the visualizations and you can download it saved as image or export data view.
Explore different charts and graphs to gain insights into carbon emissions metrics.
Use the visualizations to understand the environmental impact of cloud services and identify optimization opportunities.
