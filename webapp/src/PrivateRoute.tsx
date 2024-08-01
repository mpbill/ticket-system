import { useNavigate } from "react-router-dom";
import React from 'react';
import { PrivateRouteProps, useAuth } from "./Auth";

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    if (!isAuthenticated) {
        // Redirect to the login page if not authenticated
        navigate('/login');
    }

    // Render the requested component if authenticated
    return children;
};
