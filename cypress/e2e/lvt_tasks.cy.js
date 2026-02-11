const ITEMS = [
  { name: 'SAUER s0572924610', query: 's0572924610', brand: 'SAUER' },
  { name: 'DINEX 80330', query: '80330', brand: 'DINEX' },
  { name: 'SAMPA 114212', query: '114212', brand: 'SAMPA' },
];

function visitRu() {
  cy.visit('/ru/');
  cy.get('.search__input_js', { timeout: 20000 }).should('be.visible');
}

function doSearch(query) {
  cy.get('.search__input_js').clear().type(`${query}{enter}`);
  cy.location('pathname', { timeout: 20000 })
    .should('match', /\/ru\/(price|products|search_text|rubricator)\//);
}

function logWhere(label) {
  cy.location('href').then((href) => cy.log(`${label}: ${href}`));
}

/**
 * Дойти до карточки /ru/products/...
 * Учитывает:
 * - /ru/price/<code>/ (выбор бренда)
 * - страницы результатов с кнопками "Искать >>"
 * - страницы результатов с кликабельным кодом
 * - прямые ссылки /ru/products/
 */
function goToProductCard({ brand, code }) {
  const MAX_STEPS = 10;

  function step(n) {
    if (n > MAX_STEPS) {
      throw new Error(`Не удалось дойти до карточки товара за ${MAX_STEPS} шагов`);
    }

    logWhere(`step ${n}`);

    cy.location('pathname').then((path) => {
      // уже карточка
      if (path.includes('/ru/products/')) return;

      cy.get('body').then(($body) => {
        const bodyText = ($body.text() || '').toLowerCase();

        // 1) Если есть таблица брендов/прайса (как у тебя на /price/114212/)
        // Ищем строку с брендом и "Искать"
        const hasBrandRow =
          $body.find('tr').toArray().some((tr) => (tr.innerText || '').toLowerCase().includes(brand.toLowerCase()));

        if (hasBrandRow) {
          cy.contains('tr', new RegExp(brand, 'i'), { timeout: 20000 })
            .should('be.visible')
            .within(() => {
              // "Искать >>" может быть разным текстом
              cy.contains(/искать/i).click();
            });

          cy.location('pathname', { timeout: 20000 }).should('not.include', '/ru/price/');
          return step(n + 1);
        }

        // 2) Иногда нет tr, но есть кнопки/ссылки "Искать >>" на странице
        // Тогда кликаем первую "Искать"
        if (bodyText.includes('искать')) {
          cy.contains(/искать/i, { timeout: 20000 }).first().click();
          cy.location('pathname', { timeout: 20000 })
            .should('match', /\/ru\/(price|products|search_text|rubricator)\//);
          return step(n + 1);
        }

        // 3) Страница результатов "Искать код": пытаемся кликнуть по коду (часто зелёная ссылка)
        const hasCodeAsLink =
          $body.find('a').toArray().some((a) => (a.innerText || '').toLowerCase().includes(code.toLowerCase()));

        if (hasCodeAsLink) {
          cy.contains('a', new RegExp(code, 'i'), { timeout: 20000 })
            .should('be.visible')
            .click();

          cy.location('pathname', { timeout: 20000 }).should('include', '/ru/products/');
          return;
        }

        // 4) Fallback: прямые ссылки на /ru/products/
        const hasProductsLinks = $body.find('a[href*="/ru/products/"]').length > 0;
        if (hasProductsLinks) {
          cy.get('a[href*="/ru/products/"]', { timeout: 20000 }).first().click();
          cy.location('pathname', { timeout: 20000 }).should('include', '/ru/products/');
          return;
        }

        // Если ничего не нашли — падаем с понятной ошибкой
        throw new Error(`Не нашли, куда кликнуть, чтобы открыть карточку. path=${path}`);
      });
    });
  }

  step(1);
}

describe('LVT задачи: SAUER / DINEX / SAMPA — дойти до карточки', () => {
  beforeEach(() => {
    visitRu();
  });

  ITEMS.forEach((item) => {
    it(`${item.name} — дойти до карточки`, () => {
      doSearch(item.query);
      goToProductCard({ brand: item.brand, code: item.query });

      cy.location('pathname', { timeout: 20000 }).should('include', '/ru/products/');
      cy.contains(new RegExp(item.query, 'i')).should('exist');
    });
  });
});
