<header role="banner">
    <nav class="navbar navbar-static-top navbar-mega-inverse" role="navigation">
        <div class="container-fluid">
            <div class="navbar-header">
                <button type="button" class="navbar-toggle collapsed">
                    <span class="sr-only">Toggle navigation</span>
                    <span class="fa fa-bars"></span>
                </button>
                <a class="navbar-brand" href="#">
                    <img src="<?php print get_template_directory_uri(); ?>/assets/img/ualib-logo-textonly-inverse.png" alt="University of Alabama Libraries"/>
                </a>
            </div>
            <div class="collapse navbar-collapse">
                <ul class="nav navbar-nav navbar-right">
                    <li class="dropdown yamm-fw">
                        <a href="#" class="dropdown-toggle icon-only" title="My Accounts">
                            <span class="fa fa-user"></span>
                        </a>
                        <ul class="dropdown-menu">
                            <li>
                                <div class="yamm-content">
                                    <h2>My Accounts</h2>
                                    <tabset  vertical="true" tab-class="col-sm-3" content-class="col-sm-9">
                                        <tab heading="My Library (Catalog)">
                                            <form>
                                                <div class="form-group">
                                                    <label for="exampleInputEmail1">CWID</label>
                                                    <input type="text" class="form-control" id="exampleInputEmail1" placeholder="Enter email">
                                                </div>
                                                <div class="form-group">
                                                    <label for="exampleInputPassword1">Last Name</label>
                                                    <input type="text" class="form-control" id="exampleInputPassword1" placeholder="Password">
                                                </div>
                                                <select class="form-control">
                                                    <option selected="" value="1@UADB20021202141309">University of Alabama Libraries</option>
                                                    <option value="1@AUBDB20011120113530">Auburn University Libraries</option>
                                                    <option value="1@AUMDB20011120113546">Auburn University Montgomery</option>
                                                    <option value="1@JACKDB20020808100014">Houston Cole Library</option>
                                                    <option value="1@UABDB20020817181349">Mervyn H. Sterne Library</option>
                                                </select>
                                                <button type="submit" class="btn btn-default">Login to Library Catalog</button>
                                            </form>
                                        </tab>
                                        <tab heading="Interlibrary Loan (ILLiad)">
                                            <form>
                                                <div class="form-group">
                                                    <label for="exampleInputEmail1">User</label>
                                                    <input type="text" class="form-control" id="exampleInputEmail1" placeholder="Enter email">
                                                </div>
                                                <div class="form-group">
                                                    <label for="exampleInputPassword1">Password</label>
                                                    <input type="text" class="form-control" id="exampleInputPassword1" placeholder="Password">
                                                </div>
                                                <button type="submit" class="btn btn-default">Login to ILLiad</button>
                                            </form>
                                        </tab>
                                        <tab heading="Refworks">
                                            <form>
                                                <div class="form-group">
                                                    <label for="exampleInputEmail1">User</label>
                                                    <input type="text" class="form-control" id="exampleInputEmail1" placeholder="Enter email">
                                                </div>
                                                <div class="form-group">
                                                    <label for="exampleInputPassword1">Password</label>
                                                    <input type="text" class="form-control" id="exampleInputPassword1" placeholder="Password">
                                                </div>
                                                <button type="submit" class="btn btn-default">Login to Refworks</button>
                                            </form>
                                        </tab>
                                        <tab heading="Endnote">
                                            <form>
                                                <div class="form-group">
                                                    <label for="exampleInputEmail1">Email</label>
                                                    <input type="text" class="form-control" id="exampleInputEmail1" placeholder="Enter email">
                                                </div>
                                                <div class="form-group">
                                                    <label for="exampleInputPassword1">Password</label>
                                                    <input type="text" class="form-control" id="exampleInputPassword1" placeholder="Password">
                                                </div>
                                                <button type="submit" class="btn btn-default">Login to Endnote</button>
                                            </form>
                                        </tab>
                                        <tab heading="myBama">
                                            <form>
                                                <div class="form-group">
                                                    <label for="exampleInputEmail1">myBama User</label>
                                                    <input type="text" class="form-control" id="exampleInputEmail1" placeholder="Enter email">
                                                </div>
                                                <div class="form-group">
                                                    <label for="exampleInputPassword1">Password</label>
                                                    <input type="text" class="form-control" id="exampleInputPassword1" placeholder="Password">
                                                </div>
                                                <button type="submit" class="btn btn-default">Login to myBama</button>
                                            </form>
                                        </tab>
                                        <tab heading="Blackboard Learn">
                                            <form>
                                                <div class="form-group">
                                                    <label for="exampleInputEmail1">myBama Id</label>
                                                    <input type="text" class="form-control" id="exampleInputEmail1" placeholder="Enter email">
                                                </div>
                                                <div class="form-group">
                                                    <label for="exampleInputPassword1">Password</label>
                                                    <input type="text" class="form-control" id="exampleInputPassword1" placeholder="Password">
                                                </div>
                                                <button type="submit" class="btn btn-default">Login to Blackboard Learn</button>
                                            </form>
                                        </tab>
                                    </tabset>
                                </div>
                            </li>
                        </ul>
                    </li>
                    <li class="<?php if(is_front_page()) print 'dropdown-static '; ?>dropdown yamm-fw">
                        <?php if (!is_front_page()): ?>
                        <a href="#" class="dropdown-toggle icon-only">
                            <span class="fa fa-search"></span>
                        </a>
                        <?php endif; ?>
                        <ul class="dropdown-menu">
                            <li>
                                <div class="yamm-content">
                                    <form action="/sample-page/onesearch/">
                                        <div class="input-group input-group-lg">
                                            <input type="text" name="search" class="form-control onesearch-text" placeholder="Search all library resources">
                                            <div class="input-group-btn">
                                                <button type="submit" class="btn btn-onesearch btn-primary"><span class="fa fa-search"></span></button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </li>
                        </ul>
                    </li>
                </ul>
                <ul class="nav navbar-nav navbar-right">
                    <li class="dropdown yamm-fw">
                        <a href="#" class="dropdown-toggle">Research Tools</a>
                        <ul class="dropdown-menu">
                            <li>
                                <div class="yamm-content">
                                    <div class="row">
                                        <div class="col-xs-3">
                                            <a class="service-card" href="https://wwwdev2.lib.ua.edu/sample-page/onesearch/">
                                                <span class="fa fa-search"></span>
                                                <h4>OneSearch</h4>
                                                <p>Search everything the University Libraries’ offer from one palce</p>
                                            </a>
                                        </div>
                                        <div class="col-xs-3">
                                            <a class="service-card" href="https://wwwdev2.lib.ua.edu/research-help/scout/">
                                                <span class="fa fa-binoculars"></span>
                                                <h4>Scout</h4>
                                                <p>Search for books, articles, and more</p>
                                            </a>
                                        </div>
                                        <div class="col-xs-3">
                                            <a class="service-card" href="https://wwwdev2.lib.ua.edu/research-help/databases/">
                                                <span class="fa fa-database"></span>
                                                <h4>Databases</h4>
                                                <p>Explore databases for a wide range of subjects</p>
                                            </a>
                                        </div>
                                        <div class="col-xs-3">
                                            <a class="service-card" href="https://wwwdev2.lib.ua.edu/research-help/google-scholar/">
                                                <span class="fa fa-google"></span>
                                                <h4>Google Scholar</h4>
                                                <p>Search Google Scholar for articles and academic journals</p>
                                            </a>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-xs-3">
                                            <a class="service-card" href="https://wwwdev2.lib.ua.edu/research-help/subject-guides/">
                                                <span class="fa fa-compass"></span>
                                                <h4>Subject and Course Guides</h4>
                                                <p>Explore our vast array of academic subject and course guides</p>
                                            </a>
                                        </div>
                                        <div class="col-xs-3">
                                            <a class="service-card" href="https://wwwdev2.lib.ua.edu/research-help/subject-specialists/">
                                                <span class="fa fa-comments"></span>
                                                <h4>Subject Specialists</h4>
                                                <p>Need help with your research? Get in contact with our subject specialists.</p>
                                            </a>
                                        </div>
                                        <div class="col-xs-3">
                                            <a class="service-card" href="https://wwwdev2.lib.ua.edu/research-help/government-information/">
                                                <span class="fa fa-university"></span>
                                                <h4>Government Information, Statistics and Data</h4>
                                                <p>Description</p>
                                            </a>
                                        </div>
                                        <div class="col-xs-3">
                                            <a class="service-card" href="https://wwwdev2.lib.ua.edu/research-help/tutorials/">
                                                <span class="fa fa-magic"></span>
                                                <h4>Tutorials and Instructional Videos</h4>
                                                <p>Description</p>
                                            </a>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-xs-3">
                                            <a class="service-card" href="https://wwwdev2.lib.ua.edu/research-help/citation-finder/">
                                                <span class="fa fa-quote-left"></span>
                                                <h4>Citation Finder</h4>
                                                <p>Description</p>
                                            </a>
                                        </div>
                                        <div class="col-xs-3">
                                            <a class="service-card" href="https://wwwdev2.lib.ua.edu/libraries-and-collections/campus-libraries/music-library/music-library-search/">
                                                <span class="fa fa-music"></span>
                                                <h4>Music Library Search</h4>
                                                <p>Search what our Music Library has to offer</p>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </li>
                    <li class="dropdown yamm-fw">
                        <a href="#" class="dropdown-toggle">Using the Library</a>
                        <ul class="dropdown-menu">
                            <li>
                                <div class="yamm-content">
                                    <div class="row">
                                        <div class="col-sm-3">
                                            <div class="service-list">
                                                <span class="fa fa-desktop"></span>
                                                <h4>Computers, Software, &amp; Equipment</h4>
                                                <ul>
                                                    <li><a href="https://wwwdev2.lib.ua.edu/services/photocopying/">Print, Scan, Copy</a></li>
                                                    <li class="menu-computer-availability"><a href="https://wwwdev2.lib.ua.edu/services/computer-availability/computer-availability/">Computer Availability</a></li>
                                                    <li class="menu-laptop-computers"><a href="https://wwwdev2.lib.ua.edu/services/computer-availability/laptop-computers/">Laptop Computers</a></li>
                                                    <li class="menu-library-software-list"><a href="https://wwwdev2.lib.ua.edu/services/computer-availability/library-software-list/">Library Software List</a></li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div class="col-sm-9">
                                            <div class="row">
                                                <div class="col-md-4">
                                                    <a class="service-card" href="https://wwwdev2.lib.ua.edu/services/find-a-place-to-study/">
                                                        <span class="fa fa-book"></span>
                                                        <h4>Find a Place to Study</h4>
                                                        <p>Quiet place to study and stuffs yallz</p>
                                                    </a>
                                                </div>
                                                <div class="col-md-4">
                                                    <a class="service-card" href="https://wwwdev2.lib.ua.edu/services/practice-presentation-rooms/">
                                                        <span class="fa fa-area-chart"></span>
                                                        <h4>Practice Presentation Rooms</h4>
                                                    </a>
                                                </div>
                                                <div class="col-md-4">
                                                    <a class="service-card" href="https://wwwdev2.lib.ua.edu/services/library-instruction/">
                                                        <h4>Classes, Workshops, Tours</h4>
                                                    </a>
                                                </div>
                                            </div>
                                            <div class="row">
                                                <div class="col-md-4">
                                                    <a class="service-card" href="https://wwwdev2.lib.ua.edu/services/interlibrary-loan/">
                                                        <span class="fa fa-exchange"></span>
                                                        <h4>Interlibrary Borrowing</h4>
                                                    </a>
                                                </div>
                                                <div class="col-md-4">
                                                    <a class="service-card" href="https://wwwdev2.lib.ua.edu/services/disability-services/">
                                                        <span class="fa fa-wheelchair"></span>
                                                        <h4>Disability Services</h4>
                                                    </a>
                                                </div>
                                                <div class="col-md-4">
                                                    <a class="service-card" href="https://wwwdev2.lib.ua.edu/services/digital-humanities-center/">
                                                        <span class="fa fa-tachometer"></span>
                                                        <h4>Alabama Digital Humanities Center</h4>
                                                    </a>
                                                </div>
                                            </div>
                                            <div class="row">
                                                <div class="col-md-4">
                                                    <a class="service-card" href="https://wwwdev2.lib.ua.edu/services/sanford-media-center/">
                                                        <span class="fa fa-cubes"></span>
                                                        <h4>Sanford Media Center</h4>
                                                    </a>
                                                </div>
                                                <div class="col-md-4">
                                                    <a class="service-card" href="https://wwwdev2.lib.ua.edu/services/information-for-faculty/">
                                                        <span class="fa fa-graduation-cap"></span>
                                                        <h4>Information for Faculty</h4>
                                                    </a>
                                                </div>
                                                <div class="col-md-4">
                                                    <a class="service-card" href="https://wwwdev2.lib.ua.edu/services/library-information-for-current-students/">
                                                        <span class="fa fa-pencil"></span>
                                                        <h4>Information for Students</h4>
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </li>
                    <li class="dropdown yamm-fw">
                        <a href="#" class="dropdown-toggle">About</a>
                        <ul class="dropdown-menu">
                            <li>
                                <div class="yamm-content">
                                    <div class="row">

                                    </div>
                                </div>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</header>
