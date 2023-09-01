# Frontend stateful components package

This package is divided to four parts:

- Customer: contains customer-specific stateful components
- Manager: contains customer-specific stateful components
- Admin: contains customer-specific stateful components
- Shared: contains components that will be used by all frontend modules

Some reducers files have the same name, this means that if such file happens to be in for example admin folder, it imports user or manager reducer base and appends it with admin-specific logic, thunks, reducers and actions

Last letters in component names mean:
  *SC - Stateful Component
  *LC - Layout Component