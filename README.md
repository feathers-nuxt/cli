Fullstack Feathers Framework

`f3` is a command line utility for working with `feathers+nuxt` applications at scale. 

It provides tasks such as scaffolding, live reloading, database migration, database seeding, deployment among others. See the [wiki](https://github.com/feathers-nuxt/cli/wiki) for guides.

#### Installation

```bash
npm i -g @feathers-nuxt/cli
```

The rest of this guide, uses yarn in place of `npm` but you may use the later if you so prefer.

#### Initialization
To start a new `feathers-nuxt` project using `f3` cli, just invoke the following on your terminal
> `f3 init awesome-project`

This will fetch the [feathers-nuxt/template-app](https://github.com/feathers-nuxt/template-app) from github using [saojs](https://github.com/saojs/sao) and create a boilerplate, inside `awesome-project` directory, customized as per your answers to the prompted questions.

See the wiki for available customization options. One of the options is the ORM prefered - either sequelize (_if you prefer SQL database_) or Mongoose (_the only NoSQL database supported for now_) database. Any database that works with feathers may be used, but for the ORM, only sequelize dialects are supported in the case of SQL and MongoDB for the case of NoSQL.

#### Configuration
If you have worked with a `nuxt` project before, an `f3` project should feel familiar. The only considerable difference is that configuration for `nuxt` is specified inside `f3.config.js` which exports an object with two keys. `nuxt` is one of these keys and its value is anything you would export from `nuxt.config.js`. The other key is `backpack` and its value is the equivalent of what one would export from `backpack.config.js`. 

Essentially `f3.config.js` holds `webpack` configuration for a build targetting the `server` using `backpack` as well another targetting the `client` using `nuxt`. Check out [backpack](https://github.com/jaredpalmer/backpack) and [nuxt](https://nuxtjs.org) configuration guides to see all available options.

#### Development
After initialization, `cd awesome-project` and invoke `yarn dev` or `npm run dev` if you prefer `npm`. This will start `feathers server` using `nodemon` for file watching and live reloading.

The new project will have other `npm script` declarations in its `package.json` for tasks such as `building`, `deployment`, `db migrations` among others. Invoke `yarn run` or open `package.json` for a comprehensive list of all available tasks.

#### Building
Building is necessary to compile `livescript` and `ecmascript` sources to `javascript` in order to run the application in production mode. `f3` will invoke `nuxt` to compile frontend code and `backpack` to compile backend code. To build the project, invoke `yarn build` from within the project directory. Invoke `yarn build-client` if you need to compile frontend code only or `yarn build-server` if you need to compile need backend code only.

#### Migrations
When using Mongoose ORM, migrations may not be necessary (or maybe they are?). However with Sequelize, migrations are crucial. Invoke `yarn migrate` in your project root to see migrations status. `yarn migrate up` will execute *ALL* pending migrations. `yarn migrate down` will undo *ALL* completed migrations. `yarn migrate next` will execute the *NEXT* pending migration.

`f3` will look for migrations files are under `src\db\migrations` directory. They will be run in the order they appear. A good practice is to prefix the file name with a two digit number so that you retain control over the order of the files in the directory. Otherwise they will be ordered alphabetically. This may be an issue when you have a migration that should create a table which is to be later referenced by another migration creating a foreign key constraint.

#### Deployment
`f3` uses `git push` to deploy. You need to first set up the deployment server by installing `node.js` and [pod](https://github.com/yyx990803/pod) among other dependencies. 

> This step will be automated in the future so that all you need to deploy is SSH access to a fresh VM box in the cloud.

Once `pod` is setup on the deployment server, create a pod app on the deployment server and use its git repository as a remote to your local project. `f3` also includes a `.podhook` file in the project root directory for specifying shell commands to run during deplyment before (re)starting the app on remote server.

With the setup, any time you do `git push` the local project, It will (re)build and (re)start the app hosted on deployment server. Under the hood `pod` uses `pm2` for process management so you can do anything with your `pod` app as you would with a `pm2` app.