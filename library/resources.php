<?php
class Resourses
{
    const DEFAULT_MONEY_NUMBERS = 2;
    const CURRENCY_UAH_CODE = 1;
    const CURRENCY_USD_CODE = 2;
    const CURRENCY_EUR_CODE = 3;
    const CURRENCY_UAH_NAME = 'грн';
    const CURRENCY_USD_NAME = '$';
    const CURRENCY_EUR_NAME = '€';

    const ADVERT_STATUS_ACTIVE = 1;
    const ADVERT_STATUS_NOACTIVE = 2;
    const ADVERT_STATUS_DELETED = 3;
    public static $advertStatuses = [
        self::ADVERT_STATUS_ACTIVE => 'активное',
        self::ADVERT_STATUS_NOACTIVE => 'не активное',
        self::ADVERT_STATUS_DELETED => 'удаленное'
    ];

    function __construct($config) {
        $this->config = $config;
    }
    /**
     * Возвращает массив производителей
     * (переделать конфиги на топы из объявлений )
     *
     * @param string $type - тип производителя
     * @param array $makes - массив топов
     * @param int $page - текущая страница
     *
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


    /**
     * Get all manufacture by type
     * @param $type
     * @return mixed
     */
    public static function getAllManufactureListByType($type)
    {
        $dbAdapter = Zend_Db_Table::getDefaultAdapter();

        $sql = "SELECT `id`, `title` FROM `manufacture` WHERE `type` = '$type'";
        $result = $dbAdapter->query($sql)->fetchAll();
        $resultFormatted['null'] = 'Выберите производителя';
        foreach ($result as $key => $value) {
            $resultFormatted[$value['id']] = str_replace('_', ' ', $value['title']);
        }

        return $resultFormatted;
    }

    /* add adverts data selects */
    static public function addAdvertDataSelects()
    {
        $result = [
            'price' => [
                'title' => 'Цена',
                'name' => 'price'
            ],
            'currency' => [
                'title' => 'Валюта',
                'name' => 'currency',
                'options' => [
                    self::CURRENCY_UAH_CODE => self::CURRENCY_UAH_NAME,
                    self::CURRENCY_USD_CODE => self::CURRENCY_USD_NAME,
                    self::CURRENCY_EUR_CODE => self::CURRENCY_EUR_NAME
                ],
                'associate' => true,
                'default' => 1
            ],
            'description' => [
                'title' => 'Описание',
                'name' => 'description'
            ],
            'condition' => [
                'title' => 'Состояние',
                'name' => 'condition',
                'options' => [
                    '1' => 'Новое',
                    '2' => 'Б/У'
                ],
                'associate' => true
            ],
            'type' => [
                'title' => 'Тип',
                'name' => 'type',
                'options' => [
                    1 => 'Диски',
                    2 => 'Шины',
                    /*                  3 => 'Проставки',
                                        4 => 'Прочее'*/
                ],
                'associate' => true
            ],
            'wheel-1' => [
                'title' => 'Диаметр диска',
                'name' => 'disk_diameter',
                'options' => [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
                'associate' => false
            ],
            'wheel-2' => [
                'title' => 'Кол-во отверстий',
                'name' => 'disk_num_holes',
                'options' => [3, 4, 5, 6, 7, 8, 9, 10],
                'associate' => false,
                'default' => 4
            ],
            'wheel-3' => [
                'title' => 'Диаметр по центрам отверстий',
                'name' => 'disk_diameter_center_holes',
                'options' => [98, 100, 105, 112, 114, 120],
                'associate' => false,
                'default' => 98
            ],
            'wheel-4' => [
                'title' => 'Производитель',
                'name' => 'disk_manufacturer',
                'options' => self::getAllManufactureListByType('wheel'),
                'associate' => true

            ],
            'wheel-5' => [
                'title' => 'Модель',
                'name' => 'disk_model',
                'options' => [
                    1 => 'A1'
                ],
                'associate' => true
                /* chain too wheel-4 */
            ],
            'wheel-6' => [
                'title' => 'Вылет мм',
                'name' => 'disk_et',
            ],
            'wheel-7' => [
                'title' => 'Центральное отверстие',
                'name' => 'disk_pcd',
            ],
            'tires-1' => [
                'title' => 'Диаметр шины',
                'name' => 'tires_diameter',
                'options' => [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
                'associate' => false
            ],
            'tires-2' => [
                'title' => 'Ширина шины(мм)',
                'name' => 'tires_width',
                'options' => [155, 165, 175, 185, 195, 205, 215, 225, 235, 245, 255, 265, 275, 285, 295, 305],
                'associate' => false
            ],
            'tires-3' => [
                'title' => 'Высота профиля(%)',
                'name' => 'tires_height',
                'options' => [30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80],
                'associate' => false
            ],
            'tires-4' => [
                'title' => 'Тип шины',
                'name' => 'tires_type',
                'options' => [
                    1 => 'Лето',
                    2 => 'Зима',
                    3 => 'Демисезон'
                ],
                'associate' => true
            ],
        ];

        return $result;
    }

    static public function checkAddAvertsParams($key, $value)
    {
        $result = false;
        $data = self::addAdvertDataSelects();
        if (is_array($data) && count($data) > 0) {
            foreach ($data as $index => $params) {
                if ($params['name'] == $key) {
                    if ($params['associate']) {
                        if (array_key_exists($value, $params['options'])) {
                            $result = true;
                        }
                    } else {
                        if (in_array($value, $params['options'])) {
                            $result = true;
                        }
                    }
                    break;
                }
            }
        }

        return $result;
    }
}
