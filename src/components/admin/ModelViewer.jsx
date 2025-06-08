// src/components/admin/ModelViewer.jsx
import React, { Suspense, useEffect, useMemo  } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Html } from '@react-three/drei';
import * as THREE from 'three'; // Import THREE itself for things like Box3

// Helper to center and scale the model
// const FitModelToView = ({ model }) => {
//   const box = new THREE.Box3().setFromObject(model.scene);
//   const size = box.getSize(new THREE.Vector3());
//   const center = box.getCenter(new THREE.Vector3());

//   model.scene.position.x += (model.scene.position.x - center.x);
//   model.scene.position.y += (model.scene.position.y - center.y);
//   model.scene.position.z += (model.scene.position.z - center.z);

//   const maxDim = Math.max(size.x, size.y, size.z);
//   const fov = 45; // Your camera's FOV
//   let cameraZ = maxDim / 2 / Math.tan(fov / 2 * Math.PI / 180);
//   cameraZ *= 1.5; // Add some padding

//   // This is a rough adjustment, you might need more sophisticated camera positioning
//   // Or allow the OrbitControls to handle initial zoom based on its target.
//   // For now, we'll let OrbitControls handle the zoom mostly.
//   // You can also set the camera position directly in the Canvas.
  
//   return null; // This component doesn't render anything itself
// };


const Model = ({ fileUrl, onModelLoad }) => {
  const gltf = useGLTF(fileUrl); // useGLTF is a hook from Drei to load GLB/GLTF

  useEffect(() => {
    if (gltf.scene) {
      // Optional: Center and scale the model after loading
      const box = new THREE.Box3().setFromObject(gltf.scene);
      const center = box.getCenter(new THREE.Vector3());
      gltf.scene.position.sub(center); // Center the model at origin

      if (onModelLoad) onModelLoad(gltf.scene); // Callback if needed
    }
  }, [gltf.scene, onModelLoad]);

  return <primitive object={gltf.scene} scale={1} />; // Adjust scale as needed
};

const ModelViewer = ({ file }) => {
   const fileUrl = useMemo(() => {
    if (file instanceof File) {
      return URL.createObjectURL(file);
    }
    if (file && file.previewUrl) { // If file is an object with a previewUrl (e.g., from initialData)
      return file.previewUrl;
    }
    return null; // No valid file or URL
  }, [file]);

 useEffect(() => {
    return () => {
      if (file instanceof File) {
        URL.revokeObjectURL(fileUrl);
      }
    };
  }, [file, fileUrl]); // fileUrl depends on file, so file is sufficient here if fileUrl is always derived


  return (
    <Box height={{ base: "300px", md: "500px" }} width="100%" borderWidth="1px" borderRadius="md" overflow="hidden">
      <Canvas camera={{ position: [0, 2, 10], fov: 45 }}> {/* Adjust camera position and fov */}
        <ambientLight intensity={0.7} />
        <spotLight intensity={0.5} angle={0.1} penumbra={1} position={[10, 15, 10]} castShadow />
        <directionalLight intensity={0.8} position={[5, 5, 5]} />
        <Suspense fallback={<Html center><Spinner size="xl" /></Html>}>
          <Model fileUrl={fileUrl} />
        </Suspense>
        <OrbitControls 
          enableZoom={true} 
          enablePan={true} 
         //  minDistance={1} // Optional: zoom constraints
         //  maxDistance={50}
        />
      </Canvas>
    </Box>
  );
};

export default ModelViewer;