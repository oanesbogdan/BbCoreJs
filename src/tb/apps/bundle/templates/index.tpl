<div class="tab-pane active" id="dropdown40">
    <div class="row">
        <div class="col-bb5-30 bb5-border-right">
            <div class="bb5-extension-pane">
                <div class="row">
                    <div class="col-bb5-30">
                        <figure class="bb5-extension-img"><img src="resources/img/extension.png" alt=""></figure>
                    </div>
                    <div class="col-bb5-70">
                        <p><strong>{{ bundles.0.name }}</strong></p>
                        <div class="form-group btn-group btn-group-justified">
                            <a class="btn btn-xs btn-default {{#if bundles.0.enable}}active{{/if}}" role="button">Activer</a>
                            <a class="btn btn-xs btn-default {{#unless bundles.0.enable}}active{{/unless}}" role="button">Désactiver</a>
                        </div>
                        <p class="position-bottom">
                            <button type="button" class="btn btn-transparent btn-xs btn-toggle btn-dialog-extension">
                               <a href="javascript:;" data-action="bundle:list"><i class="fa fa-angle-down"></i> Voir mes extensions</a>
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div><!--/ End col-->

        <div class="col-bb5-58 bb5-border-right">
            <div class="tab-pane  bb5-content-txt">
                <div class="bb5-scroll-overflow">
                    <p>{{ bundles.0.description }}</p>
                </div>
            </div>
        </div><!--/ End col-->

        <div class="col-bb5-12">
            <p>
                <button type="button" class="btn btn-default-grey btn-sm btn-block">
                    <i class="fa fa-floppy-o"></i> Enregistrer
                </button>
            </p>
            <p>
                <button type="button" class="btn btn-default-grey btn-sm btn-block">
                    <i class="fa fa-reply"></i> Rétablir
                </button>
            </p>
            <p>
                <button type="button" class="btn btn-default-grey btn-sm btn-block">
                    <i class="fa fa-share"></i> Annuler
                </button>
            </p>
        </div><!--/ End col-->
    </div>
</div>