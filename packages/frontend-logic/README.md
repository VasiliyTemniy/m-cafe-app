# Frontend logic package

This package is divided to four parts:

- Customer: contains all basic customer state, actions, customer-specific hooks
- Manager: contains most of customer state and actions and some more. All customer actions are imported from customer store to make sure that if customer store src changes, manager store src changes accordingly
- Admin: has all functionality from both customer and manager and adds admin-specific reducers and hooks
- Shared: frontend services, reducers and hooks used by all frontend modules

Some reducers and services files have the same name, this means that if such file happens to be in for example admin folder, it imports customer or manager reducer or service base and appends it with admin-specific logic, thunks, reducers, actions and routes