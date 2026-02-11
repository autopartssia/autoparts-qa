// cypress/e2e/analogs_base_code.cy.js

const DELAY_MS = 700; // как просили — просто задержка перед каждым тестом

const ANALOG_CODES = ['397014.045', '397014.041', '397014.045'];
const NON_ANALOG_CODES = ['313016.003', '397010.035'];

function readBaseCode() {
  return cy
    .contains(/базов(ый|ого)\s+код/i, { timeout: 20000 })
    .should('be.visible')
    .then(($label) => {
      const $row = $label.closest('tr');
      if ($row && $row.length) {
        const tds = $row.find('td');
        if (tds.length >= 2) {
          const val = Cypress.$(tds[1]).text().trim();
          if (val) return val;
        }
      }

      const $container = $label.closest('div, li, p, dt, dd, td');
      const containerText = ($container.text() || '').trim();
      const m = containerText.match(/базов(ый|ого)\s+код\s*[:\-]?\s*([A-Z0-9_.\-\/ ]{2,})/i);
      if (m && m[2]) return m[2].trim();

      const nextText = ($label.next().text() || '').trim();
      if (nextText) return nextText;

      throw new Error('Не удалось прочитать "Базовый код" на карточке');
    });
}

function assertAnalogsBlockContains(shouldContainCodes = [], shouldNotContainCodes = []) {
  cy.contains(/аналог/i, { timeout: 20000 })
    .should('be.visible')
    .then(($title) => {
      const $section = $title.closest('section, div, article');
      if (!$section || !$section.length) throw new Error('Не смог определить контейнер блока "Аналоги"');

      const sectionText = ($section.text() || '').replace(/\s+/g, ' ');

      shouldContainCodes.forEach((code) => {
        expect(sectionText, `В аналогах должен быть код ${code}`).to.include(code);
      });

      shouldNotContainCodes.forEach((code) => {
        expect(sectionText, `В аналогах НЕ должен быть код ${code}`).to.not.include(code);
      });
    });
}

describe('Аналоги по базовому коду (упрощённый)', () => {
  beforeEach(() => {
    cy.wait(DELAY_MS);
  });

  it('397014.* — аналоги между собой; 313016.003 и 397010.035 — не аналоги и базовый код другой', () => {
    const pivot = ANALOG_CODES[0];

    cy.goToProductDetails(pivot);
    readBaseCode().then((pivotBaseCode) => {
      // 1) Проверяем блок аналогов у pivot
      assertAnalogsBlockContains(
        ANALOG_CODES.filter((c) => c !== pivot),
        NON_ANALOG_CODES
      );

      // 2) Аналоги: базовый код совпадает
      ANALOG_CODES.filter((c) => c !== pivot).forEach((code) => {
        cy.goToProductDetails(code);
        readBaseCode().then((baseCode) => {
          expect(String(baseCode).toLowerCase(), `Базовый код аналога ${code} должен совпадать`).to.eq(
            String(pivotBaseCode).toLowerCase()
          );
        });
      });

      // 3) Не аналоги: базовый код отличается
      NON_ANALOG_CODES.forEach((code) => {
        cy.goToProductDetails(code);
        readBaseCode().then((baseCode) => {
          expect(String(baseCode).toLowerCase(), `Базовый код НЕ-аналога ${code} должен отличаться`).to.not.eq(
            String(pivotBaseCode).toLowerCase()
          );
        });
      });
    });
  });
});
