/* jshint ignore:start */
define(["pastry/pastry","pastry/html/escape"], function (helper) {return function(obj, ne){
var _e=ne?function(s){return s;}:helper.escape,print=function(s,e){_s+=e?(s==null?'':s):_e(s);};obj=obj||{};with(obj){_s='<div class="body"><input id="search-query" type="text" placeholder="Press \'ENTER\' to search, at least 1 character. Press \'ESC\' to quit."><span class="fa fa-search" id="submit-search"></span><div class="flex-container" id="search-result"><div class="flex-col-left"><header class="align-center">In Path Names</header><section class="body"><div class="result" id="search-glob-result"></div></section></div><div class="flex-col-right"><header class="align-center">In File Contents</header><section class="body"><div class="result" id="search-content-result"></div></section></div></div></div>';}return _s;
}});
/* jshint ignore:end */