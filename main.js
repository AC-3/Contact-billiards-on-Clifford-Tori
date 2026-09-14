// ==========================================
// COLORS
// ==========================================

const colorQ = "#ff9933";
const colorQstar = "#b35900";
const colorZ = "#5909aa";
const colorChar = "#008080";
const colorTable = "#9E9CA1";


// ==========================================
// PARAMETERS
// ==========================================

let chi = Math.PI / 4;
let phi = 0;
let theta = 0;
let t = 0;


// ==========================================
// CLIFFORD TORUS
// ==========================================

// Point q on the Clifford torus
function cliffordPoint(chi, phi, theta) {

    const c1 = Math.cos(chi);
    const c2 = Math.sin(chi);

    return {
        x: c1 * Math.cos(phi),
        y: c1 * Math.sin(phi),
        u: c2 * Math.cos(theta),
        v: c2 * Math.sin(theta)
    };
}


// ==========================================
// CONTACT POINT q*
// ==========================================

function contactPoint(chi, phi, theta) {

    const c1 = Math.cos(chi);
    const c2 = Math.sin(chi);

    return {
        x: -c2 * Math.sin(phi),
        y:  c2 * Math.cos(phi),
        u:  c1 * Math.sin(theta),
        v: -c1 * Math.cos(theta)
    };
}


// ==========================================
// BILLARD POINT Z
// ==========================================

function billiardPoint(q, qStar, t) {

    return {
        x: Math.cos(t) * q.x + Math.sin(t) * qStar.x,
        y: Math.cos(t) * q.y + Math.sin(t) * qStar.y,
        u: Math.cos(t) * q.u + Math.sin(t) * qStar.u,
        v: Math.cos(t) * q.v + Math.sin(t) * qStar.v
    };
}


// ==========================================
// BILLARD POINT Z'
// ==========================================

function billiardPointPrime(q, qStar, t) {

    return {
        x: Math.cos(t) * q.x - Math.sin(t) * qStar.x,
        y: Math.cos(t) * q.y - Math.sin(t) * qStar.y,
        u: Math.cos(t) * q.u - Math.sin(t) * qStar.u,
        v: Math.cos(t) * q.v - Math.sin(t) * qStar.v
    };
}

// ==========================================
// DRAWING
// ==========================================

const canvasXY = document.getElementById("canvasXY");
const ctxXY = canvasXY.getContext("2d");

const canvasUV = document.getElementById("canvasUV");
const ctxUV = canvasUV.getContext("2d");


function draw() {

    // Calculate the point on the Clifford torus
    const q = cliffordPoint(chi, phi, theta);

    // Calculate q*
    const qStar = contactPoint(chi, phi, theta);
    
    // Calculate Z
    const z = billiardPoint(q, qStar, t);
    
    // Calculate Z'
    const zStar = billiardPointPrime(q, qStar, t)

    // Clear canvas
    ctxXY.clearRect(0, 0, canvasXY.width, canvasXY.height);
    ctxUV.clearRect(0, 0, canvasUV.width, canvasUV.height);


    // ======================================
    // CHARACTERISTIC LINE
    // ======================================


    // --------------------------------------
    // LEFT: xy projection
    // --------------------------------------

    drawCharacteristic(ctxXY, q, qStar, 200, 200, 150, "xy");


    // --------------------------------------
    // RIGHT: uv projection
    // --------------------------------------

    drawCharacteristic(ctxUV, q, qStar, 200, 200, 150, "uv");
    
    // ======================================
    // POINTS IN CORRESPONDENCE
    // ======================================

    // --------------------------------------
    // LEFT: xy projection
    // --------------------------------------
    
     drawPoint(
     	ctxXY,
        200 + 150 * z.x,
        200 - 150 * z.y,
        colorZ
    );
    
    drawPoint(
    	ctxXY,
    	200 + 150*zStar.x,
    	200 - 150*zStar.y,
    	colorZ
    );
    
    // --------------------------------------
    // RIGHT: uv projection
    // --------------------------------------
    
     drawPoint(
     	ctxUV,
        200 + 150 * z.u,
        200 - 150 * z.v,
        colorZ
    );
    
    drawPoint(
    	ctxUV,
    	200 + 150*zStar.u,
    	200 - 150*zStar.v,
    	colorZ
    );
    

    // ======================================
    // ORIGINAL CLIFFORD TORUS
    // ======================================


    // --------------------------------------
    // LEFT: xy projection
    // --------------------------------------

    drawCircle(ctxXY, 200, 200, 150*Math.cos(chi));
    
    drawPoint(
    	ctxXY,
        200 + 150 * q.x,
        200 - 150 * q.y,
        colorQ
    );


    // --------------------------------------
    // RIGHT: uv projection
    // --------------------------------------

    drawCircle(ctxUV, 200, 200, 150*Math.sin(chi));

    drawPoint(
    	ctxUV,
        200 + 150 * q.u,
        200 - 150 * q.v,
        colorQ
    );

    // ======================================
    // POLAR CLIFFORD TORUS
    // ======================================


    // --------------------------------------
    // LEFT: xy projection
    // --------------------------------------

    drawCircle(ctxXY, 200, 200, 150*Math.sin(chi), true);

    drawPoint(
	ctxXY,    	
        200 + 150 * qStar.x,
        200 - 150 * qStar.y,
        colorQstar
    );


    // --------------------------------------
    // RIGHT: uv projection
    // --------------------------------------

    drawCircle(ctxUV, 200, 200, 150*Math.cos(chi), true);

    drawPoint(
    	ctxUV,
        200 + 150 * qStar.u,
        200 - 150 * qStar.v,
        colorQstar
    );

    

}


// ==========================================
// DRAW A CIRCLE
// ==========================================

function drawCircle(ctx, cx, cy, radius, dashed=false) {

    ctx.beginPath();
    
    if(dashed){
    	ctx.setLineDash([3,5]);
    } else{
    	ctx.setLineDash([]);
    }
    
    ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = "black";
    ctx.stroke();
    
    // Return to solid lines
    ctx.setLineDash([]);
}


// ==========================================
// DRAW A POINT
// ==========================================

function drawPoint(ctx, x, y, color) {

    ctx.beginPath();
    ctx.arc(x, y, 5, 0, 2 * Math.PI);

    ctx.fillStyle = color;
    ctx.fill();
    
    ctx.strokeStyle="black";
    ctx.lineWidth=1;
    ctx.stroke();
}

// ==========================================
// DRAW A CHARACTERISTIC
// ==========================================

function drawCharacteristic(ctx, q, qStar, cx, cy, scale, plane) {

    ctx.beginPath();

    for (let s = 0; s <= 2 * Math.PI; s += 0.02) {

        let a, b;

        if (plane === "xy") {

            a = Math.cos(s) * q.x +
                Math.sin(s) * qStar.x;

            b = Math.cos(s) * q.y +
                Math.sin(s) * qStar.y;

        } else if (plane === "uv") {

            a = Math.cos(s) * q.u +
                Math.sin(s) * qStar.u;

            b = Math.cos(s) * q.v +
                Math.sin(s) * qStar.v;
        }

        const X = cx + scale * a;
        const Y = cy - scale * b;

        if (s === 0) {
            ctx.moveTo(X, Y);
        } else {
            ctx.lineTo(X, Y);
        }
    }

    ctx.strokeStyle = colorChar;
    ctx.lineWidth = 2;
    ctx.stroke();
}

// ==========================================
// 3D TORUS (stereographic projection to R3)
// ==========================================

let scene, camera, renderer, controls, torusMesh, pointMesh, curveMesh, zMesh, zPrimeMesh;

function updatePointMesh() {

    const p = torusPoint3D(chi, phi, theta);

    if (!pointMesh) {
        const geometry = new THREE.SphereGeometry(0.065, 16, 16);
        const material = new THREE.MeshStandardMaterial({ color: colorQ });
        pointMesh = new THREE.Mesh(geometry, material);
        scene.add(pointMesh);
    }

    pointMesh.position.set(p.x, p.y, p.z);
}

function curvePoint3D(chi, phi, theta, T) {
    const denom = 1 - Math.sin(chi) * Math.cos(T) * Math.sin(theta) + Math.cos(chi) * Math.sin(T) * Math.cos(theta) ;
    return {
        x: (Math.cos(chi) * Math.cos(phi) * Math.cos(T) - Math.sin(chi) * Math.sin(phi) * Math.sin(T) ) / denom,
        y: (Math.cos(chi) * Math.sin(phi) * Math.cos(T) + Math.sin(chi) * Math.cos(phi) * Math.sin(T) ) / denom,
        z: (Math.cos(chi) * Math.sin(theta) * Math.sin(T) + Math.sin(chi) * Math.cos(theta) * Math.cos(T) )/ denom
    };
}

function updateBilliardPoints3D() {
    
    const pZ = curvePoint3D(chi, phi, theta, t);
    const pZPrime = curvePoint3D(chi, phi, theta, -t);
    
    if (!zMesh) {
    	const geometry = new THREE.SphereGeometry(0.05, 16, 16);
    	const material = new THREE.MeshStandardMaterial({ color : colorZ });
    	zMesh = new THREE.Mesh(geometry, material);
    	scene.add(zMesh);
    }
    zMesh.position.set(pZ.x, pZ.y, pZ.z);
    
    if (!zPrimeMesh) {
    	const geometry = new THREE.SphereGeometry(0.05, 16, 16);
    	const material = new THREE.MeshStandardMaterial({ color : colorZ });
    	zPrimeMesh = new THREE.Mesh(geometry, material);
    	scene.add(zPrimeMesh);
    }
    zPrimeMesh.position.set(pZPrime.x, pZPrime.y, pZPrime.z);
}

function updateCurveMesh() {

    if (curveMesh) {
        scene.remove(curveMesh);
        curveMesh.geometry.dispose();
        curveMesh.material.dispose();
    }

    const points = [];
    const steps = 200;

    for (let i = 0; i <= steps; i++) {
        const T = (i / steps) * 2 * Math.PI;
        const p = curvePoint3D(chi, phi, theta, T);
        points.push(new THREE.Vector3(p.x, p.y, p.z));
    }

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color: colorChar, linewidth: 2 });

    curveMesh = new THREE.Line(geometry, material);
    scene.add(curveMesh);
}

function torusPoint3D(chi, s, t) {
    const denom = 1 - Math.sin(chi) * Math.sin(t);
    return {
        x: (Math.cos(chi) * Math.cos(s)) / denom,
        y: (Math.cos(chi) * Math.sin(s)) / denom,
        z: (Math.sin(chi) * Math.cos(t)) / denom
    };
}

function buildTorusGeometry(chi, sSegs = 80, tSegs = 80) {

    const positions = [];
    const indices = [];

    for (let i = 0; i <= sSegs; i++) {
        const s = (i / sSegs) * 2 * Math.PI;
        for (let j = 0; j <= tSegs; j++) {
            const t = (j / tSegs) * 2 * Math.PI;
            const p = torusPoint3D(chi, s, t);
            positions.push(p.x, p.y, p.z);
        }
    }

    const stride = tSegs + 1;
    for (let i = 0; i < sSegs; i++) {
        for (let j = 0; j < tSegs; j++) {
            const a = i * stride + j;
            const b = (i + 1) * stride + j;
            const c = (i + 1) * stride + (j + 1);
            const d = i * stride + (j + 1);
            indices.push(a, b, d);
            indices.push(b, c, d);
        }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setIndex(indices);
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geometry.computeVertexNormals();
    return geometry;
}

function initThreeScene() {

    const container = document.getElementById("torusContainer");

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xfaf8f3);

    camera = new THREE.PerspectiveCamera(
        45, container.clientWidth / container.clientHeight, 0.1, 100
    );
    camera.position.set(0, -7, 7);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    scene.add(new THREE.DirectionalLight(0xffffff, 1).translateX(5).translateY(5).translateZ(5));
    scene.add(new THREE.AmbientLight(0x888888));
    scene.add(new THREE.AxesHelper(2));

    updateTorusMesh();
    updatePointMesh();
    updateCurveMesh();
    updateBilliardPoints3D();
    animate();
}

function updateTorusMesh() {

    if (torusMesh) {
        scene.remove(torusMesh);
        torusMesh.geometry.dispose();
        torusMesh.material.dispose();
    }

    const geometry = buildTorusGeometry(chi);
    const material = new THREE.MeshStandardMaterial({
        color: colorTable,
        side: THREE.DoubleSide,
        roughness: 0.7,
        metalness: 0.1,
        transparent: true,
        opacity: 0.9
    });

    torusMesh = new THREE.Mesh(geometry, material);
    scene.add(torusMesh);
}

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

// ==========================================
// SLIDERS
// ==========================================

const chiSlider = document.getElementById("chiSlider");
const phiSlider = document.getElementById("phiSlider");
const thetaSlider = document.getElementById("thetaSlider");
const tSlider = document.getElementById("tSlider");

const chiValue = document.getElementById("chiValue");
const phiValue = document.getElementById("phiValue");
const thetaValue = document.getElementById("thetaValue");
const tValue = document.getElementById("tValue");


chiSlider.addEventListener("input", function() {
    chi = Number(chiSlider.value);
    chiValue.textContent = chi.toFixed(2);
    draw();
    updateTorusMesh();
    updatePointMesh();
    updateCurveMesh();
    updateBilliardPoints3D();
});


phiSlider.addEventListener("input", function() {
    phi = Number(phiSlider.value);
    phiValue.textContent = phi.toFixed(2);
    draw();
    updatePointMesh();
    updateCurveMesh();
    updateBilliardPoints3D();
});


thetaSlider.addEventListener("input", function() {
    theta = Number(thetaSlider.value);
    thetaValue.textContent = theta.toFixed(2);
    draw();
    updatePointMesh();
    updateCurveMesh();
    updateBilliardPoints3D();
});

tSlider.addEventListener("input", function() {
    t = Number(tSlider.value);
    tValue.textContent = t.toFixed(2);
    draw();
    updateBilliardPoints3D();
});


// ==========================================
// INITIAL DRAW
// ==========================================

chiValue.textContent = chi.toFixed(2);
phiValue.textContent = phi.toFixed(2);
thetaValue.textContent = theta.toFixed(2);
tValue.textContent = t.toFixed(2);

draw();
initThreeScene();
