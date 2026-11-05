<?php

namespace App\Support;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * Sends text messages through Africa's Talking (africastalking.com).
 * It only works once AT_USERNAME and AT_API_KEY are set in the environment.
 */
class Sms
{
    public static function configured(): bool
    {
        return filled(config('verification.sms.username')) && filled(config('verification.sms.api_key'));
    }

    public static function send(string $to, string $message): bool
    {
        if (! self::configured()) {
            return false;
        }

        $base = config('verification.sms.sandbox')
            ? 'https://api.sandbox.africastalking.com'
            : 'https://api.africastalking.com';

        $payload = [
            'username' => config('verification.sms.username'),
            'to' => $to,
            'message' => $message,
        ];

        if (filled(config('verification.sms.sender'))) {
            $payload['from'] = config('verification.sms.sender');
        }

        try {
            $response = Http::asForm()
                ->withHeaders(['apiKey' => config('verification.sms.api_key'), 'Accept' => 'application/json'])
                ->timeout(15)
                ->post($base.'/version1/messaging', $payload);

            $status = (int) data_get($response->json(), 'SMSMessageData.Recipients.0.statusCode', 0);

            // 100 processed, 101 sent, 102 queued
            return $response->successful() && in_array($status, [100, 101, 102], true);
        } catch (\Throwable $e) {
            Log::warning('SMS send failed: '.$e->getMessage());

            return false;
        }
    }
}
