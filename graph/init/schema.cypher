--liquibase formatted cypher

--changeset connectors-team:task-schema-init
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
--rollback DROP CONSTRAINT task_uuid_key;
--rollback DROP CONSTRAINT task_title_not_null;
--rollback DROP CONSTRAINT task_creation_timestamp_not_null;
--rollback DROP CONSTRAINT task_last_update_timestamp_not_null;
--rollback DROP CONSTRAINT task_uuid_type;
--rollback DROP CONSTRAINT task_title_type;
--rollback DROP CONSTRAINT task_description_type;
--rollback DROP CONSTRAINT task_creation_timestamp_type;
--rollback DROP CONSTRAINT task_last_update_timestamp_type;

--changeset connectors-team:user-schema-init
 -- keys
CREATE CONSTRAINT user_email_address_key FOR (user:User) REQUIRE user.email_address IS NODE KEY;
 -- mandatory properties
CREATE CONSTRAINT user_name_not_null FOR (user:User) REQUIRE user.name IS NOT NULL;
CREATE CONSTRAINT user_creation_timestamp_not_null FOR (user:User) REQUIRE user.creation_timestamp IS NOT NULL;
 -- type constraints
CREATE CONSTRAINT user_email_address_type FOR (user:User) REQUIRE user.email_address IS :: STRING;
CREATE CONSTRAINT user_name_type FOR (user:User) REQUIRE user.name IS :: STRING;
CREATE CONSTRAINT user_creation_timestamp_type FOR (user:User) REQUIRE user.creation_timestamp IS :: INTEGER;
--rollback DROP CONSTRAINT user_email_address_key;
--rollback DROP CONSTRAINT user_name_not_null;
--rollback DROP CONSTRAINT user_creation_timestamp_not_null;
--rollback DROP CONSTRAINT user_email_address_type;
--rollback DROP CONSTRAINT user_name_type;
--rollback DROP CONSTRAINT user_creation_timestamp_type;

--changeset connectors-team:transitioned-schema-init
 -- mandatory properties
CREATE CONSTRAINT transitioned_from_not_null FOR ()-[transitioned:TRANSITIONED]-() REQUIRE transitioned.from IS NOT NULL;
CREATE CONSTRAINT transitioned_to_not_null FOR (transitioned:TRANSITIONED) REQUIRE transitioned.to IS NOT NULL;
CREATE CONSTRAINT transitioned_creation_timestamp_not_null FOR ()-[transitioned:TRANSITIONED]-() REQUIRE transitioned.creation_timestamp IS NOT NULL;
 -- type constraints
CREATE CONSTRAINT transitioned_from_type FOR ()-[transitioned:TRANSITIONED]-() REQUIRE transitioned.from IS :: STRING;
CREATE CONSTRAINT transitioned_to_type FOR ()-[transitioned:TRANSITIONED]-() REQUIRE transitioned.to IS :: STRING;
CREATE CONSTRAINT transitioned_creation_timestamp_type FOR ()-[transitioned:TRANSITIONED]-() REQUIRE transitioned.creation_timestamp IS :: INTEGER;
--rollback DROP CONSTRAINT transitioned_from_not_null;
--rollback DROP CONSTRAINT transitioned_to_not_null;
--rollback DROP CONSTRAINT transitioned_creation_timestamp_not_null;
--rollback DROP CONSTRAINT transitioned_from_type;
--rollback DROP CONSTRAINT transitioned_to_type;
--rollback DROP CONSTRAINT transitioned_creation_timestamp_type;

--changeset connectors-team:assigned_to-schema-init
 -- mandatory properties
CREATE CONSTRAINT assigned_to_creation_timestamp_not_null FOR ()-[assigned_to:ASSIGNED_TO]-() REQUIRE assigned_to.creation_timestamp IS NOT NULL;
 -- type constraints
CREATE CONSTRAINT assigned_to_creation_timestamp_type FOR ()-[assigned_to:ASSIGNED_TO]-() REQUIRE assigned_to.creation_timestamp IS :: INTEGER;
--rollback DROP CONSTRAINT assigned_to_creation_timestamp_not_null;
--rollback DROP CONSTRAINT assigned_to_creation_timestamp_type;

--changeset connectors-team:watches-schema-init
 -- mandatory properties
CREATE CONSTRAINT watches_creation_timestamp_not_null FOR ()-[watches:WATCHES]-() REQUIRE watches.creation_timestamp IS NOT NULL;
 -- type constraints
CREATE CONSTRAINT watches_creation_timestamp_type FOR ()-[watches:WATCHES]-() REQUIRE watches.creation_timestamp IS :: INTEGER;
--rollback DROP CONSTRAINT watches_creation_timestamp_not_null;
--rollback DROP CONSTRAINT watches_creation_timestamp_type;

