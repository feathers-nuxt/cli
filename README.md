Fullstack Feathers Framework

#### Project Initialization

To start a new `feathers-nuxt` project using this `cli` invoke the following on your terminal
> `feathers-nuxt init awesome-project && cd awesome-project && npm install`

This will fetch the [feathers-nuxt/template-app](https://github.com/feathers-nuxt/template-app) from npm using [saojs](https://github.com/saojs/sao) - a _futuristic scaffolding tool_ - and create boilerplate customized as per your answers to the prompted questions.

Check out [saojs docs](https://sao.js.org/) to find out more about scaffolding.

#### Scaffolding boilerplate code
To create files within your existing project and pre populate with relevant boilerplate code invoke
> `npm run f3:make:*`

At the moment, `*` is either of:
- `component` for a `.vue` [single file component](https://vuejs.org/v2/guide/single-file-components.html) file
- `layout` for a `.vue` nuxt [layout](https://nuxtjs.org/guide/views) file
- `page` for a `.vue` nuxt [page](https://nuxtjs.org/guide/routing) file
- `middleware:page` for a `.js` [page middleware](https://nuxtjs.org/api/pages-middleware) file
- `middleware:nuxt` for a `.ls` nuxt's [connect server middleware](https://nuxtjs.org/api/configuration-servermiddleware) file
- `middleware:express` for a `.ls` feathers' [express server middleware](https://docs.feathersjs.com/api/express.html) file
- `module:nuxt` for a `.js` [nuxt module](https://nuxtjs.org/guide/modules) file
- `module:store` for a `.ls` vuex [store module](https://nuxtjs.org/guide/vuex-store#modules-mode) file
- `service` for a [feathers service](https://docs.feathersjs.com/api/services.html) `.ls` file

> Tip: Using the first letter of the command works as well i.e `p` in place of `page`, `m:p` in place of `middleware:page` Just so you type less.
