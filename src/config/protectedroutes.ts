export type UserRole = 'admin' | 'customer';

export const protectedRoutes = [
  {
    path: '/cart',
    allowedRoles: ['customer'] as UserRole[],
  },
  {
    path: '/admin',
    allowedRoles: ['admin'] as UserRole[],
  },
];