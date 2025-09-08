import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import JobMarketplace from './pages/job-marketplace';
import LoginPage from './pages/login';
import JobDetails from './pages/job-details';
import JobPost from './pages/job-post';
import FreelancerDashboard from './pages/freelancer-dashboard';
import Register from './pages/register';
import Homepage from './pages/homepage';
import EmployerJobPosting from './pages/employer-job-posting';
import CvSubmissionPortal from './pages/cv-submission-portal';
import RecruitmentManagementDashboard from './pages/recruitment-management-dashboard';
import RecruitmentJobBoard from './pages/recruitment-job-board';
import PublicProfile from './pages/profile-public';
import ProfileManage from './pages/profile-manage';
import ProfileManageGuard from './guards/ProfileManageGuard';
import SimpleProfileManage from './pages/profile-manage/simple';
import DebugPage from './pages/debug';

const Routes = () => {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<FreelancerDashboard />} />
        <Route path="/job-marketplace" element={<JobMarketplace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/job-details" element={<JobDetails />} />
        <Route path="/job-post" element={<JobPost />} />
        <Route path="/freelancer-dashboard" element={<FreelancerDashboard />} />
        <Route path="/register" element={<Register />} />
        <Route path="/homepage" element={<Homepage />} />
        <Route path="/employer-job-posting" element={<EmployerJobPosting />} />
        <Route path="/cv-submission-portal" element={<CvSubmissionPortal />} />
        <Route path="/recruitment-management-dashboard" element={<RecruitmentManagementDashboard />} />
        <Route path="/recruitment-job-board" element={<RecruitmentJobBoard />} />
        {/* Profile routes */}
        <Route path="/profile" element={<Navigate to="/profile/manage" replace />} />
        <Route path="/profile/user" element={<PublicProfile />} />
        <Route path="/profile/manage" element={
          <ProfileManageGuard>
            <ProfileManage />
          </ProfileManageGuard>
        } />
        <Route path="/profile/manage/full" element={
          <ProfileManageGuard>
            <ProfileManage />
          </ProfileManageGuard>
        } />
        <Route path="/profile/:username" element={<PublicProfile />} />
        <Route path="/debug" element={<DebugPage />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
