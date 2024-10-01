import Neo4jDriver from "../database/Neo4jDriver";
import { Record } from "neo4j-driver";

export interface User {
  name: string;
  emailAddress: string;
  creationTimestamp: string;
}

const mapUserData = (record: Record): User => {
  const node = record.get("u");
  const properties = node.properties;

  return {
    name: properties.name,
    emailAddress: properties.email_address,
    creationTimestamp: properties.creation_timestamp,
  };
};

class UserService {
  private session;

  constructor() {
    this.session = Neo4jDriver.getInstance().session();
  }

  async fetch(): Promise<User[]> {
    try {
      const result = await this.session.run(
        "MATCH (u:User) RETURN u ORDER BY u.creation_timestamp DESC",
      );
      return result.records.map((record) => mapUserData(record));
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  }

  async create(name: string, emailAddress: string): Promise<User> {
    try {
      const result = await this.session.run(
        "CREATE (u:User {name: $name, email_address: $emailAddress, creation_timestamp: timestamp()}) RETURN u",
        { name, emailAddress },
      );
      return mapUserData(result.records[0]);
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  async lookup(emailAddress: string): Promise<User> {
    try {
      const result = await this.session.run(
        "MATCH (u:User {email_address: $emailAddress}) RETURN u",
        { emailAddress },
      );

      if (result.records.length === 0) {
        new Error("User can not be found with email address: " + emailAddress);
      }
      return mapUserData(result.records[0]);
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }
}

export default UserService;
