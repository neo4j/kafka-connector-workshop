import neo4j, { Driver } from "neo4j-driver";

class Neo4jDriver {
  private static instance: Driver;

  public static getInstance(): Driver {
    if (!Neo4jDriver.instance) {
      Neo4jDriver.instance = neo4j.driver(
        "bolt://localhost:7689",
        neo4j.auth.basic("neo4j", "password"),
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
