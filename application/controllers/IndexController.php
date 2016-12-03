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
        $this->config = new Zend_Config(include APPLICATION_PATH . '/configs/front.php', false);

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
        $resourses  = new Resourses($this->config);

        $topTires   = $this->config->index->top->tires->toArray();
        $topWheels  = $this->config->index->top->wheels->toArray();
        $topBrands  = $this->config->index->top->brands->toArray();
        $topSpaces  = $this->config->index->top->spaces->toArray();

        $topAuto = $resourses->getManufactureList('car', $this->config->index->top->auto->toArray());

        $this->view->topAuto    = $topAuto;
        $this->view->topTires   = $topTires;
        $this->view->topWheels  = $topWheels;
        $this->view->topBrands  = $topBrands;
        $this->view->topSpaces  = $topSpaces;

    }

    /* render url data from main page 1 view */
    public function rendermainAction()
    {
        $resourses  = new Resourses($this->config);
        $currentPage = 1;

        switch ($this->getParam('urlParam')) {
            // разболтовка проставок
            case 'spacers':
                $this->view->title = 'Виды проставок';

            break;
            // разболтовка дисков
            case 'wheels':
                $this->view->title = 'Виды дисков';
                $type = 'wheel';
            break;
            // производители дисков
            case 'brands':
                $this->view->title = 'Производители дисков';

            break;
            // производители шин
            case 'tires':
                $this->view->title = 'Производители шин';
                $type = 'tire';
            break;
            // производители автомобилей
            case 'makes':
            default:
                $this->view->title = 'Производители автомобилей';
                $type = 'car';
            break;
        }

        if($type) {
            $allList = $resourses->getManufactureList($type, null, $currentPage);
            $this->view->data = $allList;
        } else {
            $this->view->title = 'Результат отсутствует';
            $this->view->data = [];
        }

        $this->_helper->viewRenderer('/mainpagetemplates/mainpagerender');
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
        $html = $this->view->render('index/personalcab/usercabtopmenu.phtml');

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
