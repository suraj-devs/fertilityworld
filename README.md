# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Created UI Components and Pages

The project now includes a simple component layout with the following new items:

1. `src/components/Header.jsx` - site header with navigation buttons for Home and About.
2. `src/components/Footer.jsx` - site footer with app branding.
3. `src/pages/Home.jsx` - a landing page with welcome content.
4. `src/pages/About.jsx` - an About page with mission details.
5. `src/App.jsx` - updated to render `Header`, `Footer`, and switch between the Home and About pages without any extra routing library.

These additions were documented in the README only and did not change any existing code outside the normal app structure.
