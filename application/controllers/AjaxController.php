<?php

class AjaxController extends Zend_Controller_Action
{

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

                default:
                    $this->result = [];
                    break;
            }
        }
        /* disable feedback post*/
        header("Content-Type: text/json");
        echo json_encode($this->result);
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
            $jsonData = [
                'status' => 1,
                'adverts' => $jsonArray
            ];

        } catch (Exception $e) {
            $jsonData = ['status' => 0];
            /* log error entry */
        }

        return $jsonData;
    }
}

?>