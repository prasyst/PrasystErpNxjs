// components/UniversalDataAnalyzer.jsx
'use client';
import React, { useState, useEffect, useCallback } from 'react';
import * as XLSX from 'xlsx';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, ScatterChart, Scatter, ComposedChart
} from 'recharts';
import {
  MdClose, MdDownload, MdInsights, MdTrendingUp,
  MdWarning, MdShowChart, MdPieChart, MdBarChart, 
  MdTableChart, MdAnalytics, MdUpload, MdFileUpload,
  MdRefresh, MdSave, MdShare, MdDescription, MdGridView,
  MdSummarize, MdAutoGraph, MdTimeline, MdCalendarToday,
  MdAssessment, MdLightbulb, MdPriorityHigh
} from 'react-icons/md';
import { FaRobot, FaBrain, FaChartLine, FaChartPie, FaChartBar } from 'react-icons/fa';

const COLORS = ['#635bff', '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', 
                '#ffeaa5', '#ff9f43', '#6c5ce7', '#00b894', '#e84342'];

const UniversalDataAnalyzer = ({ onClose }) => {
  const [rawData, setRawData] = useState('');
  const [parsedData, setParsedData] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [activeTab, setActiveTab] = useState('input');
  const [chartType, setChartType] = useState('auto');
  const [error, setError] = useState('');
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [timeframeAnalysis, setTimeframeAnalysis] = useState(null);
  const [detailedNarrative, setDetailedNarrative] = useState('');

  // File Upload Handler
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setFileName(file.name);
    setLoading(true);
    setError('');

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
        
        const textData = jsonData.map(row => row.join('\t')).join('\n');
        setRawData(textData);
        analyzeData(textData);
      } catch (err) {
        setError('Error reading file: ' + err.message);
        setLoading(false);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  // Universal Parser
  const parseData = (inputText) => {
    const lines = inputText.trim().split('\n').filter(l => l.trim());
    if (lines.length === 0) return null;

    let delimiter = '\t';
    const firstLine = lines[0];
    const delimiters = ['\t', ',', '|', ';', ':'];
    for (const d of delimiters) {
      if (firstLine.includes(d)) {
        delimiter = d;
        break;
      }
    }

    const headers = lines[0].split(delimiter).map(h => h.trim());
    
    const rows = [];
    for (let i = 1; i < lines.length; i++) {
      const cells = lines[i].split(delimiter).map(c => c.trim());
      if (cells.length === headers.length) {
        const row = {};
        headers.forEach((header, idx) => {
          let value = cells[idx];
          const numValue = parseFloat(value.replace(/[₹$€£,%]/g, ''));
          row[header] = isNaN(numValue) ? value : numValue;
        });
        rows.push(row);
      }
    }

    return { headers, rows };
  };

  // Enhanced Time-based Analysis
  const performTimeAnalysis = (rows, columns) => {
    const timeAnalysis = {
      monthly: {},
      quarterly: {},
      yearly: {},
      trends: {},
      comparisons: {},
      growthRates: {},
      seasonal: {}
    };

    // Find date/month column
    const dateColumn = Object.keys(columns).find(col => 
      col.toLowerCase().includes('month') || 
      col.toLowerCase().includes('date') ||
      col.toLowerCase().includes('year')
    );

    if (!dateColumn) return null;

    // Find numeric columns for analysis
    const numericColumns = Object.values(columns)
      .filter(c => c.type === 'numeric')
      .map(c => c.name);

    // Group by month/period
    rows.forEach(row => {
      const period = row[dateColumn];
      if (!period) return;

      numericColumns.forEach(col => {
        if (!timeAnalysis.monthly[period]) {
          timeAnalysis.monthly[period] = {};
        }
        if (!timeAnalysis.monthly[period][col]) {
          timeAnalysis.monthly[period][col] = 0;
        }
        timeAnalysis.monthly[period][col] += (row[col] || 0);
      });
    });

    // Calculate growth rates
    const periods = Object.keys(timeAnalysis.monthly).sort();
    numericColumns.forEach(col => {
      timeAnalysis.growthRates[col] = [];
      for (let i = 1; i < periods.length; i++) {
        const current = timeAnalysis.monthly[periods[i]]?.[col] || 0;
        const previous = timeAnalysis.monthly[periods[i-1]]?.[col] || 0;
        if (previous > 0) {
          const growth = ((current - previous) / previous * 100).toFixed(1);
          timeAnalysis.growthRates[col].push({
            period: periods[i],
            growth: parseFloat(growth),
            value: current
          });
        }
      }
    });

    // Identify best and worst periods
    numericColumns.forEach(col => {
      const values = periods.map(p => ({
        period: p,
        value: timeAnalysis.monthly[p]?.[col] || 0
      })).filter(v => v.value > 0);

      if (values.length > 0) {
        const best = values.reduce((max, v) => v.value > max.value ? v : max);
        const worst = values.reduce((min, v) => v.value < min.value ? v : min);
        timeAnalysis.comparisons[col] = { best, worst };
      }
    });

    return timeAnalysis;
  };

  // Generate Detailed Narrative
  const generateDetailedNarrative = (analysis, timeAnalysis) => {
    const { columns, insights } = analysis;
    let narrative = '';

    // Find key columns
    const revenueCol = Object.values(columns).find(c => 
      c.name.toLowerCase().includes('revenue') || c.name.toLowerCase().includes('sales'));
    const profitCol = Object.values(columns).find(c => 
      c.name.toLowerCase().includes('profit'));
    const qtyCol = Object.values(columns).find(c => 
      c.name.toLowerCase().includes('qty') || c.name.toLowerCase().includes('quantity') || 
      c.name.toLowerCase().includes('production'));

    // Overall Performance Summary
    narrative += `📊 **Overall Performance Summary**\n\n`;
    narrative += `Based on the analysis of ${analysis.totalRows} records across ${analysis.totalColumns} columns, `;
    
    if (revenueCol) {
      narrative += `the total revenue generated is ${formatCurrency(revenueCol.sum)} `;
      if (profitCol) {
        const margin = (profitCol.sum / revenueCol.sum * 100).toFixed(1);
        narrative += `with a profit of ${formatCurrency(profitCol.sum)} (${margin}% margin). `;
      }
    }
    
    if (qtyCol) {
      narrative += `Total production/quantity stands at ${formatNumber(qtyCol.sum)} units. `;
    }
    narrative += `\n\n`;

    // Monthly/Periodic Analysis
    if (timeAnalysis) {
      narrative += `📅 **Period-wise Performance Analysis**\n\n`;
      
      const periods = Object.keys(timeAnalysis.monthly).sort();
      if (periods.length > 0) {
        narrative += `Data spans across ${periods.length} periods: ${periods.join(', ')}.\n\n`;

        // Growth trends
        Object.entries(timeAnalysis.growthRates).forEach(([metric, growthData]) => {
          if (growthData.length > 0) {
            const avgGrowth = (growthData.reduce((sum, g) => sum + g.growth, 0) / growthData.length).toFixed(1);
            const trend = avgGrowth > 0 ? 'positive' : 'negative';
            const trendColor = avgGrowth > 0 ? '🟢' : '🔴';
            
            narrative += `${trendColor} **${metric} Growth Trend**: `;
            narrative += `Average growth rate of ${avgGrowth}% (${trend} trend). `;
            
            // Highlight significant changes
            const significantChanges = growthData.filter(g => Math.abs(g.growth) > 20);
            if (significantChanges.length > 0) {
              narrative += `Significant changes observed in: `;
              significantChanges.forEach(g => {
                narrative += `${g.period} (${g.growth > 0 ? '+' : ''}${g.growth}%), `;
              });
            }
            narrative += `\n\n`;
          }
        });

        // Best and worst performers
        narrative += `🏆 **Top & Bottom Performers**\n\n`;
        Object.entries(timeAnalysis.comparisons).forEach(([metric, { best, worst }]) => {
          narrative += `For **${metric}**:\n`;
          narrative += `  • Best period: ${best.period} with ${formatMetric(best.value, metric)}\n`;
          narrative += `  • Worst period: ${worst.period} with ${formatMetric(worst.value, metric)}\n`;
          
          const variance = ((best.value - worst.value) / worst.value * 100).toFixed(1);
          narrative += `  • Variance: ${variance}% between best and worst periods\n\n`;
        });
      }
    }

    // Profitability Analysis
    if (profitCol && revenueCol) {
      narrative += `💰 **Profitability Deep Dive**\n\n`;
      
      // Calculate profit trends
      const profitMargin = (profitCol.sum / revenueCol.sum * 100).toFixed(1);
      narrative += `Overall profit margin stands at **${profitMargin}%**. `;

      // Identify concerning trends
      if (profitMargin < 15) {
        narrative += `⚠️ **CONCERN**: Profit margin is below 15%, which may indicate pricing issues or high costs. `;
        narrative += `Consider reviewing cost structure and pricing strategy.\n\n`;
      } else if (profitMargin > 30) {
        narrative += `✅ **EXCELLENT**: Profit margin above 30% indicates strong profitability. `;
        narrative += `Look for opportunities to reinvest in growth.\n\n`;
      }

      // Monthly profit analysis if time data exists
      if (timeAnalysis) {
        const profitGrowth = timeAnalysis.growthRates[profitCol.name];
        if (profitGrowth && profitGrowth.length > 0) {
          const recentGrowth = profitGrowth[profitGrowth.length - 1]?.growth || 0;
          if (recentGrowth < -10) {
            narrative += `🔴 **ALERT**: Recent profit declined by ${Math.abs(recentGrowth)}%. `;
            narrative += `Immediate attention needed to identify and address causes.\n\n`;
          } else if (recentGrowth > 15) {
            narrative += `🟢 **POSITIVE**: Strong profit growth of ${recentGrowth}% in recent period. `;
            narrative += `Analyze and replicate successful factors.\n\n`;
          }
        }
      }
    }

    // Production/Quantity Analysis
    if (qtyCol) {
      narrative += `📦 **Production/Quantity Analysis**\n\n`;
      
      const avgQty = qtyCol.avg;
      narrative += `Average ${qtyCol.name}: ${formatNumber(avgQty)} per period. `;

      if (timeAnalysis) {
        const qtyGrowth = timeAnalysis.growthRates[qtyCol.name];
        if (qtyGrowth && qtyGrowth.length > 0) {
          const totalGrowth = ((qtyCol.max - qtyCol.min) / qtyCol.min * 100).toFixed(1);
          narrative += `Overall production volume changed by ${totalGrowth}% across the period. `;

          // Check for capacity issues
          if (qtyCol.max > qtyCol.avg * 1.3) {
            narrative += `⚠️ Peak production (${formatNumber(qtyCol.max)}) is 30% above average. `;
            narrative += `Ensure capacity planning accounts for peak periods.\n\n`;
          }
        }
      }
    }

    // Key Recommendations
    narrative += `🎯 **Strategic Recommendations**\n\n`;
    
    // Generate recommendations based on findings
    if (profitCol && revenueCol) {
      const margin = (profitCol.sum / revenueCol.sum * 100);
      if (margin < 15) {
        narrative += `1. **Cost Optimization**: Review cost structure to improve margins\n`;
        narrative += `2. **Pricing Strategy**: Consider price adjustments for better profitability\n`;
      } else if (margin > 25) {
        narrative += `1. **Growth Investment**: Reinvest profits into marketing and expansion\n`;
        narrative += `2. **Market Share**: Use strong margins to capture market share\n`;
      }
    }

    if (timeAnalysis) {
      const volatileMetrics = Object.entries(timeAnalysis.growthRates)
        .filter(([_, data]) => {
          const growths = data.map(d => Math.abs(d.growth));
          const avgVolatility = growths.reduce((a, b) => a + b, 0) / growths.length;
          return avgVolatility > 25;
        })
        .map(([metric]) => metric);

      if (volatileMetrics.length > 0) {
        narrative += `3. **Stability Focus**: Address volatility in ${volatileMetrics.join(', ')}\n`;
      }
    }

    narrative += `4. **Regular Monitoring**: Track KPIs monthly to identify trends early\n`;

    return narrative;
  };

  // Analyze Data Structure
  const analyzeDataStructure = (data) => {
    const { headers, rows } = data;
    const analysis = {
      totalRows: rows.length,
      totalColumns: headers.length,
      columns: {},
      summary: {},
      insights: [],
      recommendations: []
    };

    headers.forEach(header => {
      const values = rows.map(r => r[header]).filter(v => v !== undefined);
      const isNumeric = values.every(v => typeof v === 'number');
      const uniqueValues = [...new Set(values)];
      
      const colInfo = {
        name: header,
        type: isNumeric ? 'numeric' : 'text',
        count: values.length,
        uniqueCount: uniqueValues.length,
        sample: values.slice(0, 3)
      };

      if (isNumeric) {
        const numericValues = values;
        colInfo.min = Math.min(...numericValues);
        colInfo.max = Math.max(...numericValues);
        colInfo.sum = numericValues.reduce((a, b) => a + b, 0);
        colInfo.avg = colInfo.sum / numericValues.length;
        colInfo.median = numericValues.sort((a,b) => a-b)[Math.floor(numericValues.length/2)];
        
        const headerLower = header.toLowerCase();
        if (headerLower.includes('revenue') || headerLower.includes('sales') || 
            headerLower.includes('income') || headerLower.includes('price')) {
          colInfo.category = 'financial';
          colInfo.format = 'currency';
          colInfo.subcategory = 'revenue';
        } else if (headerLower.includes('profit')) {
          colInfo.category = 'financial';
          colInfo.format = 'currency';
          colInfo.isProfit = true;
          colInfo.subcategory = 'profit';
        } else if (headerLower.includes('qty') || headerLower.includes('quantity') || 
                  headerLower.includes('stock') || headerLower.includes('production')) {
          colInfo.category = 'quantity';
          colInfo.format = 'number';
        } else if (headerLower.includes('cost')) {
          colInfo.category = 'financial';
          colInfo.format = 'currency';
          colInfo.isCost = true;
          colInfo.subcategory = 'cost';
        }
      } else {
        colInfo.topValues = uniqueValues.slice(0, 5).map(val => ({
          value: val,
          count: values.filter(v => v === val).length
        }));
      }

      analysis.columns[header] = colInfo;
    });

    // Perform time analysis
    const timeAnalysis = performTimeAnalysis(rows, analysis.columns);
    setTimeframeAnalysis(timeAnalysis);

    analysis.insights = generateInsights(analysis, rows);
    analysis.recommendations = generateRecommendations(analysis, rows);

    // Generate detailed narrative
    const narrative = generateDetailedNarrative(analysis, timeAnalysis);
    setDetailedNarrative(narrative);

    return analysis;
  };

  // Generate Insights
  const generateInsights = (analysis, rows) => {
    const insights = [];
    const { columns } = analysis;

    const revenueCol = Object.values(columns).find(c => 
      c.subcategory === 'revenue' || c.name.toLowerCase().includes('revenue'));
    const profitCol = Object.values(columns).find(c => 
      c.isProfit || c.name.toLowerCase().includes('profit'));
    const costCol = Object.values(columns).find(c => 
      c.isCost || c.name.toLowerCase().includes('cost'));
    const qtyCol = Object.values(columns).find(c => 
      c.category === 'quantity');

    // Revenue Insight with color coding
    if (revenueCol) {
      const revenueGrowth = timeframeAnalysis?.growthRates[revenueCol.name];
      const recentGrowth = revenueGrowth?.length > 0 ? revenueGrowth[revenueGrowth.length - 1].growth : 0;
      
      insights.push({
        type: 'revenue',
        title: 'Revenue Analysis',
        value: formatCurrency(revenueCol.sum),
        details: {
          'Average': formatCurrency(revenueCol.avg),
          'Peak': formatCurrency(revenueCol.max),
          'Recent Trend': `${recentGrowth > 0 ? '+' : ''}${recentGrowth}%`
        },
        description: `Total revenue across all periods`,
        interpretation: recentGrowth > 10 ? 'Strong growth momentum' : 
                       recentGrowth > 0 ? 'Moderate growth' : 
                       recentGrowth < -10 ? 'Significant decline - needs attention' : 'Stable performance',
        color: recentGrowth > 10 ? '#27ae60' : recentGrowth > 0 ? '#f39c12' : '#e74c3c',
        icon: '💰',
        priority: recentGrowth < -10 ? 'high' : 'medium'
      });
    }

    // Profit Insight
    if (profitCol) {
      const profitGrowth = timeframeAnalysis?.growthRates[profitCol.name];
      const recentProfitGrowth = profitGrowth?.length > 0 ? profitGrowth[profitGrowth.length - 1].growth : 0;
      const margin = revenueCol ? (profitCol.sum / revenueCol.sum * 100).toFixed(1) : null;

      insights.push({
        type: 'profit',
        title: 'Profit Analysis',
        value: formatCurrency(profitCol.sum),
        details: {
          'Average': formatCurrency(profitCol.avg),
          'Margin': margin ? `${margin}%` : 'N/A',
          'Growth': `${recentProfitGrowth > 0 ? '+' : ''}${recentProfitGrowth}%`
        },
        description: `Total profit generated`,
        interpretation: margin > 25 ? 'Excellent profitability' :
                       margin > 15 ? 'Healthy margins' :
                       margin > 5 ? 'Thin margins - monitor closely' : 'Critical - margins too low',
        color: margin > 25 ? '#27ae60' : margin > 15 ? '#f39c12' : '#e74c3c',
        icon: '📈',
        priority: margin < 5 ? 'critical' : margin < 15 ? 'high' : 'medium'
      });
    }

    // Quantity/Production Insight
    if (qtyCol) {
      const qtyGrowth = timeframeAnalysis?.growthRates[qtyCol.name];
      const recentQtyGrowth = qtyGrowth?.length > 0 ? qtyGrowth[qtyGrowth.length - 1].growth : 0;

      insights.push({
        type: 'quantity',
        title: `${qtyCol.name} Analysis`,
        value: formatNumber(qtyCol.sum),
        details: {
          'Average': formatNumber(qtyCol.avg),
          'Peak': formatNumber(qtyCol.max),
          'Lowest': formatNumber(qtyCol.min),
          'Trend': `${recentQtyGrowth > 0 ? '+' : ''}${recentQtyGrowth}%`
        },
        description: `Total ${qtyCol.name.toLowerCase()}`,
        interpretation: recentQtyGrowth > 15 ? 'Strong production growth' :
                       recentQtyGrowth > 5 ? 'Steady increase' :
                       recentQtyGrowth > -5 ? 'Stable production' : 'Production decline - investigate',
        color: recentQtyGrowth > 10 ? '#27ae60' : recentQtyGrowth > 0 ? '#f39c12' : '#e74c3c',
        icon: '📦',
        priority: recentQtyGrowth < -10 ? 'high' : 'medium'
      });
    }

    // Cost Analysis
    if (costCol) {
      const costPercentage = revenueCol ? (costCol.sum / revenueCol.sum * 100).toFixed(1) : null;
      
      insights.push({
        type: 'cost',
        title: 'Cost Analysis',
        value: formatCurrency(costCol.sum),
        details: {
          'Average': formatCurrency(costCol.avg),
          '% of Revenue': costPercentage ? `${costPercentage}%` : 'N/A',
          'Cost per Unit': qtyCol ? formatCurrency(costCol.sum / qtyCol.sum) : 'N/A'
        },
        description: `Total costs incurred`,
        interpretation: costPercentage > 80 ? 'Costs too high - urgent review needed' :
                       costPercentage > 70 ? 'Costs above target' :
                       costPercentage > 50 ? 'Acceptable cost structure' : 'Efficient cost management',
        color: costPercentage > 80 ? '#e74c3c' : costPercentage > 70 ? '#f39c12' : '#27ae60',
        icon: '💸',
        priority: costPercentage > 80 ? 'critical' : costPercentage > 70 ? 'high' : 'medium'
      });
    }

    // Monthly Performance Summary
    if (timeframeAnalysis) {
      const periods = Object.keys(timeframeAnalysis.monthly).sort();
      if (periods.length > 0) {
        const bestPeriod = Object.entries(timeframeAnalysis.comparisons)
          .map(([metric, { best }]) => best.period)
          .reduce((mostFrequent, period) => {
            const count = periods.filter(p => p === period).length;
            return count > (mostFrequent.count || 0) ? { period, count } : mostFrequent;
          }, {});

        insights.push({
          type: 'periodic',
          title: 'Periodic Performance',
          value: `${periods.length} Periods`,
          details: {
            'Best Period': bestPeriod.period || 'N/A',
            'Total Records': analysis.totalRows,
            'Data Span': `${periods[0]} to ${periods[periods.length-1]}`
          },
          description: 'Time-based performance analysis',
          interpretation: 'Monthly trends show patterns in business performance',
          color: '#635bff',
          icon: '📅',
          priority: 'medium'
        });
      }
    }

    return insights;
  };

  // Generate Recommendations
  const generateRecommendations = (analysis, rows) => {
    const recommendations = [];
    const { columns } = analysis;

    const profitCol = Object.values(columns).find(c => c.isProfit);
    const revenueCol = Object.values(columns).find(c => c.subcategory === 'revenue');
    const costCol = Object.values(columns).find(c => c.isCost);
    const qtyCol = Object.values(columns).find(c => c.category === 'quantity');

    // Profit-based recommendations
    if (profitCol && revenueCol) {
      const margin = (profitCol.sum / revenueCol.sum * 100);
      
      if (margin < 10) {
        recommendations.push({
          title: '🚨 Critical: Improve Profit Margins',
          description: `Current margin of ${margin.toFixed(1)}% is below healthy levels`,
          actions: [
            'Review and renegotiate supplier contracts',
            'Analyze pricing strategy against competitors',
            'Identify and eliminate low-margin products/services',
            'Implement cost-cutting measures across operations'
          ],
          impact: 'Potential 5-10% margin improvement',
          timeframe: 'Immediate',
          priority: 'critical',
          icon: '⚠️'
        });
      } else if (margin < 20) {
        recommendations.push({
          title: '📈 Margin Optimization Opportunity',
          description: `Current margin of ${margin.toFixed(1)}% has room for improvement`,
          actions: [
            'Optimize product mix towards higher margin items',
            'Review operational efficiency',
            'Consider value-added services for premium pricing',
            'Implement bulk purchase discounts from suppliers'
          ],
          impact: 'Aim for 25%+ margin target',
          timeframe: 'Next Quarter',
          priority: 'high',
          icon: '⚡'
        });
      }
    }

    // Growth opportunities
    if (timeframeAnalysis) {
      const growingMetrics = [];
      const decliningMetrics = [];

      Object.entries(timeframeAnalysis.growthRates).forEach(([metric, data]) => {
        const avgGrowth = data.reduce((sum, d) => sum + d.growth, 0) / data.length;
        if (avgGrowth > 10) growingMetrics.push(metric);
        if (avgGrowth < -5) decliningMetrics.push(metric);
      });

      if (growingMetrics.length > 0) {
        recommendations.push({
          title: '🚀 Capitalize on Growth Areas',
          description: `Strong growth in: ${growingMetrics.join(', ')}`,
          actions: [
            'Increase marketing investment in high-growth areas',
            'Scale successful strategies across other segments',
            'Hire additional resources to support growth',
            'Expand product lines in growing categories'
          ],
          impact: 'Accelerate growth momentum',
          timeframe: 'This Quarter',
          priority: 'high',
          icon: '📈'
        });
      }

      if (decliningMetrics.length > 0) {
        recommendations.push({
          title: '🔍 Investigate Declining Metrics',
          description: `Decline detected in: ${decliningMetrics.join(', ')}`,
          actions: [
            'Conduct root cause analysis for declines',
            'Review market conditions and competition',
            'Survey customers for feedback',
            'Implement corrective action plans'
          ],
          impact: 'Reverse negative trends',
          timeframe: 'Immediate',
          priority: 'critical',
          icon: '🔴'
        });
      }
    }

    // Cost optimization
    if (costCol && revenueCol) {
      const costRatio = (costCol.sum / revenueCol.sum * 100);
      if (costRatio > 80) {
        recommendations.push({
          title: '💰 Cost Reduction Initiative',
          description: `Costs are ${costRatio.toFixed(1)}% of revenue - above target`,
          actions: [
            'Conduct detailed cost audit',
            'Identify and eliminate wasteful spending',
            'Automate manual processes',
            'Consolidate vendors for better rates'
          ],
          impact: 'Reduce costs by 10-15%',
          timeframe: 'Next 3 Months',
          priority: 'high',
          icon: '💸'
        });
      }
    }

    // Seasonal/Periodic recommendations
    if (timeframeAnalysis) {
      const periods = Object.keys(timeframeAnalysis.monthly).sort();
      if (periods.length >= 3) {
        recommendations.push({
          title: '📊 Implement Performance Monitoring',
          description: 'Regular tracking enables proactive decision making',
          actions: [
            'Set up monthly performance reviews',
            'Create dashboards for key metrics',
            'Establish early warning indicators',
            'Track leading indicators for better forecasting'
          ],
          impact: 'Faster response to market changes',
          timeframe: 'Ongoing',
          priority: 'medium',
          icon: '📋'
        });
      }
    }

    return recommendations;
  };

  // Format helpers
  const formatCurrency = (value) => {
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)}Cr`;
    if (value >= 100000) return `₹${(value / 100000).toFixed(2)}L`;
    if (value >= 1000) return `₹${(value / 1000).toFixed(1)}K`;
    return `₹${value.toFixed(0)}`;
  };

  const formatNumber = (value) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return value.toFixed(0);
  };

  const formatMetric = (value, metricName) => {
    const metricLower = metricName.toLowerCase();
    if (metricLower.includes('revenue') || metricLower.includes('profit') || 
        metricLower.includes('cost') || metricLower.includes('sales')) {
      return formatCurrency(value);
    }
    return formatNumber(value);
  };

  const analyzeData = (textData = rawData) => {
    if (!textData.trim()) {
      setError('Please paste your data or upload a file');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const parsed = parseData(textData);
      if (!parsed || parsed.rows.length === 0) {
        throw new Error('Could not parse data');
      }

      setParsedData(parsed);
      const analysisResult = analyzeDataStructure(parsed);
      setAnalysis(analysisResult);
      setActiveTab('analysis');
      
      const numericColumns = Object.values(analysisResult.columns)
        .filter(c => c.type === 'numeric')
        .map(c => c.name);
      setSelectedColumns(numericColumns.slice(0, 3));
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Render Data Table (unchanged)
  const renderDataTable = () => {
    if (!parsedData) return null;

    return (
      <div style={{
        overflowX: 'auto',
        maxHeight: '400px',
        borderRadius: '12px',
        border: '1px solid #e0e0e0'
      }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '0.9rem'
        }}>
          <thead style={{
            position: 'sticky',
            top: 0,
            backgroundColor: '#635bff',
            color: 'white',
            zIndex: 1
          }}>
            <tr>
              {parsedData.headers.map((header, i) => (
                <th key={i} style={{
                  padding: '12px',
                  textAlign: 'left',
                  fontWeight: '500'
                }}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {parsedData.rows.map((row, rowIndex) => (
              <tr key={rowIndex} style={{
                backgroundColor: rowIndex % 2 === 0 ? '#ffffff' : '#f8f9ff',
                borderBottom: '1px solid #eee'
              }}>
                {parsedData.headers.map((header, colIndex) => {
                  const value = row[header];
                  const isNumeric = typeof value === 'number';
                  const colType = analysis?.columns[header]?.category;
                  
                  return (
                    <td key={colIndex} style={{
                      padding: '10px 12px',
                      textAlign: isNumeric ? 'right' : 'left',
                      color: isNumeric ? '#2c3e50' : '#333',
                      fontWeight: isNumeric ? '500' : 'normal'
                    }}>
                      {isNumeric ? 
                        (colType === 'financial' ? formatCurrency(value) : formatNumber(value)) 
                        : value || '-'}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // Render Chart (unchanged)
  const renderChart = () => {
    if (!parsedData || !analysis) return null;

    const numericColumns = Object.values(analysis.columns)
      .filter(c => c.type === 'numeric')
      .map(c => c.name);

    if (numericColumns.length === 0) return null;

    const chartData = parsedData.rows.map((row, index) => {
      const item = { name: `Record ${index + 1}` };
      selectedColumns.forEach(col => {
        if (row[col] !== undefined) {
          item[col] = row[col];
        }
      });
      return item;
    });

    let activeChart = chartType;
    if (activeChart === 'auto') {
      if (parsedData.headers.some(h => h.toLowerCase().includes('month') || 
          h.toLowerCase().includes('date'))) {
        activeChart = 'line';
      } else if (numericColumns.length >= 3) {
        activeChart = 'bar';
      } else {
        activeChart = 'bar';
      }
    }

    return (
      <ResponsiveContainer width="100%" height={400}>
        {activeChart === 'line' ? (
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
            <YAxis />
            <Tooltip formatter={(value) => formatCurrency(value)} />
            <Legend />
            {selectedColumns.map((col, index) => (
              <Line 
                key={col} 
                type="monotone" 
                dataKey={col} 
                stroke={COLORS[index % COLORS.length]} 
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            ))}
          </LineChart>
        ) : activeChart === 'pie' ? (
          <PieChart>
            <Pie
              data={chartData.slice(0, 8)}
              dataKey={selectedColumns[0] || 'value'}
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={150}
              label={entry => `${entry.name}: ${formatNumber(entry[selectedColumns[0]])}`}
            >
              {chartData.slice(0, 8).map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        ) : (
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
            <YAxis />
            <Tooltip formatter={(value) => formatCurrency(value)} />
            <Legend />
            {selectedColumns.map((col, index) => (
              <Bar key={col} dataKey={col} fill={COLORS[index % COLORS.length]} />
            ))}
          </BarChart>
        )}
      </ResponsiveContainer>
    );
  };

  // Render Column Descriptions (unchanged)
  const renderColumnDescriptions = () => {
    if (!analysis) return null;

    return (
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1rem'
      }}>
        {Object.values(analysis.columns).map((col, index) => (
          <div key={index} style={{
            padding: '1rem',
            backgroundColor: '#f8f9ff',
            borderRadius: '12px',
            border: '1px solid #e0e0e0'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '0.5rem'
            }}>
              <span style={{
                padding: '4px 8px',
                backgroundColor: col.type === 'numeric' ? '#e3f2fd' : '#fff3e0',
                color: col.type === 'numeric' ? '#1565c0' : '#ef6c00',
                borderRadius: '4px',
                fontSize: '0.75rem',
                fontWeight: '600'
              }}>
                {col.type === 'numeric' ? '🔢 Numeric' : '📝 Text'}
              </span>
              {col.category && (
                <span style={{
                  padding: '4px 8px',
                  backgroundColor: col.category === 'financial' ? '#e8f5e9' : '#f3e5f5',
                  color: col.category === 'financial' ? '#2e7d32' : '#7b1fa2',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  fontWeight: '600'
                }}>
                  {col.category === 'financial' ? '💰 Financial' : '📦 Quantity'}
                </span>
              )}
            </div>
            
            <h4 style={{ margin: '0 0 0.5rem', color: '#333' }}>{col.name}</h4>
            
            {col.type === 'numeric' ? (
              <div style={{ fontSize: '0.9rem' }}>
                <p><strong>Total:</strong> {col.format === 'currency' ? formatCurrency(col.sum) : formatNumber(col.sum)}</p>
                <p><strong>Average:</strong> {col.format === 'currency' ? formatCurrency(col.avg) : formatNumber(col.avg)}</p>
                <p><strong>Range:</strong> {col.format === 'currency' ? formatCurrency(col.min) : formatNumber(col.min)} - {col.format === 'currency' ? formatCurrency(col.max) : formatNumber(col.max)}</p>
                <p><strong>Records:</strong> {col.count}</p>
              </div>
            ) : (
              <div style={{ fontSize: '0.9rem' }}>
                <p><strong>Unique Values:</strong> {col.uniqueCount}</p>
                <p><strong>Top Values:</strong></p>
                <ul style={{ margin: '0.5rem 0', paddingLeft: '1.2rem' }}>
                  {col.topValues?.slice(0, 3).map((item, i) => (
                    <li key={i}>{item.value}: {item.count} times</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  // Render Enhanced Insights
  const renderEnhancedInsights = () => {
    if (!analysis) return null;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Quick Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            borderLeft: '4px solid #635bff'
          }}>
            <div style={{ fontSize: '0.9rem', color: '#666' }}>Total Records</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#635bff' }}>
              {analysis.totalRows}
            </div>
          </div>
          <div style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            borderLeft: '4px solid #4ecdc4'
          }}>
            <div style={{ fontSize: '0.9rem', color: '#666' }}>Total Columns</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#4ecdc4' }}>
              {analysis.totalColumns}
            </div>
          </div>
          <div style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            borderLeft: '4px solid #ff6b6b'
          }}>
            <div style={{ fontSize: '0.9rem', color: '#666' }}>Numeric Columns</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ff6b6b' }}>
              {Object.values(analysis.columns).filter(c => c.type === 'numeric').length}
            </div>
          </div>
        </div>

        {/* Detailed Narrative */}
        {detailedNarrative && (
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '16px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            border: '1px solid #e0e0e0'
          }}>
            <h3 style={{ 
              margin: '0 0 1.5rem', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              color: '#333',
              borderBottom: '2px solid #f0f0f0',
              paddingBottom: '0.75rem'
            }}>
              <MdDescription color="#635bff" size={24} />
              Detailed Analysis Report
            </h3>
            <div style={{
              whiteSpace: 'pre-wrap',
              lineHeight: '1.8',
              fontSize: '1rem',
              color: '#444'
            }}>
              {detailedNarrative.split('\n').map((line, index) => {
                if (line.startsWith('📊') || line.startsWith('📅') || line.startsWith('💰') || 
                    line.startsWith('📦') || line.startsWith('🎯')) {
                  return (
                    <h4 key={index} style={{ 
                      margin: '1.5rem 0 0.75rem', 
                      color: '#333',
                      fontSize: '1.1rem'
                    }}>
                      {line}
                    </h4>
                  );
                } else if (line.includes('**')) {
                  return (
                    <p key={index} style={{ 
                      margin: '0.75rem 0',
                      fontWeight: '600',
                      color: '#2c3e50'
                    }}>
                      {line.replace(/\*\*/g, '')}
                    </p>
                  );
                } else if (line.includes('•')) {
                  return (
                    <p key={index} style={{ 
                      margin: '0.5rem 0 0.5rem 1.5rem',
                      color: '#555',
                      position: 'relative'
                    }}>
                      <span style={{ 
                        position: 'absolute', 
                        left: '-1rem', 
                        color: '#635bff' 
                      }}>•</span>
                      {line.replace('•', '')}
                    </p>
                  );
                } else if (line.includes('🟢')) {
                  return (
                    <p key={index} style={{ 
                      margin: '0.5rem 0',
                      padding: '0.5rem 1rem',
                      backgroundColor: '#e8f5e9',
                      borderRadius: '8px',
                      color: '#2e7d32',
                      borderLeft: '4px solid #2e7d32'
                    }}>
                      {line}
                    </p>
                  );
                } else if (line.includes('🔴') || line.includes('⚠️')) {
                  return (
                    <p key={index} style={{ 
                      margin: '0.5rem 0',
                      padding: '0.5rem 1rem',
                      backgroundColor: '#ffebee',
                      borderRadius: '8px',
                      color: '#c62828',
                      borderLeft: '4px solid #c62828'
                    }}>
                      {line}
                    </p>
                  );
                } else if (line.includes('✅')) {
                  return (
                    <p key={index} style={{ 
                      margin: '0.5rem 0',
                      padding: '0.5rem 1rem',
                      backgroundColor: '#e3f2fd',
                      borderRadius: '8px',
                      color: '#1565c0',
                      borderLeft: '4px solid #1565c0'
                    }}>
                      {line}
                    </p>
                  );
                } else if (line.trim()) {
                  return <p key={index} style={{ margin: '0.75rem 0' }}>{line}</p>;
                }
                return <br key={index} />;
              })}
            </div>
          </div>
        )}

        {/* Key Insights Cards */}
        <div style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '16px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
        }}>
          <h3 style={{ 
            margin: '0 0 1.5rem', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            color: '#333'
          }}>
            <MdInsights color="#635bff" size={24} />
            Key Insights & Interpretation
          </h3>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '1.5rem'
          }}>
            {analysis.insights.map((insight, index) => (
              <div key={index} style={{
                padding: '1.5rem',
                backgroundColor: '#f8f9ff',
                borderRadius: '12px',
                border: `1px solid ${insight.color || '#e0e0e0'}`,
                borderTop: `4px solid ${insight.color || '#635bff'}`
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  marginBottom: '1rem'
                }}>
                  <span style={{ fontSize: '2rem' }}>{insight.icon}</span>
                  <div>
                    <div style={{ fontSize: '0.9rem', color: '#666' }}>{insight.title}</div>
                    <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: insight.color || '#333' }}>
                      {insight.value}
                    </div>
                  </div>
                  {insight.priority && (
                    <span style={{
                      marginLeft: 'auto',
                      padding: '4px 12px',
                      backgroundColor: insight.priority === 'critical' ? '#ffebee' :
                                     insight.priority === 'high' ? '#fff3e0' : '#e8f5e9',
                      color: insight.priority === 'critical' ? '#c62828' :
                             insight.priority === 'high' ? '#ef6c00' : '#2e7d32',
                      borderRadius: '20px',
                      fontSize: '0.75rem',
                      fontWeight: '600'
                    }}>
                      {insight.priority.toUpperCase()}
                    </span>
                  )}
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <p style={{ margin: '0 0 0.5rem', color: '#555', fontSize: '0.95rem' }}>
                    {insight.description}
                  </p>
                  <div style={{
                    padding: '0.75rem',
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    border: '1px solid #e0e0e0'
                  }}>
                    <strong style={{ color: '#333', display: 'block', marginBottom: '0.5rem' }}>
                      📊 Details:
                    </strong>
                    {Object.entries(insight.details || {}).map(([key, value]) => (
                      <div key={key} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '0.25rem',
                        fontSize: '0.9rem'
                      }}>
                        <span style={{ color: '#666' }}>{key}:</span>
                        <span style={{ fontWeight: '500', color: '#333' }}>{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{
                  padding: '0.75rem',
                  backgroundColor: insight.color ? `${insight.color}10` : '#f0f0f0',
                  borderRadius: '8px',
                  fontSize: '0.95rem'
                }}>
                  <strong style={{ color: insight.color || '#333' }}>Interpretation:</strong>
                  <p style={{ margin: '0.5rem 0 0', color: '#555' }}>
                    {insight.interpretation}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        {analysis.recommendations.length > 0 && (
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '16px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
          }}>
            <h3 style={{ 
              margin: '0 0 1.5rem', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              color: '#333'
            }}>
              <MdTrendingUp color="#635bff" size={24} />
              Strategic Recommendations
            </h3>
            
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              {analysis.recommendations.map((rec, index) => (
                <div key={index} style={{
                  padding: '1.5rem',
                  backgroundColor: rec.priority === 'critical' ? '#ffebee' :
                                 rec.priority === 'high' ? '#fff3e0' : '#e8f5e9',
                  borderRadius: '12px',
                  border: `1px solid ${
                    rec.priority === 'critical' ? '#ffcdd2' :
                    rec.priority === 'high' ? '#ffe0b2' : '#c8e6c9'
                  }`
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    marginBottom: '1rem'
                  }}>
                    <span style={{ fontSize: '1.5rem' }}>{rec.icon}</span>
                    <span style={{ fontWeight: '600', fontSize: '1.1rem', color: '#333' }}>
                      {rec.title}
                    </span>
                    <span style={{
                      marginLeft: 'auto',
                      padding: '4px 12px',
                      backgroundColor: rec.priority === 'critical' ? '#c62828' :
                                     rec.priority === 'high' ? '#ef6c00' : '#2e7d32',
                      color: 'white',
                      borderRadius: '20px',
                      fontSize: '0.75rem',
                      fontWeight: '600'
                    }}>
                      {rec.priority.toUpperCase()}
                    </span>
                  </div>

                  <p style={{ margin: '0 0 1rem', color: '#555' }}>{rec.description}</p>

                  <div style={{ marginBottom: '1rem' }}>
                    <strong style={{ color: '#333' }}>Action Items:</strong>
                    <ul style={{ margin: '0.5rem 0 0', paddingLeft: '1.5rem' }}>
                      {rec.actions.map((action, i) => (
                        <li key={i} style={{ color: '#666', marginBottom: '0.3rem' }}>{action}</li>
                      ))}
                    </ul>
                  </div>

                  <div style={{
                    display: 'flex',
                    gap: '1rem',
                    fontSize: '0.9rem',
                    color: '#666'
                  }}>
                    <span><strong>Impact:</strong> {rec.impact}</span>
                    <span><strong>Timeframe:</strong> {rec.timeframe}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{
      position: 'fixed',
      top: isFullScreen ? 0 : '60px',
      right: isFullScreen ? 0 : '20px',
      bottom: isFullScreen ? 0 : '20px',
      left: isFullScreen ? 0 : 'auto',
      width: isFullScreen ? '100%' : '1270px',
      backgroundColor: '#f5f7fb',
      borderRadius: isFullScreen ? 0 : '16px',
      boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
      zIndex: 10000,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        padding: '1rem 1.5rem',
        background: 'linear-gradient(135deg, #635bff 0%, #7c3aed 100%)',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <FaBrain size={32} />
          <div>
            <h2 style={{ margin: 0, fontSize: '1.4rem' }}>Universal Data Analyzer Pro</h2>
            <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.9 }}>
              📊 Intelligent Analysis with Detailed Narratives & Recommendations
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={() => setIsFullScreen(!isFullScreen)} style={headerButtonStyle}>
            {isFullScreen ? '🗗' : '⛶'}
          </button>
          <button onClick={onClose} style={headerButtonStyle}>
            <MdClose size={20} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid #e0e0e0',
        backgroundColor: 'white',
        padding: '0 1rem',
        overflowX: 'auto'
      }}>
        {[
          { id: 'input', icon: '📝', label: 'Input Data' },
          { id: 'analysis', icon: '📊', label: 'Analysis & Insights' },
          { id: 'table', icon: '📋', label: 'Data Table' },
          { id: 'columns', icon: '🔍', label: 'Column Details' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '1rem 1.5rem',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === tab.id ? '3px solid #635bff' : '3px solid transparent',
              color: activeTab === tab.id ? '#635bff' : '#666',
              cursor: 'pointer',
              fontWeight: activeTab === tab.id ? '600' : '400',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              whiteSpace: 'nowrap'
            }}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: 'auto', padding: '1.5rem' }}>
        {/* Input Tab */}
        {activeTab === 'input' && (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '2rem',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
          }}>
            

            <div style={{
              border: '2px dashed #635bff',
              borderRadius: '12px',
              padding: '2rem',
              textAlign: 'center',
              backgroundColor: '#f8f9ff',
              marginBottom: '1.5rem',
              cursor: 'pointer'
            }}>
              <input
                type="file"
                id="fileUpload"
                accept=".xlsx,.xls,.csv,.txt"
                style={{ display: 'none' }}
                onChange={handleFileUpload}
              />
              <label htmlFor="fileUpload" style={{ cursor: 'pointer' }}>
                <MdUpload size={32} color="#635bff" />
                <p style={{ margin: '0.5rem 0', fontWeight: '500' }}>
                  {fileName || 'Click to upload or drag & drop'}
                </p>
                <p style={{ fontSize: '0.85rem', color: '#666' }}>Excel, CSV, or text files</p>
              </label>
            </div>

            <textarea
              value={rawData}
              onChange={(e) => setRawData(e.target.value)}
              placeholder="Or paste your data here (tab/comma/pipe separated)..."
              style={{
                width: '100%',
                height: '150px',
                padding: '1rem',
                border: '2px solid #e0e0e0',
                borderRadius: '12px',
                fontSize: '0.9rem',
                fontFamily: 'monospace',
                marginBottom: '1rem'
              }}
            />

            {error && (
              <div style={{
                padding: '1rem',
                backgroundColor: '#ffebee',
                border: '1px solid #ffcdd2',
                borderRadius: '8px',
                color: '#c62828',
                marginBottom: '1rem'
              }}>
                <MdWarning /> {error}
              </div>
            )}

            <button
              onClick={() => analyzeData()}
              disabled={!rawData.trim() || loading}
              style={{
                width: '100%',
                padding: '1rem',
                backgroundColor: !rawData.trim() || loading ? '#ccc' : '#635bff',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: !rawData.trim() || loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              {loading ? 'Analyzing...' : '🚀 Analyze Data'}
            </button>
          </div>
        )}

        {/* Analysis Tab */}
        {activeTab === 'analysis' && analysis && renderEnhancedInsights()}

        {/* Table Tab */}
        {activeTab === 'table' && parsedData && (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '1.5rem',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
          }}>
            <h3 style={{ margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MdTableChart color="#635bff" />
              Data Table ({parsedData.rows.length} records)
            </h3>
            {renderDataTable()}
          </div>
        )}

        {/* Column Details Tab */}
        {activeTab === 'columns' && analysis && (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '1.5rem',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
          }}>
            <h3 style={{ margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MdDescription color="#635bff" />
              Column Details & Descriptions
            </h3>
            {renderColumnDescriptions()}
          </div>
        )}
      </div>
    </div>
  );
};

const headerButtonStyle = {
  background: 'rgba(255,255,255,0.2)',
  border: 'none',
  color: 'white',
  cursor: 'pointer',
  padding: '0.5rem 1rem',
  borderRadius: '8px',
  display: 'flex',
  alignItems: 'center',
  gap: '0.3rem',
  fontSize: '0.9rem'
};

export default UniversalDataAnalyzer;