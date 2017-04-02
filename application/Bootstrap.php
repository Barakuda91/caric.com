<?php

class Bootstrap extends Zend_Application_Bootstrap_Bootstrap
{
    protected function _initDoctype()
    {
        $this->bootstrap('view');
        $view = $this->getResource('view');
        $view->doctype('XHTML1_STRICT');
        /* hide all error and redirect to main page disable on test server enable on live */
        //   $frontController = Zend_Controller_Front::getInstance();
        //   $frontController->setParam('useDefaultControllerAlways', true);
    }
     
    public function _initRoute() {

        try {
            /* Get default route */
            $router = Zend_Controller_Front::getInstance()->getRouter();

            /* Set action for POST requests */
            $routeAjax = new Zend_Controller_Router_Route_Regex(
                '(ajax)',
                [
                    'controller' => 'ajax',
                    'action' => 'ajax'
                ]
            );

            $router->addRoute('postsCall', $routeAjax);

            /* personal user account( pers data) */
            $routeUser = new Zend_Controller_Router_Route_Regex(
                '(user)',
                [
                    'controller' => 'index',
                    'action' => 'personal'
                ]
            );


            $router->addRoute('routeUser', $routeUser);

            /* personal user account(adverts) */
            $routeUserAdverts = new Zend_Controller_Router_Route_Regex(
                '(user/adverts)(/[0-9]+)?',
                [
                    'controller' => 'index',
                    'action' => 'adverts'
                ],
                [
                    2 => 'page'
                ]

            );

            $router->addRoute('routeUserAdverts', $routeUserAdverts);

            /* personal user account(Messages) */
            $routeUserMessages = new Zend_Controller_Router_Route_Regex(
                '(user/messages)',
                [
                    'controller' => 'index',
                    'action' => 'messages'
                ]
            );

            $router->addRoute('routeUserMessages', $routeUserMessages);


            /* personal user account(Settings) */
            $routeUserSettings = new Zend_Controller_Router_Route_Regex(
                '(user/settings)',
                [
                    'controller' => 'index',
                    'action' => 'settings'
                ]
            );

            $router->addRoute('routeUserSettings', $routeUserSettings);


            /* add new ad */
            $routeAdvert = new Zend_Controller_Router_Route_Regex(
                '(add)',
                [
                    'controller' => 'index',
                    'action' => 'add'
                ]
            );

            $router->addRoute('routeAdvert', $routeAdvert);

            /* edit advert */
            $routeEditAdvert = new Zend_Controller_Router_Route_Regex(
                '(edit)/([0-9]+)',
                [
                    'controller' => 'index',
                    'action' => 'editadvert',
                ],
                [
                    2 => 'advertId'
                ]
            );

            $router->addRoute('routeEditAdvert', $routeEditAdvert);

            /* Set action for TEST requests */
            $routeTest = new Zend_Controller_Router_Route_Regex(
                '(test)',
                [
                    'controller' => 'index',
                    'action' => 'test'
                ]
            );

            $router->addRoute('testCall', $routeTest);

            /* Set action for render main page resulst */
            $data = [
                'tires', 'wheels', 'makes', 'spacers', 'brands'
            ];
            $i = 0;
            foreach ($data as $key => $item) {
                $urlRender = new Zend_Controller_Router_Route_Regex(
                    '(' . $item . ')(_p[0-9]*)?',
                    [
                        'controller' => 'index',
                        'action' => 'rendermain',
                        'urlParam' => $item,
                    ]
                );
                $router->addRoute('mainpage_' . $i, $urlRender);
                $i++;
            }
        } catch (Exception $e) {
            var_dump($e);
        }

    }
}


