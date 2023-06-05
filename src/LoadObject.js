/* eslint-disable no-param-reassign */
/* eslint-disable prefer-template */
import { useEffect, useState } from "react";
import * as THREE from "three";
import { useLoader, useThree } from "@react-three/fiber";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import modelPath from "./models/animal.obj";
import QuadFrameGeometry from "./Quad";
import "./App.css";

export default function LoadObject() {
  const [childMaterials, setChildMaterials] = useState({});
  const { scene } = useThree();

  const object = useLoader(OBJLoader, modelPath);

  const geo = object.children[0].geometry;

  const quadgeo = new QuadFrameGeometry(geo);

  var wireframeMaterial = new THREE.LineBasicMaterial( { color: 0xf000ff, linewidth: 10,} );

  var wireframe = new THREE.LineSegments( quadgeo, wireframeMaterial );

  useEffect(() => {
    let mounted = true;
    if (mounted) {
      const materialsChildren = {};
      object.traverse((child) => {
        if (child.isMesh) {
          materialsChildren[child.uuid] = child.material;
        }
      });
      setChildMaterials(materialsChildren);
    }
    return () => {
      mounted = false;
    };
  }, [object]);

  useEffect(() => {
    let mounted = true;
    if (mounted && childMaterials && Object.keys(childMaterials).length > 0) {
      object.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          if (childMaterials[child.uuid]) {
            child.material = new THREE.MeshPhongMaterial({
              color: 0x000000,
              wireframe: false,
            });

            scene.add(child);
            scene.add(wireframe);
          }
        }
      });
    }
    return () => {
      mounted = false;
    };
  }, [childMaterials]);
}
