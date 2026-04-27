import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Welcome from './pages/Welcome';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import ResetPassword from './pages/ResetPassword.jsx';
import Profile from './pages/Profile.jsx';
import NewMed from './pages/NewMed.jsx';
import Medications from './pages/Medications.jsx';
import EditMed from './pages/EditMed.jsx';
import Appointments from './pages/Appointments.jsx';
import NewApt from './pages/NewAppointment.jsx';
import EditApt from './pages/EditAppointment.jsx';
import PrivateRoute from './components/PrivateRoute';
import PublicRoute from './components/PublicRoute';
import './i18n.js';


const App = () => {
  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Navigate to="/welcome" replace />} />
        
        <Route path="/welcome" element={<Welcome />} />

        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        <Route
          path="/home"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />

        <Route
          path="/reset-password"
          element={
            <PrivateRoute>
              <ResetPassword />
            </PrivateRoute>
          }
        />

        <Route
          path="/medications/add"
          element={
            <PrivateRoute>
              <NewMed />
            </PrivateRoute>
          }
        />

        <Route
          path="/medications/current"
          element={
            <PrivateRoute>
              <Medications />
            </PrivateRoute>
          }
        />

        <Route
          path="/medications/edit/:id"
          element={
            <PrivateRoute>
              <EditMed />
            </PrivateRoute>
          }
        />

        <Route
          path="/appointments/current"
          element={
            <PrivateRoute>
              <Appointments />
            </PrivateRoute>
          }
        />

        <Route
          path="/appointments/add"
          element={
            <PrivateRoute>
              <NewApt />
            </PrivateRoute>
          }
        />


        <Route
          path="/appointments/edit/:id"
          element={
            <PrivateRoute>
              <EditApt />
            </PrivateRoute>
          }
        />

        <Route path="*" element={<Navigate to="/welcome" replace />} />
      </Routes>
    </>
  );
};

export default App;
