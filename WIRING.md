# Search & share pack (SEO)

1. Copy into the project (adds config/seo.php, app/Support/Seo.php, SitemapController,
   resources/views/partials/seo.blade.php, public/images/og-share.jpg).
2. routes/web.php: add the lines in routes-to-add.php.txt.
3. DELETE public/robots.txt if it exists (a real file would hide the route):
       Remove-Item public\robots.txt -ErrorAction SilentlyContinue
4. resources/views/app.blade.php: inside <head>, add this line (anywhere before @inertiaHead):
       @include('partials.seo')
5. Render: set APP_URL=https://biryaa-travels-1.onrender.com (your real domain) so links and the share image are https.
6. php artisan optimize:clear
7. Test:  /sitemap.xml   /robots.txt   and "View page source" on the home page (look for og:title).
8. After you deploy and have your real domain: add the site to Google Search Console and submit /sitemap.xml.
