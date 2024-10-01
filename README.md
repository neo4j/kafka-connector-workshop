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

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
