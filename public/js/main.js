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

  const submitBtn = form.querySelector('.btn-submit');
  const feedbackEl = form.querySelector('.form-feedback');
  const charCounter = form.querySelector('[data-counter-for="mensagem"]');
  const messageField = form.querySelector('#mensagem');
  const templateButtons = form.querySelectorAll('.chip[data-template]');

  // Helpers
  const fields = {
    nome: form.querySelector('#nome'),
    email: form.querySelector('#email'),
    telefone: form.querySelector('#telefone'),
    mensagem: messageField
  };

  // Persistência com localStorage
  restoreFormFromStorage(fields);
  Object.values(fields).forEach((field) => {
    if (!field) return;
    field.addEventListener('input', () => {
      saveFormToStorage(fields);
      validateField(field);
      updateFloatingState(field);
      if (field.id === 'mensagem') {
        updateCharCounter(field, charCounter);
      }
    });
    updateFloatingState(field);
  });

  if (messageField && charCounter) {
    updateCharCounter(messageField, charCounter);
  }

  // Máscara simples para telefone com DDD 61
  if (fields.telefone) {
    fields.telefone.addEventListener('input', () => {
      const masked = maskPhone(fields.telefone.value);
      fields.telefone.value = masked;
    });
  }

  // Sugestões rápidas de mensagem
  templateButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const tpl = btn.getAttribute('data-template') || '';
      if (!messageField) return;
      if (messageField.value.trim()) {
        messageField.value = `${messageField.value.trim()}\n\n${tpl}`;
      } else {
        messageField.value = tpl;
      }
      messageField.dispatchEvent(new Event('input', { bubbles: true }));
      messageField.focus();
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!submitBtn || !feedbackEl) return;

    const firstInvalid = validateForm(fields);
    if (firstInvalid) {
      scrollToField(firstInvalid);
      return;
    }

    const formData = {
      nome: fields.nome?.value.trim() || '',
      email: fields.email?.value.trim() || '',
      telefone: fields.telefone?.value.trim() || '',
      mensagem: fields.mensagem?.value.trim() || ''
    };

    // Estado visual "enviando"
    form.classList.add('sending');
    submitBtn.disabled = true;
    const originalLabel = submitBtn.textContent;
    submitBtn.textContent = 'Enviando…';
    feedbackEl.className = 'form-feedback';
    feedbackEl.textContent = '';

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
        feedbackEl.textContent = data.message || 'Mensagem enviada com sucesso! Abrindo WhatsApp…';

        // Limpa formulário e localStorage
        form.reset();
        clearFormStorage();
        Object.values(fields).forEach(updateFloatingState);
        if (charCounter && messageField) {
          updateCharCounter(messageField, charCounter);
        }

        // Envio automático para WhatsApp
        openWhatsAppWithMessage(formData);
      } else {
        feedbackEl.className = 'form-feedback error';
        feedbackEl.textContent = data.message || 'Erro ao enviar. Tente novamente.';
      }
    } catch (err) {
      feedbackEl.className = 'form-feedback error';
      feedbackEl.textContent = 'Erro de conexão. Verifique sua internet e tente novamente.';
    } finally {
      form.classList.remove('sending');
      submitBtn.disabled = false;
      submitBtn.textContent = originalLabel;
    }
  });
}

// ===== Utilitários de formulário =====

function getFieldError(field) {
  const value = field.value.trim();
  if (field.id === 'nome') {
    if (!value) return 'Informe seu nome completo.';
    if (value.length < 3) return 'Nome muito curto.';
  }
  if (field.id === 'email') {
    if (!value) return 'Informe um e-mail.';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return 'E-mail inválido.';
  }
  if (field.id === 'telefone' && value) {
    const digits = value.replace(/\D/g, '');
    if (digits.length < 10) return 'Telefone incompleto.';
  }
  if (field.id === 'mensagem') {
    if (!value) return 'Descreva rapidamente sua necessidade.';
    if (value.length < 10) return 'Mensagem muito curta.';
  }
  return '';
}

function validateField(field) {
  const wrapper = field.closest('.form-field');
  if (!wrapper) return;
  const errorEl = wrapper.querySelector(`.field-error[data-error-for="${field.id}"]`);
  const error = getFieldError(field);

  if (error) {
    wrapper.classList.add('input-error');
    if (errorEl) errorEl.textContent = error;
  } else {
    wrapper.classList.remove('input-error');
    if (errorEl) errorEl.textContent = '';
  }
}

function validateForm(fields) {
  let firstInvalid = null;
  Object.values(fields).forEach((field) => {
    if (!field) return;
    validateField(field);
    const error = getFieldError(field);
    if (error && !firstInvalid) firstInvalid = field;
  });
  return firstInvalid;
}

function updateFloatingState(field) {
  if (!field) return;
  // Força :placeholder-shown funcionar bem para textarea
  if (field.tagName.toLowerCase() === 'textarea' && !field.value) {
    field.placeholder = ' ';
  }
}

function updateCharCounter(field, counterEl) {
  if (!counterEl) return;
  const max = field.getAttribute('maxlength') || 0;
  const current = field.value.length;
  counterEl.textContent = `${current} / ${max}`;
}

function maskPhone(value) {
  const digits = value.replace(/\D/g, '');
  let v = digits;

  if (!v.startsWith('61')) {
    v = '61' + v;
  }

  if (v.length <= 2) {
    return `(${v}`;
  }
  if (v.length <= 6) {
    return `(${v.slice(0, 2)}) ${v.slice(2)}`;
  }
  if (v.length <= 10) {
    return `(${v.slice(0, 2)}) ${v.slice(2, 6)}-${v.slice(6)}`;
  }
  return `(${v.slice(0, 2)}) ${v.slice(2, 7)}-${v.slice(7, 11)}`;
}

function scrollToField(field) {
  const wrapper = field.closest('.form-field') || field;
  const rect = wrapper.getBoundingClientRect();
  const offset = rect.top + window.scrollY - 120;
  window.scrollTo({ top: offset, behavior: 'smooth' });
  field.focus();
}

// LocalStorage helpers
const FORM_STORAGE_KEY = 'master_elevadores_contato';

function saveFormToStorage(fields) {
  const payload = {};
  Object.entries(fields).forEach(([key, field]) => {
    if (!field) return;
    payload[key] = field.value;
  });
  try {
    localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(payload));
  } catch (e) {
    // ignore
  }
}

function restoreFormFromStorage(fields) {
  try {
    const raw = localStorage.getItem(FORM_STORAGE_KEY);
    if (!raw) return;
    const data = JSON.parse(raw);
    Object.entries(fields).forEach(([key, field]) => {
      if (!field || data[key] == null) return;
      field.value = data[key];
    });
  } catch (e) {
    // ignore
  }
}

function clearFormStorage() {
  try {
    localStorage.removeItem(FORM_STORAGE_KEY);
  } catch (e) {
    // ignore
  }
}

// WhatsApp integration
function openWhatsAppWithMessage({ nome, mensagem }) {
  const base = 'https://wa.me/556182027189';
  const texto = [
    `Olá, meu nome é ${nome || 'cliente'}.`,
    'Encontrei a MASTER ELEVADORES pelo site.',
    '',
    mensagem
  ].join('\n');

  const url = `${base}?text=${encodeURIComponent(texto)}`;
  // Aviso simples antes de abrir
  setTimeout(() => {
    window.open(url, '_blank');
  }, 600);
}
