const heroStage = document.querySelector("#keyboard-stage");
const heroButton = document.querySelector("#keyboard-model");
const canvas = document.querySelector("#keyboard-canvas");
const fallback = document.querySelector(".keyboard-fallback");
const hubDetail = document.querySelector("#hub-detail");
const hubBack = document.querySelector("#hub-back");
const hubKicker = document.querySelector("#hub-detail-kicker");
const hubTitle = document.querySelector("#hub-detail-title");
const hubBody = document.querySelector("#hub-detail-body");
const diskDock = document.querySelector(".disk-dock");
const diskButtons = document.querySelectorAll(".floppy-button");
const contactForm = document.querySelector("#contact-form");
const formNote = document.querySelector("#form-note");

const hubContent = {
  about: {
    kicker: "",
    title: "About Me",
    body: `
      <div class="hub-profile">
        <img class="hub-headshot" src="assets/headshot-portrait.jpg?v=3" alt="James Dao headshot" />
        <div>
          <p>I am a computer engineering graduate focused on embedded systems, PCB design, edge AI, and practical software.</p>
          <p>I like building where hardware and software meet: custom boards, sensor-driven systems, real-time ML, and interfaces that make technical systems easier to use.</p>
        </div>
      </div>
      <div class="hub-stat-grid">
        <span><strong>Degree</strong>MS Computer Engineering</span>
        <span><strong>Location</strong>Houston, TX</span>
        <span><strong>Focus</strong>Embedded + edge AI</span>
      </div>
    `,
  },
  projects: {
    kicker: "",
    title: "Projects",
    body: `
      <div class="hub-card-grid">
        <article class="hub-card">
          <span class="hub-card-meta">PCB + firmware</span>
          <strong>Keyboard PCB Design</strong>
          <p>USB-C mechanical keyboard PCB with RP2040, routed switch matrix, power regulation, ESD protection, and 4-layer layout.</p>
          <div class="hub-tag-row"><span>KiCad</span><span>RP2040</span><span>USB-C</span><span>4-layer PCB</span></div>
        </article>
        <article class="hub-card">
          <span class="hub-card-meta">Edge AI + IoT</span>
          <strong>Facial Recognition IoT</strong>
          <p>Edge identity verification system with low-latency inference, AWS logging, and alerting.</p>
          <div class="hub-tag-row"><span>Python</span><span>Edge AI</span><span>AWS</span><span>IoT logging</span></div>
        </article>
        <article class="hub-card">
          <span class="hub-card-meta">AR learning</span>
          <strong>AR LingoQuest</strong>
          <p>Augmented reality language-learning experience with interactive vocabulary practice and immersive visual prompts.</p>
          <div class="hub-tag-row"><span>Unity</span><span>C#</span><span>AR</span><span>Interactive UI</span></div>
        </article>
        <article class="hub-card">
          <span class="hub-card-meta">Full stack</span>
          <strong>Pokemon Fullstack</strong>
          <p>Full-stack Pokemon web application with searchable character data, responsive UI, and API-driven architecture.</p>
          <div class="hub-tag-row"><span>React</span><span>Node.js</span><span>REST API</span><span>Responsive UI</span></div>
        </article>
      </div>
    `,
  },
  skills: {
    kicker: "",
    title: "Skills",
    body: `
      <div class="hub-skill-columns">
        <section>
          <h3>Hardware</h3>
          <div class="hub-skill-grid"><span>KiCad</span><span>PCB Design</span><span>Embedded Systems</span><span>USB 2.0</span><span>UART/I2C/SPI</span><span>Arduino</span><span>Raspberry Pi</span></div>
        </section>
        <section>
          <h3>Software</h3>
          <div class="hub-skill-grid"><span>Python</span><span>C++</span><span>C</span><span>Java</span><span>Verilog</span><span>Docker</span><span>Firebase</span></div>
        </section>
        <section>
          <h3>AI + Tools</h3>
          <div class="hub-skill-grid"><span>PyTorch</span><span>Hugging Face</span><span>AWS</span><span>Unity</span><span>Transfer Learning</span><span>LoRA / PEFT</span></div>
        </section>
      </div>
    `,
  },
  experience: {
    kicker: "",
    title: "Experience",
    body: `
      <div class="hub-timeline">
        <article class="hub-role"><span>Aug 2023 - Aug 2025</span><strong>IEEE Computational Intelligence Society Director</strong><p>Established a society branch, increased engagement by 25%, and led ML events for 100+ participants.</p></article>
        <article class="hub-role"><span>June 2024 - Aug 2024</span><strong>Cognizant Generative AI Externship</strong><p>Worked with PyTorch, Hugging Face, transfer learning, and LoRA-based PEFT techniques.</p></article>
        <article class="hub-role"><span>Aug 2023 - Dec 2023</span><strong>Multimodal Interaction Lab Research Intern</strong><p>Built Unity VR interfaces with C#, real-time sensor input, tactile feedback, and haptic interaction techniques.</p></article>
      </div>
    `,
  },
};

let activeHub = null;
let triggerDiskInsert = () => {};
let resetDiskModels = () => {};

function openHub(section) {
  const content = hubContent[section];

  if (!content || !hubDetail || !heroStage || !hubKicker || !hubTitle || !hubBody) {
    return;
  }

  activeHub = section;
  hubKicker.textContent = content.kicker || "";
  hubKicker.hidden = !content.kicker;
  hubTitle.textContent = content.title;
  hubBody.innerHTML = content.body;
  heroStage.dataset.activeHub = section;
  heroStage.classList.add("is-detail-open");
  hubDetail.setAttribute("aria-hidden", "false");
}

function selectDisk(section) {
  diskDock?.classList.add("is-inserting");
  triggerDiskInsert(section);

  diskButtons.forEach((button) => {
    const isSelected = button.getAttribute("data-hub-open") === section;
    button.classList.toggle("is-selected", isSelected);
  });

  window.setTimeout(() => openHub(section), 900);
}

function closeHub() {
  activeHub = null;
  heroStage?.classList.remove("is-detail-open");
  heroStage?.removeAttribute("data-active-hub");
  hubDetail?.setAttribute("aria-hidden", "true");
  diskDock?.classList.remove("is-inserting");
  diskButtons.forEach((button) => button.classList.remove("is-selected"));
  resetDiskModels();
}

async function initMacintoshScene() {
  if (!canvas || !heroStage) {
    return;
  }

  let THREE;
  let GLTFLoader;

  try {
    THREE = await import("./assets/vendor/three/three.module.js");
    ({ GLTFLoader } = await import("./assets/vendor/three/examples/jsm/loaders/GLTFLoader.js"));
  } catch (error) {
    if (fallback) {
      fallback.style.opacity = "1";
      fallback.textContent = "3D model unavailable";
    }
    return;
  }

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.shadowMap.enabled = false;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.9;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.01, 1000);
  const modelRoot = new THREE.Group();
  const modelPivot = new THREE.Group();
  const diskRoot = new THREE.Group();
  const raycaster = new THREE.Raycaster();
  const pointerNdc = new THREE.Vector2();
  const diskEntries = [];
  let hoveredDisk = null;
  let diskAnimation = null;
  let introComplete = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  scene.add(modelPivot);
  scene.add(diskRoot);
  modelPivot.add(modelRoot);

  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(18, 12),
    new THREE.ShadowMaterial({ color: 0x000000, opacity: 0 }),
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -1.05;
  floor.position.z = 0.35;
  floor.receiveShadow = false;
  scene.add(floor);

  scene.add(new THREE.AmbientLight(0xf8f3e6, 0.68));
  scene.add(new THREE.HemisphereLight(0xffffff, 0xa7b2ae, 0.58));

  const keyLight = new THREE.DirectionalLight(0xfff2d6, 0.86);
  keyLight.position.set(-3.6, 5.6, 4.8);
  keyLight.castShadow = false;
  keyLight.shadow.mapSize.set(1024, 1024);
  keyLight.shadow.bias = -0.00004;
  scene.add(keyLight);

  const frontFill = new THREE.DirectionalLight(0xdde9eb, 0.36);
  frontFill.position.set(2.8, 2.7, 4.8);
  scene.add(frontFill);

  const floppyFill = new THREE.PointLight(0xffe3bd, 1.25, 4.2, 1.8);
  floppyFill.position.set(0, 0.9, 3.25);
  scene.add(floppyFill);

  const loader = new GLTFLoader();

  const diskConfigs = [
    {
      section: "projects",
      file: "./assets/models/red_floppy.glb",
      position: new THREE.Vector3(-1.28, -0.38, 2.52),
      yaw: THREE.MathUtils.degToRad(-12),
      tilt: THREE.MathUtils.degToRad(18),
      label: "Projects",
      bobOffset: 0,
    },
    {
      section: "experience",
      file: "./assets/models/green_floppy.glb",
      position: new THREE.Vector3(-0.12, -0.38, 2.64),
      yaw: THREE.MathUtils.degToRad(1),
      tilt: THREE.MathUtils.degToRad(18),
      label: "Experience",
      bobOffset: 1.25,
    },
    {
      section: "skills",
      file: "./assets/models/blue_floppy.glb",
      position: new THREE.Vector3(1.06, -0.38, 2.48),
      yaw: THREE.MathUtils.degToRad(13),
      tilt: THREE.MathUtils.degToRad(18),
      label: "Skills",
      bobOffset: 2.5,
    },
  ];

  const easeOut = (value) => 1 - Math.pow(1 - value, 3);
  const easeOutBack = (value) => {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(value - 1, 3) + c1 * Math.pow(value - 1, 2);
  };

  function setObjectOpacity(object, opacity) {
    object.traverse((child) => {
      if (!child.isMesh || !child.material) {
        return;
      }

      const materials = Array.isArray(child.material) ? child.material : [child.material];
      materials.forEach((material) => {
        material.transparent = opacity < 1;
        material.opacity = opacity;
        material.needsUpdate = true;
      });
    });
  }

  function getMaterialBrightness(material) {
    if (!material?.color) {
      return 0;
    }

    return (material.color.r + material.color.g + material.color.b) / 3;
  }

  function softenMacintoshMaterial(material) {
    const brightness = getMaterialBrightness(material);

    if (!material?.color || brightness < 0.58) {
      return;
    }

    material.color.lerp(new THREE.Color(0xd6c8ab), 0.34).multiplyScalar(0.88);
    material.roughness = Math.max(material.roughness ?? 0.72, 0.82);
    material.metalness = Math.min(material.metalness ?? 0, 0.08);
    material.needsUpdate = true;
  }

  function liftFloppyMaterial(material) {
    if (!material?.color) {
      return;
    }

    material.color.setRGB(1.18, 1.18, 1.18);
    material.roughness = Math.min(material.roughness ?? 0.74, 0.64);

    if (material.emissive) {
      material.emissive.setRGB(1, 0.9, 0.78);
      material.emissiveIntensity = 0.06;
    }

    material.needsUpdate = true;
  }

  function getFlatRotation(size, yaw, tilt = 0) {
    const axes = [
      { key: "x", value: size.x },
      { key: "y", value: size.y },
      { key: "z", value: size.z },
    ].sort((a, b) => a.value - b.value);

    if (axes[0].key === "y") {
      return new THREE.Euler(tilt, yaw, 0);
    }

    if (axes[0].key === "z") {
      return new THREE.Euler(-Math.PI / 2 + tilt, yaw, 0);
    }

    return new THREE.Euler(tilt, yaw, Math.PI / 2);
  }

  function prepareFloppyModel(gltf, config) {
    const disk = gltf.scene;
    const wrapper = new THREE.Group();

    disk.traverse((object) => {
      if (!object.isMesh) {
        return;
      }

      object.castShadow = false;
      object.receiveShadow = false;
      object.userData.section = config.section;
      object.userData.diskWrapper = wrapper;

      const materials = Array.isArray(object.material) ? object.material : [object.material];
      materials.forEach((material) => {
        if (material) {
          material.roughness = Math.min(material.roughness ?? 0.8, 0.88);
          liftFloppyMaterial(material);
          material.needsUpdate = true;
        }
      });
    });

    disk.updateMatrixWorld(true);

    const box = new THREE.Box3().setFromObject(disk);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const largestAxis = Math.max(size.x, size.y, size.z) || 1;

    disk.position.sub(center);
    wrapper.add(disk);
    wrapper.scale.setScalar(0.78 / largestAxis);
    wrapper.position.copy(config.position);
    wrapper.rotation.copy(getFlatRotation(size, config.yaw, config.tilt));
    wrapper.userData.section = config.section;
    wrapper.userData.label = config.label;
    wrapper.userData.homePosition = wrapper.position.clone();
    wrapper.userData.homeScale = wrapper.scale.clone();
    wrapper.userData.homeQuaternion = wrapper.quaternion.clone();
    wrapper.userData.hoverPosition = config.position.clone().add(new THREE.Vector3(0, 0.2, 0.18));
    wrapper.userData.hoverScale = wrapper.scale.clone().multiplyScalar(1.16);
    wrapper.userData.hoverQuaternion = new THREE.Quaternion().setFromEuler(
      getFlatRotation(size, config.yaw, config.tilt + THREE.MathUtils.degToRad(16)),
    );
    wrapper.userData.targetQuaternion = new THREE.Quaternion().setFromEuler(
      new THREE.Euler(THREE.MathUtils.degToRad(74), config.yaw * 0.35, 0),
    );

    diskRoot.add(wrapper);
    if (!introComplete) {
      setObjectOpacity(wrapper, 0);
    }

    const entry = {
      section: config.section,
      group: wrapper,
      homePosition: wrapper.userData.homePosition.clone(),
      homeScale: wrapper.userData.homeScale.clone(),
      homeQuaternion: wrapper.userData.homeQuaternion.clone(),
      hoverPosition: wrapper.userData.hoverPosition.clone(),
      hoverScale: wrapper.userData.hoverScale.clone(),
      hoverQuaternion: wrapper.userData.hoverQuaternion.clone(),
      targetQuaternion: wrapper.userData.targetQuaternion.clone(),
      bobOffset: config.bobOffset,
    };
    diskEntries.push(entry);
    return entry;
  }

  async function loadFloppyModels() {
    const results = await Promise.allSettled(diskConfigs.map((config) => loader.loadAsync(config.file)));

    results.forEach((result, index) => {
      if (result.status === "fulfilled") {
        prepareFloppyModel(result.value, diskConfigs[index]);
      }
    });
  }

  function updateDiskHover(event) {
    if (!diskEntries.length || heroStage?.classList.contains("is-detail-open")) {
      hoveredDisk = null;
      canvas.style.cursor = "default";
      return;
    }

    const rect = canvas.getBoundingClientRect();
    pointerNdc.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointerNdc.y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
    raycaster.setFromCamera(pointerNdc, camera);

    const hits = raycaster.intersectObjects(
      diskEntries.map((entry) => entry.group),
      true,
    );
    const hitDisk = hits[0]?.object?.userData?.diskWrapper || null;
    hoveredDisk = hitDisk;
    canvas.style.cursor = hoveredDisk ? "pointer" : "default";
  }

  try {
    const gltf = await loader.loadAsync("./assets/models/apple_macintosh.glb");
    const model = gltf.scene;
    const removals = [];

    model.traverse((object) => {
      if (object.isMesh) {
        const box = new THREE.Box3().setFromObject(object);
        const size = box.getSize(new THREE.Vector3());
        const maxAxis = Math.max(size.x, size.y, size.z);
        const materials = Array.isArray(object.material) ? object.material : [object.material];
        const materialNames = materials.map((material) => material?.name || "");
        const isBackdrop =
          materialNames.includes("Background") ||
          materialNames.includes("02___Default") ||
          maxAxis > 120;

        if (isBackdrop) {
          removals.push(object);
          return;
        }

        object.castShadow = false;
        object.receiveShadow = false;

        materials.forEach(softenMacintoshMaterial);
      }
    });

    removals.forEach((object) => object.parent?.remove(object));
    model.updateMatrixWorld(true);

    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const largestAxis = Math.max(size.x, size.y, size.z) || 1;
    const scale = 4.12 / largestAxis;

    model.position.sub(center);
    model.scale.setScalar(scale);
    model.rotation.set(0, 0, 0);
    modelRoot.add(model);

    const framedBox = new THREE.Box3().setFromObject(modelRoot);
    const framedSize = framedBox.getSize(new THREE.Vector3());
    const framedCenter = framedBox.getCenter(new THREE.Vector3());
    modelRoot.position.sub(framedCenter);
    modelRoot.position.y += framedSize.y * 0.18;
    modelPivot.position.x += framedSize.x * 0.1;
    modelPivot.position.y -= 0.12;
    diskRoot.position.y -= 0.12;

    camera.position.set(0, 1.82, 8.25);
    camera.lookAt(0, 0.16, 0);
  } catch (error) {
    if (fallback) {
      fallback.style.opacity = "1";
      fallback.textContent = "Could not load Macintosh model";
    }
    return;
  }

  loadFloppyModels().catch(() => {
    diskDock?.classList.add("is-fallback-only");
  });

  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    const width = Math.max(1, rect.width);
    const height = Math.max(1, rect.height);

    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  };

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(canvas);
  resize();

  const clock = new THREE.Clock();
  const pointer = new THREE.Vector2(0, 0);
  const rotation = new THREE.Vector2(0, 0);
  const introStartedAt = performance.now();
  const introDuration = 1180;
  const modelPivotHomePosition = modelPivot.position.clone();
  const diskRootHomePosition = diskRoot.position.clone();

  if (!introComplete) {
    modelPivot.position.y = modelPivotHomePosition.y - 0.34;
    modelPivot.scale.setScalar(0.78);
    diskRoot.position.y = diskRootHomePosition.y - 0.22;
    diskRoot.scale.setScalar(0.82);
    setObjectOpacity(modelRoot, 0);
    setObjectOpacity(diskRoot, 0);
  }

  heroStage.addEventListener("pointermove", (event) => {
    const rect = heroStage.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    pointer.y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    updateDiskHover(event);
  });

  heroStage.addEventListener("pointerleave", () => {
    pointer.set(0, 0);
    hoveredDisk = null;
    canvas.style.cursor = "default";
  });

  canvas.addEventListener("click", (event) => {
    updateDiskHover(event);

    if (!hoveredDisk?.userData?.section) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    selectDisk(hoveredDisk.userData.section);
  });

  triggerDiskInsert = (section) => {
    diskAnimation = {
      section,
      startedAt: performance.now(),
    };
  };

  resetDiskModels = () => {
    diskAnimation = null;
    diskEntries.forEach((entry) => {
      entry.group.position.copy(entry.homePosition);
      entry.group.scale.copy(entry.homeScale);
      entry.group.quaternion.copy(entry.homeQuaternion);
      setObjectOpacity(entry.group, 1);
    });
  };

  function updateDiskAnimation(now) {
    if (!diskAnimation) {
      return;
    }

    const rawProgress = THREE.MathUtils.clamp((now - diskAnimation.startedAt) / 900, 0, 1);
    const progress = easeOut(rawProgress);
    const targetPosition = new THREE.Vector3(modelPivot.position.x - 0.57, -0.16, 1.34);

    diskEntries.forEach((entry) => {
      const isSelected = entry.section === diskAnimation.section;

      if (isSelected) {
        entry.group.position.lerpVectors(entry.homePosition, targetPosition, progress);
        entry.group.position.y += Math.sin(progress * Math.PI) * 0.52;
        entry.group.scale.copy(entry.homeScale).multiplyScalar(THREE.MathUtils.lerp(1, 0.46, progress));
        entry.group.quaternion.copy(entry.homeQuaternion).slerp(entry.targetQuaternion, progress);
        setObjectOpacity(entry.group, THREE.MathUtils.lerp(1, 0.2, Math.max(0, progress - 0.72) / 0.28));
        return;
      }

      const sideStep = entry.homePosition.x < 0 ? -0.22 : 0.22;
      entry.group.position.set(
        entry.homePosition.x + sideStep * progress,
        entry.homePosition.y - 0.08 * progress,
        entry.homePosition.z + 0.05 * progress,
      );
      entry.group.scale.copy(entry.homeScale).multiplyScalar(THREE.MathUtils.lerp(1, 0.92, progress));
      setObjectOpacity(entry.group, THREE.MathUtils.lerp(1, 0.48, progress));
    });
  }

  function updateDiskHoverMotion(now) {
    if (diskAnimation) {
      return;
    }

    diskEntries.forEach((entry) => {
      const isHovered = hoveredDisk === entry.group;
      const idleLift = Math.sin(now * 0.0024 + entry.bobOffset) * 0.045;
      const targetPosition = (isHovered ? entry.hoverPosition : entry.homePosition).clone();
      targetPosition.y += isHovered ? Math.max(0, idleLift) : idleLift;
      const targetScale = isHovered ? entry.hoverScale : entry.homeScale;
      const targetQuaternion = isHovered ? entry.hoverQuaternion : entry.homeQuaternion;
      const easing = isHovered ? 0.18 : 0.12;

      entry.group.position.lerp(targetPosition, easing);
      entry.group.scale.lerp(targetScale, easing);
      entry.group.quaternion.slerp(targetQuaternion, easing);
      setObjectOpacity(entry.group, 1);
    });
  }

  function updateIntro(now) {
    if (introComplete) {
      return;
    }

    const rawProgress = THREE.MathUtils.clamp((now - introStartedAt) / introDuration, 0, 1);
    const liftProgress = easeOut(rawProgress);
    const scaleProgress = easeOutBack(rawProgress);

    modelPivot.position.y = THREE.MathUtils.lerp(modelPivotHomePosition.y - 0.34, modelPivotHomePosition.y, liftProgress);
    modelPivot.scale.setScalar(THREE.MathUtils.lerp(0.78, 1, scaleProgress));
    diskRoot.position.y = THREE.MathUtils.lerp(diskRootHomePosition.y - 0.22, diskRootHomePosition.y, liftProgress);
    diskRoot.scale.setScalar(THREE.MathUtils.lerp(0.82, 1, scaleProgress));
    setObjectOpacity(modelRoot, rawProgress);
    setObjectOpacity(diskRoot, rawProgress);

    if (rawProgress >= 1) {
      introComplete = true;
      modelPivot.position.copy(modelPivotHomePosition);
      modelPivot.scale.setScalar(1);
      diskRoot.position.copy(diskRootHomePosition);
      diskRoot.scale.setScalar(1);
      setObjectOpacity(modelRoot, 1);
      setObjectOpacity(diskRoot, 1);
    }
  }

  function animate() {
    clock.getDelta();
    const now = performance.now();
    const maxTurn = THREE.MathUtils.degToRad(10);
    const targetY = THREE.MathUtils.clamp(pointer.x * maxTurn, -maxTurn, maxTurn);
    rotation.x = 0;
    rotation.y += (targetY - rotation.y) * 0.075;
    modelPivot.rotation.x = 0;
    modelPivot.rotation.z = 0;
    modelPivot.rotation.y = rotation.y;
    heroStage.style.setProperty("--mac-yaw", THREE.MathUtils.radToDeg(rotation.y).toFixed(3));
    heroStage.style.setProperty("--about-bob", `${(Math.sin(now * 0.002) * 2.4).toFixed(2)}px`);
    updateIntro(now);
    updateDiskAnimation(now);
    updateDiskHoverMotion(now);
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  animate();
}

hubBack?.addEventListener("click", closeHub);

heroButton?.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
  }
});

document.querySelectorAll("[data-hub-open]").forEach((trigger) => {
  trigger.addEventListener("click", (event) => {
    const section = trigger.getAttribute("data-hub-open");

    if (section && hubContent[section]) {
      event.preventDefault();

      if (trigger.classList.contains("floppy-button")) {
        selectDisk(section);
      } else {
        openHub(section);
      }
    }
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && activeHub) {
    closeHub();
  }
});

document.addEventListener("click", (event) => {
  if (!activeHub || !hubDetail || hubDetail.getAttribute("aria-hidden") === "true") {
    return;
  }

  const target = event.target;

  if (
    target instanceof Element &&
    (hubDetail.contains(target) || target.closest("[data-hub-open]") || target.closest(".hub-back"))
  ) {
    return;
  }

  closeHub();
});

contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const form = new FormData(contactForm);
  const name = String(form.get("name") || "").trim();
  const email = String(form.get("email") || "").trim();
  const message = String(form.get("message") || "").trim();
  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
  const subject = encodeURIComponent(`Portfolio inquiry from ${name || "a recruiter"}`);

  window.location.href = `mailto:james.k.dao@gmail.com?subject=${subject}&body=${body}`;
  formNote.textContent = "Opening your email app with a prepared message.";
});

window.addEventListener("DOMContentLoaded", () => {
  initMacintoshScene();

  if (window.lucide) {
    window.lucide.createIcons();
  }
});
