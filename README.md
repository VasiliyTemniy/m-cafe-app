# m-cafe-app

## modular cafe app

Project motto atm is 'hardcode as least frontend as I can'

Written in typescript without 'any', but with few type assertions

### Stack
| Field | Tools |
| --- | --- |
| Backend | nodejs + expressjs |
| Database | PostgreSQL + Sequelize ORM |
| Backend cache | Redis |
| Web frontend | React + webpack |
| Mobile frontend | ReactNative + expo |
| CI / (no CD atm) | Github actions |

### Goals
- Make this app quickly deployable using docker;
- Make production, development, etc be accessible, usable, deployable, so on in two ways: through docker-compose or without docker at all;
- Use as least as possible repeats of types, validators, etc for typescript: achieved by using monorepo with yarn workspaces;
- Make all functional React components with Redux + toolkit in separate package common for web and mobile frontend;
- Make frontend ui visuals initialized by admins;
- Make frontend content as mostly as possible initializable by admins. I wouldn't say this is server-side page generation... Who knows. Maybe it would be better to use nextJs;
- Make kind of localization support for 3 languages (I think this app will never be in position that needs more than 1). Why not N instead of 3? It would be just a little more complicated, but not necessary at all;
- Test everything with something - backend api tests mocha + chai, frontend tests mostly e2e via cypress
- ?...
- Profit!


All dependencies licences will be included at last with first release of v 1.0.0, maybe earlier
