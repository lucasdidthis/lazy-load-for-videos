var $llv=jQuery.noConflict(),classPreviewVimeo="preview-vimeo",classPreviewVimeoDot="."+classPreviewVimeo,classBranding="lazyload-info-icon",classBrandingDot="."+classBranding,videoratio=.5625,$llv_o,setOptionsVimeo=function(e){$llv_o=$llv.extend({playercolour:"",videoseo:!1,responsive:!0},e)};$llv(document).ready(function(){function e(){v(),i(),o()}var l=function(){return'<a class="'+classBranding+'" href="http://kevinw.de/lazyloadvideos" title="Lazy Load for Videos by Kevin Weber" target="_blank">i</a>'},i=function(){if($llv_o.displayBranding!==!1){var e=$llv(classPreviewVimeoDot),i=$llv(l());e.before(i)}},o=function(){$llv(classPreviewVimeoDot).on("click",function(){var e=p(this);t(this),n(this);var l="";$llv_o.playercolour!==l&&($llv_o.playercolour=r($llv_o.playercolour),l="&color="+$llv_o.playercolour),$llv(this).html('<iframe src="'+a(e)+"?autoplay=1"+l+'" style="height:'+parseInt($llv("#"+e).css("height"))+'px;width:100%" frameborder="0" webkitAllowFullScreen mozallowfullscreen autoPlay allowFullScreen></iframe>'),"function"==typeof m.resize&&$llv_o.responsive===!0&&m.resize()})},t=function(e){$llv(e).removeClass(classPreviewVimeo)},n=function(e){$llv(e).prev(classBrandingDot).remove()},a=function(e){return"//player.vimeo.com/video/"+e},r=function(e){var l=e.toString().replace(/[.#]/g,"");return l},v=function(){$llv(classPreviewVimeoDot).each(function(){var e=p(this);c(e)})},c=function(e){var l=d(e)+".json?callback=showThumb",i=document.createElement("script");i.type="text/javascript",i.src=l;var o="";$llv_o.videoseo===!0&&(o=' itemprop="name"'),$llv("#"+e).prepend(i).prepend('<div style="height:'+parseInt($llv("#"+e).css("height"))+"px;width:"+parseInt($llv("#"+e).css("width"))+'px;" class="lazy-load-vimeo-div"><span class="titletext vimeo"'+o+"></span></div>"),s(e)},s=function(e){$llv_o.videoseo===!0&&$llv.getJSON(d(e)+"?callback=?",{format:"json"},function(l){$llv("#"+e).append('<meta itemprop="contentLocation" content="'+l[0].url+'" />'),$llv("#"+e).append('<meta itemprop="embedUrl" content="'+a(e)+'" />'),$llv("#"+e).append('<meta itemprop="thumbnail" content="'+l[0].thumbnail_large+'" />'),$llv("#"+e).append('<meta itemprop="datePublished" content="'+l[0].upload_date+'" />'),$llv("#"+e).append('<meta itemprop="duration" content="'+l[0].duration+'" />'),$llv("#"+e).append('<meta itemprop="aggregateRating" content="'+l.data.rating+'" />')})},d=function(e){return"//vimeo.com/api/v2/video/"+e+".json"},p=function(e){var l=$llv(e).attr("id");return l};$llv(document).ready(e()).ajaxStop(function(){e()});var u=function(){$llv_o.displayBranding!==!1&&$llv(classBrandingDot).css({display:"block",visibility:"visible"})};u(),$llv.fn.bindFirst=function(e,l){var i=$llv(this);i.unbind(e,l),i.bind(e,l);var o=$llv._data(i[0]).events,t=o[e];t.unshift(t.pop()),o[e]=t};var m={config:{container:$llv(".container-lazyload"),selector:"object, embed, iframe, .preview-lazyload, .lazy-load-youtube-div, .lazy-load-vimeo-div"},init:function(e){m.config.container.length>0&&($llv(window).on("resize",m.resize),$llv(window).bindFirst("load",function(){m.resize()}))},resize:function(){$llv(m.config.selector,m.config.container).each(function(){var e=$llv(this),l=e.parent().width(),i=Math.round(l*videoratio);e.attr("height",i),e.attr("width",l),e.css({height:i,width:l})})}};"function"==typeof m.init&&$llv_o.responsive===!0&&m.init()});