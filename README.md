 # FertilityWorld

 FertilityWorld is a React application powered by Vite and deployable to Cloudflare Workers.

 ## Requirements

 - Node.js 18 or later
 - npm
 - Wrangler authentication for deployment: `npx wrangler login`

 ## Setup

 Install dependencies after cloning the project:

 ```bash
 npm install
 ```

 ## Commands

 | Command | Purpose |
 | --- | --- |
 | `npm run dev` | Start the Vite development server with hot reload. |
 | `npm run lint` | Run ESLint across the project. |
 | `npm run build` | Create the production build in `dist/`. |
 | `npm run preview` | Build the app and start it with Wrangler locally. |
 | `npm run deploy` | Build the app and deploy it to Cloudflare. |

 ## Local development

 ```bash
 npm run dev
 ```

 Open the local URL shown by Vite in the terminal.

 ## Production preview

 ```bash
 npm run preview
 ```

 ## Contact form email setup

The Contact Us form sends submissions through the Cloudflare Email Service Worker endpoint at `/api/contact`.

For local preview, copy `.dev.vars.example` to `.dev.vars` and set your real inbox and a verified sender address:

```bash
Copy-Item .dev.vars.example .dev.vars
```

For the deployed Worker, configure the same `CONTACT_TO` and `CONTACT_FROM` values as Cloudflare Worker variables. The `CONTACT_FROM` domain must be enabled and verified for Cloudflare Email Service, and the `CONTACT_TO` address must be allowed by the email binding if recipient restrictions are configured.

 ## Deploy to Cloudflare

 Authenticate once, then deploy:

 ```bash
 npx wrangler login
 npm run deploy
 ```
