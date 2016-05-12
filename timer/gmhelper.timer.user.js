// ==UserScript==
// @name        GM Helper Timer
// @namespace   gm.helper
// @include     *
// @require     http://code.jquery.com/jquery-2.2.2.min.js
// @require     https://github.com/eldiamo/GM.Helper/raw/master/timer/gmhelper.timer.js
// @version     1
// @grant       none
// ==/UserScript==

"use strict"

let gmhelper_timer = "<div id='gmhelper_timer'><table>"
       + "<tr><td>Beginn:</td><td><input id='starttime' type='text' class='timeinput' size='4'/></td></tr>"
       + "<tr><td>Pause:</td><td><input id='breaktime' type='text' class='timeinput' size='4'/></td></tr>"
       + "<tr><td>Feierabend:</td><td><input id='endtime' type='text' class='timeinput' size='4'/></td></tr>"
       + "<tr><td>Arbeitszeit:</td><td><input id='worktime' type='text' class='timeinput' size='4'/></td></tr>"
       + "</table></div>";

//$(gmhelper_timer).insertAfter
$("body").first().after(gmhelper_timer);

$("#gmhelper_timer")
  .css("background-color", "#fff")
  .css("border", "1px double #ccc")
  .css("position", "absolute")
  .css("z-index", "9999999999999999")
  .css("top", "0px")
  .css("right", "0px");

// TODO getUTCDate() vs getDate() und andere UTS-Funktionen
// TODO highlight input fields that were updated (backround getting green for short)
// TODO pause vereinheitlichen: eingabe in minuten VS anzeige in stunden und minuten, bsp.: 100 -> 0140

GMHelper.Timer.init('none', 30, '0830');

$('#starttime')
  .val(GMHelper.Timer.getStarttime())
  .change(function(event) {
    GMHelper.Timer.setStarttime($(this).val());
    updateInputs();
  });
$('#breaktime')
  .val(GMHelper.Timer.getBreaktime())
  .change(function(event) {
    GMHelper.Timer.setBreaktime($(this).val());
    updateInputs();
  });
$('#endtime')
  .val(GMHelper.Timer.getEndtime())
  .change(function(event) {
    GMHelper.Timer.setEndtime($(this).val());
    updateInputs();
  });
$('#worktime')
  .val(GMHelper.Timer.getWorktime())
  .change(function(event) {
    GMHelper.Timer.setWorktime($(this).val());
    updateInputs();
  });

function updateInputs() {
  $('#starttime').val(GMHelperTimer.getStarttime());
  $('#breaktime').val(GMHelper.Timer.getBreaktime());
  $('#endtime').val(GMHelper.Timer.getEndtime());
  $('#worktime').val(GMHelper.Timer.getWorktime());
}
