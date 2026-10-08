import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Float, useGLTF } from '@react-three/drei';

// A placeholder model if no actual GLTF/GLB model is passed
const PlaceholderModel = ({ color = '#4F46E5' }) => {
  const meshRef = useRef();
  
  // Subtle rotation
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef} castShadow receiveShadow>
        <torusKnotGeometry args={[1, 0.3, 128, 32]} />
        <meshPhysicalMaterial 
          color={color} 
          roughness={0.1}
          metalness={0.8}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </mesh>
    </Float>
  );
};

const Product3DViewer = ({ modelUrl, fallbackColor }) => {
  return (
    <div className="w-full h-[400px] sm:h-[500px] md:h-[600px] relative rounded-3xl overflow-hidden bg-gradient-to-b from-gray-900 to-black border border-white/10 group">
      <div className="absolute inset-0 bg-blue-500/5 opacity-50 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0"></div>
      
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        <span className="bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-2 shadow-xl shadow-black/50">
          <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
          Interactive 3D
        </span>
      </div>

      <Canvas shadows camera={{ position: [0, 0, 4.5], fov: 45 }} className="z-10">
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        
        {/* Render either the real model or the fancy placeholder */}
        {modelUrl ? (
          // In a real scenario, we'd use useGLTF(modelUrl). For safety, if no URL, use placeholder.
          <PlaceholderModel color={fallbackColor} />
        ) : (
          <PlaceholderModel color={fallbackColor} />
        )}
        
        <Environment preset="city" />
        <ContactShadows position={[0, -1.5, 0]} opacity={0.4} scale={10} blur={2} far={4} color="#000000" />
        
        {/* Allow users to rotate and zoom */}
        <OrbitControls 
          enablePan={false}
          enableZoom={true} 
          minDistance={2} 
          maxDistance={8}
          autoRotate={true}
          autoRotateSpeed={0.5}
        />
      </Canvas>
      
      <div className="absolute bottom-4 left-0 right-0 flex justify-center z-10 pointer-events-none">
        <p className="text-gray-400 text-xs tracking-widest uppercase bg-black/50 backdrop-blur px-4 py-1.5 rounded-full border border-white/10">
          Drag to rotate • Scroll to zoom
        </p>
      </div>
    </div>
  );
};

export default Product3DViewer;
