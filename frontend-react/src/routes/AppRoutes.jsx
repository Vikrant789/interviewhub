import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Jobs from "../pages/Jobs";

import Layout from "../components/Layout";
import ProtectedRoute from "../components/ProtectedRoute";
import InterviewCalendarPage from "../pages/InterviewCalendarPage";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/calendar"
        element={
          <ProtectedRoute>
            <Layout>
              <InterviewCalendarPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* <Route
        path="/interview"
        element={
          <ProtectedRoute>
            <Layout>
              <InterviewPage />
            </Layout>
          </ProtectedRoute>
        }
      /> */}

      <Route
        path="/jobs"
        element={
          <ProtectedRoute>
            <Layout>
              <Jobs />
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;