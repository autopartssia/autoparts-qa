export class Page {
    selectors = {
        link: 'a',
        button: 'button',
    }
    getLink(cy) {
        cy.get(this.selectors.link, { timeout: 15000 });
    }
    getButton(cy) {
        cy.get(this.selectors.button, { timeout: 15000 });
    }
    getLinkByText(cy, text) {
        this.getLink(cy).contains(text);
    }
    getButtonByText(cy, text) {
        this.getButton(cy).contains(text);
    }
}

module.exports = Page;