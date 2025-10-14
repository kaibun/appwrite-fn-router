import YAML from 'yaml';
import { isValidWidget, isValidWidgetArray } from '../support/utils';

describe('API Tests from OpenAPI Spec', () => {
  let spec: any;
  let widgetId: string;
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
        expect(response.body).to.have.property('data');
        expect(response.body.data).to.have.property('items');
        expect(response.body.data.items).to.be.an('array');

        // Validate that each item in the array is a valid Widget
        expect(isValidWidgetArray(response.body.data.items)).to.be.true;

        // Additional validation: each widget should have the expected properties
        response.body.data.items.forEach((widget: any) => {
          expect(widget).to.have.property('weight').that.is.a('number');
          expect(widget)
            .to.have.property('color')
            .that.is.oneOf(['red', 'blue', 'gold']);
        });
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
        const widget = response.body.data;
        expect(isValidWidget(widget)).to.be.true;
        expect(widget.weight).to.eq(15);
        expect(widget.color).to.eq('red');
        widgetId = widget.$id; // Store the widget ID for future tests
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
        const widget = response.body.data;
        expect(isValidWidget(widget)).to.be.true;
        expect(widget).to.include({
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
        url: path(widgetId),
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(200);
        const widget = response.body.data;
        expect(isValidWidget(widget)).to.be.true;
        expect(widget).to.have.property('weight').that.is.a('number');
        expect(widget)
          .to.have.property('color')
          .that.is.oneOf(['red', 'blue', 'gold']);
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
        url: path(widgetId),
        body: { weight: 25, color: 'blue' },
        headers: { 'Content-Type': 'application/json' },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(200);
        const widget = response.body.data;
        expect(isValidWidget(widget)).to.be.true;
        expect(widget.weight).to.eq(25);
        expect(widget.color).to.eq('blue');
      });
    });

    it('should test DELETE /widgets/{id}', () => {
      cy.request({
        method: 'DELETE',
        url: path(widgetId),
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(204);
      });
    });

    it('should test POST /widgets/{id} (analyze)', () => {
      cy.request({
        method: 'POST',
        url: path(widgetId),
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(200);
        const widget = response.body.data;
        expect(widget).to.have.property('analysis');
        expect(widget.$id).to.eq(widgetId);
      });
    });
  });

  context('Error Handling', () => {
    describe('The catch option', () => {
      it('should catch the error thrown by /errors/throw', () => {
        cy.request({
          method: 'GET',
          // url: '/root_error',
          url: '/errors/throw',
          failOnStatusCode: false,
        }).then((response) => {
          expect(response.status).to.eq(500);
          expect(response.body).to.have.property(
            'message',
            'E2E_CUSTOM_ERROR_TRIGGERED'
          );
          expect(response.body)
            .to.have.property('error')
            .and.match(/test error/i);
        });
      });
    });
  });
});
