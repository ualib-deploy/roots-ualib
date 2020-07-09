<?php

define('ILS_PATH', get_stylesheet_directory() . '/intranet/inc/voyager-locs/');

$g_location = file(ILS_PATH . 'gorg_locations.txt', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
$e_location = file(ILS_PATH . 'educ_locations.txt', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
$b_location = file(ILS_PATH . 'bus_locations.txt', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
$h_location = file(ILS_PATH . 'hoole_locations.txt', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
$hs_location = file(ILS_PATH . 'hsl_locations.txt', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
$r_location = file(ILS_PATH . 'rodgers_locations.txt', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
$a_location = file(ILS_PATH . 'annex_locations.txt', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
$o_location = file(ILS_PATH . 'other_locations.txt', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
$type = file(ILS_PATH . 'types.txt', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
$status = file(ILS_PATH . 'status.txt', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);

/*
$g_locfile = fopen("/srv/web/www/htdocs/sites/intranet.lib.ua.edu/files/ils/gorg_locations.txt", "r");
$i = 0;
while (!feof($g_locfile)) {
        $g_location_text .= fgets($g_locfile);
}
$g_location = explode("\n", $g_location_text);
fclose($g_locfile);


$e_locfile = fopen("/srv/web/www/htdocs/sites/intranet.lib.ua.edu/files/ils/educ_locations.txt", "r");
$i = 0;
while (!feof($e_locfile)) {
        $e_location_text .= fgets($e_locfile);
}
$e_location = explode("\n", $e_location_text);
fclose($e_locfile);

$b_locfile = fopen("/srv/web/www/htdocs/sites/intranet.lib.ua.edu/files/ils/bus_locations.txt", "r");
$i = 0;
while (!feof($b_locfile)) {
        $b_location_text .= fgets($b_locfile);
}
$b_location = explode("\n", $b_location_text);
fclose($b_locfile);

$h_locfile = fopen("/srv/web/www/htdocs/sites/intranet.lib.ua.edu/files/ils/hoole_locations.txt", "r");
$i = 0;
while (!feof($h_locfile)) {
        $h_location_text .= fgets($h_locfile);
}
$h_location = explode("\n", $h_location_text);
fclose($h_locfile);

$hs_locfile = fopen("/srv/web/www/htdocs/sites/intranet.lib.ua.edu/files/ils/hsl_locations.txt", "r");
$i = 0;
while (!feof($hs_locfile)) {
        $hs_location_text .= fgets($hs_locfile);
}
$hs_location = explode("\n", $hs_location_text);
fclose($hs_locfile);

$r_locfile = fopen("/srv/web/www/htdocs/sites/intranet.lib.ua.edu/files/ils/rodgers_locations.txt", "r");
$i = 0;
while (!feof($r_locfile)) {
        $r_location_text .= fgets($r_locfile);
}
$r_location = explode("\n", $r_location_text);
fclose($r_locfile);

$a_locfile = fopen("/srv/web/www/htdocs/sites/intranet.lib.ua.edu/files/ils/annex_locations.txt", "r");
$i = 0;
while (!feof($a_locfile)) {
        $a_location_text .= fgets($a_locfile);
}
$a_location = explode("\n", $a_location_text);
fclose($a_locfile);

$o_locfile = fopen("/srv/web/www/htdocs/sites/intranet.lib.ua.edu/files/ils/other_locations.txt", "r");
$i = 0;
while (!feof($o_locfile)) {
        $o_location_text .= fgets($o_locfile);
}
$o_location = explode("\n", $o_location_text);
fclose($o_locfile);

$typefile = fopen("/srv/web/www/htdocs/sites/intranet.lib.ua.edu/files/ils/types.txt", "r");
$i = 0;
while (!feof($typefile)) {
        $type_text .= fgets($typefile);
}
$type = explode("\n", $type_text);
fclose($typefile);

$statfile = fopen("/srv/web/www/htdocs/sites/intranet.lib.ua.edu/files/ils/status.txt", "r");
$i = 0;
while (!feof($statfile)) {
        $stat_text .= fgets($statfile);
}
$status = explode("\n", $stat_text);
fclose($statfile);

*/
