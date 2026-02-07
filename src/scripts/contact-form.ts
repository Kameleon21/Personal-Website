interface FormElements extends HTMLFormControlsCollection {
  name: HTMLInputElement;
  email: HTMLInputElement;
  message: HTMLTextAreaElement;
  botcheck: HTMLInputElement;
}

interface ContactForm extends HTMLFormElement {
  elements: FormElements;
}

export function initContactForm() {
  const tabs = document.querySelectorAll<HTMLButtonElement>('.contact-tab');
  const form = document.getElementById("contact-form") as ContactForm;
  const result = document.getElementById("form-result");

  if (!form || !result) return;

  // Handle tab switching
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const tabType = tab.getAttribute('data-tab');
      const placeholder = tabType === 'get-in-touch'
        ? "I'd like to discuss..."
        : "I have a project that I'd like to discuss. Here are some details...";

      form.elements.message.placeholder = placeholder;
    });
  });

  // Form submission handler
  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    form.classList.add("was-validated");

    if (!form.checkValidity()) {
      const firstInvalid = form.querySelector<HTMLElement>(":invalid");
      firstInvalid?.focus();
      return;
    }

    const formData = new FormData(form);
    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    const submitButton = form.querySelector<HTMLButtonElement>('button[type="submit"]');
    const originalButtonText = submitButton?.innerHTML || 'Send Message';

    // Show loading state
    setLoadingState(true, submitButton);
    showMessage("Sending your message...", "info");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: json,
      });

      const responseData = await response.json();

      if (response.status === 200) {
        showMessage("Thank you for your message! I'll get back to you within 24 hours.", "success");
        form.reset();
        form.classList.remove("was-validated");
      } else {
        showMessage(responseData.message || "Something went wrong!", "error");
      }
    } catch (error) {
      showMessage("Something went wrong! Please try again later.", "error");
    } finally {
      // Reset loading state
      setLoadingState(false, submitButton, originalButtonText);

      // Hide message after 5 seconds for success
      setTimeout(() => {
        const currentMessage = result.querySelector('.msg-success');
        if (currentMessage) {
          result.classList.add('hidden');
          tabs[0]?.click();
        }
      }, 5000);
    }
  });

  function setLoadingState(loading: boolean, button: HTMLButtonElement | null, originalText?: string) {
    if (!button) return;

    if (loading) {
      button.disabled = true;
      button.innerHTML = 'Sending...';
      button.classList.add('opacity-60', 'cursor-not-allowed');
    } else {
      button.disabled = false;
      button.innerHTML = originalText || 'Send Message';
      button.classList.remove('opacity-60', 'cursor-not-allowed');
    }
  }

  function showMessage(message: string, type: 'error' | 'success' | 'info') {
    if (!result) return;

    const borderColor = type === 'error' ? 'border-brutal-red' : type === 'success' ? 'border-brutal-red' : 'border-brutal-rule';
    const textColor = type === 'error' ? 'text-brutal-red' : type === 'success' ? 'text-brutal-red' : 'text-brutal-grey';
    const msgClass = type === 'success' ? 'msg-success' : '';

    result.innerHTML = `
      <div class="border ${borderColor} ${textColor} ${msgClass} p-4 text-xs uppercase tracking-widest">
        ${message}
      </div>
    `;
    result.classList.remove('hidden');
  }
}
