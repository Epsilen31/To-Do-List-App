import { Navigate, Route, Routes } from 'react-router-dom';
import { hasCompletedOnboarding } from './utils/onboarding';
import OnboardingPage from './pages/OnboardingPage';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import WeeksPage from './pages/WeeksPage';

function RequireOnboarding({ children }) {
  if (!hasCompletedOnboarding()) {
    return <Navigate to="/onboarding" replace />;
  }
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/onboarding" element={<OnboardingPage />} />
      <Route
        path="/"
        element={
          <RequireOnboarding>
            <HomePage />
          </RequireOnboarding>
        }
      />
      <Route
        path="/search"
        element={
          <RequireOnboarding>
            <SearchPage />
          </RequireOnboarding>
        }
      />
      <Route
        path="/weeks"
        element={
          <RequireOnboarding>
            <WeeksPage />
          </RequireOnboarding>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
