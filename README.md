# Flipper-js

Flipper-js manage the feature flipping in your application

Inspired from the GEM Flipper [Ruby GEM Flipper](https://github.com/flippercloud/flipper)

## Features

- CLI management
- In code management
- UI management

## Installation

`npm i flipper-js`

## Configuration

The configuration is on a json file (features.json) that you have to create on your application : 

```json
{
  "features": {
    "feature1": true,
    "feature2": false
  },
  "storage": {
    "type": "local"
  }
}
```

Storage types are

- local : use this file (read and write) to manage the feature flipping.
- redis : use the redis (you provide) to store the feature.

### Env vars

- FLIPPER_API_KEY : the api key used to authenticate interaction with the flipper UI
- FLIPPER_REDIS_URL : The redis connection url

## CLI

The feature flipping could be managed by a CLI

`npx flipper-js --help`

you have to set the env var FLIPPER_REDIS_URL if you are using the redis storage type.

`export FLIPPER_REDIS_URL=redis://user:passxord@redis:6379`

### Options
  -V, --version      output the version number
  -h, --help         display help for command

### Commands
  - list : List all features and their statuses
  - enable "feature" :   Enable a feature
  - disable "feature" :  Disable a feature
  - add "feature" :      Add a new feature (enabled by default)


## In code management

### Initialisation
```typescript
import  path  from  'path'
import { Flipper } from  'flipper-js'

// Init flipper with json config path (optional)
Flipper.init(path.join(__dirname, '../features.json'))
```

### Usage
```typescript
import { Flipper } from  'flipper-js'

// Check if a feature is enabled
await Flipper.isEnabled('feature1')

// Enabled a feature
await Flipper.enable('feature1')

// Disabled a feature
await Flipper.disable('feature1')

// List all features
await Flipper.list()
```

## UI management

UI management is using an express router

The router is exported and could be included in your app.

```typescript
import { Flipper, User, FlipperRouter } from  'flipper-js'

Flipper.init()

// Expose /flipper-js on your application
app.use(FlipperRouter)

User.addUser(process.env.FLIPPER_USER_LOGIN, process.env.FLIPPER_USER_PASSWORD)
// You can add several users
```

To access : launch https://yourserver.com/flipper-js

The connection is the login provided by the addUser method.

Inside the UI, you can simply enable or disabled features.
