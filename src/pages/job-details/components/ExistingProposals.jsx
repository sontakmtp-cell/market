import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import ConfirmModal from '../../../components/ui/ConfirmModal';
import { useAuth } from '../../../hooks/useAuth';
import { useSupabase } from '../../../contexts/SupabaseContext';

const ExistingProposals = ({ proposals = [], onProposalDeleted, onShowNotification }) => {
  const [sortBy, setSortBy] = useState('recent');
  const [showAll, setShowAll] = useState(false);
  const [deletingProposalId, setDeletingProposalId] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [proposalToDelete, setProposalToDelete] = useState(null);
  const { user } = useAuth();
  const { supabase } = useSupabase();

  const sortOptions = [
    { value: 'recent', label: 'Mới nhất' },
    { value: 'price-low', label: 'Giá thấp nhất' },
    { value: 'price-high', label: 'Giá cao nhất' },
    { value: 'rating', label: 'Đánh giá cao nhất' }
  ];

  const sortedProposals = [...proposals]?.sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a?.bidAmount - b?.bidAmount;
      case 'price-high':
        return b?.bidAmount - a?.bidAmount;
      case 'rating':
        return b?.freelancer?.rating - a?.freelancer?.rating;
      default:
        return new Date(b.submittedAt) - new Date(a.submittedAt);
    }
  });

  const displayedProposals = showAll ? sortedProposals : sortedProposals?.slice(0, 5);

  const formatCurrency = (amount) => {
    return parseInt(amount)?.toLocaleString('vi-VN') + ' VNĐ';
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const submitted = new Date(date);
    const diffInHours = Math.floor((now - submitted) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Vừa xong';
    if (diffInHours < 24) return `${diffInHours} giờ trước`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} ngày trước`;
  };

  const handleDeleteProposal = async (proposalId) => {
    if (!supabase || !user) {
      if (onShowNotification) {
        onShowNotification('Lỗi hệ thống. Vui lòng thử lại sau!', 'error');
      }
      return;
    }

    // Show confirmation modal instead of window.confirm
    setProposalToDelete(proposalId);
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!proposalToDelete) return;

    setDeletingProposalId(proposalToDelete);
    setShowConfirmModal(false);

    try {
      // Delete proposal from Supabase
      const { error } = await supabase
        .from('proposals')
        .delete()
        .eq('id', proposalToDelete)
        .eq('freelancer_id', user.id); // Extra security check

      if (error) {
        console.error('Error deleting proposal:', error);
        if (onShowNotification) {
          onShowNotification('Có lỗi xảy ra khi xóa đề xuất. Vui lòng thử lại!', 'error');
        }
        return;
      }

      // Notify parent component to update the proposals list
      if (onProposalDeleted) {
        onProposalDeleted(proposalToDelete);
      }

      if (onShowNotification) {
        onShowNotification('Đề xuất đã được xóa thành công!', 'success');
      }
    } catch (error) {
      console.error('Unexpected error deleting proposal:', error);
      if (onShowNotification) {
        onShowNotification('Có lỗi không mong muốn xảy ra. Vui lòng thử lại!', 'error');
      }
    } finally {
      setDeletingProposalId(null);
      setProposalToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setShowConfirmModal(false);
    setProposalToDelete(null);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground">
            Đề xuất hiện tại ({proposals?.length})
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Xem các đề xuất từ freelancer khác
          </p>
        </div>
        
        {proposals?.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Sắp xếp:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e?.target?.value)}
              className="px-3 py-1 border border-border rounded-md bg-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {sortOptions?.map(option => (
                <option key={option?.value} value={option?.value}>
                  {option?.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {proposals?.length === 0 ? (
        <div className="text-center py-12">
          <Icon name="Users" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Chưa có đề xuất nào
          </h3>
          <p className="text-muted-foreground">
            Dự án này chưa nhận được đề xuất từ freelancer nào. Hãy chờ các freelancer gửi đề xuất cho bạn.
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {displayedProposals?.map((proposal) => {
              // Check if current user is the owner of this proposal
              const isProposalOwner = user && proposal?.freelancerId === user.id;
              
              return (
                <div key={proposal?.id} className="border border-border rounded-lg p-4 hover:bg-muted/20 transition-colors">
                  <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                    {/* Freelancer Info */}
                    <div className="flex items-start gap-3 flex-1">
                      <Image
                        src={proposal?.freelancer?.avatar}
                        alt={proposal?.freelancer?.name}
                        className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                      />
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-foreground">
                            {proposal?.freelancer?.name}
                          </h3>
                          {proposal?.freelancer?.isVerified && (
                            <Icon name="BadgeCheck" size={16} className="text-primary" />
                          )}
                          {isProposalOwner && (
                            <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-medium">
                              Đề xuất của bạn
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-4 mb-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            {[...Array(5)]?.map((_, i) => (
                              <Icon
                                key={i}
                                name="Star"
                                size={12}
                                className={i < Math.floor(proposal?.freelancer?.rating) ? 'text-warning fill-current' : 'text-muted-foreground'}
                              />
                            ))}
                            <span className="ml-1">
                              {proposal?.freelancer?.rating} ({proposal?.freelancer?.reviewCount})
                            </span>
                          </div>
                          <span>{proposal?.freelancer?.completedJobs} dự án hoàn thành</span>
                        </div>
                        
                        <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                          {proposal?.coverLetter}
                        </p>
                        
                        {proposal?.portfolioSamples?.length > 0 && (
                          <div className="flex items-center gap-2 mb-2">
                            <Icon name="Paperclip" size={14} className="text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              {proposal?.portfolioSamples?.length} file đính kèm
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Proposal Details */}
                    <div className="lg:w-64 space-y-3">
                      <div className="text-right">
                        <div className="text-lg font-semibold text-foreground">
                          {formatCurrency(proposal?.bidAmount)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          trong {proposal?.timeline}
                        </div>
                      </div>
                      
                      <div className="text-right text-xs text-muted-foreground">
                        Gửi {getTimeAgo(proposal?.submittedAt)}
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        <Button variant="outline" size="sm" fullWidth>
                          Xem chi tiết
                        </Button>
                        <Button variant="ghost" size="sm" fullWidth iconName="MessageSquare" iconPosition="left">
                          Nhắn tin
                        </Button>
                        {isProposalOwner && (
                          <Button 
                            variant="destructive" 
                            size="sm" 
                            fullWidth 
                            iconName="Trash2" 
                            iconPosition="left"
                            onClick={() => handleDeleteProposal(proposal?.id)}
                            disabled={deletingProposalId === proposal?.id}
                          >
                            {deletingProposalId === proposal?.id ? 'Đang xóa...' : 'Xóa đề xuất'}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Skills */}
                  {proposal?.freelancer?.skills?.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-border">
                      <div className="flex flex-wrap gap-2">
                        {proposal?.freelancer?.skills?.slice(0, 5)?.map((skill, index) => (
                          <span
                            key={index}
                            className="bg-primary/10 text-primary px-2 py-1 rounded text-xs"
                          >
                            {skill}
                          </span>
                        ))}
                        {proposal?.freelancer?.skills?.length > 5 && (
                          <span className="text-xs text-muted-foreground px-2 py-1">
                            +{proposal?.freelancer?.skills?.length - 5} khác
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          {proposals?.length > 5 && (
            <div className="mt-6 text-center">
              <Button
                variant="outline"
                onClick={() => setShowAll(!showAll)}
                iconName={showAll ? "ChevronUp" : "ChevronDown"}
                iconPosition="right"
              >
                {showAll ? 'Thu gọn' : `Xem thêm ${proposals?.length - 5} đề xuất`}
              </Button>
            </div>
          )}
        </>
      )}

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Xác nhận xóa đề xuất"
        message="Bạn có chắc chắn muốn xóa đề xuất này? Hành động này không thể hoàn tác và bạn sẽ mất tất cả thông tin đã nhập."
        confirmText="Xóa đề xuất"
        cancelText="Hủy bỏ"
        type="danger"
        isLoading={deletingProposalId === proposalToDelete}
      />
    </div>
  );
};

export default ExistingProposals;