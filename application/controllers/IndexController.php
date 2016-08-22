<?php

class IndexController extends Zend_Controller_Action
{
    public $result = [];

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

    }

    public function indexAction()
    {
        
        $this->view->baseUrl = Zend_Controller_Front::getInstance()->getBaseUrl();
        $this->view->makes = self::$makes;
    }

    public function ajaxAction() {
        $this->_helper->layout->disableLayout();
        $this->_helper->viewRenderer->setNoRender(true);
   
        $params = $this->getAllParams();
        
        if (isset($params['case'])) {
            switch ($params['case']) {
                case 'registerUser':
                    $this->result = $this->registerUser($params);
                    break;
                
                case 'loginUser':
                    $this->result = $this->loginUser($params);
                    break;
                
                case 'logoutUser':
                    $this->result = $this->logoutUser();
                    break;
                
                default:
                    $this->result = [];
                    break;
            }
        }
        /* disable feedback post*/
        header("Content-Type: text/json");
        echo json_encode($this->result);
    }
    
    private function logoutUser()
    {
        try {
            $result = false;
            $auth = Zend_Auth::getInstance();
            if ($auth->hasIdentity()) {
                $auth->clearIdentity();
                $result = true;
            }
        } catch (Exception $ex) {
            /* Here replace with Log call */
        }
        
        return $result;
    }
    
    /* Login user by email */
    private function loginUser($params) 
    {
        try {
            $result = [];
            $autorization = false;
            $data = [];
            $data['email'] = filter_var($params['email'], FILTER_VALIDATE_EMAIL); 
            $data['password'] = $this->generatePasswordHash($params['password']); 
            
            $userData = $this->getUserData($data);
            
            if ($userData && $userData['email'] != "") {
                $dbAdapter = Zend_Db_Table::getDefaultAdapter();
                $adapter = new Zend_Auth_Adapter_DbTable(
                    $dbAdapter,
                    'users',
                    'email',
                    'password'
                );

                $adapter->setIdentity($userData['email']);
                $adapter->setCredential($data['password']);

                $auth   = Zend_Auth::getInstance();
                $result = $auth->authenticate($adapter);
                
                if ($result->isValid()) {
                    $autorization = true;
                }
            }
        } catch (Exception $ex) {
            /* Here replace with Log call */
        }
        
        return $autorization;
    }
    
    private function getUserData($data)
    {
        $result = [];
        $dbAdapter = Zend_Db_Table::getDefaultAdapter();
        $sql = sprintf(
            "SELECT `email`, `name`, `date` FROM `users` WHERE `users`.`email` = '%s' AND `users`.`password` = '%s';",
            $data['email'],
            $data['password']
        );
        $result = $dbAdapter->query($sql)->fetch(); 
        
        return $result;
    }
    
    /* Register new user ident by email */
    private function registerUser($params)
    {
        try {
            $status = false;
            $data = [];
            $message = [];
            $data['email'] = filter_var($params['email'], FILTER_VALIDATE_EMAIL);
            $data['name'] = $params['name']; /* [a-zA-Z] */
            $data['password'] = $this->generatePasswordHash($params['password']); 
            $pattern = '/^[a-zA-Z]+$/';
            if (!preg_match($pattern, $data['name'])) {
                $message[] = 'Имя должно содержать только латинские буквы(a-z).';
            }
            if (strlen($data['name']) < 4 ) {
                $message[] = 'Имя меньше 4 символов.';
            } 
            /* Check if email is avaible */
            if (!$params['email']) {
                $message[] = 'Укажите email.';
            }
            if ($data['email'] === false) {
                $message['email'] = 'Введите корректный email.';
            }
            if ($data['email']) {
                $emailCheck = $this->emailExists($data['email']);
                if (!$emailCheck) {
                    $status = true;
                }
            } 
            if (!$status && $data['email']) {
                $message['email'] = $params['email'] . ' уже существует.';
            }
            if ($params['password'] == '' || $params['password2'] == '') {
                $message[] = 'Укажите пароль.';
            }
            if ($params['password'] != $params['password2']) {
                $message[] = 'Пароли не совпадают.';
            }
            if (count($message) == 0) {
                $this->addUser($data);
            }
        } catch (Exception $ex) {
            /* Here replace with Log call */
        }
        if (count($message) == 0) {
            $result = [];
        } else {
            $result = ['data' => $message];
        }
        
        return $result;
    }
    
    /* Crypt password and return hash */
    private function generatePasswordHash($password)
    {
        $blowfishSalt = bin2hex(openssl_random_pseudo_bytes(22));
        $hash = crypt($password, "$3a$14$" . $blowfishSalt);
        
        return $hash;
    }
    
    /* Check if email exists in db */
    private function emailExists($email)
    {
        try {
            $dbAdapter = Zend_Db_Table::getDefaultAdapter();
            $sql = sprintf(
                "SELECT `email` FROM `users` WHERE `users`.`email` = '%s';",
                $email   
            );
            $result = $dbAdapter->query($sql)->fetch(); 
        } catch (Exception $ex) {
            /* Here replace with Log call */
        }
        
        return $result;
    }
    
    /* Add new users */
    private function addUser($data)
    {
        try {
            $dbAdapter = Zend_Db_Table::getDefaultAdapter();
            $sql = sprintf(
                "INSERT INTO `users` (`name`, `password`, `email`, `date`) "
                . " VALUES ('%s', '%s', '%s', '%d');",
                $data['name'], $data['password'], $data['email'], time()
            );
            
            $dbAdapter->query($sql);
        } catch (Exception $ex) {
            /* Here replace with Log call */
        }
    }
    
    public function testAction()
    {
        $this->_helper->layout->disableLayout();
        $this->_helper->viewRenderer->setNoRender(true);
        
    }
            
}
