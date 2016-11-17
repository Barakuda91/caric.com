<?php
class IndexController extends Zend_Controller_Action
{
    public $result = [];
    public $autorized;
    public $autorizeEmailId;

    
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
            $this->autorizeEmailId = $auth->getIdentity();
            $this->autorized = true;
        } else {
            $this->view->autorizated = false;
            $this->autorizeEmailId = '';
            $this->autorized = false;
        }
    }

    // index action
    public function indexAction()
    {
        $resourses = new Resourses;
        $makes = $resourses->getListMakes();
        $this->view->makes = $makes;

    }

    /* personal cab data */
    public function personalAction()
    {
        if (!$this->autorized) {
            $this->redirect('/');
        } else {
            $user = new User($this->autorizeEmailId);
            $this->view->userData = $user;
            $this->view->htmlMenu = $this->renderPersonalCabTopMenu();
            $this->_helper->viewRenderer('/personalcab/personal');
        }
    }
    /* personal cab adverts */
    public function advertsAction()
    {
        if (!$this->autorized) {
            $this->redirect('/');
        }

        $this->view->htmlMenu = $this->renderPersonalCabTopMenu();
        $this->_helper->viewRenderer('/personalcab/adverts');
    }

    /* personal cab messages */
    public function messagesAction()
    {
        if (!$this->autorized) {
            $this->redirect('/');
        }

        $this->view->htmlMenu = $this->renderPersonalCabTopMenu();
        $this->_helper->viewRenderer('/personalcab/messages');
    }

    /* personal cab settings */
    public function settingsAction()
    {
        if (!$this->autorized) {
            $this->redirect('/');
        }

        $this->view->htmlMenu = $this->renderPersonalCabTopMenu();
        $this->_helper->viewRenderer('/personalcab/settings');
    }

    private function renderPersonalCabTopMenu()
    {
        $urlParams = $this->getAllParams();
        $this->view->currentUrl = $urlParams[1] ? $urlParams[1] : 'user';
        $html = $this->view->render('index/personalcab/userCabTopMenu.phtml');

        return $html;
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
