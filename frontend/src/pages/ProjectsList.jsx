import { useEffect, useState } from 'react';
import api from '../api/axios';
import ProjectCard from '../components/ProjectCard';
import toast from 'react-hot-toast';

const ProjectsList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', description: '' });

  const fetchProjects = async () => {
    const res = await api.get('/projects');
    setProjects(res.data.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (form.description.trim().length < 10) {
      toast.error('Project description must be at least 10 characters long');
      return;
    }
    try {
      await api.post('/projects', {
        name: form.name.trim(),
        description: form.description.trim(),
      });
      toast.success('Project created');
      setShowModal(false);
      setForm({ name: '', description: '' });
      fetchProjects();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create project');
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-5 sm:px-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center mb-6">
        <h1 className="text-2xl font-bold">Projects</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-primary-600 text-white px-4 py-2 rounded-md text-sm hover:bg-primary-700"
        >
          + New Project
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : projects.length === 0 ? (
        <p className="text-gray-500">No projects yet. Create your first one!</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((p) => (
            <ProjectCard key={p._id} project={p} />
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <form onSubmit={handleCreate} className="bg-white p-5 sm:p-6 rounded-[.3rem] w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">Create Project</h2>
            <input
              type="text"
              placeholder="Project name"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border rounded-md px-3 py-2 mb-3 text-sm"
            />
            <textarea
              placeholder="Description"
              required
              minLength={10}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full border rounded-md px-3 py-2 mb-4 text-sm"
              rows={3}
            />
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="w-full sm:w-auto px-4 py-2 text-sm rounded-md border"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-full sm:w-auto px-4 py-2 text-sm rounded-md bg-primary-600 text-white hover:bg-primary-700"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ProjectsList;
