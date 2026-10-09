<?php

namespace App\Support;

use BaconQrCode\Common\ErrorCorrectionLevel;
use BaconQrCode\Encoder\Encoder;
use GdImage;

/**
 * Renders a branded QR code PNG: dot modules, logo-colored finder eyes and the
 * Innovation Fest logo in the center.
 */
class FestQrCode
{
    private const QUIET_ZONE = 3;

    /** Supersampling factor used for anti-aliased edges. */
    private const SCALE = 4;

    private const DOT_COLOR = [10, 31, 68];

    private const EYE_OUTER_COLOR = [0, 120, 217];

    private const EYE_INNER_COLOR = [241, 94, 0];

    public static function png(string $data, int $size = 600): string
    {
        $matrix = Encoder::encode($data, ErrorCorrectionLevel::H())->getMatrix();
        $modules = $matrix->getWidth();
        $total = $modules + self::QUIET_ZONE * 2;

        $canvas = $size * self::SCALE;
        $cell = $canvas / $total;

        $image = imagecreatetruecolor($canvas, $canvas);
        imagefill($image, 0, 0, imagecolorallocate($image, 255, 255, 255));

        $logoModules = self::logoModules($modules);
        $logoStart = intdiv($modules - $logoModules, 2);
        $logoEnd = $logoStart + $logoModules;

        $dot = imagecolorallocate($image, ...self::DOT_COLOR);

        for ($y = 0; $y < $modules; $y++) {
            for ($x = 0; $x < $modules; $x++) {
                if ($matrix->get($x, $y) !== 1 || self::isFinder($x, $y, $modules)) {
                    continue;
                }

                if ($x >= $logoStart && $x < $logoEnd && $y >= $logoStart && $y < $logoEnd) {
                    continue;
                }

                // Modules must touch: gaps between them break some scanners.
                self::roundedRect(
                    $image,
                    ($x + self::QUIET_ZONE) * $cell,
                    ($y + self::QUIET_ZONE) * $cell,
                    $cell,
                    $cell * 0.32,
                    $dot,
                );
            }
        }

        foreach ([[0, 0], [$modules - 7, 0], [0, $modules - 7]] as [$ex, $ey]) {
            self::drawEye($image, ($ex + self::QUIET_ZONE) * $cell, ($ey + self::QUIET_ZONE) * $cell, $cell);
        }

        self::drawLogo($image, ($logoStart + self::QUIET_ZONE) * $cell, $logoModules * $cell);

        $output = imagecreatetruecolor($size, $size);
        imagecopyresampled($output, $image, 0, 0, 0, 0, $size, $size, $canvas, $canvas);

        ob_start();
        imagepng($output, null, 9);

        return (string) ob_get_clean();
    }

    /**
     * Render the QR code as a printable pass with the ID and name underneath.
     */
    public static function ticketPng(string $data, string $name, int $width = 600): string
    {
        $qr = imagecreatefromstring(self::png($data, $width));
        $height = (int) round($width * 1.42);

        $image = imagecreatetruecolor($width, $height);
        imagefill($image, 0, 0, imagecolorallocate($image, 255, 255, 255));
        imagecopy($image, $qr, 0, 0, 0, 0, $width, $width);

        $navy = imagecolorallocate($image, ...self::DOT_COLOR);
        $muted = imagecolorallocate($image, 107, 107, 120);
        $line = imagecolorallocate($image, 217, 217, 224);

        $margin = (int) round($width * 0.08);
        $dash = (int) round($width * 0.02);
        $lineY = (int) round($width * 1.02);
        imagesetthickness($image, max(2, (int) round($width / 300)));
        for ($x = $margin; $x < $width - $margin; $x += $dash * 2) {
            imageline($image, $x, $lineY, min($x + $dash, $width - $margin), $lineY, $line);
        }

        $bold = resource_path('fonts/IBMPlexMono-Bold.ttf');
        $medium = resource_path('fonts/IBMPlexMono-Medium.ttf');

        self::centeredText($image, 'INNOVATION FEST ID', $medium, $width * 0.028, $width * 1.12, $muted);
        self::centeredText($image, $data, $bold, $width * 0.075, $width * 1.24, $navy);
        self::centeredText($image, $name, $medium, $width * 0.034, $width * 1.33, $muted);

        ob_start();
        imagepng($image, null, 9);

        return (string) ob_get_clean();
    }

    private static function centeredText(GdImage $image, string $text, string $font, float $size, float $baseline, int $color): void
    {
        $maxWidth = imagesx($image) * 0.86;
        $box = imagettfbbox($size, 0, $font, $text);

        if ($maxWidth < $box[2] - $box[0]) {
            $size *= $maxWidth / ($box[2] - $box[0]);
            $box = imagettfbbox($size, 0, $font, $text);
        }

        $x = (imagesx($image) - ($box[2] - $box[0])) / 2 - $box[0];

        imagettftext($image, $size, 0, (int) round($x), (int) round($baseline), $color, $font, $text);
    }

    /**
     * Keep the logo area odd-sized and under ~9% of the modules, well within
     * the 30% that error correction level H can recover.
     */
    private static function logoModules(int $modules): int
    {
        $logo = (int) floor($modules * 0.3);

        return $logo % 2 === 0 ? $logo - 1 : $logo;
    }

    private static function isFinder(int $x, int $y, int $modules): bool
    {
        return ($x < 7 && $y < 7)
            || ($x >= $modules - 7 && $y < 7)
            || ($x < 7 && $y >= $modules - 7);
    }

    private static function drawEye(GdImage $image, float $left, float $top, float $cell): void
    {
        $outer = imagecolorallocate($image, ...self::EYE_OUTER_COLOR);
        $inner = imagecolorallocate($image, ...self::EYE_INNER_COLOR);
        $white = imagecolorallocate($image, 255, 255, 255);

        self::roundedRect($image, $left, $top, 7 * $cell, 2.4 * $cell, $outer);
        self::roundedRect($image, $left + $cell, $top + $cell, 5 * $cell, 1.6 * $cell, $white);
        self::roundedRect($image, $left + 2 * $cell, $top + 2 * $cell, 3 * $cell, 1 * $cell, $inner);
    }

    private static function drawLogo(GdImage $image, float $start, float $area): void
    {
        $white = imagecolorallocate($image, 255, 255, 255);
        self::roundedRect($image, $start, $start, $area, $area * 0.22, $white);

        $logo = imagecreatefrompng(resource_path('images/mail/logo-icon.png'));
        $logoWidth = imagesx($logo);
        $logoHeight = imagesy($logo);

        $box = $area * 0.86;
        $ratio = min($box / $logoWidth, $box / $logoHeight);
        $width = (int) round($logoWidth * $ratio);
        $height = (int) round($logoHeight * $ratio);

        imagealphablending($image, true);
        imagecopyresampled(
            $image,
            $logo,
            (int) round($start + ($area - $width) / 2),
            (int) round($start + ($area - $height) / 2),
            0,
            0,
            $width,
            $height,
            $logoWidth,
            $logoHeight,
        );
    }

    private static function roundedRect(GdImage $image, float $x, float $y, float $size, float $radius, int $color): void
    {
        $x1 = (int) round($x);
        $y1 = (int) round($y);
        $x2 = (int) round($x + $size) - 1;
        $y2 = (int) round($y + $size) - 1;
        $r = (int) round($radius);
        $d = $r * 2;

        imagefilledrectangle($image, $x1 + $r, $y1, $x2 - $r, $y2, $color);
        imagefilledrectangle($image, $x1, $y1 + $r, $x2, $y2 - $r, $color);
        imagefilledellipse($image, $x1 + $r, $y1 + $r, $d, $d, $color);
        imagefilledellipse($image, $x2 - $r, $y1 + $r, $d, $d, $color);
        imagefilledellipse($image, $x1 + $r, $y2 - $r, $d, $d, $color);
        imagefilledellipse($image, $x2 - $r, $y2 - $r, $d, $d, $color);
    }
}
