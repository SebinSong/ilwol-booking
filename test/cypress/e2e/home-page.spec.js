describe('Check Home page contains all necessary elements', () => {
  it('Verify toolbar and all home contents are there.', () => {
    cy.visit('/')

    cy.getByDT('ilwol-logo').should('exist')
    cy.getByDT('home-page-toolbar-title').should('contain', '일월선녀 해달별')

    cy.getByDT('carousel-slider').within(() => {
      cy.getByDT('carousel-youtube-card').should('have.length', 4)
    })

    cy.getByDT('introduction-btn').as('introductionBtn').should('contain', '소개 / 리뷰 / 오시는 길')
    cy.getByDT('booking-btn').as('bookingBtn').should('contain', '예약하기')

    cy.get('@introductionBtn').click()
    cy.getByDT('introduction-title').should('contain', '선녀님 소개')
    cy.getByDT('introduction-back-btn').should('exist').click()

    cy.getByDT('introduction-title').should('not.exist')

    cy.get('@bookingBtn').click()
    cy.url().should('include', '/booking/counsel-option')

    cy.getByDT('toolbar-title').click()
    cy.get('@bookingBtn').should('exist')
    // wait for an arbitrary time to ensure the page is loaded
    cy.wait(4000)
  })

  it('Verify toolbar and all home contents are there.', () => {
    cy.visit('/')

    cy.getByDT('ilwol-logo').should('exist')
    cy.getByDT('home-page-toolbar-title').should('contain', '일월선녀 해달별')

    cy.getByDT('carousel-slider').within(() => {
      cy.getByDT('carousel-youtube-card').should('have.length', 4)
    })

    cy.getByDT('introduction-btn').as('introductionBtn').should('contain', '소개 / 리뷰 / 오시는 길')
    cy.getByDT('booking-btn').as('bookingBtn').should('contain', '예약하기')

    cy.get('@introductionBtn').click()
    cy.getByDT('introduction-title').should('contain', '선녀님 소개')
    cy.getByDT('introduction-back-btn').should('exist').click()

    cy.getByDT('introduction-title').should('not.exist')

    cy.get('@bookingBtn').click()
    cy.url().should('include', '/booking/counsel-option')

    cy.getByDT('toolbar-title').click()
    cy.get('@bookingBtn').should('exist')
    cy.wait(4000)
  })

  it('Verify toolbar and all home contents are there.', () => {
    cy.visit('/')

    cy.getByDT('ilwol-logo').should('exist')
    cy.getByDT('home-page-toolbar-title').should('contain', '일월선녀 해달별')

    cy.getByDT('carousel-slider').within(() => {
      cy.getByDT('carousel-youtube-card').should('have.length', 4)
    })

    cy.getByDT('introduction-btn').as('introductionBtn').should('contain', '소개 / 리뷰 / 오시는 길')
    cy.getByDT('booking-btn').as('bookingBtn').should('contain', '예약하기')

    cy.get('@introductionBtn').click()
    cy.getByDT('introduction-title').should('contain', '선녀님 소개')
    cy.getByDT('introduction-back-btn').should('exist').click()

    cy.getByDT('introduction-title').should('not.exist')

    cy.get('@bookingBtn').click()
    cy.url().should('include', '/booking/counsel-option')

    cy.getByDT('toolbar-title').click()
    cy.get('@bookingBtn').should('exist')
    cy.wait(4000)
  })

  it('Verify toolbar and all home contents are there.', () => {
    cy.visit('/')

    cy.getByDT('ilwol-logo').should('exist')
    cy.getByDT('home-page-toolbar-title').should('contain', '일월선녀 해달별')

    cy.getByDT('carousel-slider').within(() => {
      cy.getByDT('carousel-youtube-card').should('have.length', 4)
    })

    cy.getByDT('introduction-btn').as('introductionBtn').should('contain', '소개 / 리뷰 / 오시는 길')
    cy.getByDT('booking-btn').as('bookingBtn').should('contain', '예약하기')

    cy.get('@introductionBtn').click()
    cy.getByDT('introduction-title').should('contain', '선녀님 소개')
    cy.getByDT('introduction-back-btn').should('exist').click()

    cy.getByDT('introduction-title').should('not.exist')

    cy.get('@bookingBtn').click()
    cy.url().should('include', '/booking/counsel-option')

    cy.getByDT('toolbar-title').click()
    cy.get('@bookingBtn').should('exist')
    cy.wait(4000)
  })

  it('Verify toolbar and all home contents are there.', () => {
    cy.visit('/')

    cy.getByDT('ilwol-logo').should('exist')
    cy.getByDT('home-page-toolbar-title').should('contain', '일월선녀 해달별')

    cy.getByDT('carousel-slider').within(() => {
      cy.getByDT('carousel-youtube-card').should('have.length', 4)
    })

    cy.getByDT('introduction-btn').as('introductionBtn').should('contain', '소개 / 리뷰 / 오시는 길')
    cy.getByDT('booking-btn').as('bookingBtn').should('contain', '예약하기')

    cy.get('@introductionBtn').click()
    cy.getByDT('introduction-title').should('contain', '선녀님 소개')
    cy.getByDT('introduction-back-btn').should('exist').click()

    cy.getByDT('introduction-title').should('not.exist')

    cy.get('@bookingBtn').click()
    cy.url().should('include', '/booking/counsel-option')

    cy.getByDT('toolbar-title').click()
    cy.get('@bookingBtn').should('exist')
    cy.wait(4000)
  })

  it('Verify toolbar and all home contents are there.', () => {
    cy.visit('/')

    cy.getByDT('ilwol-logo').should('exist')
    cy.getByDT('home-page-toolbar-title').should('contain', '일월선녀 해달별')

    cy.getByDT('carousel-slider').within(() => {
      cy.getByDT('carousel-youtube-card').should('have.length', 4)
    })

    cy.getByDT('introduction-btn').as('introductionBtn').should('contain', '소개 / 리뷰 / 오시는 길')
    cy.getByDT('booking-btn').as('bookingBtn').should('contain', '예약하기')

    cy.get('@introductionBtn').click()
    cy.getByDT('introduction-title').should('contain', '선녀님 소개')
    cy.getByDT('introduction-back-btn').should('exist').click()

    cy.getByDT('introduction-title').should('not.exist')

    cy.get('@bookingBtn').click()
    cy.url().should('include', '/booking/counsel-option')

    cy.getByDT('toolbar-title').click()
    cy.get('@bookingBtn').should('exist')
  })

  it('Verify toolbar and all home contents are there.', () => {
    cy.visit('/')

    cy.getByDT('ilwol-logo').should('exist')
    cy.getByDT('home-page-toolbar-title').should('contain', '일월선녀 해달별')

    cy.getByDT('carousel-slider').within(() => {
      cy.getByDT('carousel-youtube-card').should('have.length', 4)
    })

    cy.getByDT('introduction-btn').as('introductionBtn').should('contain', '소개 / 리뷰 / 오시는 길')
    cy.getByDT('booking-btn').as('bookingBtn').should('contain', '예약하기')

    cy.get('@introductionBtn').click()
    cy.getByDT('introduction-title').should('contain', '선녀님 소개')
    cy.getByDT('introduction-back-btn').should('exist').click()

    cy.getByDT('introduction-title').should('not.exist')

    cy.get('@bookingBtn').click()
    cy.url().should('include', '/booking/counsel-option')

    cy.getByDT('toolbar-title').click()
    cy.get('@bookingBtn').should('exist')
    cy.wait(4000)
  })

  it('Verify toolbar and all home contents are there.', () => {
    cy.visit('/')

    cy.getByDT('ilwol-logo').should('exist')
    cy.getByDT('home-page-toolbar-title').should('contain', '일월선녀 해달별')

    cy.getByDT('carousel-slider').within(() => {
      cy.getByDT('carousel-youtube-card').should('have.length', 4)
    })

    cy.getByDT('introduction-btn').as('introductionBtn').should('contain', '소개 / 리뷰 / 오시는 길')
    cy.getByDT('booking-btn').as('bookingBtn').should('contain', '예약하기')

    cy.get('@introductionBtn').click()
    cy.getByDT('introduction-title').should('contain', '선녀님 소개')
    cy.getByDT('introduction-back-btn').should('exist').click()

    cy.getByDT('introduction-title').should('not.exist')

    cy.get('@bookingBtn').click()
    cy.url().should('include', '/booking/counsel-option')

    cy.getByDT('toolbar-title').click()
    cy.get('@bookingBtn').should('exist')
    cy.wait(4000)
  })
})
