# Frontend logic package

This package is divided to three stores:

- User store, which has all basic user state and actions
- Manager store, which has most of user state and actions and some more. All user actions are imported from user store to make sure that if user store src changes, manager store src changes accordingly
- Admin store, which has all functionality from both user and manager and adds admin-specific reducers

Some reducers files have the same name, this means that if such file happens to be in for example admin folder, it imports user or manager reducer base and appends it with admin-specific logic, thunks, reducers and actions

Last letters in component names mean:
  *SC - Stateful Component
  *LC - Layout Component