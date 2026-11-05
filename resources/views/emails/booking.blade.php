<!doctype html>
<html>
<body style="margin:0;background:#f4f1ea;font-family:Arial,Helvetica,sans-serif;color:#151515;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f1ea;padding:24px 12px;">
<tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#ffffff;border-radius:14px;overflow:hidden;">
    <tr><td style="background:#0B7C8C;padding:22px 28px;">
        <div style="color:#ffffff;font-size:20px;font-weight:bold;">Biryaa Travels</div>
        <div style="color:#FCCA14;font-size:12px;font-style:italic;margin-top:2px;">Twende Tuzuru</div>
    </td></tr>
    <tr><td style="height:4px;background:#FCCA14;"></td></tr>
    <tr><td style="padding:28px;">
        <h1 style="margin:0 0 10px;font-size:20px;color:#0B7C8C;">{{ $d['heading'] }}</h1>
        <p style="margin:0 0 20px;font-size:14px;line-height:1.6;color:#333;">{{ $d['intro'] }}</p>

        <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;border-top:1px solid #eee;">
            @foreach ($d['rows'] as $label => $value)
                @if (filled($value))
                <tr>
                    <td style="padding:9px 0;border-bottom:1px solid #eee;color:#777;width:38%;vertical-align:top;">{{ $label }}</td>
                    <td style="padding:9px 0;border-bottom:1px solid #eee;font-weight:bold;vertical-align:top;">{{ $value }}</td>
                </tr>
                @endif
            @endforeach
        </table>

        @if (! empty($d['button']))
            <p style="margin:26px 0 6px;">
                <a href="{{ $d['button']['url'] }}" style="display:inline-block;background:#0B7C8C;color:#ffffff;text-decoration:none;padding:12px 26px;border-radius:999px;font-size:14px;font-weight:bold;">{{ $d['button']['label'] }}</a>
            </p>
        @endif

        @if (! empty($d['note']))
            <p style="margin:18px 0 0;font-size:13px;line-height:1.6;color:#555;">{{ $d['note'] }}</p>
        @endif
    </td></tr>
    <tr><td style="background:#f4f1ea;padding:16px 28px;font-size:12px;color:#777;line-height:1.6;">
        Questions? WhatsApp us on +254 728 769 798 or email info@biryaatravelsltd.co.ke<br>
        P.O. Box 3339-80100, Mombasa
    </td></tr>
</table>
</td></tr>
</table>
</body>
</html>
