<?php

class AjaxController extends Zend_Controller_Action
{
    public function ajaxAction() {
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

                default:
                    $this->result = [];
                    break;
            }
        }
        /* disable feedback post*/
        header("Content-Type: text/json");
        echo json_encode($this->result);
    }

}

?>