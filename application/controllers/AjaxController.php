<?php

class AjaxController extends Zend_Controller_Action
{

    const DEFAULT_TYPE_DISK = 1; /* wheels */
    const DEFAULT_TYPE_TIRES = 2; /* tires */

    public function configsoverwriteAction()
    {
        $this->redirect('/');
    }


    public function ajaxAction()
    {
        $this->_helper->layout->disableLayout();
        $this->_helper->viewRenderer->setNoRender(true);
        $user = new User();

        $params = $this->getAllParams();
        if (isset($params['case'])) {
            switch ($params['case']) {
                case 'registerUser':
                    $this->result = $user->registerUser($params);
                    break;

                case 'loginUser':
                    $this->result = $user->loginUser($params);
                    break;

                case 'logoutUser':
                    $this->result = $user->logoutUser();
                    break;

                case 'forgotPassword':
                    $this->result = $user->userForgotPassword($params);
                    break;

                case 'savePersonalData':
                    $this->result = $user->savePersonalData($params);
                    break;

                case 'saveSettingsData':
                    $this->result = $user->saveSettingsData($params);
                    break;

                case 'search':
                    $this->result = $this->searchRequest($params);
                    break;

                case 'setAdvert':
                    $this->result = $this->setAdvert($params);
                    break;

                case 'deleteAdvert':
                    $this->result = $this->deleteAdvert($params);
                    break;

                case 'advertImageUpload':
                    $this->result = $this->uploadImage($params);
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

    /**
     * Upload image to server
     */
    protected function uploadImage($params)
    {
        $result = [
            'status' => true,
            'file_name' => $_FILES['file']['name'],
        ];

        return $result;
    }

    /**
     * Delete user advert (change status to 3)
     *
     * @param array $data
     *
     * @return array $result
     */
    protected function deleteAdvert($params)
    {
        $result = [
            'status' => false,
        ];

        parse_str($params['data'], $advertData);

        if ((int)$advertData['advertId']) {
            $auth = Zend_Auth::getInstance();
            $user = new User();
            $data = [];
            $data['email'] = $auth->getIdentity();
            $userInfo = $user->getUserData($data, 'flag');
            $dataUpdate = [
                'advert.status' => 3
            ];
            $where = [
                'advert.id = ?' => $advertData['advertId'],
                'advert.user_id = ?' => (int)$userInfo['id']
            ];
            $this->updateAdvertInDB($dataUpdate, $where, 'advert');
            $result = [
                'status' => true,
            ];
        }

        return $result;
    }

    protected function setAdvert($data)
    {
        $result = [
            'status' => false,
            'response' => '',
        ];
        try {
            $newAdvert = true;
            parse_str($data['data'], $advertData);

            if ((int)$advertData['advertId']) {
                /* вроде как есть обьява, проверим есть ли она в базе */
                $checkAdvertRes = $this->checkAdvertInDB($advertData['advertId']);
                if ($checkAdvertRes) {
                    $newAdvert = false; /* обьявва есть у текушего залогиненого пользователя */
                    $advertData['type'] = $checkAdvertRes[0]['type_advert_int'];
                }
            }

            $errorArray = [];
            if (isset($advertData['condition']) && is_numeric($advertData['condition'])) {
                $condition = $advertData['condition'];
            } else {
                $errorArray['condition'] = true;
            }

            if (isset($advertData['price']) && is_numeric($advertData['price'])) {
                $price = $advertData['price'];
            } else {
                $errorArray['price'] = true;
            }

            if (isset($advertData['currency']) && Resourses::checkAddAvertsParams('currency', $advertData['currency'])) {
                $currency = $advertData['currency'];
            } else {
                $errorArray['currency'] = true;
            }

            if (isset($advertData['disk_model']) && Resourses::checkAddAvertsParams('disk_model', $advertData['disk_model'])) {
                $diskModel = $advertData['disk_model'];
            } else {
                $errorArray['disk_model'] = true;
            }

            if (isset($advertData['disk_manufacturer']) && Resourses::checkAddAvertsParams('disk_manufacturer', $advertData['disk_manufacturer'])) {
                $diskManufacture = $advertData['disk_manufacturer'];
            } else {
                $errorArray['disk_manufacturer'] = true;
            }
            switch ($advertData['type']) {
                case self::DEFAULT_TYPE_DISK:// add advert type DISK
                    if (isset($advertData['disk_diameter']) && Resourses::checkAddAvertsParams('disk_diameter', $advertData['disk_diameter'])) {
                        $diskDiameter = $advertData['disk_diameter'];
                    } else {
                        $errorArray['disk_diameter'] = true;
                    }

                    if (isset($advertData['disk_num_holes']) && Resourses::checkAddAvertsParams('disk_num_holes', $advertData['disk_num_holes'])) {
                        $diskNumofHoles = $advertData['disk_num_holes'];
                    } else {
                        $errorArray['disk_num_holes'] = true;
                    }

                    if (isset($advertData['disk_diameter_center_holes']) && Resourses::checkAddAvertsParams('disk_diameter_center_holes', $advertData['disk_diameter_center_holes'])) {
                        $diskDiameterofHoles = $advertData['disk_diameter_center_holes'];
                    } else {
                        $errorArray['disk_diameter_center_holes'] = true;
                    }

                    if (isset($advertData['disk_et']) && is_numeric($advertData['disk_et'])) {
                        $diskViletMM = $advertData['disk_et'];
                    } else {
                        $errorArray['disk_et'] = true;
                    }

                    if (isset($advertData['disk_pcd']) && is_numeric($advertData['disk_pcd'])) {
                        $diskPcd = $advertData['disk_pcd'];
                    } else {
                        $errorArray['disk_pcd'] = true;
                    }

                    if (0 == count($errorArray)) {
                        $cleanAdvertData = [
                            'w_dia' => $diskDiameter,
                            'nn' => $diskNumofHoles,
                            'pcd' => $diskDiameterofHoles,
                            'et' => $diskViletMM,
                            'co_dia' => $diskPcd
                        ];
                        if ($newAdvert) {/* INSERT NEW ADVERT */
                            $resultId = $this->addAdvertInDB($cleanAdvertData, 'wheels');
                            if ($resultId) {
                                $auth = Zend_Auth::getInstance();
                                $user = new User();
                                $data = [];
                                $data['email'] = $auth->getIdentity();
                                $userInfo = $user->getUserData($data, 'flag');
                                $cleanAdvertData = [
                                    'description' => htmlspecialchars($advertData['description']),
                                    'type' => $condition,
                                    'model_id' => $diskModel,
                                    'manufacture_id' => $diskManufacture,
                                    'wheel_id' => $resultId,
                                    'tires_id' => null,
                                    'spacers_id' => null,
                                    'user_id' => (int)$userInfo['id'],
                                    'price' => $price,
                                    'currency' => $currency,
                                    'date' => strtotime("now"),
                                    'status' => 1,
                                ];
                                $lastId = $this->addAdvertInDB($cleanAdvertData, 'advert');
                                if ($lastId) {
                                    $result['status'] = true;
                                }
                            }
                        } else { /* UPDATE OLD ONE */
                            $where = [
                                'wheels.id = ?' => (int)$checkAdvertRes[0]['wheel_id']
                            ];
                            $resultUpdate = $this->updateAdvertInDB($cleanAdvertData, $where, 'wheels');
                            if ($resultUpdate) {
                                $cleanAdvertData = [
                                    'description' => htmlspecialchars($advertData['description']),
                                    'type' => $condition,
                                    'model_id' => $diskModel,
                                    'manufacture_id' => $diskManufacture,
                                    'price' => $price,
                                    'currency' => $currency
                                ];
                                $where = [
                                    'advert.id = ?' => (int)$advertData['advertId']
                                ];
                                $resultAdvert = $this->updateAdvertInDB($cleanAdvertData, $where, 'advert');
                                if ($resultAdvert) {
                                    $result['status'] = true;
                                }
                            }
                        }
                    } else {
                        $result['response'] = $errorArray;
                    }
                    break;

                case self::DEFAULT_TYPE_TIRES:// add advert type TIRES
                    //ALTER TABLE `tires` ADD `type` TINYINT(1) NOT NULL COMMENT 'Тип шины' AFTER `t_dia`; add to structure
                    if (isset($advertData['tires_diameter']) && Resourses::checkAddAvertsParams('tires_diameter', $advertData['tires_diameter'])) {
                        $tiresDiameter = $advertData['tires_diameter'];
                    } else {
                        $errorArray['tires_diameter'] = true;
                    }

                    if (isset($advertData['tires_width']) && Resourses::checkAddAvertsParams('tires_width', $advertData['tires_width'])) {
                        $tiresWidth = $advertData['tires_width'];
                    } else {
                        $errorArray['tires_width'] = true;
                    }

                    if (isset($advertData['tires_height']) && Resourses::checkAddAvertsParams('tires_height', $advertData['tires_height'])) {
                        $tiresHeight = $advertData['tires_height'];
                    } else {
                        $errorArray['tires_height'] = true;
                    }

                    if (isset($advertData['tires_type']) && Resourses::checkAddAvertsParams('tires_type', $advertData['tires_type'])) {
                        $tiresType = $advertData['tires_type'];
                    } else {
                        $errorArray['tires_type'] = true;
                    }

                    if (0 == count($errorArray)) {
                        $cleanAdvertData = [
                            'wt' => $tiresWidth,
                            'ph' => $tiresHeight,
                            't_dia' => $tiresDiameter,
                            'type' => $tiresType
                        ];
                        if ($newAdvert) { /* INSERT NEW ADVERT */
                            $resultId = $this->addAdvertInDB($cleanAdvertData, 'tires');
                            if ($resultId) {
                                $auth = Zend_Auth::getInstance();
                                $user = new User();
                                $data = [];
                                $data['email'] = $auth->getIdentity();
                                $userInfo = $user->getUserData($data, 'flag');
                                $cleanAdvertData = [
                                    'description' => htmlspecialchars($advertData['description']),
                                    'type' => $condition,
                                    'model_id' => $diskModel,
                                    'manufacture_id' => $diskManufacture,
                                    'wheel_id' => null,
                                    'tires_id' => $resultId,
                                    'spacers_id' => null,
                                    'user_id' => (int)$userInfo['id'],
                                    'price' => $price,
                                    'currency' => $currency,
                                    'date' => strtotime("now"),
                                    'status' => 1,
                                ];
                                $lastId = $this->addAdvertInDB($cleanAdvertData, 'advert');
                                if ($lastId) {
                                    $result['status'] = true;
                                }
                            }
                        } else { /* UPDATE OLD ONE */
                            $where = [
                                'tires.id = ?' => (int)$checkAdvertRes[0]['tires_id']
                            ];
                            $resultUpdate = $this->updateAdvertInDB($cleanAdvertData, $where, 'tires');
                            if ($resultUpdate) {
                                $cleanAdvertData = [
                                    'description' => htmlspecialchars($advertData['description']),
                                    'type' => $condition,
                                    'model_id' => $diskModel,
                                    'manufacture_id' => $diskManufacture,
                                    'price' => $price,
                                    'currency' => $currency
                                ];
                                $where = [
                                    'advert.id = ?' => (int)$advertData['advertId']
                                ];
                                $resultAdvert = $this->updateAdvertInDB($cleanAdvertData, $where, 'advert');
                                if ($resultAdvert) {
                                    $result['status'] = true;
                                }
                            }
                        }
                    } else {
                        $result['response'] = $errorArray;
                    }
                    break;

                case 3:// add advert type SETS
                    break;

                case 4:// add advert type ELSE
                    break;

            }
            //var_dump($advertData);
        } catch (Exception $e) {
            /* log error entry */
        }

        return $result;
    }

    /**
     * Проверят если ли в базе у залогиненого юзера данное обьявление
     *
     * @param $id advert id
     *
     * @return array $resultFormatted
     */
    protected function checkAdvertInDB($id)
    {
        try {
            $auth = Zend_Auth::getInstance();
            $user = new User();
            $data = [];
            $data['email'] = $auth->getIdentity();
            $userInfo = $user->getUserData($data, 'flag');

            $table = new Zend_Db_Table('advert');
            $select = $table->select()
                ->where('advert.id = ?', $id)
                ->where('advert.user_id = ?', (int)$userInfo['id']);
            $result = $table->fetchAll($select)->toArray();
            $resultFormatted = User::formatAdvertResult($result);
        } catch (Exception $e) {

        }

        return $resultFormatted;
    }

    protected function searchRequest($params)
    {
        try {
            /* getting some data from db */
            $search = new Search();
            $data = $search->getDummyData();
            $jsonArray = [];
            if (is_array($data)) {
                foreach ($data as $key => $value) {
                    $jsonArray[$value['id']] = $value;
                }
            }

            $searchUrl = Search::clearString($params['val']);
            $pattern = '/[\s]+/';
            $replacement = '+';
            $searchUrl = preg_replace($pattern, $replacement, $searchUrl);
            $jsonData = [
                'status' => 1,
                'adverts' => $jsonArray,
                'searchUrl' => $searchUrl,
            ];

        } catch (Exception $e) {
            $jsonData = ['status' => 0];
            /* log error entry */
        }

        return $jsonData;
    }


    /**
     * Add advert data to DB
     *
     * @param $data
     * @param $tableName
     *
     * @return int $lastId
     */
    protected function addAdvertInDB($data, $tableName)
    {
        try {
            if ($tableName) {
                $table = new Zend_Db_Table($tableName);
                $table->insert($data);
                $lastId = $table->getDefaultAdapter()->lastInsertId();
            }
        } catch (Exception $e) {
            var_dump($e);
        }

        return $lastId;
    }

    /**
     * Update advert data to DB
     *
     * @param $data
     * @param $where
     * @param $tableName
     *
     * @return int $lastId
     */
    protected function updateAdvertInDB($data, $where, $tableName)
    {
        $result = false;
        try {
            if ($tableName) {
                $table = new Zend_Db_Table($tableName);
                $table->update($data, $where);
                $result = true;
            }
        } catch (Exception $e) {
            var_dump($e);
        }

        return $result;
    }
}

?>