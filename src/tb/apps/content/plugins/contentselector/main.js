define(
    [
        'content.pluginmanager',
        'component!contentselector',
        'component!translator',
        'jquery',
        'content.manager',
        'jsclass'
    ],
    function (
        PluginManager,
        ContentSelector,
        Translator,
        jQuery,
        ContentManager
    ) {
        'use strict';

        PluginManager.registerPlugin('contentselector', {
            onInit: function () {
                this.contentSelector = ContentSelector.createContentSelector({
                    mode: 'edit'
                });
                this.contentSelector.on('close', jQuery.proxy(this.handleContentSelection, this));
            },

            handleContentSelection: function (selections) {
                var position,
                    content,
                    self = this,
                    promises = [],
                    currentPromise,
                    i;

                if (!selections.length) {
                    return;
                }

                jQuery.each(selections, function (index) {
                    content = ContentManager.buildElement(selections[index]);
                    position = self.getConfig("appendPosition");
                    position = (position === "bottom") ? "last" : 0;
                    promises.push(self.getCurrentContent().append.bind(self.getCurrentContent(), content, position));
                });

                currentPromise = promises[0]();

                for (i = 1; i < promises.length; i = i + 1) {
                    currentPromise = currentPromise.then(promises[i]);
                }
            },

            showContentSelector: function () {
                /* set Accept and other things */
                var currentContent = this.getCurrentContent(),
                    accept = ContentManager.replaceChars(currentContent.getAccept(), '\\', '/');

                this.contentSelector.setContenttypes(accept);
                this.contentSelector.display();
            },

            canApplyOnContext: function () {
                var content = this.getCurrentContent(),
                    check = false;

                if (content.isAContentSet()) {
                    if (content.maxEntry) {
                        if (content.getNodeChildren().length < content.maxEntry) {
                            check = true;
                        }
                    } else {
                        check = true;
                    }
                }

                return check;
            },

            getActions: function () {
                var self = this;
                return [{
                    ico: 'fa fa-th-large',
                    cmd: self.createCommand(self.showContentSelector, self),
                    label: Translator.translate('content_selector'),
                    checkContext: function () {
                        return self.canApplyOnContext();
                    }
                }];
            }
        });
    }
);
