# We Care Fertility website

The site consists of a React 19/Vite single-page frontend and a Laravel 12 JSON API backed by MySQL. The admin manages pages, sections, FAQ modules, navigation, blog posts, uploaded images, leads, newsletter subscribers, and shared site settings.

## Deployment readiness

The source builds and tests locally, but this repository does not include provider-specific hosting, DNS/TLS, CI/CD, or web-server configuration. It is not a one-click deployment. Before going live, choose a PHP host for Laravel and a static host for the React build (or configure a reverse proxy), then apply the production checklist below.

Important hosting requirements:

- The Laravel web document root must be `backend/public`, never the repository root or `backend/`.
- The React host must serve `frontend/dist` and rewrite unknown frontend paths (for example `/services/ivf` and `/admin/login`) to `index.html`.
- Configure the API host and frontend host origins consistently. The API's CORS allowlist is `FRONTEND_URL`; the built frontend's API origin is `VITE_API_BASE_URL`.
- Uploaded logos and other images are written to Laravel's `public` filesystem disk under `backend/storage/app/public`. Provide persistent storage, expose it through `public/storage` (`php artisan storage:link`), and back it up. Ephemeral storage or multiple API instances without shared storage will lose or fail to share uploads.
- The production API `APP_URL` must be its public HTTPS origin so generated upload URLs point to the right host.
- No production database, secrets, or admin credentials are included here. Do not expose `.env`, source files, storage internals, or the database to the web.
- A known content issue remains before launch: the homepage doctor section currently references a legacy `/__l5e/.../doctor.svg` asset that is not included in this repository. Upload the approved image in the admin and verify it loads on the production domain.

## Requirements

- PHP `^8.2` with the extensions required by Laravel and `pdo_mysql`, `fileinfo`, and `dom`.
- Composer 2.
- MySQL with a database/user dedicated to this app (MySQL 8 recommended).
- Node.js `20.19+` or `22.13+` and npm (required to install/build the Vite frontend).
- Apache with URL rewriting or an equivalent PHP-capable web server for Laravel. Production hosting must support HTTPS.

Use `composer check-platform-reqs` on the target backend host to verify PHP extensions.
Also verify that the PHP runtime serving web requests (not only the CLI) has `pdo_mysql`, `fileinfo`, and `dom` enabled. Configure PHP/web-server request limits with `upload_max_filesize` of at least `5M` and `post_max_size` slightly higher (for example `8M`); CMS image uploads are limited to 5 MB.

## Fresh local setup (Windows / XAMPP)

The commands below assume PowerShell, the repository is already downloaded, and XAMPP MySQL is running. Replace the project path if it differs.

### 1. Create a local database

In phpMyAdmin's SQL tab, run:

```sql
CREATE DATABASE IF NOT EXISTS wecare_fertility
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
```

### 2. Configure and initialize the Laravel API

```powershell
$ProjectRoot = 'D:\xampp\htdocs\suraj\wecarefurtility'
Set-Location "$ProjectRoot\backend"
Copy-Item .env.example .env
composer install
```

The backend `.env.example` has local defaults for XAMPP MySQL (`root`, blank password), `APP_URL=http://127.0.0.1:8000`, and `FRONTEND_URL=http://127.0.0.1:5173`. If your MySQL credentials or ports differ, edit `backend/.env` before migrating. Keep `APP_DEBUG=true` only for local development.

Initialize the app and public image storage:

```powershell
php artisan key:generate
php artisan migrate
php artisan storage:link
```

Import the original static pages and navigation into an empty database:

```powershell
php artisan app:import-legacy-content
```

Run the importer only after the repository's original root-level HTML pages and `services` HTML pages are present. On an existing database, the importer is designed to preserve page/menu data and apply selected legacy upgrades; it is not a substitute for a backup or a controlled content migration.

To add the five sample blog posts for local preview only:

```powershell
php artisan db:seed --class=BlogPostSeeder
```

Do not run `php artisan db:seed` on production; the default seeder creates a test user.

### 3. Create the first admin user

```powershell
php artisan app:create-admin
```

Enter the admin name, email, and a password of at least 12 characters. The command asks for confirmation and can update the password for an existing account with the same email. Do not use sample/test credentials in production.

### 4. Start the API

In the backend terminal:

```powershell
php artisan serve --host=127.0.0.1 --port=8000
```

### 5. Install and start the frontend

Open another PowerShell terminal:

```powershell
$ProjectRoot = 'D:\xampp\htdocs\suraj\wecarefurtility'
Set-Location "$ProjectRoot\frontend"
Copy-Item .env.example .env.local
npm ci
npm run dev -- --host=127.0.0.1 --port=5173
```

Leave `VITE_API_BASE_URL` empty for local development. Vite proxies `/api` and `/storage` to the Laravel server at `127.0.0.1:8000`. If either server uses a different address, update `frontend/vite.config.js` or configure the appropriate environment/proxy for that setup. Restart Vite after changing environment values.

### 6. Check the local setup

- Site: <http://127.0.0.1:5173>
- Admin login: <http://127.0.0.1:5173/admin/login>
- API health: <http://127.0.0.1:8000/up>
- Public homepage API: <http://127.0.0.1:8000/api/page?slug=home>

Sign in using the admin account created above. Upload a test image in the admin and confirm it is available from the `127.0.0.1:8000/storage/...` URL.

## Production deployment (fresh install)

This is a provider-neutral deployment sequence. The exact DNS, TLS, PHP-FPM, web-server, process, and static-host settings depend on your hosting provider. The example uses separate origins:

- Frontend: `https://www.example.com`
- Laravel API: `https://api.example.com`

Replace both example domains with the real HTTPS origins. Do not include `/api` or a trailing slash in `VITE_API_BASE_URL`.

### 1. Provision hosting and database

1. Configure HTTPS for both origins.
2. Provision PHP `^8.2`, Composer 2, required Laravel extensions, and a MySQL database.
3. Configure the Laravel site's document root to `backend/public`.
4. Configure the frontend static host to publish the contents of `frontend/dist` and serve `index.html` for unknown paths, while still serving real static files normally.
5. Create a dedicated database and least-privilege database user. Allow connections from the API host only.
6. Allocate persistent writable storage for `backend/storage` and `backend/bootstrap/cache`. Ensure uploaded files persist across releases and are shared if the API runs on more than one instance.

Never point a public web root at the repository root, `backend/`, `.env`, or `backend/storage/app`.

### 2. Configure the backend environment

Deploy the backend source (including `vendor/` only if you deliberately build it on a separate machine; generally install dependencies on the server or in your release build). Create `backend/.env` from `.env.example` or inject values through the hosting provider's secret manager. Set at least:

```dotenv
APP_NAME="We Care Fertility"
APP_ENV=production
APP_KEY=
APP_DEBUG=false
APP_URL=https://api.example.com

DB_CONNECTION=mysql
DB_HOST=YOUR_DATABASE_HOST
DB_PORT=3306
DB_DATABASE=YOUR_DATABASE_NAME
DB_USERNAME=YOUR_DATABASE_USER
DB_PASSWORD=YOUR_DATABASE_PASSWORD

FRONTEND_URL=https://www.example.com
SESSION_DRIVER=file
FILESYSTEM_DISK=public
```

Generate `APP_KEY` once for a new installation with `php artisan key:generate`. Preserve the same key across releases and backups; changing it invalidates encrypted application data. Keep `.env` private and never commit it. Set `APP_DEBUG=false` in production.

If the frontend uses more than one origin (for example, both `https://example.com` and `https://www.example.com`), set `FRONTEND_URL` to a comma-separated list of the exact origins. The API reads this value as its CORS allowlist. It must include the scheme and must not include a path.

`FILESYSTEM_DISK=public` and persistent storage are required for uploaded images. The upload handlers currently explicitly use Laravel's `public` disk; setting the default disk to S3 alone does not move these uploads to S3.

### 3. Install backend dependencies and initialize the database

From `backend/` on the release host:

```sh
composer install --no-dev --prefer-dist --no-interaction --optimize-autoloader
composer check-platform-reqs --no-dev
php artisan key:generate
php artisan migrate --force
php artisan storage:link
```

Run `php artisan key:generate` only when creating the first production `.env`; do not regenerate it on later deployments. Run migrations after taking the normal database backup required by your release process.

On the first deployment only, import the original site content after the schema exists. Ensure the source deployment still contains the original root HTML files and `services/` HTML files required by the importer:

```sh
php artisan app:import-legacy-content
```

Create the first production admin from a secure interactive server shell:

```sh
php artisan app:create-admin
```

The admin password is entered interactively and must be at least 12 characters. Never put it in a command-line argument, script committed to source control, or this README. Do not run the default database seeder or sample blog seeder on production.

Ensure the PHP/web-server user can write to `backend/storage` and `backend/bootstrap/cache`; keep other source and configuration files non-writable where possible. Create the public storage symlink inside `backend/public` and verify the host permits serving files from it.

After production environment values and dependencies are in place, build Laravel's caches:

```sh
php artisan optimize
```

Clear/rebuild Laravel's caches whenever environment/configuration changes during a release:

```sh
php artisan optimize:clear
php artisan optimize
```

### 4. Build and publish the frontend

The API base URL is embedded in the frontend at build time. Build for the production API origin:

```sh
cd ../frontend
npm ci
```

Set `VITE_API_BASE_URL=https://api.example.com` in the frontend build environment, then run:

```sh
npm run lint
npm run build
```

Publish the generated `frontend/dist` directory to the static host. If frontend and API are exposed under the same origin with a reverse proxy for `/api` and `/storage`, leave `VITE_API_BASE_URL` empty instead. Configure the reverse proxy accordingly; Vite's development proxy is not included in the production build.

Because Vite embeds `VITE_API_BASE_URL` during the build, rebuild and redeploy the frontend after changing it. It is a public URL, not a secret.

### 5. Verify the production release

1. Confirm `https://api.example.com/up` returns a successful response.
2. Confirm `https://api.example.com/api/page?slug=home` returns the published homepage.
3. Load the frontend homepage and refresh a nested route such as `/services/ivf` and `/admin/login` directly. Both must return the React app rather than a host 404.
4. Sign in at `/admin/login`, edit a page, upload an image, and confirm the resulting `/storage/...` URL loads over HTTPS.
5. Submit a test contact request and newsletter subscription; confirm both are saved and appear in their admin views.
6. Check the browser console/network tab for blocked CORS, mixed-content, missing asset, API, or storage requests.
7. Verify backups include both the production database and `backend/storage/app/public`. Test restoration, not only backup creation.

The app's contact leads and newsletter subscribers are stored in the database; these endpoints do not send email notifications. Configure an operational mail integration separately if email delivery is required.

## CMS capabilities

- Create, edit, publish, reorder, hide, and remove pages and sections using Hero, Text, Image + Text, Cards, inline FAQ, reusable FAQ, Call-to-action, Clinic Contact, Contact Form, and other structured blocks. Complex legacy HTML sections retain the visual editor and advanced HTML fallback.
- Add a Dynamic Service Pages section to any page. Published pages under `services/` appear automatically, using structured hero titles, descriptions, and images when available.
- Upload or link images for hero banners, image/text sections, cards, blog posts, and legacy visual sections; add accessibility text where applicable.
- Manage question-and-answer modules separately in the admin FAQ library, then add a published module to any page. Editing a shared module updates every page that uses it.
- Manage header and footer navigation labels, destinations, parent links, visibility, and display order.
- Create, preview, publish, and delete blog posts with guided text, heading, list, quote, image, and FAQ blocks. Set categories and search-result details.
- Publish articles at `/blog` and `/blog/{post-slug}`. Published articles appear automatically in the homepage blog section; article pages link to recent published posts.
- Edit site name, shared logo, top-bar message, appointment button, shared call-to-action, and clinic profile once for the site.
- Add global head tags/schema, footer scripts, and custom CSS from **Admin → Custom code**; add separate head/footer/CSS snippets to individual pages in their page editor. Page snippets are emitted only for published pages, alongside the global snippets.
- Review contact/appointment requests and update their status; review or remove newsletter subscribers.
- Public content endpoints return published pages and visible sections/menu items. Admin endpoints require an authenticated Sanctum bearer token.

## Project checks

Run these before releasing changes:

```powershell
Set-Location 'D:\path\to\wecarefurtility\backend'
composer validate --no-check-publish
composer check-platform-reqs
php artisan test

Set-Location 'D:\path\to\wecarefurtility\frontend'
npm ci
npm run lint
npm run build
```
