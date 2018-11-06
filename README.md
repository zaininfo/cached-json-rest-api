# Cached JSON REST API

A simple REST API to store and retrieve schemaless JSON documents with fast retrievals from cache.

## External dependencies
- MongoDB v3.6.2
- Redis v4.0.7

## Requirements
- Make
- Yarn >= 1.3.2
- Node.js >= 8.9.4
- Docker >= 17.12.0 CE
- Docker Compose >= 1.19.0

## Endpoints
Method | Path | Query String | Request | Response
--- | --- | --- | --- | ---
POST | `/documents` |  | JSON object | 200 or 400
GET | `/documents/search` | pageNo=[1-...] & *fieldName*\*=*fieldValue* |  | Array of JSON objects or 400

\* Search can be performed on nested fields as well by providing their fully qualified names e.g. `rootFieldName.nestedFieldName`.

## Deployment
To deploy on Docker (including the external dependencies):

    make deploy
To tear down the deployment:

    make teardown
To customize, change the configuration files in `config` folder.

## Development
To start the REST API locally:

    make start
To check for formatting issues:

    make lint
To run the end-to-end tests (the app is automatically deployed):

    make test
To debug, see the log files in `logs` folder.

## Roadmap
In no particular order:
- Make caching layer intelligent.
- Support bulk addition of documents.
- Configure failsafe deployments of MongoDB & Redis.
- Improve test coverage.
