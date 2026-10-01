const { getSalesMetrics } = require('./salesAnalyticsService');

const detectSalesAnomalies = async () => {
  // We compare the last 7 days against the previous 7 days
  const today = new Date();
  
  const endRecent = new Date(today);
  const startRecent = new Date(today);
  startRecent.setDate(startRecent.getDate() - 7);
  
  const endBaseline = new Date(startRecent);
  const startBaseline = new Date(startRecent);
  startBaseline.setDate(startBaseline.getDate() - 7);

  const recentSales = await getSalesMetrics(startRecent, endRecent);
  const baselineSales = await getSalesMetrics(startBaseline, endBaseline);

  const anomalies = [];

  // Safe division check
  if (baselineSales.revenue > 0) {
    const deviation = ((recentSales.revenue - baselineSales.revenue) / baselineSales.revenue) * 100;
    
    // Configurable thresholds, e.g., > 30% increase or > 30% decrease
    if (deviation > 30) {
      anomalies.push({
        metric: 'Revenue',
        type: 'spike',
        observed: recentSales.revenue,
        expected: baselineSales.revenue,
        deviation: parseFloat(deviation.toFixed(2)),
        message: `Revenue is ${parseFloat(deviation.toFixed(2))}% above the previous 7-day baseline.`
      });
    } else if (deviation < -30) {
      anomalies.push({
        metric: 'Revenue',
        type: 'drop',
        observed: recentSales.revenue,
        expected: baselineSales.revenue,
        deviation: parseFloat(deviation.toFixed(2)),
        message: `Revenue is ${Math.abs(parseFloat(deviation.toFixed(2)))}% below the previous 7-day baseline.`
      });
    }
  }

  // Same for orders
  if (baselineSales.orders > 0) {
    const orderDeviation = ((recentSales.orders - baselineSales.orders) / baselineSales.orders) * 100;
    
    if (orderDeviation > 30) {
      anomalies.push({
        metric: 'Orders',
        type: 'spike',
        observed: recentSales.orders,
        expected: baselineSales.orders,
        deviation: parseFloat(orderDeviation.toFixed(2)),
        message: `Order volume is ${parseFloat(orderDeviation.toFixed(2))}% above the previous 7-day baseline.`
      });
    } else if (orderDeviation < -30) {
      anomalies.push({
        metric: 'Orders',
        type: 'drop',
        observed: recentSales.orders,
        expected: baselineSales.orders,
        deviation: parseFloat(orderDeviation.toFixed(2)),
        message: `Order volume is ${Math.abs(parseFloat(orderDeviation.toFixed(2)))}% below the previous 7-day baseline.`
      });
    }
  }

  return anomalies;
};

module.exports = {
  detectSalesAnomalies
};
