
before(() => {
  cy.clearCookies();
  cy.clearLocalStorage();

  // чтобы не отвлекали сторонние скрипты, которые могут запускать алерты и мешать тесту
  cy.intercept('GET', 'https://www.googletagmanager.com/**',{ statusCode: 304 }).as('getGtm')
  cy.intercept('GET', 'https://t.contentsquare.net/**',{ statusCode: 304 }).as('getContentsquare')
  cy.intercept('GET', 'https://www.gstatic.com/**',{ statusCode: 304 }).as('getGstatic')
  cy.intercept('GET', 'https://**.google-analytics.com/**',{ statusCode: 304 }).as('getGoogleAnalytics')
});


describe('XSS check on restore password forms', () => {
  const cases = [
    {
      uri: '/pages/user_restore_password',
      input: '.profile__form input[name=login]',
      xss: "'><img src=x onerror=alert(1) ",
      action: '.profile__form [type=submit]',
    },
    // add more cases here
  ];

  cases.forEach((testCase) => {
    it(`checks XSS on ${testCase.uri}`, () => {
      const alertStub = cy.stub();
      cy.on('window:alert', alertStub);

      cy.visit(testCase.uri);

      cy.get(testCase.input)
        .first()
        .clear()
        .type(testCase.xss, { force: true });

      cy.get(testCase.action).click({ force: true });

      cy.wrap(alertStub).should('not.have.been.calledWith', 1);
    });
  });
});
