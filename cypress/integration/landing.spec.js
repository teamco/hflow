import { cyan } from "colors";

describe('Landing Page', () => {
    beforeEach(() => {
        cy.visit('/');
    });

    it('Renders login page', () => {
        cy.wait(5000);
        cy.get('.ant-tabs-nav-list').should('be.visible');
        cy.get('.ant-tabs-tab-btn').first().should('have.text', 'Real Estate');
        cy.get('.ant-tabs-tab-btn').eq(1).should('have.text', 'Lawyers');
        cy.get('.ant-tabs-tab-btn').eq(2).should('have.text', 'Consultants');
        cy.get('.ant-tabs-tab-btn').eq(3).should('have.text', 'Agents');
        cy.get('.ant-tabs-tab-btn').eq(4).should('have.text', 'Banks');
    });
});