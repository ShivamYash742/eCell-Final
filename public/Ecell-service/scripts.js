// Using GSAP for smooth animations
document.addEventListener('DOMContentLoaded', () => {
    gsap.from(".service-card", {
      opacity: 0,
      y: 50,
      duration: 1,
      stagger: 0.2,
      scrollTrigger: {
        trigger: ".services-container",
        start: "top 80%",
      },
    });
  });
  
  // Button click interaction
  document.querySelectorAll('.learn-more-btn').forEach(button => {
    button.addEventListener('click', () => {
      alert('Detailed information will be added soon!');
    });
  });
function toggleMobileMenu() {
  const mobileNav = document.getElementById('mobileNav');
  const hamburgerIcon = document.querySelector('.hamburger-icon');
  const closeIcon = document.querySelector('.close-icon');
  
  mobileNav.classList.toggle('show');
  hamburgerIcon.classList.toggle('hidden');
  closeIcon.classList.toggle('hidden');
}

// Handle scroll-based background color
window.addEventListener('scroll', function() {
  const nav = document.querySelector('.navbar');
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrollPercentage = (scrollTop / docHeight) * 100;
  
  if (scrollPercentage > 8.5) {
      const opacity = Math.min((scrollPercentage - 8.5) / 27.5, 1);
      nav.style.background = `linear-gradient(to right, 
          rgba(27, 117, 187, ${opacity}), 
          rgba(87, 184, 71, ${opacity}))`;
  } else {
      nav.style.background = 'transparent';
  }
});