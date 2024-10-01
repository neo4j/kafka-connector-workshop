import { User } from "./UserService";
import UserService from "./UserService";
import { v4 as uuidv4 } from "uuid";

export type TaskStatus = "Incoming" | "InProgress" | "Completed";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  assignee?: User;
}

const data: Task[] = [
  {
    id: "8dee1386-0601-4aaa-ac98-139d3254646a",
    title: "Prepare schema",
    description: "Workshop requires a graph schema",
    status: "Incoming",
    assignee: undefined,
  },
  {
    id: "ca4805e0-b084-4f66-a85c-773994c24f08",
    title: "Prepare seed data",
    description: "Workshop requires seed data",
    status: "Incoming",
    assignee: undefined,
  },
  {
    id: "5bec1895-fe5a-4bf8-af8d-32866e9dac86",
    title: "Prepare front end application",
    description: "Prepare a front end application",
    status: "Incoming",
    assignee: undefined,
  },
  {
    id: "10f4d293-d5c3-4c9a-84d0-fb73d99ce96b",
    title: "Prepare source connector",
    description: "Provision CDC source connector in Confluent Platform",
    status: "Incoming",
    assignee: undefined,
  },
];

class TaskService {
  async fetch(): Promise<Task[]> {
    return new Promise((resolve) => {
      resolve(data);
    });
  }

  async create(title: string, description: string): Promise<Task> {
    const task: Task = {
      id: uuidv4(),
      title: title,
      description: description,
      status: "Incoming",
      assignee: undefined,
    };

    data.push(task);

    return new Promise((resolve) => {
      resolve(task);
    });
  }

  async assign(taskId: string, userEmailAddress: string): Promise<Task> {
    return new Promise(async (resolve, reject) => {
      const user = await new UserService().lookup(userEmailAddress);
      if (!user) {
        reject("unable to find user");
      }

      const task = data.find((e) => e.id === taskId);
      if (!task) {
        reject("unable to find task");
      } else {
        task.assignee = user;
        resolve(task);
      }
    });
  }

  async transition(
    taskId: string,
    from: string,
    to: string,
    userEmailAddress: string,
  ): Promise<any> {
    return new Promise(async (resolve, reject) => {
      if (from === to) {
        resolve({});
      } else {
        const task = data.find((e) => e.id === taskId);
        if (!task) {
          reject("unable to find task");
        } else {
          task.status = to as TaskStatus;
          resolve(task);
        }
      }
    });
  }

  async closeSession(): Promise<void> {
    return new Promise((resolve) => {
      resolve();
    });
  }
}

export default TaskService;
