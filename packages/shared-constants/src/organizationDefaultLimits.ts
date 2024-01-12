export const orgDefaultMaxPolicies = !isNaN(Number(process.env.ORG_DEFAULT_MAX_POLICIES))
  ? Number(process.env.ORG_DEFAULT_MAX_POLICIES)
  : 100;
export const orgDefaultMaxManagers = !isNaN(Number(process.env.ORG_DEFAULT_MAX_MANAGERS))
  ? Number(process.env.ORG_DEFAULT_MAX_MANAGERS)
  : 100;
export const orgDefaultMaxProducts = !isNaN(Number(process.env.ORG_DEFAULT_MAX_PRODUCTS))
  ? Number(process.env.ORG_DEFAULT_MAX_PRODUCTS)
  : 1000;
export const orgDefaultMaxPictures = !isNaN(Number(process.env.ORG_DEFAULT_MAX_PICTURES))
  ? Number(process.env.ORG_DEFAULT_MAX_PICTURES)
  : 6000;
export const orgDefaultMaxDetails = !isNaN(Number(process.env.ORG_DEFAULT_MAX_DETAILS))
  ? Number(process.env.ORG_DEFAULT_MAX_DETAILS)
  : 100000;
export const orgDefaultMaxDynamicModules = !isNaN(Number(process.env.ORG_DEFAULT_MAX_DYNAMIC_MODULES))
  ? Number(process.env.ORG_DEFAULT_MAX_DYNAMIC_MODULES)
  : 100;
export const orgDefaultMaxEvents = !isNaN(Number(process.env.ORG_DEFAULT_MAX_EVENTS))
  ? Number(process.env.ORG_DEFAULT_MAX_EVENTS)
  : 100;
export const orgDefaultMaxRoles = !isNaN(Number(process.env.ORG_DEFAULT_MAX_ROLES))
  ? Number(process.env.ORG_DEFAULT_MAX_ROLES)
  : 100;
export const orgDefaultMaxPermissions = !isNaN(Number(process.env.ORG_DEFAULT_MAX_PERMISSIONS))
  ? Number(process.env.ORG_DEFAULT_MAX_PERMISSIONS)
  : 10000;
export const orgDefaultMaxTags = !isNaN(Number(process.env.ORG_DEFAULT_MAX_TAGS))
  ? Number(process.env.ORG_DEFAULT_MAX_TAGS)
  : 100000;