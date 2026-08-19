import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';

const AdminUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/users/admin')
      .then((res) => setUsers(res.data.data))
      .catch((err) => toast.error(err.response?.data?.message || 'Failed to load users'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-5 sm:px-6">
      <button onClick={() => navigate(-1)} className="text-sm text-gray-600 hover:text-primary-600 mb-2">
        Back
      </button>
      <h1 className="text-2xl font-bold mb-6">Admin</h1>

      {loading ? (
        <p>Loading users...</p>
      ) : (
        <div className="space-y-4">
          {users.map((user) => (
            <section key={user._id} className="bg-white border rounded-[.3rem] p-4 sm:p-5">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-4">
                <div className="min-w-0">
                  <h2 className="font-semibold text-lg break-words">{user.name}</h2>
                  <p className="text-sm text-gray-500 break-words">{user.email}</p>
                </div>
                <span className="w-fit text-xs bg-gray-100 px-2 py-1 rounded-[.3rem]">{user.role}</span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium mb-2">Projects</h3>
                  <div className="space-y-2">
                    {user.projects.length === 0 && <p className="text-sm text-gray-500">No projects</p>}
                    {user.projects.map((project) => (
                      <Link
                        key={project._id}
                        to={`/projects/${project._id}`}
                        className="block border rounded-md p-3 hover:bg-gray-50"
                      >
                        <p className="text-sm font-medium break-words">{project.name}</p>
                        <p className="text-xs text-gray-500">{project.status}</p>
                      </Link>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Tasks</h3>
                  <div className="space-y-2">
                    {user.tasks.length === 0 && <p className="text-sm text-gray-500">No tasks</p>}
                    {user.tasks.map((task) => (
                      <Link
                        key={task._id}
                        to={`/tasks/${task._id}`}
                        className="block border rounded-md p-3 hover:bg-gray-50"
                      >
                        <p className="text-sm font-medium break-words">{task.title}</p>
                        <p className="text-xs text-gray-500">
                          {task.project?.name || 'No project'} - {task.status} - {task.assignee?.name || 'Unassigned'}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
