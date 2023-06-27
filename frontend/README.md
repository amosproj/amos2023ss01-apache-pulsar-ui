# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn install`

Installs all dependencies

### `yarn start`

Runs the app in the development mode.\
Open [http://backend:3000](http://backend:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn lint`

Executes ESLint and shows you the linting errors.

### `yarn lint --fix`

Executes the `eslint --fix` command which should handle all fixable linting errors

### `yarn format`

Executes prettier and formats code according to our predefined style. Fixes all prettier linting errors.

## Docker Container

### `docker build -t apachepulsarui/frontend .`

Builds the docker image of the frontend.

### `docker run -p 8082:8082 apachepulsarui/frontend`

Starts the frontend docker container on port 8080.

The port on the host machine can still be adjusted if necessary by changing the first of the two ports.
Recommend changing the app/container port in the `.env` file as well.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
