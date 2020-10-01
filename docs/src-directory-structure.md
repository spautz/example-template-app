# Personal Opinions on `src/` Directory Structure

This writeup is long and verbose, because there's a LOT to pack in here.

In my opinion the organization of code is absolutely critical: it will make or break the long-term viability of an app
or project, because it informs (and restricts) where the 'seams' exist in the code -- and those seams affect everything
from the growth of technical debt to the duration of its overall lifecycle.

## Strategies for code organization

Two existing themes and standards for organizing code are "by type" and "by feature". This isn't quite either of those.

Here's a (verbose) breakdown and comparison:

#### "By type"

In "by type", similar things are grouped together: a directory for smart containers, a directory for presentational
components, a directory for Redux action creators, a directory for reducers, a directory for selectors.
This works well for small-to-medium size projects.

"By type" doesn't communicate the 'seams' along which those things are supposed to interact, however: there's no clear
indication (or restriction) for which component types are supposed to be controlling which other component types.
In my experience this can result in people accidentally coupling things that otherwise wouldn't interact directly --
which increases the number of touchpoints in the system.

It also doesn't give much sub-structure for organizing things once the project grows: when you have 3 files of action
creators it's fine to just put them together in a directory, but when you have 50 it doesn't work so well.

#### "By feature"

In "by feature", the files which support a particular module or piece of end-user functionality are grouped together:
a directory for Authentication, a directory for Account Management, a directory for everything about CRUDing Beverage
models, etc. This scales up much better for large projects, especially when the different modules are separate sub-apps
or microfrontends.

"By feature" scales better than "by type", but it runs into ambiguities about where to house -- and find -- shared code
and overlapping utilities. A single `shared/` or `common/` directory will work for most projects, but then you end up
migrating code from the different feature directories into the shared directory as it gets used -- or, more often,
different devs re-create the same kinds of components and utilities independently, without realizing that it's
already been done.

It's also easy for different modules to grow apart and follow different standards in this scheme. Other techniques,
like "gold standard" example code (which this repo represents) can help keep things in line, but fragmentation
is still a risk.

#### "By responsibility"

This repo attempts to organize things so that each directory represents a single "responsibility". Each directory,
or layer, exists relative to the seams (touchpoints to other layers) which it commands, and those which it is
commanded by.

Responsibility is a squishy concept: the Single-Responsibility Principle often doesn't work out because different devs
perceive different granularities in responsibility. One may think "talk to the backend" represents a responsibility
while another thinks that "determine whether the backend response represents success or error" is one. Since those two
tasks overlap the devs will end up with different solutions, even though both ways of looking at it are valid.

To avoid that problem, "responsibility" in this repo is determined by which directories/layers it interacts with.
The ultimate goal is to strike a balance between touchpoint management (organizing all code which fits into a certain
niche together) and organizing shared code vs unique code (we want shared code to be findable, but it's hard to know
which things will be shared in the future.)

In my opinion it's easiest to think of these responsibilities as "layers" in the app. Each gets its own directory.

## The Layers

#### Screens

Route-defined navigation destinations.

It's important that one thing in the system be 'in charge': whenever two components or interfaces touch, it should
be clear which one is 'controlling' and which one is 'controlled'. Otherwise you end up with code flowing
through the app in inconsistent ways, which inevitably leads to spaghetti.

In a React app, I believe the screens you navigate to -- the abstract idea of "where the user is" -- should be in charge.
The screen corrals and unites the components that the user sees on-screen, the hooks and contexts that drive the desired
functionality, and the services and data sources which populate it all.

The idea of a "destination" is important: sub-screens such as modals and sidebars are counted as screens (and not just
normal components) because they can be modeled as a set of route params, even if they aren't formally set up as routes.
This works especially well for things like forms, where a single form may be used in many different contexts
(within a modal, on a dedicated screen, pinned in a sidebar, etc.)

In general a screen should not define too many local styles or layouts: ideally all the pixels on-screen would be
owned by components, although in practice I think it's best to start with more view logic in the screen and then
migrate common layouts and patterns to components over time.
[(A relevant codelesscode)](http://thecodelesscode.com/case/233)

#### Components

The on-screen components that everybody thinks of when you say "React".

A major goal of this directory structure is to remove as many things from the React components as is reasonable,
leaving the components to be the parts which surface the behavior, styles, and data that are ultimately handled outside
of React. This makes it easier to swap out styles, backends, and component libraries later without having to rewrite
the app, and also makes it easier to test the different pieces in isolation.

Within `src/components/` I think it works best to organize everything into two tiers: categories like `forms` and
`navigation` and `layouts` each get their own directory, and all component files live inside a second directory under
those, grouped however feels most reasonable at the time. (It's not worth spending too much time on the second level:
that's just for scaling. The first level is for really forcing people to look and think about what components we have.)

This forced two-tier organization is often a bit awkward, especially when first starting the project
(see [Criticisms and Concerns](#criticisms-and-concerns) below) but in my experience it's best to start with more
structure at the beginning -- as opposed to starting with a flat set of components and planning to 'grow out' into
directories as the component library grows. Things will never be perfect, but the team is more likely to find and
reuse things that way, and less likely to create duplicate or redundant components.

Components used to generally be either "dumb" or "smart", but as hooks have replaced HOCs that line has blurred.
I think the separation still has value, though: If a single component uses more than 2 or 3 hooks to tie
it to external systems (like contexts or services) then I'll often split it into two pieces: one for behavior, one
for presentation. It's okay for React components to live outside of `src/components/` when their _responsibility_
aligns with one of the other directories (e.g., context providers) but I think it's fine to locate both behavioral
and presentational components together under `components/`, so long as they're organized well into two tiers.

Components may talk to anything else in the stack other than screens, although _ideally_ most presentational components
should be as leaf-like as possible.

#### Contexts

React hooks and providers, along with the behavior they abstract.

This layer is pretty straightforward: React context overlaps and unites components, screens, and utils -- but it's also
its own type of thing with its own capabilities and concerns, so it gets its own directory. The raw context is not
exported or used directly by anything (except possibly automated tests).

In general I've found two main roles for contexts in my apps:

- "Functionality" contexts generally wrap a `useReducer`, a service, or a util. One context instance delivers data,
  another delivers actions/callbacks. These are the contexts most people are familiar with.
- "Forwarding" contexts wrap some other context to deliver a nicer API, and more importantly to decouple the consumers
  from the original context. A datagrid whose parameters may be stored in Redux in some cases but in React-Table
  in other cases would use a forwarding context to switch between those two contexts, so that none of the grid
  components are tied to either implementation.

Contexts, like components, can talk to services, configs, and utils. A set of complex or interaction-heavy components
can often be divided up into a 'smart' context in order to simplify the components.

#### Services

View-agnostic abstractions of data sources: backend, device, etc.

Each service encapsulates a particular model type or
data source, wrapping it and reformatting its data into a UI-specific shape for the app to consume. This means the
rest of the app does not receive backend data as-is: we instead massage it into something that can better fit UI
conventions. This is more work, but it gives enough benefits to be worth the time investment:

- Generic field names like `id` or different-cased names like `beverage_id` can be standardized to a more JS-conventional `beverageId`
- Timestamps can be standardized or converted to something like MomentJS
- It's a single, unambiguous place to anchor strict typings and dev-mode data checks
- It's a single, unambiguous place for caching or interaction with storage
- It can swap out the 'real' data source for a mock at runtime, or switch between multiple API versions according to a feature flag

Services are near the bottom of the stack: they can talk to configs and utils, but nothing else. They're not quite
vanilla JS since they generally interact with Redux and other stores, but they should be close.

#### Config

Raw values, representing both the environment and any runtime settings.

A single source for all the values, configurations, feature flags, and app-wide constants that the other layers use.
Basically a nice name for globals. I usually put styling and I18n language strings into the config layer, as well,
because they're global states that rarely change.

The general idea here is that most constants aren't universally constant: they'll change under some circumstances.
Event logging is different between dev and prod. Base backend URLs change between web and mobile. Feature flags
change between releases. App preferences change between login and logout. So, instead of making things truly `const`,
we package those values up with accessors that allow them to be set or overridden in those circumstances.

Config values may be consumed from anywhere, but in general I prefer to wrap them in contexts and utils instead of
having screens or components touch them directly. This is more work but it helps keep things independent and decoupled.

#### Util

Pure functions to support the other layers.

This is the most awkward one: in most projects the `util/` directory holds "the leftovers" and becomes a dumping ground
for things which don't really fit into the architecture. There's always going to be misfits and one-offs, and I think
it's better to have a dedicated place for them as "utils" than to have them encroach on the other layers, but the
ideal here is to make most/all utils be plain, pure, vanilla JS functions.

Encouraging utils to be pure functions helps to keep the most spaghetti-prone area of the app from becoming too chaotic.
Having them centralized in one place helps findability and reuse, reduces the likelihood of the same helper being
implemented multiple times in multiple places, and makes it easy to "rope off" sections of the code which may need
to be hackier or less well-structured than the main app.

Utils may only be commanded by the other layers: they don't import or invoke any of the others directly.

## Verbose Notes and Lessons Learned

#### Strict rules for layer touchpoints and imports

These are strict rules about which layers are allowed to touch and invoke other layers: everything is one-way.
screens render components, components don't render screens. Services invoke utils, utils don't invoke services.
Side effects can update the config, the config cannot itself trigger side effects.

In my experience the rules about the relationship between layers can be a lot for new team members to learn, and it
sometimes means there's more work to write the code, but it avoids the fragmentation and unintended consequences which
are often the root cause behind an app failing or being overwhelmed by technical debt. It helps reading and debugging
code because you can more easily isolate the layers to track things down.

#### How it looks to swap out layers as the app evolves

The ultimate goal of this organization is touchpoint management: having well-defined 'seams' between the different
layers and responsibilities. This makes it possible to replace or rewrite large areas of functionality without falling
into "the rewrite trap" or trying to rewrite an entire app at once.

Regardless of granularity, the basic approach for a sizable refactor looks like:

1. Rename the old file or directory to something like `MyThing_OLD`. Using a name like that lets you mention it in
   comments to highlight non-obvious spots or danger zones, and changing it from the prior name ensures you've found
   every place that will need to be updated during the refactor.
2. Scaffold and build its replacement as something like `MyThing_NEW`.
3. Refactor every occurrence of `MyThing_OLD`, replacing it with `MyThing_NEW`.
4. When no more occurrences of `MyThing_OLD` remain, it's safe to delete the old code.
5. Finally, rename `MyThing_NEW` to its proper, permanent name.

## Criticisms and Concerns

This organization generally takes a "global by default" approach: all utils are available to all other layers, even though
most are only used by one or two layers. This improves consistency and readability, but at the cost of some scalability.

Utils that construct or supply presets for one specific layer -- like a helper which makes the service layer easier
to write -- really only belong to the service layer, but in this organization they're housed alongside all the other
utils by default. I sometimes make exceptions for these, and put them into `services/serviceUtils/` instead of `utils/`,
but I've had mixed results with this.

Making abstractions for _concepts_ can be messy: authentication is both a service and a util, and it can also be thought
of as a config value and sometimes a context. Things like authentication which pervade the application seem to end up
with a service part _and_ a util part. Sometimes this separation makes the code cleaner and easier to follow, but other
times it just means you have to read more code and more files before you can see what's going on.

The two-tier organization of components can be very annoying and frustrating: components rarely fit into a single
category, and a single category name can often apply to multiple types of component. Picking a great category name is
just as hard as picking a great variable name -- but you really just need a name that's "good enough". "Good enough"
will last for a long time. I've yet to work on a project where the names we pick remain great long-term, but it's also
never caused any major problems -- whereas not starting with some hierarchy has caused problems for me before,
because it means you'll transition through a half-categorized phase once you do begin organizing things into groups.

Organizing the screens according to the navigation _hierarchy_ is unnatural for many developers. In a wizard where
you step through several screens, the 'right' organization is to make those screens siblings, because they all occupy
the same level of the nav hierarchy: `myWizard/overview`, `myWizard/setSomething`, `myWizard/areYouSure`, etc.
On several occasions I've worked with developers whose natural inclination was to nest the screens within each other,
though: `overview`, `overview/setSomething`, `overview/setSomething/areYouSure`. This approach felt very natural to
them while the other felt "wrong", but everybody is different. I haven't found a good solution that fits all views.

That's it! If you actually read this whole thing, please [shoot me an email](mailto:spautz@gmail.com):
not many people can slog through all that, and I'd love to hear your thoughts.
