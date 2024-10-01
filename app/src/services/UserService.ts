import Neo4jDriver from "../database/Neo4jDriver";
import {Driver, Record} from "neo4j-driver";

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
            const {records} = await this.driver.executeQuery(
                "MATCH (u:User) RETURN u ORDER BY u.creation_timestamp DESC",
                {},
                {
                    database: 'neo4j'
                }
            );
            return records.map((record) => mapUserData(record));
        } catch (error) {
            console.error("Error fetching users:", error);
            throw error;
        }
    }

    async create(name: string, emailAddress: string): Promise<User> {
        try {
            const {records} = await this.driver.executeQuery(
                "CREATE (u:User {name: $name, email_address: $emailAddress, creation_timestamp: timestamp()}) RETURN u",
                {name, emailAddress},
                {database: 'neo4j'}
            );
            return mapUserData(records[0]);
        } catch (error) {
            console.error("Error creating user:", error);
            throw error;
        }
    }

    async lookup(emailAddress: string): Promise<User> {
        try {
            const {records} = await this.driver.executeQuery(
                "MATCH (u:User {email_address: $emailAddress}) RETURN u",
                {emailAddress},
                {database: 'neo4j'}
            );

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
