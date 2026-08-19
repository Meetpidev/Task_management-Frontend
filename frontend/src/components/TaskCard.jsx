const priorityColors = {
  low: 'bg-gray-100 text-gray-600',
  medium: 'bg-blue-100 text-blue-700',
  high: 'bg-orange-100 text-orange-700',
  urgent: 'bg-red-100 text-red-700',
};

const TaskCard = ({ task, onClick }) => {
  const isOverdue =
    task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done';

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-md border p-3 shadow-sm hover:shadow-md cursor-pointer transition"
    >
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-medium text-sm">{task.title}</h4>
        <span className={`text-[10px] px-2 py-0.5 rounded-[.3rem] ${priorityColors[task.priority]}`}>
          {task.priority}
        </span>
      </div>
      {task.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {task.tags.map((tag) => (
            <span key={tag} className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded">
              {tag}
            </span>
          ))}
        </div>
      )}
      <div className="flex justify-between items-center text-xs text-gray-500">
        {task.dueDate && (
          <span className={isOverdue ? 'text-red-600 font-medium' : ''}>
            Due {new Date(task.dueDate).toLocaleDateString()}
          </span>
        )}
        {task.assignee && (
          <img
            src={task.assignee.avatar}
            title={task.assignee.name}
            alt={task.assignee.name}
            className="w-5 h-5 rounded-[.3rem]"
          />
        )}
      </div>
    </div>
  );
};

export default TaskCard;