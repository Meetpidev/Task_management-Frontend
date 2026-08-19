import { Routes, Route } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProjectsList from './pages/ProjectsList';
import ProjectDetail from './pages/ProjectDetail';
import TaskDetail from './pages/TaskDetail';
import AdminUsers from './pages/AdminUsers';

function App() {
  const { user } = useAuth();

  return (
    <>
      {user && <Navbar />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/projects" element={<ProtectedRoute><ProjectsList /></ProtectedRoute>} />
        <Route path="/projects/:id" element={<ProtectedRoute><ProjectDetail /></ProtectedRoute>} />
        <Route path="/tasks/:id" element={<ProtectedRoute><TaskDetail /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute><AdminUsers /></ProtectedRoute>} />
      </Routes>
    </>
  );
}

export default App;
