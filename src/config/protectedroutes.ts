export type UserRole = 'admin' | 'customer';

export const protectedRoutes = [
  {
    path: '/cart',
    allowedRoles: ['customer','admin'] as UserRole[],
  },
  {
    path: '/admin',
    allowedRoles: ['admin'] as UserRole[],
  },
    {
    path: '/dashboard',
    allowedRoles: ['admin'] as UserRole[],
  },
];