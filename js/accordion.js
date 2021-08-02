const addSectionToggleCapability = () => {
  const HEADERS_SELECTOR = '.accordion > section > header';

  const toggleOpenAttr = (element) => {
    const newOpenState = element.dataset.open === 'true' ? false : true;
    element.dataset.open = newOpenState;
    return newOpenState;
  };

  const toggleContainingSection = (header) => {
    const section = header.parentElement;
    const openState = toggleOpenAttr(section);
    openState ? openSection(section) : closeSection(section);
  };

  const openSection = (section) => {
    const naturalHeight = section.scrollHeight;
    section.style.height = `${naturalHeight}px`;

    const listenTransitionendEvent = (_) => {
      section.style.height = 'auto';
      section.removeEventListener('transitionend', listenTransitionendEvent);
    };
    section.addEventListener('transitionend', listenTransitionendEvent);
  };

  const closeSection = (section) => {
    const naturalHeight = section.scrollHeight;
    const closedHeight = calculateClosedHeight(section);

    section.style.transition = '';
    requestAnimationFrame(() => {
      section.style.transition = null;

      section.style.height = `${naturalHeight}px`;
      requestAnimationFrame(() => (section.style.height = closedHeight));
    });
  };

  const calculateClosedHeight = (section) => {
    const sectionStyle = getComputedStyle(section);
    const paddingTop = Number.parseInt(sectionStyle.paddingTop);
    const paddingBottom = Number.parseInt(sectionStyle.paddingBottom);
    const headerHeight = section.children[0].scrollHeight;
    return `${paddingTop + headerHeight + paddingBottom}px`;
  };

  document.querySelectorAll(HEADERS_SELECTOR).forEach((header) => {
    const keyPressWasEnterOrSpace = (event) => event.which === 13 || event.which === 32;

    header.addEventListener('click', (_) => toggleContainingSection(header));
    header.addEventListener('keypress', (event) => {
      if (keyPressWasEnterOrSpace(event)) {
        toggleContainingSection(header);
      }
    });
  });
};

const bootstrapAccordion = () => {
  addSectionToggleCapability();
};

bootstrapAccordion();
