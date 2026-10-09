@php
    $font = "'Instrument Sans', 'Segoe UI', Helvetica, Arial, sans-serif";
    $mono = "'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace";
    $details = [
        'Date' => 'October 30–31, 2026',
        'Venue' => 'Marinduque State University',
        'Name' => $participant->fullName(),
        'Address' => "{$participant->barangay}, {$participant->municipality}, Marinduque",
        'Contact' => $participant->contact_number,
    ];
@endphp
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="color-scheme" content="dark">
    <meta name="supported-color-schemes" content="dark">
    <title>You're registered for Marinduque Innovation Fest 2026</title>
</head>
<body style="margin: 0; padding: 0; background-color: #050508; font-family: {{ $font }};">
    <div style="display: none; max-height: 0; overflow: hidden;">
        Your Innovation Fest ID is {{ $participant->fest_id }}. Show your QR code at the registration desk.
    </div>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #050508;">
        <tr>
            <td align="center" style="padding: 32px 16px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 560px;">
                    {{-- Header --}}
                    <tr>
                        <td align="center" style="padding: 8px 0 24px;">
                            <img src="{{ $message->embed(resource_path('images/mail/logo-wordmark.png')) }}" alt="Marinduque Innovation Fest 2026" width="260" style="display: block; width: 260px; max-width: 100%; height: auto; border: 0;">
                        </td>
                    </tr>

                    {{-- Card --}}
                    <tr>
                        <td style="background-color: #121118; border: 1px solid #26252E; border-radius: 20px; overflow: hidden;">
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td style="padding: 36px 32px 8px;">
                                        <p style="margin: 0; font-size: 12px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #6FD66A;">
                                            Registration confirmed
                                        </p>
                                        <h1 style="margin: 10px 0 0; font-size: 28px; line-height: 1.25; font-weight: 800; color: #FFFFFF;">
                                            You're in, {{ $participant->first_name }}!
                                        </h1>
                                        <p style="margin: 14px 0 0; font-size: 15px; line-height: 1.6; color: #B4B4BE;">
                                            Thank you for registering for the Marinduque Innovation Fest 2026. Here is your event pass — keep it handy for the festival.
                                        </p>
                                    </td>
                                </tr>

                                {{-- Ticket --}}
                                <tr>
                                    <td style="padding: 24px 32px;">
                                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #FFFFFF; border-radius: 16px;">
                                            <tr>
                                                <td align="center" style="padding: 28px 24px 20px;">
                                                    <img src="{{ $message->embedData($qrCodePng, $participant->fest_id.'.png', 'image/png') }}" alt="QR code for {{ $participant->fest_id }}" width="220" height="220" style="display: block; width: 220px; height: 220px; border: 0;">
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 0 24px;">
                                                    <div style="border-top: 2px dashed #D9D9E0; font-size: 0; line-height: 0;">&nbsp;</div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td align="center" style="padding: 18px 24px 26px;">
                                                    <p style="margin: 0; font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #6B6B78;">
                                                        Innovation Fest ID
                                                    </p>
                                                    <p style="margin: 6px 0 0; font-family: {{ $mono }}; font-size: 28px; font-weight: 700; letter-spacing: 2px; color: #0A1F44;">
                                                        {{ $participant->fest_id }}
                                                    </p>
                                                    <p style="margin: 6px 0 0; font-size: 14px; color: #3F3F4A;">
                                                        {{ $participant->fullName() }}
                                                    </p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>

                                {{-- Details --}}
                                <tr>
                                    <td style="padding: 0 32px;">
                                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                                            @foreach ($details as $label => $value)
                                                <tr>
                                                    <td valign="top" width="96" style="padding: 12px 0; border-bottom: 1px solid #26252E; font-size: 12px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: #7E7E8A;">
                                                        {{ $label }}
                                                    </td>
                                                    <td valign="top" style="padding: 12px 0; border-bottom: 1px solid #26252E; font-size: 14px; color: #FFFFFF;">
                                                        {{ $value }}
                                                    </td>
                                                </tr>
                                            @endforeach
                                        </table>
                                    </td>
                                </tr>

                                {{-- Reminder --}}
                                <tr>
                                    <td style="padding: 24px 32px 36px;">
                                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #24160B; border: 1px solid #5C3210; border-radius: 12px;">
                                            <tr>
                                                <td style="padding: 16px 18px; font-size: 14px; line-height: 1.6; color: #FFD9BF;">
                                                    <strong style="color: #FFFFFF;">On the event day,</strong> present this QR code at the registration desk. A copy is attached to this email in case you need to print it.
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    {{-- Footer --}}
                    <tr>
                        <td align="center" style="padding: 28px 16px 8px;">
                            <p style="margin: 0; font-size: 13px; font-weight: 700; color: #D4D4DA;">
                                DOST MIMAROPA – PSTO Marinduque
                            </p>
                            <p style="margin: 8px 0 0; font-size: 12px; line-height: 1.6; color: #6B6B78;">
                                You received this email because you registered for the Marinduque Innovation Fest 2026 using {{ $participant->email }}.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
