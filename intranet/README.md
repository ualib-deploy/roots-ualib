# Custom Intranet Forms

## History

These forms were on the original UL intranet, written for a drupal environment. In the summer of 2019, I began working to migrate the content on the intranet to our wordpress site. A handful of custom forms needed to be converted to wordpress pages, and this is the result.

## Basic overview

Each form has a few components:

1. an html form inside a wordpress page as an HTML Gutenberg block (all except voyager request) - e.g. _/intranet/incidentreport_
1. a corresponding "result" wordpress page with nothing in it - e.g. _/intranet/incidentreport-result_
1. the html form has a form action that points to the results page - e.g. `<form action="/intranet/incidentreport-result">`
1. the wordpress template `roots-ualib/templates/content-page.php` serves the corresponding files when pages are in use, such as results scripts that handle error checking and sending emails, and an email server, PHPmailer
1. `roots-ualib/functions-ualib.php` contains the wordpress enqueue function for loading and serving javascript files for interactive forms 

## TODO

- [x] add form and result pages to staging wordpress
- [x] update result scripts with correct referrer urls
- [x] test forms on staging
- [ ] add acs forms to staging
- [ ] test acs forms on staging
- [ ] add form and result pages to production wordpress
- [x] update result scripts with prod referrer urls (can I use `WP_ENV != 'staging'` to have it work on both staging and prod? roots docs indicate that's something I can do, but we don't have a WP_ENV on staging, only on prod!) 
- [ ] document the code and grunt file added for dev/prod sites and referrer urls
- [ ] update all form email submissions in result scripts (most should just be commented out, but i might need to dig into the original drupal files to find who they go to)
