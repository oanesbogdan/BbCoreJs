<div id="bb5-ui">
    <nav id="bb5-navbar-primary" class="navbar navbar-inverse clearfix" role="navigation">
        <ul class="nav nav-tabs bb5-ui-width-setter" id="bb5-maintabs">
            {{#each menus}}
            <li class="dropdown{{#if active}} active{{/if}}">
                <a data-toggle="dropdown" class="dropdown-toggle" id="myTabDrop1" href="{{url}}">{{text}} <b class="caret"></b></a>
                <ul aria-labelledby="{{label}}" role="menu" class="dropdown-menu">
                    {{#each items}}
                    <li class="{{#if active}}active{{/if}}"><a data-toggle="tab" tabindex="-1" href="{{url}}">{{text}}</a></li>
                    {{/each}}
                </ul>
            </li>
            {{/each}}
        </ul>
        <ul class="nav navbar-nav pull-right"></ul>
    </nav>

    <nav id="bb5-navbar-secondary" class="navbar navbar-default">
        <div class="navbar-header">
            <span class="navbar-brand"><img src="img/backbuilder5.png" alt="BackBuilder5"></span>
            <div class="bb5-ui-width-setter"><span class="bb5-ui-tab-title"></span></div>
            <ul class="nav navbar-nav pull-right"></ul>
        </div>
    </nav>
</div>