define(['component!translator', 'component!logger', 'tb.core.Renderer', 'es5-shim/es5-shim'], function (Translator, Logger, Renderer) {
    'use strict';

    Translator.init({'locale': 'en_US', 'base': 'src/tb/i18n/'});
    var locale_fr = "fr_FR";

    describe("Translator core library test suite", function () {

        it("Should translate the key from default catalog", function () {
            expect(Translator.translate('app_validate')).toEqual('Validate');
        });

        it("Should set a new locale", function () {
            Translator.setLocale(locale_fr);
            expect(Translator.getLocale()).toEqual(locale_fr);
        });

        it("Should translate the key with another locale than default's one", function () {
            Translator.setLocale(locale_fr);
            expect(Translator.translate('app_validate')).toEqual('Valider');
        });

        it("Should return the default locale value if requested is not available", function () {
            Translator.setLocale(locale_fr);
            expect(Translator.translate('app_only_default')).toEqual('Only default');
        });

        it("Should log a notice if the translation for the selected catalog is not found", function () {
            spyOn(Logger, "notice").and.returnValue('The key "foo.bar" is malformed.').and.callThrough();
            Translator.setLocale(locale_fr);
            Translator.translate('app_only_default');
            expect(Logger.notice).toHaveBeenCalled();
        });

        it("Should return at least the key if key is malformed", function () {
            Translator.setLocale(locale_fr);
            expect(Translator.translate('app_only_not_default')).toEqual('app_only_not_default');
        });

        it("Should log a warning if the translation is not found", function () {
            spyOn(Logger, "warning").and.returnValue('The key "foo.bar" is malformed.').and.callThrough();
            Translator.translate('foo.bar');
            expect(Logger.warning).toHaveBeenCalled();
        });

        it("Should be able to render key in Renderer scope", function () {
            expect(Renderer.render("{{ 'app_validate' | trans }}")).toEqual('Valider');
        });
    });
});
