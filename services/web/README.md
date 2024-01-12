# Frontend web service

This service package is divided to four parts: user, manager, admin and shared

User, manager and admin are three different webpack targets to make three different webpages(webapps?)

Each of them have specific components and use some common components from shared folder

App state, frontend services, stateful components, hooks are imported from @m-market-app/frontend-logic package to share the same logic with mobile frontend. Each webpack target has its own logic structure

### TODOS

- Add fixed loc and ui settings caching in local storage