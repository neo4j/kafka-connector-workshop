--liquibase formatted cypher

--changeset connectors-team:seed-data-init runAlways:true labels:seed
MERGE (ali:Seed:User {email_address: 'ali.ince@neo4j.com'})
ON CREATE SET
    ali.name = 'Ali',
    ali.creation_timestamp = timestamp();
MERGE (dhru:Seed:User {email_address: 'dhru.devalia@neo4j.com'})
ON CREATE SET
    dhru.name = 'Dhru',
    dhru.creation_timestamp = timestamp();
MERGE (emre:Seed:User {email_address: 'emre.hizal@neo4j.com'})
ON CREATE SET
    emre.name = 'Emre',
    emre.creation_timestamp = timestamp();
MERGE (eugene:Seed:User {email_address: 'eugene.rubanov@neo4j.com'})
ON CREATE SET
    eugene.name = 'Eugene',
    eugene.creation_timestamp = timestamp();
MERGE (florent:Seed:User {email_address: 'florent.biville@neo4j.com'})
ON CREATE SET
    florent.name = 'Florent',
    florent.creation_timestamp = timestamp();
MERGE (task:Seed:Task {title: 'A Sample Task'})
ON CREATE SET
    task.uuid = randomUUID(),
    task.description = 'In-te-res-ting!',
    task.creation_timestamp = timestamp(),
    task.last_update_timestamp = timestamp();
--rollback MATCH MATCH (seed:Seed) DETACH DELETE seed;

--changeset connectors-team:undo-seed-data-init runAlways:true labels:!seed
MATCH (seed:Seed) DETACH DELETE seed;
--rollback empty
