const {
  HomePage,
  ProductPage,
} = require('../support/pom/v2');


const DEFAULT_TIMEOUT = 1500;


// ======================================================
// BEFORE
// ======================================================

before(() => {

  cy.clearCookies();
  cy.clearLocalStorage();


  // Чтобы не отвлекали сторонние скрипты,
  // которые могут запускать алерты
  // и мешать тесту.

  cy.intercept(
    'GET',
    'https://www.googletagmanager.com/**',
    {
      statusCode: 304,
    }
  ).as('getGtm');


  cy.intercept(
    'GET',
    'https://t.contentsquare.net/**',
    {
      statusCode: 304,
    }
  ).as('getContentsquare');


  cy.intercept(
    'GET',
    'https://www.gstatic.com/**',
    {
      statusCode: 304,
    }
  ).as('getGstatic');


  cy.intercept(
    'GET',
    'https://**.google-analytics.com/**',
    {
      statusCode: 304,
    }
  ).as('getGoogleAnalytics');


  cy.intercept(
    'POST',
    'https://**.google-analytics.com/**',
    {
      statusCode: 304,
    }
  ).as('getGoogleAnalyticsRegion1');


  cy.intercept(
    'POST',
    'https://**/g/collect**',
    {
      statusCode: 304,
    }
  ).as('getGCollect');


  cy.intercept(
    'GET',
    'https://**/recaptcha**',
    {
      statusCode: 304,
    }
  ).as('getRecaptcha');

});


// ======================================================
// DEMO
// ======================================================

describe(
  'Demo',
  {
    scrollBehavior: false,
  },
  () => {


    beforeEach(() => {

      /*
       * Pointer будет создан при первом
       * followPointer().
       *
       * Поэтому здесь ничего делать не надо.
       */

    });


    // ==================================================
    // HOME
    // ==================================================

    it('Home', () => {

      const home = new HomePage();


      home.visit();


      home
        .getSearchInput()
        .should('be.visible');


      home
        .getHeaderLogo()
        .should('be.visible');


      [
        'Piegāde un saņemšana',
        'Garantija',
        'Par uzņēmumu',
        'Pircējiem',
      ].forEach((text) => {

        home
          .getHeaderLink(text)
          .should('be.visible');

      });


      // ==================================================
      // PRODUCT FORM
      // ==================================================

      home.scrollToProductForm();


      home
        .getProductFormWrapper()
        .should('be.visible');


      // ==================================================
      // CATEGORIES
      // ==================================================

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

      ].forEach((category) => {

        home
          .getCategoryItem(category)
          .should('be.visible');

      });


      [
        'Rezerves daļas un aksesuāri no vadošajiem ražotājiem',

        'Kāpēc pasūtīt detaļas no mums',

      ].forEach((text) => {

        home
          .getPageBlockText(text)
          .should('be.visible');

      });


      // ==================================================
      // FOOTER
      // ==================================================

      home.scrollToFooter();


      [
        'Klientiem',
        'Uzņēmums',
        'Katalogs',

      ].forEach((footerLink) => {

        home
          .getFooterMenuLink(footerLink)
          .should('be.visible');

      });


      home.scrollToTop();


      // ==================================================
      // DELIVERY PAGE
      // ==================================================

      const pageLinks = [
        [
          'Piegāde un saņemšana',
          'delivery',
        ],
      ];


      pageLinks.forEach(
        ([text, path]) => {

          home
            .getHeaderLink(text)
            .should('be.visible')
            .followPointer()
            .click();


          home.getPath(
            `/pages/${path}/`
          );


          cy
            .wait(DEFAULT_TIMEOUT)
            .get('.page__block')
            .contains(text)
            .should('be.visible');


          cy
            .wait(DEFAULT_TIMEOUT)
            .scrollTo(
              0,
              500,
              {
                duration: 500,
              }
            );


          home.scrollToFooter();

          home.scrollToTop();

        }
      );

    });


    // ==================================================
    // SEARCH BY AUTO
    // ==================================================

    it('Search by auto', () => {

      const home = new HomePage();


      home.visit();


      home.scrollToProductForm();


      home
        .getProductFormWrapper()
        .should('be.visible');


      /*
       * Эти методы находятся внутри POM.
       *
       * Благодаря mousemove / focus listeners
       * pointer будет также реагировать
       * на внутренние Cypress click события.
       */

      home.selectBrand('VOLVO');

      home.selectModel('B10');

      home.selectYear('2005');


      // ==================================================
      // FIND
      // ==================================================

      cy
        .wait(DEFAULT_TIMEOUT)
        .get('button')
        .contains('Atrast')
        .should('be.visible')
        .followPointer()
        .click();


      home.getPath(
        /\/rubricator\//
      );


      cy
        .get('.car__select-wrapper')
        .contains('VOLVO B10 B10')
        .should('be.visible');


      // TODO VOLVO B10 (2005)


      cy
        .wait(DEFAULT_TIMEOUT)
        .scrollTo(
          0,
          500,
          {
            duration: 500,
          }
        );


      // ==================================================
      // AIR FILTER
      // ==================================================

      cy
        .get('a')
        .contains('Gaisa filtrs')
        .should('be.visible')
        .followPointer()
        .click();


      cy
        .location(
          'pathname',
          {
            timeout: 15000,
          }
        )
        .should(
          'match',
          /\/rubricator\/rub\d+\/c\//
        );


      cy
        .wait(DEFAULT_TIMEOUT)
        .scrollTo(
          0,
          500,
          {
            duration: 500,
          }
        );


      // ==================================================
      // M-FILTER
      // ==================================================

      cy
        .get('.filters__checkbox')
        .contains('M-FILTER')
        .should('be.visible')
        .followPointer()
        .click();


      cy
        .location(
          'pathname',
          {
            timeout: 15000,
          }
        )
        .should(
          'match',
          /\/rubricator\/rub\d+\/c\/.*\/b\/\w+/
        );


      // ==================================================
      // COMPACT VIEW
      // ==================================================

      cy
        .get('.catalog__page-top')
        .contains('Kompakts skats')
        .should('be.visible')
        .followPointer()
        .click();


      cy
        .wait(DEFAULT_TIMEOUT)
        .scrollTo(
          0,
          250,
          {
            duration: 500,
          }
        );


      // ==================================================
      // PRODUCT TABS
      // ==================================================

      cy
        .wait(DEFAULT_TIMEOUT)
        .get(
          '.product__box-tabs-wrapper'
        )
        .scrollIntoView({
          duration: 500,
        });


      [
        'Analogi',

        'Raksturlielumi',

        'Piemērojamība automašīnām',

        'Oriģinālais numurs',

      ].forEach((text) => {

        cy
          .get(
            '.product__box-tabs-wrapper'
          )
          .contains(text)
          .should('be.visible')
          .followPointer({
            duration: 350,
            pause: 150,
          })
          .click();


        cy.wait(1000);

      });


      cy
        .wait(DEFAULT_TIMEOUT)
        .scrollTo(
          250,
          1000,
          {
            duration: 500,
          }
        );


      home.scrollToFooter();

      home.scrollToTop();

    });


    // ==================================================
    // LOGIN + SEARCH + CART
    // ==================================================

    it(
      'Login as registered user, search by article 2225 and add to cart',
      () => {

        const home =
          new HomePage();


        cy.visit('/');


        cy.wait(
          DEFAULT_TIMEOUT
        );


        // ==================================================
        // LOGIN MODAL
        // ==================================================

        home
          .getHeaderLink(
            'Pierakstīties'
          )
          .should('be.visible')
          .followPointer()
          .click();


        home
          .getLoginForm()
          .should('be.visible');


        // ==================================================
        // LOGIN
        // ==================================================

        cy
          .get(
            '#login__form-login'
          )
          .should('be.visible')
          .followPointer()
          .type(
            Cypress.env(
              'TEST_USER_LOGIN'
            )
          );


        // ==================================================
        // PASSWORD
        // ==================================================

        cy
          .get(
            '#login__form-password'
          )
          .should('be.visible')
          .followPointer()
          .type(
            Cypress.env(
              'TEST_USER_PASSWORD'
            ),
            {
              log: false,
            }
          );


        // ==================================================
        // LOGIN BUTTON
        // ==================================================

        cy
          .get('button')
          .contains(
            'Pieteikšanās'
          )
          .should('be.visible')
          .followPointer()
          .click();


        cy
          .wait(DEFAULT_TIMEOUT)
          .get('.header__main')
          .contains('Profils')
          .should('be.visible');


        // ==================================================
        // SEARCH 2225
        // ==================================================

        home
          .getSearchInput()
          .should('be.visible')
          .followPointer()
          .type('2225');


        cy
          .wait(DEFAULT_TIMEOUT)
          .get(
            '.header__search-results-block-js'
          )
          .should('be.visible');


        // ==================================================
        // SELECT BESCO
        // ==================================================

        cy
          .get(
            '.header__search-results-block-js'
          )
          .contains('BESCO')
          .should('be.visible')
          .followPointer()
          .click();


        // ==================================================
        // PRODUCT
        // ==================================================

        const productPage =
          new ProductPage();


        productPage
          .getPutToCartButton()
          .should('be.visible')
          .first()
          .followPointer()
          .click();


        cy.wait(
          DEFAULT_TIMEOUT
        );


        // ==================================================
        // BUY
        // ==================================================

        productPage
          .getProductButtonByText(
            'Pirkt'
          )
          .first()
          .should('be.visible')
          .followPointer()
          .click();


        // ==================================================
        // PLUS
        // ==================================================

        cy
          .get(
            productPage.selectors.plus
          )
          .first()
          .should('be.visible')
          .followPointer()
          .click();


        cy.wait(
          DEFAULT_TIMEOUT
        );


        // ==================================================
        // CONTINUE SHOPPING
        // ==================================================

        productPage
          .getCartModalButtonByText(
            'Turpināt iepirkšanos'
          )
          .first()
          .should('be.visible')
          .followPointer()
          .click();


        cy.wait(
          DEFAULT_TIMEOUT
        );


        // ==================================================
        // CART
        // ==================================================

        home
          .getHeaderLink('Grozs')
          .should('be.visible')
          .followPointer()
          .click();


        cy.wait(
          DEFAULT_TIMEOUT
        );


        productPage
          .getCartModal()
          .should('be.visible');


        productPage
          .getCartModalLinkByText(
            'Pāriet uz noformēšanu'
          )
          .first()
          .should('be.visible')
          .followPointer()
          .click();


        // ==================================================
        // CONTACT INFO
        // ==================================================

        cy
          .wait(DEFAULT_TIMEOUT)
          .get('.checkout__page')
          .contains(
            'Ievadiet kontaktinformāciju'
          )
          .should('be.visible');


        // NAME

        cy
          .get(
            '#checkout__login-name'
          )
          .should('be.visible')
          .followPointer()
          .clear()
          .type(
            'Test User'
          );


        // PHONE

        cy
          .get(
            '#checkout__login-phone'
          )
          .should('be.visible')
          .followPointer()
          .clear()
          .type(
            '1234567890'
          );


        // EMAIL

        cy
          .get(
            '#checkout__login-email'
          )
          .should('be.visible')
          .followPointer()
          .clear()
          .type(
            'example@example.com'
          );


        // CITY

        cy
          .get(
            '#checkout__login-city'
          )
          .should('be.visible')
          .followPointer()
          .clear()
          .type(
            'Rīga'
          );


        // ADDRESS

        cy
          .get(
            '#checkout__login-location'
          )
          .scrollIntoView({
            duration: 500,
          })
          .should('be.visible')
          .followPointer()
          .clear()
          .type(
            'Nīcgales iela 53c'
          );


        // COMMENT

        cy
          .get(
            '#checkout__login-comment'
          )
          .should('be.visible')
          .followPointer()
          .clear()
          .type(
            'Lūdzu, piegādājiet pēc iespējas ātrāk.'
          );


        // ==================================================
        // DELIVERY METHOD BUTTON
        // ==================================================

        cy
          .get(
            'button.checkout__page-step-form-submit-js'
          )
          .contains(
            'Pāriet uz piegādes veidu'
          )
          .should('be.visible')
          .followPointer()
          .click();


        // ==================================================
        // DELIVERY
        // ==================================================

        cy.scrollTo(
          0,
          0,
          {
            duration: 500,
          }
        );


        cy
          .wait(DEFAULT_TIMEOUT)
          .get('.checkout__page')
          .contains(
            'Piegādes metode'
          )
          .should('be.visible');


        // ==================================================
        // PICKUP
        // ==================================================

        cy
          .get('div')
          .contains(
            'Pašizvešana'
          )
          .should('be.visible')
          .first()
          .followPointer()
          .click();


        cy.scrollTo(
          0,
          500,
          {
            duration: 500,
          }
        );


        // ==================================================
        // PAYMENT STEP
        // ==================================================

        cy
          .wait(DEFAULT_TIMEOUT)
          .get(
            'button.checkout__page-step-form-submit-js'
          )
          .contains(
            'Pāriet uz maksājuma metodi'
          )
          .should('be.visible')
          .first()
          .followPointer()
          .click();


        // ==================================================
        // PAYMENT
        // ==================================================

        cy.scrollTo(
          0,
          100,
          {
            duration: 500,
          }
        );


        cy
          .wait(DEFAULT_TIMEOUT)
          .get('.checkout__page')
          .contains(
            'Maksājuma veids'
          )
          .should('be.visible');


        // ==================================================
        // PAY IN STORE
        // ==================================================

        cy
          .get('div')
          .contains(
            'Saņemot preci veikalā'
          )
          .should('be.visible')
          .first()
          .followPointer()
          .click();


        cy.scrollTo(
          0,
          0,
          {
            duration: 500,
          }
        );


        // ==================================================
        // FINAL BUTTON
        // ==================================================

        cy
          .wait(
            DEFAULT_TIMEOUT * 2
          )
          .get(
            '.checkout__page-form-submit-js'
          )
          .scrollIntoView({
            duration: 500,
          })
          .contains(
            'Pāriet uz noformēšanu'
          )
          .first()
          .should('be.visible')
          .followPointer({
            duration: 450,
            pause: 250,
          })
          .click();


        // ==================================================
        // FINISH
        // ==================================================

        cy
          .location(
            'pathname',
            {
              timeout: 15000,
            }
          )
          .should(
            'match',
            /\/pages\/cart_payment_end\//
          );


        cy.wait(
          DEFAULT_TIMEOUT * 3
        );

      }
    );

  }
);
