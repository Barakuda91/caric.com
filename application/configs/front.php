<?php
return [
    'siteUtl' => 'http://caric.com',
    'serverPort' => 8888,
    'socketPort' => 7788,
    // настройки вида главной страницы
    'index' => [
        'top' => [
            'tires' => [],
            'wheels' => [],
            'auto'  => [
                'VOLVO',
                'NISSAN',
                'TOYOTA',
                'VOLKSWAGEN',
                'OPEL',
                'FORD',
                'RENAULT',
                'PEUGEOT',
                'AUDI',
                'MERCEDES_BENZ',
                'FIAT',
                'BMW',
                'CHEVROLET',
                'MITSUBISHI',
            ],
            'brands' => [],
            'spaces' => []
        ]
    ],
    // настройки пагинации
    'pagination' => [
        // количество элементов на странице полных списков
        'manufactureList' => 25
    ]
];