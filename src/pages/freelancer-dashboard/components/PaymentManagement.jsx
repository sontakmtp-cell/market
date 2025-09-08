import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PaymentManagement = () => {
  const payments = [
    {
      id: 1,
      project: 'Thiết kế hệ thống cầu trục',
      freelancer: 'Nguyễn Văn A',
      amount: 17500000,
      dueDate: '2025-01-10',
      status: 'pending'
    },
    {
      id: 2,
      project: 'Tính toán kết cấu thép',
      freelancer: 'Trần Thị B',
      amount: 10000000,
      dueDate: '2025-01-15',
      status: 'paid'
    },
    {
      id: 3,
      project: 'Thiết kế hệ thống băng tải',
      freelancer: 'Lê Văn C',
      amount: 12500000,
      dueDate: '2025-01-20',
      status: 'pending'
    }
  ];

  return (
    <div className="bg-card border border-border rounded-lg shadow-elevation-1">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-2">
          <Icon name="CreditCard" size={20} className="text-success" />
          <h3 className="text-lg font-semibold text-foreground">Quản lý thanh toán</h3>
        </div>
        <Button variant="ghost" size="sm" iconName="Plus">
          Thêm
        </Button>
      </div>
      
      <div className="p-4 space-y-3">
        {payments.map((payment) => (
          <div key={payment.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
            <div>
              <p className="text-sm font-medium text-foreground">{payment.project}</p>
              <p className="text-xs text-muted-foreground">Freelancer: {payment.freelancer}</p>
              <p className="text-xs text-muted-foreground">Hạn: {payment.dueDate}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-foreground">
                {payment.amount.toLocaleString('vi-VN')} VNĐ
              </p>
              <div className="flex items-center space-x-2 mt-1">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  payment.status === 'paid' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
                }`}>
                  {payment.status === 'paid' ? 'Đã thanh toán' : 'Chờ thanh toán'}
                </span>
                {payment.status === 'pending' && (
                  <Button variant="outline" size="sm">
                    Thanh toán
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentManagement;
