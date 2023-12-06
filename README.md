## Description

Backend for Frontend source in Task Managment Project.

Backend for Frontend is a part that placed between Frontend and Backend services.

This part will receive request from Frontend via GraphQL API and then call to Backend Services for data via gRPC

## Installation

```bash
$ yarn install
```

## Pre-run steps

```bash
# generate interface based on proto file
$ yarn generate:proto
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

Note: GraphQL schema file "schema.gql" will be generated automatically based on \*.entity.ts files

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```
