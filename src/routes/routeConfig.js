import LogIn from "@pages/AuthPages/LogIn";

export const ROLES = {
	ADMIN: 1,
	DOCTOR: 2,
	PATIENT: 3,
}

export const publicRoutes = [
	{
		path: "/login",
		element: LogIn
	}
];

export const specialRoutes = [];

export const protectedRoutes = [];

export const groupRoutesByPermission = (routes) => {
  return routes.reduce((acc, route) => {
    // Genera una clave única basada en roles
    const roleKey = route.allowedRoles.join('-');
    
    if (!acc[roleKey]) {
      acc[roleKey] = [];
    }
    acc[roleKey].push(route);
    return acc;
  }, {});
};