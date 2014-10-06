define(['jquery', 'hgn!stub/templates/basic'], function($, BasicTemplate) {
    'use strict';

    var Stub = function (opts) {
        opts = opts || {};

        $(opts.el).html(BasicTemplate(opts));
        console.log("JQuery Version: " + $.fn.jquery);
    };

    return Stub;
});