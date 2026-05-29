// ANIMACION INICIAL

gsap.from(".logo",{
  opacity:0,
  scale:0.7,
  duration:1.5,
  ease:"power3.out"
});

gsap.from("h1",{
  opacity:0,
  y:30,
  duration:1,
  delay:0.5
});

gsap.from(".subtitle",{
  opacity:0,
  y:30,
  duration:1,
  delay:1
});

gsap.from(".enter-btn",{
  opacity:0,
  y:30,
  duration:1,
  delay:1.5
});

// PARTICULAS MAGICAS

tsParticles.load("tsparticles", {
  particles: {
    number: {
      value: 40
    },

    color: {
      value: [
        "#f8c8dc",
        "#c8a2ff",
        "#ffd700",
        "#aee7ff"
      ]
    },

    shape: {
      type: "circle"
    },

    opacity: {
      value: 0.7
    },

    size: {
      value: {
        min: 1,
        max: 4
      }
    },

    move: {
      enable: true,
      speed: 1,
      direction: "none",
      outModes: {
        default: "bounce"
      }
    }
  },

  background: {
    color: "transparent"
  }
});
// BOTON ENTRAR

const enterBtn = document.querySelector(".enter-btn");
const hero = document.querySelector(".hero");
const introMessage = document.querySelector(".intro-message");
const backgroundMusic = document.getElementById("backgroundMusic");
let backgroundMusicStarted = false;

enterBtn.addEventListener("click", () => {

  if(!backgroundMusicStarted){
    backgroundMusic.volume = 0;
    backgroundMusic.play().catch(() => {});
    backgroundMusicStarted = true;
    gsap.to(backgroundMusic,{
      volume:0.12,
      duration:3,
      ease:"power1.inOut"
    });
  }

  gsap.to(".hero-content",{
    opacity:0,
    scale:1.1,
    duration:1
  });

  gsap.to(".hero",{
    opacity:0,
    duration:1.5,
    delay:0.5,
    onComplete:() => {

      hero.style.display = "none";
      introMessage.classList.remove("hidden");

      gsap.fromTo(".intro-message",
        { scale:1.08, opacity:0 },
        { scale:1, opacity:1, duration:2, ease:"power2.out" }
      );

      gsap.fromTo(".intro-content",
        { opacity:0, y:60 },
        { opacity:1, y:0, duration:1.6, delay:0.6, ease:"power3.out" }
      );

    }
  });

});
// CONTINUAR HISTORIA

const continueBtn = document.querySelector(".continue-btn");
const chapter = document.querySelector(".chapter");

continueBtn.addEventListener("click", () => {

  gsap.to(".intro-content",{
    opacity:0,
    y:-40,
    duration:0.8,
    ease:"power2.in"
  });

  gsap.to(".intro-message",{
    opacity:0,
    scale:1.06,
    duration:1.4,
    delay:0.5,
    ease:"power2.in",
    onComplete:() => {

      document.querySelector(".intro-message").style.display = "none";

      chapter.classList.remove("hidden");
      chapter.style.visibility = "visible";
      chapter.style.pointerEvents = "auto";

      // Foto entra con zoom suave desde abajo
      gsap.fromTo(".chapter-image",
        { opacity:0, scale:1.08, y:30 },
        { opacity:1, scale:1, y:0, duration:1.8, ease:"power3.out" }
      );

      // Texto sube con delay
      gsap.fromTo(".chapter-text",
        { opacity:0, y:50 },
        { opacity:1, y:0, duration:1.5, delay:0.5, ease:"power3.out" }
      );

    }
  });

});
// PARALLAX SUAVE

window.addEventListener("scroll", () => {

  const scrolled = window.scrollY;

  gsap.to(".chapter-image img",{
    y: scrolled * 0.08,
    duration:1,
    ease:"power1.out"
  });

});
// REVELAR CAPITULOS AL HACER SCROLL

const hiddenSections = document.querySelectorAll(".chapter");

const observer = new IntersectionObserver((entries) => {

  entries.forEach(entry => {

    if(entry.isIntersecting){

      entry.target.classList.remove("hidden");

      entry.target.style.visibility = "visible";

      entry.target.style.pointerEvents = "auto";

      gsap.from(entry.target,{
        opacity:0,
        y:80,
        duration:1.5,
        ease:"power3.out"
      });

    }

  });

},{
  threshold:0.15
});

hiddenSections.forEach(section => {
  observer.observe(section);
});
// EFECTO CINEMATOGRAFICO EN SCROLL

const chapters = document.querySelectorAll(".chapter");

window.addEventListener("scroll", () => {

  const scrollY = window.scrollY;

  chapters.forEach((chapter,index) => {

    const image = chapter.querySelector("img");

    gsap.to(image,{
      y: scrollY * 0.03,
      scale:1.05,
      duration:1.2,
      ease:"power1.out"
    });

  });

});


