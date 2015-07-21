<?php

$config = [
    'controllerMap' => [
        //'presql' => '\luya\commands\PresqlController', // remove in 1.0.0-alpha10
        'migrate' => '\luya\commands\MigrateController',
        'exec' => '\luya\commands\ExecutableController',
        'crud' => '\luya\commands\CrudController',
        'module' => '\luya\commands\ModuleController',
        'command' => '\luya\commands\CommandController',
    ],
    'components' => [
        'mail' => [
            'class' => '\luya\components\Mail',
        ],
        'errorHandler' => [
            'class' => '\luya\base\cli\ErrorHandler',
            'memoryReserveSize' => 0,
        ],
    ],
    'bootstrap' => [
        'luya\base\cli\Bootstrap',
    ],
    'timezone' => 'Europe/Berlin',
];

return $config;
