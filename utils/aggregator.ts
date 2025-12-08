import { ProcessedRow, ChartConfig, AggregationType } from '../types';

export const aggregateData = (data: ProcessedRow[], config: ChartConfig): any[] => {
  if (config.type === 'KPI') {
    // For KPI, we just return a single value
    if (config.aggregation === AggregationType.COUNT) {
       return [{ value: data.length, label: config.title }];
    }
    
    const total = data.reduce((acc, row) => {
      const val = Number(row[config.dataKey]) || 0;
      return acc + val;
    }, 0);

    const value = config.aggregation === AggregationType.AVERAGE ? total / data.length : total;
    return [{ value: parseFloat(value.toFixed(2)), label: config.title }];
  }

  if (config.aggregation === AggregationType.NONE) {
    // For Trend charts (Line/Area), we want more data points to show the full story.
    // We rely on the UI (Brush/Zoom) to handle density.
    if (config.type === 'LINE' || config.type === 'AREA') {
        // Limit to 2000 to prevent browser crash on massive files, 
        // but enough for detailed daily trends over years.
        return data.slice(0, 2000); 
    }
    // For Bar/Pie, too many slices look bad, so we keep a tighter limit
    return data.slice(0, 50); 
  }

  // Group By logic
  const groups: { [key: string]: { count: number; sum: number } } = {};

  data.forEach(row => {
    const valRaw = row[config.xAxisKey];
    const key = (valRaw !== undefined && valRaw !== null) ? String(valRaw) : 'Unknown';
    const val = Number(row[config.dataKey]) || 0;

    if (!groups[key]) {
      groups[key] = { count: 0, sum: 0 };
    }
    groups[key].count += 1;
    groups[key].sum += val;
  });

  return Object.keys(groups).map(key => {
    let value = 0;
    if (config.aggregation === AggregationType.COUNT) {
      value = groups[key].count;
    } else if (config.aggregation === AggregationType.SUM) {
      value = groups[key].sum;
    } else if (config.aggregation === AggregationType.AVERAGE) {
      value = groups[key].sum / groups[key].count;
    }

    return {
      [config.xAxisKey]: key,
      [config.dataKey]: parseFloat(value.toFixed(2))
    };
  });
};