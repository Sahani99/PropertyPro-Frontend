// src/components/user/UserGLBViewer.jsx
import React, { Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Html, Center, PresentationControls } from '@react-three/drei';
import { Box, Spinner, Text } from '@chakra-ui/react'; // For fallback UI

const Model = ({ modelUrl, onModelLoad }) => {
  const { scene } = useGLTF(modelUrl); // Destructure scene directly

  useEffect(() => {
    if (scene && onModelLoad) {
      onModelLoad(scene);
    }
  }, [scene, onModelLoad]);

  return <primitive object={scene} />;
};

const UserGLBViewer = ({ modelUrl }) => {
  if (!modelUrl) {
    return (
      <Box p={5} borderWidth="1px" borderRadius="md" textAlign="center" minHeight="300px" display="flex" alignItems="center" justifyContent="center">
        <Text>No 3D model available for this project yet.</Text>
      </Box>
    );
  }

  return (
    <Box
      height={{ base: "calc(100vh - 200px)", md: "calc(100vh - 250px)" }} // Adjust based on your navbar/footer height
      width="100%"
      borderWidth="1px"
      borderRadius="md"
      overflow="hidden"
      bg="gray.50" // A light background for the canvas
    >
      <Canvas camera={{ position: [0, 1.5, 8], fov: 50 }}> {/* Slightly adjusted user-facing camera */}
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 10, 7.5]} intensity={1.0} castShadow />
        <directionalLight position={[-5, 5, -5]} intensity={0.5} />
        <Suspense
          fallback={
            <Html center>
              <Spinner size="xl" thickness="4px" color="teal.500" />
              <Text mt={2}>Loading 3D Model...</Text>
            </Html>
          }
        >
          <Center> {/* Centers the model within the available space */}
            <PresentationControls
              speed={1.5}
              global
              zoom={0.8} // Initial zoom level
              rotation={[0, 0, 0]} // Initial rotation
              polar={[-0.2, Math.PI / 4]} // Vertical rotation limits
              azimuth={[-Math.PI / 4, Math.PI / 4]} // Horizontal rotation limits
            >
              <Model modelUrl={modelUrl} />
            </PresentationControls>
          </Center>
        </Suspense>
        {/* OrbitControls can still be used if PresentationControls aren't desired, or as a fallback */}
        {/* <OrbitControls enablePan={true} enableZoom={true} /> */}
      </Canvas>
    </Box>
  );
};

export default UserGLBViewer;