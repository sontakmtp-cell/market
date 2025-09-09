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
import AuthGuard from './guards/AuthGuard';
import SimpleProfileManage from './pages/profile-manage/simple';
import AuthTest from './components/AuthTest';

// Test component to check Supabase
const TestComponent = () => {
  console.log('TestComponent rendering...');
  
  // First test without Supabase
  return (
    <div style={{color: 'black', fontSize: '18px', padding: '20px', backgroundColor: 'white', fontFamily: 'Arial', minHeight: '100vh'}}>
      <h1>Basic Test Component</h1>
      <p>This is working without Supabase!</p>
      <p>Check console for logs.</p>
    </div>
  );
};

const Routes = () => {
  console.log('Routes component rendering...');
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<Navigate to="/homepage" replace />} />
        <Route path="/job-marketplace" element={<JobMarketplace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/job-details" element={<JobDetails />} />
        <Route path="/job-post" element={
          <AuthGuard>
            <JobPost />
          </AuthGuard>
        } />
        <Route path="/freelancer-dashboard" element={
          <AuthGuard>
            <FreelancerDashboard />
          </AuthGuard>
        } />
        <Route path="/register" element={<Register />} />
        <Route path="/homepage" element={<Homepage />} />
        <Route path="/employer-job-posting" element={
          <AuthGuard>
            <EmployerJobPosting />
          </AuthGuard>
        } />
        <Route path="/cv-submission-portal" element={
          <AuthGuard>
            <CvSubmissionPortal />
          </AuthGuard>
        } />
        <Route path="/recruitment-management-dashboard" element={
          <AuthGuard>
            <RecruitmentManagementDashboard />
          </AuthGuard>
        } />
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
        <Route path="/auth-test" element={<AuthTest />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
