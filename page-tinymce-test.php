<?php

if( !defined( 'ABSPATH' ) ) {
    exit;
}

/*
* Template Name: Hours Management
* Description: Hours Management template.
 */

?>

<div id="content">
    <div ng-app="redesign">
        <div class="row jumbotron" style="background-color: transparent;">
            <div class="col-xs-12 col-sm-12 col-md-5">
                <p class="lead">Use your Action Card or Community User Card to pay for printing and photocopying.</p>
            </div>
            <div class="col-xs-12 col-sm-6 col-md-4">
                <div class="media"><span class="pull-left"><img class="media-object" style="width: 64px; height: 64px;" src="/wp-content/uploads/2014/11/print-color-icon.png" alt="64x64" width="105" height="105" /></span><div class="media-body pull-left"><h2>Color <span class="label label-success"><div class="price">15</div>¢</span></h2>
                    </div>
                </div>
            </div>
            <div class="col-xs-12 col-sm-5 col-md-3">
                <div class="media"><span class="pull-left"><img class="media-object" style="width: 64px; height: 64px;" src="/wp-content/uploads/2014/11/print-bw-icon.png" alt="64x64" /></span><div class="media-body pull-left"><h2>B<small>&amp;</small>W <span class="label label-success">5¢</span></h2>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-xs-9">
                <div id="how" class="row slice slice-blue">
                    <h2>How to print</h2>
                    <div class="col-sm-4">
                        <div class="media step-card">
                            <div class="step-num media-object pull-left">1</div>
                            <div class="media-body step-text">Select <em>Print</em> from the file menu</div>
                        </div>
                    </div>
                    <div class="col-sm-4">
                        <div class="media step-card">
                            <div class="step-num media-object pull-left">2</div>
                            <div class="media-body step-text">Choose <em>Black &amp; White</em> or <em>Color (where available)</em></div>
                        </div>
                    </div>
                    <div class="col-sm-4">
                        <div class="media step-card">
                            <div class="step-num media-object pull-left">3</div>
                            <div class="media-body step-text">
                                <ul class="list-unstyled">
                                    <li>Type your name in the pop-up window</li>
                                    <li>Type a print job name <em>(color printing only)</em></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div class="col-sm-4">
                        <div class="media step-card">
                            <div class="step-num media-object pull-left">4</div>
                            <div class="media-body step-text">Swipe your Action/Community User card at the printing station</div>
                        </div>
                    </div>
                    <div class="col-sm-4">
                        <div class="media step-card">
                            <div class="step-num media-object pull-left">5</div>
                            <div class="media-body step-text">Select your print job</div>
                        </div>
                    </div>
                    <div class="col-sm-4">
                        <div class="media step-card">
                            <div class="step-num media-object pull-left">6</div>
                            <div class="media-body step-text">Click <em>Print</em></div>
                        </div>
                    </div>
                </div>
                <div id="where" class="row slice">
                    <h2>Where to print, scan, or copy</h2>
                    <ul class="nav nav-pills nav-justified">
                        <li class="active"><a href="#">Gorgas</a></li>
                        <li><a href="#">McLure</a></li>
                        <li><a href="#">Rodgers</a></li>
                        <li><a href="#">Bruno</a></li>
                    </ul>
                    <div class="col-xs-12 col-sm-6">
                        <table class="table">
                            <thead>
                            <tr>
                                <th></th>
                                <th>Printers</th>
                                <th>Scanners</th>
                                <th>Photocopiers</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td>Floor 1</td>
                                <td>4</td>
                                <td></td>
                                <td>2</td>
                            </tr>
                            <tr>
                                <td>Floor 3</td>
                                <td>1</td>
                                <td>2</td>
                                <td></td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="hidden-xs col-sm-6"><img class="map-holder" data-src="holder.js/100%x350/social/text:Google map or Gorgas floorplan"></div>
                </div>
                <div id="money" class="row slice slice-red">
                    <h2>Put money on your Action/Community Card</h2>
                    <div class="col-sm-4 text-center">
                        <span class="fa-stack fa-5x"><span class="fa fa-circle fa-stack-2x"></span><span class="fa fa-credit-card fa-stack-1x fa-inverse"></span></span>
                        <h3>With a credit card</h3>
                        <p class="text-left">Log into the <a href="https://actioncard-sp.blackboard.com/eaccounts/AnonymousHome.aspx">Action Card MyAccounts</a> website and add cash using your credit card. <span class="label label-warning">Action Card Only</span></p>

                    </div>
                    <div class="col-sm-4 text-center">
                        <span class="fa-stack fa-5x"><span class="fa fa-circle fa-stack-2x"></span><span class="fa fa-money fa-stack-1x fa-inverse"></span></span>
                        <h3>With cash</h3>
                        <p class="text-left">Deposit cash into one of the printing card dispenser machines located in Gorgas, Bruno, McLure, and Rodgers Libraries.</p>

                    </div>
                    <div class="col-sm-4 text-center">
                        <span class="fa-stack fa-5x"><span class="fa fa-circle fa-stack-2x"></span><span class="fa fa-pencil-square-o fa-stack-1x fa-inverse"></span></span>
                        <h3>With a check</h3>
                        <p class="text-left">Write a check at the <a href="#">Gorgas Library Copy Center</a>.</p>

                    </div>
                </div>
                <div id="laptop" class="row slice">
                    <h2>Print from your laptop</h2>
                    <p class="lead">Download and install the drivers linked below</p>

                    <div class="col-sm-6 text-center">
                        <span class="fa fa-windows fa-5x"></span>
                        <h3>Windows Drivers</h3>
                        <div class="small">Select the library from which you would like to print</div>
                        <ul class="list-unstyled">
                            <li>Gorgas <a href="#">32-bit</a> | <a href="#">64-bit</a></li>
                            <li>McLure <a href="#">32-bit</a> | <a href="#">64-bit</a></li>
                            <li>Rodgers <a href="#">32-bit</a> | <a href="#">64-bit</a></li>
                        </ul>
                    </div>
                    <div class="col-sm-6 text-center">
                        <span class="fa fa-apple fa-5x"></span>
                        <h3>OS X Driver</h3>
                        <ul class="list-unstyled">
                            <li><a href="#">Download</a></li>
                        </ul>
                    </div>
                </div>
                <div id="community" class="row slice slice-orange">
                    <h2>Get a Community User Card <span class="label label-success">$1</span></h2>
                    <div class="col-sm-4 col-sm-offset-2">
                        <div class="media step-card">
                            <div class="step-num media-object pull-left">1</div>
                            <div class="media-body step-text">Purchase a reusable Community User Card from a printing card dispenser located in Gorgas, Bruno, McLure and Rodgers Libraries.</div>
                        </div>
                    </div>
                    <div class="col-sm-4">
                        <div class="media step-card">
                            <div class="step-num media-object pull-left">2</div>
                            <div class="media-body step-text">Add money to your new card by depositing cash into the printing card dispenser</div>
                        </div>
                    </div>
                </div>
                <div id="department" class="row slice">
                    <h2>Get a University Department Card <span class="label label-success">$3</span></h2>
                    <div class="col-sm-4 col-sm-offset-2">
                        <div class="media step-card">
                            <div class="step-num media-object pull-left">1</div>
                            <div class="media-body step-text">Complete a Departmental Transfer form.</div>
                        </div>
                    </div>
                    <div class="col-sm-4">
                        <div class="media step-card">
                            <div class="step-num media-object pull-left">2</div>
                            <div class="media-body step-text">Take it to the Action Card Office in the Student Services Building.</div>
                        </div>
                    </div>
                </div>
                <div id="help" class="row slice">
                    <h2>Help</h2>
                    <div style="height: 300px;"></div>
                </div>
            </div>
            <div class="col-xs-3">
                <div class="list-group sub-menu fixie-menu">
                    <a class="list-group-item" href="#how" du-smooth-scroll du-scrollspy offset="100"><i class="fa fa-print fa-fw"></i>&nbsp; How to print</a><a class="list-group-item" href="#where" du-smooth-scroll du-scrollspy offset="100"><i class="fa fa-binoculars fa-fw"></i>&nbsp; Where to print, scan, or copy</a><a class="list-group-item" href="#money" du-smooth-scroll du-scrollspy offset="100"><i class="fa fa-money fa-fw"></i>&nbsp; Put money on your Card</a><a class="list-group-item" href="#laptop" du-smooth-scroll du-scrollspy offset="100"><i class="fa fa-laptop fa-fw"></i>&nbsp; Print from your laptop</a><a class="list-group-item" href="#community" du-smooth-scroll du-scrollspy offset="100"><i class="fa fa-credit-card fa-fw"></i>&nbsp; Get a Community User Card</a><a class="list-group-item" href="#department" du-smooth-scroll du-scrollspy offset="100"><i class="fa fa-university fa-fw"></i>&nbsp; Get a University Department Card</a><a class="list-group-item" href="#help" du-smooth-scroll du-scrollspy offset="100"><i class="fa fa-life-ring fa-fw"></i>&nbsp; Help</a></div>
            </div>
        </div>
        <div class="row">
            <div id="disclaimer" class="col-xs-12">
                <div class="alert alert-warning">
                    <h2>Copyright disclaimer</h2>
                    The copyright law of the United States (Title 17, United States Code) governs the making of photocopies or other reproductions of copyrighted material.

                    Under certain conditions specified in the law, libraries and archives are authorized to furnish a photocopy or other reproduction. One of these specified conditions is that the photocopy or reproduction is not to be "used for any purpose other than private study, scholarship, or research." If a user makes a request for, or later uses, a photocopy or reproductions for purposes in excess of "fair use;" that user may be liable for copyright infringement.

                    This institution reserves the right to refuse to accept a copying order if, in its judgment, fulfillment of the order would involve violation of copyright law.

                </div>
            </div>
        </div>
    </div>
</div><!-- end of #content -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/holder/2.4.0/holder.js"></script>
<script src="https://rawgit.com/oblador/angular-scroll/master/angular-scroll.min.js"></script>
<script>
    angular.module('redesign', ['ui.bootstrap', 'duScroll'])
        .directive('fixieMenu', ['$window', function($window){
            return {
                restrict: 'AC',
                link: function(scope, elm, attrs){
                    var width = elm[0].offsetWidth;
                    var fixed = false;
                    var fixieClass = 'fixie';
                    var offset = 400;
                    angular.element($window).bind('scroll', fixieScroll);
                    function fixieScroll(ev){
                        if (this.pageYOffset > offset) {
                            if (!fixed){
                                console.log(width);
                                elm.addClass(fixieClass);
                                elm.css('width', width+'px');
                                fixed = true;
                            }
                        }
                        else {
                            if (fixed){
                                elm.removeClass(fixieClass);
                                elm.css('width', 'auto');
                                fixed = false;
                            }
                        }
                        scope.$apply();
                    }
                    scope.$on('$destroy', function(){
                        angular.element($window).unbind('scroll', fixieScroll);
                    });
                }
            }
        }]);
</script>
<script src="//tinymce.cachefly.net/4.1/tinymce.min.js"></script>
<script type="text/javascript">
    tinymce.init({
        selector: "div.price",
        inline: true,
        toolbar: "undo redo",
        menubar: false
    });
</script>

