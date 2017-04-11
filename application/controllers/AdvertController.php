<?php
class AdvertController extends Zend_Controller_Action
{
    public $autorized;
    public $autorizeEmailId;
    protected $userObj = null;

    const SHOW_ITEMS_ON_PAGE = 5;

    public function init()
    {
        ini_set('error_reporting', E_ALL);
        ini_set('display_errors', 1);
        ini_set('display_startup_errors', 1);

        $auth = Zend_Auth::getInstance();

        if ($auth->hasIdentity()) {
            $this->view->autorizated = true;
            $data = [];
            $data['email'] = $auth->getIdentity();
            $this->autorizeEmailId = $auth->getIdentity();
            $this->autorized = true;
            $user = new User($this->autorizeEmailId);
            $this->view->userData = $user;
            if (!$this->userObj) {
                $userData = $user->getUserData($data, 'flag');
                $userInfo = new stdClass();
                $userInfo->email = $data['email'];
                $userInfo->name = $userData['name'];
                $userInfo->id = $userData['id'];
                $this->userObj = $userInfo;
            }
        } else {
            $this->view->autorizated = false;
            $this->autorizeEmailId = '';
            $this->autorized = false;
        }
    }

    // index action
    public function indexAction()
    {
        $params = $this->getAllParams();

        $data = explode('-', $params['name']);
        $advertId = array_pop($data);
        $advertId = hexdec($advertId);
        $user = new User();
        $advertsRaw = $user->getUserAdverts($advertId);
        $advertFormatted = Resourses::formatAdverts($advertsRaw);

        if (!$advertFormatted) {
            $this->redirect('/');
        }
        $this->view->advertInfo = $advertFormatted;
        $this->view->params = $params;
        $this->view->userObj = $this->userObj;
    }



}
