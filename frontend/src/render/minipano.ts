import * as THREE from "three";

export default (panoName: any, tilesData: any, container: any) => {
    const PATH = `/assets/pano/${panoName}/0/0`;

    // =========================================
    // CONFIG
    // =========================================
    const TILE_PATH = `${PATH}/360/tiles`;

    const TILE_SIZE = 20;

    const COLS = 18;   // 9216 / 512
    const ROWS = 9;    // 4608 / 512

    // =========================================
    // SCENE
    // =========================================

    const width = 172;
    const height = 172;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
        75,
        width / height,
        0.1,
        2000
    );

    camera.position.set(0, 0, 0.1);

    const renderer = new THREE.WebGLRenderer({
        antialias: true
    });

    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);


    // =========================================
    // SPHERE (IMPORTANT FIX)
    // =========================================

    const geometry = new THREE.SphereGeometry(500, 64, 64);
    geometry.scale(-1, 1, 1);

    const material = new THREE.MeshBasicMaterial({
        color: 0xffffff
    });

    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);


    // =========================================
    // TILE CANVAS (STITCHING FIX)
    // =========================================

    const canvas = document.createElement("canvas");
    canvas.width = COLS * TILE_SIZE;
    canvas.height = ROWS * TILE_SIZE;

    const ctx = canvas.getContext("2d");

    const finalTexture = new THREE.CanvasTexture(canvas);
    finalTexture.colorSpace = THREE.SRGBColorSpace;

    sphere.material.map = finalTexture;


    // =========================================
    // LOAD TILES
    // =========================================

    const loader = new Image();

    function loadTile(x, y) {

        return new Promise((resolve) => {

            const img = new Image();

            img.src = `${TILE_PATH}/${x}_${y}.webp`;

            img.onload = () => {

                ctx.drawImage(
                    img,
                    x * TILE_SIZE,
                    y * TILE_SIZE
                );

                finalTexture.needsUpdate = true;

                resolve();
            };

        });
    }


    // =========================================
    // LOAD ALL TILES
    // =========================================

    async function loadAll() {

        for (let y = 0; y < ROWS; y++) {
            for (let x = 0; x < COLS; x++) {

                await loadTile(x, y);

                console.log(`Loaded ${x}_${y}`);
            }
        }

        console.log("All tiles loaded");
    }

    loadAll();


    // =========================================
    // CONTROLS
    // =========================================

    let lon = 180;
    const lat = 0;

    const dragging = false;
    const rotating = true;

    const lastX = 0;
    const lastY = 0;

    const minFov = 40;
    const maxFov = 100;

    // window.addEventListener("mousedown", e => {
    //     dragging = true;
    //     rotating = false;
    //     lastX = e.clientX;
    //     lastY = e.clientY;
    // });

    // window.addEventListener("mouseup", () => {
    //     dragging = false;
    // });

    // window.addEventListener("mousemove", e => {

    //     if (!dragging) return;

    //     lon -= (e.clientX - lastX) * 0.1;
    //     lat += (e.clientY - lastY) * 0.1;

    //     lat = Math.max(-85, Math.min(85, lat));

    //     lastX = e.clientX;
    //     lastY = e.clientY;
    // });

    // window.addEventListener("wheel", (e) => {

    //     camera.fov += e.deltaY * 0.05;

    //     camera.fov = THREE.MathUtils.clamp(
    //         camera.fov,
    //         minFov,
    //         maxFov
    //     );

    //     camera.updateProjectionMatrix();
    // });


    // =========================================
    // RENDER LOOP
    // =========================================

    function animate() {

        requestAnimationFrame(animate);

        // if (rotating) {
            lon += 0.05;
        // }

        const phi =
            THREE.MathUtils.degToRad(90 - lat);

        const theta =
            THREE.MathUtils.degToRad(lon);

        camera.lookAt(
            500 * Math.sin(phi) * Math.cos(theta),
            500 * Math.cos(phi),
            500 * Math.sin(phi) * Math.sin(theta)
        );

        renderer.render(scene, camera);
    }

    animate();


    // =========================================
    // RESIZE
    // =========================================

    window.addEventListener("resize", () => {

        camera.aspect =
            width /
            height;

        camera.updateProjectionMatrix();

        renderer.setSize(
            width,
            height
        );
    });
}