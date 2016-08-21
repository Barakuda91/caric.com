<?php


class Security_defaults
{
    // траслитерация
    function GetInTranslit($string) 
    {
        $replace=array(
        "'"=>"",
        "`"=>"",
        "а"=>"a","А"=>"a",
        "б"=>"b","Б"=>"b",
        "в"=>"v","В"=>"v",
        "г"=>"g","Г"=>"g",
        "д"=>"d","Д"=>"d",
        "е"=>"e","Е"=>"e",
        "ж"=>"zh","Ж"=>"zh",
        "з"=>"z","З"=>"z",
        "и"=>"i","И"=>"i",
        "й"=>"y","Й"=>"y",
        "к"=>"k","К"=>"k",
        "л"=>"l","Л"=>"l",
        "м"=>"m","М"=>"m",
        "н"=>"n","Н"=>"n",
        "о"=>"o","О"=>"o",
        "п"=>"p","П"=>"p",
        "р"=>"r","Р"=>"r",
        "с"=>"s","С"=>"s",
        "т"=>"t","Т"=>"t",
        "у"=>"u","У"=>"u",
        "ф"=>"f","Ф"=>"f",
        "х"=>"h","Х"=>"h",
        "ц"=>"c","Ц"=>"c",
        "ч"=>"ch","Ч"=>"ch",
        "ш"=>"sh","Ш"=>"sh",
        "щ"=>"sch","Щ"=>"sch",
        "ъ"=>"","Ъ"=>"",
        "ы"=>"y","Ы"=>"y",
        "ь"=>"","Ь"=>"",
        "э"=>"e","Э"=>"e",
        "ю"=>"yu","Ю"=>"yu",
        "я"=>"ya","Я"=>"ya",
        "і"=>"i","І"=>"i",
        "ї"=>"yi","Ї"=>"yi",
        "є"=>"e","Є"=>"e"
        );
        return $str=iconv("UTF-8","UTF-8//IGNORE",strtr($string,$replace));
    }
    
    public function getDefaultRazdel()
    {        
        // массив допустимых параметров ввода 
        $array_razdels = array(
            0  => 's-chem-nosit',
            1  => 'modnye-cveta',
            2  => 'zhenstvennyy-stil',
            3  => 'vechernyaya-moda',
            4  => 'svadebnaya-moda',
        );
        return $array_razdels;
    }   
    
    public function getDefaultPosts()
    {
        // массив допустимых параметров ввода 
        $array_posts = array(
            0  => 'jenskie-ukrasheniya-dlya-leta-neobichnie-idei',
            1  => 'jenstvenaya-odejda-dlya-ofica',
            2  => 'jenstvenaya-odejda-dlya-ofica-chasty-2',
            3  => 'chernie-vechernie-platya-iziskanya-roskoshy-dlya-osobix-sluchaev',
            4  => 'cherno-belie-vechernie-obrazi-naryadniye-bluzki-bruki-i-ubki',
            5  => 'vse-otenki-zelenogo-v-odejde',
            6  => 'roskoshnie-platya-s-cvetami-dlya-sozdaniya-jenstvenogo-obraza',
            7  => 'nejnosty-vesni-v-vashem-garderobe-s-chem-sochetaty-zelenie-platya-bluzki-ubki',
            8  => 'ottenki-sinego-v-vashem-garderobe',
            9  => 'platya-rubashka-2014-idealynoe-reshenie-dlya-leta',
            10 => 'yarkie-akcenti-leta-modniye-playtya-i-mnogoe-drugoe-dlya-vashego-jenstvenogo-obraza',
            11 => 'svadebnie-platya-v-stile-retro-vintajniy-shik-dlya-vashego-prazdnika',
            12 => 'oseny-v-ofise-jenstvenie-pritalinie-platya',
            13 => 'modnie-pritalinie-platya-actualnie-modely-oseny-2014',
            14 => 'modniy-pritalinie-platya-oseny-2014-s-cem-nosity',
            15 => 'pritalennye-vechernie-platya-dlya-zhenstvennyh-krasavic',
            16 => 'pritalennye-svadebnye-platya-aktualnye-fasony-dlya-modnoy-nevesty',
            17 => 'zhenskiy-tvidovyy-kostyum-izyskannaya-klassika-snova-v-mode',
            18 => 'osenniy-obraz-2014-zhenstvennyy-casual',
            19 => 'osenniy-obraz-2014-notki-zhenstvennosti',
            20 => 'osenniy-obraz-2014-uyutnyy-kantristil',
            21 => 'odezhda-pastelnyh-tonov-nezhnye-ottenki-vesny-v-vashem-garderobe',
            22 => 's-chem-nosit-lyusitovyy-zelenyy-2015',
            23 => 'modnye-vesennie-palto-2016-kak-pravilno-vybrat',
			24 => 's-chem-nosit-polosku-letom',
			25 => 'modnyy-trend-letnie-platya-s-otkrytymi-plechami'
            
        );
        return $array_posts;
    }
    
    public function getDefaultTegs()
    {
        // массив допустимых параметров ввода 
        $array_tegs = array(
            0  => 'leto',
            1  => 'dlya-ofisa',
            2  => 'kostumi',
            3  => 'cto-nadety',
            4  => 'platya',
            5  => 'trikotaj',
            6  => 'bluzki',
            7  => 'bruki',
            8  => 'cveta-v-odejde',
            9  => 'krujevo',
            10 => 'vishivka',
            11 => 'ubki',
            12 => 'cvetotip',
            13 => 'akksesuari',
            14 => 'cveti',
            15 => 'print',
            16 => 'vesna',
            17 => 'svadebnye-platya',
            18 => 'osen',
            19 => 'pritalennye-platya',
            20 => 'vechernie-platya',
            21 => 'romantichnye-platya',
            22 => 'korotkie-platya',
            23 => 'tvid',
            24 => 'zhakety',
            25 => 'palto',
            26 => 'moda-2014',
            27 => 'moda-2015',
            28 => 'dragocenie-kamni'
        );
        
        return $array_tegs;
    }
    
    public function checkRazdelName($str){
        $defaultRazdesl = self::getDefaultRazdel();
        
        if (in_array($str, $defaultRazdesl)) {
            return true;
        } else {
            return false;
        }
    }
    
    public function checkPostName($str){
        $defaultPosts = self::getDefaultPosts();
        
        if (in_array($str, $defaultPosts)) {
            return true;
        } else {
            return false;
        }
    }
}

