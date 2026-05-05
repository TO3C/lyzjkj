// ====== 流云智炬 · Hero 3D 场景 V6.1 ======
// Three.js 低多边形几何体浮动，陶土色系暖光
// 全端适配：桌面端5个几何体+60粒子，手机端3个+20粒子

(function() {
  var container = document.querySelector('.hero-visual');
  if (!container) return;

  function init() {
    if (typeof THREE === 'undefined') return;
    if (container.querySelector('canvas')) return;

    var w = container.clientWidth;
    var h = container.clientHeight;
    if (w === 0 || h === 0) return;

    var isMobile = window.innerWidth < 768;

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(35, w / h, 0.5, 50);
    camera.position.set(0, 0.3, isMobile ? 7 : 9);
    camera.lookAt(0, 0, 0);

    var renderer = new THREE.WebGLRenderer({ antialias: !isMobile, alpha: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    // Lights
    scene.add(new THREE.AmbientLight(0xFDF6EC, 2.2));
    var key = new THREE.PointLight(0xD4A853, isMobile ? 14 : 18, 20);
    key.position.set(4, 3, 6);
    scene.add(key);
    var fill = new THREE.PointLight(0xC67A4B, isMobile ? 6 : 8, 15);
    fill.position.set(-3, -1, 3);
    scene.add(fill);

    // Shapes — fewer on mobile
    var palette = [0xC67A4B, 0xD4845A, 0xD4A853, 0xE8D5C4, 0xF2E6D8, 0xB8956A];
    var shapes = [];
    var allDefs = [
      { geo: new THREE.IcosahedronGeometry(isMobile ? 0.9 : 1.1, 0), pos: [-1.6, 0.2, 0] },
      { geo: new THREE.TorusKnotGeometry(isMobile ? 0.5 : 0.6, 0.18, isMobile ? 40 : 80, isMobile ? 8 : 12), pos: [1.4, -0.1, -0.5] },
      { geo: new THREE.OctahedronGeometry(isMobile ? 0.7 : 0.85, 0), pos: [0.2, -0.9, -1] },
      { geo: new THREE.TorusGeometry(isMobile ? 0.5 : 0.65, 0.16, isMobile ? 12 : 16, isMobile ? 20 : 32), pos: [-0.5, 0.9, 0.3] },
      { geo: new THREE.IcosahedronGeometry(isMobile ? 0.45 : 0.55, 0), pos: [1.8, 0.6, -1.2] }
    ];
    var defs = isMobile ? allDefs.slice(0, 3) : allDefs;

    defs.forEach(function(d) {
      var mat = new THREE.MeshStandardMaterial({
        color: palette[Math.floor(Math.random() * palette.length)],
        roughness: 0.55, metalness: 0.05, flatShading: true
      });
      var mesh = new THREE.Mesh(d.geo, mat);
      mesh.position.set(d.pos[0], d.pos[1], d.pos[2]);
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      mesh.userData = {
        baseY: d.pos[1],
        rs: [0.001 + Math.random() * 0.004, 0.001 + Math.random() * 0.004, 0.0005 + Math.random() * 0.002],
        fa: 0.1 + Math.random() * 0.3,
        ff: 0.5 + Math.random() * 0.8
      };
      shapes.push(mesh);
      scene.add(mesh);
    });

    // Particles — fewer on mobile
    var pCount = isMobile ? 20 : 60;
    var pGeo = new THREE.BufferGeometry();
    var positions = new Float32Array(pCount * 3);
    for (var i = 0; i < pCount; i++) {
      positions[i*3] = (Math.random()-0.5)*7;
      positions[i*3+1] = (Math.random()-0.5)*5;
      positions[i*3+2] = (Math.random()-0.5)*4;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    var pts = new THREE.Points(pGeo, new THREE.PointsMaterial({
      color: 0xD4A853, size: isMobile ? 0.04 : 0.03, transparent: true, opacity: 0.5,
      blending: THREE.AdditiveBlending, depthWrite: false
    }));
    scene.add(pts);

    function animate() {
      requestAnimationFrame(animate);
      var t = performance.now() * 0.001;
      shapes.forEach(function(m) {
        m.rotation.x += m.userData.rs[0];
        m.rotation.y += m.userData.rs[1];
        m.rotation.z += m.userData.rs[2];
        m.position.y = m.userData.baseY + Math.sin(t * m.userData.ff) * m.userData.fa;
      });
      camera.position.x = Math.sin(t * 0.15) * 0.4;
      camera.position.y = 0.3 + Math.cos(t * 0.2) * 0.2;
      camera.lookAt(0, -0.1, 0);
      pts.rotation.y += 0.0003;
      renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', function() {
      var nw = container.clientWidth, nh = container.clientHeight;
      if (nw > 0 && nh > 0) {
        renderer.setSize(nw, nh);
        camera.aspect = nw / nh;
        camera.updateProjectionMatrix();
      }
    });
  }

  // Run after layout is guaranteed
  if (document.readyState === 'complete') {
    setTimeout(init, 50);
  } else {
    window.addEventListener('load', function() { setTimeout(init, 50); });
  }
})();
