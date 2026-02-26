import { useState } from 'react';

type Task = {
  id: string;
  title: string;
  description?: string;
};

type Column = {
  id: string;
  title: string;
  tasks: Task[];
};

export default function Home() {
  const [columns, setColumns] = useState<Column[]>([
    {
      id: 'todo',
      title: '待办',
      tasks: [
        { id: '1', title: '完善登录功能', description: '支持 CSRF token' },
        { id: '2', title: '添加深色主题', description: '适配深色模式' },
      ],
    },
    {
      id: 'in_progress',
      title: '进行中',
      tasks: [
        { id: '3', title: '帖子详情页', description: '显示回复列表' },
      ],
    },
    {
      id: 'done',
      title: '已完成',
      tasks: [
        { id: '4', title: '项目结构搭建', description: '参考 ChatCube' },
        { id: '5', title: 'API 服务封装', description: 'Discourse API' },
      ],
    },
  ]);

  const [newTask, setNewTask] = useState('');
  const [draggedTask, setDraggedTask] = useState<{ task: Task; columnId: string } | null>(null);

  const addTask = (columnId: string) => {
    if (!newTask.trim()) return;
    const task: Task = {
      id: Date.now().toString(),
      title: newTask,
    };
    setColumns(columns.map(col => 
      col.id === columnId 
        ? { ...col, tasks: [...col.tasks, task] }
        : col
    ));
    setNewTask('');
  };

  const deleteTask = (columnId: string, taskId: string) => {
    setColumns(columns.map(col =>
      col.id === columnId
        ? { ...col, tasks: col.tasks.filter(t => t.id !== taskId) }
        : col
    ));
  };

  const handleDragStart = (task: Task, columnId: string) => {
    setDraggedTask({ task, columnId });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (targetColumnId: string) => {
    if (!draggedTask) return;
    
    // Remove from original column
    let updatedColumns = columns.map(col => {
      if (col.id === draggedTask.columnId) {
        return { ...col, tasks: col.tasks.filter(t => t.id !== draggedTask.task.id) };
      }
      return col;
    });
    
    // Add to target column
    updatedColumns = updatedColumns.map(col => {
      if (col.id === targetColumnId) {
        return { ...col, tasks: [...col.tasks, draggedTask.task] };
      }
      return col;
    });
    
    setColumns(updatedColumns);
    setDraggedTask(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          🦞 Linux.do 鸿蒙项目任务面板
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {columns.map(column => (
            <div
              key={column.id}
              className="bg-white rounded-lg shadow-md p-4"
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(column.id)}
            >
              <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center justify-between">
                {column.title}
                <span className="text-sm text-gray-500 bg-gray-200 px-2 py-1 rounded">
                  {column.tasks.length}
                </span>
              </h2>
              
              <div className="space-y-3">
                {column.tasks.map(task => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={() => handleDragStart(task, column.id)}
                    className="bg-gray-50 p-3 rounded-lg border border-gray-200 cursor-move hover:bg-gray-100 transition"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-800">{task.title}</p>
                        {task.description && (
                          <p className="text-sm text-gray-500 mt-1">{task.description}</p>
                        )}
                      </div>
                      <button
                        onClick={() => deleteTask(column.id, task.id)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 flex gap-2">
                <input
                  type="text"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addTask(column.id)}
                  placeholder="添加任务..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => addTask(column.id)}
                  className="px-3 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600"
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">💡 使用说明</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• 拖拽任务卡片在列之间移动</li>
            <li>• 在每列底部输入框添加新任务</li>
            <li>• 点击 ✕ 删除任务</li>
            <li>• 数据保存在浏览器本地 (LocalStorage)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
