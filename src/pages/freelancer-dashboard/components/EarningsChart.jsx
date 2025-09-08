import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const EarningsChart = () => {
  const earningsData = [
    { month: 'T1', earnings: 12000000, projects: 2 },
    { month: 'T2', earnings: 18000000, projects: 3 },
    { month: 'T3', earnings: 15000000, projects: 2 },
    { month: 'T4', earnings: 22000000, projects: 4 },
    { month: 'T5', earnings: 28000000, projects: 5 },
    { month: 'T6', earnings: 25000000, projects: 4 },
    { month: 'T7', earnings: 32000000, projects: 6 },
    { month: 'T8', earnings: 35000000, projects: 6 },
    { month: 'T9', earnings: 30000000, projects: 5 }
  ];

  const formatCurrency = (value) => {
    return `${(value / 1000000)?.toFixed(0)}M VNĐ`;
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-elevation-2">
          <p className="text-sm font-medium text-foreground mb-1">{`Tháng ${label}`}</p>
          <p className="text-sm text-success">
            {`Thu nhập: ${payload?.[0]?.value?.toLocaleString('vi-VN')} VNĐ`}
          </p>
          <p className="text-sm text-accent">
            {`Dự án: ${payload?.[0]?.payload?.projects}`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-1">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Thu nhập theo tháng</h3>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-primary rounded-full"></div>
            <span className="text-muted-foreground">Thu nhập</span>
          </div>
        </div>
      </div>

      <div className="h-64 w-full" aria-label="Biểu đồ thu nhập theo tháng">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={earningsData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="month" 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
            />
            <YAxis 
              tickFormatter={formatCurrency}
              stroke="var(--color-muted-foreground)"
              fontSize={12}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="earnings" 
              stroke="var(--color-primary)" 
              strokeWidth={3}
              dot={{ fill: 'var(--color-primary)', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: 'var(--color-primary)', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-2xl font-bold text-success">245M</p>
          <p className="text-sm text-muted-foreground">Tổng thu nhập</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-accent">37</p>
          <p className="text-sm text-muted-foreground">Dự án hoàn thành</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-primary">27M</p>
          <p className="text-sm text-muted-foreground">Thu nhập trung bình</p>
        </div>
      </div>
    </div>
  );
};

export default EarningsChart;