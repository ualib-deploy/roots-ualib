<?php
require_once "/srv/web/www/webapps/superGlobalPHP/constants.php";

//items per page in web apps
define('PAGINATION', 20);

function doRemoveJSONPrefix($content)
{
    $pos = stripos($content, '{');
    return substr($content, $pos, strlen($content) - $pos);
}

//get array of private URLs from robots.txt
$exceptions = file(UNIX_HTDOCS_PATH .'robots.txt', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
for($i = 0; $i < count($exceptions); $i++)
    if (stripos($exceptions[$i], 'Disallow:') === 0){
        $exceptions[$i] = trim(substr($exceptions[$i], strlen('Disallow:'), strlen($exceptions[$i]) - strlen('Disallow:')));
    }

$siteMap = '<?xml version="1.0" encoding="UTF-8"?>' . PHP_EOL;
$siteMap .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . PHP_EOL;

$counter = 0;
//generate site map entries from WordPress pages
$pages = $wpdb->get_results( "SELECT ID FROM wp_posts WHERE post_type = 'page' AND post_status = 'publish'" );
foreach ($pages as $page){
    $link = get_permalink($page->ID);

    //check if exception
    $isException = false;
    foreach($exceptions as $exc)
        if (stripos($link, $exc) > 0) {
            $isException = true;
            break;
        }
    if (!$isException) {
        $siteMap .= '<url><loc>' . $link . '</loc></url>' . PHP_EOL;
        $counter++;
    }
}

$context = stream_context_create(array('http' => array('header'=>'Connection: close')));

//generate site map entries from webapps pagination
//Hours
$siteMap .= '<url><loc>' . DOMAIN . '#/hours?library=Gorgas Library</loc></url>' . PHP_EOL;
$siteMap .= '<url><loc>' . DOMAIN . '#/hours?library=Music Library</loc></url>' . PHP_EOL;
$siteMap .= '<url><loc>' . DOMAIN . '#/hours?library=Sanford Media Center</loc></url>' . PHP_EOL;
$siteMap .= '<url><loc>' . DOMAIN . '#/hours?library=Williams Collection</loc></url>' . PHP_EOL;
$siteMap .= '<url><loc>' . DOMAIN . '#/hours?library=Rodgers Library</loc></url>' . PHP_EOL;
$siteMap .= '<url><loc>' . DOMAIN . '#/hours?library=McLure Education Library</loc></url>' . PHP_EOL;
$siteMap .= '<url><loc>' . DOMAIN . '#/hours?library=Hoole Special Collections</loc></url>' . PHP_EOL;
$siteMap .= '<url><loc>' . DOMAIN . '#/hours?library=Bruno Business Library</loc></url>' . PHP_EOL;

//Databases
$content = file_get_contents(DOMAIN . 'databases/api/active', false, $context);
$json = json_decode(doRemoveJSONPrefix($content), true);
if (isset($json['totalRecords'])) {
    $pages = ceil($json['totalRecords'] / PAGINATION);
    for ($p = 1; $p <= $pages; $p++)
        $siteMap .= '<url><loc>' . DOMAIN . '#/databases?page=' . $p . '</loc></url>' . PHP_EOL;
}

//Music Video search
$content = file_get_contents(DOMAIN . 'musicsearch/api/showall', false, $context);
$json = json_decode(doRemoveJSONPrefix($content), true);
if (isset($json['totalResults'])) {
    $pages = ceil($json['totalResults'] / PAGINATION);
    for ($p = 1; $p <= $pages; $p++)
        $siteMap .= '<url><loc>' . DOMAIN . '#/videos?page=' . $p . '</loc></url>' . PHP_EOL;
}

//Software list
$content = file_get_contents(DOMAIN . 'softwareList/api/all', false, $context);
$json = json_decode(doRemoveJSONPrefix($content), true);
if (isset($json['totalRecords'])) {
    $pages = ceil($json['totalRecords'] / PAGINATION);
    for ($p = 1; $p <= $pages; $p++)
        $siteMap .= '<url><loc>' . DOMAIN . '#/software?page=' . $p . '</loc></url>' . PHP_EOL;
}

//Staff directory
$content = file_get_contents(DOMAIN . 'staffDir/api/people', false, $context);
$json = json_decode(doRemoveJSONPrefix($content), true);
if (isset($json['list'])) {
    foreach ($json['list'] as $person)
        if ($person['profile'] !== null or $person['website'] !== null or $person['resume'] !== null or
            $person['social1'] !== null or $person['social2'] !== null or $person['social3'] !== null) {
            $prefix = $person['prefix'];
            if ($prefix === null) {
                $pos = stripos($person['email'], '@');
                $prefix = substr($person['email'], 0, $pos);
            }
            $siteMap .= '<url><loc>' . DOMAIN . '#/staffdir/' . $prefix . '</loc></url>' . PHP_EOL;
        }
}

$siteMap .= '</urlset>' . PHP_EOL;

file_put_contents(UNIX_HTDOCS_PATH .'sitemap.xml', $siteMap);
?>
<h2>Site Map generated succesfully</h2>
<p>Processed <?php echo $counter; ?> WP pages and Hours, Databases, Video search, Software, Staff Directory web apps.</p>
