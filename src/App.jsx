import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box, Flex } from '@chakra-ui/react'; 
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import PropertiesPage from './pages/PropertiesPage';
import DashboardPage from './pages/DashboardPage';
import HomePage from './pages/HomePage';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import FutureProjectAdminPage from './pages/admin/FutureProjectAdminPage';
import Project3DViewPage from './pages/user/Project3DViewPage';  


// A small component to handle redirection if already logged in and trying to access /login
function PublicRoute({ children }) {
    const { isAuthenticated, loading } = useAuth();
    if (loading) return <div>Loading...</div>; // Or a spinner
    return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
}

function App() {
    return (
        <AuthProvider>
            <Router>
                 <Flex direction="column" minH="100vh"> 
                <Navbar />
                          <Box
            as="main"
            flex="20"      // Allows this box to grow and fill available vertical space
            width="100vw"  // Ensures it takes full width
            // bg="yellow.100" // Temporary: Add a background to visualize this container
          >
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/login"element={<PublicRoute><LoginPage /></PublicRoute>}/>
                        <Route path="/properties"element={<PublicRoute><PropertiesPage/></PublicRoute>}/>
                        <Route path="/admin/future-project"element={<PublicRoute><FutureProjectAdminPage/></PublicRoute>}/>
                        <Route path="/future-projects/:projectId/view-3d" element={<Project3DViewPage />} />

                        {/* <Route path="/register" element={<RegisterPage />} /> */} {/* Optional */}

                        {/* Protected Routes */}
                        <Route element={<ProtectedRoute />}><Route path="/dashboard" element={<DashboardPage />} />
                        
                        </Route>
                        {/* <Route element={<ProtectedRoute />}><Route path="/admin/future-project" element={<FutureProjectAdminPage />} /> */}
                            {/* Add other protected routes here */}
                        {/* </Route> */}

                        <Route path="*" element={<Navigate to="/" replace />} /> {/* Fallback for unknown routes */}
                    </Routes>
                
                </Box>
                </Flex>
                            </Router>
        </AuthProvider>
    );
}

export default App;