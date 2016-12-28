<?php
class Search
{
    public function getDummyData()
    {
        $data = [
            [
                'id' => 1, 'title' => 'advert1', 'description' => 'This cool advert must buyy',
                'manufacture_id' => 1, 'manufacture_name' => 'BMW', 'wheel_id' => 1,
                'tires_id' => 1, 'spacers_id' => 1, 'user_id' => 1
            ],
            [
                'id' => 2, 'title' => 'advert2', 'description' => 'This mega cool advert must bussyy',
                'manufacture_id' => 2, 'manufacture_name' => 'AUDI', 'wheel_id' => 1,
                'tires_id' => 1, 'spacers_id' => 1, 'user_id' => 2
            ],
            [
                'id' => 3, 'title' => 'advert3', 'description' => 'This mega cool advert take knowww',
                'manufacture_id' => 3, 'manufacture_name' => 'BBS', 'wheel_id' => 1,
                'tires_id' => 1, 'spacers_id' => 1, 'user_id' => 2
            ],
            [
                'id' => 4, 'title' => 'advert4', 'description' => 'But super coolet things ',
                'manufacture_id' => 4   , 'manufacture_name' => 'BORBET', 'wheel_id' => 1,
                'tires_id' => 1, 'spacers_id' => 1, 'user_id' => 1
            ]
        ];

        return $data;
    }

    static public function utf8StrSplit($str)
    {
        // place each character of the string into and array
        $split = 1;
        $array = [];
        for ($i = 0; $i < strlen($str);) {
            $value = ord($str[$i]);
            if ($value > 127) {
                if ($value >= 192 && $value <= 223) {
                    $split = 2;
                } else if ($value >= 224 && $value <= 239) {
                    $split = 3;
                } elseif ($value >= 240 && $value <= 247) {
                    $split = 4;
                }
            } else {
                $split = 1;
            }
            $key = NULL;
            for ($j = 0; $j < $split; $j++, $i++) {
                $key .= $str[$i];
            }
            array_push($array, $key);
        }

        return $array;
    }

    static public function clearString($str)
    {
        $sRu = 'ёйцукенгшщзхъфывапролджэячсмитьбю';
        $s1 = array_merge(
            self::utf8StrSplit($sRu),
            self::utf8StrSplit(strtoupper($sRu)),
            range('A', 'Z'),
            range('a', 'z'),
            range('0', '9'),
            ['\'', '"', ' ', '%', '(', ')', '-', '[', ']', ',', '.', '/', '\\']
        );
        $codes = [];
        for ($i = 0; $i < count($s1); $i++) {
            $codes[] = ord($s1[$i]);
        }
        $strS = self::utf8StrSplit($str);
        for ($i = 0; $i < count($strS); $i++) {
            if (!in_array(ord($strS[$i]), $codes)) {
                $str = str_replace($strS[$i], ' ', $str);
            }
        }

        return $str;
    }

}