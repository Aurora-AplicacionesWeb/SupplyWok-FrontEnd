export const normalizeRole = (role) => role?.toString().toLowerCase() ?? null;

export const getHomeByRole = (role) => `/${normalizeRole(role) ?? 'restaurant'}/dashboard`;

export const getScopedPathByRole = (role, section) => `/${normalizeRole(role) ?? 'restaurant'}/${section}`;

export const getRoleFromPath = (path) => {
  if (path.startsWith('/restaurant')) return 'restaurant';
  if (path.startsWith('/supplier')) return 'supplier';
  return null;
};
