# Personal Opinions on Scripts and Commands

## Problem

The scripts in `package.json` need to support several scenarios when writing code:

- I want to make sure I didn't break anything obvious
- I'm trying to fix some issue
- I want confidence that everything is good

## Solution

The scripts here try to address those different scenarios by segmenting the scripts into two groups:

- "Individual" commands run a single, targeted command -- like `eslint` or `jest` or `webpack` -- and nothing more.
- "Integration" or "batch" commands run a series of related commands -- like `eslint` then `jest` then `webpack`.

"Integration" commands are composed only of "individual" commands -- they do no work of their own -- so if something
inside them fails there'll be a smaller, more targeted command you can rerun. This supports the "trying to fix some
issue" case.

Integration commands also offer a layer of abstraction for commands with multiple variants: scripts which can be run
either as a single "run and stop" step or as a lingering service that reruns as files are changed, like `test` or `watch`.

## How it Looks

> "I want to make sure I didn't break anything obvious"

`yarn dev`: run some code checks, but don't take _too_ much time for it.

`yarn test`: run whatever test setup makes the most sense.

> "I'm trying to fix some issue"

`yarn lint`: eslint only

`yarn types`: typescript only

`yarn test:watch`: keep running and rerunning tests until they're fixed

> "I want confidence that everything is good"

`yarn all`: just do everything

## Verbose Notes and Lessons Learned

#### `test` commands

I often see test command setups that look like this:

```json
{
  "test": "jest --watch",
  "test:coverage": "jest --coverage",
  "test:nowatch": "jest --watchAll=false"
}
```

This works fine, but has two annoyances:

1. It's somewhat unbalanced: the non-default options get their own named script but there's no name for the default options.
2. `yarn test` often has muscle memory behind it, and if it's not the option you want you'll regularly start the wrong command.

In this repo, _each_ test script gets a name: this makes the batch commands more readable, and makes the names more
guessable (if there's a `test:watch` then there's probably a `test:nowatch`, or something like it). Then the plain
`yarn test` is just an alias to one of the other commands -- i.e. `"test": "yarn test:coverage"`.

When it's just an alias, you can modify it during local dev without messing up the rest of the commands: I sometimes
do `"test": "yarn test:nowatch && yarn dev"` while building out test coverage: while I'm reading the coverage report
it's making sure I didn't add a typing error. Once it's working I just switch it back.

#### `clean` commands

`clean` commands get divided up the same way as everything else -- so, any command which creates something
(`build`, `test` (with coverage), `build-storybook`, etc) has its pair: `build:clean`, `test:clean`, `storybook:clean`,
etc. Lifecycle scripts can generally run those automatically.

Splitting it into separate commands avoids side effects when running individual commands. Here's a common setup:

```json
{
  "prebuild": "npm clean",
  "build": "rollup -c",
  "clean": "rimraf coverage/ dist/"
}
```

Initially this works fine, but as the project expands additional scripts will be added:

```json
{
  "prebuild": "...",
  "build": "...",
  "clean": "...",
  "test": "jest --coverage",
  "ci": "npm test && npm build"
}
```

And now the `build` step erases the code coverage report. Oops.

This isn't really a big deal -- maybe it'd cause a CI failure or a moment of frustration for somebody -- but while
fixing it you either tear down the unified `clean` command, or duplicate its pieces into both the `clean` and `build`
commands, or split each clean step into its own piece (one for `build:clean`, one for `test:clean`) and have both
`clean` and `build` use that. It's easiest to just start with separate steps.

## Criticisms and Concerns

This general approach is the best I've found for structuring and organizing scripts, but there's room to improve.

The biggest problem: there are a LOT of scripts here. They need to be grouped and organized under headers.
This is a lot for developers to learn, the pattern is a bit odd, and the names used here are not very idiomatic.

It gets messier in a monorepo because each package will have its own set of these _in addition to_ a similar set of
commands which operates over all packages. `example-template-monorepo` shows a pattern for accommodating that,
but it still involves a LOT of scripts.
