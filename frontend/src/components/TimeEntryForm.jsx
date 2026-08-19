import { useState } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const TimeEntryForm = ({ taskId, onAdded }) => {
  const [form, setForm] = useState({ hours: '', description: '', date: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.hours || Number(form.hours) <= 0) {
      toast.error('Please enter valid hours');
      return;
    }
    setSubmitting(true);
    try {
      const res = await api.post(`/tasks/${taskId}/time-entries`, {
        hours: Number(form.hours),
        description: form.description,
        date: form.date || undefined,
      });
      toast.success('Time entry added');
      onAdded(res.data.data);
      setForm({ hours: '', description: '', date: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add time entry');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-2 bg-gray-50 p-3 rounded-md sm:grid-cols-2 lg:grid-cols-[auto_auto_1fr_auto] lg:items-end">
      <div>
        <label className="block text-xs text-gray-500 mb-1">Hours</label>
        <input
          type="number"
          step="0.25"
          min="0.25"
          value={form.hours}
          onChange={(e) => setForm({ ...form, hours: e.target.value })}
          className="w-full border rounded-md px-2 py-1.5 text-sm lg:w-24"
          required
        />
      </div>
      <div>
        <label className="block text-xs text-gray-500 mb-1">Date</label>
        <input
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          className="w-full border rounded-md px-2 py-1.5 text-sm"
        />
      </div>
      <div className="sm:col-span-2 lg:col-span-1">
        <label className="block text-xs text-gray-500 mb-1">Description</label>
        <input
          type="text"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="border rounded-md px-2 py-1.5 text-sm w-full"
          placeholder="What did you work on?"
        />
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-primary-600 text-white text-sm px-4 py-1.5 rounded-md hover:bg-primary-700 disabled:opacity-50 lg:w-auto"
      >
        {submitting ? 'Adding...' : 'Log Time'}
      </button>
    </form>
  );
};

export default TimeEntryForm;
