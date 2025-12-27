# Simple Login Usage Example

## How to Use the Boolean Flags

After login, you can check user roles using the boolean flags:

### In React Components

```javascript
import { useSelector } from "react-redux";
import { 
  selectIsAdmin, 
  selectIsMechanic, 
  selectIsCustomer,
  selectIsAuthenticated 
} from "../Redux-Toolkit/slices/authSlice";

function MyComponent() {
  const IsAdmin = useSelector(selectIsAdmin);
  const IsMechanic = useSelector(selectIsMechanic);
  const IsCustomer = useSelector(selectIsCustomer);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  if (!isAuthenticated) {
    return <div>Please login</div>;
  }

  return (
    <div>
      {IsAdmin && <div>Admin Panel</div>}
      {IsMechanic && <div>Mechanic Dashboard</div>}
      {IsCustomer && <div>Customer View</div>}
    </div>
  );
}
```

### Conditional Rendering

```javascript
import { useSelector } from "react-redux";
import { selectIsAdmin, selectIsMechanic } from "../Redux-Toolkit/slices/authSlice";

function ProtectedComponent() {
  const IsAdmin = useSelector(selectIsAdmin);
  const IsMechanic = useSelector(selectIsMechanic);

  // Show admin features
  if (IsAdmin) {
    return <AdminFeatures />;
  }

  // Show mechanic features
  if (IsMechanic) {
    return <MechanicFeatures />;
  }

  // Default customer view
  return <CustomerFeatures />;
}
```

### Route Protection

```javascript
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { selectIsAdmin, selectIsAuthenticated } from "../Redux-Toolkit/slices/authSlice";

function AdminRoute({ children }) {
  const IsAdmin = useSelector(selectIsAdmin);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (!IsAdmin) {
    return <Navigate to="/dashboard" />;
  }

  return children;
}
```

## Available Selectors

- `selectIsAdmin` - Returns true if user is admin
- `selectIsMechanic` - Returns true if user is mechanic
- `selectIsCustomer` - Returns true if user is customer
- `selectIsAuthenticated` - Returns true if user is logged in
- `selectCurrentUser` - Returns user object
- `selectUserRole` - Returns role string ("admin", "mechanic", or "customer")
- `selectAuthLoading` - Returns loading state
- `selectAuthError` - Returns error message if any

## State Structure

```javascript
{
  user: { id, email },
  role: "admin" | "mechanic" | "customer",
  session: SupabaseSession,
  IsAdmin: boolean,
  IsMechanic: boolean,
  IsCustomer: boolean,
  loading: boolean,
  error: string | null,
  isAuthenticated: boolean
}
```






