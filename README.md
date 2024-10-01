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

Checkout branch [step-1](https://github.com/neo4j/kafka-connector-workshop/tree/step-1), and reload this `README`.