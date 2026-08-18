const { HomePage, ProductPage } = require('../support/pom/v2');
const DEFAULT_TIMEOUT = 1500;

before(() => {
  cy.clearCookies();
  cy.clearLocalStorage();

  // чтобы не отвлекали сторонние скрипты, которые могут запускать алерты и мешать тесту
  cy.intercept('GET', 'https://www.googletagmanager.com/**', { statusCode: 304 }).as('getGtm')
  cy.intercept('GET', 'https://t.contentsquare.net/**', { statusCode: 304 }).as('getContentsquare')
  cy.intercept('GET', 'https://www.gstatic.com/**', { statusCode: 304 }).as('getGstatic')
  cy.intercept('GET', 'https://**.google-analytics.com/**', { statusCode: 304 }).as('getGoogleAnalytics')
  cy.intercept('POST', 'https://**.google-analytics.com/**', { statusCode: 304 }).as('getGoogleAnalyticsRegion1')
  cy.intercept('POST', 'https://**/g/collect**', { statusCode: 304 }).as('getGCollect')
  cy.intercept('GET', 'https://**/recaptcha**', { statusCode: 304 }).as('getRecaptcha')

});

describe('Demo', { scrollBehavior: false }, () => {
  beforeEach(() => {
  });


  it('Home', () => {
    const home = new HomePage();

    home.visit();
    home.getSearchInput().should('be.visible');
    home.getHeaderLogo().should('be.visible');

    [
      'Piegāde un saņemšana',
      'Garantija',
      'Par uzņēmumu',
      'Pircējiem',
    ].forEach((text) => {
      home.getHeaderLink(text).should('be.visible');
    });

    home.scrollToProductForm();
    home.getProductFormWrapper().should('be.visible');

    home.scrollToCategories();
    [
      'Rezerves daļas TO',
      'Dzinējs un izplūdes sistēma',
      'Pārnesumkārba',
      'Piekare un stūres sistēma',
      'Bremžu sistēma',
      'Degvielas sistēma un dzinēja vadība',
      'Dzesēšana un Apkure',
      'Elektrība un apgaismojums',
    ].forEach(category => {
      home.getCategoryItem(category).should('be.visible');
    });

    [
      'Rezerves daļas un aksesuāri no vadošajiem ražotājiem',
      'Kāpēc pasūtīt detaļas no mums'
    ].forEach(text => {
      home.getPageBlockText(text).should('be.visible');
    });

    home.scrollToFooter();
    [
      'Klientiem',
      'Uzņēmums',
      'Katalogs',
    ].forEach((footerLink) => {
      home.getFooterMenuLink(footerLink).should('be.visible');
    });

    home.scrollToTop();

    const pageLinks = [
      ['Piegāde un saņemšana', 'delivery'],
    ];
    pageLinks.forEach(([text, path]) => {
      home.clickHeaderLink(text);
      home.getPath(`/pages/${path}/`);
      cy.wait(DEFAULT_TIMEOUT).get('.page__block').contains(text).should('be.visible');
      cy.wait(DEFAULT_TIMEOUT).scrollTo(0, 500, { duration: 500 });
      home.scrollToFooter();
      home.scrollToTop();
    });
  })


  it('Search by auto', () => {
    const home = new HomePage();

    home.visit();
    home.scrollToProductForm();
    home.getProductFormWrapper().should('be.visible');

    home.selectBrand('VOLVO');
    home.selectModel('B10');
    home.selectYear('2005');

    cy.wait(DEFAULT_TIMEOUT).get('button').contains('Atrast').click();
    home.getPath(/\/rubricator\//);

    cy.get('.car__select-wrapper').contains('VOLVO B10 B10').should('be.visible'); // TODO VOLVO B10 (2005)

    cy.wait(DEFAULT_TIMEOUT).scrollTo(0, 500, { duration: 500 });

    cy.get('a').contains('Gaisa filtrs').click();
    cy.location('pathname', { timeout: 15000 })
      .should('match', /\/rubricator\/rub\d+\/c\//);

    cy.wait(DEFAULT_TIMEOUT).scrollTo(0, 500, { duration: 500 });

    cy.get('.filters__checkbox').contains('M-FILTER').click();
    cy.location('pathname', { timeout: 15000 })
      .should('match', /\/rubricator\/rub\d+\/c\/.*\/b\/\w+/);

    cy.get('.catalog__page-top').contains('Kompakts skats').click();

    cy.wait(DEFAULT_TIMEOUT).scrollTo(0, 250, { duration: 500 });

    cy.wait(DEFAULT_TIMEOUT).get('.product__box-tabs-wrapper').scrollIntoView({ duration: 500 });
    [
      'Analogi',
      'Raksturlielumi',
      'Piemērojamība automašīnām',
      'Oriģinālais numurs',
    ].map((text) => {
      cy.get('.product__box-tabs-wrapper').contains(text).should('be.visible').click().wait(1000);
    });


    cy.wait(DEFAULT_TIMEOUT).scrollTo(250, 1000, { duration: 500 });
    home.scrollToFooter();
    home.scrollToTop();
  });

  it('Login as registered user, search by article 2225 and add to cart', () => {
    const home = new HomePage();

    cy.visit('/');
    cy.wait(DEFAULT_TIMEOUT);

    home.getHeaderLink('Pierakstīties').should('be.visible').click();
    home.getLoginForm().should('be.visible');
    cy.get('#login__form-login').type(Cypress.env('TEST_USER_LOGIN'));
    cy.get('#login__form-password').type(Cypress.env('TEST_USER_PASSWORD'));
    cy.get('button').contains('Pieteikšanās').click();
    cy.wait(DEFAULT_TIMEOUT).get('.header__main').contains('Profils').should('be.visible');

    // home.getSearchInput().type('4964');
    // cy.wait(DEFAULT_TIMEOUT).get('.header__search-results-block-js').should('be.visible');
    // home.selectSearchSuggestion('60L');
    home.getSearchInput().type('2225');
    cy.wait(DEFAULT_TIMEOUT).get('.header__search-results-block-js').should('be.visible');
    home.selectSearchSuggestion('BESCO');

    const productPage = new ProductPage();
    productPage.getPutToCartButton().should('be.visible').first().click();
    cy.wait(DEFAULT_TIMEOUT)
    productPage.getProductButtonByText('Pirkt').first().should('be.visible').click(); // 'Pievienot grozam'
    cy.get(productPage.selectors.plus).first().click();
    cy.wait(DEFAULT_TIMEOUT);

    productPage.getCartModalButtonByText('Turpināt iepirkšanos').first().should('be.visible').click();
    cy.wait(DEFAULT_TIMEOUT);

    home.getHeaderLink('Grozs').should('be.visible').click();
    cy.wait(DEFAULT_TIMEOUT);

    productPage.getCartModal().should('be.visible');
    productPage.getCartModalLinkByText('Pāriet uz noformēšanu').first().should('be.visible').click();


    cy.wait(DEFAULT_TIMEOUT).get('.checkout__page').contains('Ievadiet kontaktinformāciju').should('be.visible');
    cy.get('#checkout__login-name').clear().type('Test User');
    cy.get('#checkout__login-phone').clear().type('1234567890');
    cy.get('#checkout__login-email').clear().type('example@example.com');
    cy.get('#checkout__login-city').clear().type('Rīga');
    cy.get('#checkout__login-location').scrollIntoView().clear().type('Nīcgales iela 53c');
    cy.get('#checkout__login-comment').clear().type('Lūdzu, piegādājiet pēc iespējas ātrāk.');
    cy.get('button.checkout__page-step-form-submit-js').contains('Pāriet uz piegādes veidu').click();

    cy.scrollTo(0, 0, { duration: 500 });
    cy.wait(DEFAULT_TIMEOUT).get('.checkout__page').contains('Piegādes metode').should('be.visible');
    cy.get('div').contains('Pašizvešana').should('be.visible').first().click();
    cy.scrollTo(0, 500, { duration: 500 });
    cy.wait(DEFAULT_TIMEOUT).get('button.checkout__page-step-form-submit-js').contains('Pāriet uz maksājuma metodi').should('be.visible').first().click();

    cy.scrollTo(0, 100, { duration: 500 });
    cy.wait(DEFAULT_TIMEOUT).get('.checkout__page').contains('Maksājuma veids').should('be.visible');
    cy.get('div').contains('Saņemot preci veikalā').should('be.visible').first().click();
    cy.scrollTo(0, 0, { duration: 500 });
    cy.wait(DEFAULT_TIMEOUT * 2).get('.checkout__page-form-submit-js').scrollIntoView().contains('Pāriet uz noformēšanu').first().click();

    cy.location('pathname', { timeout: 15000 })
      .should('match', /\/pages\/cart_payment_end\//);

    cy.wait(DEFAULT_TIMEOUT * 3);

  })
});
