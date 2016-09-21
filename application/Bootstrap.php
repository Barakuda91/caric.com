<?php

class Bootstrap extends Zend_Application_Bootstrap_Bootstrap
{
    protected function _initDoctype()
    {
        $this->bootstrap('view');
        $view = $this->getResource('view');
        $view->doctype('XHTML1_STRICT');
    }
     
    public function _initRoute() {
        
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
            '(user/adverts)',
            [
                'controller' => 'index',
                'action' => 'adverts'
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

         /* Set action for TEST requests */
        $routeTest = new Zend_Controller_Router_Route_Regex(
            '(test)',
            [
                'controller' => 'index',
                'action' => 'test'
            ]
        );
       
        $router->addRoute('testCall', $routeTest);
    }
}


