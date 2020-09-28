# Personal Opinions on `src/` Directory Structure

## Strategies for code organization

Two existing themes and standards for organizing code are "by type" and "by feature". This isn't quite either of those.

Here's a (verbose) breakdown and comparison:

#### "By type"

In "by type", similar things are grouped together: a directory for smart containers, a directory for presentational
components, a directory for Redux action creators, a directory for reducers, a directory for selectors.
This works well for small-to-medium size projects.

"By type" doesn't communicate the 'seams' along which those things are supposed to interact, however: there's no clear
indication (or restriction) for which components types are supposed to be controlling which other component types.
In my experience this can result in people accidentally coupling things that otherwise wouldn't interact directly --
which increases the number of touchpoints in the system.

#### "By feature"

In "by feature", the files which support a particular module or piece of end-user functionality are grouped together:
a directory for Authentication, a directory for everything Account Management, a directory for everything about CRUDing
Beverage models, etc. This scales up much better for large projects.

"By feature" scales better, but runs into ambiguities about where to house -- or find -- shared code or overlapping
utilities. A single `shared/` or `common/` directory will work for most projects, but then you end up migrating code
from the different feature directories into the shared directory as it gets used -- or, more often, different devs
re-create the same kinds of components and utilities independently, without realizing that it's already been done.

It's also very easy for different modules to grow apart and follow different standards in this scheme. Other techniques,
like "gold standard" example code (which this repo represents) can help keep things in line, but this is still a risk.

#### "By responsibility"

This repo attempts to organize things so that each directory represents a single "responsibility". Each directory is
defined by the seams (and other directories) which it commands, and those which it is commanded by.

Responsibility is a squishy concept: the Single-Responsibility Principle often doesn't work out because different devs
perceive different granularities in responsibility. One may think "talk to the backend" represents a responsibility
while another thinks that "determine whether the backend response represents success or error" is one. Since those two
tasks overlap the devs will end up with very different solutions, even though both are "correct".

To avoid that problem, "responsibility" in this repo is determined by which directories/layers it interacts with.
The ultimate goal is to strike a balance between touchpoint management (organizing all code which fits into a certain
niche together) and organizing shared code vs unique code (we want shared code to be findable, but it's hard to know
which things will be shared in the future.)

In my opinion it's easiest to think of these responsibilities as "layers" in the app.

## The Layers

#### Services

View-agnostic abstractions of data sources: backend, device, etc.

#### Screens

Represent route-defined navigation destinations.

#### Components

Forced two-tier organization. Microcosm of by-responsibility layers, but for "pixels" vs "behavior".

#### Contexts

Doesn't expose the actual contexts. Hooks and provider components.

#### Config

Vanilla JS, both runtime and environment.

#### Util

Not "the leftovers" as in some apps: pure functions, vanilla JS.

## Verbose Notes and Lessons Learned

- Strict rules over which layers are allowed to import other layers: avoiding cycles gets us 90% of the way to preventing spaghetti
- No "hooks/" directory: some hooks are 'pure' utils while others are for accessing context
- Hard, strict separation between "navigation destinations", components which own pixels, and components which own behavior
- How it looks to swap out layers as the app evolves
-

## Criticisms and Concerns

- Awkwardness of 'global' utils vs 'layer-specific' utils
- Abstractions for _concepts_ can be messy: auth is both a service and a util, many utils aren't truly pure
-
