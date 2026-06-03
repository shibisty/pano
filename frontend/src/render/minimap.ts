import * as THREE from "three";

export default(mapName: any, tilesData: any, container: any) => {
    if(!tilesData) {
        return;
    }
    // =====================================================
    // CONFIG
    // =====================================================

    const tiles = tilesData.tiles;

    let initialLoad = true;
    let introProgress = 0;

    const TILE_SIZE = 256;

    const MIN_ZOOM = 0;
    const MAX_ZOOM = tilesData.max_zoom - 1;

    // smooth zoom
    let zoomTarget = 0;
    let zoomCurrent = 0;

    // camera
    let camX = 0;
    let camY = 0;

    // =====================================================
    // THREE INIT
    // =====================================================

    const width = 172;
    const height = 172;

    const scene = new THREE.Scene();

    const camera = new THREE.OrthographicCamera(
        width / -2,
        width / 2,
        height / -2,
        height / 2,
        0.1,
        10000
    );

    camera.position.z = 10;
    const rendererParametres = {
        antialias: false,
        alpha: true,
        premultipliedAlpha: false,
    }
    const renderer = new THREE.WebGLRenderer(rendererParametres);
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    renderer.autoClear = true;
    const rendererElement = renderer.domElement;
    container.appendChild(rendererElement);

    // =====================================================
    // LAYERS (ZOOM BLENDING)
    // =====================================================

    const layers = {};

    function getLayer(z) {
        if (!layers[z]) {
            layers[z] = {
                group: new THREE.Group(),
                cache: {}
            };

            scene.add(layers[z].group);
        }

        return layers[z];
    }

    // =====================================================
    // UTILS
    // =====================================================

    function key(x, y) {
        return `${x}_${y}`;
    }

    function scaleForZoom(z) {
        return Math.pow(2, z);
    }

    function preloadAroundZoom(z) {
        for (let dz = -1; dz <= 1; dz++) {
            updateLayer(z + dz, dz === 0 ? 1 : 0.2);
        }
    }

    // =====================================================
    // TILE LOAD
    // =====================================================

    function loadTile(dx, dy, z) {
        if (!tiles[z] ||
            !tiles[z][dx] ||
            !tiles[z][dx][dy]) {
            return null;
        }

        const layer = getLayer(z);
        const k = key(dx, dy);

        if (layer.cache[k]) {
            return layer.cache[k];
        }

        const tex = new THREE.TextureLoader().load(
            `/assets/maps/${mapName}/${z}/${dx}/${dy}.webp`
        );

        tex.colorSpace = THREE.SRGBColorSpace;
        tex.minFilter = THREE.NearestFilter;
        tex.magFilter = THREE.NearestFilter;

        const mesh = new THREE.Mesh(
            new THREE.PlaneGeometry(TILE_SIZE, TILE_SIZE),
            new THREE.MeshBasicMaterial({
                map: tex,
                transparent: true,
                depthWrite: true,
                depthTest: true,
                opacity: 0
            })
        );

        layer.group.add(mesh);
        layer.cache[k] = mesh;

        return mesh;
    }

    // =====================================================
    // UPDATE LAYER
    // =====================================================

    function updateLayer(z, alpha) {
        const layer = getLayer(z);

        // for (const key in layer.cache) {
        //     const mesh = layer.cache[key];
        //     mesh.visible = false;
        // }

        // const scale = scaleForZoom(z);
        // const size = TILE_SIZE * scale;
        const size = TILE_SIZE;

        const hw = width / 2;
        const hh = height / 2;

        const left = camX - hw;
        const right = camX + hw;
        const top = camY + hh;
        const bottom = camY - hh;

        const startX = Math.floor(left / size) - 1;
        const endX = Math.ceil(right / size) + 1;

        const startY = Math.floor((-top) / size) - 1;
        const endY = Math.ceil((-bottom) / size) + 1;

        const currentActive = new Set<string>();

        for (let dx = startX; dx <= endX; dx++) {
            for (let dy = startY; dy <= endY; dy++) {

                const tile = loadTile(dx, dy, z);

                if (!tile) continue;

                // tile.scale.set(scale, scale, 1);

                // tile.position.x = dx * size;
                // tile.position.y = -dy * size;

                const k = key(dx, dy);
                currentActive.add(k);

                tile.scale.set(1, 1, 1);

                tile.position.x = dx * size;
                tile.position.y = -dy * size;
                tile.visible = true;
                tile.material.opacity = alpha;
                // tile.material.transparent = true;
                // tile.material.alphaTest = 0.5;
            }
        }

        for (const k in layer.cache) {
            if (!currentActive.has(k)) {
                layer.cache[k].visible = false;
            }
        }
    }

    // =====================================================
    // WHEEL ZOOM (TARGET)
    // =====================================================
    window.addEventListener("wheel", (event) => {
        if (event.deltaY < 0) {
            zoomTarget = Math.min(MAX_ZOOM, zoomTarget + 1);
        } else {
            zoomTarget = Math.max(MIN_ZOOM, zoomTarget - 1);
        }
    });

    // =====================================================
    // PAN
    // =====================================================

    let dragging = false;
    let rotating = false;
    let lastX = 0;
    let lastY = 0;
    let rotX = 0;
    let rotY = 0;

    // window.addEventListener("mousedown", (event) => {
    //     lastX = event.clientX;
    //     lastY = event.clientY;
        
    //     if (event.shiftKey) {
    //         rotating = true;
    //     } else {
    //         dragging = true;
    //     }
    // });

    // window.addEventListener("mouseup", (event) => {
    //     dragging = false;
    //     rotating = false;
    // });

    // window.addEventListener("mousemove", (event) => {

    //     if (!dragging && !rotating) {
    //         return;
    //     }

    //     // camX -= (e.clientX - lastX);
    //     // camY += (e.clientY - lastY);

    //     // lastX = e.clientX;
    //     // lastY = e.clientY;
    //     const dx = event.clientX - lastX;
    //     const dy = event.clientY - lastY;

    //     if (dragging) {
    //         camX -= dx;
    //         camY += dy;
    //     }

    //     if (rotating) {
    //         rotY += dx * 0.005;
    //         rotX += dy * 0.005;

    //         // ограничим наклон
    //         rotX = Math.max(-1.2, Math.min(1.2, rotX));
    //     }

    //     lastX = event.clientX;
    //     lastY = event.clientY;
    // });

    // window.addEventListener("resize", (event) => {
    //     const width = width;
    //     const height = height;

    //     camera.aspect = width / height;
    //     camera.updateProjectionMatrix();

    //     renderer.setSize(width, height);
    // });

    // =====================================================
    // RENDER LOOP (ANIMATION MAGIC)
    // =====================================================

    function animate() {
        requestAnimationFrame(animate);

        // smooth zoom interpolation
        zoomCurrent += (zoomTarget - zoomCurrent) * 0.1;

        const zLow = Math.floor(zoomCurrent);
        const zHigh = Math.min(MAX_ZOOM, zLow + 1);
        const t = zoomCurrent - zLow;

        if (initialLoad) {
            introProgress += 0.02;
            if (introProgress > 1) {
                introProgress = 1;
            }
        }

        let lowAlpha = 1 - t;
        let highAlpha = t;

        // intro fade override
        if (initialLoad) {
            lowAlpha *= introProgress;
            highAlpha *= introProgress;
        }

        if (zLow === zHigh) {
            updateLayer(zLow, lowAlpha);
        } else {
            updateLayer(zLow, lowAlpha);
            updateLayer(zHigh, highAlpha);
        }

        camera.left = -width / 2 + camX;
        camera.right = width / 2 + camX;
        camera.top = height / 2 + camY;
        camera.bottom = -height / 2 + camY;
        container.style.transform = `
            rotateX(${rotX}rad)
            rotateY(${rotY}rad)
        `
        // camera.rotation.x = rotX;
        // camera.rotation.y = rotY;

        camera.zoom = Math.pow(2, zoomCurrent);

        // const zSnap = Math.round(zoomCurrent);
        // if (zSnap !== lastPreloadZoom) {
        //     preloadAroundZoom(zSnap);
        //     lastPreloadZoom = zSnap;
        // }

        camera.updateProjectionMatrix();
        
        // renderer.clear();
        renderer.render(scene, camera);
        // initialLoad = false;
    }

    // =====================================================
    // START
    // =====================================================

    animate();
}
