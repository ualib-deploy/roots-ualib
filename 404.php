<div class="jumbotron bg-transparent">
    <div class="row">
        <div class="col-sm-3 col-md-2 hidden-xs">
            <div class="h1">
                <span class="fa fa-2x fa-exclamation-triangle text-muted"></span>
            </div>
        </div>
        <div class="col-sm-9 col-md-10">
            <h1>Page Not Found</h1>
            <p class="lead">
                <?php _e('Sorry, but the page you were trying to view does not exist.', 'roots'); ?>
            </p>
        </div>
    </div>
    <div class="page-slice">
        <div class="alert alert-warning">
            <div>
                <span class="fa fa-fw fa-info-circle"></span> Looking for something in the libraries or on the website?
            </div>
            <?php get_search_form(); ?>
        </div>
    </div>
</div>