# Example Template: React App

This is my personal, opinionated template for how a nontrivial React app should be organized and configured.

[![build status](https://img.shields.io/travis/com/spautz/example-template-app.svg)](https://travis-ci.com/spautz/example-template-app)
[![dependencies status](https://img.shields.io/david/spautz/example-template-app.svg)](https://david-dm.org/spautz/example-template-app)
[![test coverage](https://img.shields.io/coveralls/github/spautz/example-template-app.svg)](https://coveralls.io/github/spautz/example-template-app)

_This template is currently in progress._

## New project setup

1. Create a new repository from this template: https://github.com/spautz/example-template-app/generate
2. `./scripts/prepare-new-app.sh` to remove files that the app doesn't need
3. Find/replace occurrences of `"spautz"` and `"example-template-app"` to match the new repository

## Commands

#### General setup

This is built on top of [react-scripts / create-react-app](https://create-react-app.dev/).
Running `yarn install` will install everything you need.

Most standard commands and scripts are available: `yarn build`, `yarn clean`, `yarn test`, `yarn start`,
`yarn storybook`, etc. See [package.json](./package.json) for details.

#### Batch scripts

There are also several batch commands to run useful groups of those scripts:

- `yarn dev` runs some quick "check my code" tools: prettier, eslint, typescript
- `yarn dev:readonly` runs the same tools as `dev`, but in read-only mode
- `yarn all` runs _all_ the "check my code" tools, including tests and builds
- `yarn all:readonly` runs the same tools as `all`, but in read-only mode
- `yarn test` is an alias you can switch between watch mode and no-watch mode

#### Bash scripts

For more destructive operations and things outside of the repo:

- `scripts/clean-everything.sh` wipes ALL caches and temporary files. This includes global caches, so other projects will be affected.
- `scripts/build-everything.sh` runs ALL setup and build commands for the project.
- `scripts/full-ci.sh` does some environment checks and then runs a ci script

## Docs

The opinions and experiences which shaped this template are written up under [`docs/`](./docs).

- [Scripts and commands](./docs/scripts-and-commands.md)
- [`src` directory structure](./docs/src-directory-structure.md)
