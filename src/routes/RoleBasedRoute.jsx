import { Navigate, Outlet } from 'react-router-dom';

/**
 * Componente que protege rutas basado en roles de usuario
 * @param allowedRoles Array de IDs de roles permitidos para acceder a la ruta
 * @param fallbackPath Ruta a la que redirigir si el usuario no tiene acceso (por defecto: /home)
 */
const RoleBasedRoute =({ allowedRoles, fallbackPath = '/home' }) => {
  const decoded = JSON.parse(localStorage.getItem('decoded') || '{}');
  const userRole = decoded?.roles_id || null; 

  // Verifica tanto el rol como el departamento
  const isAllowed = userRole !== undefined && allowedRoles.includes(userRole);
  
  return isAllowed ? <Outlet /> : <Navigate to={fallbackPath} replace />;
}

export default RoleBasedRoute;