import React, { useCallback } from "react";

import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import type { Engine } from "tsparticles-engine";

import styles from "../../../styles/Home.module.css";
import particlesConfig from "./particles";

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
            style={{ marginTop: "65px" }}
        ></Particles>
    );
};

export default ParticleBackground;
