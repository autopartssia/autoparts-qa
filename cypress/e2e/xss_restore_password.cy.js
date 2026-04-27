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
