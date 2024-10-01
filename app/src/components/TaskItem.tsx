import { Task } from "../services/TaskService";
import { User } from "../services/UserService";
import React, { useState } from "react";
import { Draggable } from "react-beautiful-dnd";

interface TaskItemProps {
  task: Task;
  index: number;
  users: User[];
  assignUser: (taskId: string, assignee: User) => void;
}

const TaskItem = ({ task, index, users, assignUser }: TaskItemProps) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const handleAssigneeClick = (user: User) => {
    assignUser(task.id, user);
    setDropdownOpen(false);
  };

  const getInitials = (name: string) => {
    const nameParts = name.split(" ");
    return nameParts.map((part) => part[0].toUpperCase()).join("");
  };

  return (
    <Draggable key={task.id} draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          className={`flex-col grid gap-2 p-4 mb-2 rounded-lg shadow ${
            snapshot.isDragging ? "bg-blue-100" : "bg-blue-200"
          }`}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <div>
            <h3 className="font-semibold">{task.title}</h3>
            <p className="text-sm text-gray-700">{task.description}</p>
          </div>

          <div className="flex justify-end relative">
            <button
              onClick={() => setDropdownOpen(!isDropdownOpen)}
              className="bg-blue-500 text-white p-2 rounded-full"
            >
              {task.assignee ? (
                <span className="font-semibold">
                  {getInitials(task.assignee.name)}
                </span>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M13 7a3 3 0 11-6 0 3 3 0 016 0zM4 17a4 4 0 014-4h4a4 4 0 014 4v1H4v-1z" />
                </svg>
              )}
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-300 rounded shadow-lg z-10">
                <ul>
                  {users.map((user: User) => (
                    <li
                      key={user.emailAddress}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleAssigneeClick(user)}
                    >
                      {user.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default TaskItem;
