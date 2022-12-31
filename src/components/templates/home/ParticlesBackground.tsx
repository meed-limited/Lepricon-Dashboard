import React from "react";
import { useCallback } from "react";
import { loadFull } from "tsparticles";
import Particles from "react-tsparticles";
import type { Engine } from "tsparticles-engine";

import particlesConfig from "./particles";

import styles from "../../../styles/Home.module.css";

const ParticleBackground = () => {
    const particlesInit = useCallback(async (engine: Engine) => {
        await loadFull(engine);
    }, []);

    return (
        <Particles
            init={particlesInit}
            options={particlesConfig}
            className={styles.particles}
            height="100vh"
            width="100vw"
        ></Particles>
    );
};

export default ParticleBackground;
