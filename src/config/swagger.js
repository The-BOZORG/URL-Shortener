import swaggerJsdoc from 'swagger-jsdoc';
import { config } from './index.js';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'URL Shortener API',
      version: '1.0.0',
      description: `
A RESTful API for shortening URLs, managing links, and handling user accounts.

### Authentication
Most endpoints require a **Bearer** access token in the \`Authorization\` header.
Refresh tokens are issued as http-only cookies during login.
      `,
    },
    servers: [
      {
        url: `http://localhost:${config.PORT}/api`,
        description: 'Local development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter the access token returned by the login endpoint.',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '665f1c2e9d3c4a0012ab34cd' },
            username: { type: 'string', example: 'johndoe' },
            email: { type: 'string', example: 'john@example.com' },
            role: { type: 'string', enum: ['user', 'admin'], example: 'user' },
            totalVisitCount: { type: 'integer', example: 12 },
            isVerified: { type: 'boolean', example: true },
            verified: {
              type: 'string',
              format: 'date-time',
              example: '2026-07-14T09:00:00.000Z',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2026-07-14T08:00:00.000Z',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              example: '2026-07-14T09:00:00.000Z',
            },
          },
        },
        Link: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '665f1c2e9d3c4a0012ab34ce' },
            title: { type: 'string', example: 'My Blog' },
            destination: {
              type: 'string',
              example: 'https://blog.example.com/post-1',
            },
            backHalf: { type: 'string', example: 'aB3xZ9' },
            shortLink: {
              type: 'string',
              example: 'http://localhost:3000/aB3xZ9',
            },
            totalVisitCount: { type: 'integer', example: 5 },
            creator: { type: 'string', example: '665f1c2e9d3c4a0012ab34cd' },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2026-07-14T08:00:00.000Z',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              example: '2026-07-14T09:00:00.000Z',
            },
          },
        },
        AuthTokens: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            accessToken: {
              type: 'string',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'something went wrong' },
            status: { type: 'integer', example: 400 },
            details: { type: 'string', nullable: true },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./src/routes/**/*.js'],
};

export const swaggerSpec = swaggerJsdoc(options);
