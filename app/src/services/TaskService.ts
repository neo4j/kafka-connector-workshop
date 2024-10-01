import Neo4jDriver from "../database/Neo4jDriver";
import { Driver, Record } from "neo4j-driver";
import { User } from "./UserService";
import Cypher from "@neo4j/cypher-builder";

export type TaskStatus = "Incoming" | "InProgress" | "Completed";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  assignee?: User;
}

const mapFetchData = (record: Record): Task => {
  const task = record.get("task");
  const { uuid, title, description } = task.properties;

  let assignee = undefined;
  const a = record.get("assignee");
  if (a) {
    const { name, email_address, creation_timestamp } = a.properties;
    assignee = {
      name: name,
      emailAddress: email_address,
      creationTimestamp: new Date(creation_timestamp.toNumber()),
    };
  }

  let status = undefined;
  const transition = record.get("transition");
  if (!transition) {
    if (task.labels.includes("Incoming")) {
      status = "Incoming";
    } else {
      throw new Error("Task has no valid status or status label.");
    }
  } else {
    status = transition.properties["to"];
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
  private driver: Driver;

  constructor() {
    this.driver = Neo4jDriver.getInstance();
  }

  async fetch(): Promise<Task[]> {
    try {
      const task = new Cypher.Node();
      const assigned = new Cypher.Relationship();
      const assignee = new Cypher.Node();
      const transitioned = new Cypher.Relationship();
      const taskPattern = new Cypher.Pattern(task, { labels: ["Task"] });
      const taskNamed = new Cypher.NamedVariable("task");
      const assignees = new Cypher.Variable();
      const transitions = new Cypher.Variable();

      const assignedToSubQuery = new Cypher.Match(
        new Cypher.Pattern(task)
          .related(assigned, { type: "ASSIGNED_TO" })
          .to(assignee, { labels: ["User"] }),
      )
        .return(assignee)
        .orderBy([assigned.property("creation_timestamp"), "DESC"]);
      const transitionSubQuery = new Cypher.Match(
        new Cypher.Pattern({ labels: ["User"] })
          .related(transitioned, { type: "TRANSITIONED" })
          .to(task),
      )
        .return(transitioned)
        .orderBy([transitioned.property("creation_timestamp"), "DESC"]);

      const { cypher, params } = new Cypher.Match(taskPattern)
        .with(
          new Cypher.With(
            [task, taskNamed],
            [new Cypher.Collect(assignedToSubQuery), assignees],
            [new Cypher.Collect(transitionSubQuery), transitions],
          ),
        )
        .return(
          taskNamed,
          [assignees.index(0), "assignee"],
          [transitions.index(0), "transition"],
        )
        .build();

      const { records } = await this.driver.executeQuery(cypher, params, {
        database: "neo4j",
      });

      return records.map((record) => mapFetchData(record));
    } catch (error) {
      console.error("Error fetching tasks:", error);
      throw error;
    }
  }

  async create(title: string, description: string): Promise<Task> {
    try {
      const task = new Cypher.Node();
      const pattern = new Cypher.Pattern(task, {
        labels: ["Task", "Incoming"],
        properties: {
          uuid: new Cypher.Function("randomUUID"),
          title: new Cypher.Param(title),
          description: new Cypher.Param(description),
          creation_timestamp: new Cypher.Function("timestamp"),
          last_update_timestamp: new Cypher.Function("timestamp"),
        },
      });
      const { cypher, params } = new Cypher.Create(pattern)
        .return([task, "t"])
        .build();

      const { records } = await this.driver.executeQuery(cypher, params, {
        database: "neo4j",
      });

      return mapCreateData(records[0]);
    } catch (error) {
      console.error("Error creating task:", error);
      throw error;
    }
  }

  async assign(taskId: string, userEmailAddress: string): Promise<Task> {
    try {
      const task = new Cypher.Node();
      const assignee = new Cypher.Node();

      const { cypher, params } = new Cypher.Match(
        new Cypher.Pattern(task, {
          labels: ["Task"],
          properties: { uuid: new Cypher.Param(taskId) },
        }),
      )
        .match(
          new Cypher.Pattern(assignee, {
            labels: ["User"],
            properties: { email_address: new Cypher.Param(userEmailAddress) },
          }),
        )
        .merge(
          new Cypher.Pattern(task)
            .related({
              type: "ASSIGNED_TO",
              properties: {
                creation_timestamp: new Cypher.Function("timestamp"),
              },
            })
            .to(assignee),
        )
        .return([task, "t"])
        .build();

      const { records } = await this.driver.executeQuery(cypher, params, {
        database: "neo4j",
      });

      return mapCreateData(records[0]);
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
      const user = new Cypher.Node();
      const task = new Cypher.NamedNode("t");
      const transitioned = new Cypher.Relationship();

      const { cypher, params } = new Cypher.Match(
        new Cypher.Pattern(task, {
          labels: ["Task"],
          properties: { uuid: new Cypher.Param(taskId) },
        }),
      )
        .match(
          new Cypher.Pattern(user, {
            labels: ["User"],
            properties: { email_address: new Cypher.Param(userEmailAddress) },
          }),
        )
        .merge(
          new Cypher.Pattern(user)
            .related(transitioned, {
              type: "TRANSITIONED",
              properties: {
                from: new Cypher.Param(from),
                to: new Cypher.Param(to),
                creation_timestamp: new Cypher.Function("timestamp"),
              },
            })
            .to(task),
        )
        .return([transitioned, "r"])
        .build();

      const { records } = await this.driver.executeQuery(cypher, params, {
        database: "neo4j",
      });

      if (records.length === 0) {
        new Error("No relationship was created.");
      }

      return records[0].get("r");
    } catch (error) {
      console.error("Error transitioning task:", error);
      throw error;
    }
  }
}

export default TaskService;
