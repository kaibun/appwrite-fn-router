# OpenAPI Specification

This TypeSpec project is used to generate an OpenAPI specfication which is then consumed by Scalar to generate [our live documentation with actionnable queries](https://appwrite-fn-router.appwrite.network/docs/api).

It allows end-users and C/I to fire [the lib’s _live testing function’s endpoints_](https://github.com/kaibun/appwrite-fn-router/tree/main/functions/Test/), in order to verify that the underlying library code (the appwrite-fn-router itself) works as expected against a live API powered by an actual Appwrite cluster.

See https://typespec.io/ and https://guides.scalar.com/scalar/scalar-api-references/integrations/docusaurus for more details on the tooling.

## Usage

```sh
npm run compile[:watch] 
```

- generates ./tsp-output/schema/openapi.[VERSION].yaml
- copy that file in ../docs/static/openapi.yaml for rapid local development & testing

## Version bumping

Upon releasing a new version of the API, that new version number must be reflected in main.tsp and in ../docs/docusaurus.config.ts (@scalar/docusaurus plugin section). The openapi.[VERSION].yaml file must be pushed to GitHub (or somewhere else if it’s more convenient; consider automating the process with a C/I).
