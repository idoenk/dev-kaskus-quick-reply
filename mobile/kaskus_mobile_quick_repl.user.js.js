// ==UserScript==
// @name           Kaskus Mobile Quick Reply
// @namespace      http://userscripts.org/scripts/show/91051
// @description    Provide Quick Reply on Kaskus Mobile
// @author         idx (http://userscripts.org/users/idx)
// @version        0.2.0
// @dtversion      101128020
// @include        http://m.kaskus.us/*
// @include        http://wap.kaskus.us/*
// @include        http://opera.kaskus.us/*
// @include        http://blackberry.kaskus.us/*
// @license        (CC) by-nc-sa 3.0
// ==/UserScript==
//
/*
//
// v0.2 - 2010-11-28
//  Fix Hover-Preview
//
// more: 
//
// v0.1.1 - 2010-11-23
// Init
//------
//
// Creative Commons Attribution-NonCommercial-ShareAlike 3.0 License
// http://creativecommons.org/licenses/by-nc-sa/3.0/deed.ms
// --------------------------------------------------------
*/
(function () {

var gvar=function(){};

function init(){
 
  gvar.domainstatic= 'http://'+'static.kaskus.us/';

  gvar.msgID= 'message';  
  gvar.hash= '';
  gvar.B = getBtn();
  
  // gvar initialized - 
  gvar.hidePopupPicTimeout;
  gvar.showPopupPicTimeout;
  gvar.settings = {
      msgheight: '90'     
  };  
  gvar.prefs = {
     'PopupPosition' : 'auto'
    ,'DelayPopupPics' : '1'
    ,'DelayPopupPicsTimeout' : '500'
  };
  
  // inject CSS
  GM_addGlobalStyle( getCSS() );
  // init load div layer for popup
  GM_addGlobalStyle( loadStyle() );
  loadPopup();
  
  // -- let's roll --
  start_Main();
 
} // end init()


function start_Main(){
    
   THREAD.init();
   if(THREAD.user===false) {
     if(location.hash=='#login'){
       var tgtusername = $('.//input[@name="username"]', null, true);
       tgtusername.focus();
     }
     show_alert('User not logged in', 0); 
	 return; // dead end
   }
   
   // di dalem thread ato bukan?
   if( !THREAD.inside() ) return; 

   // initialize QR
   QR.init();
}

// clean-up fetched post
function unescapeHtml(text){
   if(!text) return '';
   var temp = createEl('div',{},text);
   var cleanRet='';
   for(var i in temp.childNodes){
     if(typeof(temp.childNodes[i])!='object' || isUndefined(temp.childNodes[i].nodeValue)) continue;
     cleanRet += temp.childNodes[i].nodeValue;
   }
   temp.removeChild(temp.firstChild);
   return cleanRet;
}
function getBtn(){
  return {
     btn_x: ''
	  +'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAAMCAIAAAA21aCOAAAABnRSTlMAAAAAAABupgeRAAAAWUlEQVR42mNkYGBQcpnJgBfc25POSFA'
	  +'RBDBBqLu70+7uTkOTQxZkQpPAykaoU3adhSwNVwQXR3EfmhlwRej2EvYHVruQjWfCqghTKRMuByGz0f2BBzASGW8AbwkrB9tgY94AAAAASUVORK5CYII='
    ,btn_max: ''
	  +'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAIAAADZF8uwAAAABnRSTlMAAAAAAABupgeRAAAAUklEQVR42mNkYGBwSDjAgBscWODAiF8F'
	  +'BLAgc/bPt0eTdkw8yMDAwMRABGBC0wfRik8RVhvRFcFVoJnHRFAFAwMDNAjwqMDicKy+IyowGYmJFgC0SBv8eaPcgAAAAABJRU5ErkJggg=='
    ,btn_min: ''
	  +'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAIAAADZF8uwAAAABnRSTlMAAAAAAABupgeRAAAATUlEQVR42mNkYGBwSDjAgBscWODAiF8F'
	  +'BDDhktg/337/fHt8iuDSKIqQ9cEZjokHsZuEqQJdEVYV2N2EpgK7ImT3EQgCZEBUYDISEy0AhrEeg3vT870AAAAASUVORK5CYII='
  };
}
function getTPL(){
   return (''
    +'<div id="back_layer" class="trfade"></div>'
    +'<div id="main_cont">'
     +'<div class="main_head">Quick Reply'
      +'<div id="par_qr_close">'
	   +'<a id="qr_min" href="javascript:;" title="Minimize">&nbsp;&nbsp;&nbsp;</a>'
	   +'&nbsp;'
	   +'<a id="qr_close" href="javascript:;" title="Close">&nbsp;&nbsp;&nbsp;</a>'
	  +'</div>'
     +'</div>'
     +'<div id="main_content" class="fade">\n'
       +'<form method="post" action="http://'+'m.kaskus.us/reply/'+THREAD.id+'">'
       +'<div class="spacer"></div>'
       +'<a id="title_add" href="javascript:;">[+] Title</a>:<div id="title_cont" style="display:none;"><div class="spacer"></div>'
       +'<input id="title" name="title" class="field" value="" type="text">'
       +'<div class="spacer"></div></div>'
       +'&nbsp;Message:&nbsp;<a id="message_clear" href="javascript:;" title="Clear Message">reset</a>'
       +'<div id="message_container">'
        +'<textarea id="'+gvar.msgID+'" name="message" class="field"></textarea>'
       +'</div>'
       +'<div id="submit_cont">'
        +'<input name="reply" class="button" value="Submit Reply" type="submit">'
        +'<input name="threadid" value="'+THREAD.id+'" type="hidden">'
        +'<input name="hash" id="hash" value="'+gvar.hash+'" type="hidden">'
       +'</div>'
       +'</form>\n'
     +'</div>' // main_content
    +'</div>' // main_cont    
   );
}
/**
Snippet from FFixer.
FFixer is Copyright (c) 2010, Vaughan Chandler
*/
function showPopupPic(e){
   var t=e.target||e;
   if(t.tagName!='A') { return; }
   
   var oldSrc, newSrc, profileLink;
   if (t.tagName == 'A') { oldSrc = t.href + '#1'; }
   
   // mouseover on popup it self
   if( oldSrc && oldSrc.indexOf('#1#1')!=-1 ) { return; }
   
   if (oldSrc || newSrc) {
        show_alert(oldSrc)
        if (!newSrc) {
           //newSrc = oldSrc.replace(/_thumb\./, ".");
           newSrc = oldSrc;
        }
         // need some condition ? later...        
        window.clearTimeout(gvar.hidePopupPicTimeout);
        Dom.remEv(t, 'mouseout', function(e){hidePopupPic(e)});
        Dom.Ev(t, 'mouseout', function(e){hidePopupPic(e)});
        if (t.parentNode.href) { profileLink = '#'; }
                  
        gvar.showPopupPicTimeout = window.setTimeout(function(){
          $('#kf-popup-pic-image').innerHTML = '<a href="' + profileLink + '"><img id="" src="' + newSrc + '" alt="Kaskus QR-Mobile - Loading Pic" style="max-height:' + (window.innerHeight-35) + 'px;"/></a>';
          $('#kf-popup-pic-div').style.display = 'block';
          $('#kf-popup-pic-div').className = 'kpfPopup kf-popup-pic-div-' + (gvar.prefs['PopupPosition'] == 'auto' ? (e.pageX>document.body.clientWidth/2 ? 'left' : 'right') : gvar.prefs['PopupPosition']);
        }, gvar.prefs['DelayPopupPics'] ? gvar.prefs['DelayPopupPicsTimeout'] : 0);
   }
}
function loadPopup(){
  var el = createEl('div', {id:'kf-popup-pic-div', 'class':'kpfPopup kf-popup-pic-div-'}, '<div id="kf-popup-pic-close" title="close">x</div><div id="kf-popup-pic-image"><span></span></div>');
  try{
    Dom.add(el, document.body);
    Dom.Ev($('#kf-popup-pic-close'), 'click',  function(){ $('#kf-popup-pic-div').style.display='none'; });
  }catch(x){
    var kpDivAdder = setInterval(function() {
        try {
            Dom.add(el, document.body.lastChild.nextSibling);
            Dom.Ev($('#kf-popup-pic-close'), 'click',  function(){ $('#kf-popup-pic-div').style.display='none'; });
            if ($('#kf-popup-pic-div')) { clearInterval(kpDivAdder); }
        } catch(x2) { clog('CSS', x);  }
    }, 100);
  }
}
function hidePopupPic(e) {
    if (gvar.prefs['DelayPopupPics']) { window.clearTimeout(gvar.showPopupPicTimeout); }
    if (!e.shiftKey && !e.ctrlKey && !e.altKey) {
        gvar.hidePopupPicTimeout = window.setTimeout(function() { document.getElementById('kf-popup-pic-div').style.display = 'none'; }, 300);
    }
}
function loadStyle(){  
  return(
     '\n\n'
    +'.kpfPopup { padding:10px; background:#f6f6f6; border:3px double #666666; -moz-border-radius:5px; -webkit-border-radius:5px; -khtml-border-radius:5px; border-radius:5px; }'
    +'.kpfPopupContainer { display:none; top:0; right:0; bottom:0; left:0; }'
    +'#kf-popup-pic-div { display:none; background:white; border:1px solid #333; position:fixed !important; top:3px !important; padding:4px; min-width:130px; z-index:99999 !important; -moz-border-radius:3px; -webkit-border-radius:3px; -khtml-border-radius:3px; border-radius:3px; }'
    +'.kf-popup-pic-div-left { left:3px !important; right:auto !important; -moz-box-shadow:5px 5px 5px rgba(0,0,0,0.6); -webkit-box-shadow:5px 5px 5px rgba(0,0,0,0.6); -khtml-box-shadow:5px 5px 5px rgba(0,0,0,0.6); box-shadow:5px 5px 5px rgba(0,0,0,0.6); }'
    +'.kf-popup-pic-div-right { right:3px !important; left:auto !important; -moz-box-shadow:-5px 5px 5px rgba(0,0,0,0.6); -webkit-box-shadow:-5px 5px 5px rgba(0,0,0,0.6); -khtml-box-shadow:-5px 5px 5px rgba(0,0,0,0.6); box-shadow:-5px 5px 5px rgba(0,0,0,0.6); }'
    +'#kf-popup-pic-div img { max-height: ' + (window.innerHeight-35) + 'px; }'
    +'#kf-popup-pic-close { display:none; position:absolute; top:4px; right:10px; color:#ff9999; cursor:pointer; font-weight:bold; font-size:14px; }'
    +'#kf-popup-pic-div:hover #kf-popup-pic-close { display:block; }'
    +'#kf-popup-pic-close:hover { color:#aa6666; }'
    +'#kf-popup-pic-image { text-align:center; }'
    +'#kf-popup-pic-image img { color:#999999; display:block; }'
  );
}  // end loadStyle

function getCSS(additional){
    return (''
	+'.header1, .tracking {font-size:9pt;font-weight:bold !important;}'
	+'.tracking a{font-size:8pt !important; color:#DBD7DF !important;font-weight:normal !important;}'
	+'.tracking a:hover{color:#000 !important;}'
    +'.poster{margin-bottom:2px;}'
    +'.post, #forum, #profile, #postreply {background-color:#F5F5FF; padding:1px;}'
    +'.post{border:1px solid #D1D1E1; border-left:0; border-right:0; }'
    +'#forum, #profile, #postreply {border:1px solid #0000C6; }'
    +'.post strong {margin-top:-7px;}'
    +'.post hr {margin-top:2px;border:0; border-top:1px solid #D1D1E1;}'
    +'.left, .right{color:#fff;margin:1px 0 !important;}'
	+'.poster .right{margin:0 !important;}'
	+'.right{margin-right:5px !important;}'
	+'#fetching_quote{display:inline; padding:0; margin-left:3px; line-height:22px;}'
    +'.left a{font-weight:bold;color:#FFB56A;}'
    
    +'.post blockquote, .post .code {border-style: solid !important; border-width:2px 1px 1px 3px !important; '
      +'border-color: #CCFFBB #99DD99 #99DD99 #CCFFBB !important; max-width:none !important; overflow-x:auto !important; '
      +'background: #DDFFDD !important; color:#0099cc; font-size:8pt;'//#3E3E3E //0099cc
      +'padding:3px 10px !important; margin: 7px 1px 0 1px !important;'
    +'}'
    +'.post .code {color:#191919 !important;}'
    +'.post .posted_by, .post .tcode {color:#000 !important; font-family: verdana, arial;}'
    +'.post .tcode {margin:5px 0 -7px 10px;}'
    +'.post .posted_by {margin:5px 0 1px 0;}'

    +'/* ------ */'

	+'.paging a:hover{background:#ff9933;color:#FFF;}'
	+'.paging a, .paging strong{background:#0569cd; padding:2px 2px;color:#FFF; }'
	+'.paging strong{background:#ff9933;padding:2px 3px; }'
    +'/* ------ */'
    +'#qr_container, #qrfixed_thumb {position:fixed;bottom:0;width:100%;}'
    +'#qrfixed_thumb { z-index:99990; left:43%; }'    
	
    +'.trfade {position:fixed; width:100%; height:100%; left:0; background:#000; z-index:99990; filter:alpha(opacity=25); opacity:.25; }'
    +'#main_cont{float:right; width:50%;  padding:0;margin:5px 15px 0 0;}'
	
    +'.main_head {background-color:#588DC2; padding:4px 0 0 10px; font-weight:bold; color:#fff; font-size:12px; height:20px; border:1px solid #0054A8;border-bottom:0; -moz-border-radius:5px 5px 0 0;}'
    +'.fixed_thumb {width:130px; cursor:pointer; text-align:center; padding-right:10px !important;}'
	
    +'#par_qr_close {float:right; z-index:99990;margin:2px 5px 0 0;position:relative; cursor:pointer !important;}'
		
    +'#qr_max {background:url("'+gvar.B.btn_max+'") no-repeat scroll 1px 1px transparent; padding-left:20px; color:#3A3A3A;}'
    +'#qrfixed_thumb:hover a, #qr_max:hover, .fade a:hover { color:#000; }'
	+'#stat_qrcontent { font-weight:bold; }'	
	
    +'#qr_min, #qr_close {margin-top:2px; padding:0 3px 0 0;text-decoration:none; }'
    +'#qr_min {background:url("'+gvar.B.btn_min+'") repeat scroll 1px 1px transparent; padding:0 2px 0 0;}'
    +'#qr_close {background:url("'+gvar.B.btn_x+'") repeat scroll 1px 1px transparent;}'
	
    +'.fade, .main_head { position:relative; z-index:99990;  }'
    +'.fade { position:relative; padding:1px 5px; color:#000; background:#CCE4FD; z-index:99990; filter:alpha(opacity=87); opacity:.87; border:1px solid #0054A8; border-top:0; }'
    +'.fade a{color:#753A00;}'    
    +'.fade input[type="text"], .fade textarea {width:99%;}'
    +'.fade textarea {height:'+gvar.settings.msgheight+'px; }'
    +'.field {border:1px dashed #FCDAA7;margin-top:3px;}'
    +'.field{verdana,arial,helvetica,sans-serif;font-size:12px;}'
    +'.field:focus {background-color:#FFFFA4;border:1px solid #FBC779;}'
    
    +'#submit_cont {text-align:center;}'
    +'.button {margin:2px 0;}'
    +'.spacer {height:2px;}'
    +'.imgthumb:hover {background-color:#80FF80 !important;}'
	
	+'.imgthumb {line-height:20px;padding:2px;padding-left:28px;background:#DDFFDD url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAUCAIAAAD3FQHqAAAABnRSTlMAAAAAAABupgeRAAAACXBIWXMAAAsTAAALEwEAmpwYAAADHUlEQVR42qWUW28bVRDH/7M+Xu+uL3VcJzGlkYAWmVZKZKkS5fLQJ5CQ+gnyGSueIvFAJSoI9KFKWglQSFpCoMjxJb6u1157d2Z4WKd2kpdWnPNw5vzn6HdmRnMOPfr20dbWFv732NnZMbVarbJWUdWr7qvisvLGVlVjTLVaNQCY+fsnvwz9MVHig6qqqojI+SLJ0HNjSbn9wfvffPUAgEnYx6/bJ/41iyiVUicTsegosKLYYhYWi0ViJpZkS8wLIxYh/JtA5ixjUoWsk0nrZjXYvO2xyN7B6MUf2VkEYWURFmUWFmURXlJENGX5F1mWlXXSldXxl7X19ZX70Djv7Xb7QbPjJZkwK4uKzHEii23KCi6wLAuunS7k4GUKBAMynpMr5ifB2BZRUT0vkLLI4PVeprCRyl2PWZgV0AVLVS1C1kmHYe60c2IbVxCfnjWiqJj3FixVFdFu/dCQtA8fv7f5MOsWAFhKRLQUF5Hn2oD9+0ur1TlURatTNpaXc1VUVZGwJsGwfvR07cN7k8DvnzyrfvoQgBlZl1iadWwQSEtnnRUFCMi5UMz7QxUx8/6T7/xh/+7q2p/AxG+XCi6AcHKJBXiOudiXi6mKKOLjg71W/S8ABjGAGxsfFbIZAFGKLMta1Kt51vu78xtAy12dhDOdRWEYxdHEb/6aya4BePbzY2Pn+mH+hx+fA7i1OiUiIprHEoZhN+zjTeMDzDKL4uksTt6KcDyaOZPAB9QYN2YzabXzRSIiub6Uo6oGQdDszpLCMAuzyNUXagqWa48G7TgY5ovrzdN/Op3WSvkmywoRQXXOGg79eiN6m/+A7DzEOmvVb94oG2LXIyeTbjQbjUZjnuMsigaDwTt8MZT5+kHts3t3p9PpYDDY3f3p6OilAUBEpLGDd2IhDEfhJOz3+91u1806dz65Q6+OX5VL5aHvC0tSQiICgUBLRqJe8D1/sTceTTrdjkmnPr//xf7+vhmPx/G12PPc8/soWS7HQZelXq/X7/XXK5Xqx9VSqbS9vT0/cXB4YKdtFn7LFEVkHAQrxZLjOHEcb2xsAPgPkT44D3rdTkkAAAAASUVORK5CYII=) no-repeat !important; color:#000 !important;}'
	+'.poster, .header1, .tracking {background:#294D8B url(http://'+'www.kaskus.us/newhomeimages/fr_bgjudule.jpg) repeat-x !important; color:#fff !important;}'

   );
}


// static routine
function isDefined(x) { return !(x == null && x !== null); }
function isUndefined(x) { return x == null && x !== null; }
function isString(x) { return (typeof(x)!='object' && typeof(x)!='function'); }
function trimStr(x) { return x.replace(/^\s+|\s+$/g,""); };
function getAbsoluteTop(element) {
  var AbsTop=0;
  while (element) { AbsTop=AbsTop+element.offsetTop; element=element.offsetParent; }
  return(AbsTop);
}
function getTag(name, parent){
   var ret = (typeof(parent)!='object' ? document.getElementsByTagName(name) : parent.getElementsByTagName(name) );
   return (isDefined(ret[0]) ? ret : false);
}
function showhide(obj, show){
   if(isUndefined(obj)) return;
   if(isUndefined(show)) show = (obj.style.display=='none'); // toggle mode
   obj.setAttribute('style','display:'+ (show ? '':'none') );
};
function addClass(cName, Obj){
   if(cName=="") return;
   var neocls = (Obj.className ? Obj.className : '');
   if(neocls.indexOf(cName)!=-1) return;
   neocls+=(neocls!=''?' ':'')+cName;
   Obj.setAttribute('class', neocls);
}
function removeClass(cName, Obj){
   if(cName=="") return;
   var neocls = (Obj.className ? Obj.className : '');
   neocls = trimStr ( neocls.replace(cName,"") ); // replace and trim
   Obj.setAttribute('class', neocls);
}
function getByXPath_containing(xp, par, contain){
   if(!par) par = document;
   if(typeof(contain)!='string') return;
   var rets=[];
   var ev = document.evaluate(xp, par, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
   if(ev.snapshotLength)
      for(var i=0;i<ev.snapshotLength;i++)
        if(ev.snapshotItem(i).innerHTML.indexOf(contain)!=-1)
           rets.push(ev.snapshotItem(i));
   return rets;
}
function createEl(type, attrArray, html){
  var node = document.createElement(type);
  for (var attr in attrArray)
    if (attrArray.hasOwnProperty(attr))
     node.setAttribute(attr, attrArray[attr]);
  if(html) node.innerHTML = html;
    return node;
}
function createTextEl(txt){
   return document.createTextNode(txt);
}
//========= Global Var Init ====
GM_XHR = {
   uri:null,
   returned:null,
   cached:false,
   request: function(cdata,met,callback){
     if(!GM_XHR.uri) return;
     met=(isDefined(met) && met ? met:'GET');
     cdata=(isDefined(cdata) && cdata ? cdata:null);
     if(typeof(callback)!='function') callback=null;
     GM_xmlhttpRequest( {
         method:met,
         url:GM_XHR.uri + (GM_XHR.cached ? '':(GM_XHR.uri.indexOf('?')==-1?'?':'&rnd=') + Math.random().toString().replace('0.','')),
         headers: {'Content-Type': 'application/x-www-form-urlencoded'},
         data:(isString(cdata) ? cdata : ''),
         onload: function(ret) {
           var rets=ret;
           if(callback!=null)
              callback(rets);
           else
              GM_XHR.returned = rets;
         }
     } );
   }
};
$=function (q, root, single) {
   if (root && typeof root == 'string') {
       root = $(root, null, true);
       if (!root) { return null; }
   }
   if( !q ) return false;
   if ( typeof q == 'object') return q;
   root = root || document;
   if (q[0]=='#') { return root.getElementById(q.substr(1)); }
   else if (q[0]=='/' || (q[0]=='.' && q[1]=='/')) {
       if (single) { return document.evaluate(q, root, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue; }
       return document.evaluate(q, root, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
   }
   else if (q[0]=='.') { return root.getElementsByClassName(q.substr(1)); }
   return root.getElementsByTagName(q);
};
Dom= {
   g: function(el) {
    if(!el) return false;
    return ( isString(el) ? document.getElementById(el) : el );
   },
   add: function(el, dest) {
     var el = this.g(el);
     var dest = this.g(dest);
     if(el && dest) dest.appendChild(el);
   },
   remove: function(el) {
     var el = this.g(el);
     if(el && el.parentNode)
       el.parentNode.removeChild(el);
   },
   Ev: function() {     
     if (window.addEventListener) {
       return function(el, type, fn) {
         if(typeof(el)=='object')
          this.g(el).addEventListener(type, function(e){fn(e);}, false);
       };
     }else if (window.attachEvent) {
       return function(el, type, fn) {
         var f = function() { fn.call(this.g(el), window.event); };
         this.g(el).attachEvent('on' + type, f);
       };
     }
   }(),
   remEv: function() {
    if (window.removeEventListener) {
      return function(el, type, fn) {
        if(typeof(el)=='object')
         this.g(el).removeEventListener(type, function(e){fn(e);}, false);
      };      
    }
  }()
};

GM_addGlobalStyle=function(css, id) { // Redefine GM_addGlobalStyle with a better routine
   var sel=createEl('style',{type:'text/css'});
   if(isDefined(id) && isString(id)) sel.setAttribute('id', id);
   sel.appendChild(createTextEl(css));
   var hds = getTag('head');
   if(hds && hds.nodeName=='HEAD')
    window.setTimeout(function() { hds[0].appendChild(sel); }, 100);
   else
    document.body.insertBefore(sel,document.body.firstChild);
   return sel;
}
// ----my ge-debug--------
function show_alert(msg, force) {
   if(arguments.callee.counter) { arguments.callee.counter++; } else { arguments.callee.counter=1; }
   GM_log('('+arguments.callee.counter+') '+msg);
   if(force==0) { return; }
}
// ------

QR = {
     property: function(){}
 
    ,msg: {
      addMsg: function(x){ Dom.g(gvar.msgID).value+= x + (x!='' ? '\r\n'+'\r\n' : ''); }
     ,clear: function(){ Dom.g(gvar.msgID).value=''; }
     ,focus: function(){ Dom.g(gvar.msgID).focus(); }
 	 ,lastfocus: function (){
 		var Obj = Dom.g(gvar.msgID);
         var pos = Obj.value.length; // use the actual content
         if(Obj.setSelectionRange)    {
             QR.msg.focus();
             Obj.setSelectionRange(pos,pos);
         }
         QR.msg.focus();
		 Obj.scrollTop = Obj.value.length;
      }
    }
    ,init: function(){
      var el = createEl('div', {id:'qr_container','class':'qr_cont', style:'display:none;'}, getTPL() );
      Dom.add(el, document.body);
	  var inner = '<div id="thumb_qr" class="main_head fixed_thumb"><a id="qr_max" title="Show Quick Reply" href="javascript:;">Quick Reply</a><span id="stat_qrcontent"></span></div>';
      var el = createEl('div', {id:'qrfixed_thumb', style:'display:;'}, inner );
      Dom.add(el, document.body);
      QR.event_tpl();
    }

    ,event_tpl: function(){
      // event title_add
      Dom.Ev(Dom.g('title_add'), 'click', function(e){
        e=e.target||e;
        var dsp=Dom.g('title_cont').style.display;
        var tgt_focus = (dsp=='none' ? Dom.g('title'):Dom.g(gvar.msgID));
        var inner = '['+(dsp=='none' ? '-':'+')+'] Title';
        if(dsp=='') Dom.g('title').value='';
        Dom.g('title_cont').style.display=(dsp=='none' ? '':'none');
        e.innerHTML = inner;
        tgt_focus.focus();
      });
 	 // event qr_close
      Dom.Ev(Dom.g('qr_close'), 'click', function(){		
	    QR.close();
	  });
 	 // event qr_min
      Dom.Ev(Dom.g('qr_min'), 'click', function(){
	    Dom.g('footer_spacer').setAttribute('style', 'height:15px');
		var curval = Dom.g(gvar.msgID).value || Dom.g(gvar.msgID).innerHTML;
		Dom.g('stat_qrcontent').innerHTML=( curval!='' ? '...':'' );
	    showhide(Dom.g('qrfixed_thumb'), true);
	    showhide(Dom.g('qr_container'), false);
	  });
	  
 	 // event message_clear
      Dom.Ev(Dom.g('message_clear'), 'click', function(){ QR.msg.clear(); QR.msg.focus(); });
	 //--
	 // event qrfixed_thumb | qr_max
      Dom.Ev(Dom.g('qrfixed_thumb'), 'click', function(){
	    Dom.g('footer_spacer').setAttribute('style', 'height:150px');
	    if(Dom.g('hash').value==''){
		   THREAD.doQuote(THREAD.reply);
		}else{
	      showhide(Dom.g('qr_container'), true);
	      showhide(Dom.g('qrfixed_thumb'), false);
		  QR.msg.focus(); 
		}
	  });
    }
    ,close: function(){
	  Dom.g('footer_spacer').setAttribute('style', 'height:15px');
	  Dom.g('stat_qrcontent').innerHTML='';
	  showhide(Dom.g('qrfixed_thumb'), true);
	  QR.msg.clear();
	  QR.toggle(false);
	}
    ,toggle: function(flag){
      showhide(Dom.g('qr_container'), flag);
 	  if(Dom.g('qr_container').style.display!='none')
 	    try{ QR.msg.lastfocus(); } catch(e){};
    }
};
 
THREAD = {
   user:function(){}
  ,init: function (){
    THREAD.user = THREAD.getUser();
	THREAD.id = THREAD.getThreadId();
	// reFormat post
    THREAD.reFormat();
	
	if(THREAD.user===false) return;
	
	// do event on quote button (onlly  on logged in)
    THREAD.eventQuote();
    THREAD.add_footter_spacer();
  }
  ,getThreadId: function (){
    var match, hVal = getByXPath_containing('//a[@class="btn_link"]', false, 'REPLY');	
    THREAD.reply = (isDefined(hVal[0]) ? hVal[0] : null);
    if(THREAD.reply)
       match = /m\.kaskus\.us\/reply\/(\d+)/i.exec(THREAD.reply);
    return (match ? match[1] : null);    
  }
  ,getUser: function (){
     var alogins = $('//a[contains(@href, "#login")]', null);
     if(alogins.snapshotLength > 0) {
	   var tgtusername = $('.//input[@name="username"]', null, true);
	   var ogi = getAbsoluteTop( Dom.g('login') );
	   for(var i=0;i<alogins.snapshotLength; i++){
			var el = alogins.snapshotItem(i);
			el.setAttribute('onclick','return false');
			Dom.Ev(el, 'click', function(){
			  scrollTo(0,ogi);
			  tgtusername.focus();
			});
	   }
	   return false;
     }else{
	   var node = $('.//div[@id="menu"]', null, true);
       var html = node.innerHTML;
       var match = /Welcome[\!\s](?:[^\"]+).http\:\/\/m\.kaskus\.us\/user\/profile\/(\d+)\">(.+)<\/a/i.exec(html);
       return (match ? {id:match[1], name:match[2]} : false);
     }
   }
  ,reFormat: function(){
    var posts = $('.//div[@class="post"]',null);
	var html, prahtml, pos, idHead, match, pra;
	for(var i=0; i<posts.snapshotLength; i++){
	    html = posts.snapshotItem(i).innerHTML;
	    // spoiler parser
	    idHead = '<font color="#0099cc">';
	    if(html.indexOf(idHead)!=-1){
	      html = html.replace(/\"<\/font><br>/gim, function(str, $1) { return('<\/blockquote>'); });
	      html = html.replace(/(?:<br>\n)*<font\scolor=\"\#0099cc\">([^\"]+)*\"(.+)/gi, function(str, $1, $2) { 
	        return('<blockquote>'+($1 ? '<div class="posted_by">&#187;&nbsp;Posted by <b>'+$1+'<\/b></div>' :'') + ($2?$2.replace(/<br>/,''):'') ); 
	      });
	    }
	    // implement
	    if(posts.snapshotItem(i).innerHTML != html)
	       posts.snapshotItem(i).innerHTML = html;
	       
	    // code parser
	    var parsecode = true;
	    if(parsecode){
	       html = html.replace(/\n/gm,'');
	       html = html.replace(/\[code\](?:<br>)*/gim, function(str) { return('<div class="tcode">Code:</div><pre class="code">'); });
	       html = html.replace(/(?:<br>|\n)*\[\/code\]/gim, function(str) { return('</pre>'); });		
	       posts.snapshotItem(i).innerHTML = html;
	       pra = $('.//pre[@class="code"]', posts.snapshotItem(i) );
	       if(pra.snapshotLength > 0)
	        for(var j=0; j<pra.snapshotLength; j++){
	            prahtml = pra.snapshotItem(j).innerHTML;
	    	    prahtml = prahtml.replace(/\n/gm, '');
	            if(pra.snapshotItem(j).innerHTML != prahtml)
	    	       pra.snapshotItem(j).innerHTML = prahtml;
	        }
	    }
	
	} // end for postbit
	 
	// event hover the ink to image
	var link, links = $('//a[@target="_blank"]',null);
	if(links.snapshotLength > 0){
	    for(var i=0; i<links.snapshotLength; i++){
	       link = links.snapshotItem(i);		   
		   if( !link.href || (link.href && link.href!=link.innerHTML) ) continue;
		   link.setAttribute('class','imgthumb');
		   //link.innerHTML='<div class="imgthumb"></div> '+link.innerHTML;
		   
           Dom.Ev(link, 'mouseover', function(e) {
             if (!e.shiftKey && !e.ctrlKey && !e.altKey) { showPopupPic(e); }
           });
	    }
	}
   }
  ,eventQuote: function(){
     var quotes = getByXPath_containing('//a', false, 'quote');
     var qid = '';
     for(var i=0; i < quotes.length; i++){
        var child = '<img src="'+gvar.domainstatic + 'images/buttons/quickreply.gif' + '" border="0" alt="quote" />';
        var el = createEl('a', {href:quotes[i].href, 'onclick':'return false;', id:'quote_'+i}, child);
        Dom.Ev(el, 'click', function(e){ THREAD.doQuote(e); });
        Dom.add(el, quotes[i].parentNode);
        Dom.remove(quotes[i]);
     }
   }
  ,doQuote: function(e){
     if(Dom.g('fetching_quote')) {
        show_alert('There is still fetch progress..', 0);
        return;
     }
     e = e.target || e;
     if(e.nodeName=='IMG') e=e.parentNode; // make sure get tag <a>
     var par = e.parentNode; // get tag <div class="right">
	 if( !par.className ) 
	  par = Dom.g('thumb_qr');
	 else
	  e.style.display = 'none';

     var inner = '<img src="'+gvar.domainstatic+'images/misc/11x11progress.gif" border="0"/>&nbsp;<small>loading...</small>';
     var el = createEl('div', {id:'fetching_quote','class':'smallfont',style:'color:blue;font:11pt;'}, inner);
     Dom.add(el, par);
     

     GM_XHR.uri = e.href;
     GM_XHR.cached = true;
     GM_XHR.request(null,'GET',THREAD.doQuote_Callback);
   }
  ,doQuote_Callback: function(html){

     var par = Dom.g('fetching_quote').parentNode;
     var e = getTag('a', par)[0];
     if(e && e.id!='qr_max') e.style.display='';
     Dom.remove('fetching_quote');	 
     var ret = THREAD.doQuote_Parser(html.responseText);
	 Dom.g('hash').value = gvar.hash = ret[1];
	 Dom.g('footer_spacer').setAttribute('style', 'height:150px');
	 showhide(Dom.g('qrfixed_thumb'), false);
	 QR.msg.addMsg(ret[0]);
	 QR.toggle(true);
   }
  ,doQuote_Parser: function(page){
     var match, parts, ret;
     var pos = [ page.indexOf('name="message"'), page.lastIndexOf('</textarea') ];
     parts = page.substring(pos[0], pos[1]);
     pos[0] = parts.indexOf('>');
	 ret = ['',''];
     ret[0] = parts.substring( (pos[0]+1), parts.length);
	 match = /name=\"hash\".+value=\"([^\"]+)\"/i.exec(page);
	 ret[1] = (match ? match[1]:'');
     return (match ? [ unescapeHtml(ret[0]), ret[1] ]  : [null,null] );
   }
  ,inside: function(){
    return ( /\/thread\/.*/.test(location.pathname) );
  }
  ,add_footter_spacer: function(flag){
     flag = (isUndefined(flag) ? true : flag);
     if(flag){
       if(Dom.g('footer_spacer')) return;
       var el=createEl('div', {id:'footer_spacer','style':'height:15px;'});
       Dom.add(el, document.body);
     }else{
       Dom.remove('footer_spacer');
     }
   }
};

// ------
Dom.Ev(window, 'load', function(){ init() } );
// ------
 
})();
/* Mod By Idx. */ 