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

Check out branch [step-3](https://github.com/neo4j/kafka-connector-workshop/tree/step-3#step-3-provision-your-database)
and reload this README for further instructions.
