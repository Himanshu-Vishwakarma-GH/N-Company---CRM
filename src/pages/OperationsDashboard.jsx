import { useState, useEffect } from 'react';
import StatCard from '../components/StatCard';
import KanbanBoard from '../components/KanbanBoard';
import Button from '../components/Button';
import { taskAPI } from '../services/api';
import './OperationsDashboard.css';

const OperationsDashboard = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch tasks on mount
    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const tasksData = await taskAPI.listTasks();
            setTasks(tasksData);
        } catch (error) {
            console.error('Failed to fetch tasks:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (taskId, newStatus) => {
        try {
            // Optimistic update
            setTasks(prevTasks =>
                prevTasks.map(task =>
                    task.task_id === taskId
                        ? { ...task, status: newStatus }
                        : task
                )
            );

            // Update in backend
            await taskAPI.updateTaskStatus(taskId, newStatus);
            console.log(`Task ${taskId} status updated to ${newStatus}`);
        } catch (error) {
            console.error('Failed to update task status:', error);
            // Revert on error
            fetchTasks();
        }
    };

    // Calculate metrics
    const totalTasks = tasks.length;
    const todoTasks = tasks.filter(t => t.status === 'todo').length;
    const inProgressTasks = tasks.filter(t => t.status === 'in_progress').length;
    const reviewTasks = tasks.filter(t => t.status === 'review').length;
    const doneTasks = tasks.filter(t => t.status === 'done').length;
    const completionRate = totalTasks > 0 ? ((doneTasks / totalTasks) * 100).toFixed(1) : 0;

    // Count overdue tasks
    const today = new Date().toISOString().split('T')[0];
    const overdueTasks = tasks.filter(t =>
        t.due_date && t.due_date < today && t.status !== 'done'
    ).length;

    if (loading) {
        return (
            <div className="operations-dashboard">
                <div style={{ padding: '40px', textAlign: 'center' }}>
                    <h2>Loading tasks...</h2>
                </div>
            </div>
        );
    }

    return (
        <div className="operations-dashboard">
            {/* KPIs */}
            <div className="kpi-grid">
                <StatCard
                    title="Total Tasks"
                    value={totalTasks.toString()}
                    trend="Active tasks"
                    trendValue={inProgressTasks}
                    icon="📋"
                    color="primary"
                />
                <StatCard
                    title="In Progress"
                    value={inProgressTasks.toString()}
                    trend="Being worked on"
                    trendValue={0}
                    icon="⚡"
                    color="info"
                />
                <StatCard
                    title="Completion Rate"
                    value={`${completionRate}%`}
                    trend={`${doneTasks} completed`}
                    trendValue={0}
                    icon="✅"
                    color="success"
                />
                <StatCard
                    title="Overdue"
                    value={overdueTasks.toString()}
                    trend="Need attention"
                    trendValue={0}
                    icon="⚠️"
                    color="danger"
                />
            </div>

            {/* Kanban Board Header */}
            <div className="kanban-header">
                <h2 className="section-title">Task Board</h2>
                <Button variant="primary" icon="➕">
                    Add New Task
                </Button>
            </div>

            {/* Kanban Board */}
            <KanbanBoard
                tasks={tasks}
                onStatusChange={handleStatusChange}
            />

            {/* Task Stats */}
            <div className="task-stats">
                <div className="stat-item">
                    <span className="stat-label">📋 To Do:</span>
                    <span className="stat-value">{todoTasks}</span>
                </div>
                <div className="stat-item">
                    <span className="stat-label">⚡ In Progress:</span>
                    <span className="stat-value">{inProgressTasks}</span>
                </div>
                <div className="stat-item">
                    <span className="stat-label">👁️ Review:</span>
                    <span className="stat-value">{reviewTasks}</span>
                </div>
                <div className="stat-item">
                    <span className="stat-label">✅ Done:</span>
                    <span className="stat-value">{doneTasks}</span>
                </div>
            </div>
        </div>
    );
};

export default OperationsDashboard;
