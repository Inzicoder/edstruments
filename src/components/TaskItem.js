import React, { useContext, useState } from "react";
import { TaskContext } from "../contexts/TaskContext";

const TaskItem = ({ task }) => {
  const { deleteTask, toggleComplete, editTask } = useContext(TaskContext);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);

  const handleSave = () => {
    if (editedTitle.trim() !== "") {
      editTask(task.id, editedTitle.trim());
      setIsEditing(false);
    }
  };

  return (
    <li className={`task-item ${task.completed ? "completed" : ""}`}>
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => toggleComplete(task.id)}
      />
      {isEditing ? (
        <input
          type="text"
          value={editedTitle}
          onChange={(e) => setEditedTitle(e.target.value)}
          className="edit-input"
        />
      ) : (
        <span>{task.title}</span>
      )}
      <div className="actions">
        {isEditing ? (
          <button onClick={handleSave} className="btn small">
            Save
          </button>
        ) : (
          <button onClick={() => setIsEditing(true)} className="btn small">
            Edit
          </button>
        )}
        <button
          onClick={() => deleteTask(task.id)}
          className="btn small delete"
        >
          Delete
        </button>
      </div>
    </li>
  );
};

export default TaskItem;
