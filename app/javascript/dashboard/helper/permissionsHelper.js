export const hasPermissions = (
  requiredPermissions = [],
  availablePermissions = []
) => {
  return requiredPermissions.some(permission =>
    availablePermissions.includes(permission)
  );
};

export const getCurrentAccount = ({ accounts } = {}, accountId = null) => {
  return accounts.find(account => Number(account.id) === Number(accountId));
};

export const getUserPermissions = (user, accountId) => {
  const currentAccount = getCurrentAccount(user, accountId) || {};
  return currentAccount.permissions || [];
};

const isPermissionsPresentInRoute = route =>
  route.meta && route.meta.permissions;

export const buildPermissionsFromRouter = (routes = []) =>
  routes.reduce((acc, route) => {
    if (route.name) {
      if (!isPermissionsPresentInRoute(route)) {
        // eslint-disable-next-line
        console.error(route);
        throw new Error(
          "The route doesn't have the required permissions defined"
        );
      }
      acc[route.name] = route.meta.permissions;
    }

    if (route.children) {
      acc = {
        ...acc,
        ...buildPermissionsFromRouter(route.children),
      };
    }

    return acc;
  }, {});
