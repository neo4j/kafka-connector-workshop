import { User } from "../services/UserService";
import { Droppable } from "react-beautiful-dnd";
import React from "react";
import TaskItem from "./TaskItem";
import { Column } from "./Board";

export interface ColumnProperties {
  columnId: string;
  column: Column;
  users: User[];
  assignUser: (taskId: string, assignee: User) => void;
}

const ColumnItem = ({
  columnId,
  column,
  users,
  assignUser,
}: ColumnProperties) => {
  return (
    <div key={columnId} className="w-1/3 p-2">
      <h2 className="text-xl text-neo4j-light-gray font-bold mb-2">
        {column.displayName}
      </h2>
      <Droppable droppableId={columnId}>
        {(provided, snapshot) => (
          <div
            className={`p-4 rounded-lg bg-neo4j-light-gray shadow ${
              snapshot.isDraggingOver ? "bg-blue-50" : ""
            }`}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {column.items.map((task, index) => (
              <TaskItem
                key={task.id}
                task={task}
                index={index}
                users={users}
                assignUser={assignUser}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default ColumnItem;
