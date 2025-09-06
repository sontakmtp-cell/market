import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import JobMarketplace from './pages/job-marketplace';
import LoginPage from './pages/login';
import JobDetails from './pages/job-details';
import FreelancerDashboard from './pages/freelancer-dashboard';
import Register from './pages/register';
import Homepage from './pages/homepage';
import EmployerJobPosting from './pages/employer-job-posting';
import CvSubmissionPortal from './pages/cv-submission-portal';
import RecruitmentManagementDashboard from './pages/recruitment-management-dashboard';
import RecruitmentPortal from './pages/recruitment-portal';

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
        <Route path="/freelancer-dashboard" element={<FreelancerDashboard />} />
        <Route path="/register" element={<Register />} />
        <Route path="/homepage" element={<Homepage />} />
        <Route path="/employer-job-posting" element={<EmployerJobPosting />} />
        <Route path="/cv-submission-portal" element={<CvSubmissionPortal />} />
        <Route path="/recruitment" element={<RecruitmentPortal />} />
        <Route path="/recruitment-management-dashboard" element={<RecruitmentManagementDashboard />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
