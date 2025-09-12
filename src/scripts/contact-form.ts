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
    showMessage("Sending your message...", "blue");

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
        showMessage("Thank you for your message! I'll get back to you within 24 hours.", "green");
        form.reset();
        form.classList.remove("was-validated");
      } else {
        showMessage(responseData.message || "Something went wrong!", "red");
      }
    } catch (error) {
      showMessage("Something went wrong! Please try again later.", "red");
    } finally {
      // Reset loading state
      setLoadingState(false, submitButton, originalButtonText);
      
      // Hide message after 5 seconds for success, keep error messages
      setTimeout(() => {
        const currentMessage = result.querySelector('.bg-green-100');
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
      button.innerHTML = `
        <div class="flex items-center justify-center gap-2">
          <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Sending...
        </div>
      `;
      button.classList.add('opacity-80', 'cursor-not-allowed');
    } else {
      button.disabled = false;
      button.innerHTML = originalText || 'Send Message';
      button.classList.remove('opacity-80', 'cursor-not-allowed');
    }
  }

  function showMessage(message: string, type: 'red' | 'green' | 'blue') {
    if (!result) return;
    
    const bgColor = type === 'red' ? 'bg-red-100' : type === 'green' ? 'bg-green-100' : 'bg-blue-100';
    const textColor = type === 'red' ? 'text-red-700' : type === 'green' ? 'text-green-700' : 'text-blue-700';
    
    result.innerHTML = `
      <div class="${bgColor} ${textColor} p-4 rounded-xl">
        ${message}
      </div>
    `;
    result.classList.remove('hidden');
  }
} 