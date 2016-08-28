<?php
class IndexController extends Zend_Controller_Action
{
    public $result = [];
    public $autorized;

    public static $makes = [
        'ac' => 'ac',
        'acura' => 'acura',
        'audi' => 'audi',
        'aromeo' => 'aromeo',
        'alpina' => 'alpina',
        'as_martin' => 'as_martin',
        'bmw' => 'bmw',
        'bentley' => 'bentley',
        'bjc' => 'bjc',
        'tatra' => 'tatra',
        'bugatti' => 'bugatti',
        'venturi' => 'venturi',
        'wall' => 'wall',
        'venturi' => 'venturi',
        'byd' => 'byd',
        'cadilac' => 'cadilac',
        'chana' => 'chana',
        'shkoda' => 'shkoda',
        'suzuki' => 'suzuki',
        'chevrolet' => 'chevrolet',
        'volvo' => 'volvo',
        'daimler' => 'daimler',
        'daikin' => 'daikin',
        'eagle' => 'eagle',
        'ford' => 'ford',
        'ferrary' => 'ferrary',
        'ducati' => 'ducati',
        'iveco' => 'iveco',
        'fiat' => 'fiat',
        'chrisler' => 'chrisler',
        'geely' => 'geely',
    ];
    
    public function init()
    {
        ini_set('error_reporting', E_ALL);
        ini_set('display_errors', 1);
        ini_set('display_startup_errors', 1);

        $auth = Zend_Auth::getInstance();

        if ($auth->hasIdentity()) {
            $user = new User();
            $this->view->autorizated = true;
            $data = [];
            $data['email'] = $auth->getIdentity();
            $this->view->userName = $user->getUserData($data, 'flag');
            $this->autorized = true;
        } else {
            $this->view->autorizated = false;
            $this->autorized = false;
        }
    }

    // index action
    public function indexAction()
    {
        $this->view->makes = self::$makes;
    }

    // add new ad
    public function addAction()
    {
        if (!$this->autorized) {
            $this->redirect('/');
        }
    }

    // testing action
    public function testAction()
    {


    }

}
