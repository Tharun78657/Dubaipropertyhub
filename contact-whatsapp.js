const whatsappNumber = '919985585558';

document.querySelectorAll('[data-whatsapp-enquiry]').forEach((form) => {
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const fields = Array.from(form.elements)
      .filter((field) => field.name && field.value.trim())
      .map((field) => {
        const label = field.labels?.[0]?.textContent.replace(/\s*\(Optional\)\s*/i, '').trim()
          || (field.name === 'project' ? 'Project' : field.name);
        const value = field instanceof HTMLSelectElement
          ? field.selectedOptions[0]?.textContent.trim()
          : field.value.trim();
        return `${label}: ${value}`;
      });

    const message = `New enquiry from Dubai Property Hub\n\n${fields.join('\n')}`;
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    const whatsappWindow = window.open(whatsappUrl, '_blank');

    if (whatsappWindow) {
      whatsappWindow.opener = null;
    } else {
      window.location.assign(whatsappUrl);
    }
  });
});
