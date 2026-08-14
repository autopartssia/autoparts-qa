import Page from './Page';

function splitByCamelCase(text) {
    return text.split(/(?=[A-Z])/);
}

export const productClassHandler = {
    get(target, prop, receiver) {
        if (
            typeof prop === 'string' &&
            prop.startsWith('getHeader') &&
            !(prop in target)
        ) {
            return () => {
                const [a,b,...rest] = splitByCamelCase(prop);
                const name = b.toLowerCase();
                return target['get' + rest.join('')](target.selectors[name]);
            };
        }

        return Reflect.get(target, prop, receiver);
    }
}

export class ProductPage extends Page {
    // Selectors
    selectors = {
        ...super.selectors,
        product: '.product__page-block',
        putToCartButton: '.products__cart-add-js',
        cartModal: '#popup__cart',
    };

    constructor(...args) {
        super(...args);

        return new Proxy(this, productClassHandler);
    }
    getPutToCartButton() {
        return cy.get(this.selectors.putToCartButton, { timeout: 15000 });
    }

    getCartModal() {
        return cy.get(this.selectors.cartModal, { timeout: 15000 });
    }

    // FIXME: Remove next:
    getProductButtonByText(text) {
        return cy.get(this.selectors.product).contains('button', text, { timeout: 15000 });
    }
    getProductLinkByText(text) {
        return cy.get(this.selectors.product).contains('a', text, { timeout: 15000 });
    }
    getCartModalButtonByText(text) {
        return cy.get(this.selectors.cartModal).contains('button', text, { timeout: 15000 });
    }
    getCartModalLinkByText(text) {
        return cy.get(this.selectors.cartModal).contains('a', text, { timeout: 15000 });
    }
}

module.exports = ProductPage;
