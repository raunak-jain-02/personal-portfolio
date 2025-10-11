// Mobile nav toggle and smooth scroll
document.addEventListener('DOMContentLoaded', function(){
  const menuBtn = document.getElementById('menuBtn');
  const nav = document.getElementById('nav');
  // guard menu button (may be absent on large layouts)
  if(menuBtn && nav){
    menuBtn.addEventListener('click', ()=> nav.classList.toggle('show'));
  }

  // Smooth scroll for internal links
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', e=>{
      const href = a.getAttribute('href');
      if(href.length>1){
        e.preventDefault();
        document.querySelector(href).scrollIntoView({behavior:'smooth',block:'start'});
        nav.classList.remove('show');
      }
    })
  })
  
  // Theme toggle
  const themeToggle = document.getElementById('themeToggle');
  const body = document.body;
  const saved = localStorage.getItem('theme');
  if(saved === 'light') body.classList.add('light');
  // Set initial icon
  if(themeToggle){
    themeToggle.textContent = body.classList.contains('light') ? '☀️' : '🌙';
    themeToggle.addEventListener('click', ()=>{
      body.classList.toggle('light');
      const isLight = body.classList.contains('light');
      localStorage.setItem('theme', isLight ? 'light' : 'dark');
      themeToggle.textContent = isLight ? '☀️' : '🌙';
    });
  }

  // Reveal on scroll using IntersectionObserver
  const observer = new IntersectionObserver((entries)=>{
    // stagger reveals by index when multiple elements appear together
    entries.forEach((entry, idx)=>{
      if(entry.isIntersecting){
        // small stagger using transitionDelay
        entry.target.style.transitionDelay = (idx * 80) + 'ms';
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    })
  },{threshold:0.12});

  document.querySelectorAll('[data-reveal]').forEach(el=>observer.observe(el));

  // Fallback: if some elements are still hidden (observer missed them), reveal after a short delay
  setTimeout(()=>{
    document.querySelectorAll('[data-reveal]').forEach(el=>{
      if(!el.classList.contains('revealed')){
        el.classList.add('revealed');
        el.style.transitionDelay = '';
      }
    })
  }, 1200);

  // (Removed old hover/focus typing behavior; replaced with CSS highlight sweep)

  // Typing animation (run regardless of menu button presence)
  const typedText = document.getElementById('typedText');
  if(typedText){
    const phrases = [
      "Web Developer",
      "Python Enthusiast",
      "Cybersecurity Learner",
      "Open Source Contributor",
      "Student" 
    ];
    let phraseIndex = 0;

    function typePhrase() {
      typedText.textContent = "";
      typedText.style.width = "0";
      typedText.classList.remove('typed');
      void typedText.offsetWidth; // restart animation
      typedText.classList.add('typed');
      typedText.textContent = phrases[phraseIndex];
      phraseIndex = (phraseIndex + 1) % phrases.length;
    }

    typePhrase();
    setInterval(typePhrase, 4000);
  }

  // Keyboard accessibility for mobile menu (guarded)
  if(menuBtn && nav){
    menuBtn.addEventListener('keydown', (e)=>{
      if(e.key === 'Enter' || e.key === ' '){
        e.preventDefault();
        nav.classList.toggle('show');
      }
      if(e.key === 'Escape'){
        nav.classList.remove('show');
        menuBtn.focus();
      }
    });
  }
})
