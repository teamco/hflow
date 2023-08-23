## Contributors

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

[![Unit tests CI](https://github.com/get-me-home/frontend/actions/workflows/unit.test.js.yml/badge.svg)](https://github.com/get-me-home/frontend/actions/workflows/unit.test.js.yml)
[![CICD.Build](https://github.com/get-me-home/frontend/actions/workflows/build.yml/badge.svg)](https://github.com/get-me-home/frontend/actions/workflows/build.yml)
[![Playwright E2E](https://github.com/get-me-home/frontend/actions/workflows/playwright.yml/badge.svg)](https://github.com/get-me-home/frontend/actions/workflows/playwright.yml)
[![CircleCI](https://dl.circleci.com/status-badge/img/gh/get-me-home/frontend/tree/main.svg?style=svg&circle-token=6a2095669022a2428c1f0b8aab953b1c9a8e6537)](https://dl.circleci.com/status-badge/redirect/gh/get-me-home/frontend/tree/main)
[![Gitpod Ready-to-Code](https://img.shields.io/badge/Gitpod-ready--to--code-blue?logo=gitpod)](https://github.com/get-me-home/frontend) 

# hflow

* Install
```bash
$ npm install
```
* Start
```bash
$ npm run start:linux / windows
```
### Useful links
* https://github.com/dvajs/dva
* https://ant.design
* https://umijs.org
* https://hooks.umijs.org/hooks/async
* https://casl.js.org/v5/en/

### Hooks
* https://ahooks.js.org
* https://github.com/rehooks/awesome-react-hooks

### Saga Model Effect creators
* https://redux-saga.js.org/docs/api

* ```actionChannel(pattern, [buffer])```: Creates an effect that instructs the middleware to queue the actions matching ```pattern``` using an event channel. Optionally, you can provide a buffer to control buffering of the queued actions.
* ```all([...effects]) - parallel effects```: Creates an Effect description that instructs the middleware to run multiple Effects in parallel and wait for all of them to complete. It's quite the corresponding API to standard ```Promise#all```.
* ```call(fn, ...args)```: Creates an Effect description that instructs the middleware to ```call``` the function fn with args as arguments.
* ```cancel(task)```: Creates an Effect description that instructs the middleware to cancel a previously forked task.
* ```cancelled()```: Creates an effect that instructs the middleware to return whether this generator has been cancelled. Typically, you use this Effect in a final block to run Cancellation specific code.
* ```cps(fn, ...args)```: Creates an Effect description that instructs the middleware to invoke ```fn``` as a Node style function.
* ```flush(channel)```: Creates an effect that instructs the middleware to flush all buffered items from the channel. Flushed items are returned back to the saga, so they can be utilized if needed.
* ```fork(fn, ...args)```: Creates an Effect description that instructs the middleware to perform a non-blocking call on ```fn```
* ```getContext(prop)```: Creates an effect that instructs the middleware to return a specific property of saga's context.
* ```join(task)```: Creates an Effect description that instructs the middleware to wait for the result of a previously forked task.
* ```put(action)```: Creates an Effect description that instructs the middleware to schedule the dispatching of an action to the store. This dispatch may not be immediate since other tasks might lie ahead in the saga task queue or still be in progress.
* ```race(effects)```: Creates an Effect description that instructs the middleware to run a Race between multiple Effects (this is similar to how ```Promise.race([...])``` behaves).
* ```setContext(props)```: Creates an effect that instructs the middleware to update its own context. This effect extends saga's context instead of replacing it.
* ```select(selector, ...args)```: Creates an effect that instructs the middleware to invoke the provided selector on the current Store's state.
* ```spawn(fn, ...args)```: Same as ```fork(fn, ...args)``` but creates a detached task. A detached task remains independent of its parent and acts like a top-level task.
* ```take(pattern)```: Creates an Effect description that instructs the middleware to wait for a specified action on the Store. The Generator is suspended until an action that matches pattern is dispatched.
* ```takeEvery(pattern, saga, ...args)```: Spawns a saga on each action dispatched to the Store that matches pattern.
* ```takeLatest(pattern, saga, ...args)```: Forks a saga on each action dispatched to the Store that matches pattern. And automatically cancels any previous saga task started previously if it's still running.
* ```takeMaybe(pattern)```: Same as take(pattern) but does not automatically terminate the Saga on an ```END``` action.
* ```throttle(ms, pattern, saga, ...args)```: Spawns a ```saga``` on an action dispatched to the Store that matches ```pattern```.


