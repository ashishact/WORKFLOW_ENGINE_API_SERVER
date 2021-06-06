WORKFLOW ENGINE API SERVER
==========================

`A Google step function clone written in Go and Typescript`

This project is based on temporal.io Go SDK. https://github.com/temporalio/temporal


This app provides 

1. Create workflow
2. Query status
3. Query history of events
4. Terminate failed/long running workflow
5. Convert yaml to json

```bash
npm install
tsc -p .
node dist/server.js
```

Read the development notes here: https://workflow-engine-frontend.s3.ap-south-1.amazonaws.com/docs/workflow_engine_development_notes.pdf
