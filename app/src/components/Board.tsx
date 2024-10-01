import React, { useEffect, useState } from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import TaskService, { Task, TaskStatus } from "../services/TaskService";
import ColumnItem from "./ColumnItem";
import CreateTaskModal from "./CreateTaskModal";
import { User } from "../services/UserService";
import _ from "lodash";

export type Column = { name: string; displayName: string; items: Task[] };
export type Columns = { [key in TaskStatus]: Column };

const initialData: Columns = {
  Incoming: {
    name: "Incoming",
    displayName: "Incoming",
    items: [],
  },
  InProgress: {
    name: "InProgress",
    displayName: "In Progress",
    items: [],
  },
  Completed: {
    name: "Completed",
    displayName: "Completed",
    items: [],
  },
};

interface BoardProps {
  users: User[];
  activeUser: User;
  taskService: TaskService;
}

const Board = ({ users, activeUser, taskService }: BoardProps) => {
  const [boardData, setBoardData] = useState<Columns>(initialData);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    initializeBoardData();
  }, []);

  const initializeBoardData = () => {
    taskService
      .fetch()
      .then((fetchedTasks) => {
        const updatedBoardData = _.cloneDeep(initialData);

        fetchedTasks.forEach((task) => {
          updatedBoardData[task.status].items = [
            ...updatedBoardData[task.status].items,
            task,
          ];
        });
        setBoardData(updatedBoardData);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const assignUser = (taskId: string, assignee: User) => {
    taskService
      .assign(taskId, assignee.emailAddress)
      .then(() => {
        const updatedBoardData = { ...boardData };

        Object.keys(updatedBoardData).forEach((columnId) => {
          const column = updatedBoardData[columnId as TaskStatus];
          const taskIndex = column.items.findIndex(
            (task) => task.id === taskId,
          );

          if (taskIndex !== -1) {
            column.items[taskIndex] = {
              ...column.items[taskIndex],
              assignee: assignee,
            };
          }
        });

        setBoardData(updatedBoardData);
      })
      .catch((error) => {
        console.log(error);
        initializeBoardData();
      });
  };

  const onDragEnd = async (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const sourceColumn = boardData[source.droppableId as TaskStatus];
    const destColumn = boardData[destination.droppableId as TaskStatus];
    const task = sourceColumn.items[source.index];

    if (source.droppableId === destination.droppableId) {
      const items = Array.from(destColumn.items);
      items.splice(source.index, 1);
      items.splice(destination.index, 0, task);
      setBoardData({
        ...boardData,
        [destination.droppableId]: { ...destColumn, items: items },
      });
      return;
    }

    const newSourceItems = Array.from(sourceColumn.items);
    newSourceItems.splice(source.index, 1);

    const newDestItems = Array.from(destColumn.items);
    newDestItems.splice(destination.index, 0, task);

    setBoardData({
      ...boardData,
      [source.droppableId]: { ...sourceColumn, items: newSourceItems },
      [destination.droppableId]: { ...destColumn, items: newDestItems },
    });

    taskService
      .transition(
        task.id,
        sourceColumn.name,
        destColumn.name,
        activeUser.emailAddress,
      )
      .catch((error) => {
        console.log(error);
        initializeBoardData();
      });
  };

  const handleCreateTask = async (title: string, description: string) => {
    taskService.create(title, description).then((createdTask) => {
      setIsModalOpen(false);
      setBoardData({
        ...boardData,
        Incoming: {
          ...boardData["Incoming"],
          items: [...boardData["Incoming"].items, createdTask],
        },
      });
    });
  };

  return (
    <div className="flex-col justify-center">
      <button
        className="bg-blue-500 text-white px-4 py-2 mb-4 rounded"
        onClick={() => setIsModalOpen(true)}
      >
        Create Task
      </button>
      <div className="flex justify-around min-h-screen">
        <DragDropContext onDragEnd={onDragEnd}>
          {Object.entries(boardData).map(([columnId, column]) => (
            <ColumnItem
              key={columnId}
              columnId={columnId}
              column={column}
              users={users}
              assignUser={assignUser}
            />
          ))}
        </DragDropContext>
        {isModalOpen && (
          <CreateTaskModal
            onCreate={handleCreateTask}
            onClose={() => setIsModalOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

export default Board;
