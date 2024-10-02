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
Either come up with a model of your own or see what we have designed by checking out
branch [step-2](https://github.com/neo4j/kafka-connector-workshop/tree/step-2#step-2-graph-model) and reloading this
`README`.

