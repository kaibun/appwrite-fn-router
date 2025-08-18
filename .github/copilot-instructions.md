# Copilot Project Instructions

## Project- and subproject-aware Dependency Installation

This repository is a mono-repo with several sub-projects. Only some are managed as npm workspaces (notably `/functions/test`).

When installing dependencies, always check which sub-project is relevant:

- For documentation (Docusaurus, React UI, code samples, etc.), install in `./doc` (not a workspace, just a separate npm project).
- For the main library, install at the root.
- For OpenAPI, install in `./openapi` (not a workspace, just a separate npm project).
- For Appwrite test functions, install in `./functions` (this is a workspace).

The agent must always determine the correct sub-project by the location of the file being edited or the context of the task:

- Never install documentation/UI dependencies at the root unless the code is in the main library.
- Always prefer local installation for frontend, docs, or code samples, according to the sub-project structure.

## Project structure

This is kind of a mono-repo with multiple connected projects. It essentially is a npm library providing end-users with an Appwrite Functions router, written in Node.js, as a thin wrapper around the Itty Router library.

The core and main project is at the root and its source code is in `/src/`.

Root folders:

- `/src/` : main source code (TypeScript, React components, utils)
- `/doc/` : Docusaurus documentation, custom theme, code examples, docs
- `/functions/` : Appwrite test functions (runs in Docker, managed as a npm workspace)
- `/openapi/` : OpenAPI schema and generation scripts
- `/cypress/` : Cypress end-to-end tests
- `/types/` : TypeScript type definitions

Key root files:

- `package.json` : project dependencies and scripts
- `tsconfig.json` / `tsconfig.base.json` : TypeScript config
- `README.md` : project documentation
- `.github/copilot-instructions.md` : Copilot project rules (we are here)

Notable subfolders:

- `src/components/TriggerFunction/` : main interactive API widget logic
- `src/components/Steps/` : step-by-step UI components
- `doc/src/theme/` : Docusaurus theme, context, palette, i18n
- `doc/src/code-examples/` : code samples for documentation
- `doc/docs/` : markdown docs for Docusaurus

## Generics

- All comments must be in English.
- Maximum line length: 80 characters (including comments).
- Use explicit, readable code and consistent formatting.
- No French in code comments or documentation.
- Prefer clear variable and function names.
- Document non-trivial logic with concise English comments.
- Follow project-specific conventions if specified elsewhere.

## Programming Language: TypeScript

**TypeScript Best Practices:**

- Use strict TypeScript configuration with `"strict": true`
- Avoid `any` type - use `unknown` or proper typing instead
- Use utility types (`Pick`, `Omit`, `Partial`) for type transformations
- Implement proper null/undefined checking
- Imports must use available path aliases, ie. `import Foo from '@src/components/Foo'` is better than `import Foo from '../../../../../src/components/Foo'`
- Imports should be ordered and separated, based on their location/type:

```ts
// First, the external libraries
import { useEffect, useState, useMemo } from 'react';

// Then, the types (externals then internals)
import type { Foobar } from '@foo/bar';
import type { Param, MockApiResponse } from './utils/Types';

// Then, the React contexts and providers
import { SomeContext } from './contexts/ParamsContext';
import { SomeProvider } from '@src/providers/SomeProvider';

// Then, the internal components, utils, etc. (usually reachable through an @alias)
import StepNextButton from '@src/components/Steps/StepNextButton';
import { useUIContext } from '@src/theme/UIContext';

// And finally, the local deps, ie. anything that is co-located or a child
import { ParamsContext } from './ParamsContext';
import type { Param, MockApiResponse } from './utils/Types';
```

## Framework: React

**React Development Guidelines:**

- Use functional components with hooks instead of class components
- Implement proper state management with useState and useReducer
- Use useEffect for side effects and cleanup properly
- Follow React best practices for performance (memo, useMemo, useCallback)
- Use proper prop validation with TypeScript interfaces or PropTypes
- Implement error boundaries for robust error handling

## Code Style: Clean Architecture

**Clean Architecture Guidelines:**

- Follow and propose Clean Architecture principles and best practices
- Maintain consistency with the chosen architectural style
- Apply patterns and practices appropriate to this approach

## AI Code Generation Preferences

When generating code, please:

- Generate complete, working code examples with proper imports
- Include inline comments for complex logic and business rules
- Follow the established patterns and conventions in this project
- Suggest improvements and alternative approaches when relevant
- Consider performance, security, and maintainability
- Include error handling and edge case considerations
- Generate appropriate unit tests when creating new functions
- Follow accessibility best practices for UI components
- Use semantic HTML and proper ARIA attributes when applicable
