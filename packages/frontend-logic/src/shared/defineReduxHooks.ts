export const { useAppDispatch, useAppSelector } =
  process.env.FRONTEND_MODULE_ADMIN ? await import('../../src/admin') :
  process.env.FRONTEND_MODULE_MANAGER ? await import('../../src/manager') :
  await import('../../src/customer');