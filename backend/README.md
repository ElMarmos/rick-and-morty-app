# Backend

## Description

Backend was built using [Nest](https://nestjs.com/), a progressive Node.js framework for building efficient, reliable and scalable server-side applications.

## Setup

Make a copy of the `.env.example` file and rename it to just `.env`. This file contains all the environment variables required to run the backend.

Make sure that the `PORT` environment variable and the port of the `proxy` attribute inside the frontend's [packate.json](../frontend/package.json) are the same.

## Installation

```bash
# installs dependencies
$ yarn
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev
```

## Test

```bash
# unit tests
$ yarn run test
```
