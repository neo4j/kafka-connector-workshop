# Kafka Connector Workshop

## Graph Versioning

### Setup

For this, install [Liquibase](https://www.liquibase.com/download).

> `brew install liquibase` works like a charm on Mac OS.

Download [the latest Neo4j plugin release](https://github.com/liquibase/liquibase-neo4j/releases/download/v4.29.2/liquibase-neo4j-4.29.2-full.jar) and copy it to Liquibase `lib/` folder.

> With Homebrew, this will be a path like `$(brew --prefix)/Cellar/liquibase/4.29.2/libexec/lib`.

### Run

Now, you can run the following script:

```
./graph/run.sh <URI> <PASSWORD>
```

If you want seed data:

```
./graph/run.sh <URI> <PASSWORD> 1
```

> If you do not pass `1`, any pre-existing seed data will be removed!

### Database Reset

Run:

```
liquibase rollback --tag=v0 --changelog-file ./graph/main.xml --url jdbc:neo4j:<URI> --username neo4j --password <PASSWORD>
```

# Getting Started with Create React App

## Prerequisites

Make sure you have the following installed on your machine:

- Node.js
- npm (Node Package Manager)

## Getting Started

1. **Install Dependencies**

   After cloning the repository, navigate to the project directory and install the required dependencies:

   ```shell
   npm install

2. **Setup Environment Variables**

   Create a `.env.local` file in the root directory of the project with the following content:

   ```
   REACT_APP_NEO4J_URI=<URI>
   REACT_APP_NEO4J_USERNAME=<USERNAME>
   REACT_APP_NEO4J_PASSWORD=<PASSWORD>
   ```
   Update these values based on your Neo4j environment configuration.

3. **Install Dependencies**

   Start the development server:

   ```shell
   npm start
