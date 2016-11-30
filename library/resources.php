<?php
class Resourses
{
    /**
     * Возвращает массив производителей
     * (переделать конфиги на топы из объявлений )
     *
     * @param string - тип производителя
     * @param array - массив топов
     * @return array
     */
    public function getManufactureList($type, $makes = null)
    {
        $dbAdapter = Zend_Db_Table::getDefaultAdapter();
        if($makes) {
            $where = ' `title` IN (';
            foreach($makes as $mark) {
                $where .= " '$mark',";
            }
            $where = substr($where, 0, -1);
            $where .= ')';
            $sql = "SELECT `id`, `title`, `img_position` FROM `manufacture` WHERE $where";
        } else { // отдаём весь список мануфактуры
            $sql = "SELECT `id`, `title`, `img_position` FROM `manufacture` WHERE `type` = '$type'";
        }
        return $dbAdapter->query($sql)->fetchAll();
    }

}