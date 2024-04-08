import {PluginParams} from '../types/interface';

const keyUnits = {
  'cpu/utilization': '%',
  'cpu/thermal-design-power': 'W',
  'cpu/energy': 'J',
  'cpu/number-cores': 'cores',
  'carbon-embodied': 'kgCO2e',
  'energy': 'J',
  'vcpus-allocated': 'cores',
  'vcpus-total': 'cores',
  'memory-available': 'GB',
  'network/data/bytes': 'bytes',
  'carbon-operational': 'kgCO2e',
  'carbon': 'kgCO2e',
  'carbon-product': 'kgCO2e',
  'memory/utilization': '%',
  'memory/capacity': 'GB',
  'memory/energy': 'J',
  'network/data-in': 'bytes',
  'network/data-out': 'bytes',
  'network/energy': 'J',
  'energy-sum': 'J',
  'energy-doubled': 'J',
  'cpu-times-duration': 's',
  'energy-product': 'J',
  'requests': 'count',
  'grid/carbon-intensity': 'gCO2/kWh',
  'device/emissions-embodied': 'kgCO2e',
  'time-reserved': 's',
  'device/expected-lifespan': 's',
};
const timeFormat = (isoDateTime: string) => {
  const dateObject = new Date(isoDateTime);
  const localDateTimeString = dateObject.toLocaleString();
  return localDateTimeString;
};

const valuseObject = (data: PluginParams[], excludedKeys: string[]) => {
  return data.reduce((result: PluginParams, obj: PluginParams) => {
    Object.entries(obj).forEach(([key, value]) => {
      if (excludedKeys.includes(key)) {
        return;
      }
      if (!result[key]) {
        result[key] = [];
      }
      result[key].push(value);
    });
    return result;
  }, {});
};

const keyArrays = (data: PluginParams, excludedKeys: string[]) => {
  const groupedKeys = [];
  const separateKeys = Object.keys(data[0]).filter(
    key => !excludedKeys.includes(key)
  );
  for (let i = 0; i < separateKeys.length; i += 3) {
    groupedKeys.push(separateKeys.slice(i, i + 3));
  }
  return groupedKeys;
};

const colors = ['#5470C6', '#91CC75', '#EE6666'];

const getOption = ({
  timestampData,
  legendData,
  valuesData,
}: {
  timestampData: string[];
  legendData: string[];
  valuesData: PluginParams;
}) => {
  return {
    color: colors,
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
      },
    },
    grid: {
      right: '20%',
    },
    toolbox: {
      feature: {
        dataView: {show: true, readOnly: false},
        restore: {show: true},
        saveAsImage: {show: true},
      },
    },
    legend: {
      data: legendData,
    },
    xAxis: [
      {
        type: 'category',
        axisTick: {
          alignWithLabel: true,
        },
        // prettier-ignore
        data: timestampData,
      },
    ],
    yAxis: [
      {
        type: 'value',
        name: legendData[0],
        position: 'right',
        alignTicks: true,
        axisLine: {
          show: true,
          lineStyle: {
            color: colors[0],
          },
        },
        axisLabel: {
          formatter: '{value} ml',
        },
      },
      {
        type: 'value',
        name: legendData[1],
        position: 'right',
        alignTicks: true,
        offset: 80,
        axisLine: {
          show: true,
          lineStyle: {
            color: colors[1],
          },
        },
        axisLabel: {
          formatter: '{value} ml',
        },
      },
      {
        type: 'value',
        name: legendData[2],
        position: 'left',
        alignTicks: true,
        axisLine: {
          show: true,
          lineStyle: {
            color: colors[2],
          },
        },
        axisLabel: {
          formatter: '{value} °C',
        },
      },
    ],
    series: [
      {
        name: legendData[0],
        type: 'bar',
        data: valuesData[legendData[0]],
      },
      {
        name: legendData[1],
        type: 'bar',
        yAxisIndex: 1,
        data: valuesData[legendData[1]],
      },
      {
        name: legendData[2],
        type: 'line',
        yAxisIndex: 2,
        data: valuesData[legendData[2]],
      },
    ],
  };
};

export const generateChartOptions = (option: PluginParams[]) => {
  const timestampData = option.map(obj => timeFormat(obj.timestamp));
  const excludedKeys = ['timestamp', 'region', 'duration'];
  const showKey = keyArrays(option, excludedKeys);
  const showTargets = valuseObject(option, excludedKeys);
  const options: PluginParams[] = [];
  showKey.forEach(keys => {
    const newOption = getOption({
      timestampData,
      legendData: keys,
      valuesData: showTargets,
    });
    options.push(newOption);
  });

  return options;
};

export const htmlFile = (options: PluginParams[]) => {
  return `<!doctype html>
 <html>
   <head>
     <meta charset="utf-8" />
     <title>ECharts</title>
     <div id="visualizationCharts" style="display:flex;flex-flow: column;align-items: center; padding:10px 0">
          <h2> Visualization Charts </h2>
     </div>
     <script src="https://cdn.jsdelivr.net/npm/echarts@5.5.0/dist/echarts.min.js"></script>
   </head>
   <body>
     <script type="text/javascript">
      const currentOptions = ${JSON.stringify(options)};
       for (let i = 0; i < currentOptions.length; i++) {
        const chartContainer = document.createElement('div');
        chartContainer.id = 'chart-main' + i;
        chartContainer.style.width = '1000px';
        chartContainer.style.height = '600px';
        chartContainer.style.padding = '10px 0';
        document.getElementById('visualizationCharts').appendChild(chartContainer);
      
        const chart = echarts.init(chartContainer);
        chart.setOption(currentOptions[i]);
      }
     </script>
   </body>
 </html>`;
};
