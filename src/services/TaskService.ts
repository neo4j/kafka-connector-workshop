import Neo4jDriver from "../database/Neo4jDriver";
import { Record } from "neo4j-driver";
import { User } from "./UserService";

export type TaskStatus = "Incoming" | "InProgress" | "Completed";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  assignee?: User;
}

const mapFetchData = (record: Record): Task => {
  const t = record.get("t");
  const { uuid, title, description } = t.properties;

  let assignee = undefined;
  const a = record.get("a");
  if (a) {
    const { name, email_address, creation_timestamp } = a.properties;
    assignee = {
      name: name,
      emailAddress: email_address,
      creationTimestamp: creation_timestamp,
    };
  }

  let status: TaskStatus = record.get("status");
  if (!status) {
    if (t.labels.includes("Incoming")) {
      status = "Incoming";
    } else {
      throw new Error("Task has no valid status or status label.");
    }
  }

  return {
    id: uuid,
    title: title,
    description: description,
    status: status,
    assignee: assignee,
  };
};

const mapCreateData = (record: Record): Task => {
  const t = record.get("t");
  const { uuid, title, description } = t.properties;
  return {
    id: uuid,
    title: title,
    description: description,
    status: "Incoming",
  };
};

class TaskService {
  private session;

  constructor() {
    this.session = Neo4jDriver.getInstance().session();
  }

  async fetch(): Promise<Task[]> {
    try {
      const result = await this.session.run(
        "MATCH (t:Task)\n" +
          "OPTIONAL MATCH (u:User)-[transitioned:TRANSITIONED]->(t)\n" +
          "OPTIONAL MATCH (t)-[assignedTo:ASSIGNED_TO]->(assignee:User)\n" +
          "WITH t, transitioned, assignee, assignedTo\n" +
          "ORDER BY transitioned.creation_timestamp DESC, assignedTo.creation_timestamp DESC\n" +
          "WITH t, COLLECT(DISTINCT transitioned)[0] AS latestTransition, COLLECT(DISTINCT assignee)[0] AS latestAssignee\n" +
          "RETURN t, latestTransition.to AS status, latestAssignee AS a",
      );

      return result.records.map((record) => mapFetchData(record));
    } catch (error) {
      console.error("Error fetching tasks:", error);
      throw error;
    }
  }

  async create(title: string, description: string): Promise<Task> {
    try {
      const result = await this.session.run(
        "CREATE (t:Task:Incoming {uuid: randomUUID(), title: $title, description: $description, " +
          "creation_timestamp: timestamp(), last_update_timestamp: timestamp()})\n" +
          "RETURN t",
        { title, description },
      );
      return mapCreateData(result.records[0]);
    } catch (error) {
      console.error("Error creating task:", error);
      throw error;
    }
  }

  async assign(taskId: string, userEmailAddress: string): Promise<Task> {
    try {
      const result = await this.session.run(
        "MATCH (t:Task {uuid: $taskId})\n" +
          "MATCH (u:User {email_address: $userEmailAddress})\n" +
          "MERGE (t)-[r:ASSIGNED_TO {creation_timestamp: timestamp()}]->(u)\n" +
          "RETURN t",
        { taskId, userEmailAddress },
      );
      return mapCreateData(result.records[0]);
    } catch (error) {
      console.error("Error creating task:", error);
      throw error;
    }
  }

  async transition(
    taskId: string,
    from: string,
    to: string,
    userEmailAddress: string,
  ): Promise<any> {
    if (from === to) {
      return;
    }
    try {
      const result = await this.session.run(
        "MATCH (t:Task {uuid: $taskId})\n" +
          "MATCH (u:User {email_address: $userEmailAddress})\n" +
          "MERGE (u)-[r:TRANSITIONED {from: $from, to: $to, creation_timestamp: timestamp()}]->(t)\n" +
          "RETURN r",
        { taskId, from, to, userEmailAddress },
      );
      if (result.records.length === 0) {
        new Error("No relationship was created.");
      }
      return result.records[0].get("r");
    } catch (error) {
      console.error("Error transitioning task:", error);
      throw error;
    }
  }

  async closeSession(): Promise<void> {
    await this.session.close();
  }
}

export default TaskService;
