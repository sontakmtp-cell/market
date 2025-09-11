import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import ConfirmModal from '../../../components/ui/ConfirmModal';
import { useAuth } from '../../../hooks/useAuth';
import { useSupabase } from '../../../contexts/SupabaseContext';
import { saveJob, unsaveJob, checkIfJobSaved } from '../../../services/jobService';

const ProjectHeader = ({ project, onShowNotification, onProjectDeleted }) => {
  const { isAuthenticated } = useAuth();
  const { user, supabase } = useSupabase();
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Check if current user is the project owner
  const isOwner = isAuthenticated && user && project?.client_user_id === user.id;

  // Check if job is saved when component mounts or user changes
  useEffect(() => {
    const checkSavedStatus = async () => {
      if (user?.id && project?.id) {
        try {
          const saved = await checkIfJobSaved(user.id, project.id);
          setIsSaved(saved);
        } catch (error) {
          console.error('Error checking if job is saved:', error);
        }
      }
    };

    checkSavedStatus();
  }, [user?.id, project?.id]);
  
  const handleEditProject = async () => {
    if (!project?.id || !supabase) {
      navigate(`/job-post/edit/${project?.id}`);
      return;
    }

    try {
      // Only block editing when there is an accepted proposal
      const { count: acceptedCount } = await supabase
        .from('proposals')
        .select('id', { count: 'exact', head: true })
        .eq('project_id', project.id)
        .eq('status', 'accepted');

      if ((acceptedCount || 0) > 0) {
        if (onShowNotification) {
          onShowNotification('Bài đăng đã có đề xuất được chấp nhận. Không thể chỉnh sửa.', 'warning');
        }
        return;
      }

      navigate(`/job-post/edit/${project?.id}`);
    } catch (err) {
      console.warn('Edit guard check failed:', err);
      navigate(`/job-post/edit/${project?.id}`);
    }
  };

  const handleDeleteProject = async () => {
    if (!supabase || !user || !project?.id) {
      if (onShowNotification) {
        onShowNotification('Lỗi hệ thống. Vui lòng thử lại sau!', 'error');
      }
      return;
    }

    setIsDeleting(true);
    try {
      // Guard: prevent deletion only if project has an accepted proposal
      try {
        const { count: acceptedCount } = await supabase
          .from('proposals')
          .select('id', { count: 'exact', head: true })
          .eq('project_id', project.id)
          .eq('status', 'accepted');
        if ((acceptedCount || 0) > 0) {
          if (onShowNotification) {
            onShowNotification('Bài đăng đã có đề xuất được chấp nhận. Vui lòng hủy hợp đồng trước khi xóa.', 'warning');
          }
          return;
        }
      } catch (_) {
        // Ignore guard errors; RLS will still protect on server
      }

      // Delete project from Supabase (correct table)
      const { error } = await supabase
        .from('marketplace_projects')
        .delete()
        .eq('id', project.id)
        .eq('client_user_id', user.id); // Extra security check

      if (error) {
        console.error('Error deleting project:', error);
        if (onShowNotification) {
          onShowNotification('Có lỗi xảy ra khi xóa dự án. Vui lòng thử lại!', 'error');
        }
        return;
      }

      if (onShowNotification) {
        onShowNotification('Dự án đã được xóa thành công!', 'success');
      }

      // Notify parent component
      if (onProjectDeleted) {
        onProjectDeleted(project.id);
      }

      // Redirect to job marketplace after a short delay
      setTimeout(() => {
        navigate('/job-marketplace');
      }, 1500);
    } catch (error) {
      console.error('Unexpected error deleting project:', error);
      if (onShowNotification) {
        onShowNotification('Có lỗi không mong muốn xảy ra. Vui lòng thử lại!', 'error');
      }
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handleSaveJob = async () => {
    if (!isAuthenticated) {
      // Redirect to login or show login prompt
      return;
    }

    if (!user?.id || !project?.id) {
      return;
    }

    setIsSaving(true);
    try {
      if (isSaved) {
        await unsaveJob(user.id, project.id);
        setIsSaved(false);
        if (onShowNotification) {
          onShowNotification('Đã bỏ lưu công việc!', 'success');
        }
      } else {
        await saveJob(user.id, project.id);
        setIsSaved(true);
        if (onShowNotification) {
          onShowNotification('Đã lưu công việc!', 'success');
        }
      }
    } catch (error) {
      console.error('Error saving/unsaving job:', error);
      if (onShowNotification) {
        onShowNotification(
          error.message === 'Job is already saved' 
            ? 'Công việc đã được lưu trước đó!' 
            : 'Có lỗi xảy ra, vui lòng thử lại!', 
          'error'
        );
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="Briefcase" size={24} color="white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{project?.title}</h1>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                <span className="flex items-center gap-1">
                  <Icon name="MapPin" size={14} />
                  {project?.location}
                </span>
                <span className="flex items-center gap-1">
                  <Icon name="Clock" size={14} />
                  Đăng {project?.postedTime}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <div className="bg-success/10 text-success px-3 py-1 rounded-full text-sm font-medium">
              {project?.budget}
            </div>
            <div className="bg-accent/10 text-accent px-3 py-1 rounded-full text-sm font-medium">
              {project?.duration}
            </div>
            <div className="bg-warning/10 text-warning px-3 py-1 rounded-full text-sm font-medium">
              {project?.proposals} đề xuất
            </div>
          </div>
          
          <p className="text-muted-foreground leading-relaxed">
            {project?.shortDescription}
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row lg:flex-col gap-3">
          {isOwner && (
            <>
              <Button
                onClick={handleEditProject}
                iconName="Edit"
                iconPosition="left"
                className="bg-primary text-white hover:bg-primary/90"
              >
                Chỉnh sửa dự án
              </Button>
              <Button
                variant="destructive"
                onClick={() => setShowDeleteModal(true)}
                iconName="Trash2"
                iconPosition="left"
                disabled={isDeleting}
              >
                {isDeleting ? 'Đang xóa...' : 'Xóa dự án'}
              </Button>
            </>
          )}
          {!isOwner && (
            <Button
              variant={isSaved ? "default" : "outline"}
              onClick={handleSaveJob}
              iconName="Heart"
              iconPosition="left"
              className={isSaved ? "text-error border-error" : ""}
              disabled={!isAuthenticated || isSaving}
              title={!isAuthenticated ? "Đăng nhập để lưu công việc" : isSaved ? "Bỏ lưu công việc" : "Lưu công việc"}
            >
              {isSaving ? "..." : (isAuthenticated ? (isSaved ? "Đã lưu" : "Lưu công việc") : "Đăng nhập để lưu")}
            </Button>
          )}
          <Button
            variant="ghost"
            iconName="Share2"
            iconPosition="left"
          >
            Chia sẻ
          </Button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteProject}
        title="Xác nhận xóa dự án"
        message="Bạn có chắc chắn muốn xóa dự án này? Hành động này không thể hoàn tác và sẽ xóa tất cả các đề xuất liên quan."
        confirmText="Xóa dự án"
        cancelText="Hủy bỏ"
        type="danger"
        isLoading={isDeleting}
      />
    </div>
  );
};

export default ProjectHeader;
