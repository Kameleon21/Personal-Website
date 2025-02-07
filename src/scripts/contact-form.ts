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
      } else {
        showMessage(responseData.message || "Something went wrong!", "red");
      }
    } catch (error) {
      showMessage("Something went wrong! Please try again later.", "red");
    } finally {
      form.reset();
      form.classList.remove("was-validated");
      
      // Reset to default tab and hide message after 5 seconds
      setTimeout(() => {
        result.classList.add('hidden');
        tabs[0]?.click();
      }, 5000);
    }
  });

  function showMessage(message: string, type: 'red' | 'green' | 'blue') {
    if (!result) return;
    
    result.innerHTML = `
      <div class="bg-${type}-100 text-${type}-700 p-4 rounded-xl">
        ${message}
      </div>
    `;
    result.classList.remove('hidden');
  }
} 