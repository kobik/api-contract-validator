const chai = require('chai');

const apiSchema = require('../lib/index');
const generateResponse = require('./helpers/response-generator').request;
const { schema } = require('./helpers/schemas');
const { validBody, invalidBody } = require('./helpers/body-generator');

chai.use(apiSchema);
const { expect } = chai;

describe('request', () => {
  describe('When the response object matches the schema', () => {
    it('Should not throw an exception', async () => {
      const response = await generateResponse(200, {
        body: validBody,
        headers: {
          'content-type': 'application-json',
          'x-request-id': 'id',
        },
      });

      expect(response).to.be.successful().and.to.matchApiSchema(schema);
    });
  });

  describe('When the response object does not match the schema', () => {
    it('Should throw an exception', async () => {
      const response = await generateResponse(200, {
        body: invalidBody,
        headers: {
          'content-type': 'application-json',
          'x-request-id': 'id',
        },
      });

      expect(response).to.not.matchApiSchema(schema);
    });
  });

  // TODO: test mapErrorsByDataPath directly instead
  describe('When the response is missing multiple required props', () => {
    it('Should return an array of required props', async () => {
      const response = await generateResponse(200, {
        body: { ...invalidBody, lastName: undefined },
        headers: {
          'content-type': 'application-json',
          'x-request-id': 'id',
        },
      });

      expect(response).to.not.matchApiSchema(schema);
    });
  });
});
