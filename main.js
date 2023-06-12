import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

var scene, camera, cube, renderer;
var moveForward = false;
var moveBackward = false;
var moveUp = false;
var moveDown = false;
var moveLeft = false;
var moveRight = false;
var mouseDown = false;
var camForward = false;
var camBackward = false;
var camLeft = false;
var camRight = false;
var rotateLeft = false;
var rotateRight = false;
var previousMouseX = 0;
var previousMouseY = 0;
var rotationSpeed = 0.01;
var moveSpeed = 0.1;
var intensitas = 1;
var camClicked = false;
var cam, greenscreen, softbox, umbrella, sofa, flatlighting, desk, room;
var spotLight1, spotLight2, lightHelperPoint1, lightHelperPoint2, light;

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
        75,
        innerWidth / innerHeight,
        0.1,
        1000
    );

    renderer = new THREE.WebGLRenderer({
        canvas: document.querySelector("canvas"),
    });
    renderer.setSize(innerWidth, innerHeight);
    renderer.setClearColor(0xffffff); // Mengatur warna latar belakang menjadi putih
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap; // default THREE.PCFShadowMap
    document.body.appendChild(renderer.domElement);

    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(
        "https://raw.githubusercontent.com/RadinX/tekstur/main/wood.jpg"
    );

    // Membuat pencahayaan (lighting)
    light = new THREE.PointLight(0xffffff, 0.4, 300);
    light.position.set(0, 5, 0);
    scene.add(light);

    // Membuat directional light helper
    var lightHelper = new THREE.PointLightHelper(light, 0.2, 0x00ff00);
    scene.add(lightHelper);

    // Lighting 1
    spotLight1 = new THREE.SpotLight(0xffffff, 0, 10, Math.PI / 4);
    spotLight1.position.set(-3, 1.8, -0.2);
    spotLight1.target.position.set(-1.2, 2, -5);
    spotLight1.castShadow = true;
    spotLight1.shadow.mapSize.width = 1024;
    spotLight1.shadow.mapSize.height = 1024;
    spotLight1.shadow.camera.near = 2; // default
    spotLight1.shadow.camera.far = 500; // default
    spotLight1.shadow.focus = 1; // default

    scene.add(spotLight1);

    lightHelperPoint1 = new THREE.SpotLightHelper(spotLight1);
    scene.add(lightHelperPoint1);

    // Lighting 2
    spotLight2 = new THREE.SpotLight(0xffffff, 1, 10, Math.PI / 6);
    spotLight2.position.set(2.907, 5.05, -0.5);
    spotLight2.target.position.set(2.2, 4, -2.5);
    spotLight2.castShadow = true;

    scene.add(spotLight2);

    lightHelperPoint2 = new THREE.SpotLightHelper(spotLight2);
    scene.add(lightHelperPoint2);

    // Grid
    // let grid = new THREE.GridHelper(1000, 2000, 0x0a0a0a, 0x0a0a0a);
    // grid.position.y = 0;
    // scene.add(grid);

    // // Membuat pencahayaan ambient
    // var ambientLight = new THREE.AmbientLight(0xffffff, 1);
    // scene.add(ambientLight);

    // Load file glTF
    var loader = new GLTFLoader();
    loader.load("./src/backdrop_green.glb", function (gltf) {
        greenscreen = gltf.scene;
        greenscreen.scale.set(1.2, 1.2, 1.2);
        greenscreen.position.z = -8; // Menyesuaikan posisi mobil ke depan kamera
        greenscreen.position.y = -0.1; // Menyesuaikan posisi mobil ke depan kamera
        scene.add(greenscreen);

        greenscreen.traverse(function (child) {
            if (child.isMesh) {
                child.castShadow = true; // Mengaktifkan bayangan dari mesh pada objek sofa
                child.receiveShadow = true; // Menerima bayangan pada mesh objek sofa
            }
        });
    });

    loader.load(
        "./src/red_8k_dsmc2_weapon_with_heavy_duty_tripod.glb",
        function (gltf) {
            cam = gltf.scene;
            cam.position.y = 1.5;
            cam.rotation.y = 1.5;
            scene.add(cam);

            cam.traverse(function (child) {
                if (child.isMesh) {
                    child.castShadow = true; // Mengaktifkan bayangan dari mesh pada objek sofa
                    child.receiveShadow = true; // Menerima bayangan pada mesh objek sofa
                }
            });
        }
    );

    loader.load("./src/simple_studio_light.glb", function (gltf) {
        softbox = gltf.scene;
        softbox.position.x = -3; // Menyesuaikan posisi kamera ke belakang mobil
        softbox.rotation.y = -3.5; // Menyesuaikan posisi kamera ke belakang mobil
        scene.add(softbox);

        softbox.traverse(function (child) {
            if (child.isMesh) {
                child.castShadow = true; // Mengaktifkan bayangan dari mesh pada objek sofa
                child.receiveShadow = true; // Menerima bayangan pada mesh objek sofa
            }
        });
    });

    loader.load("./src/outdoor_couch.glb", function (gltf) {
        sofa = gltf.scene;
        sofa.position.x = 0; // Menyesuaikan posisi kamera ke belakang mobil
        sofa.position.z = -3; // Menyesuaikan posisi kamera ke belakang mobil
        sofa.castShadow = true;
        scene.add(sofa);

        // Mengatur properti bayangan pada objek sofa
        sofa.traverse(function (child) {
            if (child.isMesh) {
                child.castShadow = true; // Mengaktifkan bayangan dari mesh pada objek sofa
                child.receiveShadow = true; // Menerima bayangan pada mesh objek sofa
            }
        });
    });

    loader.load("./src/computer_desk.glb", function (gltf) {
        desk = gltf.scene;
        desk.position.y = 0;
        desk.position.x = 4.1;
        desk.scale.set(0.2, 0.2, 0.2);
        scene.add(desk);
    });

    loader.load("./src/flat_panel_spot_light.glb", function (gltf) {
        flatlighting = gltf.scene;
        flatlighting.position.y = 4.5;
        flatlighting.position.x = 3;
        flatlighting.rotation.y = 3.5;
        flatlighting.rotation.x = -0.4;
        scene.add(flatlighting);

        flatlighting.traverse(function (child) {
            if (child.isMesh) {
                child.castShadow = true; // Mengaktifkan bayangan dari mesh pada objek sofa
                child.receiveShadow = true; // Menerima bayangan pada mesh objek sofa
            }
        });
    });

    loader.load("./src/room_shell.glb", function (gltf) {
        room = gltf.scene;
        room.position.y = -0.59;
        room.scale.set(0.08, 0.08, 0.08);
        scene.add(room);
    });

    // Mengatur posisi kamera
    camera.position.z = 5;
    camera.position.y = 2;

    // Menambahkan event listener untuk keydown
    document.addEventListener("keydown", onKeyDown, false);
    // Menambahkan event listener untuk keyup
    document.addEventListener("keyup", onKeyUp, false);
    // Menambahkan event listener untuk mousedown
    document.addEventListener("mousedown", onMouseDown, false);
    // Menambahkan event listener untuk mouseup
    document.addEventListener("mouseup", onMouseUp, false);
    // Menambahkan event listener untuk mousemove
    document.addEventListener("mousemove", onMouseMove, false);

    document.addEventListener("wheel", onWheel, false);
}

// Fungsi yang akan dipanggil saat tombol keyboard ditekan
function onKeyDown(event) {
    switch (event.key) {
        case "w":
            moveForward = true;
            break;
        case "s":
            moveBackward = true;
            break;
        case "a":
            moveLeft = true;
            break;
        case "d":
            moveRight = true;
            break;
        case "+":
            moveUp = true;
            break;
        case "-":
            moveDown = true;
            break;
        case "ArrowUp":
            camForward = true;
            break;
        case "ArrowDown":
            camBackward = true;
            break;
        case "ArrowLeft":
            camLeft = true;
            break;
        case "ArrowRight":
            camRight = true;
            break;
        case "7":
            rotateLeft = true;
            break;
        case "9":
            rotateRight = true;
            break;
        case "p":
            blitz();
            break;
    }
}

// Fungsi untuk melakukan efek blitz berulang kali
function blitzBlink(count) {
    if (count <= 0) return;

    setTimeout(function () {
        spotLight1.intensity = 5; // Set intensity menjadi 5 untuk efek blitz yang kuat

        setTimeout(function () {
            spotLight1.intensity = 0; // Kembalikan intensity spot light ke nilai semula setelah beberapa waktu (misalnya 200ms)

            blitzBlink(count - 1); // Panggil kembali fungsi blitzBlink dengan count yang dikurangi 1
        }, 500);
    }, 200);
}

// Fungsi untuk melakukan efek blitz
function blitz() {
    blitzBlink(2); // Panggil fungsi blitzBlink dengan jumlah blink sebanyak 5 kali
}

function onWheel(event) {
    if (event.deltaY > 0) {
        // Mouse wheel down
        spotLight2.intensity = intensitas -= 0.5;
        if (intensitas < 0) {
            intensitas = 0;
        }
    } else {
        // Mouse wheel up
        spotLight2.intensity = intensitas += 0.5;
    }
}

// Fungsi yang akan dipanggil saat tombol keyboard dilepas
function onKeyUp(event) {
    switch (event.key) {
        case "w":
            moveForward = false;
            break;
        case "s":
            moveBackward = false;
            break;
        case "a":
            moveLeft = false;
            break;
        case "d":
            moveRight = false;
            break;
        case "+":
            moveUp = false;
            break;
        case "-":
            moveDown = false;
            break;
        case "ArrowUp":
            camForward = false;
            break;
        case "ArrowDown":
            camBackward = false;
            break;
        case "ArrowLeft":
            camLeft = false;
            break;
        case "ArrowRight":
            camRight = false;
            break;
        case "7":
            rotateLeft = false;
            break;
        case "9":
            rotateRight = false;
            break;
    }
}

// Fungsi yang akan dipanggil saat tombol mouse ditekan
function onMouseDown(event) {
    if (event.target === renderer.domElement) {
        mouseDown = true;
        previousMouseX = event.clientX;
        previousMouseY = event.clientY;

        // Periksa apakah objek cam diklik
        var raycaster = new THREE.Raycaster();
        var mouse = new THREE.Vector2();
        mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
        mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);

        var intersects = raycaster.intersectObject(cam, true);
        if (intersects.length > 0) {
            camClicked = true;
            // Tambahkan logika untuk mengatur efek flash pada DirectionalLight
            blitz(); // Misalnya, set intensity menjadi 2 untuk efek flash yang kuat
        }

        // Periksa apakah objek flatlighting diklik
        intersects = raycaster.intersectObject(flatlighting, true);
        if (intersects.length > 0) {
            // Toggle nyala/mati spotLight2
            spotLight2.intensity = spotLight2.intensity === 0 ? intensitas : 0;
        }
    }
}

// Fungsi yang akan dipanggil saat tombol mouse dilepas
function onMouseUp(event) {
    mouseDown = false;
    camClicked = false;
    // Kembalikan intensity DirectionalLight ke nilai semula
    spotLight1.intensity = 0; // Nilai default intensitas DirectionalLight
}

// Fungsi yang akan dipanggil saat mouse bergerak
function onMouseMove(event) {
    if (!mouseDown) return;

    var deltaX = event.clientX - previousMouseX;
    var deltaY = event.clientY - previousMouseY;

    camera.rotation.y -= deltaX * rotationSpeed; // Mengubah rotasi kamera sejalan dengan pergerakan mouse horizontal (dibalik)
    camera.rotation.x -= deltaY * rotationSpeed; // Mengubah rotasi kamera sejalan dengan pergerakan mouse vertikal (dibalik)

    previousMouseX = event.clientX;
    previousMouseY = event.clientY;
}

function animate() {
    requestAnimationFrame(animate);
    // Pergerakan kamera
    if (moveForward) camera.translateZ(-moveSpeed);
    if (moveBackward) camera.translateZ(moveSpeed);
    if (moveLeft) camera.translateX(-moveSpeed);
    if (moveRight) camera.translateX(moveSpeed);
    if (moveUp) camera.translateY(moveSpeed);
    if (moveDown) camera.translateY(-moveSpeed);
    if (camForward) cam.translateX(moveSpeed);
    if (camBackward) cam.translateX(-moveSpeed);
    if (camLeft) cam.translateZ(-moveSpeed);
    if (camRight) cam.translateZ(moveSpeed);
    if (rotateLeft) cam.rotation.y += rotationSpeed;
    if (rotateRight) cam.rotation.y -= rotationSpeed;

    renderer.render(scene, camera);
}

window.onload = function () {
    init();
    animate();
    // update();
};
