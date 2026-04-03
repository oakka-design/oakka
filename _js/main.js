import Splide from '@splidejs/splide';

document.addEventListener('DOMContentLoaded', async () => {
  const { pathname } = window.location;
  if (pathname === '/') {
    new Splide('#image-carousel', {
      heightRatio: 0.5,
      type: 'fade',
      rewind: true,
    }).mount();
  } else if (pathname === '/portfolio.html') {
    const imageCarousel = new Splide('#image-carousel', {
      heightRatio: 0.5,
      type: 'fade',
      rewind: true,
    });
    const thumbnailCarousel = new Splide('#thumbnail-carousel', {
      fixedWidth: 100,
      fixedHeight: 60,
      gap: 10,
      rewind: true,
      pagination: false,
      isNavigation: true,
      arrows: false,
      breakpoints: {
        600: {
          fixedWidth: 73,
          fixedHeight: 44,
        },
      },
    });
    imageCarousel.sync(thumbnailCarousel);
    imageCarousel.mount();
    thumbnailCarousel.mount();
  } else if (pathname === '/contact.html') {
    const sendEmail = (body) =>
      fetch('https://formsubmit.co/ajax/hello@oakkadesign.co.uk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(body),
      });

    const elTextInputs = document.querySelectorAll('.js-text-input');
    elTextInputs.forEach((input) => {
      input.addEventListener('focus', () =>
        input.parentElement.classList.add('input-field--active'),
      );
      input.addEventListener('blur', () => {
        if (!input.value)
          input.parentElement.classList.remove('input-field--active');
      });
    });

    const elSendBtn = document.querySelector('.js-send-btn');
    elSendBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      const elForm = document.querySelector('.js-contact-form');
      const elRequiredInputs = document.querySelectorAll('.js-required-input');
      const elEmailInput = document.querySelector('input[name="email"]');
      const elErrors = document.querySelectorAll('.js-input-error');
      const elEmailReceivedMessage = document.querySelector(
        '#js-email-received-message',
      );

      if (elEmailReceivedMessage) elEmailReceivedMessage.remove();
      elErrors.forEach((error) => error.remove());

      let errors = {};
      if (!/.+@.+/.test(elEmailInput.value)) {
        errors.email = {
          text: 'Please enter a valid email',
          input: elEmailInput,
        };
      }
      elRequiredInputs.forEach((input) => {
        if (!input.value) {
          errors[input.name] = {
            text: 'Please fill out the required field',
            input,
          };
        }
      });

      const errorNames = Object.keys(errors);
      if (errorNames.length === 0) {
        const formData = new FormData(elForm);
        const res = await sendEmail(Object.fromEntries(formData.entries()));
        elForm.insertAdjacentHTML(
          'beforeend',
          `
					<p id="js-email-received-message" class="mt-16 text-xl text-center">Thank you for your email</p>
          `,
        );
      } else {
        errorNames.forEach((name) =>
          errors[name].input.insertAdjacentHTML(
            'afterend',
            `<span class="input-field__error js-input-error">${errors[name].text}</span>`,
          ),
        );
      }
    });
  }
});
