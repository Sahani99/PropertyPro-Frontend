// frontend/src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box, Flex } from '@chakra-ui/react'; 
import { AuthProvider, useAuth } from './context/AuthContext';
// -------------------- CHANGE 1: Import CompareProvider --------------------
import { CompareProvider } from './context/CompareContext'; 
import LoginPage from './pages/LoginPage';
import PropertiesPage from './pages/PropertiesPage';
import DashboardPage from './pages/DashboardPage';
import HomePage from './pages/HomePage';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/ProtectedRoute';
// import FutureProjectAdminPage from './pages/admin/FutureProjectAdminPage';
// import Project3DViewPage from './pages/user/Project3DViewPage';  
import ComparePropertiesPage  from './pages/ComparePropertiesPage';
import PropertyDetailsPage from './pages/PropertyDetailsPage'; // --- MODIFICATION: IMPORT THE NEW PAGE ---



// A small component to handle redirection if already logged in and trying to access /login
function PublicRoute({ children }) {
    const { isAuthenticated, loading } = useAuth();
    if (loading) return <div>Loading...</div>; // Or a spinner
    return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
}

function App() {
    return (
        
        <AuthProvider>
            {/* -------------------- CHANGE 2: Add CompareProvider here -------------------- */}
            <CompareProvider>
                <Router>
                    <Flex direction="column" minH="100vh"> 
                        <Navbar />
                        <Box as="main" flex="20" width="100vw">
                        
                            <Routes>
                                <Route path="/" element={<HomePage />} />
                            
                                <Route path="/properties"element={<PropertiesPage/>}/>
                                <Route path="/properties/:propertyId" element={<PropertyDetailsPage />} /> {/* --- MODIFICATION: ADD THE DETAILS PAGE ROUTE --- */}
                                {/* <Route path="/admin/future-project"element={<FutureProjectAdminPage/>}/> */}
                                {/* <Route path="/future-projects/:projectId/view-3d" element={<Project3DViewPage />} /> */}
                                <Route path="/login"element={<PublicRoute><LoginPage /></PublicRoute>}/>
                                {/* <Route path="/register" element={<RegisterPage />} /> */} {/* Optional */}

                                {/* Protected Routes */}
                                <Route element={<ProtectedRoute />}>
                                    <Route path="/dashboard" element={<DashboardPage />} />
                                    <Route path="/compare" element={<ComparePropertiesPage />} />
                                </Route>
                                {/* <Route element={<ProtectedRoute />}><Route path="/admin/future-project" element={<FutureProjectAdminPage />} /> */}
                                    {/* Add other protected routes here */}
                                {/* </Route> */}

                                <Route path="*" element={<Navigate to="/" replace />} /> {/* Fallback for unknown routes */}
                            </Routes>
                        
                        </Box>
                        <Footer />
                    </Flex>
                </Router>
            </CompareProvider>
            {/* -------------------- CHANGE 3: Close the provider here -------------------- */}
        </AuthProvider>
    );
}

export default App;