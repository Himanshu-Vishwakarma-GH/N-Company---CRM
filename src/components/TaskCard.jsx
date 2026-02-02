import { useDrag } from 'react-dnd';
import Badge from './Badge';
import './TaskCard.css';

const TaskCard = ({ task, onDelete }) => {
    const [{ isDragging }, drag] = useDrag({
        type: 'TASK',
        item: { id: task.task_id, status: task.status },
        collect: (monitor) => ({
            isDragging: monitor.isDragging()
        })
    });

    const getPriorityColor = (priority) => {
        const colors = {
            urgent: 'danger',
            high: 'warning',
            medium: 'info',
            low: 'success'
        };
        return colors[priority] || 'default';
    };

    const getPriorityIcon = (priority) => {
        const icons = {
            urgent: '🔴',
            high: '🟠',
            medium: '🟡',
            low: '🟢'
        };
        return icons[priority] || '⚪';
    };

    return (
        <div
            ref={drag}
            className={`task-card ${isDragging ? 'dragging' : ''}`}
            style={{ opacity: isDragging ? 0.5 : 1 }}
        >
            <div className="task-card-header">
                <div className="task-priority">
                    {getPriorityIcon(task.priority)}
                    <Badge variant={getPriorityColor(task.priority)} size="sm">
                        {task.priority}
                    </Badge>
                </div>
                {task.assigned_to && (
                    <div className="task-assignee">
                        👤 {task.assigned_to}
                    </div>
                )}
            </div>

            <h4 className="task-title">{task.title}</h4>

            {task.description && (
                <p className="task-description">{task.description}</p>
            )}

            <div className="task-footer">
                {task.due_date && (
                    <div className="task-due-date">
                        📅 {new Date(task.due_date).toLocaleDateString()}
                    </div>
                )}
                {task.client_id && (
                    <div className="task-client">
                        🏷️ {task.client_id}
                    </div>
                )}
            </div>

            <div className="task-id">{task.task_id}</div>
        </div>
    );
};

export default TaskCard;
