document.addEventListener("DOMContentLoaded", () => {
  const $ = (s) => document.querySelector(s);
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasGsap = typeof gsap !== "undefined";
  if (hasGsap && typeof ScrollTrigger !== "undefined") gsap.registerPlugin(ScrollTrigger);

  const hero = $("#hero"), intro = $("#intro"), story = $("#story");
  const enterBtn = $(".enter-btn"), continueBtn = $(".continue-btn");
  const restartBtn = $(".restart-btn"), muteBtn = $(".mute-btn");
  const audio = $("#backgroundMusic");

  // Animación de portada (una sola vez, sin pelear con el CSS)
  if (hasGsap && !reduce) {
    const tl = gsap.timeline();
    tl.from(".logo", { opacity: 0, scale: 0.7, duration: 1.5, ease: "power3.out" })
      .from("h1", { opacity: 0, y: 30, duration: 1 }, 0.5)
      .from(".subtitle", { opacity: 0, y: 30, duration: 1 }, 1)
      .from(".enter-btn, .hint", { opacity: 0, y: 30, duration: 1 }, 1.5);
  }

  // Partículas (protegidas: si el CDN falla, el álbum igual funciona)
  if (window.tsParticles && !reduce) {
    tsParticles.load("tsparticles", {
      fpsLimit: 40,
      particles: {
        number: { value: window.innerWidth < 768 ? 22 : 40 },
        color: { value: ["#f8c8dc", "#c8a2ff", "#ffd700", "#aee7ff"] },
        shape: { type: "circle" },
        opacity: { value: 0.6 },
        size: { value: { min: 1, max: 4 } },
        move: { enable: true, speed: 1, outModes: { default: "bounce" } }
      },
      background: { color: "transparent" }
    });
  }

  // Música con Web Audio (el volumen de <audio> no funciona en iPhone)
  let ctx, gain, musicOn = false;
  function startMusic() {
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!ctx) {
        ctx = new AC();
        gain = ctx.createGain();
        gain.gain.value = 0;
        ctx.createMediaElementSource(audio).connect(gain).connect(ctx.destination);
      }
      ctx.resume();
      audio.play().catch(() => {});
      gain.gain.cancelScheduledValues(ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 3);
      musicOn = true;
      muteBtn.hidden = false;
      muteBtn.textContent = "🔊";
    } catch (e) { audio.volume = 0.15; audio.play().catch(() => {}); }
  }
  function setMuted(m) {
    if (!gain) return;
    gain.gain.linearRampToValueAtTime(m ? 0 : 0.15, ctx.currentTime + 0.4);
    musicOn = !m;
    muteBtn.textContent = m ? "🔇" : "🔊";
    muteBtn.setAttribute("aria-label", m ? "Activar música" : "Silenciar música");
  }
  muteBtn.addEventListener("click", () => setMuted(musicOn));
  document.addEventListener("visibilitychange", () => {
    if (!ctx) return;
    if (document.hidden) ctx.suspend(); else if (musicOn) ctx.resume();
  });

  // Transiciones entre pantallas
  function swap(from, to, done) {
    if (!hasGsap || reduce) { from.hidden = true; to.hidden = false; done && done(); return; }
    gsap.to(from, { opacity: 0, duration: 1, onComplete: () => {
      from.hidden = true; to.hidden = false;
      gsap.fromTo(to, { opacity: 0 }, { opacity: 1, duration: 1.2, onComplete: done });
    }});
  }

  enterBtn.addEventListener("click", () => {
    startMusic();
    swap(hero, intro);
  });

  continueBtn.addEventListener("click", () => {
    swap(intro, story, () => {
      document.body.classList.remove("locked");
      window.scrollTo(0, 0);
      setupStory();
      const h = document.createElement("div");
      h.className = "scroll-hint";
      h.textContent = "Deslizá ↓";
      document.body.appendChild(h);
      setTimeout(() => h.remove(), 5000);
      addEventListener("scroll", () => h.remove(), { once: true, passive: true });
    });
  });

  // Capítulos: revelado una sola vez + parallax relativo a cada sección
  let setupDone = false;
  function setupStory() {
    if (setupDone || !hasGsap || typeof ScrollTrigger === "undefined") return;
    setupDone = true;
    document.querySelectorAll(".chapter").forEach((ch) => {
      const img = ch.querySelector("img"), box = ch.querySelector(".chapter-image");
      const lines = ch.querySelector(".chapter-text");
      if (!reduce) {
        gsap.from([box, lines], {
          opacity: 0, y: 60, duration: 1.2, stagger: 0.2, ease: "power3.out",
          scrollTrigger: { trigger: ch, start: "top 75%", once: true }
        });
        gsap.fromTo(img, { yPercent: -6 }, {
          yPercent: 6, ease: "none",
          scrollTrigger: { trigger: ch, start: "top bottom", end: "bottom top", scrub: true }
        });
      }
    });
    gsap.to(".progress span", {
      width: "100%", ease: "none",
      scrollTrigger: { trigger: story, start: "top top", end: "bottom bottom", scrub: true }
    });
    ScrollTrigger.refresh();
    // Refrescar cuando cargan las fotos (lazy)
    document.querySelectorAll(".chapter img").forEach((i) =>
      i.addEventListener("load", () => ScrollTrigger.refresh(), { once: true }));
  }

  // Volver a empezar
  restartBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0 });
    story.hidden = true;
    document.body.classList.add("locked");
    hero.hidden = false;
    hero.style.opacity = 1;
    intro.style.opacity = 1;
    story.style.opacity = 1;
  });
});
