# Add a car with photo (admin)

1. Copy the files into the same paths in your project (the app/, database/, resources/ folders).
   This REPLACES: app/Http/Controllers/Admin/VehicleController.php, Pages/Admin/Vehicles/Create.jsx, Index.jsx.
2. Add the routes in routes-to-add.txt to routes/web.php.
3. Run:  php artisan migrate
4. Run:  npm run build   (or keep npm run dev)
5. Push to GitHub. Render runs the migration by itself on deploy.

Requires app/Support/ImagePipeline.php (from the verification pack) and PHP GD (already in your Docker image).

IMPORTANT: leave SYNC_VEHICLES unset or false on Render. "vehicles:import --prune" removes
any car that is not in your catalog file, which would delete the cars you add here.
