// ==UserScript==
// @name         meva-salut-fix
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Fixes the calendar picker so you actually book a meeting with your doctor
// @author       Rodrigo Arias Mallo <rodarima@gmail.com>
// @match        https://citasalut.gencat.cat/ppm/*/CitaProfessional/FamiliarOnsite*
// @match        https://citasalut.gencat.cat/ppm/*/CitaProfessional/InfermeriaOnsite*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gencat.cat
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function printCalendar2(id, dates, onSelectDia, diaCallback) {

        localDates = new Array();
        var initDate = new Date(dates.inici);
        var finDate = new Date(dates.fi);
        finDate.setDate(finDate.getDate() + 1);
        if (dates.dies) {
            jQuery(dates.dies).each(function (i, item) {
                // Fix the format "8/5/2023" -> "08/05/2023"
                var l = item.dataJS.split("/")

                var okdate = ('0' + l[0]).slice(-2) + '/' + ('0' + l[1]).slice(-2) + '/' + l[2];
                localDates.push(okdate);
            })
        }
        else {
            while ((finDate - initDate) != 0) {
                localDates.push(initDate.toLocaleDateString());
                initDate.setDate(initDate.getDate() + 1)
            }
        }

        var defDate = null;
        if (localDates.length > 0) {
            defDate = localDates[0];
        }

        $.datepicker.setDefaults($.datepicker.regional["ca"]);

        $("#" + id).html("<div id='dp-" + id + "'></div>");
        $("#dp-" + id).datepicker(
            {
                altFormat: "dd-mm-yy",
                defaultDate: defDate,
                onSelect: onSelectDia,
                inline: true,
                firstDay: 1,
                minDate: initDate,
                maxDate: finDate,
                beforeShowDay: diaCallback
            }).on("change", onSelectDia($("#dp-" + id).val()));
    }

    window.printCalendar = printCalendar2;

})();
