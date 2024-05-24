describe('GeoPixel App', () => {
  it('Pesquisa pelo nome da cidade e obtém dados do clima', () => {
    cy.visit('http://localhost:5173');

    cy.get('[data-cy="input"]').type('sao paulo');
    cy.get('[data-cy="consult"]').click();

    // Verifica a chamada da primeira api que obtem a coordenada da cidade pesquisada
    cy.intercept({
        method: "GET",
        url: `https://maps.googleapis.com/maps/api/geocode/json?language=pt-br&key=${Cypress.env("API_KEY")}&address=sao+paulo`,
      }).as("getCityCoordinates");

    cy.wait("@getCityCoordinates")
      .then((intercept) => {
        expect(intercept.response.statusCode).to.equal(200)
        expect(intercept.response.body.status).to.equal("OK")
        expect(intercept.response.body.results[0].geometry.location.lat).to.equal(-23.5557714)
        expect(intercept.response.body.results[0].geometry.location.lng).to.equal(-46.6395571)
      })

    // Verifica a chamada da segunda api que retorna o clima com base na coordenada retornada pela primeira api. Como estamos utilizando sao paulo ja considerei a coordenada esperada
    cy.intercept({
      method: "GET",
      url: "https://api.hgbrasil.com/weather?user_ip=remote&format=json-cors&key=23aa7496&lat=-23.5557714&lon=-46.6395571",
    }).as("getCityWeather");

    cy.wait("@getCityWeather")
      .then((intercept) => {
        expect(intercept.response.statusCode).to.equal(200)
      })

    // Verifica que os paragrafos com as informações do clima aparecem
    cy.get('[data-cy="city-name-paragraph"]').should('exist')
    cy.get('[data-cy="city-date-paragraph"]').should('exist')
    cy.get('[data-cy="city-current-temperature-paragraph"]').should('exist')
    cy.get('[data-cy="city-max-temperature-paragraph"]').should('exist')
    cy.get('[data-cy="city-min-temperature-paragraph"]').should('exist')
    cy.get('[data-cy="city-weather-description-paragraph"]').should('exist')
    cy.get('[data-cy="city-rain-probability-paragraph"]').should('exist')
    cy.get('[data-cy="city-moon-phase-paragraph"]').should('exist')

  });
});
