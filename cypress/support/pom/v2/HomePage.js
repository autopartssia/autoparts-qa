/**
 * Home Page Object Model
 */
class HomePage {
  // Selectors
  selectors = {
    searchInput: '[placeholder="Meklēt pēc VIN, OEM, automašīnas numura, artikula numura vai nosaukuma"]',
    header: '.header__main',
    headerLogo: 'a[href="/"]',
    productFormWrapper: '.select__products-form-wrapper',
    categoriesSection: '.categories__simple-items',
    pageBlock: '.page__block',
    footerMenu: '.footer__menu-block',
    footer: 'footer',
    loginForm: '#login__form',
    
    // Select2 dropdowns
    brandSelect: '[title="Izvēlieties zīmolu"]',
    modelSelect: '[title="Izvēlieties modeli"]',
    yearSelect: '[title="Izvēlieties gadu"]',
    selectOptions: '.header__search-results-block-js',
    selectOption: '.header__search-results-item-js',
    select2Options: '.select2-results__options',
    select2Option: '.select2-results__option',
  };

  visit() {
    cy.visit('/');
    cy.wait(1000);
    // cy.injectPointer();
  }

  getSearchInput() {
    return cy.get(this.selectors.searchInput, { timeout: 15000 });
  }

  getHeaderLogo() {
    return cy.get(this.selectors.header).get(this.selectors.headerLogo);
  }

  getHeaderLink(text) {
    return cy.get(this.selectors.header).contains(text);
  }

  clickHeaderLink(text) {
    this.getHeaderLink(text).click();
  }

  getLoginForm() {
    return cy.get(this.selectors.loginForm, { timeout: 15000 });
}

  getProductFormWrapper() {
    return cy.get(this.selectors.productFormWrapper);
  }

  scrollToProductForm() {
    cy.wait(1000).get(this.selectors.productFormWrapper).scrollIntoView({ duration: 500 })
        // .movePointerIntoView(this.selectors.productFormWrapper);
  }

  getProductFormButton() {
    return this.getProductFormWrapper().contains('Atrast auto detaļas');
  }

  scrollToCategories() {
    cy.wait(1000).get(this.selectors.categoriesSection).scrollIntoView({ duration: 500 });
  }

  getCategoryItem(text) {
    return cy.get(this.selectors.categoriesSection).contains(text);
  }

  getPageBlockText(text) {
    return cy.get(this.selectors.pageBlock).contains(text);
  }

  scrollToFooter() {
    cy.wait(1000).get(this.selectors.footer).scrollIntoView({ duration: 500 });
  }

  getFooterMenuLink(text) {
    return cy.get(this.selectors.footerMenu).contains(text);
  }

  scrollToTop() {
    cy.wait(1000).scrollTo(0, 0, { duration: 500 });
  }

  // Select2 dropdown methods
  selectBrand(brand) {
    // cy.movePointerIntoView(this.selectors.brandSelect);
    cy.wait(500).get(this.selectors.brandSelect).click();
    cy.wait(1000).get(this.selectors.select2Options).scrollTo(0, 500)
      .wait(1000).scrollTo(500, 1500)
      .wait(1000).get(this.selectors.select2Option).contains(brand).click();
  }

  selectModel(model) {
    // cy.movePointerIntoView(this.selectors.modelSelect);
    cy.wait(500).get(this.selectors.modelSelect).click().click();
    cy.wait(1000).get(this.selectors.select2Options).scrollTo(0, 500)
      .wait(1000).scrollTo(500, 1000)
      .wait(1000).get(this.selectors.select2Option).contains(model).click();
  }

  selectYear(year) {
    // cy.movePointerIntoView(this.selectors.yearSelect);
    cy.wait(500).get(this.selectors.yearSelect).click().click();
    cy.wait(1000).get(this.selectors.select2Options).scrollTo(0, 500)
      .wait(1000).scrollTo(500, 1000)
      .wait(1000).get(this.selectors.select2Option).contains(year).click();
  }

  selectSearchSuggestion(suggestion) {
    cy.get(this.selectors.selectOptions).contains(suggestion).first().click();
  }

selectSearchSuggestion(suggestion) {
    cy.get(this.selectors.selectOptions).contains(suggestion).first().click();
  }

  verifyPathContains(path) {
    cy.location('pathname', { timeout: 15000 }).should('match', RegExp(path));
  }

  getPath(path) {
    cy.location('pathname', { timeout: 15000 }).should('match', RegExp(path));
  }
}

module.exports = HomePage;
