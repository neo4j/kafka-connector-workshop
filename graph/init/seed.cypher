-- liquibase formatted cypher

-- changeset connectors-team:seed-data-init labels:seed
CREATE (:Seed:User {
    name: 'Ali',
    email_address: 'ali.ince@neo4j.com',
    creation_timestamp: timestamp()
});
CREATE (:Seed:User {
    name: 'Dhru',
    email_address: 'dhru.devalia@neo4j.com',
    creation_timestamp: timestamp()
});
CREATE (:Seed:User {
    name: 'Emre',
    email_address: 'emre.hizal@neo4j.com',
    creation_timestamp: timestamp()
});
CREATE (:Seed:User {
    name: 'Eugene',
    email_address: 'eugene.rubanov@neo4j.com',
    creation_timestamp: timestamp()
});
CREATE (:Seed:User {
    name: 'Florent',
    email_address: 'florent.biville@neo4j.com',
    creation_timestamp: timestamp()
});
CREATE (:Seed:Task {
    uuid: randomUUID(),
    title: 'A Sample Task',
    description: 'In-te-res-ting!',
    creation_timestamp: timestamp(),
    last_update_timestamp: timestamp()
});

-- changeset connectors-team:undo-seed-data-init runAlways:true labels:!seed
MATCH (seed:Seed) DETACH DELETE seed;
