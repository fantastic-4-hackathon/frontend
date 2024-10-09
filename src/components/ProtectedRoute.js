import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element: Component, ...rest }) => {
    const token = sessionStorage.getItem('token');  // Using sessionStorage instead of localStorage (better security)

    // If token exists, render the component, otherwise redirect to login
    return token ? <Component {...rest} /> : <Navigate to="/" />;
};

export default ProtectedRoute;