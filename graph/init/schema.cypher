-- liquibase formatted cypher

-- changeset connectors-team:task-schema-init
 -- keys
CREATE CONSTRAINT task_uuid_key FOR (task:Task) REQUIRE task.uuid IS NODE KEY;
 -- mandatory properties
CREATE CONSTRAINT task_title_not_null FOR (task:Task) REQUIRE task.title IS NOT NULL;
CREATE CONSTRAINT task_creation_timestamp_not_null FOR (task:Task) REQUIRE task.creation_timestamp IS NOT NULL;
CREATE CONSTRAINT task_last_update_timestamp_not_null FOR (task:Task) REQUIRE task.last_update_timestamp IS NOT NULL;
 -- type constraints
CREATE CONSTRAINT task_uuid_type FOR (task:Task) REQUIRE task.uuid IS :: STRING;
CREATE CONSTRAINT task_title_type FOR (task:Task) REQUIRE task.title IS :: STRING;
CREATE CONSTRAINT task_description_type FOR (task:Task) REQUIRE task.description IS :: STRING;
CREATE CONSTRAINT task_creation_timestamp_type FOR (task:Task) REQUIRE task.creation_timestamp IS :: INTEGER;
CREATE CONSTRAINT task_last_update_timestamp_type FOR (task:Task) REQUIRE task.last_update_timestamp IS :: INTEGER;

-- changeset connectors-team:user-schema-init
 -- keys
CREATE CONSTRAINT user_email_address_key FOR (user:User) REQUIRE user.email_address IS NODE KEY;
 -- mandatory properties
CREATE CONSTRAINT user_name_not_null FOR (user:User) REQUIRE user.name IS NOT NULL;
CREATE CONSTRAINT user_creation_timestamp_not_null FOR (user:User) REQUIRE user.creation_timestamp IS NOT NULL;
 -- type constraints
CREATE CONSTRAINT user_email_address_type FOR (user:User) REQUIRE user.email_address IS :: STRING;
CREATE CONSTRAINT user_name_type FOR (user:User) REQUIRE user.name IS :: STRING;
CREATE CONSTRAINT user_creation_timestamp_type FOR (user:User) REQUIRE user.creation_timestamp IS :: INTEGER;

