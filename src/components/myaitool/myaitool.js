// components/UniversalAIAnalyticsTool.jsx
'use client';
import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';
import {
  MdClose, MdDownload, MdLightbulb, MdAssessment, MdTrendingUp,
  MdWarning, MdCheckCircle, MdShowChart, MdPieChart, MdBarChart, 
  MdTableChart, MdAnalytics, MdInsights, MdAutoGraph
} from 'react-icons/md';
import { FaRobot, FaBrain, FaChartLine, FaChartPie, FaChartBar } from 'react-icons/fa';

const COLORS = ['#635bff', '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa5', '#ff9f43', '#6c5ce7', '#00b894', '#e84342'];

const UniversalAIAnalyticsTool = ({ onClose }) => {
  const [rawDataInput, setRawDataInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [parsedData, setParsedData] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [activeTab, setActiveTab] = useState('input');
  const [chartType, setChartType] = useState('auto');
  const [error, setError] = useState('');
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [reportHistory, setReportHistory] = useState([]);

  // ============= UNIVERSAL PARSER - FIXED VERSION =============
  const universalParser = (inputText) => {
    const lines = inputText.trim().split('\n').filter(line => line.trim() !== '');
    if (lines.length === 0) return null;

    // Detect delimiter
    let delimiter = '|';
    const firstLine = lines[0];
    
    if (firstLine.includes('\t')) delimiter = '\t';
    else if (firstLine.includes(',')) delimiter = ',';
    else if (firstLine.includes('|')) delimiter = '|';
    else delimiter = /\s{2,}/; // Multiple spaces
    
    // Parse headers
    let headers = [];
    const firstLineParts = firstLine.split(delimiter).map(h => h.trim()).filter(h => h !== '');
    
    // Check if first line looks like headers (contains text, not just numbers)
    const hasTextHeaders = firstLineParts.some(part => isNaN(parseFloat(part)) && part.length > 0);
    
    if (hasTextHeaders) {
      headers = firstLineParts;
    } else {
      // Generate headers if first line is data
      headers = firstLineParts.map((_, index) => `Column ${index + 1}`);
    }
    
    // Parse data rows
    const dataRows = [];
    const startRow = hasTextHeaders ? 1 : 0;
    
    for (let i = startRow; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      const cells = line.split(delimiter).map(cell => cell.trim()).filter(cell => cell !== '');
      
      if (cells.length > 0) {
        const row = {};
        
        // Map cells to headers
        headers.forEach((header, index) => {
          if (index < cells.length) {
            let value = cells[index];
            
            // Try to detect numeric values (remove commas, currency symbols, %)
            const cleanValue = value.replace(/,/g, '').replace(/[₹$€£%]/g, '').trim();
            const numericValue = parseFloat(cleanValue);
            
            if (!isNaN(numericValue) && cleanValue !== '') {
              row[header] = numericValue;
              row[`${header}_raw`] = value; // Keep original format
            } else {
              row[header] = value;
            }
          }
        });
        
        dataRows.push(row);
      }
    }
    
    // Analyze data structure
    const analysis = analyzeDataStructure(dataRows, headers);
    
    return {
      headers,
      rows: dataRows,
      analysis,
      raw: inputText,
      delimiter
    };
  };

  // ============= DYNAMIC DATA STRUCTURE ANALYSIS - FIXED =============
  const analyzeDataStructure = (dataRows, headers) => {
    const analysis = {
      type: 'unknown',
      primaryKey: null,
      numericColumns: [],
      textColumns: [],
      dateColumns: [],
      percentageColumns: [],
      currencyColumns: [],
      quantityColumns: [],
      statusColumns: [],
      departmentColumns: [],
      itemColumns: [],
      pendingColumns: [],
      transferColumns: [],
      categories: [],
      summary: {}
    };
    
    if (dataRows.length === 0) return analysis;
    
    // Analyze each column
    headers.forEach(header => {
      const headerStr = String(header || '');
      const headerLower = headerStr.toLowerCase();
      
      const values = dataRows.map(row => row[headerStr]).filter(v => v !== undefined);
      if (values.length === 0) return;
      
      // Check if numeric
      const numericValues = values.filter(v => typeof v === 'number');
      const isNumeric = numericValues.length > values.length * 0.5;
      
      if (isNumeric) {
        const colInfo = {
          name: headerStr,
          values: numericValues,
          min: Math.min(...numericValues),
          max: Math.max(...numericValues),
          sum: numericValues.reduce((a, b) => a + b, 0),
          avg: numericValues.reduce((a, b) => a + b, 0) / numericValues.length
        };
        
        analysis.numericColumns.push(colInfo);
        
        // Detect column type based on header name
        if (headerLower.includes('revenue') || headerLower.includes('sales') || 
            headerLower.includes('income') || headerLower.includes('amount') || 
            headerLower.includes('price') || headerLower.includes('cost') || 
            headerLower.includes('expense') || headerLower.includes('budget') || 
            headerLower.includes('payment') || headerLower.includes('invoice')) {
          analysis.currencyColumns.push(headerStr);
        } else if (headerLower.includes('qty') || headerLower.includes('quantity') || 
                  headerLower.includes('count') || headerLower.includes('stock') || 
                  headerLower.includes('inventory') || headerLower.includes('units') || 
                  headerLower.includes('items')) {
          analysis.quantityColumns.push(headerStr);
        } else if (headerLower.includes('percent') || headerLower.includes('percentage') || 
                  headerLower.includes('rate') || headerLower.includes('margin') || 
                  headerLower.includes('growth') || headerLower.includes('ratio')) {
          analysis.percentageColumns.push(headerStr);
        }
      } else {
        analysis.textColumns.push(headerStr);
        
        // Check if it's a date column
        const datePattern = /^\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4}$|^\d{4}[-\/]\d{1,2}[-\/]\d{1,2}$|^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i;
        if (values.some(v => datePattern.test(String(v)))) {
          analysis.dateColumns.push(headerStr);
        }
        
        // Check column types by header name
        if (headerLower.includes('dept') || headerLower.includes('department') || headerLower.includes('section')) {
          analysis.departmentColumns.push(headerStr);
        }
        
        if (headerLower.includes('item') || headerLower.includes('product') || headerLower.includes('code') || headerLower.includes('sku')) {
          analysis.itemColumns.push(headerStr);
        }
        
        if (headerLower.includes('status') || headerLower.includes('state') || headerLower.includes('condition')) {
          analysis.statusColumns.push(headerStr);
        }
        
        if (headerLower.includes('pending') || headerLower.includes('due') || headerLower.includes('outstanding')) {
          analysis.pendingColumns.push(headerStr);
        }
        
        if (headerLower.includes('transfer') || headerLower.includes('transferable')) {
          analysis.transferColumns.push(headerStr);
        }
        
        // Get unique values for categorization
        const uniqueValues = [...new Set(values.map(v => String(v)))];
        if (uniqueValues.length <= 15 && uniqueValues.length > 1) {
          analysis.categories.push({
            name: headerStr,
            values: uniqueValues,
            counts: uniqueValues.map(val => ({
              value: val,
              count: values.filter(v => String(v) === val).length
            }))
          });
        }
      }
    });
    
    // Determine primary key
    if (headers.length > 0) {
      const firstCol = headers[0];
      const firstColValues = dataRows.map(row => row[firstCol]);
      const uniqueFirstCol = [...new Set(firstColValues.map(v => String(v)))];
      if (uniqueFirstCol.length === dataRows.length) {
        analysis.primaryKey = firstCol;
      }
    }
    
    // Detect data type
    if (analysis.dateColumns.length > 0 && analysis.numericColumns.length > 0) {
      analysis.type = 'time_series';
    } else if (analysis.departmentColumns.length > 0) {
      analysis.type = 'department_tracking';
    } else if (analysis.itemColumns.length > 0) {
      analysis.type = 'item_tracking';
    } else if (analysis.statusColumns.length > 0) {
      analysis.type = 'status_tracking';
    } else if (analysis.currencyColumns.length > 0) {
      analysis.type = 'financial';
    } else if (analysis.quantityColumns.length > 0) {
      analysis.type = 'inventory';
    } else if (analysis.categories.length > 0) {
      analysis.type = 'categorical';
    }
    
    // Generate summary
    analysis.summary = {
      totalRows: dataRows.length,
      totalColumns: headers.length,
      detectedType: analysis.type,
      numericFields: analysis.numericColumns.length,
      textFields: analysis.textColumns.length
    };
    
    return analysis;
  };

  // ============= DYNAMIC INSIGHT GENERATION =============
  const generateUniversalInsights = (parsedData) => {
    const insights = [];
    const { rows, analysis } = parsedData;
    
    if (!rows || rows.length === 0) return insights;
    
    // 1. Calculate totals for numeric columns
    analysis.numericColumns.forEach(col => {
      if (col.sum > 0) {
        let icon = '📊';
        let type = 'info';
        
        const colLower = col.name.toLowerCase();
        if (colLower.includes('revenue') || colLower.includes('profit') || colLower.includes('sale')) {
          icon = '💰';
          type = 'positive';
        } else if (colLower.includes('pending') || colLower.includes('due')) {
          icon = '⏳';
          type = 'warning';
        } else if (colLower.includes('qty') || colLower.includes('quantity') || colLower.includes('stock')) {
          icon = '📦';
        } else if (colLower.includes('transfer')) {
          icon = '🔄';
        }
        
        insights.push({
          type: type,
          icon: icon,
          title: `Total ${col.name}`,
          value: formatValue(col.sum, col.name),
          description: `Sum of all ${col.name} entries`,
          priority: 'high'
        });
      }
    });
    
    // 2. Analyze trends if date column exists
    if (analysis.dateColumns.length > 0 && analysis.numericColumns.length > 0) {
      const dateCol = analysis.dateColumns[0];
      const metricCol = analysis.numericColumns[0];
      
      if (rows.length >= 2) {
        const firstValue = rows[0][metricCol.name];
        const lastValue = rows[rows.length - 1][metricCol.name];
        
        if (typeof firstValue === 'number' && typeof lastValue === 'number') {
          const change = ((lastValue - firstValue) / firstValue * 100).toFixed(1);
          insights.push({
            type: change > 0 ? 'positive' : 'negative',
            icon: change > 0 ? '📈' : '📉',
            title: `${metricCol.name} Trend`,
            value: `${change > 0 ? '+' : ''}${change}%`,
            description: `From ${formatValue(firstValue, metricCol.name)} to ${formatValue(lastValue, metricCol.name)}`,
            priority: 'high'
          });
        }
      }
    }
    
    // 3. Analyze pending items
    if (analysis.pendingColumns.length > 0) {
      const pendingCol = analysis.pendingColumns[0];
      let totalPending = 0;
      
      rows.forEach(row => {
        const val = row[pendingCol];
        if (typeof val === 'number') {
          totalPending += val;
        } else if (typeof val === 'string') {
          // Check if status contains 'pending'
          if (val.toLowerCase().includes('pending')) {
            totalPending += 1;
          }
        }
      });
      
      if (totalPending > 0) {
        insights.push({
          type: 'warning',
          icon: '⚠️',
          title: 'Pending Items',
          value: formatValue(totalPending, 'qty'),
          description: `Total pending items requiring attention`,
          priority: 'high'
        });
      }
    }
    
    // 4. Analyze transferable items
    if (analysis.transferColumns.length > 0) {
      const transferCol = analysis.transferColumns[0];
      let totalTransferable = 0;
      
      rows.forEach(row => {
        const val = row[transferCol];
        if (typeof val === 'number') {
          totalTransferable += val;
        }
      });
      
      if (totalTransferable > 0) {
        insights.push({
          type: 'info',
          icon: '🔄',
          title: 'Transferable Items',
          value: formatValue(totalTransferable, 'qty'),
          description: `Items available for transfer between departments`,
          priority: 'medium'
        });
      }
    }
    
    // 5. Analyze department distribution
    if (analysis.departmentColumns.length > 0) {
      const deptCol = analysis.departmentColumns[0];
      const departments = [...new Set(rows.map(row => String(row[deptCol] || '')))].filter(d => d);
      
      if (departments.length > 0) {
        insights.push({
          type: 'info',
          icon: '🏭',
          title: 'Department Overview',
          value: `${departments.length} Departments`,
          description: `Active departments: ${departments.join(', ')}`,
          priority: 'medium'
        });
      }
    }
    
    // 6. Analyze checked vs received
    const checkedCol = analysis.textColumns.find(col => 
      col.toLowerCase().includes('check') || col.toLowerCase().includes('verified')
    );
    const receivedCol = analysis.textColumns.find(col => 
      col.toLowerCase().includes('receiv') || col.toLowerCase().includes('recv')
    );
    
    if (checkedCol && receivedCol) {
      let totalChecked = 0;
      let totalReceived = 0;
      
      rows.forEach(row => {
        const checked = row[checkedCol];
        const received = row[receivedCol];
        
        if (typeof checked === 'number') totalChecked += checked;
        if (typeof received === 'number') totalReceived += received;
      });
      
      if (totalChecked > 0) {
        const completionRate = (totalReceived / totalChecked * 100).toFixed(1);
        insights.push({
          type: completionRate > 90 ? 'positive' : completionRate > 70 ? 'warning' : 'negative',
          icon: '✅',
          title: 'Completion Rate',
          value: `${completionRate}%`,
          description: `${formatValue(totalReceived)} received out of ${formatValue(totalChecked)} checked`,
          priority: 'high'
        });
      }
    }
    
    return insights;
  };

  // ============= DYNAMIC RECOMMENDATION GENERATION =============
  const generateUniversalRecommendations = (parsedData, insights) => {
    const recommendations = [];
    const { rows, analysis } = parsedData;
    
    // 1. Pending items recommendation
    const pendingInsight = insights.find(i => i.title === 'Pending Items');
    if (pendingInsight) {
      const pendingValue = parseFloat(pendingInsight.value.replace(/[^0-9.]/g, ''));
      recommendations.push({
        title: 'Process Pending Items',
        description: `${formatValue(pendingValue)} items require immediate attention. Prioritize verification and processing of pending items.`,
        impact: `Complete ${formatValue(pendingValue)} pending transactions`,
        priority: pendingValue > 1000 ? 'Critical' : pendingValue > 500 ? 'High' : 'Medium'
      });
    }
    
    // 2. Transfer optimization
    const transferInsight = insights.find(i => i.title === 'Transferable Items');
    if (transferInsight) {
      const transferValue = parseFloat(transferInsight.value.replace(/[^0-9.]/g, ''));
      recommendations.push({
        title: 'Optimize Inventory Transfer',
        description: `${formatValue(transferValue)} items are available for transfer. Plan department-wise distribution to balance workload.`,
        impact: `Reduce pending transfers by ${formatValue(transferValue)}`,
        priority: transferValue > 1000 ? 'High' : 'Medium'
      });
    }
    
    // 3. Department workload balancing
    if (analysis.departmentColumns.length > 0 && analysis.quantityColumns.length > 0) {
      const deptCol = analysis.departmentColumns[0];
      const qtyCol = analysis.quantityColumns[0];
      
      const deptWise = {};
      rows.forEach(row => {
        const dept = String(row[deptCol] || 'Unknown');
        const qty = typeof row[qtyCol] === 'number' ? row[qtyCol] : 0;
        deptWise[dept] = (deptWise[dept] || 0) + qty;
      });
      
      const depts = Object.entries(deptWise);
      if (depts.length > 1) {
        const values = depts.map(([_, qty]) => qty);
        const avg = values.reduce((a, b) => a + b, 0) / values.length;
        const maxDept = depts.reduce((max, curr) => curr[1] > max[1] ? curr : max);
        const minDept = depts.reduce((min, curr) => curr[1] < min[1] ? curr : min);
        
        if (maxDept[1] > avg * 1.5) {
          recommendations.push({
            title: 'Balance Department Workload',
            description: `${maxDept[0]} has ${formatValue(maxDept[1])} items, which is significantly higher than average. Consider redistributing workload.`,
            impact: 'Improve operational efficiency by 15-20%',
            priority: 'High'
          });
        }
      }
    }
    
    // 4. Completion rate improvement
    const completionInsight = insights.find(i => i.title === 'Completion Rate');
    if (completionInsight && completionInsight.value < '80%') {
      recommendations.push({
        title: 'Improve Processing Efficiency',
        description: `Current completion rate is ${completionInsight.value}. Review bottlenecks in verification and receiving process.`,
        impact: 'Target: 90%+ completion rate',
        priority: 'High'
      });
    }
    
    // 5. Stock optimization
    if (analysis.quantityColumns.length > 0) {
      const qtyCol = analysis.quantityColumns[0];
      const totalQty = rows.reduce((sum, row) => {
        const val = row[qtyCol];
        return sum + (typeof val === 'number' ? val : 0);
      }, 0);
      
      if (totalQty > 0) {
        recommendations.push({
          title: 'Inventory Optimization',
          description: `Total stock of ${formatValue(totalQty)} items. Review slow-moving items and optimize reorder levels.`,
          impact: 'Reduce carrying costs by 10-15%',
          priority: 'Medium'
        });
      }
    }
    
    return recommendations;
  };

  // ============= UTILITY FUNCTIONS =============
  const formatValue = (value, columnName = '') => {
    if (typeof value !== 'number') return String(value || '');
    
    const colLower = columnName.toLowerCase();
    if (colLower.includes('revenue') || colLower.includes('sales') || 
        colLower.includes('income') || colLower.includes('amount') || 
        colLower.includes('price') || colLower.includes('cost') || 
        colLower.includes('expense') || colLower.includes('budget') || 
        colLower.includes('payment') || colLower.includes('invoice')) {
      return `₹${(value / 1000).toFixed(0)}K`; // Format in thousands
    } else if (colLower.includes('qty') || colLower.includes('quantity') || 
              colLower.includes('count') || colLower.includes('stock') || 
              colLower.includes('inventory') || colLower.includes('units') || 
              colLower.includes('items')) {
      return value.toLocaleString(); // Format with commas
    } else if (colLower.includes('percent') || colLower.includes('percentage') || 
              colLower.includes('rate') || colLower.includes('margin') || 
              colLower.includes('growth') || colLower.includes('ratio')) {
      return `${value.toFixed(1)}%`;
    }
    
    // Default formatting
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}K`;
    }
    return value.toLocaleString();
  };

  // ============= DYNAMIC CHART RENDERING =============
  const renderDynamicChart = () => {
    if (!parsedData || !parsedData.rows || parsedData.rows.length === 0) {
      return <div style={{ textAlign: 'center', padding: '2rem', color: '#999' }}>No data to visualize</div>;
    }

    const { rows, analysis } = parsedData;
    
    // Auto-select chart type
    let selectedChartType = chartType;
    if (selectedChartType === 'auto') {
      if (analysis.dateColumns.length > 0) {
        selectedChartType = 'line';
      } else if (analysis.categories.length > 0 && analysis.categories[0].counts.length <= 8) {
        selectedChartType = 'pie';
      } else {
        selectedChartType = 'bar';
      }
    }

    // Prepare chart data
    let chartData = [];
    const xAxisKey = analysis.primaryKey || analysis.textColumns[0] || 'name';
    const yAxisKey = analysis.numericColumns[0]?.name || analysis.quantityColumns[0] || analysis.currencyColumns[0];
    
    // Pie chart for categories
    if (selectedChartType === 'pie' && analysis.categories.length > 0) {
      const category = analysis.categories[0];
      chartData = category.counts;
      
      return (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={true}
              label={entry => `${entry.value} (${((entry.count / rows.length) * 100).toFixed(1)}%)`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="count"
              nameKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      );
    }

    // Bar/Line chart for time series or comparisons
    chartData = rows.map((row, index) => {
      const item = { 
        name: row[xAxisKey] || `Item ${index + 1}`,
        index: index + 1
      };
      
      // Add all numeric columns
      analysis.numericColumns.slice(0, 3).forEach(col => {
        if (row[col.name] !== undefined) {
          item[col.name] = row[col.name];
        }
      });
      
      return item;
    }).slice(0, 20); // Limit to 20 items for performance

    if (chartData.length === 0) return null;

    return (
      <ResponsiveContainer width="100%" height={300}>
        {selectedChartType === 'bar' ? (
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} interval={0} />
            <YAxis />
            <Tooltip formatter={(value) => formatValue(value, yAxisKey)} />
            <Legend />
            {analysis.numericColumns.slice(0, 3).map((col, index) => (
              <Bar key={col.name} dataKey={col.name} fill={COLORS[index % COLORS.length]} />
            ))}
          </BarChart>
        ) : (
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} interval={0} />
            <YAxis />
            <Tooltip formatter={(value) => formatValue(value, yAxisKey)} />
            <Legend />
            {analysis.numericColumns.slice(0, 3).map((col, index) => (
              <Line key={col.name} type="monotone" dataKey={col.name} stroke={COLORS[index % COLORS.length]} strokeWidth={2} />
            ))}
          </LineChart>
        )}
      </ResponsiveContainer>
    );
  };

  // ============= DYNAMIC TABLE RENDERING =============
  const renderDynamicTable = () => {
    if (!parsedData || !parsedData.rows || parsedData.rows.length === 0) return null;
    
    const { headers, rows } = parsedData;
    
    return (
      <div style={{ overflowX: 'auto', maxHeight: '400px', overflowY: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
          <thead style={{ position: 'sticky', top: 0, backgroundColor: '#f8f9ff', zIndex: 1 }}>
            <tr>
              {headers.map((header, i) => (
                <th key={i} style={{
                  padding: '0.75rem',
                  textAlign: 'left',
                  borderBottom: '2px solid #635bff',
                  fontWeight: '600',
                  color: '#333',
                  whiteSpace: 'nowrap'
                }}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex} style={{ borderBottom: '1px solid #eee' }}>
                {headers.map((header, colIndex) => {
                  const value = row[header];
                  const isNumeric = typeof value === 'number';
                  
                  return (
                    <td key={colIndex} style={{
                      padding: '0.75rem',
                      textAlign: isNumeric ? 'right' : 'left',
                      color: isNumeric ? '#2c3e50' : '#333',
                      fontWeight: isNumeric ? '500' : 'normal',
                      whiteSpace: 'nowrap'
                    }}>
                      {isNumeric ? formatValue(value, header) : value || '-'}
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

  // ============= MAIN ANALYSIS FUNCTION =============
  const analyzeData = () => {
    if (!rawDataInput.trim()) {
      setError('Please paste your data');
      return;
    }

    setIsAnalyzing(true);
    setError('');

    try {
      // Parse the data
      const parsed = universalParser(rawDataInput);
      
      if (!parsed || parsed.rows.length === 0) {
        throw new Error('Could not parse data. Please check your input format.');
      }

      setParsedData(parsed);
      
      // Generate insights and recommendations
      const insights = generateUniversalInsights(parsed);
      const recommendations = generateUniversalRecommendations(parsed, insights);
      
      // Create report title based on detected type
      let reportTitle = 'Data Analysis Report';
      if (parsed.analysis.type === 'department_tracking') reportTitle = 'Department-wise Distribution Analysis';
      else if (parsed.analysis.type === 'item_tracking') reportTitle = 'Item/Product Tracking Analysis';
      else if (parsed.analysis.type === 'status_tracking') reportTitle = 'Status & Pending Items Analysis';
      else if (parsed.analysis.type === 'inventory') reportTitle = 'Inventory & Stock Analysis';
      else if (parsed.analysis.type === 'financial') reportTitle = 'Financial Data Analysis';
      else if (parsed.analysis.type === 'time_series') reportTitle = 'Time Series Trend Analysis';
      
      const report = {
        id: Date.now(),
        title: reportTitle,
        timestamp: new Date().toISOString(),
        dataType: parsed.analysis.type,
        rowCount: parsed.rows.length,
        columnCount: parsed.headers.length,
        insights,
        recommendations,
        summary: parsed.analysis.summary
      };

      setReportData(report);
      setActiveTab('report');
      
      // Add to history
      setReportHistory(prev => [report, ...prev].slice(0, 20));

    } catch (err) {
      setError(err.message || 'Failed to analyze data. Please check your format.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // ============= RENDER UI =============
  return (
    <div style={{
      position: 'fixed',
      top: isFullScreen ? 0 : '80px',
      right: isFullScreen ? 0 : '20px',
      bottom: isFullScreen ? 0 : '20px',
      left: isFullScreen ? 0 : 'auto',
      width: isFullScreen ? '100%' : '1000px',
      backgroundColor: 'white',
      borderRadius: isFullScreen ? 0 : '12px',
      boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
      zIndex: 2000,
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <FaRobot size={28} />
          <div>
            <h2 style={{ margin: 0, fontSize: '1.3rem' }}>Universal AI Analytics</h2>
            <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.9 }}>
              🤖 Works with ANY data format - Production, Inventory, Department, Financial, etc.
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button 
            onClick={() => setIsFullScreen(!isFullScreen)} 
            style={headerButtonStyle}
            className="hover:bg-white hover:bg-opacity-20"
          >
            {isFullScreen ? '🗗' : '⛶'}
          </button>
          <button 
            onClick={onClose} 
            style={headerButtonStyle}
            className="hover:bg-white hover:bg-opacity-20"
          >
            <MdClose size={20} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid #e0e0e0',
        backgroundColor: '#f8f9fa',
        padding: '0 1rem'
      }}>
        {['input', 'report', 'insights', 'history'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '0.75rem 1.5rem',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === tab ? '3px solid #635bff' : '3px solid transparent',
              color: activeTab === tab ? '#635bff' : '#666',
              cursor: 'pointer',
              fontWeight: activeTab === tab ? '600' : '400',
              fontSize: '0.95rem',
              textTransform: 'capitalize',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            {tab === 'input' && '📝'}
            {tab === 'report' && '📊'}
            {tab === 'insights' && '💡'}
            {tab === 'history' && '📋'}
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: 'auto', padding: '1.5rem', backgroundColor: '#fafafa' }}>
        {activeTab === 'input' && (
          <div>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '1.5rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              marginBottom: '1.5rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <MdAutoGraph size={24} color="#635bff" />
                <h3 style={{ margin: 0, color: '#333' }}>Paste Any Data - I'll Analyze It</h3>
              </div>
              
              <p style={{ color: '#666', marginBottom: '1rem', fontSize: '0.95rem' }}>
                ✅ Works with ANY format: Production reports, Department tracking, Inventory data, 
                Financial statements, Client payments, Sales data, HR records, etc.
              </p>
              
              <textarea
                value={rawDataInput}
                onChange={(e) => setRawDataInput(e.target.value)}
                placeholder={`Paste your data here - I'll automatically detect the format:

📦 Production Item Distribution
Item Code | Item Name | Total Qty | Distributed | Checked | Received | Pending | Transferable
ITM-001 | Cotton Fabric | 5000 | 4500 | 4300 | 4200 | 800 | 200
ITM-002 | Polyester Fabric | 4000 | 3800 | 3600 | 3500 | 500 | 150

🏭 Department Wise Distribution
Department | Items Assigned | Checked | Received | Pending | Transferable
Cutting | 8000 | 7600 | 7400 | 600 | 200
Stitching | 9000 | 8500 | 8200 | 800 | 300

📊 Daily Production Movement
Date | Distributed | Checked | Received | Pending | Transferable
01-Feb-26 | 2500 | 2300 | 2200 | 300 | 80
02-Feb-26 | 2700 | 2500 | 2400 | 300 | 90

💰 Financial Data
Month | Revenue | Expenses | Profit
Jan | 500000 | 350000 | 150000
Feb | 550000 | 380000 | 170000`}
                style={{
                  width: '100%',
                  height: '300px',
                  padding: '1rem',
                  border: '2px solid #e0e0e0',
                  borderRadius: '10px',
                  fontSize: '0.9rem',
                  fontFamily: 'monospace',
                  resize: 'vertical',
                  backgroundColor: '#fafafa',
                  marginBottom: '1rem'
                }}
                className="focus:border-[#635bff] focus:outline-none"
              />

              {error && (
                <div style={{
                  padding: '1rem',
                  backgroundColor: '#ffebee',
                  border: '1px solid #ffcdd2',
                  borderRadius: '8px',
                  color: '#c62828',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <MdWarning size={20} />
                  {error}
                </div>
              )}

              <button
                onClick={analyzeData}
                disabled={!rawDataInput.trim() || isAnalyzing}
                style={{
                  width: '100%',
                  padding: '1rem',
                  backgroundColor: !rawDataInput.trim() || isAnalyzing ? '#ccc' : '#635bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: !rawDataInput.trim() || isAnalyzing ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.75rem',
                  transition: 'all 0.3s'
                }}
                className="hover:bg-[#5248cc]"
              >
                {isAnalyzing ? (
                  <>
                    <span style={{ animation: 'spin 1s infinite' }}>⚙️</span>
                    AI is Analyzing Your Data...
                  </>
                ) : (
                  <>
                    <FaBrain size={18} />
                    🔍 Auto-Detect & Analyze Data
                  </>
                )}
              </button>
            </div>

            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '1.5rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
            }}>
              <h4 style={{ margin: '0 0 1rem', color: '#333' }}>📋 Supported Data Formats</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div style={{ padding: '1rem', backgroundColor: '#f8f9ff', borderRadius: '8px' }}>
                  <strong>📦 Production/Inventory</strong>
                  <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.5rem' }}>
                    Item codes, quantities, distribution, pending, transferable
                  </p>
                </div>
                <div style={{ padding: '1rem', backgroundColor: '#f8f9ff', borderRadius: '8px' }}>
                  <strong>🏭 Department Tracking</strong>
                  <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.5rem' }}>
                    Department names, assigned items, checked, received, pending
                  </p>
                </div>
                <div style={{ padding: '1rem', backgroundColor: '#f8f9ff', borderRadius: '8px' }}>
                  <strong>📊 Daily/Monthly Reports</strong>
                  <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.5rem' }}>
                    Dates, quantities, status, movements, trends
                  </p>
                </div>
                <div style={{ padding: '1rem', backgroundColor: '#f8f9ff', borderRadius: '8px' }}>
                  <strong>💰 Financial Data</strong>
                  <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.5rem' }}>
                    Revenue, expenses, profit, margins, growth percentages
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'report' && reportData && parsedData && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Report Header */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '1.5rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ margin: '0 0 0.5rem', color: '#333', fontSize: '1.4rem' }}>
                    {reportData.title}
                  </h3>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      backgroundColor: '#e8f5e9',
                      color: '#2e7d32',
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      fontWeight: '600'
                    }}>
                      📊 {parsedData.rows.length} rows • {parsedData.headers.length} columns
                    </span>
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      backgroundColor: '#e3f2fd',
                      color: '#1565c0',
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      fontWeight: '600'
                    }}>
                      🔍 Type: {parsedData.analysis.type.replace('_', ' ')}
                    </span>
                    <span style={{ color: '#666', fontSize: '0.85rem' }}>
                      {new Date(reportData.timestamp).toLocaleString()}
                    </span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <select
                    value={chartType}
                    onChange={(e) => setChartType(e.target.value)}
                    style={{
                      padding: '0.5rem',
                      border: '1px solid #e0e0e0',
                      borderRadius: '6px',
                      fontSize: '0.9rem',
                      backgroundColor: 'white'
                    }}
                  >
                    <option value="auto">🎯 Auto (Recommended)</option>
                    <option value="bar">📊 Bar Chart</option>
                    <option value="line">📈 Line Chart</option>
                    <option value="pie">🥧 Pie Chart</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Key Metrics Cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem'
            }}>
              {reportData.insights.filter(i => i.priority === 'high').slice(0, 4).map((insight, index) => (
                <div key={index} style={{
                  backgroundColor: 'white',
                  padding: '1.2rem',
                  borderRadius: '12px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                  border: `1px solid ${
                    insight.type === 'positive' ? '#c8e6c9' :
                    insight.type === 'warning' ? '#ffe0b2' :
                    insight.type === 'negative' ? '#ffcdd2' : '#e0e0e0'
                  }`
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '1.5rem' }}>{insight.icon}</span>
                    <span style={{ fontSize: '0.8rem', color: '#666' }}>{insight.title}</span>
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#333', marginBottom: '0.3rem' }}>
                    {insight.value}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#666' }}>
                    {insight.description}
                  </div>
                </div>
              ))}
            </div>

            {/* Chart */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '1.5rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
            }}>
              <h4 style={{ margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MdShowChart color="#635bff" />
                Data Visualization
              </h4>
              {renderDynamicChart()}
            </div>

            {/* Data Table */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '1.5rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
            }}>
              <h4 style={{ margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MdTableChart color="#635bff" />
                Your Data ({parsedData.rows.length} records)
              </h4>
              {renderDynamicTable()}
            </div>
          </div>
        )}

        {activeTab === 'insights' && reportData && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* AI Insights */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '1.5rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
            }}>
              <h4 style={{ margin: '0 0 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FaBrain color="#635bff" size={20} />
                AI-Generated Insights from Your Data
              </h4>
              <div style={{ display: 'grid', gap: '1rem' }}>
                {reportData.insights.map((insight, index) => (
                  <div
                    key={index}
                    style={{
                      padding: '1rem',
                      backgroundColor: insight.type === 'positive' ? '#e8f5e9' :
                                     insight.type === 'warning' ? '#fff3e0' :
                                     insight.type === 'negative' ? '#ffebee' :
                                     insight.type === 'info' ? '#e3f2fd' : '#f5f5f5',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '1rem',
                      border: `1px solid ${
                        insight.type === 'positive' ? '#c8e6c9' :
                        insight.type === 'warning' ? '#ffe0b2' :
                        insight.type === 'negative' ? '#ffcdd2' :
                        insight.type === 'info' ? '#bbdefb' : '#e0e0e0'
                      }`
                    }}
                  >
                    <span style={{ fontSize: '1.5rem' }}>{insight.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                        <span style={{ fontWeight: '600', color: '#333' }}>{insight.title}</span>
                        {insight.priority && (
                          <span style={{
                            padding: '0.15rem 0.5rem',
                            backgroundColor: insight.priority === 'Critical' ? '#ffebee' :
                                           insight.priority === 'High' ? '#fff3e0' : '#e8f5e9',
                            color: insight.priority === 'Critical' ? '#c62828' :
                                   insight.priority === 'High' ? '#ef6c00' : '#2e7d32',
                            borderRadius: '12px',
                            fontSize: '0.7rem',
                            fontWeight: '600'
                          }}>
                            {insight.priority}
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '0.95rem', color: '#555', marginBottom: '0.3rem' }}>
                        {insight.description}
                      </div>
                      <div style={{ fontSize: '1.1rem', fontWeight: '600', color: '#333' }}>
                        {insight.value}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Strategic Recommendations */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '1.5rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
            }}>
              <h4 style={{ margin: '0 0 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MdAssessment color="#635bff" size={20} />
                Strategic Recommendations
              </h4>
              <div style={{ display: 'grid', gap: '1rem' }}>
                {reportData.recommendations.map((rec, index) => (
                  <div
                    key={index}
                    style={{
                      padding: '1.2rem',
                      backgroundColor: 'white',
                      borderRadius: '10px',
                      border: '1px solid #e0e0e0',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start'
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <span style={{ fontWeight: '600', color: '#333', fontSize: '1rem' }}>{rec.title}</span>
                        <span style={{
                          padding: '0.2rem 0.6rem',
                          backgroundColor: rec.priority === 'Critical' ? '#ffebee' : 
                                         rec.priority === 'High' ? '#fff3e0' : '#e8f5e9',
                          color: rec.priority === 'Critical' ? '#c62828' : 
                                 rec.priority === 'High' ? '#ef6c00' : '#2e7d32',
                          borderRadius: '20px',
                          fontSize: '0.7rem',
                          fontWeight: '600'
                        }}>
                          {rec.priority}
                        </span>
                      </div>
                      <p style={{ margin: '0 0 0.5rem', color: '#666', fontSize: '0.95rem' }}>
                        {rec.description}
                      </p>
                      <span style={{ fontSize: '0.85rem', color: '#635bff', fontWeight: '500' }}>
                        {rec.impact}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '1.5rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
          }}>
            <h3 style={{ marginBottom: '1.5rem', color: '#333' }}>📋 Analysis History</h3>
            {reportHistory.length > 0 ? (
              <div style={{ display: 'grid', gap: '1rem' }}>
                {reportHistory.map((report) => (
                  <div
                    key={report.id}
                    style={{
                      padding: '1rem',
                      backgroundColor: '#f8f9ff',
                      borderRadius: '10px',
                      border: '1px solid #e0e0e0',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      cursor: 'pointer'
                    }}
                    className="hover:border-[#635bff]"
                    onClick={() => {
                      setReportData(report);
                      setActiveTab('report');
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: '600', color: '#333', marginBottom: '0.2rem' }}>
                        {report.title}
                      </div>
                      <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: '#666' }}>
                        <span>{report.rowCount} rows</span>
                        <span>{report.columnCount} columns</span>
                        <span>{new Date(report.timestamp).toLocaleString()}</span>
                      </div>
                    </div>
                    <span style={{ fontSize: '1.5rem' }}>📊</span>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#999' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📄</div>
                <p>No analysis history yet</p>
                <p style={{ fontSize: '0.9rem' }}>Paste your data and click Analyze to get started</p>
              </div>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

const headerButtonStyle = {
  background: 'rgba(255,255,255,0.2)',
  border: 'none',
  color: 'white',
  cursor: 'pointer',
  padding: '0.5rem',
  borderRadius: '6px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.2s'
};

export default UniversalAIAnalyticsTool;