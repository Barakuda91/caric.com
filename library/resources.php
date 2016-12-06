<?php
class Resourses
{
    function __construct($config) {
        $this->config = $config;
    }
    /**
     * Возвращает массив производителей
     * (переделать конфиги на топы из объявлений )
     *
     * @param string - тип производителя
     * @param array - массив топов
     * @param int - текущая страница
     * @return array
     */
    public function getManufactureList($type, $makes = null, $page = 1)
    {
        $dbAdapter = Zend_Db_Table::getDefaultAdapter();

        $limitCols = $this->config->pagination->manufactureList;
        $limitStart = ($page - 1) * $limitCols;

        $limit = " LIMIT $limitStart,$limitCols ";


        if($makes) {
            $where = ' `title` IN (';
            foreach($makes as $mark) {
                $where .= " '$mark',";
            }
            $where = substr($where, 0, -1);
            $where .= ')';
            $sql = "SELECT `id`, `title`, `img_position` FROM `manufacture` WHERE $where $limit";
        } else { // отдаём весь список мануфактуры
            $sql = "SELECT `id`, `title`, `img_position` FROM `manufacture` WHERE `type` = '$type' $limit";
        }

        $result = $dbAdapter->query($sql)->fetchAll();

        return $result;
    }
}