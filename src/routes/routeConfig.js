import LogIn from "@pages/AuthPages/LogIn";
import Logout from "@pages/AuthPages/Logout";

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

export const protectedRoutes = [
  {
    path: "/logout",
    element: Logout,
    allowedRoles: [
      ROLES.ADMIN,
      ROLES.DOCTOR,
      ROLES.PATIENT
    ]
  },
];

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