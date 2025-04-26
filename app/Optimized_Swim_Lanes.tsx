"use client";
import React, { useState, useRef, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import './Optimized_Swim_Lanes.css';
import Subgoal_Planner from './Subgoal_Planner';

type Task = {
  storyPoints: number;
  title: string;
  status: string;
  category: string;
  assignee: string;
};

type Subgoal = {
  id: number;
  title: string;
  status: 'todo' | 'doing' | 'done';
};

const defaultSubgoals: Subgoal[] = [
  { id: 1, title: 'Deploy', status: 'todo' },
  { id: 2, title: 'Test it', status: 'todo' },
  { id: 3, title: 'Subgoal Label', status: 'done' },
  { id: 4, title: 'Subgoal Label', status: 'done' },
];

const tasksData: Task[] = [
  { storyPoints: 2, title: 'Final Evaluation Results', status: 'todo', category: 'Final Project', assignee: 'RM' },
  { storyPoints: 3, title: 'Final Exam', status: 'todo', category: 'Tests', assignee: 'RM' },
  { storyPoints: 1, title: 'Final Survey', status: 'todo', category: 'Final Project', assignee: 'RM' },
  { storyPoints: 5, title: 'Final Evaluation Planning', status: 'doing', category: 'Final Project', assignee: 'RM' },
  { storyPoints: 4, title: 'Create Video Prototype', status: 'doing', category: 'Final Project', assignee: 'TD' },
  { storyPoints: 3, title: 'Code Review', status: 'todo', category: 'Tests', assignee: 'Z' },
  { storyPoints: 2, title: 'Write Documentation', status: 'doing', category: 'Participation', assignee: 'Z' },
  { storyPoints: 4, title: 'Design Mockups', status: 'review', category: 'Final Project', assignee: 'JV' },
  { storyPoints: 5, title: 'Fix Bugs', status: 'done', category: 'Indiv Project', assignee: 'JV' },
];


const allAssignees = ['RM', 'TD', 'Z', 'JV'];

const getColor = (category: string) => {
  switch (category) {
    case 'Final Project': return 'orange';
    case 'Tests': return 'red';
    case 'Participation': return 'green';
    case 'Indiv Project': return 'blue';
    default: return 'gray';
  }
};

const getAssigneeColor = (assignee: string) => {
  switch (assignee) {
    case 'RM': return '#FF9AA2';
    case 'TD': return '#A2CFFE';
    case 'Z': return '#B5EAD7';
    case 'JV': return '#FFDAC1';
    default: return '#D3D3D3';
  }
};

const getAssigneeName = (assignee: string) => {
  switch (assignee) {
    case 'RM': return 'Rithvik Madhdhipatla';
    case 'TD': return 'Tarun Devisetti';
    case 'Z': return 'Zak';
    case 'JV': return 'James Vo';
    default: return '';
  }
};

const ItemType = {
  TASK: 'task',
};

function TaskCard({
  task,
  moveTask,
  updateStoryPoints,
  onTaskCardClick,
}: {
  task: Task;
  moveTask: (task: Task, newStatus: string, newAssignee?: string) => void;
  updateStoryPoints: (task: Task, newStoryPoints: number) => void;
  onTaskCardClick?: (task: Task) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [, drag] = useDrag(() => ({
    type: ItemType.TASK,
    item: { task },
  }));

  const [hovered, setHovered] = useState(false);

  drag(ref);

  // Only trigger Subgoal_Planner if click is in top half or right half
  const handleCardClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!onTaskCardClick) return;
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    const y = e.clientY - rect.top;
    const x = e.clientX - rect.left;
    const height = rect.height;
    const width = rect.width;
    // Top half or right half
    if (y < height / 2 || x > width / 2) {
      onTaskCardClick(task);
    }
  };

  const handleIncrease = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateStoryPoints(task, task.storyPoints + 1);
  };

  const handleDecrease = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (task.storyPoints > 0) {
      updateStoryPoints(task, task.storyPoints - 1);
    }
  };

  return (
    <div
      ref={ref}
      className="task-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleCardClick}
      style={{ cursor: 'pointer' }}
    >
      <div className="task-title">{task.title}</div>
      <div className="task-category" style={{ backgroundColor: getColor(task.category) }}>
        {task.category}
      </div>
      <div className="task-footer">
        <div
          className="story-points-container"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '2px',
          }}
        >
          {hovered && (
            <button
              className="story-points-arrow"
              onClick={handleDecrease}
              style={{
                cursor: 'pointer',
                background: 'none',
                border: 'none',
                fontSize: '10px',
                padding: '0',
              }}
            >
              ◀
            </button>
          )}
          <span className="task-story-points">{task.storyPoints}</span>
          {hovered && (
            <button
              className="story-points-arrow"
              onClick={handleIncrease}
              style={{
                cursor: 'pointer',
                background: 'none',
                border: 'none',
                fontSize: '10px',
                padding: '0',
              }}
            >
              ▶
            </button>
          )}
        </div>
        <span
          className="task-assignee"
          style={{
            backgroundColor: getAssigneeColor(task.assignee),
            color: 'white',
            borderRadius: '50%',
            width: '24px',
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            fontWeight: 'bold',
          }}
        >
          {task.assignee}
        </span>
      </div>
    </div>
  );
}

function KanbanColumn({
  status,
  tasks,
  moveTask,
  groupValue,
  groupBy,
  updateStoryPoints,
  onTaskCardClick,
}: {
  status: string;
  tasks: Task[];
  moveTask: (task: Task, newStatus: string, newGroupValue?: string) => void;
  groupValue: string;
  groupBy: 'Assignee' | 'Category';
  updateStoryPoints: (task: Task, newStoryPoints: number) => void;
  onTaskCardClick?: (task: Task) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [, drop] = useDrop(() => ({
    accept: ItemType.TASK,
    drop: (item: { task: Task }) => {
      if (groupBy === 'Assignee') {
        moveTask(item.task, status, groupValue);
      } else {
        moveTask(item.task, status);
      }
    },
  }));

  drop(ref);

  return (
    <div ref={ref} className="kanban-column">
      {tasks.map((task) => (
        <TaskCard
          key={task.title}
          task={task}
          moveTask={moveTask}
          updateStoryPoints={updateStoryPoints}
          onTaskCardClick={onTaskCardClick}
        />
      ))}
    </div>
  );
}

// Legend popup component
function LegendPopup({ onClose }: { onClose: () => void }) {
  const [exampleTask, setExampleTask] = React.useState({
    storyPoints: 3,
    title: 'Example Task',
    status: 'doing',
    category: 'Final Project',
    assignee: 'RM',
  });

  // Dummy functions for TaskCard in LegendPopup
  const moveTask = () => {};
  const onTaskCardClick = () => {};

  const updateStoryPoints = (_task: typeof exampleTask, newStoryPoints: number) => {
    setExampleTask((prev) => ({
      ...prev,
      storyPoints: newStoryPoints,
    }));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: 350 }}>
        <button className="modal-close" onClick={onClose} style={{ float: 'right' }}>
          &times;
        </button>
        <h3 style={{ marginTop: 0 }}>Task Card Example</h3>
        <div style={{ margin: '20px 0' }}>
          <TaskCard
            task={exampleTask}
            moveTask={moveTask}
            updateStoryPoints={updateStoryPoints}
            onTaskCardClick={onTaskCardClick}
          />
        </div>
        <div>
          <ul style={{ fontSize: 14, paddingLeft: 20 }}>
            <li><b>Title</b>: Task name</li>
            <li><b>Category color bar</b>: Category of the task</li>
            <li><b>Story points</b>: Number with arrows (hover to see arrows)</li>
            <li><b>Assignee circle</b>: Initials of assignee</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function Optimized_Swim_Lanes() {
  const [tasks, setTasks] = useState<Task[]>(tasksData);
  const [statuses, setStatuses] = useState<string[]>(['todo', 'doing', 'review', 'done']);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [groupBy, setGroupBy] = useState<'Assignee' | 'Category'>('Assignee');
  const [assignees, setAssignees] = useState<string[]>(allAssignees); // Dynamic list of assignees
  const [collapsedRows, setCollapsedRows] = useState<Set<string>>(new Set()); // Tracks collapsed rows
  const [legendOpen, setLegendOpen] = useState(false);

  // New state for per-task subgoals and modal
  const [subgoalsByTask, setSubgoalsByTask] = useState<{ [taskTitle: string]: Subgoal[] }>({});
  const [openTaskTitle, setOpenTaskTitle] = useState<string | null>(null);

  // Load tasks from localStorage on client only
  useEffect(() => {
    try {
      const data = localStorage.getItem('swimlane_tasks');
      if (data) setTasks(JSON.parse(data));
    } catch {}
  }, []);

  // Load subgoals from localStorage on client only
  useEffect(() => {
    try {
      const data = localStorage.getItem('swimlane_subgoals');
      if (data) setSubgoalsByTask(JSON.parse(data));
    } catch {}
  }, []);

  // New Task Modal state
  const [newTaskModalOpen, setNewTaskModalOpen] = useState(false);
  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: '',
    category: '',
    storyPoints: 1,
    assignee: allAssignees[0],
    status: 'todo',
  });

  // Persist to localStorage on change
  useEffect(() => {
    localStorage.setItem('swimlane_tasks', JSON.stringify(tasks));
  }, [tasks]);
  useEffect(() => {
    localStorage.setItem('swimlane_subgoals', JSON.stringify(subgoalsByTask));
  }, [subgoalsByTask]);

  // Move task between columns or groups
  const moveTask = (task: Task, newStatus: string, newGroupValue?: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((t) =>
        t.title === task.title
          ? {
              ...t,
              status: newStatus,
              ...(groupBy === 'Assignee' ? { assignee: newGroupValue || t.assignee } : {}),
            }
          : t
      )
    );
  };

  const updateStoryPoints = (task: Task, newStoryPoints: number) => {
    setTasks((prevTasks) =>
      prevTasks.map((t) =>
        t.title === task.title ? { ...t, storyPoints: newStoryPoints } : t
      )
    );
  };

  const addNewColumn = () => {
    const newColumnName = prompt('Enter the name of the new column:');
    if (newColumnName && !statuses.includes(newColumnName.toLowerCase())) {
      setStatuses((prevStatuses) => [...prevStatuses, newColumnName.toLowerCase()]);
    }
  };

  const addNewAssignee = () => {
    const newAssignee = prompt('Enter the initials of the new assignee (e.g., AB):');
    if (newAssignee && !assignees.includes(newAssignee)) {
      setAssignees((prevAssignees) => [...prevAssignees, newAssignee]);
    }
  };

  const toggleRowCollapse = (groupValue: string) => {
    setCollapsedRows((prevCollapsedRows) => {
      const newCollapsedRows = new Set(prevCollapsedRows);
      if (newCollapsedRows.has(groupValue)) {
        newCollapsedRows.delete(groupValue);
      } else {
        newCollapsedRows.add(groupValue);
      }
      return newCollapsedRows;
    });
  };

  // Open modal for a specific task, initializing subgoals if needed
  const handleTaskClick = (task: Task) => {
    setOpenTaskTitle(task.title);
    setSubgoalsByTask(prev => {
      if (prev[task.title]) return prev;
      // Initialize with default subgoals if not present
      return { ...prev, [task.title]: defaultSubgoals.map(sg => ({ ...sg })) };
    });
  };

  const closeModal = () => {
    setOpenTaskTitle(null);
  };

  // Update subgoals for a specific task
  const updateSubgoalsForTask = (taskTitle: string, newSubgoals: Subgoal[]) => {
    setSubgoalsByTask(prev => ({
      ...prev,
      [taskTitle]: newSubgoals,
    }));

    // Auto-move logic
    const progress =
      newSubgoals.length === 0
        ? 0
        : Math.round(
            (newSubgoals.filter(sg => sg.status === 'done').length / newSubgoals.length) * 100
          );

    setTasks(prevTasks =>
      prevTasks.map(task => {
        if (task.title !== taskTitle) return task;
        if (progress === 0 && task.status !== 'todo') {
          return { ...task, status: 'todo' };
        }
        if (progress === 100 && task.status !== 'done') {
          return { ...task, status: 'done' };
        }
        if (
          progress > 0 &&
          progress < 100 &&
          !["doing", "review"].includes(task.status)
        ) {
          const inProgressStatuses = ["doing", "review"];
          const randomStatus = inProgressStatuses[Math.floor(Math.random() * inProgressStatuses.length)];
          return { ...task, status: randomStatus };
        }
        return task;
      })
    );
  };

  const filteredTasks = filterCategory
    ? tasks.filter((task) => task.category === filterCategory)
    : tasks;

  const renderColumns = (groupValue: string) => {
    return (
      <div className="kanban-row">
        {statuses.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            tasks={filteredTasks.filter(
              (task) =>
                task.status === status &&
                (groupBy === 'Assignee' ? task.assignee === groupValue : task.category === groupValue)
            )}
            moveTask={moveTask}
            groupValue={groupValue}
            groupBy={groupBy}
            updateStoryPoints={updateStoryPoints}
            onTaskCardClick={handleTaskClick}
          />
        ))}
      </div>
    );
  };

  const renderRows = () => {
    const groupValues =
      groupBy === 'Assignee'
        ? [...assignees].sort()
        : [...new Set(tasks.map((task) => task.category))].sort();

    return groupValues.map((groupValue) => {
      const isCollapsed = collapsedRows.has(groupValue);

      return (
        <div key={groupValue}>
          <h3
            className="group-header"
            style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
            onClick={() => toggleRowCollapse(groupValue)}
          >
            <span
              style={{
                marginRight: '8px',
                fontSize: '10px',
                display: 'inline-block',
                transform: isCollapsed ? 'rotate(0deg)' : 'rotate(90deg)',
                transition: 'transform 0.2s ease',
              }}
            >
              ▶
            </span>
            {groupBy === 'Assignee' ? getAssigneeName(groupValue) || groupValue : groupValue}
          </h3>
          {!isCollapsed && renderColumns(groupValue)}
        </div>
      );
    });
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="App">
        <div className="header-container">
          <h1 className="kanban-title">BOARD</h1>
          <button
            style={{
              marginLeft: 20,
              padding: '8px 18px',
              borderRadius: 8,
              border: '1px solid #3973f7',
              background: '#3973f7',
              color: '#fff',
              fontWeight: 600,
              fontSize: '1rem',
              cursor: 'pointer',
              marginRight: 20,
            }}
            onClick={() => setNewTaskModalOpen(true)}
          >
            + New Task Card
          </button>
          <div className="filter-group-container" style={{ alignItems: 'center', display: 'flex' }}>
            <div className="filter-container">
              <label htmlFor="category-filter">Filter:</label>
              <select
                id="category-filter"
                onChange={(e) => setFilterCategory(e.target.value === 'All' ? null : e.target.value)}
                value={filterCategory || 'All'}
              >
                <option value="All">All</option>
                <option value="Final Project">Final Project</option>
                <option value="Tests">Tests</option>
                <option value="Participation">Participation</option>
                <option value="Indiv Project">Indiv Project</option>
              </select>
            </div>
            <div className="group-by-container" style={{ marginLeft: 16 }}>
              <label htmlFor="group-by">Group By:</label>
              <select
                id="group-by"
                onChange={(e) => setGroupBy(e.target.value as 'Assignee' | 'Category')}
                value={groupBy}
              >
                <option value="Assignee">Assignee</option>
                <option value="Category">Category</option>
              </select>
            </div>
            <button
              style={{
                marginLeft: 20,
                padding: '6px 16px',
                borderRadius: 6,
                border: '1px solid #ccc',
                background: '#fff',
                cursor: 'pointer',
                fontWeight: 500,
              }}
              onClick={() => setLegendOpen(true)}
            >
              Legend
            </button>
          </div>
        </div>
        <div className="kanban-labels" style={{ display: 'flex', alignItems: 'center' }}>
          {statuses.map((status) => (
            <div key={status} className="kanban-label">
              {status.toUpperCase()}
            </div>
          ))}
          <div
            className="add-column-icon"
            onClick={addNewColumn}
            style={{
              cursor: 'pointer',
              fontSize: '20px',
              marginLeft: '10px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            +
          </div>
        </div>
        {renderRows()}
        {openTaskTitle && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={closeModal} style={{ float: 'right' }}>
                &times;
              </button>
              <Subgoal_Planner
                subgoals={subgoalsByTask[openTaskTitle] || []}
                setSubgoals={(newSubgoals: Subgoal[]) => updateSubgoalsForTask(openTaskTitle, newSubgoals)}
                taskTitle={openTaskTitle}
              />
            </div>
          </div>
        )}
        {legendOpen && <LegendPopup onClose={() => setLegendOpen(false)} />}

        {newTaskModalOpen && (
          <div className="modal-overlay" onClick={() => setNewTaskModalOpen(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()} style={{ minWidth: 340 }}>
              <button className="modal-close" onClick={() => setNewTaskModalOpen(false)} style={{ float: 'right' }}>
                &times;
              </button>
              <h2 style={{ marginTop: 0 }}>New Task Card</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <label>
                  Title:
                  <input
                    type="text"
                    value={newTask.title}
                    onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                    style={{ width: '100%', marginTop: 4 }}
                  />
                </label>
                <label>
                  Category:
                  <input
                    type="text"
                    value={newTask.category}
                    onChange={e => setNewTask({ ...newTask, category: e.target.value })}
                    style={{ width: '100%', marginTop: 4 }}
                  />
                </label>
                <label>
                  Story Points:
                  <input
                    type="number"
                    min={1}
                    value={newTask.storyPoints}
                    onChange={e => setNewTask({ ...newTask, storyPoints: Number(e.target.value) })}
                    style={{ width: 80, marginTop: 4 }}
                  />
                </label>
                <label>
                  Assignee:
                  <select
                    value={newTask.assignee}
                    onChange={e => setNewTask({ ...newTask, assignee: e.target.value })}
                    style={{ width: '100%', marginTop: 4 }}
                  >
                    {allAssignees.map(a => (
                      <option key={a} value={a}>{getAssigneeName(a) || a}</option>
                    ))}
                  </select>
                </label>
                <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                  <button
                    style={{
                      background: '#3973f7',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 6,
                      padding: '8px 18px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                    onClick={() => {
                      if (!newTask.title || !newTask.category || !newTask.assignee) return;
                      setTasks(prev => [
                        ...prev,
                        {
                          title: newTask.title!,
                          category: newTask.category!,
                          storyPoints: newTask.storyPoints || 1,
                          assignee: newTask.assignee!,
                          status: 'todo',
                        },
                      ]);
                      setSubgoalsByTask(prev => ({
                        ...prev,
                        [newTask.title!]: defaultSubgoals.map(sg => ({ ...sg })),
                      }));
                      setNewTaskModalOpen(false);
                      setNewTask({
                        title: '',
                        category: '',
                        storyPoints: 1,
                        assignee: allAssignees[0],
                        status: 'todo',
                      });
                    }}
                  >
                    Save
                  </button>
                  <button
                    style={{
                      background: '#eee',
                      color: '#333',
                      border: '1px solid #ccc',
                      borderRadius: 6,
                      padding: '8px 18px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                    onClick={() => setNewTaskModalOpen(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
              <div style={{ marginTop: 24, fontSize: 13, color: '#888' }}>
                <b>Tip:</b> See the Legend for an example task card.
              </div>
            </div>
          </div>
        )}
        <div
          className="add-assignee-icon"
          onClick={addNewAssignee}
          style={{
            marginTop: '20px',
            cursor: 'pointer',
            fontSize: '20px',
            marginLeft: '10px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          +
        </div>
      </div>
    </DndProvider>
  );
}

export default Optimized_Swim_Lanes;
