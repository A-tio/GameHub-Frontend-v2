<?php
return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['GET', 'POST'],
    'allowed_origins' => ['http://localhost:5173'],
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['Content-Type', 'X-requested-with'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true, // This is critical for cookies and CSRF
];

