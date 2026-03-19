import { Canvas } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { Suspense, useRef, useState, useEffect } from "react";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import { gsap } from "gsap";
import "./App.css";

function Lamp({ toggle, lightOn }) {
  const { scene } = useGLTF("/lamp.glb");
  const lampRef = useRef();

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material.emissive = new THREE.Color("#d946ef");

        gsap.to(child.material, {
          emissiveIntensity: lightOn ? 6 : 0,
          duration: 0.6,
        });
      }
    });
  }, [scene, lightOn]);

  return (
    <primitive
      ref={lampRef}
      object={scene}
      scale={8}
      position={[-2, -1.4, 0]}
      onClick={toggle}
    />
  );
}

export default function App() {
  const [lightOn, setLightOn] = useState(false);

  const [isRegister, setIsRegister] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const mainLight = useRef();

  function toggleLamp() {
    const state = !lightOn;
    setLightOn(state);

    if (state) {
      gsap.to(mainLight.current, {
        intensity: 18,
        duration: 0.6,
        ease: "power2.out",
      });

      gsap.to(".loginForm", {
        opacity: 1,
        scale: 1.1,
        duration: 0.6,
        transformOrigin: "center",
      });
    } else {
      gsap.to(mainLight.current, {
        intensity: 0,
        duration: 0.4,
      });

      gsap.to(".loginForm", {
        opacity: 0,
        scale: 0.8,
        duration: 0.4,
      });
    }
  }

  async function handleLogin() {
    const res = await fetch("https://manga-site-er5s.onrender.com/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message);
      return;
    }

    /* сохраняем пользователя */
    localStorage.setItem("username", data.username);

    /* переход на сайт */
    window.location.href = `https://manga-site-er5s.onrender.com/?user=${data.username}`;
  }

  async function handleRegister() {
    try {
      const res = await fetch(
        "https://manga-site-er5s.onrender.com/api/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            password,
          }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      alert("Регистрация успешна");

      setIsRegister(false);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="scene">
      <Canvas camera={{ position: [0, 0, 7], fov: 50 }}>
        <ambientLight intensity={0.2} />

        <spotLight
          ref={mainLight}
          position={[-3, 0.1, 0]}
          angle={0.7}
          penumbra={1}
          intensity={0}
          distance={6}
          decay={2}
          color="#c084fc"
        />

        <pointLight
          position={[-3, -0.4, 0]}
          intensity={lightOn ? 1.5 : 0}
          distance={4}
          color="#a855f7"
        />

        <Suspense fallback={null}>
          <Lamp toggle={toggleLamp} lightOn={lightOn} />
        </Suspense>

        <EffectComposer>
          <Bloom
            intensity={0.2}
            luminanceThreshold={0.85}
            luminanceSmoothing={0.9}
          />
        </EffectComposer>
      </Canvas>

      <div className="hintText">Нажмите на верёвку</div>

      <div className="hintCircle"></div>

      <div className="loginForm">
        <h2>{isRegister ? "Регистрация" : "Вход"}</h2>

        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={isRegister ? handleRegister : handleLogin}>
          {isRegister ? "Зарегистрироваться" : "Войти"}
        </button>

        <p
          style={{ cursor: "pointer", textAlign: "center" }}
          onClick={() => setIsRegister(!isRegister)}
        >
          {isRegister ? "Уже есть аккаунт? Войти" : "Нет аккаунта? Регистрация"}
        </p>
      </div>
    </div>
  );
}
