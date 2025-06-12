const { faker } = require('@faker-js/faker');

describe('API tests', () => {
  const team_id = Cypress.env('TeamID');
  const token = Cypress.env('Token');
  const baseUrl = Cypress.env('BaseUrl');
  const getGroupsUrl = `${baseUrl}/api/v2/group?team_id=${team_id}`;
  const postGroupUrl = `${baseUrl}/api/v2/team/${team_id}/group`;
  const groupName = faker.internet.userAgent();
  const newGroupName = faker.internet.userAgent();

  before('Clean existing groups and create a new one', () => {
    // Clean existing groups
    cy.request({
      method: 'GET',
      url: getGroupsUrl,
      headers: { 'Authorization': token }
    }).then((response) => {
      expect(response.status).to.eq(200);
      const groups = response.body.groups || [];
      if (groups.length > 0) {
        groups.forEach((group) => {
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

    // Create new group
    cy.request({
      method: 'POST',
      url: postGroupUrl,
      headers: {
        'Authorization': token,
        'accept': 'application/json',
        'content-type': 'application/json'
      },
      body: { name: groupName }
    }).then((response) => {
      expect(response.status).to.eq(200);
      cy.wrap(response.body.id).as('groupId');
    });
  });

  it('GET Groups - group is created', function() {
    cy.request({
      method: 'GET',
      url: getGroupsUrl,
      headers: { 'Authorization': token }
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.groups[0]).to.have.property('id', this.groupId);
      expect(response.body.groups[0]).to.have.property('name', groupName);
    });
  });

  it('Update Group by ID', function() {
    cy.request({
      method: 'PUT',
      url: `${baseUrl}/api/v2/group/${this.groupId}`,
      headers: { 'Authorization': token },
      body: { name: newGroupName }
    }).then((response) => {
      expect(response.status).to.eq(200);
      cy.log(response.body)
        expect(response.body).to.have.property('id', this.groupId);
        expect(response.body).to.have.property('name', newGroupName);
    });
  });

  it('Delete Group by ID', function() {
    cy.request({
      method: 'DELETE',
      url: `${baseUrl}/api/v2/group/${this.groupId}`,
      headers: { 'Authorization': token }
    }).then((response) => {
      expect(response.status).to.eq(200);
    });
  });

  it('GET Groups - group is deleted', () => {
    cy.request({
      method: 'GET',
      url: getGroupsUrl,
      headers: { 'Authorization': token }
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('groups');
      expect(response.body.groups).to.be.an('array');
      expect(response.body.groups).to.have.length(0);
    });
  });
});
