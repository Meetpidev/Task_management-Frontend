import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import TimeEntryForm from '../components/TimeEntryForm';
import toast from 'react-hot-toast';

const TaskDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [entries, setEntries] = useState([]);
  const [users, setUsers] = useState([]);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    assignee: '',
    status: 'todo',
    priority: 'medium',
    dueDate: '',
    estimatedHours: '',
  });

  const fetchTask = useCallback(async () => {
    const res = await api.get(`/tasks/${id}`);
    setTask(res.data.data);
    setForm({
      title: res.data.data.title || '',
      description: res.data.data.description || '',
      assignee: res.data.data.assignee?._id || '',
      status: res.data.data.status || 'todo',
      priority: res.data.data.priority || 'medium',
      dueDate: res.data.data.dueDate ? res.data.data.dueDate.slice(0, 10) : '',
      estimatedHours: res.data.data.estimatedHours ?? '',
    });
  }, [id]);

  const fetchEntries = useCallback(async () => {
    const res = await api.get(`/tasks/${id}/time-entries`);
    setEntries(res.data.data);
  }, [id]);

  useEffect(() => {
    fetchTask();
    fetchEntries();
  }, [fetchTask, fetchEntries]);

  useEffect(() => {
    api.get('/users').then((res) => setUsers(res.data.data)).catch(() => {});
  }, []);

  const handleStatusChange = async (status) => {
    await api.put(`/tasks/${id}`, { status });
    fetchTask();
  };

  const handleAssigneeChange = async (assignee) => {
    await api.put(`/tasks/${id}`, { assignee });
    toast.success('Assignee updated');
    fetchTask();
  };

  const handleDeleteEntry = async (entryId) => {
    await api.delete(`/time-entries/${entryId}`);
    toast.success('Entry removed');
    fetchEntries();
    fetchTask();
  };

  const handleDeleteTask = async () => {
    if (!confirm('Delete this task?')) return;
    await api.delete(`/tasks/${id}`);
    toast.success('Task deleted');
    navigate(-1);
  };

  const handleUpdateTask = async (e) => {
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
      await api.put(`/tasks/${id}`, {
        ...form,
        title: form.title.trim(),
        description: form.description.trim(),
        estimatedHours: Number(form.estimatedHours),
      });
      toast.success('Task updated');
      setEditing(false);
      fetchTask();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update task');
    }
  };

  if (!task) return <div className="px-4 py-5 sm:px-6">Loading...</div>;

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-5 sm:px-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-start mb-4">
        <div className="min-w-0">
          <button onClick={() => navigate(-1)} className="text-sm text-gray-600 hover:text-primary-600 mb-2">
            Back
          </button>
          <h1 className="text-2xl font-bold break-words">{task.title}</h1>
          <p className="text-gray-500 mt-1 break-words">{task.description}</p>
        </div>
        <button
          onClick={handleDeleteTask}
          className="w-full sm:w-auto text-sm text-red-600 border border-red-200 px-3 py-1.5 rounded-md"
        >
          Delete
        </button>
        <button
          onClick={() => setEditing((value) => !value)}
          className="w-full sm:w-auto text-sm border px-3 py-1.5 rounded-md"
        >
          {editing ? 'Close Edit' : 'Edit'}
        </button>
      </div>

      {editing && (
        <form onSubmit={handleUpdateTask} className="bg-white rounded-[.3rem] border p-4 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              required
              placeholder="Task title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full border rounded-md px-3 py-2 text-sm"
            />
            <select
              required
              value={form.assignee}
              onChange={(e) => setForm({ ...form, assignee: e.target.value })}
              className="w-full border rounded-md px-3 py-2 text-sm"
            >
              <option value="">Assign to</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
            <textarea
              required
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full border rounded-md px-3 py-2 text-sm sm:col-span-2"
              rows={3}
            />
            <select
              required
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full border rounded-md px-3 py-2 text-sm"
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
              className="w-full border rounded-md px-3 py-2 text-sm"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
            <input
              type="date"
              required
              value={form.dueDate}
              onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
              className="w-full border rounded-md px-3 py-2 text-sm"
            />
            <input
              type="number"
              min="0"
              step="0.25"
              required
              placeholder="Estimated hours"
              value={form.estimatedHours}
              onChange={(e) => setForm({ ...form, estimatedHours: e.target.value })}
              className="w-full border rounded-md px-3 py-2 text-sm"
            />
          </div>
          <div className="flex justify-end mt-3">
            <button type="submit" className="w-full sm:w-auto bg-primary-600 text-white text-sm px-4 py-2 rounded-md hover:bg-primary-700">
              Save Task
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-[.3rem] border p-4 mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-sm">
        <div>
          <p className="text-gray-500">Status</p>
          <select
            value={task.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="mt-1 w-full border rounded-md px-2 py-1 text-sm"
          >
            <option value="todo">Todo</option>
            <option value="in-progress">In Progress</option>
            <option value="review">Review</option>
            <option value="done">Done</option>
          </select>
        </div>
        <div>
          <p className="text-gray-500">Priority</p>
          <p className="font-medium capitalize">{task.priority}</p>
        </div>
        <div>
          <p className="text-gray-500">Assignee</p>
          <select
            value={task.assignee?._id || ''}
            onChange={(e) => handleAssigneeChange(e.target.value)}
            className="mt-1 w-full border rounded-md px-2 py-1 text-sm"
          >
            <option value="">Assign to</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <p className="text-gray-500">Estimated / Actual</p>
          <p className="font-medium">{task.estimatedHours || 0}h / {task.actualHours || 0}h</p>
        </div>
        <div>
          <p className="text-gray-500">Due Date</p>
          <p className="font-medium">
            {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '-'}
          </p>
        </div>
      </div>

      <h2 className="font-semibold mb-2">Time Entries</h2>
      <TimeEntryForm taskId={id} onAdded={() => { fetchEntries(); fetchTask(); }} />

      <div className="mt-4 divide-y bg-white border rounded-[.3rem]">
        {entries.length === 0 && <p className="p-4 text-sm text-gray-500">No time logged yet.</p>}
        {entries.map((entry) => (
          <div
            key={entry._id}
            className="flex flex-col gap-2 p-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0">
              <p className="text-sm font-medium break-words">
                {entry.hours}h - {entry.description || 'No description'}
              </p>
              <p className="text-xs text-gray-500">
                {entry.user?.name} - {new Date(entry.date).toLocaleDateString()}
              </p>
            </div>
            <button onClick={() => handleDeleteEntry(entry._id)} className="w-fit text-xs text-red-500">
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskDetail;
