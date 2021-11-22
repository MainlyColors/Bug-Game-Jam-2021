import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { Physics, useBox, usePlane } from '@react-three/cannon';
import { useEffect, useRef } from 'react';
import './App.css';

function Caterpillar() {
  const width = 3; // x
  const height = 2; // y
  const depth = 2; // z
  const bodyOneScaleMultiplier = 0.9;
  const bodyTwoScaleMultiplier = 0.81;
  const bodyThreeScaleMultiplier = 0.729;
  const startingXPosition = width / 2;

  return (
    <group position={[0, 0, 0]}>
      <mesh position={[startingXPosition, 0, 0]}>
        <boxGeometry args={[width, height, depth]} />
        <meshBasicMaterial color="hotpink" />
      </mesh>
      <mesh
        position={[
          width + startingXPosition - (width - width * bodyOneScaleMultiplier),
          0,
          0,
        ]}
      >
        <boxGeometry
          args={[
            width * bodyOneScaleMultiplier,
            height * bodyOneScaleMultiplier,
            depth * bodyOneScaleMultiplier,
          ]}
        />
        <meshBasicMaterial color="red" />
      </mesh>
    </group>
  );
}

function Box() {
  const [ref, boxApi] = useBox(() => ({
    mass: 1,
    position: [0, 10, 0],
    args: [2, 2, 2],
  }));

  const controls = useControls();

  useFrame(() => {
    const { forward, backward, left, right, brake, reset } = controls.current;

    if (forward) {
      boxApi.velocity.set(5, 0, 0);
    }
    if (backward) {
      boxApi.velocity.set(-5, 0, 0);
    }
    if (left) {
      boxApi.velocity.set(0, 0, -5);
    }
    if (right) {
      boxApi.velocity.set(0, 0, 5);
    }
    if (brake) {
      boxApi.velocity.set(0, 5, 0);
    }

    // for (let e = 2; e < 4; e++) {
    //   boxApi.velocity;
    // }
  });

  return (
    <mesh ref={ref}>
      <boxGeometry args={[2, 2, 2]} />
      <meshNormalMaterial color="hotpink" />
    </mesh>
  );
}

function Plane() {
  const [ref] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0] }));
  console.log(ref);
  return (
    <mesh ref={ref} position={[0, 0, 0]}>
      <planeGeometry args={[100, 100]} />
      <meshBasicMaterial color="hotpink" />
    </mesh>
  );
}

function App() {
  return (
    <div id="canvas-container">
      <Canvas>
        <OrbitControls />
        <ambientLight intensity={0.1} />
        <directionalLight color="red" position={[0, 0, 5]} />
        <Physics>
          <Box />
          <Plane />
        </Physics>
        {/* <Caterpillar /> */}
        <Stars />
      </Canvas>
    </div>
  );
}

export default App;

// stolen from https://github.com/pmndrs/use-cannon/blob/a15a1bc1383d70c026164aeed8c944127434dce6/examples/src/demos/RaycastVehicle/Vehicle.tsx#L154
// takes target key : example "w"
// event takes a boolean and returns nothing to check if key is pressed
export function useKeyPress(
  target: string[],
  event: (pressed: boolean) => void
) {
  //effect runs each update even with an empty dependency array
  useEffect(() => {
    // takes a key and searches event object returned on event listener, -1 means not found
    const downHandler = ({ key }: KeyboardEvent) =>
      target.indexOf(key) !== -1 && event(true);
    const upHandler = ({ key }: KeyboardEvent) =>
      target.indexOf(key) !== -1 && event(false);
    window.addEventListener('keydown', downHandler);
    window.addEventListener('keyup', upHandler);
    //clean up function, clears event handlers before mount and after useEffect run
    return () => {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
    };
  }, []);
}

export function useControls() {
  // passed false initial values
  const keys = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
    brake: false,
    reset: false,
  });
  // checks for all possible keys then returns key object to work with
  useKeyPress(['ArrowUp', 'w'], (pressed) => (keys.current.forward = pressed));
  useKeyPress(
    ['ArrowDown', 's'],
    (pressed) => (keys.current.backward = pressed)
  );
  useKeyPress(['ArrowLeft', 'a'], (pressed) => (keys.current.left = pressed));
  useKeyPress(['ArrowRight', 'd'], (pressed) => (keys.current.right = pressed));
  useKeyPress([' '], (pressed) => (keys.current.brake = pressed));
  useKeyPress(['r'], (pressed) => (keys.current.reset = pressed));
  return keys;
}
