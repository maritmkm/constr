import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '../components/layout/ProtectedRoute';
import { AdminLayout } from '../components/layout/AdminLayout';
import { Login } from '../pages/Login';
import { EmployeeRegister } from '../pages/EmployeeRegister';
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
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<EmployeeRegister />} />
      <Route path="/employee-register" element={<EmployeeRegister />} />

      {/* Protected Admin Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/companies" element={<Companies />} />
          <Route path="/companies/:id" element={<CompanyDetail />} />

          <Route path="/employees" element={<Employees />} />

          <Route path="/ongoing-works" element={<OngoingWorks />} />

          <Route path="/job-types" element={<JobTypes />} />
          <Route path="/locations" element={<Locations />} />

          <Route path="*" element={<NotFound />} />
        </Route>
      </Route>
    </Routes>
  );
};
