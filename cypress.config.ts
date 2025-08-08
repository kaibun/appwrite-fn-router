import { defineConfig } from 'cypress';
import * as path from 'path';
import webpackPreprocessor from '@cypress/webpack-preprocessor';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    specPattern: 'cypress/{e2e,unit}/**/*.cy.ts',
    supportFile: 'cypress/support/e2e.ts',
    setupNodeEvents(on, config) {
      on('task', {
        log(message) {
          console.log(message);
          return null;
        },
      });
      const options = {
        webpackOptions: {
          resolve: {
            alias: {
              '@': path.resolve(config.projectRoot),
            },
            extensions: ['.ts', '.js'],
          },
          module: {
            rules: [
              {
                test: /\.ts$/,
                exclude: [/node_modules/],
                use: [
                  {
                    loader: 'ts-loader',
                    options: {
                      transpileOnly: true,
                    },
                  },
                ],
              },
            ],
          },
        },
      };
      on('file:preprocessor', webpackPreprocessor(options));
      return config;
    },
  },
});
