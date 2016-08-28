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

        /* personal user account */
        $routeUser = new Zend_Controller_Router_Route_Regex(
            '(user)',
            [
                'controller' => 'user',
                'action' => 'test'
            ]
        );

        $router->addRoute('routeUser', $routeUser);

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


