
	<div id="library-pane-wrapper" class="bb5-windowpane-wrapper windowpane-treeview">
    <div class="bb5-windowpane-tree ui-layout-pane ui-layout-west">

			<div class="ui-layout-north">
  <p><strong data-i18n="toolbar.selector.select_folder">Sélectionner une rubrique</strong></p>
</div>

<div class="inner-center layout-overflow-scroll">
  <div class="bb5-windowpane-tree-inner">
    <!-- tree pane: tree wrapper -->
    <div class="bb5-windowpane-treewrapper">

        <div class="bb5-windowpane-treewrapper-inner jstree jstree-3 jstree-focused jstree-bb5">
          <div class="bb5-treeview">
          </div>
        </div>
    </div>
    <!-- end tree pane: tree wrapper -->
  </div>
</div><!--/.inner-center-->

<div class="ui-layout-south">
  <p><button type="button" class="btn btn-simple btn-xs btn-block"><i class="fa fa-trash-o"></i>Supprimer</button></p>
  <p><button type="button" class="btn btn-transparent btn-xs btn-toggle btn-show-legend"><i class="fa fa-angle-down"></i> Légende</button></p>
</div><!--/.ui-layout-south-->
    </div>
    <div class="bb5-windowpane-main ui-layout-pane ui-layout-center">

      <div class="ui-layout-north">
        <div class="bb5-form-wrapper">
          <div class="row">
            <div class="col-bb5-x">
              <div class="row form-group"><span class="col-md
  col-sm-6"><label class="sr-only" for="form10">Titre</label><input id="form10" type="text" placeholder="Titre" class="form-control input-xs"></span> <span class="col-bb5-x pull-right bb5-query-results">Article - 593 éléments</span></div>
              <div class="row form-group"><span class="col-md
  col-sm-3"><label class="sr-only" for="form11">Type</label> <select id="form11" class="form-control input-xs" name="[]"><option value="">Type</option></select></span> <span class="col-md
  col-sm-3"><label class="sr-only" for="form12">Statut</label> <select id="form12" class="form-control input-xs" name="[]"><option value="">Statut</option></select></span></div>
              <div class="row form-group">
                <div class="col-bb5-x">Publication avant le : </div>
                <div class="col-bb5-22"><div class="input-group input-group-xs"><input type="text" placeholder="dd/mm/aaaa" class="form-control input-xs bb5-datepicker"><span class="input-group-btn"><button type="button" class="btn btn-default"><i class="fa fa-calendar"></i></button></span></div></div>
                <div class="col-bb5-x">Après le : </div>
                <div class="col-bb5-22"><div class="input-group input-group-xs"><input type="text" placeholder="dd/mm/aaaa" class="form-control input-xs bb5-datepicker"><span class="input-group-btn"><button type="button" class="btn btn-default"><i class="fa fa-calendar"></i></button></span></div></div>
                <div class="col-bb5-x pull-right"><button type="button" class="btn btn-default btn-xs"><i class="fa fa-search"></i> Rechercher</button></div>
              </div>
            </div>

          </div>
        </div><!--/.form-wrapper-->

        <div class="row">
          <div class="col-bb5-100">
            <p class="bb5-widget-toolbar result-infos"></p>
            <div class="bb5-widget-toolbar list-options clearfix">
              <ul class="pagination clearfix">
                <li><a href="#" class="bb5-pagination-btn"><i class="fa fa-angle-double-left"></i></a></li>
                <li><a href="#" class="bb5-pagination-btn bb5-pagination-prev"><i class="fa fa-angle-left"></i></a></li>
                <li><span class="bb5-pagination-current">1</span></li>
                <li><a href="#">2</a></li>
                <li><a href="#">3</a></li>
                <li><a href="#">4</a></li>
                <li><a href="#">5</a></li>
                <li><a href="#" class="bb5-pagination-btn bb5-pagination-next"><i class="fa fa-angle-right"></i></a></li>
                <li><a href="#" class="bb5-pagination-btn"><i class="fa fa-angle-double-right"></i></a></li>
              </ul>
              <p class="pull-right">
                <button type="button" class="btn btn-simple btn-sm bb5-sortasgrid fa fa-th-large"></button>
                <button type="button" class="btn btn-simple btn-sm bb5-sortaslist fa fa-list-ul"></button>
                <select class="max-per-page-selector input-xs"></select>
              </p>
            </div>
          </div>
        </div>
      </div><!--/.ui-layout-north-->

      <div class="inner-center layout-overflow-scroll data-list-ctn"></div><!--/.inner-center-->

    </div>
  </div>
