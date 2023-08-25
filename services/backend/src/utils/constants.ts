export const possibleUserRights = ['user', 'manager', 'admin', 'disabled'];


export const delayedStatusMS = {
  accepted: process.env.DELAYED_STATUS_MS_ACCEPTED
    ? Number(process.env.DELAYED_STATUS_MS_ACCEPTED)
    : 50 * 60 * 1000, 
  cooking: process.env.DELAYED_STATUS_MS_COOKING
    ? Number(process.env.DELAYED_STATUS_MS_COOKING)
    : 30 * 60 * 1000,
  delivering: process.env.DELAYED_STATUS_MS_DELIVERING
    ? Number(process.env.DELAYED_STATUS_MS_DELIVERING)
    : 5 * 60 * 1000,
};