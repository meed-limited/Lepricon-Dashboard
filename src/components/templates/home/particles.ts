import type { ISourceOptions } from "tsparticles-engine";
const particlesConfig: ISourceOptions = {
    autoPlay: true,
    background: {
        color: {
            value: "transparent",
        },
        image: "",
        position: "50% 50%",
        repeat: "no-repeat",
        size: "cover",
        opacity: 1,
    },
    backgroundMask: {
        cover: {
            color: {
                value: "#fff",
            },
            opacity: 1,
        },
        enable: false,
    },
    defaultThemes: {},
    delay: 0,
    fullScreen: {
        enable: true,
        zIndex: 1,
    },
    detectRetina: true,
    duration: 0,
    fpsLimit: 120,
    interactivity: {
        events: {
            onClick: {
                enable: true,
                mode: "push",
            },
            onHover: {
                enable: true,
                mode: ["grab", "trail"],
                parallax: {
                    enable: false,
                    force: 60,
                    smooth: 10,
                },
            },
            resize: {
                delay: 0.5,
                enable: true,
            },
        },
        modes: {
            grab: {
                distance: 150,
                links: {
                    blink: true,
                    consent: false,
                    opacity: 1,
                },
            },
            slow: {
                factor: 3,
                radius: 100,
            },
            trail: {
                delay: 1,
                pauseOnStop: false,
                quantity: 1,
            },
        },
    },
    manualParticles: [],
    particles: {
        bounce: {
            horizontal: {
                random: {
                    enable: false,
                    minimumValue: 0.1,
                },
                value: 1,
            },
            vertical: {
                random: {
                    enable: false,
                    minimumValue: 0.1,
                },
                value: 1,
            },
        },
        collisions: {
            absorb: {
                speed: 2,
            },
            bounce: {
                horizontal: {
                    random: {
                        enable: false,
                        minimumValue: 0.1,
                    },
                    value: 1,
                },
                vertical: {
                    random: {
                        enable: false,
                        minimumValue: 0.1,
                    },
                    value: 1,
                },
            },
            enable: false,
            overlap: {
                enable: true,
                retries: 0,
            },
        },
        color: {
            value: "#ffffff",
            animation: {
                h: {
                    count: 0,
                    enable: false,
                    offset: 0,
                    speed: 1,
                    decay: 0,
                    sync: true,
                },
                s: {
                    count: 0,
                    enable: false,
                    offset: 0,
                    speed: 1,
                    decay: 0,
                    sync: true,
                },
                l: {
                    count: 0,
                    enable: false,
                    offset: 0,
                    speed: 1,
                    decay: 0,
                    sync: true,
                },
            },
        },
        groups: {},
        move: {
            angle: {
                offset: 0,
                value: 90,
            },
            attract: {
                distance: 200,
                enable: false,
                rotate: {
                    x: 600,
                    y: 1200,
                },
            },
            decay: 0,
            distance: {},
            direction: "none",
            drift: 0,
            enable: true,
            gravity: {
                acceleration: 9.81,
                enable: false,
                inverse: false,
                maxSpeed: 50,
            },
            path: {
                clamp: true,
                delay: {
                    random: {
                        enable: false,
                        minimumValue: 0,
                    },
                    value: 0,
                },
                enable: false,
                options: {},
            },
            outModes: {
                default: "out",
                bottom: "out",
                left: "out",
                right: "out",
                top: "out",
            },
            random: false,
            size: false,
            speed: 0.5,
            spin: {
                acceleration: 0,
                enable: false,
            },
            straight: false,
            trail: {
                enable: false,
                length: 10,
                fillColor: {
                    value: "#000000",
                },
            },
            vibrate: false,
            warp: false,
        },
        number: {
            density: {
                enable: true,
                area: 800,
                factor: 1000,
            },
            limit: 0,
            value: 80,
        },
        opacity: {
            random: {
                enable: false,
                minimumValue: 0.1,
            },
            value: 0.5,
            animation: {
                count: 0,
                enable: false,
                speed: 1,
                decay: 0,
                sync: false,
                destroy: "none",
                startValue: "random",
                minimumValue: 0.1,
            },
        },
        reduceDuplicates: false,
        shadow: {
            blur: 0,
            color: {
                value: "#000",
            },
            enable: false,
            offset: {
                x: 0,
                y: 0,
            },
        },
        shape: {
            options: {},
            type: "edge",
        },
        size: {
            random: {
                enable: true,
                minimumValue: 1,
            },
            value: {
                min: 1,
                max: 5,
            },
            animation: {
                count: 0,
                enable: false,
                speed: 40,
                decay: 0,
                sync: false,
                destroy: "none",
                startValue: "random",
                minimumValue: 0.1,
            },
        },
        stroke: {
            width: 0,
        },
        zIndex: {
            random: {
                enable: false,
                minimumValue: 0,
            },
            value: 0,
            opacityRate: 1,
            sizeRate: 1,
            velocityRate: 1,
        },
        life: {
            count: 0,
            delay: {
                random: {
                    enable: false,
                    minimumValue: 0,
                },
                value: 0,
                sync: false,
            },
            duration: {
                random: {
                    enable: false,
                    minimumValue: 0.0001,
                },
                value: 0,
                sync: false,
            },
        },
        rotate: {
            random: {
                enable: false,
                minimumValue: 0,
            },
            value: 0,
            animation: {
                enable: false,
                speed: 0,
                decay: 0,
                sync: false,
            },
            direction: "clockwise",
            path: false,
        },
        destroy: {
            bounds: {},
            mode: "none",
            split: {
                count: 1,
                factor: {
                    random: {
                        enable: false,
                        minimumValue: 0,
                    },
                    value: 3,
                },
                rate: {
                    random: {
                        enable: false,
                        minimumValue: 0,
                    },
                    value: {
                        min: 4,
                        max: 9,
                    },
                },
                sizeOffset: true,
                particles: {},
            },
        },
        roll: {
            darken: {
                enable: false,
                value: 0,
            },
            enable: false,
            enlighten: {
                enable: false,
                value: 0,
            },
            mode: "vertical",
            speed: 25,
        },
        tilt: {
            random: {
                enable: false,
                minimumValue: 0,
            },
            value: 0,
            animation: {
                enable: false,
                speed: 0,
                decay: 0,
                sync: false,
            },
            direction: "clockwise",
            enable: false,
        },
        twinkle: {
            lines: {
                enable: false,
                frequency: 0.05,
                opacity: 1,
            },
            particles: {
                enable: false,
                frequency: 0.05,
                opacity: 1,
            },
        },
        wobble: {
            distance: 5,
            enable: false,
            speed: {
                angle: 50,
                move: 10,
            },
        },
        orbit: {
            animation: {
                count: 0,
                enable: false,
                speed: 1,
                decay: 0,
                sync: false,
            },
            enable: false,
            opacity: 1,
            rotation: {
                random: {
                    enable: false,
                    minimumValue: 0,
                },
                value: 45,
            },
            width: 1,
        },
        links: {
            blink: false,
            color: {
                value: "#ffffff",
            },
            consent: false,
            distance: 150,
            enable: true,
            frequency: 1,
            opacity: 0.4,
            shadow: {
                blur: 5,
                color: {
                    value: "#000",
                },
                enable: false,
            },
            triangles: {
                enable: false,
                frequency: 1,
            },
            width: 1,
            warp: false,
        },
        repulse: {
            random: {
                enable: false,
                minimumValue: 0,
            },
            value: 0,
            enabled: false,
            distance: 1,
            duration: 1,
            factor: 1,
            speed: 1,
        },
    },
    pauseOnBlur: true,
    pauseOnOutsideViewport: true,
    responsive: [],
    smooth: false,
    style: {},
    themes: [],
    zLayers: 100,
};

export default particlesConfig;
