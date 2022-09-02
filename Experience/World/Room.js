import * as THREE from "three";
import { DirectionalLightHelper } from "three";
import GSAP from "gsap";
import Experience from "../Experience.js";

export default class Room {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.time = this.experience.time;
        this.room = this.resources.items.room;
        this.actualRoom = this.room.scene;
        this.roomChildren = {};

        this.lerp = {
            current: 0,
            target: 0,
            ease: 0.1,
        };

        this.setModel();
        this.onMouseMove();
        this.setRoomGroup();
    }

    setModel() {
        this.actualRoom.children.forEach((child) => {
            child.castShadow = true;
            child.receiveShadow = true;

            if (child instanceof THREE.Group) {
                child.children.forEach((groupchild) => {
                    groupchild.castShadow = true;
                    groupchild.receiveShadow = true;
                });
            }

            // console.log(child);

            if (child.name === "Aquarium") {
                // console.log(child);
                child.children[0].material = new THREE.MeshPhysicalMaterial();
                child.children[0].material.roughness = 0;
                child.children[0].material.color.set(0x549dd2);
                child.children[0].material.ior = 3;
                child.children[0].material.transmission = 1;
                child.children[0].material.opacity = 1;
            }

            if (child.name === "Computer") {
                child.children[1].material = new THREE.MeshBasicMaterial({
                    map: this.resources.items.screen,
                });
            }

            if (child.name === "Floor") {
                child.position.x = 0;
                child.position.z = 0;
            }

            child.scale.set(0, 0, 0);
            if (child.name === "Cube") {
                //child.scale.set(2.0, 2.0, 2.0);
                child.position.set(0, 1, 0);
                //child.rotation.y = Math.PI / 4;
            }

            this.roomChildren[child.name.toLowerCase()] = child;
        });

        const width = 0.5;
        const height = 0.5;
        const intensity = 1;
        const rectLight = new THREE.RectAreaLight(
            0xffffff,
            intensity,
            width,
            height
        );
        rectLight.position.set(9.5, 13, -1.7);
        rectLight.rotation.y = Math.PI / 1.35;
        rectLight.rotation.z = Math.PI / 1;
        this.actualRoom.add(rectLight);
        4;

        this.roomChildren["rectLight"] = rectLight;

        console.log(this.room);

        this.scene.add(this.actualRoom);
        this.actualRoom.scale.set(0.11, 0.11, 0.11);
    }

    switchTheme(theme) {
        if (theme === "dark") {
            this.toDarkTimeline = new GSAP.timeline();

            this.actualRoom.traverse((child) => {
                if (
                    child instanceof THREE.Mesh &&
                    child.material instanceof THREE.MeshStandardMaterial
                ) {
                    this.toDarkTimeline.to(
                        child.material,
                        {
                            envMapIntensity: 0.1,
                        },
                        "same"
                    );
                }

                if (child.name === "BoxFace1") {
                    child.material.color.set(0x111111);
                } else if (child.name === "BoxFace2") {
                    child.material.color.set(0x111111);
                } else if (child.name === "BoxFace3") {
                    child.material.color.set(0x111111);
                } else if (child.name === "BoxFace4") {
                    child.material.color.set(0x111111);
                }
            });
        } else {
            this.toLightTimeline = new GSAP.timeline();

            this.actualRoom.traverse((child) => {
                if (
                    child instanceof THREE.Mesh &&
                    child.material instanceof THREE.MeshStandardMaterial
                ) {
                    this.toLightTimeline.to(
                        child.material,
                        {
                            envMapIntensity: 1,
                        },
                        "same"
                    );
                }

                if (child.name === "BoxFace1") {
                    child.material.color.set(0xd7d8d9);
                } else if (child.name === "BoxFace2") {
                    child.material.color.set(0xd7d8d9);
                } else if (child.name === "BoxFace3") {
                    child.material.color.set(0xd7d8d9);
                } else if (child.name === "BoxFace4") {
                    child.material.color.set(0xd7d8d9);
                }
            });
        }
    }

    onMouseMove() {
        window.addEventListener("mousemove", (e) => {
            this.rotation =
                ((e.clientX - window.innerWidth / 2) * 2) / window.innerWidth; // makes the position of the cursor from -1 to 1
            this.lerp.target = this.rotation * 0.3;
        });
    }

    setRoomGroup() {
        // New group so we can rotate the bike with GSAP without intefering with our mouse rotation lerping
        // Like a spinning plateform that can spin independetly from others
        this.group = new THREE.Group();
        this.group.add(this.actualRoom);
        this.scene.add(this.group);
    }

    resize() {}

    update() {
        this.lerp.current = GSAP.utils.interpolate(
            this.lerp.current,
            this.lerp.target,
            this.lerp.ease
        );

        this.group.rotation.y = this.lerp.current;
    }
}
