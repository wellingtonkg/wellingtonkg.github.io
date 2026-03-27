document.documentElement.classList.add('js');

const observer = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
},{threshold:0.12});

document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

const mobileBtn = document.querySelector('.mobile-menu-btn');
const mobileNav = document.querySelector('.mobile-nav');
if(mobileBtn && mobileNav){
  mobileBtn.addEventListener('click', ()=> mobileNav.classList.toggle('open'));
}

const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
if (contactForm && formStatus) {
  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const isPortuguese = document.documentElement.lang.toLowerCase().startsWith('pt');
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalButtonText = submitButton ? submitButton.textContent : '';

    formStatus.style.display = 'none';
    formStatus.textContent = '';
    formStatus.classList.remove('contact-success', 'contact-error');

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = isPortuguese ? 'Enviando...' : 'Sending...';
    }

    const data = new FormData(contactForm);

    try {
      const response = await fetch('https://formspree.io/f/xgvnveeq', {
        method: 'POST',
        body: data,
        headers: {
          Accept: 'application/json'
        }
      });

      if (response.ok) {
        contactForm.reset();
        formStatus.textContent = isPortuguese
          ? 'Mensagem enviada com sucesso! ✅'
          : 'Message sent successfully! ✅';
        formStatus.classList.add('contact-success');
      } else {
        let errorMessage = isPortuguese
          ? 'Erro ao enviar. Tente novamente.'
          : 'Error sending message. Please try again.';

        try {
          const errorData = await response.json();
          if (errorData && errorData.error) {
            errorMessage = isPortuguese
              ? `Erro ao enviar: ${errorData.error}`
              : `Error sending: ${errorData.error}`;
          }
        } catch (_) {}

        formStatus.textContent = errorMessage;
        formStatus.classList.add('contact-error');
      }
    } catch (error) {
      formStatus.textContent = isPortuguese
        ? 'Falha de rede. Tente novamente.'
        : 'Network error. Please try again.';
      formStatus.classList.add('contact-error');
    }

    formStatus.style.display = 'block';

    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = originalButtonText;
    }
  });
}
