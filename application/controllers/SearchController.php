<?php

class SearchController extends Zend_Controller_Action
{
    public function init()
    {
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

    public function indexAction()
    {
        /* распаршиваем урл и рендерим обьявления если такие находим */
        /* http://caric.com/search?q=make_BMW+model_X3 */
        $query = $this->getParam('q');

        $this->view->query = $query;
        $this->view->queryTemp = Search::clearString($query);

    }

}
