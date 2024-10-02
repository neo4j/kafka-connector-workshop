# Kafka Connector Workshop

In this workshop, we will build a very simple team-based task management application with the following requirements;

- Supports multiple users, allowing creation of new users and a simple login flow,
- New tasks can be created,
- Tasks can be assigned to a user,
- Each task can be in one of three states: Incoming, In Progress or Complete,
- When a task is assigned, the assignee will receive an email informing them of the assignment,
- When a task is created or its state is changed, the team will be informed through an email to a distribution list.

We will use an [Aura Virtual Dedicated Cloud](https://neo4j.com/product/auradb/) as a database and also make use
of [Confluent Cloud](https://www.confluent.io/confluent-cloud/) with Custom Connectors to build email capabilities to
the example application.

## Step 1: Understanding the Application

A front-end application with no connections to the database can be found in the `app` folder.
This application has been implemented using TypeScript and React wired to fake data.

In order to run the application, first make sure you have
an [LTS version of Node.js](https://nodejs.org/en/download/package-manager) installed.

First, change working directory to `app` folder:

```shell
cd app
```

Install required dependencies:

```shell
npm install
```

Start the application:

```shell
npm start
```

which will start your default browser.

You can log in using the email address `neo4j.connectors+workshop@gmail.com` and interact with fake data.
Feel free to browse the source code and familiarize yourself with the components.

## Step 2: Graph Model

What would be a good graph model for this application?

Although we could come up with a dozen of different models, what we have decided to follow can be seen in the below
image.

![Data Model](images/data-model.png "Data Model")

In a few sentences;

- We will have `User` nodes, which will only have `name`, `email_address` and `creation_timestamp` properties. Node key
  will be created on `email_address` property.
- We will have `Task` nodes, which will only have `uuid`, `title`, `description`, `creation_timestamp` and
  `last_update_timestamp` properties. Node key will be created on `uuid` property.
- Task status will be stored as an additional label on `Task` nodes.
- Every new task will have both `Task` and `Incoming` labels, and `Incoming` label will be replaced with `InProgress`
  and `Completed` based on the transitioned state.
- Assignment of tasks will be stored as `ASSIGNED_TO` typed relationships from `Task` to `User`.
- State transitions will be stored as `TRANSITIONED` typed relationships originating from `User` to `Task`. Old and new
  states will be reflected in `from` and `to` properties.
- Relationships will not be updatable, so we decided to only keep `creation_timestamp` property in relationships.
- We modeled a `WATCHES` relationship as well, which has no corresponding implementation in the exercise. Feel free to
  use it as an improvement on your own.

## Step 3: Provision your database

We need a database :smiley:.

Since we will be using [Change Data Capture](https://neo4j.com/docs/cdc) feature, we either need an existing Aura
Virtual Dedicated Cloud instance or spawn up our database locally using docker.

### Get a database

#### Option 1: Aura Virtual Dedicated Cloud

If you have access to an existing Aura VDC instance for development purposes, please head over
to [Aura Console](https://console.neo4j.io) and [enable CDC](https://neo4j.com/docs/cdc/current/get-started/aura/) on
your instance.

#### Option 2: Docker Compose

Otherwise, ensure that you have a recent version of `Docker Desktop` and `Docker Compose` installed on your computer and
launch all the services we will require throughout this workshop.

First, change directory to `docker` folder:

```shell
cd docker
```

Launch all the services, including latest version Neo4j and Confluent Platform components.

```shell
docker compose up -d
```

Wait until all components are up and running, and are reported healthy.

```shell
docker compose ps
```

You can now access your neo4j browser at `http://localhost:7474` with username `neo4j` and password `password`.
You can change these defaults in the `docker/docker-compose.yml` file.

[Enable CDC](https://neo4j.com/docs/cdc/current/get-started/self-managed/) on your database by issuing the following
statement in Neo4j Browser.

```cypher

ALTER DATABASE neo4j SET OPTION txLogEnrichment 'FULL' WAIT;
```

### Create schema and seed data

We have prepared some Liquibase change sets that initialize the required constraints for our graph model, and optionally
introduce some seed data.

#### Setup

For this, install [Liquibase](https://www.liquibase.com/download).

> `brew install liquibase` works like a charm on Mac OS.

Download [the latest Neo4j plugin release](https://github.com/liquibase/liquibase-neo4j/releases/download/v4.29.2/liquibase-neo4j-4.29.2-full.jar)
and copy it to Liquibase `lib/` folder.

> With Homebrew, this will be a path like `$(brew --prefix)/Cellar/liquibase/4.29.2/libexec/lib`.

#### Run

Now, you can run the following script:

```
./graph/run.sh <URI> <PASSWORD>
```

If you want seed data:

```
./graph/run.sh <URI> <PASSWORD> 1
```

> If you do not pass `1`, any pre-existing seed data will be removed!

For instance:

```
./graph/run.sh 'bolt://localhost' 'password' 1
```

#### Database Reset

Run:

```
liquibase rollback --tag=v0 --changelog-file ./graph/main.xml --url jdbc:neo4j:<URI> --username neo4j --password <PASSWORD>
```

## Step 4: Wire application to the database

It's fun time :tada:.

We already wired login, user list and create user flows to the database as an example. Please feel free to
play with it yourself, and take a stab on completing the task flows by yourself.

First, make sure you have installed new dependencies:

```shell
cd app
npm install
```

Then, configure Neo4j connection parameters inside an `.env.local` file:

```shell
cat > .env.local <<EOF
REACT_APP_NEO4J_URI=<URI>
REACT_APP_NEO4J_USERNAME=<USERNAME>
REACT_APP_NEO4J_PASSWORD=<PASSWORD>
EOF
```

Finally, you can start the application and see the user flows hitting the database.

```shell
npm start
```

As a starting point, we removed fake data from `UserService` and updated all functions to query the database. We used
the following best practices while doing so:

1. We have introduced a singleton `Neo4jDriver` object that holds a reference to an application wide driver object.
2. Used `@neo4j/cypher-builder` to build our Cypher statements, which allows us to build more secure applications by
   avoiding string concatenation. Refer
   to [Cypher Builder docs](https://neo4j.github.io/cypher-builder/cypher-builder/current/) for more information.
3. Used `Driver` object's `executeQuery` function to run actual queries against the database.

## Step 5: Completed application

Please take your time and play with it.

We now have a fully working front end application.

## Step 6: Create CDC source connector

Next step is to create an instance of Neo4j Connector for Confluent source connector that uses CDC to capture changes
happening in the database. Refer to [Neo4j Connector for Kafka](https://neo4j.com/docs/kafka) documentation for more
information about the connector and how to install and configure it.

### Install connector

#### Option 1: Confluent Cloud

If you have access to a Confluent Cloud account, you can grab the
latest [Neo4j Connector for Confluent](https://www.confluent.io/hub/neo4j/kafka-connect-neo4j) connector version and
create a custom connector on the platform.

#### Option 2: Docker

Grab the latest version of the JAR distribution of the Neo4j Connector for Kafka
from [Github Releases page](https://github.com/neo4j/neo4j-kafka-connector/releases) and copy it into `docker/plugins`
folder.
You need to relaunch the Kafka Connect container for it to pick up the changes.

```bash
cd docker
docker compose restart connect
```

### Create connector instance

A sample source connector configuration that we have created is as follows:

For Confluent Cloud Custom connector:

```json
{
  "confluent.custom.schema.registry.auto": "true",
  "key.converter": "io.confluent.connect.avro.AvroConverter",
  "value.converter": "io.confluent.connect.avro.AvroConverter",
  "neo4j.uri": "<change with neo4j uri>",
  "neo4j.authentication.basic.username": "<change with neo4j username>",
  "neo4j.authentication.basic.password": "<change with neo4j password>",
  "neo4j.source-strategy": "CDC",
  "neo4j.start-from": "EARLIEST",
  "neo4j.cdc.poll-interval": "5s",
  "neo4j.cdc.topic.task-assigned.key-strategy": "ENTITY_KEYS",
  "neo4j.cdc.topic.task-assigned.value-strategy": "ENTITY_EVENT",
  "neo4j.cdc.topic.task-assigned.patterns.0.operation": "create",
  "neo4j.cdc.topic.task-assigned.patterns.0.pattern": "(:Task)-[:ASSIGNED_TO]->(:User)",
  "neo4j.cdc.topic.task-created.key-strategy": "ENTITY_KEYS",
  "neo4j.cdc.topic.task-created.value-strategy": "ENTITY_EVENT",
  "neo4j.cdc.topic.task-created.patterns.0.operation": "create",
  "neo4j.cdc.topic.task-created.patterns.0.pattern": "(:Task:Incoming)",
  "neo4j.cdc.topic.task-transitioned.key-strategy": "ENTITY_KEYS",
  "neo4j.cdc.topic.task-transitioned.value-strategy": "ENTITY_EVENT",
  "neo4j.cdc.topic.task-transitioned.patterns.0.operation": "create",
  "neo4j.cdc.topic.task-transitioned.patterns.0.pattern": "(:User)-[:TRANSITIONED]->(:Task)",
  "neo4j.cdc.topic.tasks.key-strategy": "ENTITY_KEYS",
  "neo4j.cdc.topic.tasks.value-strategy": "ENTITY_EVENT",
  "neo4j.cdc.topic.tasks.patterns.0.operation": "create",
  "neo4j.cdc.topic.tasks.patterns.0.pattern": "(:Task)",
  "neo4j.cdc.topic.users.key-strategy": "ENTITY_KEYS",
  "neo4j.cdc.topic.users.value-strategy": "ENTITY_EVENT",
  "neo4j.cdc.topic.users.patterns.0.operation": "create",
  "neo4j.cdc.topic.users.patterns.0.pattern": "(:User)"
}
```

For Docker compose connector:

```json
{
  "name": "TasksSourceConnector",
  "config": {
    "connector.class": "org.neo4j.connectors.kafka.source.Neo4jConnector",
    "key.converter": "io.confluent.connect.avro.AvroConverter",
    "key.converter.schema.registry.url": "<change with your schema registry url>",
    "value.converter": "io.confluent.connect.avro.AvroConverter",
    "value.converter.schema.registry.url": "<change with your schema registry url>",
    "neo4j.uri": "<change with neo4j uri>",
    "neo4j.authentication.basic.username": "<change with neo4j username>",
    "neo4j.authentication.basic.password": "<change with neo4j password>",
    "neo4j.source-strategy": "CDC",
    "neo4j.start-from": "EARLIEST",
    "neo4j.cdc.poll-interval": "5s",
    "neo4j.cdc.topic.task-assigned.key-strategy": "ENTITY_KEYS",
    "neo4j.cdc.topic.task-assigned.value-strategy": "ENTITY_EVENT",
    "neo4j.cdc.topic.task-assigned.patterns.0.operation": "create",
    "neo4j.cdc.topic.task-assigned.patterns.0.pattern": "(:Task)-[:ASSIGNED_TO]->(:User)",
    "neo4j.cdc.topic.task-created.key-strategy": "ENTITY_KEYS",
    "neo4j.cdc.topic.task-created.value-strategy": "ENTITY_EVENT",
    "neo4j.cdc.topic.task-created.patterns.0.operation": "create",
    "neo4j.cdc.topic.task-created.patterns.0.pattern": "(:Task:Incoming)",
    "neo4j.cdc.topic.task-transitioned.key-strategy": "ENTITY_KEYS",
    "neo4j.cdc.topic.task-transitioned.value-strategy": "ENTITY_EVENT",
    "neo4j.cdc.topic.task-transitioned.patterns.0.operation": "create",
    "neo4j.cdc.topic.task-transitioned.patterns.0.pattern": "(:User)-[:TRANSITIONED]->(:Task)",
    "neo4j.cdc.topic.tasks.key-strategy": "ENTITY_KEYS",
    "neo4j.cdc.topic.tasks.value-strategy": "ENTITY_EVENT",
    "neo4j.cdc.topic.tasks.patterns.0.operation": "create",
    "neo4j.cdc.topic.tasks.patterns.0.pattern": "(:Task)",
    "neo4j.cdc.topic.users.key-strategy": "ENTITY_KEYS",
    "neo4j.cdc.topic.users.value-strategy": "ENTITY_EVENT",
    "neo4j.cdc.topic.users.patterns.0.operation": "create",
    "neo4j.cdc.topic.users.patterns.0.pattern": "(:User)",
    "neo4j.cdc.topic.watches.key-strategy": "ENTITY_KEYS",
    "neo4j.cdc.topic.watches.value-strategy": "ENTITY_EVENT",
    "neo4j.cdc.topic.watches.patterns": "(:User)-[:WATCHES]->(:Task)"
  }
}
```

Do not forget to replace the configuration values that's wrapped inside `<>` (including diamonds) based on your
environment. Now that you have edited the configuration, you can go ahead and create an instance of our source
connector. Refer to [Neo4j Connector for Kafka > Quickstart](https://neo4j.com/docs/kafka/current/) for more information
about how to create an instance.

Verify that everything is up and running, and you have messages in the configured Kafka topics.

## Step 7: Install SMTP sink connector

Now that we have our source connector delivering messages into Kafka topics, it's time to look into how to curate email
notifications out of this data.

We will use a forked and updated version of [kafka-connect-email](https://github.com/wardziniak/kafka-connect-email)
connector, which can be found [here](https://github.com/ali-ince/kafka-connect-email/tree/modernize-connector). Feel
free to download and build a JAR out of it by running `sbt assembly` there, or you can download one
from [releases page](https://github.com/ali-ince/kafka-connect-email/releases/tag/workshop).

Install the connector in the same way you did in Step 6.

### Create connector instance

A sample sink connector configuration that we have created is as follows:

```json
{
  "name": "SendEmailConnector",
  "config": {
    "topics": "outgoing-email",
    "connector.class": "com.wardziniak.kafka.connect.email.EmailSinkConnector",
    "key.converter": "org.apache.kafka.connect.storage.StringConverter",
    "key.converter.schemas.enable": "false",
    "value.converter": "org.apache.kafka.connect.json.JsonConverter",
    "value.converter.schemas.enable": "false",
    "wardziniak.email.connect.hostname": "<replace with your smtp host>",
    "wardziniak.email.connect.smtp.port": "<replace with your smtp port>",
    "wardziniak.email.connect.from.address": "<replace with your from address>",
    "wardziniak.email.connect.username": "<replace with your smtp username>",
    "wardziniak.email.connect.password": "<replace with your smtp password>"
  }
}
```

Do not forget to replace the configuration values that's wrapped inside `<>` (including diamonds) based on your
environment. Now that you have edited the configuration, you can go ahead and create an instance of our sink
connector.

## Step 8: Transform CDC events into email messages

Our CDC events published into `users`, `tasks`, `task-created`, `task-assigned` and `task-transitioned` topics are not
directly usable by our SMTP connector. We will use KSQL capabilities to transform these events into simple JSON messages
that the SMTP connector expects.

Open a KSQL console and start our multistep transformations.

### Create lookup table for users

```sql
SET 'auto.offset.reset' = 'earliest';

create stream users_stream with (kafka_topic='users',key_format='avro',value_format='avro');

create stream users_stream_reshaped with (key_format='avro', value_format='avro') as
select rowkey,
       rowkey->KEYS->USER[1]->EMAIL_ADDRESS->S as EMAIL_ADDRESS,
       STATE->AFTER->`PROPERTIES`['name']->S as NAME
from users_stream;

create stream users_extracted with (kafka_topic='users-extracted', key_format='avro', value_format='avro') as
select EMAIL_ADDRESS, 
       NAME
from users_stream_reshaped
partition by email_address;

create source table users_table 
    (EMAIL_ADDRESS VARCHAR PRIMARY KEY, NAME VARCHAR)
with (kafka_topic='users-extracted', key_format='avro', value_format='avro');
```

### Create lookup table for tasks

```sql
SET 'auto.offset.reset' = 'earliest';
    
create stream tasks_stream with (kafka_topic='tasks', key_format='avro', value_format='avro');

create stream tasks_stream_reshaped with (key_format='avro', value_format='avro') as
select rowkey,
       rowkey->KEYS->TASK[1]->UUID->S as UUID,
       STATE->AFTER->`PROPERTIES`['title']->S as TITLE,
       STATE->AFTER->`PROPERTIES`['description']->S as DESCRIPTION
from tasks_stream;

create stream tasks_extracted with (kafka_topic='tasks-extracted', key_format='avro', value_format='avro') as
select UUID, 
       TITLE, 
       DESCRIPTION
from tasks_stream_reshaped partition by uuid;

create source table tasks_table 
    (UUID VARCHAR PRIMARY KEY, TITLE VARCHAR, DESCRIPTION VARCHAR) 
with (kafka_topic='tasks-extracted', key_format='avro', value_format='avro');
```

### Generate email messages for task-created events

```sql
SET 'auto.offset.reset' = 'earliest';
    
create stream task_created_stream with (kafka_topic='task-created', key_format='avro', value_format='avro');

create stream task_created_stream_reshaped with (key_format='avro', value_format='avro') as
select ELEMENTID,
       rowkey,
       rowkey->keys->TASK[1]->UUID->S as UUID,
       state->after->`PROPERTIES`['title']->S as TITLE,
       state->after->`PROPERTIES`['description']->S as DESCRIPTION
from task_created_stream;

create stream task_created_email with (kafka_topic='outgoing-email', key_format='json', value_format='json') as
select UUID,
       'New task' as `title`,
       'A new task is created with title "' + TITLE + '" and description "' + DESCRIPTION + '".' as `body`,
       ARRAY[MAP('name' := 'Connectors Team', 'emailAddress' := 'connectors-workshop@neo4j.com')] as `toRecipients`
from task_created_stream_reshaped
partition by UUID;
```

### Generate email messages for task-assigned events

```sql
SET 'auto.offset.reset' = 'earliest';
    
create stream task_assigned_stream with (kafka_topic='task-assigned', value_format='avro');

create stream task_assigned_stream_reshaped as
select ELEMENTID,
       `START`->keys->TASK[1]->UUID->S as TASK_UUID,
       `END`->keys->USER[1]->EMAIL_ADDRESS->S as USER_EMAIL_ADDRESS
from task_assigned_stream;

create stream task_assigned_email with (kafka_topic='outgoing-email', key_format='JSON', value_format='JSON') as
select a.TASK_UUID,
       'A task is assigned to you' as `title`,
       'Task "' + t.TITLE + '" is assigned to you.' as `body`,
       ARRAY[MAP('name' := u.NAME, 'emailAddress' := u.EMAIL_ADDRESS)] as `toRecipients`
from task_assigned_stream_reshaped a
         INNER JOIN tasks_table t ON t.UUID = a.TASK_UUID
         INNER JOIN users_table u on u.EMAIL_ADDRESS = a.USER_EMAIL_ADDRESS
partition by a.TASK_UUID;

create stream task_assigned_email_list with (kafka_topic='outgoing-email', key_format='JSON', value_format='JSON') as
select a.TASK_UUID,
       'Task is assigned' as `title`,
       'Task "' + t.TITLE + '" is assigned to "' + u.NAME + '".' as `body`,
       ARRAY[MAP('name' := 'Connectors Team', 'emailAddress' := 'connectors-workshop@neo4j.com')] as `toRecipients`
from task_assigned_stream_reshaped a
         INNER JOIN tasks_table t ON t.UUID = a.TASK_UUID
         INNER JOIN users_table u on u.EMAIL_ADDRESS = a.USER_EMAIL_ADDRESS PARTITION BY a.TASK_UUID;
partition by a.TASK_UUID;
```

### Generate email messages for task-transitioned events

```sql
SET 'auto.offset.reset' = 'earliest';
    
create stream task_transitioned_stream with (kafka_topic='task-transitioned', value_format='avro');

create stream task_transitioned_stream_reshaped as
select ELEMENTID,
       `START`->keys->USER[1]->EMAIL_ADDRESS->S as USER_EMAIL_ADDRESS,
       `END`->keys->TASK[1]->UUID->S as TASK_UUID,
       state->after->`PROPERTIES`['from']->S as FROM_STATE,
       state->after->`PROPERTIES`['to']->S as TO_STATE
from task_transitioned_stream;

create stream task_transitioned_email with (kafka_topic='outgoing-email', key_format='JSON', value_format='JSON') as
select s.TASK_UUID,
       'Task status updated' as `title`,
       'Task "' + t.TITLE + '" has transitioned it''s status from ' + s.FROM_STATE + ' to ' + s.TO_STATE + '.' as `body`,
       ARRAY[MAP('name' := 'Connectors Team', 'emailAddress' := 'connectors-workshop@neo4j.com')] as `toRecipients`
from task_transitioned_stream_reshaped s
    INNER JOIN tasks_table t ON t.UUID = s.TASK_UUID
partition by s.TASK_UUID;
```