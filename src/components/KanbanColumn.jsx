import { useDrop } from 'react-dnd';
import TaskCard from './TaskCard';
import Badge from './Badge';
import './KanbanColumn.css';

const KanbanColumn = ({ status, title, tasks, onDrop, icon, color }) => {
    const [{ isOver }, drop] = useDrop({
        accept: 'TASK',
        drop: (item) => onDrop(item.id, status),
        collect: (monitor) => ({
            isOver: monitor.isOver()
        })
    });

    return (
        <div className={`kanban-column ${isOver ? 'drag-over' : ''}`} ref={drop}>
            <div className={`column-header column-header-${color}`}>
                <div className="column-title">
                    <span className="column-icon">{icon}</span>
                    <h3>{title}</h3>
                </div>
                <Badge variant={color} size="sm">{tasks.length}</Badge>
            </div>
            <div className="column-content">
                {tasks.length === 0 ? (
                    <div className="empty-column">
                        <p>No tasks</p>
                    </div>
                ) : (
                    tasks.map(task => (
                        <TaskCard key={task.task_id} task={task} />
                    ))
                )}
            </div>
        </div>
    );
};

export default KanbanColumn;
