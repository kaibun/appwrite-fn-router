import YAML from 'yaml';

describe('API Tests from OpenAPI Spec', () => {
  let spec: any;
  // Dynamically prefixed with host set by cypress.config.ts’ baseUrl
  const path = (p = '') => `/widgets/${p}`;

  before(() => {
    // Load and parse the OpenAPI YAML file once
    cy.readFile('openapi/tsp-output/schema/openapi.0.1.0.yaml').then(
      (fileContent) => {
        spec = YAML.parse(fileContent);
      }
    );
  });

  it('should load OpenAPI spec', () => {
    expect(spec).to.exist;
    expect(spec.paths).to.exist;
  });

  context('API Endpoint Tests', () => {
    beforeEach(() => {
      // Ensure spec is loaded before each test
      cy.readFile('openapi/tsp-output/schema/openapi.0.1.0.yaml').then(
        (fileContent) => {
          spec = YAML.parse(fileContent);
        }
      );
    });

    it('should test all GET /widgets endpoints', () => {
      // Test GET /widgets
      cy.request({
        method: 'GET',
        url: path(),
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('items');
        expect(response.body.items).to.be.an('array');
      });
    });

    it('should test POST /widgets with valid data', () => {
      cy.request({
        method: 'POST',
        url: path(),
        body: { weight: 15, color: 'red' },
        headers: { 'Content-Type': 'application/json' },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body).to.have.property('id');
        expect(response.body.weight).to.eq(15);
        expect(response.body.color).to.eq('red');
      });
    });

    it('should test POST /widgets with invalid data', () => {
      cy.request({
        method: 'POST',
        url: path(),
        body: { weight: 15 }, // missing color
        headers: { 'Content-Type': 'application/json' },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body).to.have.property('code', 'VALIDATION_ERROR');
      });
    });

    it('should test GET /widgets/secret with valid token', () => {
      cy.request({
        method: 'GET',
        url: path('secret'),
        headers: { Authorization: 'Bearer supersecret' },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.deep.equal({
          id: 'widget-secret',
          weight: 200,
          color: 'gold',
        });
      });
    });

    it('should test GET /widgets/secret without token', () => {
      cy.request({
        method: 'GET',
        url: path('secret'),
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(401);
        expect(response.body).to.have.property('code', 'UNAUTHORIZED');
      });
    });

    it('should test GET /widgets/{id} with valid id', () => {
      cy.request({
        method: 'GET',
        url: path('widget1'),
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('id', 'widget1');
        expect(response.body).to.have.property('weight');
        expect(response.body).to.have.property('color');
      });
    });

    it('should test GET /widgets/{id} with not-found id', () => {
      cy.request({
        method: 'GET',
        url: path('not-found'),
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(404);
        expect(response.body).to.have.property('code', 'NOT_FOUND');
      });
    });

    it('should test PATCH /widgets/{id}', () => {
      cy.request({
        method: 'PATCH',
        url: path('widget1'),
        body: { weight: 25, color: 'blue' },
        headers: { 'Content-Type': 'application/json' },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.weight).to.eq(25);
        expect(response.body.color).to.eq('blue');
      });
    });

    it('should test DELETE /widgets/{id}', () => {
      cy.request({
        method: 'DELETE',
        url: path('widget1'),
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(204);
      });
    });

    it('should test POST /widgets/{id} (analyze)', () => {
      cy.request({
        method: 'POST',
        url: path('widget1'),
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('analysis');
        expect(response.body.id).to.eq('widget1');
      });
    });
  });
});
