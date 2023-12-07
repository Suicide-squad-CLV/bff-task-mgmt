## Description

Backend for Frontend (BFF) source in Task Managment Project.

Backend for Frontend (BFF) is a part that placed between Frontend (FE) and Backend services (BES)

This part will receive request from FE via GraphQL API and then call to BES for data via gRPC

BFF processing steps:

1. BFF receives Arguments of GraphQL API if needed
2. BFF converts Arguments in GraphQL to Arguments type in gRPC
3. Call gRPC services in BES with converted Arguments in step 2
4. BFF receive Result from BES and convert BES Response to GraphQL Response

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
