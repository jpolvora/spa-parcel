# spa-parcel

A pre-configured boilerplate for creating SPA apps

### the environment

- `husty` for git hooks (pre-commit)
- `lint-staged` for run eslint
- `eslint` with my preferences (no semicolons)
- `parcel-bundler` for bundling to .dist folder
- `babel` with `babel-transform` and `babel-runtime`

### the app structure

- `navigo` as router
- `knockout` as databind lib with `knockout-validation`
- views and components are just es6 strings

# starting up

`npm install`

### development mode

Run `npm run debug`

### build

`npm run build`

### Gulp tasks

* tag version (changes package.json)

    `gulp patch`

# Caprover

Configure `caprover setup`

Check captain-definition

check and run `deploy.bat`
