import React from "react";
import { useSelector } from "react-redux";
import {
  selectIsAuthenticated,
  selectUserRole,
  selectIsAdmin,
  selectIsMechanic,
  selectIsCustomer,
} from "../Redux-Toolkit/slices/authSlice";

/**
 * AuthorizedElement
 * Simple wrapper to show children only when the user has one of the allowed roles.
 *
 * Usage:
 * <AuthorizedElement allowedRoles={["admin"]}>
 *   <button>Admin Only</button>
 * </AuthorizedElement>
 */
const AuthorizedElement = ({
  allowedRoles = [],
  children,
  fallback = null,
}) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const role = useSelector(selectUserRole);
  const isAdmin = useSelector(selectIsAdmin);
  const isMechanic = useSelector(selectIsMechanic);
  const isCustomer = useSelector(selectIsCustomer);
  console.log(role);
  console.log(isAdmin);
  console.log(isMechanic);
  console.log(isCustomer);

  if (!isAuthenticated) return null;

  // If no roles specified, just require authentication
  if (!allowedRoles.length) {
    return children;
  }

  const roleFlags = {
    admin: isAdmin,
    mechanic: isMechanic,
    customer: isCustomer,
  };

  const hasAllowedRole = allowedRoles.some((r) => role === r || roleFlags[r]);

  if (!hasAllowedRole) {
    return fallback;
  }

  return children;
};

export default AuthorizedElement;
