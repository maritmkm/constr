import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Home } from '../pages/Home';
import { ProjectsPage } from '../pages/ProjectsPage';
import { ProjectDetailPage } from '../pages/ProjectDetailPage';
import { ServicesPage } from '../pages/ServicesPage';
import { AboutPage } from '../pages/AboutPage';
import { ContactPage } from '../pages/ContactPage';
import { Login } from '../pages/Login';
import { EmployeeRegister } from '../pages/EmployeeRegister';
import { ProtectedRoute } from '../components/layout/ProtectedRoute';
import { AdminLayout } from '../components/layout/AdminLayout';
import { Dashboard } from '../pages/Dashboard';
import { Companies } from '../pages/Companies';
import { CompanyDetail } from '../pages/CompanyDetail';
import { Employees } from '../pages/Employees';
import { OngoingWorks } from '../pages/OngoingWorks';
import { JobTypes } from '../pages/JobTypes';
import { Locations } from '../pages/Locations';
import { NotFound } from '../pages/NotFound';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Portfolio Website Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/projects" element={<ProjectsPage />} />
      <Route path="/projects/:slug" element={<ProjectDetailPage />} />
      <Route path="/services" element={<ServicesPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />

      {/* Public Auth & Registration Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<EmployeeRegister />} />
      <Route path="/employee-register" element={<EmployeeRegister />} />

      {/* Protected Admin Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/companies" element={<Companies />} />
          <Route path="/companies/:id" element={<CompanyDetail />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/ongoing-works" element={<OngoingWorks />} />
          <Route path="/job-types" element={<JobTypes />} />
          <Route path="/locations" element={<Locations />} />
        </Route>
      </Route>

      {/* 404 Fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
