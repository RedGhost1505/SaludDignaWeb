import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "../layout/AppLayout";
import ProtectedRoute from "./ProtectedRoute";
import RoleBasedRoute from "./RoleBasedRoute";
import { publicRoutes, specialRoutes, protectedRoutes, groupRoutesByPermission } from "./routeConfig";
import Vision from "@pages/MainPages/Vision";

/**
 * Componente centralizado que renderiza todas las rutas de la aplicación
 */
const AppRoutes = () => {
  const isAuthenticated = !!localStorage.getItem('token');
  const groupedRoutes = groupRoutesByPermission(protectedRoutes);

  // Validación adicional del token
  // const hasValidToken = () => {
  //   try {
  //     const token = localStorage.getItem('token');
  //     return !!token && !!localStorage.getItem('decoded');
  //   } catch (error) {
  //     console.error('Error validating token:', error);
  //     return false;
  //   }
  // };

  // if (!hasValidToken() && isAuthenticated) {
  //   localStorage.clear(); // Limpiar datos inválidos
  //   return <Navigate to="/" replace />;
  // }

  return (
    <Routes>
      {/* Rutas públicas */}
      {console.log('Public Routes:', publicRoutes)}
      {console.log('Is Authenticated:', isAuthenticated)}
      {!isAuthenticated ? (
        publicRoutes.map(route => (
          <Route key={route.path} path={route.path} element={<route.element />} />
        ))
      ) : (
        <Route path="/" element={<Navigate to="/home" replace />} />
      )}
      {/* Asegúrate de que la ruta "/vision" esté incluida */}
      <Route path="/vision" element={<Vision />} />

      {/* Rutas protegidas */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          {Object.entries(groupedRoutes).map(([permKey, routes]) => (
            routes.length > 0 && (
              <Route
                key={permKey}
                element={
                  <RoleBasedRoute
                    allowedRoles={routes[0].allowedRoles}
                    fallbackPath="/home"
                  />
                }
              >
                {routes.map(route => (
                  <Route
                    key={route.path}
                    path={route.path}
                    element={<route.element />}
                  />
                ))}
              </Route>
            )
          ))}
        </Route>
      </Route>

      {/* Rutas especiales */}
      {specialRoutes.map(route => (
        <Route key={route.path} path={route.path} element={<route.element />} />
      ))}
    </Routes>
  )
};

export default AppRoutes;