import neo4j, { Driver } from "neo4j-driver";

class Neo4jDriver {
  private static instance: Driver;

  public static getInstance(): Driver {
    if (!Neo4jDriver.instance) {
      const uri = process.env.REACT_APP_NEO4J_URI || "bolt://localhost:7687";
      const user = process.env.REACT_APP_NEO4J_USERNAME || "neo4j";
      const password = process.env.REACT_APP_NEO4J_PASSWORD || "neo4j";

      Neo4jDriver.instance = neo4j.driver(
        uri,
        neo4j.auth.basic(user, password),
      );
    }
    return Neo4jDriver.instance;
  }

  public static async close(): Promise<void> {
    if (Neo4jDriver.instance) {
      await Neo4jDriver.instance.close();
      Neo4jDriver.instance = null as any;
    }
  }
}

export default Neo4jDriver;
