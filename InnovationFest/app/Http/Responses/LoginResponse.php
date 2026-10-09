<?php

namespace App\Http\Responses;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;

class LoginResponse implements LoginResponseContract
{
    /**
     * Send booth staff to their booth and everyone else to the admin dashboard.
     *
     * @param  Request  $request
     */
    public function toResponse($request): JsonResponse|RedirectResponse
    {
        if ($request->wantsJson()) {
            return new JsonResponse(['two_factor' => false]);
        }

        if ($request->user()->isStaff()) {
            $request->session()->forget('url.intended');

            return to_route('booth.home');
        }

        return redirect()->intended(config('fortify.home'));
    }
}
