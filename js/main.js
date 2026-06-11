
document.addEventListener('DOMContentLoaded', function () {
  const menuBtn = document.getElementById('menuBtn');
  const nav = document.getElementById('nav');

  if (menuBtn && nav) {
    menuBtn.addEventListener('click', () => nav.classList.toggle('show'));
  }

  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (href.length > 1) {
        e.preventDefault();
        document.querySelector(href).scrollIntoView({ behavior: 'smooth', block: 'start' });
        nav.classList.remove('show');
      }
    })
  })

  // Theme toggle
  const themeToggle = document.getElementById('themeToggle');
  const body = document.body;
  const saved = localStorage.getItem('theme');
  if (saved === 'light') body.classList.add('light');

  if (themeToggle) {
    themeToggle.textContent = body.classList.contains('light') ? '☀️' : '🌙';
    themeToggle.addEventListener('click', () => {
      body.classList.toggle('light');
      const isLight = body.classList.contains('light');
      localStorage.setItem('theme', isLight ? 'light' : 'dark');
      themeToggle.textContent = isLight ? '☀️' : '🌙';
    });
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, idx) => {
      if (entry.isIntersecting) {
        entry.target.style.transitionDelay = (idx * 80) + 'ms';
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    })
  }, { threshold: 0.12 });

  document.querySelectorAll('[data-reveal]').forEach(el => observer.observe(el));

  setTimeout(() => {
    document.querySelectorAll('[data-reveal]').forEach(el => {
      if (!el.classList.contains('revealed')) {
        el.classList.add('revealed');
        el.style.transitionDelay = '';
      }
    })
  }, 1200);

  const typedText = document.getElementById('typedText');
  if (typedText) {
    const phrases = [
      "Web Developer",
      "Python Enthusiast",
      "Cybersecurity Learner",
      "Open Source Contributor",
      "Student"
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function type() {
      const currentPhrase = phrases[phraseIndex];
      
      if (isDeleting) {
        typedText.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
        typeSpeed = 50;
      } else {
        typedText.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
        typeSpeed = 100;
      }

      if (!isDeleting && charIndex === currentPhrase.length) {
        isDeleting = true;
        typeSpeed = 2000; // Pause at end
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typeSpeed = 500;
      }

      setTimeout(type, typeSpeed);
    }

    type();
  }



  // Contact Form AJAX Submission
  const contactForm = document.querySelector('.contact-form');
  const successMessage = document.getElementById('successMessage');

  if (contactForm && successMessage) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.textContent;

      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;

      const formData = new FormData(contactForm);
      const object = Object.fromEntries(formData);
      const json = JSON.stringify(object);

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: json
      })
        .then(async (response) => {
          if (response.status === 200) {
            contactForm.style.display = 'none';
            successMessage.style.display = 'block';
          } else {
            console.log(response);
            submitBtn.textContent = originalBtnText;
            submitBtn.disabled = false;
            alert('Something went wrong. Please try again later.');
          }
        })
        .catch(error => {
          console.log(error);
          submitBtn.textContent = originalBtnText;
          submitBtn.disabled = false;
          alert('Something went wrong. Please try again later.');
        });
    });
  }
})
