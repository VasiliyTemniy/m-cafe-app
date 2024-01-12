# m-market-app

## modular marketplace app

Written in typescript almost without 'any', but with few type assertions
'any' used only for some generics

### Stack
| Field | Tools |
| --- | --- |
| Backend | nodejs + expressjs |
| Database | PostgreSQL + Sequelize ORM |
| Backend cache | Redis |
| Web frontend | React + webpack |
| Mobile frontend | ReactNative + expo |
| Frontend state | reduxjs + toolkit |
| CI / (no CD atm) | Github actions |

### Side projects and dependencies
- [simple-micro-auth](https://github.com/VasiliyTemniy/simple-micro-auth): simple 0Auth analogue microservice written in Go
#### planned
- Delivery cost calculator written in Kotlin

### Goals
- Make this app quickly deployable using docker;
- Implement hexagonal\onion architecture for backend;
- Make production, development, etc be accessible, usable, deployable, so on in two ways: through docker-compose or without docker at all;
- Use as least as possible repeats of types, validators, etc for typescript: achieved by using monorepo with yarn workspaces;
- Make all functional React components with Redux + toolkit in separate package common for web and mobile frontend;
- ~~Make frontend ui visuals initialized by admins;~~
- ~~Make frontend content as mostly as possible initializable by admins. I wouldn't say this is server-side page generation... Who knows. Maybe it would be better to use nextJs;~~
- Make standard fixed ui for frontend app root, while particular organization's pages ui will be customizable by organization administrators;
- ~~Make kind of localization support for 3 languages (I think this app will never be in position that needs more than 1). Why not N instead of 3? It would be just a little more complicated, but not necessary at all;~~
- Make total localization support for any preferred number of languages;
- Test everything with something - backend api tests mocha + chai, frontend tests mostly e2e via cypress
- ?...
- Profit!

### TODOS
- Update dockerfiles after finishing refactoring backend to hexagonal architecture


All dependencies licences will be included at last with first release of v 1.0.0, maybe earlier
