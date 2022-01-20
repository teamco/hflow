import { cyan } from "colors";

describe('Landing Page', () => {
    beforeEach(() => {
        cy.visit('/');
    });

    it('Renders login page', () => {
        cy.get('.ant-tabs-nav-list').should('be.visible');
        const selectedButton = cy.get('.ant-tabs-tab-btn');
        selectedButton.first().should('have.text', 'Real Estate');
        selectedButton.eq(1).should('have.text', 'Lawyers');
        selectedButton.eq(2).should('have.text', 'Consultants');
        selectedButton.eq(3).should('have.text', 'Agents');
        selectedButton.eq(4).should('have.text', 'Banks');
    });
});
