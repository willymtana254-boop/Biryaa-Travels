# Testimonials pack

1. Copy the folders into the project (same paths).
2. routes/web.php: add the lines in routes-to-add.php.txt (public + admin group).
3. Home page: in resources/js/Pages/Home.jsx add
       import Testimonials from '../Components/Testimonials';
   and put <Testimonials /> where you want it (e.g. above the footer / after the services).
4. Admin menu: in resources/js/Layouts/AdminLayout.jsx add to the nav list
       { href: '/admin/testimonials', label: 'Testimonials' },
5. Footer (SiteLayout): add a link to /testimonials.
6. Run:  php artisan migrate   then   php artisan optimize:clear   then   npm run build
