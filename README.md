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
