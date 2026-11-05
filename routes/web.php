<?php
use Inertia\Inertia;
use App\Http\Controllers\Account\BookingController as AccountBookingController;
use App\Http\Controllers\Admin\BookingController as AdminBookingController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\DriverController;
use App\Http\Controllers\Admin\NotificationController as AdminNotificationController;
use App\Http\Controllers\Admin\VehicleController as AdminVehicleController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\Admin\ContactMessageController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\TransferController;
use App\Http\Controllers\VehicleController;
use App\Http\Controllers\VillaController;
use App\Http\Controllers\Admin\ReviewController as AdminReviewController;
use App\Http\Controllers\ReviewController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\GalleryController;
use App\Http\Controllers\Admin\GalleryController as AdminGalleryController;
use App\Http\Controllers\VerificationController;
use App\Http\Controllers\Admin\VerificationController as AdminVerificationController;
use App\Http\Controllers\TestimonialController;
use App\Http\Controllers\Admin\TestimonialController as AdminTestimonialController;
use App\Http\Controllers\PolicyController;
use App\Http\Controllers\SitemapController;


/*
|--------------------------------------------------------------------------
| Public booking site
|--------------------------------------------------------------------------
*/
Route::get('/', \App\Http\Controllers\WelcomeController::class)->name('welcome');
Route::get('/home', HomeController::class)->name('home');

Route::redirect('/destinations', '/contact', 301);
Route::get('/contact', [ContactController::class, 'show'])->name('contact');
Route::post('/contact', [ContactController::class, 'store'])->middleware('throttle:5,10')->name('contact.store');

Route::inertia('/about', 'About')->name('about');

Route::get('/car-hire', [VehicleController::class, 'index'])->name('vehicles.index');
Route::get('/car-hire/{vehicle}', [VehicleController::class, 'show'])->name('vehicles.show');

Route::get('/airport-transfers', [TransferController::class, 'index'])->name('transfers.index');

Route::get('/villas', [VillaController::class, 'index'])->name('villas.index');
Route::get('/villas/{villa:slug}', [VillaController::class, 'show'])->name('villas.show');

Route::redirect('/experiences', '/gallery', 301);
Route::get('/gallery', [GalleryController::class, 'index'])->name('gallery');
Route::get('/gallery/photo/{photo}', [GalleryController::class, 'photo'])->name('gallery.photo');

Route::get('/experiences/{tour:slug}/review', [ReviewController::class, 'create'])->name('reviews.create');
Route::post('/experiences/{tour:slug}/review', [ReviewController::class, 'store'])->middleware('throttle:10,1')->name('reviews.store');
Route::redirect('/guest-stories', '/testimonials', 301);

Route::get('/testimonials', [TestimonialController::class, 'index'])->name('testimonials');
Route::get('/testimonials/featured', [TestimonialController::class, 'featured'])->name('testimonials.featured');
Route::post('/testimonials', [TestimonialController::class, 'store'])->middleware('throttle:5,10')->name('testimonials.store');

Route::inertia('/privacy', 'Privacy')->name('privacy');
Route::get('/terms', [PolicyController::class, 'terms'])->name('terms');

Route::get('/sitemap.xml', [SitemapController::class, 'sitemap'])->name('sitemap');
Route::get('/robots.txt', [SitemapController::class, 'robots'])->name('robots');

Route::get('/verify', [VerificationController::class, 'lookup'])->name('verify.lookup');
Route::post('/verify', [VerificationController::class, 'start'])->middleware('throttle:10,1')->name('verify.start');
Route::get('/verify/{reference}', [VerificationController::class, 'show'])->name('verify.show');
Route::post('/verify/{reference}/details', [VerificationController::class, 'details'])->name('verify.details');
Route::post('/verify/{reference}/document', [VerificationController::class, 'document'])->name('verify.document');
Route::post('/verify/{reference}/selfie', [VerificationController::class, 'selfie'])->name('verify.selfie');
Route::post('/verify/{reference}/send-code', [VerificationController::class, 'sendCode'])->middleware('throttle:5,1')->name('verify.send-code');
Route::post('/verify/{reference}/check-code', [VerificationController::class, 'checkCode'])->middleware('throttle:10,1')->name('verify.check-code');
Route::post('/verify/{reference}/submit', [VerificationController::class, 'submit'])->name('verify.submit');

Route::get('/booking/quote', [BookingController::class, 'quote'])->middleware('throttle:60,1')->name('bookings.quote');

Route::get('/book/{type}/{id}', [BookingController::class, 'create'])->name('bookings.create');
Route::post('/bookings', [BookingController::class, 'store'])->name('bookings.store');
Route::get('/bookings/{reference}/confirmation', [BookingController::class, 'confirmation'])->name('bookings.confirmation');

Route::middleware('auth')->group(function () {
    Route::get('/email/verify', [\App\Http\Controllers\AuthController::class, 'verifyNotice'])->name('verification.notice');
    Route::get('/email/verify/{id}/{hash}', [\App\Http\Controllers\AuthController::class, 'verifyEmail'])->middleware('signed')->name('verification.verify');
    Route::post('/email/verification-notification', [\App\Http\Controllers\AuthController::class, 'resendVerification'])->middleware('throttle:3,1')->name('verification.send');
});

Route::middleware(['auth', 'verified'])->prefix('account')->name('account.')->group(function () {
    Route::get('/bookings', [AccountBookingController::class, 'index'])->name('bookings');
});

/*
|--------------------------------------------------------------------------
| Admin back-office
|--------------------------------------------------------------------------
*/
Route::prefix('admin')->name('admin.')->middleware(['auth', 'admin'])->group(function () {
    Route::get('/', AdminDashboardController::class)->name('dashboard');

    Route::get('bookings', [AdminBookingController::class, 'index'])->name('bookings.index');
    // "export" must come before "{booking}" or it would be read as a booking id
    Route::get('bookings/export', [AdminBookingController::class, 'export'])->name('bookings.export');
    Route::get('bookings/{booking}', [AdminBookingController::class, 'show'])->name('bookings.show');
    Route::patch('bookings/{booking}', [AdminBookingController::class, 'update'])->name('bookings.update');
    Route::delete('bookings/{booking}', [AdminBookingController::class, 'destroy'])->name('bookings.destroy');
    Route::post('bookings/{booking}/assign-transfer-driver', [AdminNotificationController::class, 'assignTransferDriver'])->name('bookings.assign-transfer-driver');
    Route::get('verifications/{verification}/image/{kind}', [AdminVerificationController::class, 'image'])->name('verifications.image');
    Route::post('verifications/{verification}/decide', [AdminVerificationController::class, 'decide'])->name('verifications.decide');
    Route::post('verifications/{verification}/phone', [AdminVerificationController::class, 'verifyPhone'])->name('verifications.phone');
    Route::delete('verifications/{verification}', [AdminVerificationController::class, 'destroy'])->name('verifications.destroy');

    Route::get('vehicles', [AdminVehicleController::class, 'index'])->name('vehicles.index');
    Route::get('vehicles/create', [AdminVehicleController::class, 'create'])->name('vehicles.create');
    Route::post('vehicles', [AdminVehicleController::class, 'store'])->name('vehicles.store');
    Route::post('vehicles/{vehicle}/assign-driver', [AdminVehicleController::class, 'assignDriver'])->name('vehicles.assign-driver');
    Route::post('vehicles/{vehicle}/deassign-driver', [AdminVehicleController::class, 'deassignDriver'])->name('vehicles.deassign-driver');

    Route::get('drivers', [DriverController::class, 'index'])->name('drivers.index');
    Route::get('drivers/create', [DriverController::class, 'create'])->name('drivers.create');
    Route::post('drivers', [DriverController::class, 'store'])->name('drivers.store');
    Route::patch('drivers/{driver}/assign', [DriverController::class, 'assign'])->name('drivers.assign');

    Route::get('notifications', [AdminNotificationController::class, 'index'])->name('notifications.index');
    Route::patch('notifications/{notification}/mark-sent', [AdminNotificationController::class, 'markSent'])->name('notifications.mark-sent');

    Route::get('reviews', [AdminReviewController::class, 'index'])->name('reviews.index');
    Route::patch('reviews/{review}/approve', [AdminReviewController::class, 'approve'])->name('reviews.approve');
    Route::patch('reviews/{review}/reject', [AdminReviewController::class, 'reject'])->name('reviews.reject');
    Route::patch('reviews/{review}/reply', [AdminReviewController::class, 'reply'])->name('reviews.reply');
    Route::delete('reviews/{review}', [AdminReviewController::class, 'destroy'])->name('reviews.destroy');

    Route::get('messages', [ContactMessageController::class, 'index'])->name('messages.index');
    Route::patch('messages/{message}/toggle-read', [ContactMessageController::class, 'toggleRead'])->name('messages.toggle-read');
    Route::delete('messages/{message}', [ContactMessageController::class, 'destroy'])->name('messages.destroy');

    Route::get('gallery', [AdminGalleryController::class, 'index'])->name('gallery.index');
    Route::post('gallery', [AdminGalleryController::class, 'store'])->name('gallery.store');
    Route::patch('gallery/{photo}', [AdminGalleryController::class, 'update'])->name('gallery.update');
    Route::patch('gallery/{photo}/move', [AdminGalleryController::class, 'move'])->name('gallery.move');
    Route::delete('gallery/{photo}', [AdminGalleryController::class, 'destroy'])->name('gallery.destroy');

    Route::get('testimonials', [AdminTestimonialController::class, 'index'])->name('testimonials.index');
    Route::post('testimonials', [AdminTestimonialController::class, 'store'])->name('testimonials.store');
    Route::patch('testimonials/{testimonial}/approve', [AdminTestimonialController::class, 'toggleApproved'])->name('testimonials.approve');
    Route::patch('testimonials/{testimonial}/feature', [AdminTestimonialController::class, 'toggleFeatured'])->name('testimonials.feature');
    Route::delete('testimonials/{testimonial}', [AdminTestimonialController::class, 'destroy'])->name('testimonials.destroy');
});

require __DIR__.'/auth.php';