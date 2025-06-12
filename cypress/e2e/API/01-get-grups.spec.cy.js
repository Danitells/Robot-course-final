describe('API tests', () => {
  const team_id = Cypress.env('TeamID');
  const token = Cypress.env('Token');
  const baseUrl = Cypress.env('BaseUrl');
  const url = `${baseUrl}/api/v2/group?team_id=${team_id}`;


  it('GET groups with valid token', () => {
    cy.request({
      method: 'GET',
      url: url,
      headers: {
        'Authorization': token
      }
    }).then((response) => {
      console.log(response
        
      )
      expect(response.status).to.eq(200);
      expect(response.body.groups).to.be.an('array');
      
      if (response.body.groups.length > 0) {
        const group = response.body.groups[0];
        expect(group).to.have.property('id');
        expect(group).to.have.property('name');
        expect(group).to.have.property('team_id');
      }
    });
  });

  it('GET groups with expired token', () => {
    cy.request({
      failOnStatusCode: false,
      method: 'GET',
      url: url,
      headers: {
        'Authorization': 'pk_138202173_2SJ1325IBAPGOENXMBLLOJDV51O1TGP2' // expired/invalid token
      }
    }).then((response) => {
      expect(response.status).to.eq(401);
    });
  });
});
