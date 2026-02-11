// cypress/support/commands.js

const DEFAULT_TIMEOUT = 30000;

/**
 * Надёжно открывает первую карточку товара.
 * Главное отличие: НЕ читаем body “один раз”, а ждём появления ссылок /ru/products/
 */
function openFirstProductCard() {
  // 1) ждём, пока на странице появится хотя бы одна ссылка на товар
  cy.get('a[href*="/ru/products/"]', { timeout: DEFAULT_TIMEOUT })
    .should('have.length.greaterThan', 0)
    .first()
    .scrollIntoView()
    .click({ force: true });

  cy.location('pathname', { timeout: DEFAULT_TIMEOUT }).should('include', '/ru/products/');
}

/**
 * Если вдруг сценарий через кнопку "Искать" (как раньше) — кликаем её и потом снова открываем карточку.
 */
function clickSearchIfExistsThenOpenCard() {
  cy.get('body', { timeout: DEFAULT_TIMEOUT }).then(($body) => {
    const hasSearchAction =
      $body.find('button, a, input').toArray().some((el) => {
        const t = (el.innerText || el.value || '').toLowerCase();
        return t.includes('искать');
      });

    if (hasSearchAction) {
      cy.contains(/искать/i, { timeout: DEFAULT_TIMEOUT }).first().click({ force: true });
    }
  });

  // После клика (или если не было клика) — всё равно ждём ссылку на карточку
  openFirstProductCard();
}

/**
 * cy.goToProductDetails('397014.071')
 * Мы НЕ используем UI-поиск. Только прямые URL-точки:
 * - /ru/price/<code>/ (сервер сам решает и может редиректнуть на /search_text/...)
 * После чего мы просто открываем первую карточку товара из выдачи.
 */
Cypress.Commands.add('goToProductDetails', (code) => {
  if (!code) throw new Error('goToProductDetails: code is required');

  cy.visit(`/ru/price/${encodeURIComponent(code)}/`, { failOnStatusCode: false });

  cy.location('pathname', { timeout: DEFAULT_TIMEOUT }).then((path) => {
    // если сразу карточка
    if (path.includes('/ru/products/')) return;

    // если мы на price/search_text/rubricator — ждём выдачу и открываем карточку
    // иногда нужно нажать "Искать" — попробуем, но без жёсткой зависимости
    clickSearchIfExistsThenOpenCard();
  });
});

/** Заготовки под будущие команды — пока просто открывают карточку */
Cypress.Commands.add('goToProductCompatibility', (code) => {
  cy.goToProductDetails(code);
  // TODO: перейти на вкладку "Совместимость"
});

Cypress.Commands.add('goToProductAttributes', (code) => {
  cy.goToProductDetails(code);
  // TODO: перейти на вкладку "Характеристики"
});

Cypress.Commands.add('goToProductOE', (code) => {
  cy.goToProductDetails(code);
  // TODO: перейти на вкладку "OE"
});

Cypress.Commands.add('goToCategory', (categoryPath) => {
  cy.visit(`/ru/rubricator/${String(categoryPath || '').replace(/^\//, '')}`, { failOnStatusCode: false });
});

Cypress.Commands.add('goToSearchResults', (query) => {
  cy.visit(`/ru/search_text/${encodeURIComponent(query)}/`, { failOnStatusCode: false });
});
