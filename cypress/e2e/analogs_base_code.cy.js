// cypress/e2e/analogs_base_code.cy.js

const DELAY_MS = 700;

const ANALOG_CODES = ['364013.072', '364013.128', '364013.106'];
const NON_ANALOG_CODES = ['313016.003', '397010.035'];

/**
 * "Базовый код" по правилу: всё до первой точки.
 * 364013.072 -> 364013
 * Если формат вдруг без точки — вернём всё целиком.
 */
function baseOf(code) {
  const s = String(code).trim();
  const idx = s.indexOf('.');
  return idx === -1 ? s : s.slice(0, idx);
}

/**
 * Проверяем блок "Аналоги" (если он на странице есть):
 * - должен содержать коды аналогов (тексты)
 * - НЕ должен содержать коды не-аналогов
 */
function assertAnalogsBlockContains(shouldContainCodes = [], shouldNotContainCodes = []) {
  // Находим заголовок "Аналоги"
  cy.contains(/^Аналоги$/i, { timeout: 20000 })
    .should('be.visible')
    .then(($h) => {
      // Берём самый близкий общий контейнер секции (строго один элемент)
      const $section = $h.closest('section');
      const $root = $section.length ? $section : $h.parent();

      cy.wrap($root).within(() => {
        // Внутри секции ищем карточки (коды лежат в span внутри card)
        cy.get('.card span', { timeout: 20000 }).then(($spans) => {
          const codes = [...$spans]
            .map((el) => (el.innerText || '').trim())
            .filter((t) => /^\d+\.\d+$/.test(t));

          const uniqCodes = Array.from(new Set(codes));

          cy.log(`Analogs codes: ${uniqCodes.join(', ')}`);

          shouldContainCodes.forEach((code) => {
            expect(uniqCodes, `В аналогах должен быть код ${code}`).to.include(code);
          });

          shouldNotContainCodes.forEach((code) => {
            expect(uniqCodes, `В аналогах НЕ должен быть код ${code}`).to.not.include(code);
          });
        });
      });
    });
}




describe('Аналоги по базовому коду (упрощённый, без UI-поля)', () => {
  beforeEach(() => {
    cy.wait(DELAY_MS);
  });

  it('Аналоги имеют одинаковую "базу" (до точки), не-аналоги — другую; плюс проверка блока "Аналоги"', () => {
    const pivot = ANALOG_CODES[0];
    const pivotBase = baseOf(pivot);

    // 0) Быстрая sanity-проверка данных
    ANALOG_CODES.forEach((c) => {
      expect(baseOf(c), `Ожидаю одинаковую базу у аналога ${c}`).to.eq(pivotBase);
    });
    NON_ANALOG_CODES.forEach((c) => {
      expect(baseOf(c), `Ожидаю другую базу у не-аналога ${c}`).to.not.eq(pivotBase);
    });

    // 1) Открываем pivot
    cy.goToProductDetails(pivot);

    // 2) Проверяем, что в блоке "Аналоги" есть остальные аналоги и нет не-аналогов
    assertAnalogsBlockContains(
      ANALOG_CODES.filter((c) => c !== pivot),
      NON_ANALOG_CODES
    );

    // 3) (опционально) можно дополнительно убедиться, что страницы аналогов вообще открываются
    ANALOG_CODES.filter((c) => c !== pivot).forEach((code) => {
      cy.goToProductDetails(code);
      cy.location('pathname').should('include', '/ru/products/');
    });

    NON_ANALOG_CODES.forEach((code) => {
      cy.goToProductDetails(code);
      cy.location('pathname').should('include', '/ru/products/');
    });
  });
});
