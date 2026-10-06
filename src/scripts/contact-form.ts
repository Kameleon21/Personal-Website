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
  const form = document.getElementById("contact-form") as ContactForm;
  const result = document.getElementById("form-result");

  if (!form || !result) return;

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

    const borderColor = type === 'error' ? 'border-accent' : type === 'success' ? 'border-ghgreen' : 'border-dot';
    const textColor = type === 'error' ? 'text-accent' : type === 'success' ? 'text-ghgreen' : 'text-muted';
    const msgClass = type === 'success' ? 'msg-success' : '';

    const box = document.createElement('div');
    box.className = ['border-2', borderColor, textColor, msgClass, 'p-4 font-mono text-xs rounded-lg bg-white']
      .filter(Boolean)
      .join(' ');
    box.textContent = message;
    result.replaceChildren(box);
    result.classList.remove('hidden');
  }
}
