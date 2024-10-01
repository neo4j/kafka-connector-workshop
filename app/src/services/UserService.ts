import Neo4jDriver from "../database/Neo4jDriver";
import { Driver, Record } from "neo4j-driver";
import Cypher from "@neo4j/cypher-builder";

export interface User {
  name: string;
  emailAddress: string;
  creationTimestamp: Date;
}

const mapUserData = (record: Record): User => {
  const node = record.get("u");
  const properties = node.properties;

  return {
    name: properties.name,
    emailAddress: properties.email_address,
    creationTimestamp: new Date(properties.creation_timestamp.toNumber()),
  };
};

class UserService {
  private driver: Driver;

  constructor() {
    this.driver = Neo4jDriver.getInstance();
  }

  async fetch(): Promise<User[]> {
    try {
      const user = new Cypher.Node();
      const pattern = new Cypher.Pattern(user, { labels: ["User"] });
      const { cypher, params } = new Cypher.Match(pattern)
        .return([user, "u"])
        .orderBy([user.property("creation_timestamp"), "DESC"])
        .build();

      const { records } = await this.driver.executeQuery(cypher, params, {
        database: "neo4j",
      });
      return records.map((record) => mapUserData(record));
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  }

  async create(name: string, emailAddress: string): Promise<User> {
    try {
      const user = new Cypher.Node();
      const pattern = new Cypher.Pattern(user, { labels: ["User"] });
      const { cypher, params } = new Cypher.Create(pattern)
        .set([user.property("name"), new Cypher.Param(name)])
        .set([user.property("email_address"), new Cypher.Param(emailAddress)])
        .set([
          user.property("creation_timestamp"),
          new Cypher.Function("timestamp"),
        ])
        .return([user, "u"])
        .build();

      const { records } = await this.driver.executeQuery(cypher, params, {
        database: "neo4j",
      });
      return mapUserData(records[0]);
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  async lookup(emailAddress: string): Promise<User> {
    try {
      const user = new Cypher.Node();
      const pattern = new Cypher.Pattern(user, { labels: ["User"] });
      const { cypher, params } = new Cypher.Match(pattern)
        .where(
          Cypher.eq(
            user.property("email_address"),
            new Cypher.Param(emailAddress),
          ),
        )
        .return([user, "u"])
        .build();
      const { records } = await this.driver.executeQuery(cypher, params, {
        database: "neo4j",
      });

      if (records.length === 0) {
        new Error("User can not be found with email address: " + emailAddress);
      }
      return mapUserData(records[0]);
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }
}

export default UserService;
