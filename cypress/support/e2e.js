require('./commands');

Cypress.on('uncaught:exception', (err) => {
  const msg = err?.message || '';

  // Шум от сторонних/встроенных скриптов сайта (не относящийся к тесту)
  if (
    msg.includes('Timeout (u)') ||
    msg.includes('NetworkError when attempting to fetch resource') ||
    msg.includes('Failed to fetch') ||
    msg.includes('ResizeObserver loop limit exceeded')
  ) {
    return false;
  }

  return true;
});
