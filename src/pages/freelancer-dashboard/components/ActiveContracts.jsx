import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import { useAuth } from '../../../hooks/useAuth';
import { contractService } from '../../../services/contractService';
import useNotification from '../../../hooks/useNotification';

const ActiveContracts = ({ userRole = 'freelancer' }) => {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingProgress, setUpdatingProgress] = useState({});
  const { user } = useAuth();
  const { showNotification } = useNotification();

  useEffect(() => {
    if (user?.id && userRole) {
      fetchContracts();
    } else {
      setContracts([]);
      setLoading(false);
    }
  }, [user?.id, userRole]);

  // Add a separate effect to clear contracts when role changes
  useEffect(() => {
    setContracts([]);
    if (user?.id && userRole) {
      fetchContracts();
    }
  }, [userRole]);

  // Listen for contract updates from other components
  useEffect(() => {
    const handleContractsUpdated = (event) => {
      // Force refresh contracts when external update occurs
      if (user?.id && userRole) {
        setTimeout(() => {
          fetchContracts(true);
        }, 500); // Small delay to ensure DB is updated
      }
    };

    window.addEventListener('contractsUpdated', handleContractsUpdated);
    
    return () => {
      window.removeEventListener('contractsUpdated', handleContractsUpdated);
    };
  }, [user?.id, userRole]);

  const fetchContracts = async (forceRefresh = false) => {
    try {
      setLoading(true);
      
      // Clear existing contracts if force refresh
      if (forceRefresh) {
        setContracts([]);
      }
      
      // Use the new getActiveContractsByRole method for proper role-based filtering
      const result = await contractService.getActiveContractsByRole(user.id, userRole);

      if (result.error) {
        console.error('Error fetching contracts:', result.error);
        showNotification('Có lỗi xảy ra khi tải dự án. Vui lòng thử lại!', 'error');
        setContracts([]);
        return;
      }

      setContracts(result.data || []);
    } catch (error) {
      console.error('Unexpected error fetching contracts:', error);
      showNotification('Có lỗi không mong muốn xảy ra!', 'error');
      setContracts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleProgressUpdate = async (contractId, newProgress) => {
    try {
      setUpdatingProgress(prev => ({ ...prev, [contractId]: true }));
      
      const result = await contractService.updateContractProgress(contractId, newProgress, user.id);
      
      if (result.error) {
        showNotification('Có lỗi xảy ra khi cập nhật tiến độ!', 'error');
        return;
      }

      // Update local state
      setContracts(prev => 
        prev.map(contract => 
          contract.id === contractId 
            ? { ...contract, progress: newProgress }
            : contract
        )
      );

      showNotification('Cập nhật tiến độ thành công!', 'success');
    } catch (error) {
      console.error('Error updating progress:', error);
      showNotification('Có lỗi không mong muốn xảy ra!', 'error');
    } finally {
      setUpdatingProgress(prev => ({ ...prev, [contractId]: false }));
    }
  };

  const handleCompleteContract = async (contractId) => {
    try {
      if (!window.confirm('Bạn có chắc chắn muốn đánh dấu dự án này là hoàn thành?')) {
        return;
      }

      setUpdatingProgress(prev => ({ ...prev, [contractId]: true }));
      
      const result = await contractService.completeContract(contractId, user.id);
      
      if (result.error) {
        showNotification('Có lỗi xảy ra khi hoàn thành dự án!', 'error');
        return;
      }

      // Remove from active contracts
      setContracts(prev => prev.filter(contract => contract.id !== contractId));
      showNotification('Dự án đã được đánh dấu hoàn thành!', 'success');
    } catch (error) {
      console.error('Error completing contract:', error);
      showNotification('Có lỗi không mong muốn xảy ra!', 'error');
    } finally {
      setUpdatingProgress(prev => ({ ...prev, [contractId]: false }));
    }
  };

  const formatCurrency = (amount) => {
    return parseInt(amount)?.toLocaleString('vi-VN') + ' VNĐ';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDaysUntilDeadline = (deadline) => {
    if (!deadline) return null;
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getProgressColor = (progress) => {
    if (progress >= 75) return 'text-success';
    if (progress >= 50) return 'text-warning';
    if (progress >= 25) return 'text-primary';
    return 'text-muted-foreground';
  };

  const getProgressBgColor = (progress) => {
    if (progress >= 75) return 'bg-success';
    if (progress >= 50) return 'bg-warning';
    if (progress >= 25) return 'bg-primary';
    return 'bg-muted-foreground';
  };

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-lg shadow-elevation-1">
        <div className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Icon name="Briefcase" size={20} className="text-primary" />
            <h2 className="text-xl font-semibold text-foreground">Dự án đang thực hiện</h2>
          </div>
          <div className="flex items-center justify-center py-12">
            <Icon name="Loader" size={32} className="text-primary animate-spin" />
            <span className="ml-3 text-muted-foreground">Đang tải...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg shadow-elevation-1">
      <div className="flex items-center justify-between p-6 border-b border-border">
        <div className="flex items-center space-x-2">
          <Icon name="Briefcase" size={20} className="text-primary" />
          <h2 className="text-xl font-semibold text-foreground">
            Dự án đang thực hiện ({contracts.length})
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => fetchContracts(true)}
            disabled={loading}
          >
            {loading ? 'Đang tải...' : 'Làm mới'}
          </Button>
          <Button variant="ghost" size="sm" iconName="MoreHorizontal">
            Xem tất cả
          </Button>
        </div>
      </div>

      <div className="p-6">
        {contracts.length === 0 ? (
          <div className="text-center py-12">
            <Icon name="Briefcase" size={48} className="text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Chưa có dự án nào đang thực hiện
            </h3>
            <p className="text-muted-foreground mb-4">
              {userRole === 'freelancer' 
                ? 'Bạn chưa có dự án nào đang thực hiện. Hãy tìm kiếm và ứng tuyển các dự án mới.'
                : 'Bạn chưa có dự án nào đang thực hiện. Hãy đăng dự án mới để tìm freelancer.'
              }
            </p>
            {userRole === 'freelancer' ? (
              <Link to="/job-marketplace">
                <Button variant="default" iconName="Search" iconPosition="left">
                  Tìm dự án mới
                </Button>
              </Link>
            ) : (
              <Link to="/job-post">
                <Button variant="default" iconName="Plus" iconPosition="left">
                  Đăng dự án mới
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {contracts.map((contract) => {
              const project = contract.marketplace_projects;
              const freelancerProfile = contract.profiles;
              const daysUntilDeadline = getDaysUntilDeadline(project?.deadline);
              const isUrgent = daysUntilDeadline !== null && daysUntilDeadline <= 3;

              return (
                <div key={contract.id} className="border border-border rounded-lg p-6 hover:bg-muted/20 transition-colors">
                  <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                    {/* Project Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-semibold text-foreground">
                              {project?.title}
                            </h3>
                            {project?.isUrgent && (
                              <span className="bg-destructive text-white px-2 py-1 rounded text-xs font-medium">
                                Khẩn cấp
                              </span>
                            )}
                            {isUrgent && (
                              <span className="bg-warning text-white px-2 py-1 rounded text-xs font-medium">
                                Sắp hết hạn
                              </span>
                            )}
                          </div>
                          
                          {userRole === 'client' && freelancerProfile && (
                            <div className="flex items-center gap-2 mb-2">
                              <Image
                                src={freelancerProfile.avatar_url}
                                alt={freelancerProfile.display_name}
                                className="w-6 h-6 rounded-full object-cover"
                              />
                              <span className="text-sm text-muted-foreground">
                                Freelancer: {freelancerProfile.display_name}
                              </span>
                            </div>
                          )}

                          {userRole === 'freelancer' && project?.client && (
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-sm text-muted-foreground">
                                Khách hàng: {project.client.companyName || project.client.name}
                              </span>
                            </div>
                          )}

                          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                            {project?.shortDescription || project?.fullDescription}
                          </p>

                          {/* Skills */}
                          {project?.skills?.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-3">
                              {project.skills.slice(0, 4).map((skill, index) => (
                                <span
                                  key={index}
                                  className="bg-primary/10 text-primary px-2 py-1 rounded text-xs"
                                >
                                  {skill}
                                </span>
                              ))}
                              {project.skills.length > 4 && (
                                <span className="text-xs text-muted-foreground px-2 py-1">
                                  +{project.skills.length - 4} khác
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-foreground">Tiến độ</span>
                          <span className={`text-sm font-semibold ${getProgressColor(contract.progress)}`}>
                            {contract.progress}%
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-300 ${getProgressBgColor(contract.progress)}`}
                            style={{ width: `${contract.progress}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-2">
                        <Link to={`/job-details/${project?.id}`}>
                          <Button variant="outline" size="sm" iconName="Eye" iconPosition="left">
                            Xem chi tiết
                          </Button>
                        </Link>
                        
                        <Button variant="ghost" size="sm" iconName="MessageSquare" iconPosition="left">
                          Nhắn tin
                        </Button>

                        {userRole === 'freelancer' && contract.progress < 100 && (
                          <>
                            <Button 
                              variant="default" 
                              size="sm" 
                              iconName="TrendingUp" 
                              iconPosition="left"
                              onClick={() => {
                                const newProgress = Math.min(contract.progress + 10, 100);
                                handleProgressUpdate(contract.id, newProgress);
                              }}
                              disabled={updatingProgress[contract.id]}
                            >
                              Cập nhật tiến độ
                            </Button>
                            
                            <Button 
                              variant="default" 
                              size="sm" 
                              iconName="CheckCircle" 
                              iconPosition="left"
                              onClick={() => handleCompleteContract(contract.id)}
                              disabled={updatingProgress[contract.id]}
                              className="bg-success hover:bg-success/90 text-white"
                            >
                              Hoàn thành
                            </Button>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Project Details Sidebar */}
                    <div className="lg:w-64 space-y-3">
                      <div className="text-right">
                        <div className="text-lg font-semibold text-foreground">
                          {formatCurrency(contract.budget_amount)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Ngân sách
                        </div>
                      </div>

                      {project?.deadline && (
                        <div className="text-right">
                          <div className={`text-sm font-medium ${isUrgent ? 'text-destructive' : 'text-foreground'}`}>
                            {formatDate(project.deadline)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {daysUntilDeadline !== null && (
                              daysUntilDeadline > 0 
                                ? `Còn ${daysUntilDeadline} ngày`
                                : daysUntilDeadline === 0 
                                  ? 'Hôm nay'
                                  : `Quá hạn ${Math.abs(daysUntilDeadline)} ngày`
                            )}
                          </div>
                        </div>
                      )}

                      <div className="text-right text-xs text-muted-foreground">
                        Bắt đầu: {formatDate(contract.start_date)}
                      </div>

                      <div className="text-right">
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-success/10 text-success">
                          <Icon name="Play" size={12} className="mr-1" />
                          Đang thực hiện
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActiveContracts;
