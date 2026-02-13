export const protectedRoutes = [
  {
    path: '/cart',
    allowedRoles: ['customer'],
  },
  {
    path: '/admin',
    allowedRoles: ['admin'],
  },
] as const;

export type UserRole = 'admin' | 'customer';