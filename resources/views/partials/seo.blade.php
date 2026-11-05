@php($seo = \App\Support\Seo::forRequest(request()))
<meta name="description" content="{{ $seo['description'] }}">
<meta name="robots" content="{{ $seo['robots'] }}">
<meta name="theme-color" content="#0B7C8C">
<link rel="canonical" href="{{ $seo['url'] }}">

<meta property="og:type" content="website">
<meta property="og:site_name" content="{{ $seo['site_name'] }}">
<meta property="og:title" content="{{ $seo['title'] }}">
<meta property="og:description" content="{{ $seo['description'] }}">
<meta property="og:url" content="{{ $seo['url'] }}">
<meta property="og:image" content="{{ $seo['image'] }}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:locale" content="en_KE">

<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{{ $seo['title'] }}">
<meta name="twitter:description" content="{{ $seo['description'] }}">
<meta name="twitter:image" content="{{ $seo['image'] }}">

@if ($seo['jsonld'])
<script type="application/ld+json">{!! json_encode($seo['jsonld'], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) !!}</script>
@endif
