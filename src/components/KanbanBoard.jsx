import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import KanbanColumn from './KanbanColumn';
import './KanbanBoard.css';

const KanbanBoard = ({ tasks, onStatusChange }) => {
    // Group tasks by status
    const groupedTasks = {
        todo: tasks.filter(t => t.status === 'todo'),
        in_progress: tasks.filter(t => t.status === 'in_progress'),
        review: tasks.filter(t => t.status === 'review'),
        done: tasks.filter(t => t.status === 'done')
    };

    const handleDrop = (taskId, newStatus) => {
        onStatusChange(taskId, newStatus);
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="kanban-board">
                <KanbanColumn
                    status="todo"
                    title="To Do"
                    icon="📋"
                    color="warning"
                    tasks={groupedTasks.todo}
                    onDrop={handleDrop}
                />
                <KanbanColumn
                    status="in_progress"
                    title="In Progress"
                    icon="⚡"
                    color="info"
                    tasks={groupedTasks.in_progress}
                    onDrop={handleDrop}
                />
                <KanbanColumn
                    status="review"
                    title="Review"
                    icon="👁️"
                    color="primary"
                    tasks={groupedTasks.review}
                    onDrop={handleDrop}
                />
                <KanbanColumn
                    status="done"
                    title="Done"
                    icon="✅"
                    color="success"
                    tasks={groupedTasks.done}
                    onDrop={handleDrop}
                />
            </div>
        </DndProvider>
    );
};

export default KanbanBoard;
