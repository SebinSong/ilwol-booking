const toolbarMenuList = [
  {
    id: 'home',
    linkTo: '/',
    name: '홈',
  },
  {
    id: 'inquiry',
    linkTo: '/inquiry',
    name: '문의',
  },
  {
    id: 'booking',
    linkTo: '/booking/counsel-option',
    name: '예약',
  }
]

describe('Check Home page contains all necessary elements', () => {
  it('Verify toolbar contains all necessary elements', () => {
    cy.visit('/booking/counsel-option')

    cy.getByDT('toolbar-title').as('toolbarTitle').should('contain', '일월선녀 해달별').click()

    cy.getByDT('home-page-toolbar-title').should('contain', '일월선녀 해달별')
    cy.go('back')
    cy.get('@toolbarTitle').should('exist')

    cy.getByDT('toolbar-menu-list').within(() => {
      cy.get('li.nav-item').should('have.length', toolbarMenuList.length)

      toolbarMenuList.forEach(entry => {
        cy.getByDT(`toolbar-menu-${entry.id}`).should('contain', entry.name).click()
        cy.url().should('include', entry.linkTo)
        cy.go('back')
        cy.get('@toolbarTitle').should('exist')
        cy.wait(100)
      })
    })
  })
})
