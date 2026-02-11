// cypress/support/e2e.js

// Чтобы тест не падал из-за внешней аналитики/blocked fetch.
// (Это не "обход", а защита от ложных падений, когда UI живой.)
Cypress.on('uncaught:exception', (err) => {
  const msg = err?.message || '';
  if (
    msg.includes('NetworkError when attempting to fetch resource') ||
    msg.includes('Failed to fetch') ||
    msg.includes('ResizeObserver loop limit exceeded')
  ) {
    return false;
  }
  return true;
});
