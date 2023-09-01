export const { useAppDispatch, useAppSelector } =
  process.env.FRONTEND_MODULE_ADMIN ? await import('../admin') :
  process.env.FRONTEND_MODULE_MANAGER ? await import('../manager') :
  await import('../customer');