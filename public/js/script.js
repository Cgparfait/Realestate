gsap.registerPlugin(ScrollTrigger);

// Hero Section Animations
gsap.from(".hero-section h1", {
  opacity: 0,
  y: 50,
  duration: 1,
  ease: "power2.out",
  scrollTrigger: {
    trigger: ".hero-section",
    start: "top 80%",
  },
});

gsap.from(".hero-section p", {
  opacity: 0,
  y: 50,
  duration: 1,
  delay: 0.3,
  ease: "power2.out",
  scrollTrigger: {
    trigger: ".hero-section",
    start: "top 80%",
  },
});

gsap.from(".hero-section form", {
  opacity: 0,
  y: 50,
  duration: 1,
  delay: 0.6,
  ease: "power2.out",
  scrollTrigger: {
    trigger: ".hero-section",
    start: "top 80%",
  },
});

// Services Section Animations
gsap.from("#services h2", {
  opacity: 0,
  y: 50,
  duration: 1,
  ease: "power2.out",
  scrollTrigger: {
    trigger: "#services",
    start: "top 80%",
  },
});

gsap.from("#services .card-hover", {
  opacity: 0,
  y: 50,
  duration: 1,
  stagger: 0.2,
  ease: "power2.out",
  scrollTrigger: {
    trigger: "#services",
    start: "top 80%",
  },
});

// Sell Your Home Stress-Free Section Animations
gsap.from("#sell-stress-free h2", {
  opacity: 0,
  y: 50,
  duration: 1,
  ease: "power2.out",
  scrollTrigger: {
    trigger: "#sell-stress-free",
    start: "top 80%",
  },
});

gsap.from("#sell-stress-free p", {
  opacity: 0,
  y: 50,
  duration: 1,
  stagger: 0.2,
  ease: "power2.out",
  scrollTrigger: {
    trigger: "#sell-stress-free",
    start: "top 80%",
  },
});

gsap.from("#sell-stress-free img", {
  opacity: 0,
  x: -50,
  duration: 1,
  ease: "power2.out",
  scrollTrigger: {
    trigger: "#sell-stress-free",
    start: "top 80%",
  },
});

// Lioness Homes Promise Section Animations
gsap.from("#lioness-promise h2", {
  opacity: 0,
  y: 50,
  duration: 1,
  ease: "power2.out",
  scrollTrigger: {
    trigger: "#lioness-promise",
    start: "top 80%",
  },
});

gsap.from("#lioness-promise p", {
  opacity: 0,
  y: 50,
  duration: 1,
  stagger: 0.2,
  ease: "power2.out",
  scrollTrigger: {
    trigger: "#lioness-promise",
    start: "top 80%",
  },
});

gsap.from("#lioness-promise img", {
  opacity: 0,
  x: 50,
  duration: 1,
  ease: "power2.out",
  scrollTrigger: {
    trigger: "#lioness-promise",
    start: "top 80%",
  },
});

// How It Works Section Animations
gsap.from("#how-it-works h2", {
  opacity: 0,
  y: 50,
  duration: 1,
  ease: "power2.out",
  scrollTrigger: {
    trigger: "#how-it-works",
    start: "top 80%",
  },
});

gsap.from("#how-it-works .card-hover", {
  opacity: 0,
  y: 50,
  duration: 1,
  stagger: 0.2,
  ease: "power2.out",
  scrollTrigger: {
    trigger: "#how-it-works",
    start: "top 80%",
  },
});

// Testimonials Section Animations
gsap.from("#testimonials h2", {
  opacity: 0,
  y: 50,
  duration: 1,
  ease: "power2.out",
  scrollTrigger: {
    trigger: "#testimonials",
    start: "top 80%",
  },
});

gsap.from("#testimonials .card-hover", {
  opacity: 0,
  y: 50,
  duration: 1,
  stagger: 0.2,
  ease: "power2.out",
  scrollTrigger: {
    trigger: "#testimonials",
    start: "top 80%",
  },
});

// Contact Section Animations
gsap.from("#contact h2", {
  opacity: 0,
  y: 50,
  duration: 1,
  ease: "power2.out",
  scrollTrigger: {
    trigger: "#contact",
    start: "top 80%",
  },
});

gsap.from("#contact form", {
  opacity: 0,
  y: 50,
  duration: 1,
  stagger: 0.2,
  ease: "power2.out",
  scrollTrigger: {
    trigger: "#contact",
    start: "top 80%",
  },
});

// Mobile Menu Toggle
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');

function hideNavbar() {
  mobileMenu.classList.toggle('hidden');
}

mobileMenuButton.addEventListener('click', () => {
  mobileMenu.classList.toggle('hidden');
});

// Navbar Scroll Effect
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

function carryAddress(addressValue) {
  document.getElementById('contact-address-input').value = addressValue;
  window.location.href = "#contact";
}

// Back to Top Button
const backToTopButton = document.getElementById('back-to-top');

// Show/hide button based on scroll position
window.addEventListener('scroll', () => {
  if (window.scrollY > 300) {
    backToTopButton.classList.add('visible');
    backToTopButton.classList.remove('hidden');
  } else {
    backToTopButton.classList.add('hidden');
    backToTopButton.classList.remove('visible');
  }
});

// Smooth scroll to top
backToTopButton.addEventListener('click', () => {
  gsap.to(window, {
    duration: 1,
    scrollTo: {
      y: 0
    },
    ease: "power2.out",
  });
});