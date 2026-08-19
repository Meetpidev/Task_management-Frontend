import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import TaskCard from '../components/TaskCard';
import FilterBar from '../components/FilterBar';
import Pagination from '../components/Pagination';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const STATUS_COLUMNS = ['todo', 'in-progress', 'review', 'done'];

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(1);
  const [view, setView] = useState('board'); // board | list
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [projectForm, setProjectForm] = useState({ name: '', description: '', status: 'active' });
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    title: '',
    description: '',
    assignee: '',
    status: 'todo',
    priority: 'medium',
    dueDate: '',
    estimatedHours: '',
  });

  const fetchProject = useCallback(async () => {
    try {
      const res = await api.get(`/projects/${id}`);
      setProject(res.data.data);
      setProjectForm({
        name: res.data.data.name || '',
        description: res.data.data.description || '',
        status: res.data.data.status || 'active',
      });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load project');
      navigate('/projects');
    }
  }, [id, navigate]);

  const fetchTasks = useCallback(async () => {
    const params = { ...filters, page };
    const res = await api.get(`/projects/${id}/tasks`, { params });
    setTasks(res.data.data);
    setPagination(res.data.pagination);
  }, [id, filters, page]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  useEffect(() => {
    api.get('/users').then((res) => setUsers(res.data.data)).catch(() => {});
  }, []);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (
      !form.title.trim() ||
      !form.description.trim() ||
      !form.assignee ||
      !form.status ||
      !form.priority ||
      !form.dueDate ||
      form.estimatedHours === ''
    ) {
      toast.error('Please fill all task fields');
      return;
    }
    try {
      await api.post(`/projects/${id}/tasks`, {
        ...form,
        title: form.title.trim(),
        description: form.description.trim(),
        estimatedHours: Number(form.estimatedHours),
      });
      toast.success('Task created');
      setShowModal(false);
      setForm({
        title: '',
        description: '',
        assignee: '',
        status: 'todo',
        priority: 'medium',
        dueDate: '',
        estimatedHours: '',
      });
      fetchProject();
      fetchTasks();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create task');
    }
  };

  const handleUpdateProject = async (e) => {
    e.preventDefault();
    if (!projectForm.name.trim() || projectForm.description.trim().length < 10) {
      toast.error('Project name and 10 character description are required');
      return;
    }
    try {
      await api.put(`/projects/${id}`, {
        name: projectForm.name.trim(),
        description: projectForm.description.trim(),
        status: projectForm.status,
      });
      toast.success('Project updated');
      setShowEditModal(false);
      fetchProject();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update project');
    }
  };

  const handleDeleteProject = async () => {
    if (!confirm('Delete this project and all its tasks?')) return;
    try {
      await api.delete(`/projects/${id}`);
      toast.success('Project deleted');
      navigate('/projects');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete project');
    }
  };

  if (!project) return <div className="px-4 py-5 sm:px-6">Loading...</div>;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-5 sm:px-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-start mb-2">
        <div className="min-w-0">
          <button onClick={() => navigate(-1)} className="text-sm text-gray-600 hover:text-primary-600 mb-2">
            Back
          </button>
          <h1 className="text-2xl font-bold break-words">{project.name}</h1>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            onClick={() => setView(view === 'board' ? 'list' : 'board')}
            className="w-full sm:w-auto text-sm border px-3 py-1.5 rounded-md"
          >
            {view === 'board' ? 'List View' : 'Board View'}
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="w-full sm:w-auto bg-primary-600 text-white px-4 py-1.5 rounded-md text-sm hover:bg-primary-700"
          >
            + Add Task
          </button>
          <button
            onClick={() => setShowEditModal(true)}
            className="w-full sm:w-auto text-sm border px-3 py-1.5 rounded-md"
          >
            Edit
          </button>
          {isAdmin && (
            <button
              onClick={handleDeleteProject}
              className="w-full sm:w-auto text-sm text-red-600 border border-red-200 px-3 py-1.5 rounded-md"
            >
              Delete
            </button>
          )}
        </div>
      </div>
      <p className="text-gray-500 mb-4">{project.description}</p>

      <FilterBar filters={filters} onChange={setFilters} members={project.members} />

      {view === 'board' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {STATUS_COLUMNS.map((status) => (
            <div key={status} className="bg-gray-100 rounded-[.3rem] p-3">
              <h3 className="text-sm font-semibold uppercase text-gray-500 mb-3">
                {status} ({tasks.filter((t) => t.status === status).length})
              </h3>
              <div className="space-y-2">
                {tasks
                  .filter((t) => t.status === status)
                  .map((t) => (
                    <TaskCard key={t._id} task={t} onClick={() => navigate(`/tasks/${t._id}`)} />
                  ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {tasks.map((t) => (
            <TaskCard key={t._id} task={t} onClick={() => navigate(`/tasks/${t._id}`)} />
          ))}
        </div>
      )}

      <Pagination pagination={pagination} onPageChange={setPage} />

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <form onSubmit={handleCreateTask} className="bg-white p-5 sm:p-6 rounded-[.3rem] w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">Add Task</h2>
            <input
              type="text"
              placeholder="Task title"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full border rounded-md px-3 py-2 mb-3 text-sm"
            />
            <textarea
              placeholder="Description"
              required
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full border rounded-md px-3 py-2 mb-3 text-sm"
              rows={3}
            />
            <select
              required
              value={form.assignee}
              onChange={(e) => setForm({ ...form, assignee: e.target.value })}
              className="w-full border rounded-md px-3 py-2 mb-3 text-sm"
            >
              <option value="">Assign to</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
              <select
                required
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="border rounded-md px-3 py-2 text-sm w-full"
              >
                <option value="todo">Todo</option>
                <option value="in-progress">In Progress</option>
                <option value="review">Review</option>
                <option value="done">Done</option>
              </select>
              <select
                required
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
                className="border rounded-md px-3 py-2 text-sm w-full"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
              <input
                type="date"
                required
                value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                className="border rounded-md px-3 py-2 text-sm w-full"
              />
              <input
                type="number"
                min="0"
                step="0.25"
                required
                placeholder="Estimated hours"
                value={form.estimatedHours}
                onChange={(e) => setForm({ ...form, estimatedHours: e.target.value })}
                className="border rounded-md px-3 py-2 text-sm w-full"
              />
            </div>
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button type="button" onClick={() => setShowModal(false)} className="w-full sm:w-auto px-4 py-2 text-sm rounded-md border">
                Cancel
              </button>
              <button type="submit" className="w-full sm:w-auto px-4 py-2 text-sm rounded-md bg-primary-600 text-white hover:bg-primary-700">
                Create
              </button>
            </div>
          </form>
        </div>
      )}

      {showEditModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <form onSubmit={handleUpdateProject} className="bg-white p-5 sm:p-6 rounded-[.3rem] w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">Edit Project</h2>
            <input
              type="text"
              placeholder="Project name"
              required
              value={projectForm.name}
              onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
              className="w-full border rounded-md px-3 py-2 mb-3 text-sm"
            />
            <textarea
              placeholder="Description"
              required
              minLength={10}
              value={projectForm.description}
              onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
              className="w-full border rounded-md px-3 py-2 mb-3 text-sm"
              rows={3}
            />
            <select
              value={projectForm.status}
              onChange={(e) => setProjectForm({ ...projectForm, status: e.target.value })}
              className="w-full border rounded-md px-3 py-2 mb-4 text-sm"
            >
              <option value="active">Active</option>
              <option value="archived">Archived</option>
            </select>
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button type="button" onClick={() => setShowEditModal(false)} className="w-full sm:w-auto px-4 py-2 text-sm rounded-md border">
                Cancel
              </button>
              <button type="submit" className="w-full sm:w-auto px-4 py-2 text-sm rounded-md bg-primary-600 text-white hover:bg-primary-700">
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ProjectDetail;
