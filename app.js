const { useState, useEffect } = React;

const TaskTracker = () => {
    const [tasks, setTasks] = useState(() => {
        const savedTasks = localStorage.getItem('tasks');
        return savedTasks ? JSON.parse(savedTasks) : [
            { id: 1, text: 'Complete project proposal', completed: false, priority: 'high', dueDate: '2023-12-15' },
            { id: 2, text: 'Buy groceries', completed: true, priority: 'medium', dueDate: '2023-12-10' },
            { id: 3, text: 'Call mom', completed: false, priority: 'low', dueDate: '2023-12-20' }
        ];
    });
    
    const [newTask, setNewTask] = useState('');
    const [priority, setPriority] = useState('medium');
    const [dueDate, setDueDate] = useState('');
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [editingTask, setEditingTask] = useState(null);
    const [editText, setEditText] = useState('');

    useEffect(() => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }, [tasks]);

    const addTask = () => {
        if (newTask.trim() === '') return;
        
        const newTaskObj = {
            id: Date.now(),
            text: newTask,
            completed: false,
            priority,
            dueDate: dueDate || null
        };
        
        setTasks([...tasks, newTaskObj]);
        setNewTask('');
        setPriority('medium');
        setDueDate('');
    };

    const deleteTask = (id) => {
        setTasks(tasks.filter(task => task.id !== id));
    };

    const toggleComplete = (id) => {
        setTasks(tasks.map(task => 
            task.id === id ? { ...task, completed: !task.completed } : task
        ));
    };

    const startEditing = (task) => {
        setEditingTask(task.id);
        setEditText(task.text);
        setPriority(task.priority);
        setDueDate(task.dueDate || '');
    };

    const saveEdit = (id) => {
        setTasks(tasks.map(task => 
            task.id === id ? { ...task, text: editText, priority, dueDate: dueDate || null } : task
        ));
        setEditingTask(null);
    };

    const cancelEdit = () => {
        setEditingTask(null);
    };

    const filteredTasks = tasks.filter(task => {
        const matchesFilter = 
            filter === 'all' || 
            (filter === 'completed' && task.completed) || 
            (filter === 'active' && !task.completed);
        
        const matchesSearch = task.text.toLowerCase().includes(searchTerm.toLowerCase());
        
        return matchesFilter && matchesSearch;
    });

    const getPriorityColor = (priority) => {
        switch(priority) {
            case 'high': return 'bg-red-100 text-red-800';
            case 'medium': return 'bg-yellow-100 text-yellow-800';
            case 'low': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getPriorityLabel = (priority) => {
        switch(priority) {
            case 'high': return 'High';
            case 'medium': return 'Medium';
            case 'low': return 'Low';
            default: return '';
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'No due date';
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const sortTasks = (a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        if (priorityOrder[b.priority] !== priorityOrder[a.priority]) {
            return priorityOrder[b.priority] - priorityOrder[a.priority];
        }
        if (a.dueDate && b.dueDate) {
            return new Date(a.dueDate) - new Date(b.dueDate);
        }
        if (a.dueDate) return -1;
        if (b.dueDate) return 1;
        return b.id - a.id;
    };

    const sortedTasks = [...filteredTasks].sort(sortTasks);

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
                <div className="bg-indigo-600 p-6 text-white">
                    <h1 className="text-3xl font-bold flex items-center">
                        <i className="fas fa-tasks mr-3"></i>
                        Task Tracker
                    </h1>
                    <p className="mt-2 opacity-90">Organize your work and life</p>
                </div>
                
                <div className="p-6">
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <input
                            type="text"
                            value={newTask}
                            onChange={(e) => setNewTask(e.target.value)}
                            placeholder="Add a new task..."
                            className="flex-grow px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            onKeyPress={(e) => e.key === 'Enter' && addTask()}
                        />
                        <select
                            value={priority}
                            onChange={(e) => setPriority(e.target.value)}
                            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="high">High Priority</option>
                            <option value="medium">Medium Priority</option>
                            <option value="low">Low Priority</option>
                        </select>
                        <input
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <button
                            onClick={addTask}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center justify-center"
                        >
                            <i className="fas fa-plus mr-2"></i> Add Task
                        </button>
                    </div>
                    
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                        <div className="flex space-x-2">
                            <button
                                onClick={() => setFilter('all')}
                                className={`px-4 py-2 rounded-lg ${filter === 'all' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100'}`}
                            >
                                All
                            </button>
                            <button
                                onClick={() => setFilter('active')}
                                className={`px-4 py-2 rounded-lg ${filter === 'active' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100'}`}
                            >
                                Active
                            </button>
                            <button
                                onClick={() => setFilter('completed')}
                                className={`px-4 py-2 rounded-lg ${filter === 'completed' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100'}`}
                            >
                                Completed
                            </button>
                        </div>
                        
                        <div className="relative w-full md:w-auto">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search tasks..."
                                className="w-full px-4 py-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
                        </div>
                    </div>
                    
                    <div className="space-y-3">
                        {sortedTasks.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                <i className="fas fa-clipboard-list text-4xl mb-3 opacity-30"></i>
                                <p className="text-lg">No tasks found</p>
                                <p className="text-sm">Add a new task to get started</p>
                            </div>
                        ) : (
                            sortedTasks.map((task) => (
                                <div 
                                    key={task.id} 
                                    className={`task-item bg-white border rounded-lg p-4 flex items-start justify-between animate-fadeIn ${task.completed ? 'opacity-70' : ''} priority-${task.priority}`}
                                >
                                    <div className="flex items-start space-x-3 flex-grow">
                                        <button
                                            onClick={() => toggleComplete(task.id)}
                                            className={`mt-1 w-5 h-5 rounded-full border-2 flex-shrink-0 ${task.completed ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300'}`}
                                        >
                                            {task.completed && <i className="fas fa-check text-xs self-center mx-auto"></i>}
                                        </button>
                                        
                                        {editingTask === task.id ? (
                                            <div className="flex-grow">
                                                <input
                                                    type="text"
                                                    value={editText}
                                                    onChange={(e) => setEditText(e.target.value)}
                                                    className="w-full px-3 py-1 border-b-2 border-indigo-300 focus:outline-none mb-2"
                                                    autoFocus
                                                />
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    <select
                                                        value={priority}
                                                        onChange={(e) => setPriority(e.target.value)}
                                                        className="px-2 py-1 text-sm border rounded"
                                                    >
                                                        <option value="high">High</option>
                                                        <option value="medium">Medium</option>
                                                        <option value="low">Low</option>
                                                    </select>
                                                    <input
                                                        type="date"
                                                        value={dueDate}
                                                        onChange={(e) => setDueDate(e.target.value)}
                                                        className="px-2 py-1 text-sm border rounded"
                                                    />
                                                    <button
                                                        onClick={() => saveEdit(task.id)}
                                                        className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
                                                    >
                                                        Save
                                                    </button>
                                                    <button
                                                        onClick={cancelEdit}
                                                        className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded hover:bg-gray-400"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex-grow">
                                                <p className={`${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                                                    {task.text}
                                                </p>
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
                                                        {getPriorityLabel(task.priority)}
                                                    </span>
                                                    {task.dueDate && (
                                                        <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800 flex items-center">
                                                            <i className="far fa-calendar-alt mr-1"></i>
                                                            {formatDate(task.dueDate)}
                                                            {new Date(task.dueDate) < new Date() && !task.completed && (
                                                                <span className="ml-1 text-red-500">(Overdue)</span>
                                                            )}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="task-actions opacity-0 md:opacity-100 flex space-x-2 ml-3">
                                        {editingTask !== task.id && (
                                            <>
                                                <button
                                                    onClick={() => startEditing(task)}
                                                    className="text-gray-500 hover:text-indigo-600"
                                                    title="Edit"
                                                >
                                                    <i className="fas fa-edit"></i>
                                                </button>
                                                <button
                                                    onClick={() => deleteTask(task.id)}
                                                    className="text-gray-500 hover:text-red-600"
                                                    title="Delete"
                                                >
                                                    <i className="fas fa-trash-alt"></i>
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    
                    {tasks.length > 0 && (
                        <div className="mt-6 text-sm text-gray-500 flex justify-between items-center">
                            <div>
                                {filteredTasks.filter(t => !t.completed).length} tasks remaining
                            </div>
                            <div>
                                Total tasks: {tasks.length} | Completed: {tasks.filter(t => t.completed).length}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            
            <div className="text-center text-gray-500 text-sm">
                <p>Task Tracker App © {new Date().getFullYear()}</p>
            </div>
        </div>
    );
};

const App = () => {
    return <TaskTracker />;
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);