import { Link } from 'react-router-dom';

const ProjectCard = ({ project }) => (
  <Link
    to={`/projects/${project._id}`}
    className="block bg-white rounded-[.3rem] shadow-sm border p-4 sm:p-5 hover:shadow-md transition"
  >
    <div className="flex items-start justify-between gap-3 mb-2">
      <h3 className="font-semibold text-lg min-w-0 break-words">{project.name}</h3>
      <span
        className={`text-xs px-2 py-1 rounded-[.3rem] ${
          project.status === 'active'
            ? 'bg-green-100 text-green-700'
            : 'bg-gray-100 text-gray-600'
        }`}
      >
        {project.status}
      </span>
    </div>
    <p className="text-sm text-gray-500 line-clamp-2 mb-3">
      {project.description || 'No description'}
    </p>
    <div className="flex items-center -space-x-2">
      {project.members?.slice(0, 4).map((m) => (
        <img
          key={m._id}
          src={m.avatar}
          alt={m.name}
          title={m.name}
          className="w-7 h-7 rounded-[.3rem] border-2 border-white"
        />
      ))}
      {project.members?.length > 4 && (
        <span className="text-xs bg-gray-200 rounded-[.3rem] w-7 h-7 flex items-center justify-center">
          +{project.members.length - 4}
        </span>
      )}
    </div>
  </Link>
);

export default ProjectCard;
