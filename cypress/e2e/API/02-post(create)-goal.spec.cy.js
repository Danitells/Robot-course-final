const { faker } = require('@faker-js/faker');
import Ajv from 'ajv';

describe('API tests', () => {
  const team_id = Cypress.env('TeamID');
  const token = Cypress.env('Token');
  const baseUrl = Cypress.env('BaseUrl');
  const getGroupsUrl = `${baseUrl}/api/v2/group?team_id=${team_id}`;
  const postGroupUrl = `${baseUrl}/api/v2/team/${team_id}/group`;
  const groupName = faker.internet.userAgent();

  before(function () {
    cy.request({
      method: 'GET',
      url: getGroupsUrl,
      headers: { 'Authorization': token }
    }).then((response) => {
      expect(response.status).to.eq(200);
      const groups = response.body.groups || [];

      if (groups.length > 0) {
        cy.wrap(groups).each((group) => {
          cy.request({
            method: 'DELETE',
            url: `${baseUrl}/api/v2/group/${group.id}`,
            headers: { 'Authorization': token }
          }).then((delResponse) => {
            expect(delResponse.status).to.eq(200);
          });
        });
      }
    });
  });

  it('POST Group: status validation', function () {
    cy.request({
      method: 'POST',
      url: postGroupUrl,
      headers: {
        'Authorization': token,
        'accept': 'application/json',
        'content-type': 'application/json'
      },
      body: {
        name: groupName,
      }
    }).then((response) => {
      expect(response.status).to.eq(200); 
    });
  });
});
