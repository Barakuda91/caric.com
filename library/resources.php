<?php
class Resourses
{
    public function getListMakes()
    {
        $dbAdapter = Zend_Db_Table::getDefaultAdapter();
        $sql = "SELECT `id`, `name`, `x` FROM `makes`";
        $result = $dbAdapter->query($sql)->fetchAll();

        return $result;
    }

}