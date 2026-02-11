describe('Autoparts — поиск (RU)', () => {
  beforeEach(() => {
    cy.visit('/ru/');
    cy.get('.search__input_js', { timeout: 15000 }).should('be.visible');
  });

  it('заход на домен', () => {
    cy.location('pathname').should('eq', '/ru/');
  });

  it('поиск по артикулу/коду', () => {
    const q = 'c2513';

    cy.get('.search__input_js').clear().type(`${q}{enter}`);

    // по артикулу бывает /price или сразу /products
    cy.location('pathname', { timeout: 15000 })
      .should('match', /\/ru\/(price|products)\//);
  });

  it('поиск по тексту', () => {
    const q = 'mann';

    cy.get('.search__input_js').clear().type(`${q}{enter}`);

    // текстовый поиск ведёт на /search_text/<q>/
    cy.location('pathname', { timeout: 15000 })
      .should('match', /\/ru\/(search_text|price|products)\//);

    // доп.проверка, что запрос реально попал в URL (стабильно)
    cy.location('pathname').should('include', `/${q}`);
  });

  it('переход через историю поиска (как автокомплит)', () => {
    cy.get('.search__input_js').clear().type('c25');

    cy.get('.search__history-item_js', { timeout: 15000 })
  .should('have.length.greaterThan', 0);

cy.get('.search__history-item_js')
  .eq(0)
  .click();


    cy.location('pathname', { timeout: 15000 })
  .should('match', /\/ru\/(products|price|search_text|rubricator)\//);

  });
});
