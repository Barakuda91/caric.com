<?php
class User
{
    public $userPhoneRegExp = '/^\+{0,1}[0-9]+$/';
    public $userPassRegExp = '/^[a-zA-Z0-9]+$/';
    public $name;
    public $roleId;
    public $email;
    public $date;
    public $contactPhone;
    public $contactEmail;
    public $contactLink1;
    public $contactLink2;

    const ROLE_ADMIN = 10;
    const ROLE_USER = 0;

    public function __construct($id = null)
    {
        if ($id) {
            $send = [];
            $send['email'] = $id;
            $data = $this->getUserData($send, 'flag');
            $this->name = $data['name'];
            $this->roleId = $data['role_id'];
            $this->email = $id;
            $this->date = $data['date'];
            $this->contactPhone = $data['contact_phone'];
            $this->contactEmail = $data['contact_email'];
            $this->contactLink1 = $data['contact_profile_1'];
            $this->contactLink2 = $data['contact_profile_2'];
        }
    }

    public function savePersonalData($params)
    {
        try {
            $phone = $params['contactPhone'];
            $email = filter_var($params['contactEmail'], FILTER_VALIDATE_EMAIL);
            $linkVK = filter_var($params['linkVK'], FILTER_VALIDATE_URL);
            $linkDrive = filter_var($params['linkDrive'], FILTER_VALIDATE_URL);
            $data = [];
            if (preg_match($this->userPhoneRegExp, $phone)) {
                $data['contact_phone'] = $phone;
            } else {
                $data['contact_phone'] = '';
            }
            if ($email) {
                $data['contact_email'] = $email;
            } else {
                $data['contact_email'] = '';
            }
            if ($linkVK) {
                $data['contact_profile_1'] = $linkVK;
            } else {
                $data['contact_profile_1'] = '';
            }
            if ($linkDrive) {
                $data['contact_profile_2'] = $linkDrive;
            } else {
                $data['contact_profile_2'] = '';
            }

            if (count($data) > 0) {
                $auth = Zend_Auth::getInstance();
                $emailId = $auth->getIdentity();
                $sql = 'UPDATE `users` SET ';
                $n = count($data);
                $m = 1;
                foreach ($data as $key => $value) {
                    $sql .= '`' . $key . '` = "' . $value . '"';
                    if ($m < $n) {
                        $sql .= ',';
                    }
                    $m++;
                }
                $sql .= ' WHERE `email` = "' . $emailId . '"';
                $dbAdapter = Zend_Db_Table::getDefaultAdapter();
                $dbAdapter->query($sql);
            }

            $result = ['status' => true];
        } catch (Exception $ex) {
            $result = ['status' => false];
            /* Here log calls */
        }

        return $result;
    }

    /* simple random string generation */
    public function generateRandomString($length = 10)
    {
        $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $charactersLength = strlen($characters);
        $randomString = '';
        for ($i = 0; $i < $length; $i++) {
            $randomString .= $characters[rand(0, $charactersLength - 1)];
        }

        return $randomString;
    }
    
    /* Function - update user data to set new password */
    public function userForgotPassword($params)
    {
        $result = [];
        $status = false;
        $data = [];
        $data['email'] = filter_var($params['email'], FILTER_VALIDATE_EMAIL);
        $userData = $this->getUserData($data, 'forgot');

        if ($userData) {
            $password = $this->generateRandomString();
            $this->updateUserPassword($password, $data['email']);

//            $config = [
//                'auth' => 'login',
//                'username' => 'myusername',
//                'password' => 'password'
//            ];

            //$transport = new Zend_Mail_Transport_Smtp('mail.server.com', $config);
            try {
                $mail = new Zend_Mail();
                $mail->setBodyText('This is the text of the mail.');
                $mail->setFrom('caric.com@email.com', 'Some Sender');
                $mail->addTo($data['email'], 'Some Recipient');
                $mail->setSubject('New Password = ' . $password);
                $mail->send();
            } catch (Exception $ex) {
                /* Here replace with Log call */
            }

            $status = true;
        }

        $result = [
            'status' => $status
        ];


        return $result;
    }

    /* User logout */
    public function logoutUser()
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
    public function loginUser($params)
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

    public function getUserData($data, $flag = null)
    {
        $result = [];
        $dbAdapter = Zend_Db_Table::getDefaultAdapter();
        if (!$flag) {
            $sql = sprintf(
                "SELECT `email`, `name`, `date` FROM `users` WHERE `users`.`email` = '%s' AND `users`.`password` = '%s';",
                $data['email'],
                $data['password']
            );
        } else {
            $sql = sprintf(
                "SELECT `role_id`, `date`, `email` ,`name`, `contact_phone`, `contact_email`, `contact_profile_1`, `contact_profile_2` FROM `users` WHERE `users`.`email` = '%s';",
                $data['email']
            );
        }

        $result = $dbAdapter->query($sql)->fetch();


        return $result;
    }

    /* Register new user ident by email */
    public function registerUser($params)
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
    public function generatePasswordHash($password)
    {
        $blowfishSalt = bin2hex(openssl_random_pseudo_bytes(22));
        $hash = crypt($password, "$3a$14$" . $blowfishSalt);

        return $hash;
    }

    /* Check if email exists in db */
    public function emailExists($email)
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
    public function addUser($data)
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

    /* Uppdates user row by email */
    public function updateUserPassword($password, $email)
    {
        try {
            $dbAdapter = Zend_Db_Table::getDefaultAdapter();
            $password = $this->generatePasswordHash($password);
            $sql = sprintf(
                "UPDATE `users` SET "
                . "`password` = '%s'"
                . " WHERE `email` = '%s';",
                $password, $email
            );
            $dbAdapter->query($sql);
        } catch (Exception $ex) {
            /* Here replace with Log call */
        }
    }

    public function saveSettingsData($params)
    {
        try {
            $pass = $params['pass'];
            $pass2 = $params['pass2'];
            $data = [];

            if (
                preg_match($this->userPassRegExp, $pass)
                && $pass == $pass2
            ) {
                $data['password'] = $this->generatePasswordHash($pass);
            }
            if (count($data) > 0) {
                $auth = Zend_Auth::getInstance();
                $emailId = $auth->getIdentity();
                $sql = 'UPDATE `users` SET ';
                $sql .= '`password` = "' . $data['password'] . '"';
                $sql .= ' WHERE `email` = "' . $emailId . '"';
                $dbAdapter = Zend_Db_Table::getDefaultAdapter();
                $dbAdapter->query($sql);

                $result = ['status' => true];
            } else {
                $result = ['status' => false];
            }


        } catch (Exception $ex) {
            $result = ['status' => false];
            /* Here log calls */
        }

        return $result;
    }

}
