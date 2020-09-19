# Personal Opinions on `src/` Directory Structure

## "By responsibility"

Two main themes and standards for organizing code are "by type" and "by feature". This isn't quite either of those.

In "by type", like things are grouped together: a directory for smart containers, a directory for presentational
components, a directory for Redux action creators, a directory for reducers. This works well for small-to-medium size
projects.

"By type" doesn't communicate the 'seams' along which those things are supposed to interact, however. In my experience
this can result in people accidentally coupling things that otherwise wouldn't interact directly -- which increases the
number of touchpoints in the system.

In "by feature", ...

"By feature" scales better, but

####

- Ultimate goal is a balance between touchpoint management and shared/unique code

## The Layers

#### Services

View-agnostic

#### Screens

Represent route-defined navigation destinations

#### Components

Forced two-tier organization

#### Contexts

Doesn't expose the actual contexts

#### Config

Vanilla JS, both runtime and environment

#### Util

Not "the leftovers" as in some apps: pure functions, vanilla JS

#### Store

## Verbose Notes and Lessons Learned

- No hooks directory
-

## Criticisms and Concerns
