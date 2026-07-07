<?php

// Admin controllers referenced by class name strings to avoid static analysis errors
use App\Http\Controllers\BookingController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\TourController;
use App\Http\Controllers\TransferController;
use App\Http\Controllers\VehicleController;
use App\Http\Controllers\VillaController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public booking site
|--------------------------------------------------------------------------
*/
Route::get('/', HomeController::class)->name('home');

Route::get('/car-hire', [VehicleController::class, 'index'])->name('vehicles.index');
Route::get('/car-hire/{vehicle}', [VehicleController::class, 'show'])->name('vehicles.show');

Route::get('/airport-transfers', [TransferController::class, 'index'])->name('transfers.index');

Route::get('/villas', [VillaController::class, 'index'])->name('villas.index');
Route::get('/villas/{villa:slug}', [VillaController::class, 'show'])->name('villas.show');

Route::get('/experiences', [TourController::class, 'index'])->name('tours.index');
Route::get('/experiences/{tour:slug}', [TourController::class, 'show'])->name('tours.show');

Route::get('/book/{type}/{id}', [BookingController::class, 'create'])->name('bookings.create');
Route::post('/bookings', [BookingController::class, 'store'])->name('bookings.store');
Route::get('/bookings/{reference}/confirmation', [BookingController::class, 'confirmation'])->name('bookings.confirmation');

/*
|--------------------------------------------------------------------------
| Admin back-office
|--------------------------------------------------------------------------
*/
Route::prefix('admin')->name('admin.')->middleware(['auth', 'admin'])->group(function () {
    // Use class name strings for admin controllers to avoid static analysis errors
    Route::get('/', 'App\\Http\\Controllers\\Admin\\DashboardController')->name('dashboard');

    Route::get('bookings', ['App\\Http\\Controllers\\Admin\\BookingController', 'index'])->name('bookings.index');
    Route::patch('bookings/{booking}', ['App\\Http\\Controllers\\Admin\\BookingController', 'update'])->name('bookings.update');
});

require __DIR__.'/auth.php';
