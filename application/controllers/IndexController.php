<?php
class IndexController extends Zend_Controller_Action
{
    public $result = [];
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
        $this->config = new Zend_Config(include APPLICATION_PATH . '/configs/front.php', false);

        $this->view->serverPort = $this->config->serverPort;
        $this->view->siteUtl = $this->config->siteUtl;

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
        $resourses  = new Resourses($this->config);

        $topTires   = $this->config->index->top->tires->toArray();
        $topWheels  = $this->config->index->top->wheels->toArray();
        $topBrands  = $this->config->index->top->brands->toArray();
        $topSpaces  = $this->config->index->top->spaces->toArray();

        $topAuto = $resourses->getManufactureList('car', $this->config->index->top->auto->toArray());

        $topAutoJson = '';

        foreach ($topAuto as $item) {
            $length = strlen($item['img_position']);
            $id = '';
            switch ($length) {
                case 1: $id .= '0';
                case 2: $id .= '0';
            }
            $id .= $item['img_position'];
            $topAutoJson .= $id;
        }
        $this->view->topAutoJson = $topAutoJson;

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
        $urlParams = $this->getAllParams();
        $typePage = $urlParams['urlParam'];

        if (isset($urlParams[2])) {
            $currentPage = (int) str_replace('_p','',$urlParams[2]);
            $currentPage = ($currentPage) ? $currentPage : 1;
        }
        switch ($typePage) {
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
            $this->view->htmlMenu = $this->renderPersonalCabTopMenu();
            $this->_helper->viewRenderer('/personalcab/personal');
        }
    }

    /**
     * редактировать
     */
    public function editadvertAction()
    {
        if (!$this->autorized) {
            $this->redirect('/');
        }

        $advertId = $this->getParam('advertId');
        $user = new User($this->userObj->email);
        $advertsRaw = $user->getUserAdverts($advertId);
        $advertFormatted = $this->formatAdverts($advertsRaw);
        $this->view->adverstInfo = $advertFormatted;
        $this->_helper->viewRenderer('/editadvert');
    }

    /* personal cab adverts */
    public function advertsAction()
    {
        if (!$this->autorized) {
            $this->redirect('/');
        }
        $user = new User($this->userObj->email);
        $advertsRaw = $user->getUserAdverts();
        $advertFormatted = $this->formatAdverts($advertsRaw);
        $urlParams = $this->getAllParams();

        $urlPage = (isset($urlParams['page'])) ? substr($urlParams['page'], 1) : 1;
        $page = $urlPage;
        $itemCount = self::SHOW_ITEMS_ON_PAGE;
        $paginator = new Zend_Paginator(
            new Zend_Paginator_Adapter_Array($advertFormatted)
        );
        $paginator->setItemCountPerPage($itemCount);
        $paginator->setCurrentPageNumber($page);

        
        $rawItems = $paginator->getCurrentItems();
        $formattedItems = [];
        foreach ($rawItems as $key => $value) {
            $formattedItems[] = $value;
        }
        $params = [
            'currentPageNumber' => $paginator->getCurrentPageNumber(),
            'pages' => $paginator->getPages(),
        ];

        $this->view->adverstInfo = $formattedItems;
        $this->view->paginatorMenu = $this->renderPaginator($params);
        $this->view->htmlMenu = $this->renderPersonalCabTopMenu();
        $this->_helper->viewRenderer('/personalcab/adverts');

    }

    private function formatAdverts($data)
    {
        $result = [];
        try {
            if (is_array($data)) {
                foreach ($data as $key => $value) {
                    $result[$key] = array_merge(
                        ['header_title' => $this->getHeaderTitleNameByType($value)],
                        ['advert_price_formatted' => $this->getFormattedPrice($value)],
                        $value
                    );
                }
            }

        } catch (Exception $e) {

        }

        return $result;
    }

    /**
     * @param $value
     */
    private function getFormattedPrice($value)
    {
        switch ($value['advert_currency']) {
            case Resourses::CURRENCY_UAH_CODE:
                $currency = Resourses::CURRENCY_UAH_NAME;
                break;

            case Resourses::CURRENCY_USD_CODE:
                $currency = Resourses::CURRENCY_USD_NAME;
                break;

            case Resourses::CURRENCY_EUR_CODE:
                $currency = Resourses::CURRENCY_EUR_NAME;
                break;
        }
        $formattedPrice = number_format($value['advert_price'], 0) . ' ' . $currency;

        return $formattedPrice;
    }

    /**
     * генерирует имя обьявления зависит от типа обьяввления
     *
     * @param $value
     *
     * @return string
     */
    private function getHeaderTitleNameByType($value)
    {
        $headerTitle = '';
        if (isset($value['advert_type'])) {
            $parts = [];
            switch ($value['advert_type']) {
                case 'wheels':
                    $parts[] = str_replace('_', ' ', $value['manufacture_title']);
                    $parts[] = $value['model_title'];
                    $parts[] = 'R' . $value['wheels_w_dia'];
                    $parts[] = $value['wheels_nn'] . 'x' . $value['wheels_pcd'];

                    $headerTitle = implode(' ', $parts);
                    break;

                case 'tires':
                    $headerTitle = $value['tires_wt'] . '/' . $value['tires_ph'] . ' R' . $value['tires_t_dia'];
                    break;

                case 'spacers':
                    break;

                default:
                    break;
            }
        }

        return $headerTitle;
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

    /**
     * Render paginator menu
     *
     * @param $params
     *
     * @return string
     */
    private function renderPaginator($params)
    {
        $this->view->params = $params;
        $html = $this->view->render('index/personalcab/paginatorMenu.phtml');

        return $html;
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
