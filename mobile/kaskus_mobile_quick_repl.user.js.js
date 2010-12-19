// ==UserScript==
// @name           Kaskus Mobile Quick Reply
// @namespace      http://userscripts.org/scripts/show/91051
// @description    Provide Quick Reply on Kaskus Mobile
// @author         idx (http://userscripts.org/users/idx)
// @version        0.3.0
// @dtversion      101219030
// @timestamp      1292768536784
// @include        http://m.kaskus.us/*
// @include        http://opera.kaskus.us/*
// @license        (CC) by-nc-sa 3.0
//
// -!--latestupdate
//
// v0.3.0 - 2010-12-19
//  Fix Login check on subdomain (opera)
//  Deprecate include subdomain (wap, blackberry)
//  Add Logged in as
//  Add Quick-Edit - beta
//   
// -/!latestupdate---
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
// ###@@###
// *dependency            https://addons.mozilla.org/en-US/firefox/addon/59/
// *XML of User Agent     http://techpatterns.com/downloads/firefox/useragentswitcher.xml
//
// Creative Commons Attribution-NonCommercial-ShareAlike 3.0 License
// http://creativecommons.org/licenses/by-nc-sa/3.0/deed.ms
// --------------------------------------------------------
*/
(function () {

var gvar=function(){};

gvar.sversion = 'v' + '0.3.0';
gvar.scriptMeta = {
  timestamp: 1292768536784 // version.timestamp

 ,scriptID: 91051 // script-Id
};
/*
javascript:window.alert(new Date().getTime());
javascript:(function(){var d=new Date(); alert(d.getFullYear().toString().substring(2,4) +((d.getMonth()+1).toString().length==1?'0':'')+(d.getMonth()+1) +(d.getDate().toString().length==1?'0':'')+d.getDate()+'');})()
*/
//========-=-=-=-=--=========
gvar.__DEBUG__ = false; // development debug
//========-=-=-=-=--=========

OPTIONS_BOX = {
  KEY_SAVE_DelayPopupPicsTimeout:  ['500'] // Delay before popu show up
 ,KEY_SAVE_msgheight:             ['90'] // last height of textarea
};

GMSTORAGE_PATH      = 'GM_';
KS 	 = 'KEY_SAVE_';


function init(){
 
  gvar.domainstatic= 'http://'+'static.kaskus.us/';
  gvar.msgID= 'message';  
  gvar.mode = 'qr';

  gvar.mode_qr = {
     'title':'Quick Reply'
    ,'action':'reply'
    ,'submit':'Submit Reply'
    ,'hash':''
  };
  gvar.mode_qe = {
     'title':'Quick Edit'
    ,'action':'editpost'
    ,'submit':'Save Changes'
    ,'hash':''
  };
  
  
  gvar.B = getBtn();
  // gvar initialized - 
  gvar.hidePopupPicTimeout;
  gvar.showPopupPicTimeout;
  gvar.lastEdit_id;

  // preferences scratch
  gvar.prefs = {
     'PopupPosition' : 'auto'
    ,'DelayPopupPics' : '1'
    //,'DelayPopupPicsTimeout' : '500'
    //,'msgheight' : '90'
  };
  // get saved preferences
  getPreferences();
  
  // inject CSS
  GM_addGlobalStyle( getCSS() );
  
  // init load div layer for popup
  GM_addGlobalStyle( loadStyle() );
  loadPopup();
  
  // -- let's roll --
  start_Main();
 
} // end init()

// populate settings value
function getPreferences(){
  /** 
  eg. gvar.prefs.msgheight
  */  
  var hVal,oVal,hdc;
  gvar.prefs = {
    msgheight : getValue(KS+'msgheight')
   ,DelayPopupPicsTimeout : getValue(KS+'DelayPopupPicsTimeout')
  };
  // some validation
  hVal=gvar.prefs.msgheight;
  oVal = Math.round(GetHeight()/2);
  hVal=(isNaN(hVal) || hVal < 90 ? 90 : (hVal > oVal ? oVal : hVal) );
}

function start_Main(){
    
   THREAD.init();
   if(THREAD.user===false) {
     if(location.hash=='#login'){
       var tgtusername = $D('.//input[@name="username"]', null, true);
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
     btn_max: ''
	  +'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAIAAADZF8uwAAAABnRSTlMAAAAAAABupgeRAAAAUklEQVR42mNkYGBwSDjAgBscWODAiF8F'
	  +'BLAgc/bPt0eTdkw8yMDAwMRABGBC0wfRik8RVhvRFcFVoJnHRFAFAwMDNAjwqMDicKy+IyowGYmJFgC0SBv8eaPcgAAAAABJRU5ErkJggg=='
    ,btn_rez_up: ''
	  +'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAALCAIAAAAWQvFQAAAABnRSTlMA4QDhAOKdNtA9AAAANklEQVR42mN8+PARA4mAiYF0gFNPTk42'
	  +'aXogGnBpY8JvA1ZtjLjCICcne8qUqYPTbfSKHzwAAI5GFlujnkmnAAAAAElFTkSuQmCC'
    ,btn_rez_down: ''
	  +'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAALCAIAAAAWQvFQAAAABnRSTlMA4QDhAOKdNtA9AAAAOklEQVR42mN8+PARA4mAiYF0QI4eFkyh'
	  +'nJxsZO6UKVMJ24OsCFMDTrdBlGLVwMDAwIgZboPZbTSJHwCr/hvqGdJVXAAAAABJRU5ErkJggg=='
    ,btn_maxmin: ''
	  +'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEQAAAARCAIAAADrMp2hAAAABnRSTlMA/wDyAAASgmejAAAFNUlEQVR42pVXz2sdVRT+zpk781JJmmKxNf4g4qroJsRKBaF2GYWCaG2xduMqgqCCFlKoLlQw0AoiCOYPcFEN4rJ/gMUu2qytaYUiIcY29ld8M+9l5nwu7r3zbpJWzHAZ5p337pn73e8737lPeBe73n6zuLHS7ffW6xobLgEEIAGBEJAQk/BAEATgb+0D42xJchEMARER8XlgAIwG0JIUApCExPnkYEExvcSskJ07dWRn97sfZcfh10f7ZTkyup65jUAkogABYfImVZGAiATDq6xe/O3w0aPv3/xVFRkgAidQUBUqUCEABxNs46oBQI0wCBs0EEBqgkRjqAFkbmrxlt38S4dHnN27M/bMs1dW/96chgLQb6iEDfd7RdAIMTNpt8eDh4DSX7ungAKqNIUCGUwUTiBAI8gevPR0z/1HA0DUBAAzNYgBtcFMvIpqyk+PyKvY0yz94bh27+nx8Ss3V72G2DKKJn2FiGxgndzMOI0gBPXdOxA4QIUGZIBlyECBQaD/ycNWME1YsQJSU8xgQA2Q0gAkagOB7x9yr/V6LlV5Ww7bv2ICcv3ummcyy2hiPq0qagQkvjjO69gCdvvJk1idsuWtkQSP1AYDGqAhjNqYNIAnyg8ROK8lCeshsH0wA2sggKZcyySs2AWbQKNwIGTgDgsju7/4/CP/fOr0WTT1gm6ITP1zrd1howAw87oPqAwwomYATGZbaJftj8BMtIiy33R7VvZQlqhK9kr2S6lKVBXKwZgsl06dPuucc86dmZ1ZyPeemZ3xH0+dPjtZLaGq4iil10XVRb9rvS6rLqsSVWVl1VQ9Vj2reuj2BdS2Brz/8QHX/+QIAM1gJjSQsAbW0BpagzDMj6k7i5Pl0smZ2TzP8zz/6suP/cPJmdnJcmnq9iIaoiEaQ2NsrJ0IMxhhREM27foMELfJ3MNGq/YvXUy/2VSexf4XYBGhphWLLC+CHYMKU4EINOUy/vyV8rqofvDhZ998/amPvPveJ8/1ll8ur6PoDBYVsyugDK2FEDVk0EErLL2qpW1v4tGsX7o49+0cY+PzxEjSt6anp4vJAxscgEFpj794UOFbCjOFAireoEOGVNlDK+u4zaGhoUFk72MP730K0SokVkjoOYyl4pVt2hoAzv/iGJqzN1IKBx1XfNeOENq2KRscLOBrbTArCoUByCKMcN8C5ofl6sJtzp+ba5HMn5s7cmwaWfPG2I524zS+Sdt3MgRpmvqplwhlcJrY5LZsORGkPXLgFZsqKisKLTqu6GjRyfKO5v5exJH7Mb/Sv7Bat0iOHJtu8VxYredXepo755y6PIvDuSLLw3B5J8s7WVFkReGKwuWFN89YuMlZaGj/genpd5K9j7+JFHX2H2gxJK1JAHSGhxFF5e8KXz8efZj1841bKZKDY8NHjk37iOfn+L4xn9MiOb4YvKgywAAyKNDryaUkkBARkiDzyefTlYqIr4kYoIjyfm0p6wxJlFa7WxkgAzwAcOiJ0ZaNQ0+OHt/3qLo/04gb2tF2WE0gNRGJERa1F9paigPRhTk4LAcAhBAUEX9OFkhybEV6bPBgAi1CjUWShRm+G+DExPiJiQ17cWJi/K2JNhBIUJ+bsfkCLpquAGqwRD9ucCZPK1rA0K+ZqEjJCC2yRTIpUQLUvABsIDCJzMhmK5P79qkknEVD81HPCSMhBoDqH1wAI7h87fc9u0ZD02z/TERFMdAgbd2LSHwLB39WwGXi8uLVl64KRaR1BTJId/OyGQ29lTGTg0SijY1nTyHS43pKwr85IPRGJqtm5AAAAABJRU5ErkJggg=='
  };
}
function getTPL(){
   return (''
    +'<div id="back_layer" class="trfade"></div>'
    +'<div id="main_cont">'
     +'<div class="main_head"><span id="modetitle">'+gvar.mode_qr.title+'</span> ' +HtmlUnicodeDecode('&#8212;') +' <a class="link" href="http:/'+'/userscripts.org/scripts/show/'+gvar.scriptMeta.scriptID.toString()+'/" target="_blank">'+ gvar.sversion + '</a>'
      +'<div id="par_qr_close">'
	   +'<a id="qr_min" href="javascript:;" title="Minimize"><span class="mInner">&nbsp;</span></a>'
	   +'<a id="qr_close" href="javascript:;" title="Close"><span class="cInner">&nbsp;</span></a>'
	  +'</div>'
     +'</div>'

     +'<div id="main_content" class="fade">\n'
       +'<form id="frmQR" method="post" action="/'+(gvar.mode=='qr' ? gvar.mode_qr.action : gvar.mode_qe.action)+'/'+THREAD.id+'">'
       +'<div class="spacer"></div>'
       +'<div id="login_as">Logged in as <a href="/user/profile/'+THREAD.user.id+'" target="_blank"><b>'+THREAD.user.name+'</b></a></div>'
       +'<a id="title_add" href="javascript:;">[+] Title</a>:'
	   +'<div id="title_cont" style="display:none;">'
       +  '<div class="spacer"></div><input id="title" name="title" class="field" value="" type="text" /><div class="spacer"></div>'
       +'</div>'
       +'&nbsp;Message:&nbsp;<a id="message_clear" href="javascript:;" title="Clear Message">reset</a>'
       +'<div id="message_container"><textarea id="'+gvar.msgID+'" name="message" class="field"></textarea></div>'
       +'<div id="submit_cont">'
        + '<input name="reply" id="btnsubmit" class="button" value="Submit Reply" type="submit" />'
        + '<div class="resizer" style="float:right; margin-right:5px; width:18px;">'
		+   '<img id="rez_up" alt="+" title="add Height" src="'+gvar.B.btn_rez_up+'" />'
		+   '<img id="rez_down" alt="-" title="reduce Height" src="'+gvar.B.btn_rez_down+'" />'
		+ '</div>'
		+ (gvar.__DEBUG__ ? '<br/><input type="text" style="width:60%;" id="thisAct" value="/'+(gvar.mode=='qr' ? gvar.mode_qr.action : gvar.mode_qe.action)+'/'+THREAD.id+'" />':'')
        + '<input '+(gvar.__DEBUG__ ? 'type="text" style="width:60%;"':'type="hidden"')+' name="threadid" value="'+THREAD.id+'" />'
        + '<input '+(gvar.__DEBUG__ ? 'type="text" style="width:60%;"':'type="hidden"')+' name="hash" id="hash" value="'+(gvar.mode=='qr' ? gvar.mode_qr.hash : gvar.mode_qe.hash)+'" />'
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
   if( !(t.tagName=='A' || t.tagName=='IMG') ) { return; }
   
   var oldSrc, newSrc, profileLink;
   if (t.tagName == 'A') { oldSrc = t.href + '#1'; }
   if (t.tagName == 'IMG') { oldSrc = t.parentNode.href + '#1'; }
   
   // mouseover on popup it self
   if( oldSrc && oldSrc.indexOf('#1#1')!=-1 ) { return; }
   
   if (oldSrc || newSrc) {
        if (!newSrc) {
           //newSrc = oldSrc.replace(/_thumb\./, ".");
           newSrc = oldSrc.replace(/\#\d/,'');
        }
         // need some condition ? later...        
        window.clearTimeout(gvar.hidePopupPicTimeout);
        Dom.remEv(t, 'mouseout', function(e){hidePopupPic(e)});
        Dom.Ev(t, 'mouseout', function(e){hidePopupPic(e)});
        //if (t.parentNode.href) { profileLink = '#'; }
                  
        gvar.showPopupPicTimeout = window.setTimeout(function(){
          $D('#kf-popup-pic-image').innerHTML = '<a href="' + newSrc + '" target="_blank"><img id="" src="' + newSrc + '" alt="Kaskus QR-Mobile - Loading Pic.." style="max-height:' + (window.innerHeight-35) + 'px;"/></a>';
          $D('#kf-popup-pic-div').style.display = 'block';
          $D('#kf-popup-pic-div').className = 'kpfPopup kf-popup-pic-div-' + (gvar.prefs['PopupPosition'] == 'auto' ? (e.pageX>document.body.clientWidth/2 ? 'left' : 'right') : gvar.prefs['PopupPosition']);
        }, gvar.prefs['DelayPopupPics'] ? gvar.prefs['DelayPopupPicsTimeout'] : 0);
   }
}
function loadPopup(){
  var el = createEl('div', {id:'kf-popup-pic-div', 'class':'kpfPopup kf-popup-pic-div-'}, '<div id="kf-popup-pic-close" title="close">x</div><div id="kf-popup-pic-image"><span></span></div>');
  try{
    Dom.add(el, document.body);
    Dom.Ev($D('#kf-popup-pic-close'), 'click',  function(){ $D('#kf-popup-pic-div').style.display='none'; });
  }catch(x){
    var kpDivAdder = setInterval(function() {
        try {
            Dom.add(el, document.body.lastChild.nextSibling);
            Dom.Ev($D('#kf-popup-pic-close'), 'click',  function(){ $D('#kf-popup-pic-div').style.display='none'; });
            if ($D('#kf-popup-pic-div')) { clearInterval(kpDivAdder); }
        } catch(x2) { clog('CSS', x);  }
    }, 100);
  }
  Dom.Ev($D('#kf-popup-pic-div'), 'mouseover', function(e) { clearTimeout(gvar.hidePopupPicTimeout); } );
  
  Dom.Ev($D('#kf-popup-pic-div'), 'mouseout', function(e) {
  	var r = e.relatedTarget;
	show_alert('e'+e.tagName);
	show_alert('relatedTarget'+r.tagName);
  	if (!e.shiftKey && !e.ctrlKey && !e.altKey) {
  		while (r.parentNode && r.id!='kf-popup-pic-div') { r = r.parentNode; }
  		if (r.id!='kf-popup-pic-div') { $D('#kf-popup-pic-div').style.display = 'none'; }
  	}
  }, false);
}
function hidePopupPic(e) {
    if (gvar.prefs['DelayPopupPics']) { window.clearTimeout(gvar.showPopupPicTimeout); }
    if (!e.shiftKey && !e.ctrlKey && !e.altKey) {
        gvar.hidePopupPicTimeout = window.setTimeout(function() { $D('#kf-popup-pic-div').style.display = 'none'; }, 300);
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
	+'.transp_me{color:transparent;}'	
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
    +'.current_edit {background-color:#FFDFFF;}'

    +'/* ------ */'

	+'.paging a:hover{background:#ff9933;color:#FFF;}'
	+'.paging a, .paging strong{background:#0569cd; padding:2px 2px;color:#FFF; }'
	+'.paging strong{background:#ff9933;padding:2px 3px; }'
    +'/* ------ */'
    +'#qr_container, #qrfixed_thumb {position:fixed;bottom:0;width:100%;}'
    +'#qrfixed_thumb { z-index:99990; left:43%; }'    
	
    +'.trfade {position:fixed; width:100%; height:100%; left:0; background:#000; z-index:99990; filter:alpha(opacity=25); opacity:.25; }'
    +'#main_cont{float:right; width:50%;  padding:0;margin:5px 15px 0 0;}'
	
    +'.main_head {background-color:#588DC2; padding:4px 0 0 10px; height:20px; border:1px solid #0054A8;border-bottom:0; -moz-border-radius:5px 5px 0 0;}'
    +'.main_head, .main_head a.link {font-weight:bold; color:#fff; font-size:12px;}'
    +'.main_head a.link {text-decoration:underline;}'
    +'.main_head a.link:hover {color:#000;}'
	
    +'.fixed_thumb {width:130px; cursor:pointer; text-align:center; padding-right:10px !important;}'
	
    +'#par_qr_close {text-align:right;float:right; z-index:99990;margin:5px 10px 0 0; width:88px;}'
		
    +'#qr_max {background:url("'+gvar.B.btn_max+'") no-repeat scroll 1px 1px transparent; padding-left:20px; color:#3A3A3A;}'
    +'#qrfixed_thumb:hover a, #qr_max:hover, .fade a:hover { color:#000; }'
	+'#stat_qrcontent { font-weight:bold; }'	
	
    +'#qr_min, #qr_close {background:url("'+gvar.B.btn_maxmin+'") repeat-x scroll; text-decoration:none; }'
    +'#qr_min span, #qr_close span { display: inline-block; position: relative; }'	
    +'#qr_min  {background-position:0 0; }'
    +'#qr_close  {background-position:-25px 0; }'
    +'span.mInner {width:25px; }'
    +'span.cInner {width:43px}'
	
    +'.resizer img {border:1px solid transparent;}'
    +'.resizer img:hover {background-color:#FFFFA4; border:1px solid #FBC779;}'
	
	
    +'.fade, .main_head { position:relative; z-index:99990;  }'
    +'.fade { position:relative; padding:1px 5px; color:#000; background:#CCE4FD; z-index:99990; filter:alpha(opacity=87); opacity:.87; border:1px solid #0054A8; border-top:0; }'
    +'.fade a{color:#753A00;}'    
    +'.fade input[type="text"], .fade textarea {width:99%;}'
    +'.fade textarea {height:'+gvar.prefs.msgheight+'px; }'
    +'.field {border:1px dashed #FCDAA7;margin-top:3px;}'
    +'.field{verdana,arial,helvetica,sans-serif;font-size:12px;}'
    +'.field:focus {background-color:#FFFFA4;border:1px solid #FBC779;}'
    
    +'#login_as {float:right;margin-right:5px;}'
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
function GetHeight(){
  var y = 0;
  if (self.innerHeight){ // FF; Opera; Chrome
     y = self.innerHeight;
  } else if (document.documentElement && document.documentElement.clientHeight){ 
     y = document.documentElement.clientHeight;
  } else if (document.body){
     y = document.body.clientHeight;
  }
  return y;
};
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
function getValue(key) {
  var data=OPTIONS_BOX[key];
  return (!data ? '': GM_getValue(key,data[0]));
}
function setValue(key, value) {
  var data=OPTIONS_BOX[key];
  return (!data ? '': GM_setValue(key,value));
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
function HtmlUnicodeDecode(a){
 var b="";if(a==null){return(b)}
 var l=a.length;
 for(var i=0;i<l;i++){
  var c=a.charAt(i);
  if(c=='&'){
    var d=a.indexOf(';',i+1);
    if(d>0){
      var e=a.substring(i+1,d);
      if(e.length>1&&e.charAt(0)=='#'){
        e=e.substring(1);
        if(e.charAt(0).toLowerCase()=='x'){c=String.fromCharCode(parseInt('0'+e))}else{c=String.fromCharCode(parseInt(e))}
      }else{
        switch(e){case"nbsp":c=String.fromCharCode(160)}
      }i=d;
    }
  }b+=c;
 }return b;
};

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
$D=function (q, root, single) {
   if (root && typeof root == 'string') {
       root = $D(root, null, true);
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
       return function(el, type, fn, phase) {
	     phase=(phase ? phase : false);
         if(typeof(el)=='object')
          this.g(el).addEventListener(type, function(e){fn(e);}, phase);
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
      return function(el, type, fn, phase) {
	    phase=(phase ? phase : false);
        if(typeof(el)=='object')
         this.g(el).removeEventListener(type, function(e){fn(e);}, phase);
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
     ,title: function(x){
		Dom.g('title_cont').style.display='';
        Dom.g('title_add').innerHTML = '[-] Title';
	    Dom.g('title').value=x;
	 }
     ,clear: function(){
	   Dom.g(gvar.msgID).value=Dom.g('title').value='';
	   Dom.g('title_cont').style.display='none';
	   Dom.g('title_add').innerHTML = '[+] Title';
	 }
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
	    if(Dom.g('hash').value==''){
		   THREAD.doQuote(THREAD.reply);
		}else{
	      showhide(Dom.g('qr_container'), true);
	      showhide(Dom.g('qrfixed_thumb'), false);
		  QR.msg.focus(); 
		}
		Dom.g('footer_spacer').setAttribute('style', 'height:'+THREAD.get_footerHeight()+'px');
	  });
	  // event resizer
      Dom.Ev(Dom.g('rez_up'), 'click', function(){
	    var h = parseInt(Dom.g(gvar.msgID).clientHeight) + 50;
		var max = Math.round(GetHeight()/2);
		h = ( h < max ? h : max );
		Dom.g(gvar.msgID).style.height = h + 'px';
		var fh=Dom.g('footer_spacer').clientHeight;
		Dom.g('footer_spacer').setAttribute('style', 'height:'+( h < max ? fh+50:fh)+'px');
		setValue( KS+'msgheight', h.toString() );
		Dom.g(gvar.msgID).focus();
	  });
      Dom.Ev(Dom.g('rez_down'), 'click', function(){
	    var h = parseInt(Dom.g(gvar.msgID).clientHeight) - 50;
		h = (h > 90 ? h : 90 );
		Dom.g(gvar.msgID).style.height = h + 'px';
		var fh=Dom.g('footer_spacer').clientHeight;
		Dom.g('footer_spacer').setAttribute('style', 'height:'+( h > 90 ? fh-50 : 200)+'px');
		setValue( KS+'msgheight', h.toString() );
		Dom.g(gvar.msgID).focus();
	  });
	  
	
    }
    ,chk_postID: function(pid, destroy){
	  if(isDefined(destroy) && destroy){
	    if( Dom.g('postid') )
		  Dom.remove('postid');
		return;		  
	  }
	  if(isUndefined(pid)) return false;	  
	  var el = createEl('input', {id:'postid',name:'postid',value:pid,type:'hidden'});	  
	  Dom.add(el, Dom.g('submit_cont'));
	}
    ,check_mode: function(mode){
	  Dom.g('modetitle').innerHTML = (mode=='qe' ? gvar.mode_qe.title : gvar.mode_qr.title);
	  Dom.g('qr_min').style.display = (mode=='qe' ? 'none':'');
	  Dom.g('qr_close').title = (mode=='qe' ? 'Cancel Edit':'Close');
	  Dom.g('btnsubmit').value = (mode=='qe' ? gvar.mode_qe.submit : gvar.mode_qr.submit);
	  if(mode=='qr') {
	    QR.chk_postID(null, true); // destroying..
		Dom.g('frmQR').action = '/' + gvar.mode_qr.action + '/' + THREAD.id;
	  }
	  if(gvar.__DEBUG__) Dom.g('thisAct').value = Dom.g('frmQR').action;
	}	
    ,cancel_edit: function(){
	  Dom.g('hash').value = gvar.mode_qr.hash
	  QR.check_mode('qr');	  
	}
    ,close: function(){
	  if(gvar.mode=='qe') {// closing from Quick Edit
	    THREAD.reset_post_coloring();
		QR.cancel_edit();
	  }
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
	
	// do event on quote & Edit button (only  on logged in)
    THREAD.eventQuote();
    THREAD.add_footter_spacer();
  }
  ,getThreadId: function (){
    var match, hVal = getByXPath_containing('//a[@class="btn_link"]', false, 'REPLY');	
    THREAD.reply = (isDefined(hVal[0]) ? hVal[0] : null);
    if(THREAD.reply)
       match = /(?:\w+)\.kaskus\.us\/reply\/(\d+)/i.exec(THREAD.reply);
    return (match ? match[1] : null);    
  }
  ,getUser: function (){
     var alogins = $D('//a[contains(@href, "#login")]', null);
     if(alogins.snapshotLength > 0) {
	   var tgtusername = $D('.//input[@name="username"]', null, true);
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
	   var node = $D('.//div[@id="menu"]', null, true);
       var html = node.innerHTML;
       var match = /Welcome[\!\s](?:[^\"]+).http\:\/\/(?:\w+)\.kaskus\.us\/user\/profile\/(\d+)\">(.+)<\/a/i.exec(html);
       return (match ? {id:match[1], name:match[2]} : false);
     }
   }
  ,reFormat: function(){
    var posts = $D('.//div[@class="post"]',null);
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
	       pra = $D('.//pre[@class="code"]', posts.snapshotItem(i) );
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
	var link, links = $D('//a[@target="_blank"]',null);
	var PicRegEx = /https?\:\/\/.+\.(?:jpg|jpeg|gif|png|ico)(?:\?.+)*/i;
	var child = false;
	if(links.snapshotLength > 0){
	    for(var i=0; i<links.snapshotLength; i++){
	       link = links.snapshotItem(i);
		   if( PicRegEx.test(link.href) ){
		     child = getTag('img', link);
			 if(child){
			    child = child[0];
			    if( child.src.indexOf(link.href)==-1 ) continue;
			 }else{
			    if( link.href!=link.innerHTML ) {
				  continue;
				}
			 }
		   }else{
		     continue;
		   }
		   if(!child) 
		     link.setAttribute('class','imgthumb');
		   else
		     link = child;
           Dom.Ev(link, 'mouseover', function(e) {
             if (!e.shiftKey && !e.ctrlKey && !e.altKey) { showPopupPic(e); }
           });
	    }
	}
   }
  ,eventQuote: function(){
	 var nodes,child, el;
	 nodes = getByXPath_containing('//a', false, 'edit');
	 for(var i=0; i < nodes.length; i++){	    
	    child = '<img src="'+gvar.domainstatic + 'images/buttons/edit.gif' + '" border="0" alt="edit" />';
		el = createEl('a', {href:nodes[i].href, 'onclick':'return false;', id:'edit_'+i}, child);
		Dom.Ev(el, 'click', function(e){ 
		  THREAD.doEdit(e); 
		  return true;
		});        
		nodes[i].parentNode.insertBefore(el, nodes[i].parentNode.firstChild);		
        Dom.remove(nodes[i]);
	 }
	 nodes = getByXPath_containing('//a', false, 'quote');
     for(var i=0; i < nodes.length; i++){
	    var par = nodes[i].parentNode;		
        child = '<img src="'+gvar.domainstatic + 'images/buttons/quickreply.gif' + '" border="0" alt="quote" />';
        el = createEl('a', {href:nodes[i].href, 'onclick':'return false;', id:'quote_'+i}, child);
        Dom.Ev(el, 'click', function(e){ THREAD.doQuote(e); });
        Dom.add(el, par);		
		addClass('transp_me', par);
        Dom.remove(nodes[i]);
     }
   }
   
  ,isProcessing: function(tgt){
    var yes = Dom.g(tgt);
	if(yes) show_alert('There is still fetch progress..', 0);
	return yes;
  }
  
  ,reset_post_coloring: function(){
    if(!gvar.lastEdit_id) return;
	var par, el = Dom.g(gvar.lastEdit_id);
	if(el){
	  par = el.parentNode.parentNode;
	  removeClass('current_edit', par);
	}
  }
  ,post_coloring: function(e){
     // coloring parent, .post
	 if(!e) return;
	 var el = Dom.g(e);
	 var post = el.parentNode.parentNode;	 
	 if(isDefined(post.className) && post.className == 'post'){
	    addClass('current_edit', post);
	 }
  }
  ,doEdit: function(e){
     if( THREAD.isProcessing('fetching_edit') ) return;
	 // set mode edit
	 gvar.mode = 'qe';	 
	 
	 THREAD.reset_post_coloring();
	 e = e.target || e;
	 if(e.nodeName=='IMG') e=e.parentNode; // make sure get tag <a>
	 if(isDefined(e.id)) gvar.lastEdit_id = e.id;
	 var par = e.parentNode; // get tag <div class="right">
	 e.style.display = 'none';
	 var inner = '<img src="'+gvar.domainstatic+'images/misc/11x11progress.gif" border="0"/>&nbsp;<small>loading...</small>';
     var el = createEl('div', {id:'fetching_edit','class':'smallfont',style:'color:blue;font:11pt;float:left;margin-top:5px;'}, inner);
     Dom.add(el, par);
	 
	 THREAD.post_coloring(gvar.lastEdit_id); 
	 
	 GM_XHR.uri = e.href;
     GM_XHR.cached = true;
     GM_XHR.request(null,'GET',THREAD.doEdit_Callback);	 
	 
  }
  ,doEdit_Callback: function(html){
     var par = Dom.g('fetching_edit').parentNode;
	 var e = getTag('a', par)[0];
	 if(e && e.id!='qr_max') e.style.display='';
     Dom.remove('fetching_edit');
	 var ret = THREAD.do_Parse(html.responseText);
	 showhide(Dom.g('qrfixed_thumb'), false);	 
	 QR.msg.clear();
	 QR.msg.addMsg(ret[0]);
	 QR.msg.title(ret[1]);
	 Dom.g('frmQR').action = '/' + gvar.mode_qe.action + '/' + ret[2];
	 Dom.g('hash').value = gvar.mode_qe.hash = ret[ret.length-1];
	 QR.check_mode(gvar.mode);
	 QR.chk_postID(ret[2]); // create postid el
	 QR.toggle(true);
	 Dom.g('footer_spacer').setAttribute('style', 'height:'+THREAD.get_footerHeight()+'px');
  }
  ,doQuote: function(e){
	 if( THREAD.isProcessing('fetching_quote') ) return;
	 // set mode qr
	 gvar.mode = 'qr';	 
	 
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
     var e = getTag('a', par);
	 e = (e.length > 1 ? e[1] : e[0]);	 
     if(e && e.id!='qr_max') e.style.display='';
     Dom.remove('fetching_quote');
     var ret = THREAD.do_Parse(html.responseText);
	 showhide(Dom.g('qrfixed_thumb'), false);
	 
	 QR.msg.addMsg(ret[0]);
	 Dom.g('hash').value = gvar.mode_qr.hash = ret[ret.length-1];
	 QR.check_mode(gvar.mode);
	 QR.toggle(true);
	 Dom.g('footer_spacer').setAttribute('style', 'height:'+THREAD.get_footerHeight()+'px');
   }
  ,do_Parse: function(page){
     var match, parts, ret;
	 //show_alert(page);	 
	 
     var pos = [ page.indexOf('name="message"'), page.lastIndexOf('</textarea') ];
     parts = page.substring(pos[0], pos[1]);
     pos[0] = parts.indexOf('>');
	 ret = ['','','','']; // msg,title,postid,hash
     ret[0] = parts.substring( (pos[0]+1), parts.length);
	 match = /name=\"title\".+value=\"([^\"]+)\"/i.exec(page);
	 ret[1] = (match ? match[1]:'');
	 match = /name=\"postid\".+value=\"([^\"]+)\"/i.exec(page);
	 ret[2] = (match ? match[1]:'');
	 
	 // last match as the key
	 match = /name=\"hash\".+value=\"([^\"]+)\"/i.exec(page);
	 ret[3] = (match ? match[1]:'');
	 if(match) ret = [ unescapeHtml(ret[0]), ret[1], ret[2], ret[3]  ];
     return ret;
   }
   
  ,get_footerHeight: function(){
    var h, fh=200;
	h = parseInt(Dom.g(gvar.msgID).clientHeight);	
	if(h > 0)
	  fh = parseInt(Dom.g('footer_spacer').clientHeight) + (h - 90);	  
	return fh;
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