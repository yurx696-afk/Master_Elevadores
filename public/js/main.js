/**
 * MASTER ELEVADORES - Scripts da landing page
 */

document.addEventListener('DOMContentLoaded', () => {
  initSmoothScroll();
  initContactForm();
});

/**
 * Suaviza o scroll dos links âncora (menu e botões)
 */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

/**
 * Envia o formulário de contato via fetch para a API Node.js
 */
function initContactForm() {
  const form = document.querySelector('.contact-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    const feedbackEl = form.querySelector('.form-feedback');
    if (!feedbackEl) return;

    const formData = {
      nome: form.nome.value.trim(),
      email: form.email.value.trim(),
      telefone: form.telefone.value.trim(),
      mensagem: form.mensagem.value.trim()
    };

    submitBtn.disabled = true;
    feedbackEl.className = 'form-feedback';
    feedbackEl.textContent = '';
    feedbackEl.style.display = 'none';

    try {
      const response = await fetch('/api/contato', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        feedbackEl.className = 'form-feedback success';
        feedbackEl.textContent = data.message || 'Mensagem enviada com sucesso!';
        form.reset();
      } else {
        feedbackEl.className = 'form-feedback error';
        feedbackEl.textContent = data.message || 'Erro ao enviar. Tente novamente.';
      }
    } catch (err) {
      feedbackEl.className = 'form-feedback error';
      feedbackEl.textContent = 'Erro de conexão. Verifique sua internet e tente novamente.';
    } finally {
      submitBtn.disabled = false;
    }
  });
}
