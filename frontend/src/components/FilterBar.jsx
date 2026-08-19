const FilterBar = ({ filters, onChange, members = [] }) => {
  const handle = (field) => (e) => onChange({ ...filters, [field]: e.target.value });

  return (
    <div className="grid grid-cols-1 gap-3 mb-4 sm:grid-cols-3">
      <select
        value={filters.status || ''}
        onChange={handle('status')}
        className="w-full border rounded-md px-3 py-1.5 text-sm"
      >
        <option value="">All Statuses</option>
        <option value="todo">Todo</option>
        <option value="in-progress">In Progress</option>
        <option value="review">Review</option>
        <option value="done">Done</option>
      </select>

      <select
        value={filters.priority || ''}
        onChange={handle('priority')}
        className="w-full border rounded-md px-3 py-1.5 text-sm"
      >
        <option value="">All Priorities</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
        <option value="urgent">Urgent</option>
      </select>

      <select
        value={filters.assignee || ''}
        onChange={handle('assignee')}
        className="w-full border rounded-md px-3 py-1.5 text-sm"
      >
        <option value="">All Assignees</option>
        {members.map((m) => (
          <option key={m._id} value={m._id}>
            {m.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FilterBar;
