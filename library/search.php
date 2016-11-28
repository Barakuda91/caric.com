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

}