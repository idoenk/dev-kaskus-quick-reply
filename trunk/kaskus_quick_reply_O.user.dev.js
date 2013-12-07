// ==UserScript==
// @name           Kaskus Quick Reply New (O)
// @icon           http://code.google.com/p/dev-kaskus-quick-reply/logo?cct=110309324
// @namespace      http://userscripts.org/scripts/show/KaskusQuickReplyNew
// @include        *kaskus.co.id/thread/*
// @include        *kaskus.co.id/lastpost/*
// @include        *kaskus.co.id/post/*
// @include        *kaskus.co.id/group/discussion/*
// @include        *kaskus.co.id/show_post/*
// @license        (CC) by-nc-sa 3.0
// @exclude        *kaskus.co.id/post_reply/*
// @version        4.1.0.7
// @dtversion      1312074107
// @timestamp      1386433463086
// @description    provide a quick reply feature, under circumstances capcay required.
// @author         idx(302101; http://userscripts.org/users/idx); bimatampan(founder);
// @contributor    s4nji, riza_kasela, p1nky, b3g0, fazar, bagosbanget, eric., bedjho, Piluze, intruder.master, Rh354, gr0, hermawan64, slifer2006, gzt, Duljondul, reongkacun, otnaibef, ketang8keting, farin, drupalorg, .Shana, t0g3, & all-kaskuser@t=3170414
// @include        http://imageshack.us/*
// @include        http://*.imageshack.us/*
// @include        http://imgur.com/*
// @include        http://imagevenue.com/*
// @include        http://www.imgzzz.com/*
// @include        http://www.imagetoo.com/*
// @include        http://uploadimage.co.uk/*
// @include        http://*.uploadimage.co.uk/*
// @include        http://uploadimage.in/*
// @include        http://*.uploadimage.in/*
// @include        http://cubeupload.com/*
//
// -!--latestupdate
//
// v4.1.0.7 - 2013-12-07 . 1386433463086
//  Forked version from 4.1.0.7 (adapting Opera)
//
// -/!latestupdate---
// ==/UserScript==
//
// v4.1.0.6 - 2013-11-04 . 1383574109058
//  Forked version from 4.1.0.6 (adapting Opera)
//
// v4.1.0.5 - 2012-04-14 . 1365873189493
//  Forked version from 4.1.0.5 (adapting Opera)
//
//
//
// v0.1 - 2010-06-29
//   Init
// --
// Creative Commons Attribution-NonCommercial-ShareAlike 3.0 License
// http://creativecommons.org/licenses/by-nc-sa/3.0/deed.ms
// --------------------------------------------------------
(function () {

function main(mothership){
// Initialize Global Variables
var gvar=function(){}, isQR_PLUS = 0; // purpose for QR+ pack, disable stated as = 0;

// gvar.scriptMeta.scriptID
gvar.sversion = 'v' + '4.1.0.6';
gvar.scriptMeta = {
  timestamp: 1383574109058 // version.timestamp
  //timestamp: 999 // version.timestamp for test update
  
  ,dtversion: 1311044106 // version.date
  
  ,titlename: 'Quick Reply' + ( isQR_PLUS !== 0 ? '+' : '' )
  ,scriptID: 80409 // script-Id
  ,cssREV: 1212194103 // css revision date; only change this when you change your external css
}; gvar.scriptMeta.fullname = 'Kaskus ' + gvar.scriptMeta.titlename;
/*
window.alert(new Date().getTime());
*/
//=-=-=-=--=
//========-=-=-=-=--=========
gvar.__DEBUG__ = 0; // development debug
gvar.$w = window;
//========-=-=-=-=--=========
//=-=-=-=--=

// predefined registered key_save
var OPTIONS_BOX = {
  KEY_SAVE_SAVED_AVATAR:  ['']
 ,KEY_SAVE_LAST_UPLOADER: [''] // last used host-uploader
 
 ,KEY_SAVE_HIDE_AVATAR:      ['1'] // hide avatar
 ,KEY_SAVE_MIN_ANIMATE:      ['0'] // minify jQuery animate
 ,KEY_SAVE_QR_DRAFT:         ['1'] // activate qr-draft
 ,KEY_SAVE_CUSTOM_SMILEY:    [''] // custom smiley, value might be very large; limit is still unknown 
 ,KEY_SAVE_QR_HOTKEY_KEY:    ['1,0,0'] // QR hotkey, Ctrl,Shift,Alt
 ,KEY_SAVE_QR_HOTKEY_CHAR:   ['Q'] // QR hotkey, [A-Z]

 ,KEY_SAVE_TXTCOUNTER:       ['1'] // text counter flag
 
 ,KEY_SAVE_SHOW_SMILE:       ['0,kecil']   // [flag,type] of autoshow_smiley
 ,KEY_SAVE_LAYOUT_CONFIG:    [''] // flag of template_on
 ,KEY_SAVE_LAYOUT_TPL:       [''] // template layout, must contain: "{message}". eg. [B]{message}[/B]
 
 ,KEY_SAVE_SCUSTOM_NOPARSE:  ['0'] // dont parse custom smiley tag. eg. tag=babegenit. BBCODE=[[babegenit]
 
 ,KEY_SAVE_WIDE_THREAD:  ['1'] // initial state of thread, widefix -s4nji
 ,KEY_SAVE_TMP_TEXT:     [''] // temporary text before destroy maincontainer 
 ,KEY_SAVE_QR_LastUpdate:['0'] // lastupdate timestamp
 ,KEY_SAVE_QR_LASTPOST:  ['0'] // lastpost timestamp
 
 ,KEY_SAVE_UPLOAD_LOG:  [''] // history upload (kaskus)
 ,KEY_SAVE_FORUMS_BULK:  [''] // bulk of all-forums
 ,KEY_SAVE_EXC_PLACES:  [''] // excluced places for autolayout
 ,KEY_SAVE_INC_PLACES:  [''] // excluced places for autolayout
 ,KEY_SAVE_ALL_PLACES:  [''] // flag for all places for autolayout
}, KS       = 'KEY_SAVE_'
, GMSTORAGE_PATH  = 'GM_'
;

var GM_addGlobalScript = function (a, b, c) {
  var d = createEl("script", { type: "text/javascript"});
  if (isDefined(b) && isString(b)) d.setAttribute("id", b);
  if (a.match(/^https?:\/\/.+/)) d.setAttribute("src", a);
  else d.appendChild(createTextEl(a));
  if (isDefined(c) && c) {
    document.body.insertBefore(d, document.body.firstChild)
  } else {
    var e = document.getElementsByTagName("head");
    if (isDefined(e[0]) && e[0].nodeName == "HEAD") gvar.$w.setTimeout(function () {
      e[0].appendChild(d)
    }, 100);
    else document.body.insertBefore(d, document.body.firstChild)
  }
  return d
};
var GM_addGlobalStyle = function (a, b, c) {
  var d, e;
  if (a.match(/^https?:\/\/.+/)) {
    d = createEl("link", { type: "text/css", rel:'stylesheet', href:a });
  }else{
    d = createEl("style", { type: "text/css" });
    d.appendChild(createTextEl(a));
  }
  if (isDefined(b) && isString(b)) d.setAttribute("id", b);
  if (isDefined(c) && c) {
    document.body.insertBefore(d, document.body.firstChild)
  } else {
    e = document.getElementsByTagName("head");
    if (isDefined(e[0]) && e[0].nodeName == "HEAD") gvar.$w.setTimeout(function () {
      e[0].appendChild(d)
    }, 100);
    else document.body.insertBefore(d, document.body.firstChild)
  }
  return d
};

// Native Get Elements
var $D=function (q, root, single) {
  if (root && typeof root == 'string') {
    root = $D(root, null, true);
    if (!root) { return null; }
  }
  if( !q )
    return false;
  if ( typeof q == 'object')
    return q;
  root = root || document;
  if (q[0]=='/' || (q[0]=='.' && q[1]=='/')) {
    if (single) {
      return document.evaluate(q, root, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    }
    return document.evaluate(q, root, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
  } else if (q[0]=='.') {
    return root.getElementsByClassName(q.substr(1));
  } else {
    return root.getElementById( q[0]=='#' ? q.substr(1) : q.substr(0) );
  }
};
// native add - remove element
var Dom = {
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
      return function(el, type, fn, ph) {
        if(typeof(el)=='object')
        this.g(el).addEventListener(type, function(e){fn(e);}, (isUndefined(ph) ? false : ph));
      };      
    }else if (window.attachEvent) {
      return function(el, type, fn) {
        var f = function() { fn.call(this.g(el), window.event); };
        this.g(el).attachEvent('on' + type, f);
      };
    }
  }()
};


//=== reSRC
var rSRC = {
  mCls: ['markItUpButton','markItUpDropMenu','<li class="markItUpSeparator">---------------</li>'],
  menuFont: function(id){
    var li_cls = rSRC.mCls, item = ['Arial','Arial Black','Arial Narrow','Book Antiqua','Century Gothic','Comic Sans MS','Courier New','Georgia','Impact','Lucida Console','Times New Roman','Trebucher','Verdana'], buff, lf=item.length;
    buff='<li class="'+li_cls[0]+' '+li_cls[0] + id + ' fonts '+li_cls[1]+'"><a title="Fonts" href="">Fonts</a><ul>';
    for(var i=0; i<lf; i++)
      buff+='<li class="'+li_cls[0]+' '+li_cls[0] + id +'-'+(i+1)+' font-'+item[i].toLowerCase()+'"><a title="'+item[i]+'" class="ev_font" href="">'+item[i]+'</a></li>';
    buff+='</ul></li>';
    return buff;
  },
  menuSize: function(id){
    var li_cls = rSRC.mCls, buff;
    buff='<li class="'+li_cls[0]+' '+li_cls[0] + id + ' size '+li_cls[1]+'"><a title="Size" href="">Size</a><ul>';
    for(var i=1; i<=7; i++)
      buff+='<li class="'+li_cls[0]+' '+li_cls[0] + id + '-1 size-'+i+'"><a title="'+i+'" class="ev_size" href="">'+i+'</a></li>';
    buff+='</ul></li>';
    return buff;
  },
  menuColor: function(id){
    var li_cls = rSRC.mCls, buff, capt, kolors = rSRC.getSetOf('color');
    buff='<li class="'+li_cls[0] + ' ' + li_cls[0] + id + ' ' + li_cls[1]+'"><a title="Colors" href="">Colors</a>';
    buff+='<ul class="markItUpButton'+id+'-wrapper">';
    for(hex in kolors){
      capt = kolors[hex];
      buff+='<li class="'+li_cls[0] +'"><a title="'+capt+'" class="ev_color"  style="width:0; background-color:'+hex+'" href="">'+capt+'</a></li>';
    }
    buff+='</ul></li>';
    return buff;
  },
  menuBIU: function(start){
    var li_cls = rSRC.mCls, item = ['Bold','Italic','Underline'], buff='', lf=item.length;
    for(var i=0; i<lf; i++)
      buff+='<li class="'+li_cls[0]+' '+li_cls[0] +(i+start)+'"><a title="'+item[i]+'" class="ev_biu" href="">'+item[i]+'</a></li>';
    return buff;
  },
  menuAlign: function(start){
    var li_cls = rSRC.mCls, item = ['Align Left','Align Center','Align Right'], buff='', lf=item.length;
    for(var i=0; i<lf; i++)
      buff+='<li class="'+li_cls[0]+' '+li_cls[0] +(start+i)+'"><a title="'+item[i]+'" class="ev_align" href="">'+item[i]+'</a></li>';
    return buff;
  },
  menuList: function(ids){
    var li_cls = rSRC.mCls, item = ['Numeric list','Bulleted list'], buff='', lf=item.length;
    for(var i=0; i<lf; i++)
      buff+='<li class="'+li_cls[0]+' '+li_cls[0] +(ids[i])+'"><a title="'+item[i]+'" class="ev_list"  href="">'+item[i]+'</a></li>';
    return buff;
  },
  menuMedia: function(ids){
    var bbcode, li_cls = rSRC.mCls, item = ['Insert Link','Insert Picture','Embedding Youtube'], buff='', lf=item.length;
    bbcode = ['link','picture','youtube'];
    for(var i=0; i<lf; i++)
      buff+='<li class="'+li_cls[0]+' '+li_cls[0] +(ids[i])+'"><a title="'+item[i]+'" class="ev_media" data-bbcode="'+bbcode[i]+'" href="">'+item[i]+'</a></li>';
    return buff;
  },
  menuCode: function(ids){
    var bbcode, li_cls = rSRC.mCls, item = ['CODE','HTML','PHP'], buff='', lf=item.length;
    bbcode = ['code','html','php'];
    for(var i=0; i<lf; i++)
      buff+='<li class="'+li_cls[0]+' '+li_cls[0] +(ids[i])+'"><a title="Wrap ['+item[i]+'] around text" class="ev_codes" data-bbcode="'+bbcode[i]+'" href="">Wrap ['+item[i]+'] around text</a></li>';
    return buff;
  },
  menuQuote: function(ids){
    var bbcode, li_cls = rSRC.mCls, item = ['QUOTE','SPOILER','TRANSPARENT','NOPARSE'], buff='', lf=item.length;
    bbcode = ['quote','spoiler','transparent','noparse'];
    for(var i=0; i<lf; i++)
      buff+='<li class="'+li_cls[0]+' '+li_cls[0] +(ids[i])+'"><a title="Wrap ['+item[i]+'] around text" class="ev_quotes" data-bbcode="'+bbcode[i]+'" href="">Wrap ['+item[i]+'] around text</a></li>';
    return buff;
  },
  menuIcon: function () {
    var c = rSRC.mCls, d = "", e = 0, f = "img/icons/new/", g = rSRC.getSetOf('posticon');
    d = '<ul id="menu_posticon" style="display:none;" class="menu-post-icon" >';
    for (icon in g) {
      d += '<li class="' + c[0] + ' fonts "><a title="" href="javascript:;" data-rel="' + e + '" data-name="'+ (!g[icon] ? '' : g[icon].replace(/\./g,'')) +'">' 
      + (g[icon] ? '<img src="' + gvar.domain + f + g[icon] + '" border=0>' + icon : "No Icon") + "</a></li>";
      e++
    }
    d += "</ul>";
    return d
  },
  
  getTPL: function(){
    var _sp = rSRC.mCls[2], lc=rSRC.mCls[0]
    , iner_head = '<span class="inner_title">'+gvar.inner.reply.title+ '</span> &nbsp;<a class="qrlink" target="_blank" href="'+(isQR_PLUS==0 ? 'http://'+'userscripts.org/scripts/show/'+gvar.scriptMeta.scriptID.toString() : 'https://'+'addons.mozilla.org/en-US/firefox/addon/kaskus-quick-reply/')+'">'+gvar.sversion+'</a>';
        return ''
    +'<div id="' + gvar.qID + '" class="xkqr" style="clear:both">' 
    +'<div class="xkqr-entry-content">'
    +'<div class="xkqr-entry-head'+(gvar.thread_type == 'group' ? ' bar0' : '')+'">'
    + '<div class="qrhead-title lefty">'+iner_head+'</div>'
    + '<div class="righty">'
    +   '<span id="draft_desc" style="">blank</span>' 
    +   '<div id="qrdraft" class="goog-inline-block jfk-button jfk-button-standard jfk-button-disabled" style="position:absolute; z-index:31; top:5px; right:45px; ">Draft</div>'
    +  '<div id="settings-button" title="Settings"></div>'
    +  '<div id="qrtoggle-button" title="Toggle QR" class="goog-inline-block jfk-button jfk-button-standard"> &#9650;</div>'
    + '</div>'
    +'</div>'
    
    + '<div id="formqr">' // === //
    + '<div id="notify_wrap" class="icon-button vcard" style="display:none; position:relative;">'
    +  '<div class="qr-m-panel" style="display:block;">'
    +   '<a id="scancel_edit" class="goog-inline-block jfk-button jfk-button-standard btnlink" style="display:none;">Cancel Edit</a>'
    +   '<span id="quote_btnset" style="display:none;">'
    +    '<a id="squote_post" class="goog-inline-block jfk-button jfk-button-standard btnlink" style="">Fetch Quote</a>&nbsp;&nbsp;'
    +    '<a id="squick_quote" class="goog-inline-block jfk-button jfk-button-standard btnlink g_warn" style="display:">Quick Quote</a>'
    +   '</span>'
    +  '</div>'
    +  '<div class="g_notice" id="notify_msg" style="display: block;"></div>'
    + '</div>' // notify_wrap
    
    + '<form method="post" id="formform" name="postreply" action="#">'
    + '<input type="hidden" value="" name="securitytoken" id="qr-securitytoken"/>' 
    + '<input type="hidden" value="" name="recaptcha_challenge_field" id="qr-recaptcha_challenge_field"/>'
    + '<input type="hidden" value="" name="recaptcha_response_field" id="qr-recaptcha_response_field"/>'
      
    +(gvar.thread_type == 'group' ? ''
    + '<input type="hidden" value="" name="discussionid" id="qr-discussionid" />'
    + '<input type="hidden" value="" name="groupid" id="qr-groupid" />'
    : ''
    )
    + '<input type="hidden" value="Preview Post" name="preview"/>' 
    + '<input type="hidden" value="1" name="parseurl"/>' 
    + '<input type="hidden" value="9999" name="emailupdate"/>' 
    + '<input type="hidden" value="0" name="folderid"/>' 
    + '<input type="hidden" value="0" name="rating"/>' 
    + '<input id="hid_iconid" type="radio" name="iconid" value="0" style="position:absolute!important; z-index:-1; top:40px; width:1px; cursor:none;"/>'
      
      + ''
      + '<fieldset>'
      + '<div class="reply-message">'
      + '<div class="message">'
      + '<div class="markItUp" id="markItUpReply-messsage" style="display:none!important;">'
      + '<div class="markItUpContainer">' 
      
      + '<div class="title-message" style="display:none; position:relative;">' 
      + '<input id="fakefocus_icon" type="text" style="position:absolute!important; color:transparent; background:transparent; left:5px; top:20px; width:1px; border:0px;" value=""/>' 
      
      + '<div class="title-message-sub forum-title condensed">' 
      +  '<div class="controlls">'
      +  '<div class="input-prepend">'
      +  '<span class="add-on">'
      +   '<img id="img_icon" class="modal-dialog-title-imgicon" src="#" style="display:none;"/>' 
      +   '<ul class="ulpick_icon"><li id="pick_icon" class="modal-dialog-title-pickicon markItUpButton markItUpDropMenu" data-original-title="Pick Icon" rel="tooltip"/>' 
      + rSRC.menuIcon() 
      +   '</li></ul>'
      +  '</span>'
      +  '<input id="form-title" type="text" name="title" title="(optional) Message Title" placeholder="'+gvar.def_title+'" />'
      +  '<span id="close_title" class="modal-dialog-title-close" data-original-title="Remove Title Message" style="display:none;" rel="tooltip"/>' 
      +  '</div>'
      +  '</div>'
      + '</div>' // condensed

      + '<div class="title-message-sub ts_fjb-price condensed" style="display:none;">'
      +  '<div class="controlls">'
      +  '<div class="input-prepend">'
      +   '<span class="add-on" data-original-title="Price (Rp)" rel="tooltip"><i class="icon-shopping-cart"></i></span>'
      +   '<input id="form-price" type="text" class="span4" name="harga" placeholder="Harga, eg. 30000" />'
      +  '</div>'
      +  '</div>'
      + '</div>' // condensed

      + '<div class="title-message-sub title-righty">'
      + '<div class="ts_fjb-kondisi condensed" style="display:none;">' 
      + '<select name="kondisi" class="selectbox" data-original-title="Kondisi Barang" rel="tooltip">'
      +  '<option value="1">New</option>'
      +  '<option value="2">Second</option>'
      +  '<option value="3">BNWOT</option>'
      +  '<option value="4">Refurbish</option>'
      + '</select>'
      + '</div>'  // condensed
      + '<div class="ts_fjb-type condensed" style="display:none;">' 
      + '<select name="prefixid" class="selectbox" data-original-title="FJB Thread" rel="tooltip">'
      +  '<option value="0">( no prefix )</option>'
      +  '<option value="SOLD">TERJUAL</option>'
      +  '<option value="WTB">BELI</option>'
      +  '<option value="WTS">JUAL</option>'
      + '</select>'
      + '</div>'  // condensed
      + '</div>'  // righty
      + "</div>" // title-message
      
      + '<div class="markItUpHeader">' 
      + "<ul>"
      + '<li class="' + lc + " " + lc + '96 "><a id="mnu_add_title" title="Add Title Message" href="">Add Title Message</a></li>'     
      + _sp 
      + rSRC.menuBIU(1) 
      + _sp + rSRC.menuAlign(4) 
      + _sp + rSRC.menuList([8,7]) 
      + _sp + rSRC.menuFont(19) + rSRC.menuSize(20) + rSRC.menuColor(95) 
      + _sp + rSRC.menuMedia([11, 14, 22]) 
      + _sp 
      + '<li class="' + lc + " " + lc + '99 "><a class="ev_smiley" title="Smiley List " href="">Smiley List </a></li>'
      + '<li class="' + lc + " " + lc + '98 "><a class="ev_upload" title="Uploader " href="">Uploader </a></li>' 
      + _sp + rSRC.menuCode([16, 50, 51]) 
      + _sp + rSRC.menuQuote([15, 21, 97, 52]) 
      + _sp + '<li class="' + lc + " " + lc + '53 "><a class="ev_misc" title="Strikethrough text" href="" data-bbcode="strike">Strikethrough text</a></li>'
      + "</ul>"
      + '<div id="qr_plugins_container"></div>'
      + "</div>" // markItUpHeader      

      + '<div style="clear:left; position:relative;">'      
      + '<div class="qr-editor-wrap">'
      +    '<span id="clear_text" class="modal-dialog-title-close" data-original-title="Clear Editor" style="display:none;right:10px" rel="tooltip" />'
      +    '<textarea id="' + gvar.tID + '" rows="50" name="message" class="qr-editor twt-glow" style=""/>'
      + '<div>'
      + '</div>'
      
      + '</div>' // markItUpContainer
      + '</div>' // markItUp
      + '</div>' // message
      + '</div>' // reply-message
      + ''
      // ----=-=-=-=-=-
      
      + '<div class="cont-bottom">'
      +  '<div class="box-bottom" style="display:none">'
      +  '<div class="box-smiley" style="display:none">'
      +   '<div style="-moz-user-select:none" class="goog-tab-bar goog-tab-bar-top">'
      +    '<div style="-moz-user-select:none" id="tkecil" class="goog-tab">Kecil</div>' // goog-tab-selected
      +    '<div style="-moz-user-select:none" id="tbesar" class="goog-tab">Besar</div>'
      +    '<div style="-moz-user-select:none" id="tcustom" class="goog-tab green-tab">Custom</div>'
      +    '<div style="-moz-user-select:none" class="goog-tab close-tab"><span class="tabclose" /></div>'
      +   '</div>'

      +   '<div class="goog-tab-bar-clear"></div>'
      +   '<div id="tabs-content" class="goog-tab-content">'
      +    '<div id="tabs-loader" class="mf-spinner"></div>'
      +    '<div id="tabs-content-inner"></div>'
      +   '</div>'
      +  '</div>' //box-smiley
      +  '<div class="box-upload" style="display:none">'
      +   '<div style="-moz-user-select:none" class="goog-tab-bar goog-tab-bar-top">'
      +    '<div style="-moz-user-select:none" id="tupload" class="goog-tab green-tab goog-tab-selected">Uploader</div>' 
      +    '<div style="-moz-user-select:none" class="goog-tab close-tab"><span class="tabclose" /></div>'
      +   '</div>'
      +   '<div class="goog-tab-bar-clear"></div>'
      +   '<div id="tabs-content-upl" class="goog-tab-content"><div id="tabs-content-upl-inner" style="position:relative;" /></div>'
      +  '</div>' // box-upload
      +  '</div>' // box-bottom
      // ========
      + '<div class="button-bottom" style="padding-bottom:5px">'
        // wrapper additional edit-options
      + '<div class="edit-options" style="display:none;">'
      +   '<div class="edit-reason condensed" style="display:none;">' 
      +    '<div class="controlls">'
      +    '<div class="input-prepend">'
      +     '<span class="add-on" data-original-title="Edit Reason" data-placement="bottom" rel="tooltip"><i class="icon-pencil"></i></span>'
      +     '<input id="form-edit-reason" type="text" class="span4" name="reason" placeholder="Reason for editing" />'
      +    '</div>'
      +    '</div>'
      +   '</div>'  // condensed

      +   '<div class="ts_fjb-tags condensed" style="display:none;">'
      +    '<div class="controlls">'
      +    '<div class="input-prepend">'
      +    '<span class="add-on" data-original-title="Tags \/ Keyword search, separate with space" data-placement="bottom" rel="tooltip"><i class="icon-list-alt"></i></span>'
      +    '<input id="form-tags" type="text" class="span4" name="tagsearch" placeholder="Eg: Electronics, Gadget, Cloths, etc" />'
      +    '</div>'
      +    '</div>'
      +   '</div>' // condensed

      +   '<div class="additional_opt_toggle" data-original-title="Additional Options" data-placement="bottom" rel="tooltip"><i class="icon-th-list"></i></div>'
      +   '<div id="additionalopts" class="goog-tab-content" style="display:none">'
      +   '<div class="additional-item adt-rating condensed">'
      +   '<select name="rating" class="selectbox">'
      +    '<option value="0">Rating</option>'
      +    '<option value="5">&#x2605;&#x2605;&#x2605;&#x2605;&#x2605; : Excellent!</option>'
      +    '<option value="4">&#x2605;&#x2605;&#x2605;&#x2605;&#x2606; : Good</option>'
      +    '<option value="3">&#x2605;&#x2605;&#x2605;&#x2606;&#x2606; : Average</option>'
      +    '<option value="2">&#x2605;&#x2605;&#x2606;&#x2606;&#x2606; : Bad</option>'
      +    '<option value="1">&#x2605;&#x2606;&#x2606;&#x2606;&#x2606; : Terrible</option>'
      +   '</select>'
      +   '</div>'
      +   '<div class="additional-item adt-subscription condensed">'
      +   '<select name="emailupdate" class="selectbox">'
      +    '<option value="9999">Do not subscribe</option>'
      +    '<option value="0">Without email notification</option>'
      +    '<option value="1">Instant email notification</option>'
      +   '</select>'
      +   '<select name="folderid" id="folderid" class="selectbox"></select>'
      +   '</div>'
      +   '<div class="additional-item adt-converlink condensed">'
      +   '<label for="parseurl">'
      +   '<input name="parseurl" id="parseurl" value="1" type="checkbox" /> Convert links in text'
      +   '</label>'
      +   '</div>'

      +   '</div>' // tab-content-additionalopt
      + '</div>'

         // remote button to chkVal
      +  '<input id="qr_chkval" type="button" style="display:none;" value="cv" />' 
         // remote to check MultiQuote
      +  '<input id="qr_chkcookie" type="button" style="display:none;" value="cq" onclick="try{chkMultiQuote()}catch(e){console && console.log && console.log(e)}" />'
         // remote button to delete-mQ
      +  '<input id="qr_remoteDC" type="button" style="display:none;" value="dc" onclick="try{deleteMultiQuote()}catch(e){console && console.log && console.log(e)}" />'
      + '<span class="counter" style="'+(gvar.settings.txtcount ? '':'none')+'"><i>Characters left:</i> <tt class="numero">' + (gvar.thread_type == 'group' ? '1000' : '10000') + '</tt> <b class="preload" style="display:none" title="Est. layout-template"></b></span>'
      
      +  '<input type="submit" tabindex="1" value="'+gvar.inner.reply.submit+'" name="sbutton" id="sbutton" class="goog-inline-block jfk-button '+ (gvar.user.isDonatur ? 'jfk-button-action' : 'g-button-red') +'"/>'
      +  '<input type="submit" tabindex="2" value="Preview Post" name="spreview" id="spreview" class="goog-inline-block jfk-button jfk-button-standard"/>'
      +  '<input type="submit" tabindex="3" value="Go Advanced" name="sadvanced" id="sadvanced" class="goog-inline-block jfk-button jfk-button-standard"/>'
      +  '<div class="sub-bottom sayapkanan">'
      +  '<input type="checkbox" tabindex="4" id="chk_fixups" '+(gvar.settings.widethread ? 'checked="checked"':'')+'><a href="javascript:;"><label title="Wider Thread" for="chk_fixups">Expand</label></a>'
      +  '</div>'
      
      +(gvar.__DEBUG__ ? '<br/>':'')
      +  '<input type="'+(gvar.__DEBUG__?'text':'hidden')+'" value="" id="tmp_chkVal" />\n\n'
      +  '<input type="'+(gvar.__DEBUG__?'text':'hidden')+'" value="" id="current_ckck" />\n\n' // current ck.credential
      + '</div>' // button-bottom
      + ''
      +'</div>' // cont-bottom
      
      
      + ''
      + '</fieldset>'
      + "</form>"
      
    +'</div>' // formqr
    
    +''
    +'</div>' // .quick-reply
    +'</div>' // #qID
  },
  getBOX: function(){
    // preview BOX
    return ''
    +'<div id="modal_dialog_box" class="modal-dialog listing-wrapper" style="left: 523px; top: 181px; display:none;">'
    +'<div class="modal-dialog-title">'
    + '<span class="modal-dialog-title-text">Preview '+(gvar.edit_mode ? gvar.inner.edit.title : gvar.inner.reply.title)+'</span><span class="modal-dialog-title-close popbox"/>'
    + '<h1 id="box_preview_title"></h1>'
    +'</div>'
    
    +'<div id="box_wrap">'
    + '<div class="box_sp"></div>'
    + '<div id="box_preview" class="entry-content"><div style="margin:20px auto; text-align:center;"><img src="'+gvar.B.throbber_gif+'" border=0/>&nbsp;<i style="font-size:12px">loading...</i></div></div>'
    + '<div class="spacer"></div>'
    +'</div>' // box_wrap
    
    +'<div id="cont_button" class="modal-dialog-buttons preview_bottom" style="display:none; width:400px">'
    + '<span class="qr_current_user"></span>'
    + '<button id="box_prepost" class="goog-inline-block jfk-button '+(gvar.user.isDonatur ? 'jfk-button-action' : 'g-button-red') +'" style="-moz-user-select: none;">'+(gvar.edit_mode ? gvar.inner.edit.submit : 'Post')+'</button>'
    + '<button id="box_cancel" class="goog-inline-block jfk-button jfk-button-standard" style="-moz-user-select: none;">Cancel</button>'
    +'</div>'
    +'</div>' // modal_dialog_box
    +'';
  },
  getBOX_RC: function(){
    // recaptcha BOX
    return ''
    // .modal-dialog diilangin biar gak ke
    +'<div id="modal_capcay_box" class="capcay-dialog" style="display:none;">'
    +'<div class="modal-dialog-title"><span class="modal-dialog-title-text">'+(gvar.edit_mode ? 'Saving Changes':'Verification')+'</span><span class="modal-dialog-title-close popbox"/></div>'
    
    // fake button create
    +'<input id="hidrecap_btn" value="reCAPTCHA" type="button" style="display:" onclick="showRecaptcha(\'box_recaptcha_container\');" class="ninja" />' 
    // fake button reload
    +'<input id="hidrecap_reload_btn" value="reload_reCAPTCHA" type="button" style="display:" onclick="Recaptcha.reload();" class="ninja" />'

    +'<div id="box_wrap" class="ycapcay">'
    +(gvar.edit_mode ? 
     '' : '<div><label for="recaptcha_response_field" style="width:100%!important; float:none!important;">Prove you\'re not a robot</label></div>'
     )
    + '<div id="box_response_msg" class="ghost"></div>'
    + '<div id="box_recaptcha_container" class="entry-content">'
       //activate-disabled | activated 
    +  '<div id="box_progress_posting" class="activate-disabled "></div>'
       // recaptcha_is_building_widget
    +  '<div class="recaptcha-widget " id="recaptcha_widget">'+rSRC.getCUSTOM_ReCapcay()+'</div>'
    + '</div>'    
    + '<div id="cont_button" class="modal-dialog-buttons" '+(gvar.edit_mode ? ' style="visibility:hidden;"':'')+'>'
    //+  '<div id="additional_opt" style="float:left; display:none;"></div>'
    +  '<span class="qr_current_user"></span>'
    +  '<button id="box_post" class="goog-inline-block jfk-button jfk-button-action" style="-moz-user-select: none;">Post</button>'
    + '</div>'
    
    +'</div>' // box_wrap
    +'</div>' // modal_capcay_box
    +'';
  },  
  getCUSTOM_ReCapcay: function(){
    return ''
    +'<div id="recaptcha_image" style="width: 300px; height: 57px;"><img width="300" height="57" src="" style="display: block;"/></div>'
    +'<div class="recaptcha-main">'
    +'<label style="width:100%!important; float:none!important;"><strong>'
    + '<span class="recaptcha_only_if_image" id="recaptcha_instructions_image">Please Insert ReCapcay:</span>'
    + '</strong>'
    + '<span id="recaptcha_challenge_field_holder" style="display: none;"/><input type="text" name="recaptcha_response_field" id="recaptcha_response_field" autocomplete="off"/>'
    +'</label>'
    +'<div class="recaptcha-buttons">'
    +'<a title="Get a new challenge" href="javascript:Recaptcha.reload()" id="recaptcha_reload_btn"><span>Reload reCapcay</span></a>'
    +'<a title="Help" href="javascript:Recaptcha.showhelp()" id="recaptcha_whatsthis_btn"><span>Help</span></a>'
    +'</div>' // recaptcha-buttons
    +'</div>' //recaptcha-main
    +'';
  },
  getTPLCustom: function(menus){
    var spacer = '<div style="height:1px"></div>';
    return ''
      +'<div class="wraper_custom">'
      +'<div class="sidsid cs_left">'
      + '<div id="dv_menu_disabler" style="position:absolute; padding:0;margin:0;border:0; opacity:.15; filter:alpha(opacity=15); background:#000; width:100%; height:100%; display:none;"></div>'
      + '<ul id="ul_group" class="qrset_mnu">'
      +   menus
      + '</ul>'
      +'</div>' // cs_left

      +'<div class="sidsid cs_right sid_beloweditor">'
      +'<div id="custom_bottom" style="margin:8px 0; display:none;">'
      + '<input type="hidden" id="current_grup" value="" />'
      + '<input type="hidden" id="current_order" value="" />'
      + '<a id="manage_btn" tabindex="502" href="javascript:;" class="button tinybutton small blue">Manage</a>'
      + '<span id="title_group" style="margin-left: 8px; font-weight: bold;"></span>'
      + '<a id="manage_cancel" tabindex="503" href="javascript:;" class="button tinybutton small white" style="display: none;">Cancel</a>'
      + '<a id="manage_help" tabindex="504" href="javascript:;" class="button tinybutton small white" style="display: none;" title="RTFM">[ ? ]</a>'
      + '<span id="position_group" style="margin-left:10px; display:none"/>'
      +'</div>' // #custom_bottom

      +'<div id="scustom_container" style="max-width: 829px;">'
      + '<div style="margin:8px 0">'
      +  'Custom Smiley Not Found, <a href="http://goo.gl/vBPK8" target="_blank">what is this?</a>'
      +  '<br/><br/>'
      +  'Browse to <a href="http://kask.us/gWtme" target="_blank">Emoticon Corner</a>'
      + '</div>'
      +'</div>'

      // manage | add_group properties
      +'<div id="custom_addgroup_container" style="display: none;">'
      + '<div id="manage_container">'
      + '<div class="smallfont" style="margin-bottom:5px;">'
      +  '<b id="label_group">Group</b>: <input id="input_grupname" tabindex="500" class="input_title" title="Group Name" style="width: 200px;" value=""/>'
      +  '<a id="delete_grupname" tabindex="506" href="javascript:;" class="smallfont" style="margin-left:20px; padding:1px 5px; color:red;" title="Delete this Group">delete</a>'
      + '</div>' // smallfont
      + '<textarea id="textarea_scustom_container" tabindex="501" class="txta_smileyset"></textarea>'
      //+ '<div style="width:100%; display:block; border:1px solid #000"></div>'
      + '<label style="width:255px; text-transform:none;" title="Checked: ignore custom smiley tag" for="scustom_noparse"><input id="scustom_noparse" type="checkbox">&nbsp;Ignore customed BBCODE</label>'
      + '</div>' // #manage_container
      +'</div>' // .custom_addgroup_container

      +'</div>' // .cs_right
      +'</div>' // .wraper_custom
    ;
  },
  //----
  getTPLUpload: function(menus){
    var spacer = '<div style="height:1px"></div>';
    return ''
      +'<div class="wraper_custom">'
      +'<div class="sidsid cs_left">'
      + '<ul id="ul_group" class="qrset_mnu">'
      +   menus
      +  '<li>'+spacer+'</li>' // end list
      + '</ul>'
      +'</div>' // cs_left
      +''
      +'<div class="sidsid cs_right sid_beloweditor">'
      + '<div id="uploader_container" style="max-width:100%;"></div>'
      +'</div>' // .cs_right
      +'<span id="toggle-sideuploader" class="toggle-sidebar" data-state="hide">&#9664;</span>'
      +'</div>' // .wraper_custom
      +''
    ;
  },
  
  getTPLGeneral: function(){
    var cUL, hk, nb='&nbsp;';
    hk = String(gvar.settings.hotkeykey).split(',');
    cUL = String(gvar.settings.userLayout.config).split(',');
    return ''
      +'<table border="0"><tr>'
      +'<td style="width:45%">'

      +'<div class="wrap_stlmenu"><label for="misc_autoshow_smile" class="stlmenu"><input id="misc_autoshow_smile" class="optchk" type="checkbox" '+(gvar.settings.autoload_smiley[0]=='1' ? 'checked':'')+'/>AutoLoad&nbsp;Smiley</label></div>'
      +'<div id="misc_autoshow_smile_child" class="smallfont" style="margin:-3px 0 0 20px;'+(gvar.settings.autoload_smiley[0]=='1' ? '':'display:none;')+'">'
      +'<label for="misc_autoshow_smile_kecil">kecil <input name="cb_autosmiley" id="misc_autoshow_smile_kecil" type="radio" value="kecil" '+(gvar.settings.autoload_smiley[1]=='kecil' ? 'CHECKED':'')+'/></label>&nbsp;'
      +'<label for="misc_autoshow_smile_besar">besar <input name="cb_autosmiley" id="misc_autoshow_smile_besar" type="radio" value="besar" '+(gvar.settings.autoload_smiley[1]=='besar' ? 'CHECKED':'')+'/></label>&nbsp;'
      +'<label for="misc_autoshow_smile_custom">custom <input name="cb_autosmiley" id="misc_autoshow_smile_custom" type="radio" value="custom" '+(gvar.settings.autoload_smiley[1]=='custom' ? 'CHECKED':'')+'/></label>'
      +'</div>'

      +'</td><td>'
      +'<div class="wrap_stlmenu"><label for="misc_hotkey" class="stlmenu"><input id="misc_hotkey" class="optchk" type="checkbox"'+ (String(gvar.settings.hotkeykey)!='0,0,0' ? ' checked="checked"' : '') +'/>QR-Hotkey</label></div><div id="misc_hotkey_child" class="smallfont" style="margin:-3px 0 0 15px; display:'+ (String(gvar.settings.hotkeykey)!='0,0,0' ? 'block' : 'none') +'">'+nb+'<label for="misc_hotkey_ctrl">ctrl <input id="misc_hotkey_ctrl"'+ (hk[0]=='1' ? ' checked="checked"':'') +' type="checkbox" /></label>'+nb+'<label for="misc_hotkey_alt">alt <input id="misc_hotkey_alt" type="checkbox"'+ (hk[2]=='1' ? ' checked="checked"':'') +' /></label>'+nb+'<label for="misc_hotkey_shift">shift <input id="misc_hotkey_shift" type="checkbox"'+ (hk[1]=='1' ? ' checked="checked"':'') +' /></label>'+nb+'+'+nb+'<label for="misc_hotkey_char">'+nb+'</label><input title="alphnumeric [A-Z0-9]; blank=disable" id="misc_hotkey_char" value="'+ gvar.settings.hotkeychar +'" style="width: 20px; padding:0;" maxlength="1" type="text" /></div>'
      +'<div class="wrap_stlmenu"><label for="misc_txtcount" class="stlmenu"><input id="misc_txtcount" class="optchk" type="checkbox"'+ (gvar.settings.txtcount ? ' checked="checked"' : '') +'/>Text Counter</label></div>'
      +'</td>'
      +'</tr></table>'
      +'<div style="width:98%; padding-left:10px;">'
      +'<div class="wrap_stlmenu"><label for="misc_autolayout" class="stlmenu"><input id="misc_autolayout" type="checkbox" class="optchk"'+ (cUL[1]=='1' ? ' checked="checked"':'') +' />AutoLayout</label></div>'+nb+nb
      +'<a id="edit_tpl_cancel" href="javascript:;" class="cancel_layout gbtn" style="display:'+ (cUL[1]=='1' ? '' : 'none') +';"> cancel </a>'
      +'<div id="misc_autolayout_child" class="smallfont" style="margin-top:-3px; display:'+ (cUL[1]=='1' ? 'block' : 'none') +'"><textarea rows="3" style="overflow:auto; letter-spacing:0; line-height:14pt; height:28pt; max-width:92%; min-width:92%; max-height:280px; margin-left:20px;" class="txta_editor" id="edit_tpl_txta">'+ gvar.settings.userLayout.template +'</textarea></div>'
      +'</div>'
    ;
  },
  getTPLAbout: function(){
    return ''
      +'<b>'+ gvar.scriptMeta.fullname +' &#8212; '+ gvar.sversion +'</b> <small>'+gvar.scriptMeta.dtversion+'</small><br>'
      +'<div style="height: 3px;"></div><a href="http://userscripts.org/scripts/show/'+ gvar.scriptMeta.scriptID +'" target="_blank">'+ gvar.scriptMeta.fullname +'</a> is an improvement of `kaskusquickreply` (Firefox Add-Ons) initially founded by bimatampan<br>'
      +'<div style="height: 7px;"></div><a href="http://code.google.com/p/dev-kaskus-quick-reply/" target="_blank"><img src="http://ssl.gstatic.com/codesite/ph/images/defaultlogo.png" title="dev-kaskus-quick-reply - Kaskus Quick Reply on Google Code" border="0" height="33"></a>&nbsp;&#183;&nbsp;<a href="http://creativecommons.org/licenses/by-nc-sa/3.0" target="_blank"><img src="http://i.creativecommons.org/l/by-nc-sa/3.0/88x31.png" border="0"></a><br>'
      +'Licensed under a <a href="http://creativecommons.org/licenses/by-nc-sa/3.0" target="_blank">Creative Commons Attribution-NonCommercial-ShareAlike 3.0 License</a><br>'
      +'<div style="height: 7px;"></div>KASKUS brand is a registered trademark of '+ gvar.domain.replace(/^[^\.]+./gi,'') +'<br>'
      + gvar.scriptMeta.fullname + ' (QR) is not related to or endorsed by '+ gvar.domain.replace(/^[^\.]+./gi,'') +' in any way.<br>'
      +'QR+ (Add-ons) is ported from the original QR (@userscripts.org) as specified by author.<br><div style="height: 3px;"></div>'
      +'<b>Founded By:</b> bimatampan<br>'
      +'<b>Author By:</b> <a href="/profile/302101" class="nostyle" target="_blank"><b>Idx</b></a><br>'
      +'<b>Addons Ported By:</b> <a href="/profile/1323912" class="nostyle" target="_blank"><b>Piluze</b></a><br>'
      
      +'<div class="st_contributor" style="height:190px; vertical-align:top; overflow:auto; border:1px solid rgb(228, 228, 228); clip: rect(auto, auto, auto, auto);">'
      +'<b>Contributors</b><br>'
      +'<div class="contr_l" style="width:45%; float:left;">'
      +'S4nJi<br>riza_kasela<br>p1nk3d_books<br>b3g0<br>fazar<br>bagosbanget<br>eric.<br>bedjho<br>Piluze<br>intruder.master<br>'
      +'Rh354<br>drupalorg<br>'
      +'</div>'
      +'<div class="contr_r" style="width:45%; float:left;">'
      +'gr0<br>hermawan64<br>slifer2006<br>gzt<br>Duljondul<br>reongkacun<br>otnaibef<br>ketang8keting<br>farin<br>'
      +'.Shana<br>t0g3<br>&amp;all-kaskuser@<a href="'+ gvar.kask_domain + '3170414" target="_blank">t=3170414</a>'
      +'</div>'
      +'<div style="clear:both"></div><br>'
      +'<b>Snippet codes</b><br/>'
      +'(ApiBrowserCheck) - YouTube Enhancer by GIJoe<br>'
      +'<br/>'
      +'<b>Shout pasukan-cumik</b><br>'
      +'kakilangit, judotens, matriphe, mursid88, robee_, cheanizer<br/>'
      +'<br/>'
      +'<b>QR Topic</b><br>&nbsp;CCPB <span title="CCPB (#14) UserAgent Fans Club Comunity">UA-FCC</span><br>'
      +' &#167;<a href="'+ gvar.kask_domain +'16414069" target="_blank" title="All About Mozilla Firefox (Add-ons, Scripts, Fans Club)">Firefox</a> <a href="/profile/809411" target="_blank" title="TS: p1nk3d_books">*</a>'
      +' &#167;<a href="'+ gvar.kask_domain +'6595796" target="_blank" title="[Rebuild] Opera Community">Opera</a> <a href="/profile/786407" target="_blank" title="TS: ceroberoz"> * </a>'
      +' &#167;<a href="'+ gvar.kask_domain +'3319338" target="_blank" title="[Updated] Extensions/ Addons Google Chrome">Google-Chrome</a> <a href="/profile/449547" target="_blank" title="TS: Aerialsky"> * </a><br>'
      +'&nbsp;Other</b><br>'
      +' - <a href="'+ gvar.kask_domain +'6616714" target="_blank" title="Add-ons Kaskus Quick Reply + [QR]">Quick Reply+</a> <a href="/profile/1323912" target="_blank" title="TS: Piluze"> * </a><br>'
      +' - <a href="'+ gvar.kask_domain +'6849735" target="_blank" title="Emoticon Corner">Emoticon Corner</a> <a href="/profile/572275" target="_blank" title="TS: slifer2006"> * </a><br><br>'
      +'</div>'
      +''
      ;
  },
  
  getTPLExim: function(){
    return ''
      +''
      +'To export your settings, copy the text below and save it in a file.<br>'
      +'To import your settings later, overwrite the text below with the text you saved previously and click "<b>Import</b>".'
      +'<textarea id="textarea_rawdata" class="textarea_rawdata" style="height: 335px; width: 98%; overflow: auto; white-space: pre;" readonly="readonly"></textarea>'
      +'<div style="float: left;"><a id="exim_select_all" class="qrsmallfont" style="margin: 10px 0pt 0pt 5px; text-decoration: none;" href="javascript:;"><b>^ Select All</b></a></div>'
      +''
    ;
  },
  getTPLShortcut: function(){
    var arr = {
      right: HtmlUnicodeDecode('&#9654;'), left: HtmlUnicodeDecode('&#9664;')
    };
    return ''
      +'<div class="box-kbd" style="">'
      +'<div style="-moz-user-select:none" class="goog-tab-bar goog-tab-bar-top">'
      + '<div style="-moz-user-select:none" id="tkbd-qr" class="goog-tab goog-tab-selected">QR Shortcut</div>'
      + '<div style="-moz-user-select:none" id="tkbd-kaskus" class="goog-tab">Kaskus <a target="_blank" href="http://support.kaskus.co.id/kaskus-basic/kaskus_hotkeys.html" style="float:right; margin-right:5px;" title="Kaskus Hotkeys - Help Center"> ? </a></div>'
      +'</div>' // goog-tab-bar
      +'<div class="goog-tab-bar-clear"></div>'
      +'<div class="goog-tab-content">'
      +'<div id="tabs-contentkbd-inner">'
      +'<div id="tabs-itemkbd-qr" class="itemkbd active" style="display: block;">'
      +'<em>Global on thread page</em>'
      +'<p><tt><kbd>Esc</kbd></tt><span>Close Active Popup</span></p>'
      +'<p><tt><kbd>Ctrl</kbd> + <kbd>Q</kbd></tt><span>Focus to QR Editor</span></p>'
      +'<p><tt><kbd>Alt</kbd> + <kbd>Q</kbd></tt><span>Fetch Quoted Post</span></p>'
      +'<p><tt><kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>Q</kbd></tt><span>Deselect All Quoted Post</span></p>'
      +'<p><tt><kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>D</kbd></tt><span>Load/Save Draft</span></p>'
      +'<p><em>While focus on Editor / textarea</em></p>'
      +'<p><tt><kbd>Ctrl</kbd> + <kbd>Enter</kbd></tt><span>Post Reply</span></p>'
      +'<p><tt><kbd>Alt</kbd> + <kbd>S</kbd></tt><span>Post Reply</span></p>'
      +'<p><tt><kbd>Alt</kbd> + <kbd>P</kbd></tt><span>Preview Quick Reply</span></p>'
      +'<p><tt><kbd>Alt</kbd> + <kbd>X</kbd></tt><span>Go Advanced</span></p>'
      +'<p><em>While focus on Editor / textarea</em></p>'
      +'<p><tt><kbd>Pg-Up</kbd> or <kbd>Pg-Down</kbd></tt><span>Reload reCaptcha</span></p>'
      +'<p><tt><kbd>Alt</kbd> + <kbd>R</kbd></tt><span>Reload reCaptcha</span></p>'
      +'</div>' // itemkbd
      +'<div id="tabs-itemkbd-kaskus" class="itemkbd" style="display: none;">'
      +'<p><tt><kbd>J</kbd></tt><span>Jump to next post section</span></p>'
      +'<p><tt><kbd>K</kbd></tt><span>Jump to previous post section</span></p>'
      +'<p><tt><kbd>Shift</kbd> + <kbd>X</kbd></tt><span>Open all spoiler</span></p>'
      +'<p><tt><kbd>Shift</kbd> + <kbd>A</kbd></tt><span>Show/Hide All categories</span></p>'
      +'<p><tt><kbd>Shift</kbd> + <kbd>S</kbd></tt><span>Search</span></p>'
      +'<p><tt><kbd>Shift</kbd> + <kbd>1</kbd></tt><span>Go to Homepage</span></p>'
      +'<p><tt><kbd>Shift</kbd> + <kbd>2</kbd></tt><span>Go to Forum landing page</span></p>'
      +'<p><tt><kbd>Shift</kbd> + <kbd>3</kbd></tt><span>Go to Jual Beli landing page</span></p>'
      +'<p><tt><kbd>Shift</kbd> + <kbd>4</kbd></tt><span>Go to Groupee landing page</span></p>'
      +'<p><tt><kbd>Shift</kbd> + <kbd>R</kbd></tt><span>Reply Thread</span></p>'
      +'<p><tt><kbd>Shift</kbd> + <kbd>'+arr['left']+'</kbd></tt><span>Go to previous page</span></p>'
      +'<p><tt><kbd>Shift</kbd> + <kbd>'+arr['right']+'</kbd></tt><span>Go to next page</span></p>'
      +'<p><tt><kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>'+arr['left']+'</kbd></tt><span>Go to previous thread</span></p>'
      +'<p><tt><kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>'+arr['right']+'</kbd></tt><span>Go to next thread</span></p>'
      +'</div>'
      +'</div>' // #tabs-contentkbd-inner
      +'</div>' // .goog-tab-content
      +'</div>' // .box-kbd
    ;
  },
  getTPLSetting: function(){
    // setting BOX
    return ''
    +'<div id="modal_setting_box" class="modal-dialog static_width" style="display:none;">'
    +'<div class="modal-dialog-title"><span class="modal-dialog-title-text">Settings<span id="box_preview_subtitle"></span></span><span class="modal-dialog-title-close popbox"/></div>'
    
    +'<div id="box_wrap">'
    + '<div id="qr-box_setting" class="entry-content wraper_custom" style="position:relative; ">' //overflow:hidden;
    +  '<div class="sidsid stfloat cs_left" style="position:relative; height:100%!important;"></div>'   
    +  '<div class="sidsid stfloat cs_right" style="width:540px;"></div>'
    +  '<div class="sidcorner" style=""><a href="javascript:;" id="reset_settings">reset settings</a></div>'
    + '</div>'
    + '<div class="spacer"></div>'
    +'</div>' // box_wrap

    +'<div id="cont_button" class="modal-dialog-buttons" style="display:;">'
    + '<button id="box_action" data-act="update" class="goog-inline-block jfk-button jfk-button-action" style="-moz-user-select:none;">Save</button>'
    + '<button id="box_cancel" class="goog-inline-block jfk-button jfk-button-standard" style="-moz-user-select: none;">Cancel</button>'
    +'</div>'
    +'</div>' // modal_dialog_box
    +''
    ;
  },
  
  getCSS: function(){
    return ""
    +"#" + gvar.qID + '{}' // border:1px solid #000;
    +"#box_preview {max-height:" + (parseInt( getHeight() ) - gvar.offsetMaxHeight - gvar.offsetLayer) + "px;}"
    +".message .markItUpButton50 a {background-image:url("+gvar.kkcdn+"images/editor/html.gif);}"
    +".message .markItUpButton51 a {background-image:url("+gvar.kkcdn+"images/editor/php.gif);}"
    +".markItUpButton95 > a {background-image:url("+gvar.kkcdn+"images/editor/color.gif);}"

    +'body.hideflow{overflow:hidden;margin-right:12px}.xkqr{margin:0 auto}body.fjb .xkqr-entry-head{background-color:#d6a100}body.group .xkqr-entry-head{background-color:#ce5272}.xkqr-entry-head{background-color:#1484ce;zoom:1;filter:progid:DXImageTransform.Microsoft.gradient(gradientType=0,startColorstr="#FF1484CE",endColorstr="#FF1274B5");background-image:linear-gradient(top,#1484ce0%,#1274b5100%);border-bottom:solid 1px rgba(255,255,255,0.2);-webkit-box-shadow:0 2px 0 #0a4166;box-shadow:0 2px 0 #0a4166;border-top:solid 1px #1274b5;overflow:hidden}.xkqr-entry-head .righty,.xkqr-entry-head .lefty{position:relative;z-index:1;padding:5px 10px}.xkqr-entry-head .righty{text-align:right;float:right}.xkqr-entry-head .lefty{text-align:left;float:left}.xkqr-entry-head .lefty,.xkqr-entry-head .qrlink{color:#fff;font-weight:bold;text-shadow:-1px -1px rgba(0,0,0,0.3)}.qrhead-title{margin:2px 0}.title-message{padding:4px 0 2px 0}.qrhead-title,.qrhead-title a{font-size:14px;line-height:16px}#cont_button .goog-inline-block{margin-right:20px!important}#draft_desc,#draft_desc a{color:#ddd!important;text-shadow:none!important}#draft_desc{position:absolute;right:170px;top:6px;font-size:11px;padding:1px 3px;min-width:200px}#qrdraft.jfk-button{height:15px!important;line-height:15px!important;text-shadow:none!important;min-width:60px!important;padding:1px 5px!important;margin-right:50px!important}#qr-content-wrapper fieldset{padding:0!important;margin:0}.counter{font-size:11px;color:#666;float:left}.counter.kereng{color:#333}.cont-bottom{display:inline-block;width:100%;text-align:center;margin-top:4px}#markItUpReply-messsage{width:100%}.markItUpHeader li a{outline:0}.message .markItUpSeparator{margin:2px 5px!important}.message ul li a{border:1px solid transparent!important;width:14px;height:14px;margin:auto 1px}.message #qr_plugins_container{float:left;border-left:1px solid #999;margin-left:5px;padding-left:5px}.message #qr_plugins_container img{border:1px solid transparent!important;cursor:pointer}.message ul li a:hover,.message #qr_plugins_container img:hover{border:1px solid #999!important;background-color:#ddd}.vbmenu_popup{position:absolute;margin-top:-1px;z-index:9999;background:#eee;border:1px solid #999;-moz-border-radius:3px;-webkit-border-radius:3px;border-radius:3px;font-size:12px;padding:4px 0}.vbmenu_popup .osize{padding:2px}.vbmenu_popup .osize:hover{background:#ccc;cursor:pointer}.markItUpButton95{width:25px}.markItUpButton95-wrapper{width:195px!important;padding:5px 2px}.markItUpButton95 li{float:left!important;border:0!important;padding:0 3px 3px}.markItUpButton95 li a{overflow:hidden;text-indent:-9999px!important;display:block;-moz-border-radius:3px;-webkit-border-radius:3px;border-radius:3px;opacity:.78;height:10px!important;width:10px!important;border:solid 1px #ddd;padding:0}.markItUpButton95 li a:hover{opacity:1;border-color:#333!important;background:#fff}.qr-editor-wrap #clear_text{right:16px!important}.qr-editor{min-height:100px!important;width:98.2%!important;padding:8px 5px 8px 10px;color:#000!important;font-size:14px}.g_notice{display:none;font-size:11px;background:#DFC;border:1px solid #CDA;line-height:16px;min-height:16px;padding:.4em 1em}.qrerror{background:#ffd7ff!important}.qr_btn_wrap{float:right;display:inline-block}.qr_btn_wrap a{outline:none!important}.sub-bottom label{width:auto!important}.sayapkanan{float:right;text-align:right;margin:4px}.sayapkanan a{float:right;outline:0;text-decoration:none;margin:-5px 0 0 3px}.button_qrmod{-webkit-border-top-right-radius:0;-webkit-border-bottom-right-radius:0;-moz-border-radius-topright:0;-moz-border-radius-bottomright:0;border-top-right-radius:0;border-bottom-right-radius:0}.btnlink.jfk-button{height:25px!important;line-height:25px!important}.btnlink{width:30px}.qr-m-panel{position:absolute;left:185px;bottom:25px;max-width:280px;background:#DFC;font-size:12px;-moz-border-radius:5px 5px 0 0;-webkit-border-radius:5px 5px 0 0;border-radius:5px 5px 0 0;border:solid 1px #ccc;border-bottom:0;z-index:30;min-height:20px;padding:3px 10px 2px 10px}.goog-inline-block{position:relative;display:inline-block}.jfk-button,a.jfk-button{-webkit-border-radius:2px;-moz-border-radius:2px;border-radius:2px;border:1px solid transparent;cursor:default;font-size:11px;font-weight:700;text-align:center;height:30px!important;line-height:30px!important;min-width:84px;outline:0;padding:0 8px;margin:auto 5px!important}.jfk-button-selected{-webkit-box-shadow:inset 0 1px 2px rgba(0,0,0,0.1);-moz-box-shadow:inset 0 1px 2px rgba(0,0,0,0.1);box-shadow:inset 0 1px 2px rgba(0,0,0,0.1)}.jfk-button-disabled{pointer-events:none;filter:alpha(opacity=50);opacity:.5}.jfk-button-action{background-color:#4d90fe;text-transform:uppercase;background-image:linear-gradient(top,#4d90fe,#4787ed);border:1px solid #3079ed;color:#fff}.jfk-button-action:hover{background-color:#357ae8;background-image:linear-gradient(top,#4d90fe,#357ae8);border:1px solid #2f5bb7}.jfk-button-action:focus,.g-button-red:focus{-webkit-box-shadow:inset 0 0 0 1px #ddd;-moz-box-shadow:inset 0 0 0 1px #ddd;box-shadow:inset 0 0 0 1px #ddd;border:1px solid rgba(0,0,0,0);outline:0 rgba(0,0,0,0)}.jfk-button-action:active{-webkit-box-shadow:inset 0 1px 2px rgba(0,0,0,0.3);-moz-box-shadow:inset 0 1px 2px rgba(0,0,0,0.3);box-shadow:inset 0 1px 2px rgba(0,0,0,0.3)}.jfk-button-action.jfk-button-disabled{background:#4d90fe;filter:alpha(opacity=50);opacity:.5}.jfk-button-standard{background-color:#f5f5f5;background-image:linear-gradient(top,#f5f5f5,#f1f1f1);color:#444;border:1px solid rgba(0,0,0,0.1)!important}.jfk-button-standard:focus{border:1px solid #4d90fe}.jfk-button-standard.jfk-button-disabled{background:#f5f5f5;border:1px solid #e5e5e5;color:#b8b8b8}.jfk-button-standard:hover,.g-button:hover{border:1px solid #c6c6c6;color:#333;text-decoration:none;background-color:#f8f8f8;background-image:linear-gradient(top,#f8f8f8,#f1f1f1);-webkit-box-shadow:0 1px 1px rgba(0,0,0,0.1);-moz-box-shadow:0 1px 1px rgba(0,0,0,0.1);box-shadow:0 1px 1px rgba(0,0,0,0.1)}.jfk-button-standard:active,.g-button:active{background-color:#f6f6f6;background-image:linear-gradient(top,#f6f6f6,#f1f1f1);-webkit-box-shadow:inset 0 1px 2px rgba(0,0,0,0.1);-moz-box-shadow:inset 0 1px 2px rgba(0,0,0,0.1);box-shadow:inset 0 1px 2px rgba(0,0,0,0.1)}.g-button-red{border:1px solid transparent!important;color:#fff;text-shadow:0 1px rgba(0,0,0,0.1);text-transform:uppercase;background-color:#d14836;background-image:linear-gradient(top,#dd4b39,#d14836)}.g-button-red:hover{border:1px solid #b0281a;color:#fff;text-shadow:0 1px rgba(0,0,0,0.3);background-color:#c53727;background-image:linear-gradient(top,#dd4b39,#c53727);-webkit-box-shadow:0 1px 1px rgba(0,0,0,0.2);-moz-box-shadow:0 1px 1px rgba(0,0,0,0.2);-ms-box-shadow:0 1px 1px rgba(0,0,0,0.2);-o-box-shadow:0 1px 1px rgba(0,0,0,0.2);box-shadow:0 1px 1px rgba(0,0,0,0.2)}.g-button-red:active{border:1px solid #992a1b;background-color:#b0281a;background-image:linear-gradient(top,#dd4b39,#b0281a);-webkit-box-shadow:inset 0 1px 2px rgba(0,0,0,0.3);-moz-box-shadow:inset 0 1px 2px rgba(0,0,0,0.3);box-shadow:inset 0 1px 2px rgba(0,0,0,0.3)}.box-bottom{position:relative;clear:both;display:block;width:100%;margin-bottom:8px;font-size:12px;font-weight:400}.goog-tab-bar{position:relative;border:0;list-style:none;cursor:default;outline:0;margin:0;padding:0}.goog-tab-bar-clear{clear:both;height:0;overflow:hidden}.goog-tab{position:relative;border:1px solid #b8b8b8;color:#333;background:#ddd;cursor:default;border-bottom:0;float:left;width:90px;text-align:center;line-height:12px;margin:1px 4px 0 0;padding:4px 8px}.goog-tab-selected{-ms-filter:alpha(opacity=100)!important;filter:alpha(opacity=100)!important;opacity:1.0!important}.goog-tab.goog-tab-selected{background:#eee;color:#000;margin-top:0;padding-bottom:5px;top:1px}.goog-tab-content{border:1px solid #b8b8b8;clear:both;background:#eee;text-align:left;padding:2px 4px}.goog-tab.green-tab{background-color:#109618;color:#FFF}.goog-tab.green-tab,.goog-tab.close-tab .tabclose{text-shadow:none;-ms-filter:alpha(opacity=50);filter:alpha(opacity=50);opacity:.5}.goog-tab.close-tab{float:right!important;width:18px;line-height:12px;height:12px;display:inline-block}.goog-tab.close-tab .tabclose{background:url(http://ssl.gstatic.com/ui/v1/dialog/close-x.png) no-repeat;height:12px;width:12px;display:inline-block}#tabs-content-inner img{cursor:default;border:1px solid transparent;margin:1px 2px}#tabs-content-inner span{border:1px solid transparent;cursor:default;padding:1px 3px}#tabs-content-inner img:hover,#tabs-content-inner span.nothumb:hover{border:1px solid #2085c1;background:#b0daf2!important}.cs_right a:hover{text-decoration:none}.goog-tab-hover{background:#eee}.tab-content-hidden{display:none}#tabs-loader.mf-spinner{margin:20px auto}#tabs-content-upl-inner #preview-image-outer{height:85px;width:100%;overflow:hidden;overflow-x:auto;white-space:nowrap}#tabs-content-upl-inner #preview-image{padding-top:5px;margin-bottom:2px;max-height:75px;height:75px;width:100%}#tabs-content-upl-inner #preview-image img{border:1px solid transparent;margin:0 2px}#tabs-content-upl-inner #preview-image img:hover,.img_hov{border:1px solid #2085c1}#tabs-content-upl-inner #image-control{display:inline-block;padding-top:0;height:60px}#tabs-content-upl-inner #image-control.blured{background-color:#e9e9e9;filter:alpha(opacity=20);-moz-opacity:.2;opacity:.2}#tabs-content-upl-inner .preview-image-unit{position:relative;display:inline!important;width:55px;height:50px;float:left;margin-left:1px}#tabs-content-upl-inner .preview-image-unit .imgremover{left:55%;bottom:-12px;margin:0;padding:0}#loading_wrp{display:inline-block;width:480px;height:80px;position:absolute;z-index:5}#loading_wrp #upl_loading{display:inline-block;float:right;margin:10px auto auto!important}.wraper_custom{position:relative;display:inline-block}.cs_left{width:130px;position:relative;overflow:hidden;overflow-y:auto;max-height:250px}.cs_right{vertical-align:top;padding-left:5px;border-left:1px solid #999;min-height:190px}.sid_beloweditor{min-width:780px;float:left;width:85%}ul.qrset_mnu{width:130px;margin:0;padding:0}ul.qrset_mnu li{list-style-type:none;border-top:1px solid #ccc;padding:0}ul.qrset_mnu li.curent{padding:0}ul.qrset_mnu li.qrt.curent div,ul.qrset_mnu li.qrt.curent .add_group{background:#9daccc;color:#17233c!important}ul.qrset_mnu li.qrt{font-size:11px}ul.qrset_mnu li.qrt div{background:#eee;display:block;text-align:right;color:#333;cursor:default;font-size:11px;padding:10px .5em}ul.qrset_mnu li.qrt div:hover{background:#d8dfea}ul.qrset_mnu li.curent div:hover{background:#9daccc!important}ul.qrset_mnu li.curent .add_group:hover{color:#0000e6!important}li.qrset_lasttab{border-bottom:1px solid #ccc}li.qrset_close{position:absolute;bottom:22px;font-size:11px;width:130px;border-bottom:1px solid #ccc}li.qrset-close div{text-align:center!important;font-weight:700}ul.qrset_mnu li .externurl{margin-right:8px;cursor:pointer;filter:alpha(opacity=60);-moz-opacity:.60;opacity:.60;display:none}ul.qrset_mnu li.qrt:hover>div>.externurl{display:inline-block}#custom_bottom{padding-top:2px;min-height:8px}#content_scustom_container{padding:2px 6px}#scustom_container,#uploader_container{padding:2px}#scustom_container img{max-width:100px!important;max-height:100px!important}#ul_group{max-height:330px;overflow-y:auto}#ul_group .add_group{color:#0000e6;font-weight:700}#ul_group li div{text-align:left;padding:3px .5em}#ul_group li.add_group div{text-align:center}#ul_group li .num{float:left;display:inline-block;width:20px}ul.settingmnu li.qrt div{padding:10px .5em!important}.content_uploader{min-height:150px;overflow:hidden}#label_group{cursor:default}.txta_smileyset,.textarea_rawdata{font-family:"Courier News",Courier,"Lucida Sans Typewriter",Fixed,monospace!important;font-size:12px!important;line-height:14px!important;padding:5px 4px;color:#000}.textarea_rawdata{height:335px;max-height:335px;min-height:335px;width:98%;min-width:98%;max-width:98%;overflow:auto;white-space:pre}.txta_smileyset{min-width:775px;max-width:775px;width:100%;min-height:95px}.stg_content{font-size:12px;max-height:450px;overflow-y:auto}.stg_content label{width:auto;clear:none!important;margin:0 2px}.stg_content input[type="checkbox"]{float:left;clear:left}.stg_content .wrap_stlmenu{display:block;clear:both}.stg_content label.stlmenu{min-width:110px;text-align:left;padding-left:4px;display:inline-block}.smallfont{clear:both;margin:3px 0}.sidcorner{position:absolute;bottom:0;left:0;margin-left:5px;font-size:11px}.wraper_custom .sidsid.stfloat,#scustom_container .scustom_content div{display:inline-block!important}.wraper_custom .sidsid{float:left;clear:none}.ghost,#box_recaptcha_container .activate-disabled,.recaptcha_is_building_widget{display:none!important}* html .goog-inline-block,:first-child+html .goog-inline-block{display:inline}button::-moz-focus-inner,input[type="button"]::-moz-focus-inner,input[type="submit"]::-moz-focus-inner,ul.qrset_mnu li.qrt_first{border:0}.toggle-sidebar{cursor:default;text-align:center;width:25px;border:1px solid #ddd;background:#eee;padding:1px 4px}.toggle-sidebar:hover{border:1px solid #999}#toggle-sideuploader{position:absolute;left:0;top:0;color:#999;width:20px;padding:3px 0}.tinybutton.small{height:15px!important;padding:3px 10px!important;line-height:14px!important;font-size:11px!important;margin-left:5px}.modal-dialog.listing-wrapper{font-size:14px}.modal-dialog .modal-dialog-buttons{text-align:center;margin:10px auto auto}div#qr-modalBoxFaderLayer{position:fixed;background-color:#000;top:0;left:0;width:100%;height:100%;z-index:100;background:0 rgba(127,127,127,0.5) 35% rgba(0,0,0,0.7))}#modal_dialog,.modal-dialog-bg{filter:alpha(opacity=60);-moz-opacity:.60;opacity:.60;background:#fff;overflow:scroll;overflow-x:hidden;position:fixed;right:0;top:0;z-index:100;visibility:hidden}.modal-dialog{color:#000;z-index:101;width:600px;position:fixed;padding:30px 42px 20px}.modal-dialog{-webkit-box-shadow:0 4px 16px rgba(0,0,0,.2);-moz-box-shadow:0 4px 16px rgba(0,0,0,.2);box-shadow:0 4px 16px rgba(0,0,0,.2);-webkit-border-radius:4px;-moz-border-radius:4px;border-radius:4px}.modal-dialog,#modal_dialog_box #cont_button{background:#fff;background-clip:padding-box;border:1px solid #333;outline:0;-webkit-transition:all .2s ease-out;-moz-transition:all .2s ease-out}#cont_button.preview_bottom{-webkit-border-bottom-right-radius:4px;-webkit-border-bottom-left-radius:4px;-moz-border-radius-bottomright:4px;-moz-border-radius-bottomleft:4px;border-bottom-right-radius:4px;border-bottom-left-radius:4px;-webkit-box-shadow:5px 5px 5px rgba(0,0,0,.2);-moz-box-shadow:5px 5px 5px rgba(0,0,0,.2);box-shadow:5px 5px 5px rgba(0,0,0,.2);margin-top:2px}.title-message{min-height:28px;height:28px;display:block}.title-message-sub{width:42%;float:left;display:inline-block}.title-message-sub.forum-title{position:relative;padding-right:5px}.title-message-sub.forum-title .add-on{width:40px;min-height:26px;padding:0}.title-message-sub.forum-title input[type="text"]{color:#333;width:82%}.ts_fjb-price{width:250px}.ts_fjb-price,.ts_fjb-type,.ts_fjb-kondisi{margin-left:5px}.title-righty{width:200px;float:right;text-align:right;display:inline;padding-right:8px}.ts_fjb-type,.ts_fjb-kondisi{width:90px;display:inline}.additional_opt_toggle{width:25px;float:right;opacity:.4;padding-left:10px;cursor:default;border:1px solid transparent}.additional_opt_toggle i{opacity:.6}.additional_opt_toggle:hover{border:1px solid #666}.additional_opt_toggle:hover i,.additional_opt_toggle.active i{opacity:.9}#additionalopts{margin-top:4px;display:block}.additional-item{display:inline-block}.adt-subscription,.adt-converlink{margin-left:20px}.adt-converlink label{width:140px;padding:0;margin:0;margin-bottom:-8px}.edit-options{text-align:left;margin-bottom:4px;min-height:30px}.edit-options .edit-reason,.edit-options .ts_fjb-tags{width:40%;float:left}.edit-options .ts_fjb-tags{margin-left:10px}.edit-options #form-edit-reason,.edit-options #form-tags{width:340px}.modal-dialog-title{background:linear-gradient(top,#e9e9e90%,#f9f9f9100%);color:#000;background:#fff;cursor:default;font-size:16px;font-weight:400;line-height:24px;margin:-22px -14px -16px -14px;position:relative;padding-bottom:8px;height:25px}#modal_dialog_box.modal-dialog{padding-bottom:10px}.modal-dialog-title-text{position:absolute;right:0;margin-right:35px;top:3px}.modal-dialog-title-close,.modal-dialog-title-pickicon{cursor:pointer;opacity:.4;background:0;padding:11px}.modal-dialog-title-close{height:11px;width:11px}.modal-dialog-title-close:after{content:"";background:url(http://ssl.gstatic.com/ui/v1/dialog/close-x.png);height:11px;width:11px}.modal-dialog-title-close:hover,.modal-dialog-title-pickicon:hover{opacity:1}.modal-dialog-title-pickicon{height:8px;width:18px}.modal-dialog-title-pickicon:after{content:"";height:17px;width:20px}.popbox{position:absolute;right:-13px}.popbox:after{position:absolute;right:17px}.box_sp{height:7px;margin:1px 3px 0 3px;background:transarent;border-bottom:1px solid #ddd}.box_sp-shadow{-moz-box-shadow:inset 0 0 1px #fff,0 4px 8px #ddd;-webkit-box-shadow:inset 0 0 1px #fff,0 4px 8px #ddd;box-shadow:inset 0 0 1px #fff,0 4px 8px #ddd}#box_wrap{margin:15px -15px 0 -15px}#box_preview::-webkit-scrollbar{background:transparent;overflow:visible;width:15px}#box_preview::-webkit-scrollbar-thumb{border:solid #fff;background-color:#DDD}#box_preview::-webkit-scrollbar-thumb:hover{background:rgba(0,0,0,0.4);background-color:#999}#box_preview::-webkit-scrollbar-thumb:horizontal{min-width:40px;border-width:4px 6px}#box_preview::-webkit-scrollbar-thumb:vertical{min-height:40px;border-width:6px 4px}#box_preview::-webkit-scrollbar-track-piece{background-color:#fff}#box_preview::-webkit-scrollbar-corner{background:transparent}#box_preview{overflow:auto;padding:5px 8px}#box_preview_title img{margin:0 0 -4px;margin-right:5px;padding:0}#box_preview_title{font-weight:700;font-size:16px;padding:5px 0 0 5px;display:inline-block}#box_preview .product-info{background:#fff6cc;border:solid 1px #ffb31a;font-weight:700;color:#cc7014;position:relative;margin:0 0 20px;padding:10px 30px}#box_preview .product-info:after{content:"";border:solid 5px #fafafa;border-bottom-color:#ffb31a;border-left-color:#ffb31a;position:absolute;top:-1px;right:-1px}.twt-glow{-webkit-border-radius:4px;-moz-border-radius:4px;border-radius:4px;-webkit-box-shadow:inset 0 1px 3px rgba(0,0,0,.05),0 1px 0 #fff;-moz-box-shadow:inset 0 1px 3px rgba(0,0,0,.05),0 1px 0 #fff;box-shadow:inset 0 1px 3px rgba(0,0,0,.05),0 1px 0 #fff;-webkit-transition:.2s linear background;-moz-transition:.2s linear background;transition:.2s linear background;border:1px solid #ccc}.twt-glow:hover{outline:0;border:1px solid #999;cursor:text!important}.twt-glow:focus{-webkit-box-shadow:inset 0 1px 3px rgba(0,0,0,.05),0 0 8px rgba(82,168,236,.6);-moz-box-shadow:inset 0 1px 3px rgba(0,0,0,.05),0 0 8px rgba(82,168,236,.6);box-shadow:inset 0 1px 3px rgba(0,0,0,.05),0 0 8px rgba(82,168,236,.6);border-color:#56b4ef}.condensed .twt-glow{color:#AAA!important}.twt-glowerror,.twt-glowerror:focus{border:1px solid #f30808;box-shadow:0 0 5px #f30808;-webkit-box-shadow:0 0 5px #f30808;-moz-box-shadow:0 0 5px #f30808;border-color:red!important}ul.ulpick_icon,#close_title,#clear_text,#clear_text:after,#close_title:after,#pick_icon:after,#img_icon,.ninja,.imgremover,.imgremover:after{position:absolute;z-index:99}#clear_text,#clear_text:after{z-index:9}ul.ulpick_icon{position:absolute;z-index:999999!important}#close_title,#pick_icon{font-size:14px;cursor:pointer;color:#999;top:-3px}#close_title{right:0}#pick_icon{left:0;position:relative}#close_title:hover,#pick_icon:hover,#clear_text:hover{color:#333}#close_title:after,#clear_text:after,.imgremover:after{right:12px}#pick_icon:after{left:25px}#img_icon{left:3px;top:3px}.ninja{visibility:hidden!important}#menu_posticon{margin-top:-5px;border:1px solid #999;background:#fff;-webkit-box-shadow:0 4px 16px rgba(0,0,0,.2);-moz-box-shadow:0 4px 16px rgba(0,0,0,.2);box-shadow:0 4px 16px rgba(0,0,0,.2)}#menu_posticon li{font-size:12px;border-bottom:1px dotted #ddd}#menu_posticon li a{display:block;width:110px;font-size:11px;height:16px;padding-top:3px;padding-left:2px}#menu_posticon li a img{float:left;width:14px;height:14px;margin-right:5px}#modal_dialog_box #cont_button{z-index:100;width:260px;background:#fff;border:1px solid #333;border-top:0;margin:10px auto -51px;padding:5px 5px 5px 20px}.qr_current_user{display:inline-block;margin:0 10px -10px 0;border:1px solid #ddd;padding:2px}.qr_current_user img{display:block;width:25px;height:25px}.ycapcay{background:#e3e3e3;-moz-border-radius:10px;-webkit-border-radius:10px;border-radius:10px;border-top:solid 1px #ccc;border-right:solid 1px #ddd;border-bottom:solid 1px #ddd;border-left:solid 1px #ccc;margin:20px -20px 0;padding:20px 10px}.ycapcay .modal-dialog-buttons{width:100%;min-height:30px;margin:10px auto -10px;padding:0}.ycapcay .modal-dialog-buttons #box_post{float:right}.ycapcay label{text-shadow:1px 1px #fff;color:#666;text-align:center}.recaptcha-widget#recaptcha_widget{width:310px;background:#fff;border:1px solid #e5e5e5}.recaptcha-widget #recaptcha_image{height:57px;text-align:center;border-bottom:1px solid #e5e5e5;overflow:hidden;padding:5px}.recaptcha-widget #recaptcha_image a{line-height:17px}.recaptcha-widget .recaptcha-main{position:relative;text-align:left;padding:13px}.recaptcha-widget .recaptcha-main span{font:90.25% arial,helvetica,sans-serif;float:left;display:block;margin:-10px 0 10px}.recaptcha-widget .recaptcha-main .errormsg{margin:0 0 .5em}.recaptcha-widget .recaptcha-main label strong{color:#222;display:block;margin:0 0 .4em}.recaptcha-widget .recaptcha-main input[type=text]{width:230px;padding:2px 1px}.recaptcha-widget .recaptcha-buttons{position:absolute;bottom:10px;right:13px}.recaptcha-widget .recaptcha-buttons a{display:inline-block;height:21px;width:21px;margin-left:2px;background:#fff;background-position:center center;background-repeat:no-repeat;line-height:0;opacity:.55}.recaptcha-widget .recaptcha-buttons a:hover{opacity:.8}.recaptcha-widget #recaptcha_reload_btn{background:url(http://ssl.gstatic.com/accounts/recaptcha-sprite.png) -63px}.recaptcha-widget #recaptcha_whatsthis_btn{background:url(http://ssl.gstatic.com/accounts/recaptcha-sprite.png)}.recaptcha-widget .recaptcha-buttons span{position:absolute;left:-99999em}#box_recaptcha_container{min-height:120px;background-color:#fff;border:1px solid #ccc}#box_recaptcha_container .activated{width:54px;height:55px;margin:30px auto}#login_spinner{min-height:210px;width:auto;text-align:center;padding:12px 0}.transp{opacity:0}.mf-spinner{width:54px;height:55px;display:block;-webkit-transition:opacity .5s ease-in-out;-o-transition:opacity .5s ease-in-out;-moz-transition:opacity .5s ease-in-out;transition:opacity .5s ease-in-out;margin:40px auto 10px}#qrtoggle-button.jfk-button{min-width:10px!important;width:10px!important;height:22px!important;line-height:21px!important;padding:0 4px}#qrtoggle-button,#settings-button{filter:alpha(opacity=85);-moz-opacity:.85;opacity:.85}#qrtoggle-button{position:absolute;right:5px;top:3px}#settings-button{position:absolute;height:25px;width:30px;text-indent:10em;overflow:hidden;right:40px;top:2px}#settings-button:hover,#qrtoggle-button:hover{filter:alpha(opacity=100);-moz-opacity:1;opacity:1}#settings-button:active{filter:alpha(opacity=65);-moz-opacity:.65;opacity:.65}.baloon-update{position:absolute;display:inline;z-index:50;margin-left:110px}.baloon-update a:hover{opacity:1}.baloon-update a{z-index:999;outline:0;opacity:.55;top:94%;margin-top:-70px;-moz-border-radius:5px;-webkit-border-radius:5px;border-radius:5px;width:60px;line-height:60px;height:60px;background-color:#000;font-size:30px;text-align:center;color:#fff;overflow:hidden;text-indent:-9999px;display:inline-block;border:0;box-shadow:none}.update{display:block;font-size:10px;line-height:1;-moz-border-radius:3px 3px 0 0;-webkit-border-radius:3px 3px 0 0;border-radius:3px 3px 0 0;background:#f2790e;color:#fff!important;width:60px;position:absolute;right:10px;top:-19px;z-index:15;text-align:center;outline:0;padding:3px 6px}.help-content h4{background:#eee;font-weight:700;cursor:pointer;margin-bottom:1px;line-height:16px;-moz-border-radius:2px;-webkit-border-radius:2px;border-radius:2px;color:#0d7bd1;text-shadow:1px 1px #fff;padding:5px 10px}.help-content h4:hover{background:#e0e0e0}.help-content h4.active{background:#e9e9e9}.update-panel{max-height:300px;margin-top:2px;overflow:hidden;overflow-y:scroll;font-size:12px;padding:2px 10px 5px 10px;font-family:"Courier News",Courier,"Lucida Sans Typewriter",Fixed,monospace!important}#tabs-contentkbd-inner{min-height:150px}.itemkbd em,.itemkbd tt,.itemkbd span{font-style:normal;display:inline-block}.itemkbd em{margin-top:6px}.itemkbd tt{min-width:130px;margin:2px 0}.itemkbd span{color:#333;line-height:1.5em;padding-left:5px}kbd{display:inline-block;background:#eee;box-shadow:0 0 2px rgba(0,0,0,0.4),0 1px 0 rgba(255,255,255,0.8) inset;padding:0 5px;text-transform:uppercase;text-shadow:1px 1px rgba(255,255,255,0.7);font-family:Monaco,"Courier New",Monospace;font-weight:700;color:#666;font-size:.8em;line-height:2.0225em;letter-spacing:.02em;border-radius:2px}::selection{background-color:#ff5c33!important;color:#fff!important}::-moz-selection{background-color:#ff5c33!important;color:#fff!important}::-webkit-selection{background-color:#ff5c33!important;color:#fff!important}.message .markItUpButton22 a{background-image:url(data:image/gif;base64,R0lGODlhFAAUAPcAAAQCBLySRGSKzKTG5PTmrHxKDPzOzPzy7PyytERmrNz6/OweBPyanPxWTPza3Oyq/Pz+/NSubJza7JxyFPzS1Py6vNz+/PwiFKBsyBQM6XeLEgMBADioAOboABISAAAAABZqYND/AEUjAHUCAAAANwAAFh8A7QAA/wBF/wAA/wAA/wAA/6goHxStiHciNgMAdVAAybYAiHMfNgMAdQDgpACv6wAiEgAAAACwAQDoAAASAAAAAABFAAAAAAAAAAAAAAAoAACtAAAiAAAAAAAA5AAA5wAAEgAAAAASAgAAAB8AAAAAAFAc/Lbo6XMSEgMAAABF4wAAYgAAOwAAdXwAiOYAihIfwQAAFggo/gCt/28i/wAA/wccjQDoiAASNgAAdeouMcdndkVpNnVmdZMARYE0OuPrXGN2AOAhcwKtZVFFcgB1czgAU7YB33MARQMAdQEAbwAAjwAA4wAAY0iMALbnAHMSAAMAAHQnAOY7ABLrAAB2AK8saB87gOvrInZ2AFATALYsgHMcIgNzADEAVB8A6OsAEnYAAAAAEQABAQAAAAAAAEghsLat6HNFEgN1AIBkmufnkxISTAAAdbwRt8IBuEUAtHUAFgBv/gCA/x/j/wBj/wC0UwDn3wASRQAAdVCRSbas2HNFRQN1dQAAaAAAgAAAIgAAAAAAPgEA0gAARgAAdcvYL8K1j0Xn43V2Y8xfAOcsABIcAABzAFB5ALbpAHMSAAMAAAwMAJ6hADtPAHUAAAFkSAAA6QAAEgAAAAIAAX8AAAAAAAAAAGeUkGnn6DUSEjEAAFwMEXShAXJPAGkAAGtgYG/7+20SEnMAAGVNmmzXk1/nTHZ2dTJHp1zBtXPlt3QFFmH+/nT//2n//2P//1zYPmm10m3nRmF2dWdbiGV/gXNIQlx1AADcaPPogBISIgAAACBrAAB/AABIAAB1AACNeQCt6QBFEgB1ANABMfYArYsARQEAdQ4xMwEAjwAw4wAAY0XJMTqIrQA2RQF1dQUuagBncQBpSABmACH5BAEAABIALAAAAAAUABQABwipACUIHEiwoMGDCA1CiFAAQoIBECJKnEgwIoAHACZqjFhxIQCIAQAIgJAxI8eBEQkAUKCSpIKSEjuqtNASgIUJL2OihKBSAYSQIyMASKBT4MajRSU4uMC0qVOnDghekOgUwlOmUqc+tXo1K4QGVr9GrHChwgEDF7yCnboWAoOIFNIOZCqWbdi3TQkuYFshYgMDEBBceItW6oLDiBMrJgjgquMLABJKnkw5IAA7)}.message .markItUpButton96 a{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAUCAYAAABiS3YzAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAsZJREFUOMuNlE2P21QUhp9z7TiNhmbaUmlaoGKkqh2x6KYVC9YIsWfLD+GX8E8QO2glFmUDGz41BQ3qVCptk6ZJJnZi+56XhT1pvpDm7Ozrc8775WuXvnokAEnULqILxMXKIAlGEgwDzAyAVGommBlZYpCCcfHyFQCSMDNSAdFFNzU++XCfezf3OHgno9cJuMR0EamiCAa9TkKWWjsAXuc1P5y84c9XOdN5RA14Um8pB4MHH1zm0ztX6SRGXkaixOHVHv1LCVUUL6Ylb4oagPf3u5jBIK94Nl5wNo80pEWKgChM8F4/I0uMh3+N+P7JCAy+/uKIw2s9quh8+8eQb34fULv48v4NPj+6xn43IQsGEnJBMFJaY+RiXNQcv8x59GTE45MxN/rZUq9OEpgtIv8M5wxnFUfXJ9za7zKd15jUiOtC0CA1IEbx2/MZxy9yfno6IU5L0n4X11snsmB0DKZFzc+nU7IkcDIoKCtHzhJcGlwY4LXz+O8RAGXpTaw24yUIghQ4/nfGcFpSlJG8jCg6QWBGQz8YyOF0WDSIkrCdl9Zyc5FIjM9KxmclFozEILQZbei3OgB02gNcEL0RfoW+WjPkjbFpYksGq9+lq2hsM9XRN5Cevxe4YxZ2/hCpNhvPK2qHpm9dbhju7k23dFsibenvQCr3Zun/VKq4Tn/5VDpV6WhFqxidunK8Eg3DsNy1NtQ2Ni4Hx8bp1Q4TWJuABqm2vdjU9PxC6CSBO7ev8Nm969x6t7c8//j2FU6HBQ9/HfB0UFBUcefQcB4RuVBrThaMj27u8eBwn0leMVvUDCYLLncT7h7scdDP6HUMxaZnbYZrnb6AEIyAeP56zne/vOLH4xFpMFyijmJ4VjKalKhuJbBd9NdvWSSjKo3TlzmjyYJF7UQXhtFJDQnyRWS+iCDHZNtGbUbKoyhiTTGvL3j3b0frP2tz3bEGJiqZAAAAAElFTkSuQmCC)}.message .markItUpButton99 a{background-image:url(data:image/gif;base64,R0lGODlhEwATAOYAAAAAAP///z5ivnKY26bP+f3tTPzlTPznTPviWfveTPvbXfvVTPvXTPnOTPvde5x7IfvUX829kP3qt6GZgaigiPnGTPnITPrNXfvWe/zhm6+nksO7p8ajV/ven7Wmha+hg6+ihq+jiLyxl/3uzdDIt/i+TPi/TfjFXPrSf/3nu8m7n8O2ncq9pP3u0XpQB/vcpfznv9DCqP7u0uTYwve6Vfi8V/jAYd28huPFlePLov7kuP7t0f7v1v3u1evgzvi9aPrPkePPsP3mxf7w2/7x3v7y4P7y4fi5Yfe6ZP3myP7v2/7x3/Lm1v7y4v7z5P705v726/i9c/e8dsSWX/rFh/nKkvznzP7u2v716v7w4P7y5fnHksWWbsWfgMWfg8Whh0gRBP///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAGEALAAAAAATABMAAAfZgGGCg4SFhoeEPiohIB8eiIMzExQsQTk4N5BhKxpMS0RFRjs6kCIkTk9QT0ZDPDKCLi6EMRtKTVhaWVc9LSNhsbGwsUlgxVZCMCkSvyVbsrE0LmBeX11gLx0ZYMzOvzTRXFtVQFMoGA4c3M80zlRSPzYnFxAKCOq/W85RSDUmFg0MEhxQFyufiyM0SlRosCCBgQK/XLBzYdDFg4sYMcJiV/HBgAABCIAUGSCixIouCAgIORIksG/5nMVSKaCmTYnQKjp7wLKnxGjAKMq82DLAT6AxZYaJkPFBIAA7)}.message .markItUpButton98 a{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAVCAMAAACeyVWkAAAAYFBMVEX8/vyFzyR7xieO1xqJ0RusqrBjszRxvSyJvGvw8PDm5Obb29r0/uTs+9ik51ma4Eip7Wfh98G0tLSx7Xe55YGQ2CaU2zfU9rC8vryo2IzA8JC04ozM8qDMzsycwoS87oQpvMJ/AAAAAXRSTlMAQObYZgAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAMVJREFUeF4FwIWRHEEMAMCWNLB0DI+288/SBcDpBgAA1+sBAMD3qx4AAG6XqvcHAMC5qup8AgD+VVVVPQDAx7tVVdXrFwDHuVXVq17tcgLg0aK1Fi1auwL4fUdERERExDfgdGkREREREe1yAxyHZ2ZmZh7HAYBnZmZmAgDPzMzMBAB+5pxzzgkA/Mw555wTAPgaY4wxBgDwNcYYYwwAYF+WZVmWvwCf93vvvffee++9936/f/6xruu2bdu+7/u+b9u2revqPzsQBuTq26DvAAAAAElFTkSuQmCC)}.message .markItUpButton21 a{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAIAAAAC64paAAAABnRSTlMA4QDhAOKdNtA9AAAACXBIWXMAAAsTAAALEwEAmpwYAAABg0lEQVR42tVUPUsDQRB9M7dBQi4iypWJhgQsU1lIUtklIgg2tmJhK3b+gLT+AtHaP2AqtUmwslGMTSJcUgaSKEc+bu/DYmGJMR+glVs8HrO8fTOzs0u23cRvF+MP609iodn1Y70SbC8UhL3O1a6vOOmaj6tWds32Xc9gigpDMEUYBvNyVESYIwZiERHaK6+1h8+P2unJ4WTaw6Hs9+WgL0cD6Q6lO/S8kRe4PqRP0mcvMNd7uf0tAC9v79/SBpDaWIUfEkMwM0AEMC0JJqKAMDBYMrHB3U53smYA7tMNMRNzIASBiJmIXabFDQNwfnRWbTm5hFlutAtpS3GNABR5vitNEVdbTj5pAgAsAID5A1FpwpVyyj3nEmal6YQhFN7W2xorTUcFZw5JudHOJ00iACBCMWMBKGYsFdFb08WFtKWPV24AdGSec7Z+r7pChHF/xVUvZjp77iiXMLXnuL/OYl7NynkWahKPxyZnG0Dp4tJx+vMfRjwe28ykDvZ2JsX/5zP4AtVMzoKTk38hAAAAAElFTkSuQmCC)}.message .markItUpButton97 a{background-image:url(data:image/gif;base64,R0lGODlhFAAUAPcAAAAAAIAAAACAAICAAAAAgIAAgACAgMDAwMDcwKbK8EAgAGAgAIAgAKAgAMAgAOAgAABAACBAAEBAAGBAAIBAAKBAAMBAAOBAAABgACBgAEBgAGBgAIBgAKBgAMBgAOBgAACAACCAAECAAGCAAICAAKCAAMCAAOCAAACgACCgAECgAGCgAICgAKCgAMCgAOCgAADAACDAAEDAAGDAAIDAAKDAAMDAAODAAADgACDgAEDgAGDgAIDgAKDgAMDgAODgAAAAQCAAQEAAQGAAQIAAQKAAQMAAQOAAQAAgQCAgQEAgQGAgQIAgQKAgQMAgQOAgQABAQCBAQEBAQGBAQIBAQKBAQMBAQOBAQABgQCBgQEBgQGBgQIBgQKBgQMBgQOBgQACAQCCAQECAQGCAQICAQKCAQMCAQOCAQACgQCCgQECgQGCgQICgQKCgQMCgQOCgQADAQCDAQEDAQGDAQIDAQKDAQMDAQODAQADgQCDgQEDgQGDgQIDgQKDgQMDgQODgQAAAgCAAgEAAgGAAgIAAgKAAgMAAgOAAgAAggCAggEAggGAggIAggKAggMAggOAggABAgCBAgEBAgGBAgIBAgKBAgMBAgOBAgABggCBggEBggGBggIBggKBggMBggOBggACAgCCAgECAgGCAgICAgKCAgMCAgOCAgACggCCggECggGCggICggKCggMCggOCggADAgCDAgEDAgGDAgIDAgKDAgMDAgODAgADggCDggEDggGDggIDggKDggMDggODggAAAwCAAwEAAwGAAwIAAwKAAwMAAwOAAwAAgwCAgwEAgwGAgwIAgwKAgwMAgwOAgwABAwCBAwEBAwGBAwIBAwKBAwMBAwOBAwABgwCBgwEBgwGBgwIBgwKBgwMBgwOBgwACAwCCAwECAwGCAwICAwKCAwMCAwOCAwACgwCCgwECgwGCgwICgwKCgwMCgwOCgwADAwCDAwEDAwGDAwIDAwKDAwP/78KCgpICAgP8AAAD/AP//AAAA//8A/wD//////yH5BAEAAP8ALAAAAAAUABQABwhMAP8JHEiwoMGDCBMqREiq4b+GpB5GhGgw4kKLBDEm1FjQ4cSHGxeC7Djw48eRIkVaNHmSI8qQCj2+JHmxosqKHnNKdJmyp8+fQAUGBAA7)}.message .markItUpButton52 a{background-image:url(data:image/gif;base64,R0lGODlhFAAUAPcBAAAAAAEBAQICAgMDAwQEBAUFBQYGBgcHBwgICAkJCQoKCgsLCwwMDA0NDQ4ODg8PDxAQEBERERISEhMTExQUFBUVFRYWFhcXFxgYGBkZGRoaGhsbGxwcHB0dHR4eHh8fHyAgICEhISIiIiMjIyQkJCUlJSYmJicnJygoKCkpKSoqKisrKywsLC0tLS4uLi8vLzAwMDExMTIyMjMzMzQ0NDU1NTY2Njc3Nzg4ODk5OTo6Ojs7Ozw8PD09PT4+Pj8/P0BAQEFBQUJCQkNDQ0REREVFRUZGRkdHR0hISElJSUpKSktLS0xMTE1NTU5OTk9PT1BQUFFRUVJSUlNTU1RUVFVVVVZWVldXV1hYWFlZWVpaWltbW1xcXF1dXV5eXl9fX2BgYGFhYWJiYmNjY2RkZGVlZWZmZmdnZ2hoaGlpaWpqamtra2xsbG1tbW5ubm9vb3BwcHFxcXJycnNzc3R0dHV1dXZ2dnd3d3h4eHl5eXp6ent7e3x8fH19fX5+fn9/f4CAgIGBgYKCgoODg4SEhIWFhYaGhoeHh4iIiImJiYqKiouLi4yMjI2NjY6Ojo+Pj5CQkJGRkZKSkpOTk5SUlJWVlZaWlpeXl5iYmJmZmZqampubm5ycnJ2dnZ6enp+fn6CgoKGhoaKioqOjo6SkpKWlpaampqenp6ioqKmpqaqqqqurq6ysrK2tra6urq+vr7CwsLGxsbKysrOzs7S0tLW1tba2tre3t7i4uLm5ubq6uru7u7y8vL29vb6+vr+/v8DAwMHBwcLCwsPDw8TExMXFxcbGxsfHx8jIyMnJycrKysvLy8zMzM3Nzc7Ozs/Pz9DQ0NHR0dLS0tPT09TU1NXV1dbW1tfX19jY2NnZ2dra2tvb29zc3N3d3d7e3t/f3+Dg4OHh4eLi4uPj4+Tk5OXl5ebm5ufn5+jo6Onp6erq6uvr6+zs7O3t7e7u7u/v7/Dw8PHx8fLy8vPz8/T09PX19fb29vf39/j4+Pn5+fr6+vv7+/z8/P39/f7+/v///yH5BAHoAwEALAAAAAAUABQAAAhNAAMIHEiwoMGDCBMqXMiwoUIAEBlCBCAwYkOLFiVSDBBxYsaJFTdipNiRpMmQKEtyPLky5UmVLVuqhFnSpE2UMTWG3Pgwo8OfQIMCDQgAOw==)}.message .markItUpButton53 a{background-image:url(data:image/gif;base64,R0lGODlhFAATAPcAACQeJHx+fFRSVDQ2NLSytGxqbJSWlExGTKSipGRiZEQ+RHx6fDQuLDw+PHRydJyenIyKjFxaXDw2PGxudJyWnCQmJFRWVJza7GxubExKTKyqrGRmZDQuNIyOjDw6PJyanBbQIND2iGRJdHcBAABF4AAA63EAEgAAAAAYVQCI1QB0mQAAd3gApOYA63VxEgAAAPhY/omT/5Z0/wMA/wBoNAANAABJAAABAABFaAAAAAAAagAAAAAYYACIhQB0dAAAAAAAKAAAAgAAAAAAAAAjAgABAAAAAAAAAAAYAADoAHESAAAAAPhFaIkAAJYAAAMAAAAAAAAAAABxAAAAAHwYaOaIABJ0AAAAAAgYRADo6W8SEgAAABGFYAA0hQCddAB3AOouaMdnAGRpAHdmAcYARMRHOsQ0XFZ3AOAhcwKtZVFkcgB3c+AAU4kB35YAZAMAdwEAOgAAygAAxAAAVvCMAInnAJYSAAMAAHQ3AOY7ABKdAAB3AMc8yB87d52ddHd3APirAIlIcJY0dAN3AEkAVB8A6J0AEncAAAAAEQABAQAAAAAAAPAhsImt6JZkEgN3AIBkmufnkxISawAAd7wA4sIq/WRxsncAIQA6/gDF/3HE/wBW/wC0UwDn3wASZAAAd/iRSYms2JZkZAN3dwAAyAAAdwAAdAAAAAAAPgEA0gAAZQAAd8vgesKzymSZxHd3VsznAOdIABI0AAB3APh5AInpAJYSAAMAAAwMAJ6hAHtPAHcAAAEgAAAAAAAAAAAAAwIAAX8AAAAAAAAAAHOUkC3n6G0SEmUAAG4MzXWhq1xPugAA3DxgYAD7+wASEgAAAABVmgDVkwCZawB3dwHX8gCl8AG7swAAITb+/iX//8f//1b//zjgPuez0hKZZQB3d5RbiAp/gcVnQnZ3AATcyOfodxISdAAAAA5rAAF/AABnAAB3AAWNeQCt6QBkEgB3ABAAMQAArQAAZAAAdwAwZgAAygAAxAAAVkQAMToArQAAZAAAd1QuagxncUlpSAFmACH5BAEAABcALAAAAAAUABMARwhnAC8IHEiwoMGBGCRAuIAhwgEHAgMkQHCwosWLGC8YAHAAAAYPDBJA/MChQYCMKA1aoIhxgMuXMGMOSEmzps2bFydouOngAcoOAhNc2LBQAYICBCo6yHChwgUBCy4ooNBAKM6rWAkGBAA7)}.qr-quick-quote{background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAACX0lEQVR42q2Tz2sTURDHZ2aTzf5oUkNtIYGaqiCCNk3ppSAKrQcLHsQKIgjeRK3i/2IRLN48iojiQeihFz3Vg0Wr1Vhqiy21lZT82GR3Y5oZX3sQD6b5OfAePHa+38/OzHsIHYjMrIWHL7jyv2/Yrrms2cdA5BkedUc6DpAV+2wpL29sTZI45C12FCBp61YxBzOS5beRCf9crbyWALtL1sNiBu5yjiE6QEcw6a53DFD+Ys75WRgXD8Aw4LVxxrt4UH5TAG/ZXKvkOQGEggTYFcde7PMybQNky+rxHNmsFkQngxmDQKaJL7G/fLmeti5Aftgp1+GFapFB6xagEO4DSOd5va8y2hZgeTYUGIhrlWJGINgjTLYCWIykg4CGRASLWhiuIv7+2noF8+YDh+G+Flbme8tkJlNNgJjFJ5IKQjAAcxim6xjytlubQdYMgsPT5V24jSYDGqA2RKmIVD0CdoQwQGDF6BpG3KdNA/6CHJ38rLxTZiOIqgIm4rIAlwiqeYFIIpDC/tKHlgH7kJ3QDTcnT4iQVQWqRQTiwy87jscx5hVbatG/4a6oe1pQOg2EVaN0gVfGsH+pVn5TAPeTmfa34IRmqErUubtLpjDlPzpI0zCgmrYe51bgphop7D3jaAxOYcpdqqdr7Bat2pO57/IcykpAnD404Z9s9Mfqv4OfdqywKpu7OwymhTPWee9OM22tC3AWrHJlA/RoL07iaOlFM+Z1Af5n6727CkPRBMZxsLTdqGlDAPlmTRc3YCw87g62YnwgQNbtK5KXMTrt3mvHvDZgwU7icOlju+Z78QchDv4Z14ckMwAAAABJRU5ErkJggg%3D%3D) no-repeat}.mf-spinner{background:url(data:image/gif;base64,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%3D%3D) no-repeat}.baloon-update a{background:url(data:image/png;base64,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) center center no-repeat}.modal-dialog-title-pickicon:after{background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAAUCAYAAABroNZJAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAEpJREFUOMtj/P//PwOlgImBCmCYGcKCLpCenk4wpGfOnMlIe++g20KMPBOxCvGJMxFrI14X/v//Hy9OS0v7T0gN42iyHzWEXoYAAP7wRur5rqTkAAAAAElFTkSuQmCC)}#settings-button{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAZCAAAAAADXsHGAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAlwSFlzAAAOwwAADsMBx2+oZAAAAAl2cEFnAAAAHgAAABkAtw53+gAAAOFJREFUKM+l0jELgkAYxnE/zbMI0XifoiP6BBU19N3cqq05AomgiHBwUA+jtdTLLHsJT14Cbei/HPf8EBzOUiunsZWy5mHZWDi3nFdLzr/8bOk3F6xLp3Phd+KHKRqdAiA4TeJ64jyB6AE9gRnn3OQJfBJePRHfq/ydRN/d9iF3vtkYd+nDfZ7v6egy1lU27a7WLh222RiHB4nBejOAPISMsyp9NL921GYjTk1jCAlIgWk9cVZDLwIib3zmnJjSIlO2rbIirSfiGyspy4Tfv/g74mtLP3npN6u/tOJF8ztfxG/gbHyUp+s56AAAAABJRU5ErkJggg==)}'
  },

  /*
   * Livebeta Widefix -by S4nJi
   * userstyles.org/styles/68408
   */
  getCSSWideFix: function(){
    return ""
    +"#main > .row, #main > .row .col { width: 98% !important;margin: 0 1% !important; }"
    +"pre > br {display: none !important; }"
    +"#forum-listing .row .col.grid-12 {width: 98% !important; margin: 0 1% !important}"
    +"#forum-listing .author {width: 120px !important}"
    +"#forum-listing .entry {width: auto !important; padding: 1% 0 5% 1% !important;margin-top: -1px !important; }"
    +".bottom-frame, .ads300, .skin, .l-link, .r-link, .banner-top-ads, .baloon-track {display: none !important; }"
    +".footer .row .col.grid-8,#forum-listing > .row > .col.grid-12 > .header .thread-control .col.grid-8, #forum-listing > .row > .col.grid-12 > .header .thread-navigate .col.grid-8 {float: right !important; }"
  },
  getSCRIPT: function(){
    return ''
    +'if(typeof $ == "undefined") $ = jQuery;'
    +'function showRecaptcha(element){'
    + 'if( typeof(Recaptcha)!="object" ){'
    +   'window.setTimeout(function () { showRecaptcha() }, 200);'
    +   'return;'
    + '}else{'
    +   'Recaptcha.create("6Lc7C9gSAAAAAMAoh4_tF_uGHXnvyNJ6tf9j9ndI", '
    +   'element, {theme:"custom", lang:"en", custom_theme_widget:"recaptcha_widget"});'
    + '}'
    +'}'
    
    +'function jq_cookie(){jQuery.cookie=function(d,e,b){if(arguments.length>1&&(e===null||typeof e!=="object")){b=jQuery.extend({},b);if(e===null){b.expires=-1}if(typeof b.expires==="number"){var g=b.expires,c=b.expires=new Date();c.setDate(c.getDate()+g)}return(document.cookie=[encodeURIComponent(d),"=",b.raw?String(e):encodeURIComponent(String(e)),b.expires?"; expires="+b.expires.toUTCString():"",b.path?"; path="+b.path:"",b.domain?"; domain="+b.domain:"",b.secure?"; secure":""].join(""))}b=e||{};var a,f=b.raw?function(h){return h}:decodeURIComponent;return(a=new RegExp("(?:^|; )"+encodeURIComponent(d)+"=([^;]*)").exec(document.cookie))?f(a[1]):null};}'
    +'var __mq="kaskus_multiquote", __tmp="tmp_chkVal";'
    +'function deleteMultiQuote(){!$.cookie && jq_cookie();$.cookie(__mq,null, { expires: null, path: "/", secure: false }); $("#"+__tmp).val("")}'
    +'function chkMultiQuote(){!$.cookie && jq_cookie();var mqs=$.cookie(__mq); $("#"+__tmp).val(mqs ? mqs.replace(/\s/g,"") : ""); $("#qr_chkval").click() }'
    +'try{chkMultiQuote()}catch(e){console && console.log && console.log(e)};'
    +''
    
    +'function remote_xtooltip(el){var $el, $tgt, sfind; $el=$(el); $tgt=$( $el.attr("data-selector") ); sfind=$el.attr("data-selector_find"); sfind && ($tgt = $tgt.find(sfind)); $tgt.tooltip();}'
    +''
    +''
    ;
  },
  getSCRIPT_UPL: function(){
    return ''
      +'function ajaxFileUpload() {'
      +'$("#loading_wrp").show();'
      +'$("#image-control").addClass("blured");'
      +'$.ajaxFileUpload ({'
      + 'url:"/misc/upload_image",'
      + 'secureuri:false,'
      + 'fileElementId:"browse",'
      + 'dataType: "json",'
      + 'success: function (data, status){'
      +   '$("#image-control").removeClass("blured");'
      +   '$("#loading_wrp").hide();'
      +   'if(data.status == "ok"){'
      +     'var t=\'\';'
      +     't+=\'<div class="preview-image-unit">\';'
      +     't+=\'<img src="\'+data.url+\'" width="46" height="46" alt="[img]\'+data.url+\'[/img]" />\';'
      +     't+=\'<span title="remove" class="modal-dialog-title-close imgremover"/>\';'
      +     't+=\'</div>\';'
      +     '$("#preview-image").prepend( t );'
      +   '}else{'
      +     'alert(data.error);'
      +   '}'
      +   '},'
      + 'error: function (data, status, e){alert(e);}'
      +'});'
      +'return false;'
      +'}' // ajaxFileUpload
      +''
    ;
  },
  getSetOf: function(type){
    switch(type){
      case "color" :
      return {
    "#000000": "Black",
    "#A0522D": "Sienna",
    "#556B2F": "DarkOliveGreen",
    "#006400": "DarkGreen",
    "#483D8B": "DarkSlateBlue",
    "#000080": "Navy",
    "#4B0082": "Indigo",
    "#2F4F4F": "DarkSlateGray",
    "#8B0000": "DarkRed",
    "#FF8C00": "DarkOrange",
    "#808000": "Olive",
    "#008000": "Green",
    "#008080": "Teal",
    "#0000FF": "Blue",
    "#708090": "SlateGray",
    "#696969": "DimGray",
    "#FF0000": "Red",
    "#F4A460": "SandyBrown",
    "#9ACD32": "YellowGreen",
    "#2E8B57": "SeaGreen",
    "#48D1CC": "MediumTurquoise",
    "#4169E1": "RoyalBlue",
    "#800080": "Purple",
    "#808080": "Gray",
    "#FF00FF": "Magenta",
    "#FFA500": "Orange",
    "#FFFF00": "Yellow",
    "#00FF00": "Lime",
    "#00FFFF": "Cyan",
    "#00BFFF": "DeepSkyBlue",
    "#9932CC": "DarkOrchid",
    "#C0C0C0": "Silver",
    "#FFC0CB": "Pink",
    "#F5DEB3": "Wheat",
    "#FFFACD": "LemonChiffon",
    "#98FB98": "PaleGreen",
    "#AFEEEE": "PaleTurquoise",
    "#ADD8E6": "LightBlue",
    "#DDA0DD": "Plum",
    "#FFFFFF": "White"
      };
      break;

      case "button" :
      return {
       news_png : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAANCAIAAAD5fKMWAAAABnRSTlMAAAAAAABupgeRAAAArklEQVR42mNkYGBgYGBob29/9OgRA14gJyfHAlHHz88/bdo0/KqzsrJYHj16lF/auG/Hmvv37587dw6XUiMjIwYGBhY4X1FRUVFREb/xLMic9knLGRgYKvMiT158jKbOXF+WgYGBiYEUgGJ2ZV4kCarR7B207ubn52dhYGB4ev+yh4fHhw8fIKLvPn4XFUAxRYif8/79+wwMDIxHjhzZsmXLx48f8buBn5/fw8MDAOiiPC0scvhsAAAAAElFTkSuQmCC"
      ,throbber_gif : "data:image/gif;base64,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%3D"
      };
      break;
      
      case "posticon" :
      return {
        None: null,
        Post: "posting.gif",
        Video: "video.png",
        Lightbulb: "lightbulb.png",
        Exclamation: "exclamation.png",
        Star: "star.png",
        Cool: "smile3.png",
        Smile: "smile5.png",
        Angry: "repost.png",
        Unhappy: "smile4.png",
        Talking: "smile2.png",
        Heart: "heart.png",
        Wink: "smile.png",
        "Thumbs down": "thumbsdown.png",
        "thumbs up": "thumbsup.png"
      };
      break;

      default: return false; break;
    }
  },
  getSmileySet: function(custom, cb){


  //Format will be valid like this:
  // 'keyname1|link1,keyname2|link2'
  //eg. 
  // ':yoyocici|http://foo'
  //var sample = 'lopeh|http://static.kaskus.us/images/smilies/sumbangan/001.gif,nangis|http://static.kaskus.us/images/smilies/sumbangan/06.gif';
  // gvar.smcustom it is an associated object of all custom smiley
  // gvar.smgroup it is all name of group of custom smiley
  gvar.smcustom = {};
  gvar.smgroup = [];
  (function(buff){
    
    if( buff && isString(buff) && buff!='' ){
      var grup, ret, extractSmiley = function(partition){
        if(!partition) return false;
        var idx=1,sepr = ',',customs=[];
        var smileys = partition.split(sepr);
        if(isDefined(smileys[0]))
        for(var i in smileys){
          if(isString(smileys[i]) && smileys[i]!=''){
            var parts = smileys[i].split('|');
            //customs[idx.toString()] = (isDefined(parts[1]) ? [parts[1], parts[0], parts[0]] : smileys[i]);
            customs.push( (isDefined(parts[1]) ? [parts[1], parts[0], parts[0]] : smileys[i]) );
            idx++;
          }
        }
        return customs;
      };
      if(buff.indexOf('<!!>')==-1){ // old raw-data
        ret = extractSmiley(buff);
        if(ret){
          grup='untitled';
          gvar.smcustom[grup.toString()] = ret;      
          gvar.smgroup.push(grup);
        }
      }else{
        // spliter: ['<!>','<!!>']; 
        // '<!>' split each group; '<!!>' split group and raw-data
        var parts = buff.split('<!>'),part2;
        for(var i=0; i<parts.length; i++){
          part2=parts[i].split('<!!>');
          part2[0]=part2[0].replace(/\\!/g,'!');
          if(part2.length > 0){
            ret = extractSmiley(part2[1]);
            if(ret){
              gvar.smcustom[part2[0].toString()] = ret;
              gvar.smgroup.push(part2[0].toString());
            }
          }
        }  // end for
      }
    } // end is buff
    
    if(typeof cb == 'function') cb();
  })( getValue(KS+'CUSTOM_SMILEY') );
  if(isDefined(custom) && custom) return;

{
gvar.smbesar = [
  // old medium-smiley
  ["sumbangan/smiley_beer.gif", ":beer:", "Angkat Beer"]
 ,["sumbangan/kribo.gif", ":afro:", "afro"]
 ,["smileyfm329wj.gif", ":fm:", "Forum Music"]
 ,["sumbangan/smiley_couple.gif", ":kimpoi:", "Pasangan Smiley"]
 ,["sumbangan/kaskuslove.gif", ":ck", "Kaskus Lovers"] 

 ,["ultah.gif", ":ultah", "Ultah"]
 ,["traveller.gif", ":travel", "Traveller"]
 ,["toastcendol.gif", ":toast", "Toast"]
 ,["jempol1.gif", ":thumbup", "Jempol"]
 ,["takut.gif", ":takut", "Takut"]
 ,["fd_5.gif", ":sup:", "Sundul Up"]
 ,["sundul.gif", ":sup2", "Sundul"]
 ,["sorry.gif", ":sorry", "Sorry"]
 ,["shakehand2.gif", ":shakehand2", "Shakehand2"]
 ,["selamat.gif", ":selamat", "Selamat"]
 ,["salah_kamar.gif", ":salahkamar", "Salah Kamar"]
 ,["request.gif", ":request", "Request"]
 ,["fd_7.gif", ":repost:", "Repost"]
 ,["s_sm_repost2.gif", ":repost2", "Purple Repost"]
 ,["s_sm_repost1.gif", ":repost", "Blue Repost"]
 ,["recseller.gif", ":recsel", "Recommended Seller"]
 ,["rate5.gif", ":rate5", "Rate 5 Star"]
 ,["peluk.gif", ":peluk", "Peluk"]
 ,["nosara.gif", ":nosara", "No Sara Please"]
 ,["nohope.gif", ":nohope", "No Hope"]
 ,["ngakak.gif", ":ngakak", "Ngakak"]
 ,["ngacir2.gif", ":ngacir2", "Ngacir2"]
 ,["ngacir3.gif", ":ngacir", "Ngacir"]
 ,["najis.gif", ":najis", "Najis"]
 ,["mewek.gif", ":mewek", "Mewek"]
 ,["matabelo1.gif", ":matabelo", "Matabelo"]
 ,["marah.gif", ":marah", "Marah"]
 ,["malu.gif", ":malu", "Malu"]
 ,["fd_6.gif", ":kts:", "Kemana TSnya?"]
 ,["kaskus_radio.gif", ":kr", "Kaskus Radio"]
 ,["cewek.gif", ":kiss", "Kiss"]
 ,["kimpoi.gif", ":kimpoi", "Kimpoi"]
 ,["fd_4.gif", ":kbgt:", "Kaskus Banget"]
 ,["fd_8.gif", ":kacau:", "Thread Kacau"]
 ,["fd_1.gif", ":jrb:", "Jangan ribut disini"]
 ,["s_sm_ilovekaskus.gif", ":ilovekaskus", "I Love Kaskus"]
 ,["I-Luv-Indonesia.gif", ":iloveindonesia", "I Love Indonesia"]
 ,["hoax.gif", ":hoax", "Hoax"]
 ,["hotnews.gif", ":hn", "Hot News"]
 ,["hammer.gif", ":hammer", "Hammer2"]
 ,["games.gif", ":games", "Games"]
 ,["dp.gif", ":dp", "DP"]
 ,["cystg.gif", ":cystg", "cystg"]
 ,["cool2.gif", ":cool", "Cool"]
 ,["s_big_cendol.gif", ":cendolbig", "Blue Guy Cendol (L)"]
 ,["cekpm.gif", ":cekpm", "Cek PM"]
 ,["fd_2.gif", ":cd:", "Cape deeehh"]
 ,["capede.gif", ":cd", "Cape d..."]
 ,["bola.gif", ":bola", "Bola"]
 ,["bingung.gif", ":bingung", "Bingung"]
 ,["fd_3.gif", ":bigo:", "Bukan IGO"]
 ,["s_sm_maho.gif", ":betty", "Betty"]
 ,["berduka.gif", ":berduka", "Turut Berduka"]
 ,["s_big_batamerah.gif", ":batabig", "Blue Guy Bata (L)"]
 ,["babygirl.gif", ":babygirl", "Baby Girl"]
 ,["babyboy1.gif", ":babyboy1", "Baby Boy 1"]
 ,["babyboy.gif", ":babyboy", "Baby Boy"]
 ,["angel1.gif", ":angel", "Angel"]
 ,["jempol2.gif", ":2thumbup", "2 Jempol"]
];
// smbesar

/* Only di Kaskus (Small) */ // 
gvar.smkecil = [
  ["s_sm_peace.gif", ":Yb", "Blue Guy Peace"]
 ,["takuts.gif", ":takuts", "Takut (S)"]
 ,["sundulgans.gif", ":sundulgans", "Sundul Gan (S)"]
 ,["shutup-kecil.gif", ":shutups", "Shutup (S)"]
 ,["reposts.gif", ":reposts", "Repost (S)"]
 ,["ngakaks.gif", ":ngakaks", "Ngakak (S)"]
 ,["najiss.gif", ":najiss", "Najis (S)"]
 ,["malus.gif", ":malus", "Malu (S)"]
 ,["mads.gif", ":mads", "Mad (S)"]
 ,["kisss.gif", ":kisss", "Kiss (S)"]
 ,["iluvkaskuss.gif", ":ilovekaskuss", "I Love Kaskus (S)"]
 ,["iloveindonesias.gif", ":iloveindonesias", "I Love Indonesia (S)"]
 ,["hammers.gif", ":hammers", "Hammer (S)"]
 ,["cendols.gif", ":cendols", "Cendol (S)"]
 ,["s_sm_cendol.gif", ":cendolb", "Blue Guy Cendol (S)"]
 ,["cekpms.gif", ":cekpms", "Cek PM (S)"]
 ,["capedes.gif", ":capedes", "Cape d... (S)"]
 ,["bookmark-kecil.gif", ":bookmarks", "Bookmark (S)"]
 ,["bingungs.gif", ":bingungs", "Bingung (S)"]
 ,["mahos.gif", ":bettys", "Betty (S)"]
 ,["berdukas.gif", ":berdukas", "Berduka (S)"]
 ,["berbusa-kecil.gif", ":berbusas", "Berbusa (S)"]
 ,["batas.gif", ":batas", "Bata (S)"]
 ,["s_sm_batamerah.gif", ":bata", "Blue Guy Bata (S)"]
 ,["army-kecil.gif", ":armys", "Army (S)"]
 ,["add-friend-kecil.gif", ":addfriends", "Add Friend (S)"]
 ,["s_sm_smile.gif", ":)b", "Blue Guy Smile (S)"] 

  /* standart */ 

 ,["sumbangan/13.gif", ";)", "Wink"]
 ,["sumbangan/001.gif", ":wowcantik", "Wowcantik"]
 ,["sumbangan/44.gif", ":tv", "televisi"]
 ,["sumbangan/47.gif", ":thumbup", "thumbsup"]
 ,["sumbangan/48.gif", ":thumbdown", "thumbdown"]
 ,["sumbangan/006.gif", ":think:", "Thinking"]
 ,["sumbangan/shit-3.gif", ":tai", "Tai"]
 ,["tabrakan.gif", ":tabrakan:", "Ngacir Tubrukan"]
 ,["sumbangan/39.gif", ":table:", "table"]
 ,["sumbangan/008.gif", ":sun:", "Matahari"]
 ,["sumbangan/020.gif", ":siul", "siul"]
 ,["sumbangan/5.gif", ":shutup:", "Shutup"]
 ,["sumbangan/49.gif", ":shakehand", "shakehand"]
 ,["sumbangan/34.gif", ":rose:", "rose"]
 ,["sumbangan/01.gif", ":rolleyes", "Roll Eyes (Sarcastic)"]
 ,["sumbangan/32.gif", ":ricebowl:", "ricebowl"]
 ,["sumbangan/e02.gif", ":rainbow:", "rainbow"]
 ,["sumbangan/60.gif", ":rain:", "raining"]
 ,["sumbangan/40.gif", ":present:", "present"]
 ,["sumbangan/41.gif", ":Phone:", "phone"]
 ,["sumbangan/005.gif", ":Peace:", "Peace"]
 ,["sumbangan/paw.gif", ":Paws:", "Paw"]
 ,["sumbangan/6.gif", ":p", "Stick Out Tongue"]
 ,["sumbangan/rice.gif", ":Onigiri", "Onigiri"]
 ,["sumbangan/07.gif", ":o", "Embarrassment"]
 ,["sumbangan/35.gif", ":norose:", "norose"]
 ,["sumbangan/q11.gif", ":nohope:", "Nohope"]
 ,["ngacir.gif", ":ngacir:", "Ngacir"]
 ,["sumbangan/007.gif", ":moon:", "Moon"]
 ,["sumbangan/q17.gif", ":metal", "Metal"]
 ,["sumbangan/33.gif", ":medicine:", "medicine"]
 ,["sumbangan/004.gif", ":matabelo:", "Belo"]
 ,["sumbangan/1.gif", ":malu:", "Malu"]
 ,["sumbangan/12.gif", ":mad", "Mad"]
 ,["sumbangan/26.gif", ":linux2:", "linux2"]
 ,["sumbangan/25.gif", ":linux1:", "linux"]
 ,["sumbangan/28.gif", ":kucing:", "kucing"]
 ,["sumbangan/36.gif", ":kissmouth", "kiss"]
 ,["sumbangan/014.gif", ":kissing:", "kisssing"] 

 ,["sumbangan/3.gif", ":kagets:", "Kagets"]
 ,["sumbangan/hi.gif", ":hi:", "Hi"]
 ,["sumbangan/37.gif", ":heart:", "heart"]
 ,["sumbangan/8.gif", ":hammer:", "Hammer"]
 ,["sumbangan/crazy.gif", ":gila:", "Gila"]
 ,["sumbangan/q03.gif", ":genit", "Genit"]
 ,["sumbangan/fuck-4.gif", ":fuck:", "fuck"]
 ,["sumbangan/fuck-8.gif", ":fuck3:", "fuck3"]
 ,["sumbangan/fuck-6.gif", ":fuck2:", "fuck2"]
 ,["sumbangan/frog.gif", ":frog:", "frog"]
 ,["sumbangan/e03.gif", ":flower:", "flower"]
 ,["sumbangan/52.gif", ":exclamati", "exclamation"]
 ,["sumbangan/43.gif", ":email", "mail"]
 ,["sumbangan/4.gif", ":eek", "EEK!"]
 ,["sumbangan/18.gif", ":doctor", "doctor"]
 ,["sumbangan/14.gif", ":D", "Big Grin"]
 ,["sumbangan/05.gif", ":cool:", "Cool"]
 ,["sumbangan/7.gif", ":confused", "Confused"]
 ,["sumbangan/31.gif", ":coffee:", "coffee"]
 ,["sumbangan/42.gif", ":clock", "clock"]
 ,["sumbangan/woof.gif", ":buldog", "Buldog"]
 ,["sumbangan/38.gif", ":breakheart", "breakheart"]
 ,["bolakbalik.gif", ":bingung:", "Bingung"]
 ,["sumbangan/vana-bum-vanaweb-dot-com.gif", ":bikini", "Bikini"]
 ,["sumbangan/q20.gif", ":berbusa", "Busa"]
 ,["sumbangan/30.gif", ":baby:", "baby"]
 ,["sumbangan/27.gif", ":babi:", "babi"]
 ,["sumbangan/24.gif", ":army", "army"]
 ,["sumbangan/29.gif", ":anjing:", "anjing"]
 ,["sumbangan/017.gif", ":angel:", "angel"]
 ,["sumbangan/amazed.gif", ":amazed:", "Amazed"]
 ,["sumbangan/15.gif", ":)", "Smilie"]
 ,["sumbangan/06.gif", ":(", "Frown"]
]; // smkecil

} // smbesar & smkecil

  } // getSmileySet
};
//=== rSRC

/*
* object urusan ajax (modal-boxed)
* method yg dihandle: preview, submit, presubmit
*/
var _BOX = {
  e: {
     dialogname: 'qr-modalBoxFaderLayer' // [modalBoxFaderLayer, modal_dialog]
    ,boxpreview: 'modal_dialog_box'
    ,boxcapcay: 'modal_capcay_box'
    ,lastbuff: ''
    ,boxaction: ''
    ,ishalted: false
    ,isdiff: false
  },
  init: function(e){
    if( trimStr( $('#'+gvar.tID).val() ).length < 5 ){
      gvar.$w.clearTimeout(gvar.sTryEvent);
      $('#'+gvar.tID).addClass('twt-glowerror');
      _BOX.e.ishalted = 1;
      alert('The message you have entered is too short. Please lengthen your message to at least 5 characters');
      gvar.sTryEvent = gvar.$w.setTimeout(function(){$('#'+gvar.tID).removeClass('twt-glowerror') }, 3000);
      $('#'+gvar.tID).focus(); return;
    }
    close_popup();
    $(e).blur();
    _BOX.e.ishalted = false;
    $('body').addClass('hideflow');
  },
  boxEvents: function(){
    $('#box_cancel, .modal-dialog .modal-dialog-title-close').click(function(){ close_popup() });
    $('#box_preview').bind("scroll", function(){
      var $par = $('#box_wrap');
      if( $(this).scrollTop() === 0 )
        $par.find('.box_sp').removeClass('box_sp-shadow')
      else
        $par.find('.box_sp').addClass('box_sp-shadow')
    });
  },
  buildQuery: function(topost){
    //,"emailupdate","folderid","rating", 
    var fields = ["securitytoken", "title", "message", "iconid", "parseurl", "recaptcha_response_field", "recaptcha_challenge_field", "discussionid", "groupid"];
    var url, name, val, query='', arquery={};

    if( gvar.edit_mode == 1 )
      fields = $.merge(["reason","folderid","emailupdate","rating"], fields);
    
    if( gvar.classbody == 'fjb' && $('.ts_fjb-type', $('#formform')).is(':visible') )
      fields = $.merge(["prefixid","kondisi","harga","tagsearch","lokasi"], fields);
    
    // &preview=Preview+Post&parseurl=1&emailupdate=9999&folderid=0&rating=0
    $('#formform').find('*[name]').each(function(){
      var inside = ($.inArray($(this).attr('name'), fields) != -1);
      if( inside ){
        val = ( trimStr( $(this).val() ) );
        name = encodeURIComponent( $(this).attr('name') );
        
        if( name=="title" ){
          if( $('#form-title').parent().hasClass('condensed') )
            val = "";
          else{
            // autocut upto 85 only
            val = val.substring(0, 85);
          }
        }else if(name=="message"){
          gvar.eof = (topost ? "" : "--QR-END-of-MSG-" + (new Date().getTime()).toString() + "--" );

          val = wrap_layout_tpl( val.replace(/\r\n/g, '\n') );
          clog('val message=\n' +  val );
          
          val = ( val + "\n" ) + gvar.eof;
          
          // avoid fail encoding for autotext custom-smiley
          val = val.replace(/(\&\#\d+\;)\)/g, '$1&#41;');
          val = _AJAX.scustom_parser( val );
          
          clog('encodedval message=\n' +  val );
        }
        if( val!="" ) arquery[name] = val;
      }
    });
    !arquery['harga'] && (arquery['harga'] = 1);
    !arquery['lokasi'] && (arquery['lokasi'] = 33); // N/A

    _BOX.e.isdiff = (_BOX.e.lastbuff != trimStr( $('#'+gvar.tID).val() ));
    _BOX.e.lastbuff = trimStr( $('#'+gvar.tID).val() );
    _BOX.e.boxaction = encodeURI( $('#formform').attr('action') );
    return arquery;
  },
  preview: function(){
    if(_BOX.e.ishalted) return;
    
    // init preview
    $('#'+_BOX.e.dialogname).show().css('visibility', 'visible');
    $('body').prepend( rSRC.getBOX() );
    resize_popup_container();
    
    _BOX.boxEvents();
    
    // early load scustom, check matched custom tag pattern
    if( !gvar.settings.scustom_noparse && "undefined" == typeof gvar.smcustom && $('#'+gvar.tID).val().match(/\[\[([^\]]+)/gi) )
        rSRC.getSmileySet(true);
    
    myfadeIn( $('#'+_BOX.e.boxpreview), 130, function(){
      var query = _BOX.buildQuery();
      
      query["preview"] = encodeURI('Preview' + (gvar.thread_type == 'group' ? '' : ' Post'));
      
      clog( 'boxaction=' + _BOX.e.boxaction ); clog( 'tosend='+ JSON.stringify(query) );
      if( gvar.sTryRequest ){
        clog('Other AJAX instance [sTryRequest] is currently running, killing him now.');
        gvar.sTryRequest.abort();
      }
      try{
         if( query!="" )
        gvar.sTryRequest = $.post( _BOX.e.boxaction, query, function(data) {
          var valid, parsed, clean_text, cucok, sdata, mH, imgTitle, titleStr, msg, func;
          valid = tokcap_parser(data);
          mH = ( parseInt( getHeight() ) - gvar.offsetMaxHeight - gvar.offsetLayer );
          
          $('#box_preview').css('max-height', mH + 'px');
          
          if(!valid){
            
            _NOFY.raise_error(data);

          }else{
            
            try{
              sdata = data.replace(/\t/gm, " ").replace(/\s{2,}/gm,' ').replace(/(\r\n|\n|\r)/gm, '{{nn}}').replace(/\"/gm, '"').toString() + '\n\n';
              
            }catch(e){
              clog('decodeURI in preview failed');
            }
            
            parsed = sdata.substring( sdata.indexOf('<section') );
            parsed = parsed.substring(0, parsed.indexOf('</section') );
            var _dom = $(parsed);
            
            if(gvar.thread_type == 'group'){
              cucok = /(?:[\'\"]post-header[\'\"]>\s?<h2\s+[^>]+.([^<]+).+)?[\'\"]entry-content[\'\"](?:[^>]+)?.(.*)/.exec(parsed);
            }
            
            if( $('.entry', $(_dom)).get(0) ){
              if(gvar.thread_type == 'forum'){
                imgTitle = $('h2', $(_dom)).html();
                titleStr = imgTitle.replace(/<[^>]+>/g,'');
                imgTitle = imgTitle.replace(titleStr, '');
                if( titleStr.length > 77 ){
                  $('#box_preview_title').attr('title', titleStr.replace(/\&nbsp;/,''));
                  titleStr = titleStr.substring(0, 77) + '...';
                }
                $('#box_preview_title').html( imgTitle + titleStr );
              }

              _dom = $('.entry', $(_dom));
              $('.preview-post', $(_dom)).remove();
              clean_text = $(_dom).html().replace(gvar.eof, '');
            
              $('#box_preview').html( clean_text.replace(/\{\{nn\}\}/g, '\n') );

              // resize image on its max fits
              $('#box_preview').find('img').each(function(){ $(this).css('max-width', '790px') });
              $('#cont_button').show();
            }else{
              clog('fail build clean_text');

              // is there error?
              if( cucok = /[\'\"]err-msg[\'\"](?:[^>]+|)>([^<]+).\//i.exec(sdata) ){
                msg = cucok[1];
              }
              else{
                msg = 'Unknown error..' + (parseInt($('#'+gvar.qID + ' .numero').text()) < 0 ? ' Your characters is too long' : '');
              }
              func = function(){
                $('#box_preview').html('<div class="qrerror">'+msg+'</div>');
              };
              _NOFY.btnset = false;
              _NOFY.init({mode:'error', msg:msg, cb:func});
            }
            
            $('#box_prepost').click(function(){
              _BOX.init();
              _BOX.presubmit();
            });
            
            _BOX.attach_userphoto('#cont_button .qr_current_user', 'Signed in as ');
            
            if( !gvar.user.isDonatur ){
              if(gvar.edit_mode == 1)
                $('#box_prepost').addClass('jfk-button-action').removeClass('g-button-red');
              else
                $('#box_prepost').removeClass('jfk-button-action').addClass('g-button-red');
            }

            $('#box_prepost').focus().delay(1200);
          }
          
        });
      }catch(e){}
    });
  },
  submit: function(){   
    if(!gvar.user.isDonatur && !gvar.edit_mode && gvar.thread_type!='group'){
      $('#qr-recaptcha_response_field').val( $('#recaptcha_response_field').val() );
      $('#qr-recaptcha_challenge_field').val( $('#recaptcha_challenge_field').val() );
    }
    var query = _BOX.buildQuery(true);
    if( gvar.thread_type == 'group' )
      query["sbutton"] = encodeURI( 'Post+Message' );
    else
      query["sbutton"] = encodeURI( gvar.edit_mode ? 'Save+Changes':'Submit+Reply' );

    _BOX.postloader(true);
    
    try{
      clog('ignite post=' + _BOX.e.boxaction );
      clog('query=' + JSON.stringify(query) )
      
      gvar.sTryRequest = $.post( _BOX.e.boxaction, query, function(data) {
        var valid = tokcap_parser(data), cucok, sdata;
        
        try{
          // warning this may trigger error
          sdata = data.replace(/(\r\n|\n|\r|\t|\s{2,})+/gm, "").replace(/\"/g, '"').toString();
          
        }catch(e){
          clog('decodeURI in submit post failed');
        }
        clog('submited sdata:' + sdata );
        parsed = sdata.substring(0, sdata.indexOf(gvar.eof));

        var args, txt_msg, re;
        // determine is there any specific error raised
        if( cucok = />Error<\/h3>(?:<ul>|\s*|<li>)+([^<]+)/i.exec(sdata) ){
          gvar.postlimit = false;
          re = new RegExp('ry\\s*again\\s*in\\s*(\\d+)\\s*sec', "");

          txt_msg = cucok[1];
          if( cucok = re.exec(txt_msg) ){
            gvar.postlimit = cucok[1];
            txt_msg = txt_msg.replace(re, 'ry again in <span id="rspbox_cntdown">'+ gvar.postlimit +'</span> sec');
          }

          if(!gvar.user.isDonatur){
            _BOX.postloader(false);
            $('#hidrecap_reload_btn').click();
            
            if( gvar.postlimit ){
              _CTDOWN.init(gvar.postlimit, '#rspbox_cntdown');
            }
            $('#box_response_msg').html( txt_msg ).removeClass('ghost').addClass('g_notice').addClass('qrerror').show();
            
          }else{
            close_popup();
            args = {mode:'error', msg:cucok[1]};
            
            if( postlimit ){
              args['cb'] = function(){
                _CTDOWN.init(gvar.postlimit, '#rspbox_cntdown');
              };
            }
            if( !gvar.edit_mode )
              args.btnset = false;
            _NOFY.init(args);
          }
          
        }else if( cucok = /[\'\"]err-msg[\'\"]+(?:[^>]+)?>([^<]+)/i.exec(sdata) ){
          // find recapcay error | this only happen on nondonatur (assumed)
          is_error = 1;

          _BOX.postloader(false);
          $('#hidrecap_reload_btn').click();
          $('#box_response_msg').html( cucok[1] ).removeClass('ghost').addClass('g_notice').addClass('qrerror').show();
          $('#recaptcha_response_field').val('').addClass('twt-glowerror');
        }else if( !valid ){
          close_popup();
          _NOFY.raise_error(data);
        }
        // err-msg =====
        else{
          if( cucok = /<meta\s*http\-equiv=[\"\']REFRESH[\"\']\s*content=[\"\']\d+;\s*URL=([^\"\']+)/i.exec(sdata) ){
            // try to flush draft, before reload
            setValue(KS+'TMP_TEXT', '');
            (function(){
              // NO-Error, grab redirect location
              cucok[1] = cucok[1].replace(/\#/,'/?p'+(new Date().getTime()) + '#');
              location.href = cucok[1];
            })();
            return;
          }else{
            txt_msg  = 'redirect link not found, post might fail. please try again.';
            clog(txt_msg);
            args = {mode:'error', msg:txt_msg, btnset:false };
            _NOFY.init(args);
          }
        }

        // update token
        tokcap_parser(data);
      });
    }catch(e){};
  },
  postloader: function(flag){
    var ids = ['recaptcha_widget','box_progress_posting','box_response_msg','box_post']
       ,cls = ['recaptcha_is_building_widget','activate-disabled','activated','mf-spinner','jfk-button-disabled'];
    if(flag){
      $('#'+ids[0]).addClass( cls[0] ); // tohide capcay-box
      $('#'+ids[1]).removeClass(cls[1]).addClass( cls[2] ).addClass( cls[3] );
      $('#'+ids[2]).hide();
      $('#'+ids[3]).addClass( cls[4] );
    }else{
      $('#'+ids[0]).removeClass( cls[0] );
      $('#'+ids[1]).removeClass( cls[3] ).removeClass( cls[2] ).addClass( cls[1] );
      $('#'+ids[3]).removeClass( cls[4] );
    }
  },
  presubmit: function(){
    if(_BOX.e.ishalted) return;
    
    // init preview
    $('#'+_BOX.e.dialogname).css('visibility', 'visible');
    var judulbox, isCloned, parent;
    parent = 'body > #modal_capcay_box'
    
    if( isCloned = $('#modal_capcay_box').length ){
      $('#wraper-hidden-thing #modal_capcay_box').clone().prependTo( $('body') );
    }else{
      $('body').prepend( rSRC.getBOX_RC() );
      isCloned = false;
    }
    
    $(parent).addClass('modal-dialog');
    judulbox = parent + ' .modal-dialog-title-text';

    if( gvar.user.isDonatur || gvar.thread_type == 'group' ){
      $(judulbox).text('Posting....');
    }
    
    if( gvar.edit_mode ){
      // gvar.edit_mode ? 'Saving Changes':'Image Verification'
      $(judulbox).text('Saving Changes');
      $(parent + ' .recaptcha-widget').hide();
      
      $(parent + ' #box_progress_posting')
        .removeClass('activate-disabled')
        .addClass('activated')
        .addClass('mf-spinner')
        ;
      $(parent + ' #box_post')
        .addClass('jfk-button-disabled')
        .html('Posting');
      $(parent + ' .ycapcay label').hide();
    }
    
    resize_popup_container();
    _BOX.boxEvents();
    
    
    myfadeIn( $('#'+_BOX.e.boxcapcay), 50 );
    
    if( false === gvar.user.isDonatur && !gvar.edit_mode && gvar.thread_type != 'group' ){
      if( !isCloned )
        $('#hidrecap_btn').click();
      
      gvar.sITryFocusOnLoad = gvar.$w.setInterval(function() {
        var field = $('#recaptcha_response_field');
        if( field.length == 1 ){
          clearInterval(gvar.sITryFocusOnLoad);
          $('#recaptcha_response_field').addClass('twt-glow');
          $('#recaptcha_response_field').focus();
        }
        _BOX.attach_userphoto('#cont_button .qr_current_user');
        // events
        $('#recaptcha_instructions_image, #recaptcha_image').click(function(){ field.focus() });
        $('#box_post').click(function(){
          if(field.val()==""){
            alert('Belum Masukin Capcay,...');
            field.focus(); return;
          }
          _BOX.submit()
        });
        $(field).keydown(function(ev){
          var A = ev.keyCode, ab=null;
          if( A===13 ){ // mijit enter
            $('#box_post').click(); ab=1;
            
          }else if( (ev.altKey && A===82) || (A===33||A===34) ) { //** Alt+R(82) | Pg-Up(33) | Pg-Down(34)
            $('#hidrecap_reload_btn').click(); ab=1;
          }
          if( ab ) 
            do_an_e(ev);
        });
      }, 200);
    }else{
      _BOX.submit();
    }
  },
  attach_userphoto: function(target, dt_ori){
    var neim, $tgt = $(target), imgtip;
    neim = gvar.user.name + (gvar.user.isDonatur ? ' [$]' : '');
    !dt_ori && (dt_ori = 'Post as ');
    $tgt.html('');
    $tgt.append('<img src="'+ gvar.user.photo +'" data-original-title="'+ dt_ori + neim +'" title="'+dt_ori + neim +'" rel="tooltip" alt="" />');
    imgtip = 'img[rel="tooltip"]';
    if(gvar.isOpera){
      window.setTimeout(function(){
        xtip(target, imgtip);
      }, 200);
    }else{
      $tgt.parent().find(imgtip).tooltip();
    }
  }
};

/*
* object urusan ajax
* method yg dihandle: quote, edit, 
* outside _BOX doin ajaxify; eg. quote; edit;
*/
var _AJAX = {
  e: {
     task: "quote" //[quote, edit]
    ,ajaxrun: false // current-run
  },
  init: function(){},
  get_formact_norm: function(){
    var uri = $('#formform').attr('action');
    if( uri.indexOf('post=') !== -1 )
      uri = uri.replace(/\&?post=(?:[^\b\&]+)?/gi, '');
    if( uri.indexOf('?') === -1 )
      uri += '?';
    return uri;
  },
  ajaxPID: function(mode, running){
    if(!mode) return;
    if( _AJAX.e.ajaxrun && running !== false ){
      try{
        clog('Other AJAX instance ['+_AJAX.e.ajaxrun+'] is currently running, killing him now.');
        gvar.sTryRequest.abort();
        gvar.ajax_pid[_AJAX.e.ajaxrun] = 0;
      }catch(e){}
    }
    gvar.ajax_pid[mode] = (running === false ? 0 : (new Date().getTime()) );
    _AJAX.e.ajaxrun = (false !== running && !running ? mode : false);
    
    clog('ajaxrun = ' + _AJAX.e.ajaxrun);
  },
  quote: function(obj, cb_before, cb_after ){
    
    _AJAX.e.task = 'quote';
    var post_ids, uri = _AJAX.get_formact_norm();
    post_ids = $('#tmp_chkVal').val();
    if(post_ids)
      post_ids = post_ids.split(',');
    
    uri+= '&post=' + post_ids[0];
    clog('uri=' + uri);

    if( _AJAX.e.task && gvar.ajax_pid[_AJAX.e.task] ) {
      clog('AJAX '+_AJAX.e.task+' is currently running, abort previous...');
      try{
        gvar.ajax_pid[_AJAX.e.task].abort();
      }catch(e){}
    }
    try{
      _AJAX.ajaxPID('quote');
      if(typeof(cb_before)=='function') cb_before();
      gvar.sTryRequest = $.get( uri, function(data) {
        var valid, msgs, parsed, cucok, sdata, is_error = false;
        try{
          //sdata = decodeURIComponent( JSON.stringify(data).replace(/\\\"/g, '') ).toString();
          sdata = ( (data).replace(/\\\"/g, '') ).replace(/(\r\n|\n|\r)/gm, "\\n").toString();
        }catch(e){
          clog('decodeURI in fetch quote failed')
        }
        
        //clog('QUOTE=' + sdata);
        valid = tokcap_parser(data, 'quote');
        
        // is_error checking
        if(!valid){
          var func = function(){};
          _NOFY.init({mode:'error', msg:'Kaskus Kepenuhan? <a href="javascript:;">Try Again</a> | <a href="javascript:;">Dismiss</a>', cb:func});
          
        }else{
          parsed = sdata.substring(0, sdata.indexOf('</textar'));
          clog('parsed=' + parsed);
          
          if( cucok = /<textarea[^>]+>(.+)?/im.exec(parsed) ){
            _TEXT.init();
            if( cucok[1] )
              _TEXT.add( entity_decode( unescapeHtml( cucok[1].replace(/\\n|\\r\\n|\\r/g, '\n') ) ) );
            _TEXT.pracheck();
          }
          if(typeof(cb_after)=='function') cb_after();
        }
        _AJAX.ajaxPID('quote', false);
      });
    }catch(e){
      clog('FAILED = ' + uri);
      _AJAX.ajaxPID('quote', false);
    }
  },
  edit_cancel: function(focus){
    var conf = confirm('You are currently editing a post.\n\nDiscard anyway?');
    if( conf ){
      clog('edit canceling; now switching Token:\nold=' + gvar._securitytoken + '; now using:' + gvar._securitytoken_prev);
      
      gvar._securitytoken = gvar.inner['reply']['stoken'];
      $('#qr-securitytoken').val(gvar._securitytoken);
      
      gvar.edit_mode = 0;
      _AJAX.e.task = 'post';
      $('#formform')
        .attr('action', '/post_reply/' + gvar.pID )
        .attr('name', 'postreply' );
      $('.inner_title').html( gvar.inner.reply.title );
      $('#sbutton').val( gvar.inner.reply.submit );
      if( !gvar.user.isDonatur )
        $('#sbutton').removeClass('jfk-button-action').addClass('g-button-red');
      
      _TEXT.set("");
      _TEXT.pracheck(focus);
      _NOFY.dismiss();
      
      // reset title
      $("#hid_iconid").val(0);
      $("#form-title").val("");
      $("#img_icon").attr("src", "#");
      $(".edit-options, #img_icon, #close_title, .title-message, .edit-reason, .ts_fjb-tags, .ts_fjb-type, .ts_fjb-kondisi, .ts_fjb-price").hide()
    }
    return conf;
  },
  edit: function(obj, cb_before, cb_after){
    
    _AJAX.e.task = 'edit';
    
    if( gvar.ajax_pid[_AJAX.e.task] ) {
      clog('AJAX '+_AJAX.e.task+' is currently running, abort previous...');
      try{
        gvar.ajax_pid[_AJAX.e.task].abort();
      }catch(e){}
    }
    try{
      _AJAX.ajaxPID('edit');
      if(typeof(cb_before)=='function') cb_before();
      gvar.edit_mode = 1;
      var uri, href; 
      href = trimStr( obj.attr('href').toString() );
      uri = (href.indexOf(gvar.domain)==-1 ?gvar.domain.substring(0, gvar.domain.length-1) : '') + href;
      
      gvar.sTryRequest = $.get( uri, function(data) {
        
        var valid, parsed, cucok, sdata, el, is_error=false;
        
        // disini decodeURIComponent kadang bikin malformed URI 
        // issue nya klo ada string % akan error fitu
        try{
          sdata = ( (data).replace(/\\\"/g, '') ).replace(/(\r\n|\n|\r)/gm, "\\n").toString();
          
        }catch(e){
          clog('error raised')
        }
        // better check wheter page is loaded or not before doin below actions
        // is_error checking
        gvar.inner['reply']['stoken'] = gvar._securitytoken_prev = gvar._securitytoken;
        valid = tokcap_parser(data);
        
        // is_error checking
        if(!valid){
          var func = function(){};
          _NOFY({mode:'error', msg:'Kaskus Kepenuhan? <a href="javascript:;">Try Again</a> | <a href="javascript:;">Dismiss</a>', cb:func});
          
        }else{
          $('#formform')
            .attr('action', uri)
            .attr('name', 'edit_postreply');
          
          parsed = sdata.substring(0, sdata.indexOf('</textar'));
          clog('parsed=' + parsed)
          
          if( cucok = /<textarea[^>]+>(.+)?/im.exec(parsed) ){
            var re, tmptext, tplpart, ttitle, cfg, layout;
            
            _TEXT.init();
            
            // check for title
            ttitle = false;
            el = $('input[name="title"]', $(sdata));
            if( el.length ){
              ttitle = {
                 icon: basename( $('#display_posticon', $(sdata)).attr('src') ).replace(/\./g,'')
                ,text: el.val()
              };
              if( !ttitle.text && ttitle.icon == 'cleargif' )
                ttitle = false;
              clog('got judul = ' + JSON.stringify(ttitle) )
            }
            if( ttitle )
              _TEXT.set_title( ttitle );

            // check for reason
            ttitle = false;
            el = $('input[name="reason"]', $(sdata));
            if( el.length ){
              ttitle = {text: el.val()};
              _TEXT.set_reason( ttitle );
            }

            // check additionl opt
            ttitle = false;
            el = $('select[name="folderid"]', $(sdata));
            if( el.length ){
              ttitle = {
                subscriptions: el.html(),
                rating: $('select[name="rating"]', $(sdata)).find('option[selected="selected"]').val()||null,
                emailupdate: $('select[name="emailupdate"]', $(sdata)).find('option[selected="selected"]').val()||null,
                convertlink: $('input[name="parseurl"]', $(sdata)).is(':checked')
              };
              _TEXT.set_additionl_opt( ttitle );
              $('#additionalopts').show();
            }

            // check if fjb and is first post
            el = $('select[name="prefixid"]', $(sdata));
            if( gvar.classbody == 'fjb' && el.length ){
              ttitle = {
                 tipe:    el.find('option[selected="selected"]').val()
                ,harga:   $('input[name="harga"]:first', $(sdata)).val()
                ,kondisi:   $('select[name="kondisi"]', $(sdata)).find('option[selected="selected"]').val()
                ,tags:    $('input[name="tagsearch"]:first', $(sdata)).val()
              };
              clog('got fjbdetail = ' + JSON.stringify(ttitle) )
              _TEXT.set_fjbdetail( ttitle );
            }
            else{
              _TEXT.set_fjbdetail(null);
            }

            
            // layouting ...
            cfg = String(gvar.settings.userLayout.config).split(',');
            layout = gvar.settings.userLayout.template.toLowerCase()
            
            tmptext = trimStr( unescapeHtml( cucok[1].replace(/\\n|\\r\\n|\\r/g, '\n') ) );
            
            if( cfg[1]==1 && layout ){
              
              tplpart = layout.split('{message}');
              re = new RegExp( '^' + tplpart[0].replace(/(\W)/g, "\\" + "$1"), "");
              if( re.test(tmptext.toLowerCase()) )
                tmptext = tmptext.substring(tplpart[0].length, tmptext.length);
                
              re = new RegExp(tplpart[1].replace(/(\W)/g, "\\" + "$1") + '$', "");
              if( re.test(tmptext.toLowerCase()) )
                tmptext = tmptext.substring(0, (tmptext.length-tplpart[1].length) );
            }
            $('.inner_title').html( gvar.inner.edit.title );
            $('#sbutton').val( gvar.inner.edit.submit );
            if( !gvar.user.isDonatur )
              $('#sbutton').addClass('jfk-button-action').removeClass('g-button-red');

            _TEXT.set( tmptext );
            _TEXT.pracheck();
            _TEXT.lastfocus();
          }
          $('#scancel_edit').show();
          
          if(typeof(cb_after)=='function') cb_after();
        }
        _AJAX.ajaxPID('edit', false);
      });
    }catch(e){ 
      gvar.edit_mode = 0;
      _AJAX.ajaxPID('edit', false);
    };
  },
  scustom_parser: function(msg){
    // trim content msg
    msg = trimStr( msg );
    if( !gvar.settings.scustom_noparse ) 
        return ( !msg.match(/\[\[([^\]]+)/gi) ? msg : _AJAX.do_parse_scustom(msg) );
    else
        return msg;
  },
  do_parse_scustom: function (msg){
    var buf = msg;
    var paired, re, re_W, cV, tag, maxstep, done=false, lTag='', retag=[];
    // avoid infinite loop, set for max step
    maxstep = 200;
    
    // prepared paired key and tag of custom image
    paired = _AJAX.prep_paired_scustom();

    while(!done && maxstep--){
        tag = /\[\[([^\]]+)/.exec(buf);
        //clog('in while. tag='+tag[1] );
        if( tag ){
            re_W = '\\[\\[' + tag[1].replace(/(\W)/g, '\\$1') + '\\]';
            re = new RegExp( re_W.toString() , "g"); // case-sensitive and global, save the loop
            if( isDefined(tag[1]) && isDefined(paired['tag_'+tag[1]]) && tag[1]!=lTag ){
                clog('parsing['+tag[1]+']...');
                cV = paired['tag_'+tag[1]];
                buf = buf.replace(re, (/^https?\:\/\/\w+/i.test(cV) ? '[IMG]'+cV+'[/IMG]' : unescape(cV) ) );
                lTag = tag[1];
            }else{
                clog('no match tag for:'+tag[1]);
                buf = buf.replace(re, '\\[\\['+tag[1]+'\\]');
                retag.push(tag[1]);
            }
        }else{
          done=true;
        }
    } // end while
    
    if(retag.length){
        clog('turing back');
        buf = buf.replace(/\\\[\\\[([^\]]+)\]/gm, function(S,$1){return('[['+$1.replace(/\\/g,'')+']')});
    }   
    clog('END of do_parse_scustom process=\n' + buf);
    return buf;
  },  
  prep_paired_scustom: function (){
    // here we load and prep paired custom smiley to do parsing purpose
    // make it compatible for old structure, which no containing <!!>
    var grup, sml, idx=0, paired = {};
    
    // preload smiliecustom database, should be done before (early)
    for(var grup in gvar.smcustom){
      sml = gvar.smcustom[grup];
      /** gvar.smcustom[idx.toString()] = [parts[1], parts[0], parts[0]];
      # where :
      # idx= integer
      # gvar.smcustom[idx.toString()] = [link, tags, tags];
      # deprecated for unicode emote support:
      # # if(sml[j].toString().match(/^https?\:\/\//i)) {
      */
      for(var j in sml){
        if( typeof(sml[j]) != 'string' ) {
          paired['tag_'+sml[j][1].toString()] = sml[j][0].toString();
          idx++;
        }
      }
    }
    return paired;
  }
};

/*
* object urusan notifikasi
* any event that will lead to notification 
* above textarea handled on this object
*/
var _NOFY = {
  // whether [quote, edit, error]
  // ----
  mode  : 'quote',
  btnset  : true,
  msg   : '',
  cb    : null,
  // ----
  init: function( args ){
    for(field in args){
      if( !isString(field) ) continue;
      _NOFY[ field.toString() ] = args[field];
    } 
    
    clog('_NOFY inside :: ' + JSON.stringify(args) );
    _NOFY.exec();
  },
  exec: function(mode){
    var emsg = $('#notify_msg');
    if(_NOFY.msg){
      emsg.html(_NOFY.msg);
    }
    else { // if(null == _NOFY.msg)
      emsg.html('Unknown error, please <a id="qr_unknown_posterror" href="javascript:;">reload the page</a>');
      $('#qr_unknown_posterror').click(function(){
        setTimeout(function(){ location.reload(false) }, 50);
      });
      // this should be just here, avoid editor-focused on click multi-quote
      close_popup(); 
    }
    
    //neutralizing
    emsg.removeClass('qrerror');
    $.each(['scancel_edit','quote_btnset'], function(){ $('#'+this).hide() });
    
    switch(_NOFY.mode){
      case "error":
        emsg.addClass('qrerror');
      break;
      case "quote":
        $('#quote_btnset').show();
      break;
      case "edit":
        $('#scancel_edit').show();
      break;
    }
    if(!_NOFY.btnset)
      $('.qr-m-panel').hide();
    else
      $('.qr-m-panel').show();
    $('#notify_msg, #notify_wrap').show();
    if(typeof(_NOFY.cb)=='function') _NOFY.cb();
  },
  raise_error: function(data){
    var _ME, func=null, _msg='';
    _ME = this;

    // session lost; invalid post?
    if( data.match(/\byou\sdo\snot\shave\spermission\sto\sac/i) ||
      data.match(/<div\s*class=[\'\"]login-form-(?:wrap|center)[\'\"]/i) 
    ){
      _msg = 'You do not have permission to do this. <a class="btn-reload" href="javascript:;">Reload page?</a>';
      func = function(){
        if( !_AJAX.e.ajaxrun )
          $('#box_preview').html('<div class="qrerror errorwrap">'+_msg+'</div>');

        $('.btn-reload').each(function(){
          $(this).click(function(){
            window.setTimeout(function(){ location.reload(false) }, 50);
          });
        })
      };
    }
    else if(data.match(/\bkepenuhan\b/i)){
      // bad guessing, i knew.. x()
      _msg = 'Kaskus Kepenuhan? <a class="btn-retry" '+(_AJAX.e.ajaxrun ? 'data-toretry="'+_AJAX.e.ajaxrun+'"' : '')+'href="javascript:;">Try Again</a> | <a class="btn-dismiss" href="javascript:;">Dismiss</a>';
      func = function(){
        if( !_AJAX.e.ajaxrun ){
          $('#box_preview').html('<div class="qrerror errorwrap">'+_msg+'</div>');
          $('.btn-retry').each(function(){
            $(this).click(function(){
              _BOX.preview()
            })
          })
        }
        else{
          $('#notify_msg .btn-retry:first').click(function(){
            var toretry, $tgt, $par = $(this).closest('.col');
            toretry = $(this).data('toretry');
            if(toretry == 'edit'){
              $tgt = $par.find('.user-tools a[href*="/edit_post/"]:first');
              $tgt.length && do_click($tgt.get(0));
            }
            else{
              do_click($('#squote_post').get(0));
            }
          })
        }
      };
    }
    else{
      _msg = null;
    }
    _ME.btnset = false;
    _ME.init({mode:'error', msg:_msg, cb:func});
  },
  dismiss: function(){
    $('.qr-m-panel').show();
    $('#notify_msg, #notify_wrap').hide();
    try{
      gvar.sTryRequest.abort();
    }catch(e){}
  }
};

/*
* object urusan text (textarea)
* any controller button will be depend on this
* eg. set any bb-tag, clear, autogrow, etc
*/
var _TEXT = {
  e : null, eNat : null,
  content   : "",
  cursorPos   : [],
  last_scrollTop: 0,
  init: function() {
    this.e = $('#'+gvar.tID);
    this.eNat = gID(gvar.tID);
    this.content = this.e.val();
    this.cursorPos = this.rearmPos(); // [start, end]
  },
  rearmPos: function(){ return [this.getCaretPos(), gID(gvar.tID).selectionEnd]; },
  subStr: function(start, end){ return this.content.substring(start, end);},
  set_title: function(data){
    $('.title-message').slideDown(1, function(){
      $('.title-message #form-title').focus().val( data.text );
      $('li a[data-name="'+ data.icon +'"]', $('#menu_posticon') ).click();

      data.text && $('#close_title').show();
    });
  },
  set_reason: function(data){
    $('.edit-reason #form-edit-reason').val(data['text']);
    $('.edit-options, .edit-reason').show();
  },
  set_additionl_opt: function(data){
    var $el;
    $('#additionalopts #folderid').html(data['subscriptions']);
    if( data['rating'] ){
      $el = $('#additionalopts select[name="rating"]');
      $el.find('option[selected="selected"]').removeAttr('selected');
      $el.find('option[value="'+data['rating']+'"]').attr('selected', 'selected');
    }
    $el = $('#additionalopts input[name="parseurl"]');
    if( data['convertlink'] )
      $el.attr('checked', "checked");
    else
      $el.removeAttr('checked');

    $el = $('#additionalopts select[name="emailupdate"]');
    if( data['emailupdate'] ){
      $el.find('option[selected="selected"]').removeAttr('selected');
      $el.find('option[value="'+data['emailupdate']+'"]').attr('selected', 'selected');
    }
  },
  set_fjbdetail: function(data){
    $('.ts_fjb-tags input[type="text"]').val(data['tags']);
    $('.ts_fjb-price input[type="text"]').val(data['harga']);
    $('.ts_fjb-type').find('option[selected="selected"]').removeAttr('selected');
    $('.ts_fjb-type').find('option[value="'+data['tipe']+'"]').attr('selected', 'selected');

    $('.ts_fjb-kondisi').find('option[selected="selected"]').removeAttr('selected');
    $('.ts_fjb-kondisi').find('option[value="'+data['kondisi']+'"]').attr('selected', 'selected');

    $('.ts_fjb-tags, .ts_fjb-type, .ts_fjb-kondisi, .ts_fjb-price').show();
  },
  set: function(value){
    this.content = value;
    // track latest scrollTop, doing val() might reset it to 0
    this.last_scrollTop = gID(gvar.tID).scrollTop;
    $('#'+gvar.tID).val(this.content);
    
    _TEXT.setRows_Elastic();
    _TEXT.init();

    this.saveDraft();
    this.pracheck();
  },
  wrapValue : function(tag, title){
    var st2, start=this.cursorPos[0], end=this.cursorPos[1],bufValue;
    tag = tag.toUpperCase();    
    bufValue = this.subStr(0, start) + 
      '['+tag+(title?'='+title:'')+']' + 
      (start==end ? '' : this.subStr(start, end)) + 
      '[/'+tag+']' + this.subStr(end, this.content.length);
    
    this.set(bufValue);
    st2 = (start + ('['+tag+(title?'='+title:'')+']').length);

    this.caretChk( st2, (st2+this.subStr(start, end).length) );
    return bufValue; 
  },
  add: function(text){ // used on fetch post only
    var newline = '\n\n';
    if( $('#'+gvar.tID).val() != "" )
      this.content+= newline;
    $('#'+gvar.tID).val( this.content + text );
    this.saveDraft();
    this.pracheck(false);
    
    gvar.$w.setTimeout(function(){
      _TEXT.lastfocus();
    }, 200);
  },
  // ptpos stand to puretext position [start, end]
  setValue : function(text, ptpos){
    var bufValue, start=this.cursorPos[0], end=this.cursorPos[1];
    if(isUndefined(ptpos)) ptpos=[text.length,text.length];
    if(start!=end) {
      this.replaceSelected(text,ptpos);
      return;
    }
    bufValue = this.subStr(0, start) + text + this.subStr(start, this.content.length);
    this.set(bufValue);
    this.caretChk( (start+ptpos[0]), (start+ptpos[1]) );
    return bufValue; 
  },
  replaceSelected : function(text, ptpos){
    var bufValue, start=this.cursorPos[0], end=this.cursorPos[1];
    if(start==end) return;    
    bufValue = this.subStr(0, start) + text + this.subStr(end, this.content.length);
    this.set(bufValue);
    this.caretChk( (start+ptpos[0]), (start+ptpos[1]) );
  },
  pracheck: function(foc){
    if( isUndefined(foc) )
      foc = true;
    
    _TEXT.setElastic(gvar.maxH_editor);
    if( $('#'+gvar.tID).val() !="" )
      $('#clear_text').show();
    else
      $('#clear_text').hide();
    if(foc) gvar.$w.setTimeout(function(){
      _TEXT.focus();
    }, 200);
  },
  focus: function(){ 
    $('#'+gvar.tID).focus() 
  },
  lastsroll: function (){
    // scroll to bottom of editor line
    !_TEXT.e && (_TEXT.e = $('#'+gvar.tID));
    _TEXT.e && _TEXT.e.scrollTop(_TEXT.e[0].scrollHeight);
  },
  lastfocus: function (){
    var eText, nl, pos, txt = String($('#'+gvar.tID).val()); // use the actual content
    pos = txt.length;
    nl = txt.split('\n');
    nl = nl.length;
    pos+= (nl * 2);
    eText = gID(gvar.tID);
    try{
      if( eText.setSelectionRange ) {
        _TEXT.focus();
        eText.setSelectionRange(pos,pos);
      }
    }catch(e){}
    gvar.$w.setTimeout(function(){ _TEXT.focus(); _TEXT.lastsroll() } , 310);
  },
  getSelectedText : function() {
    return (this.cursorPos[0]==this.cursorPos[1]? '': this.subStr(this.cursorPos[0], this.cursorPos[1]) );
  },
  getCaretPos : function() {  
    var CaretPos = 0;
    //Mozilla/Firefox/Netscape 7+ support   
    if(gID(gvar.tID))
      if (gID(gvar.tID).selectionStart || gID(gvar.tID).selectionStart == '0')
      CaretPos = gID(gvar.tID).selectionStart;
    return CaretPos;
  },  
  setCaretPos : function (pos,end){
    if(isUndefined(end)) end = pos;
    if(gID(gvar.tID).setSelectionRange)    { // Firefox, Opera and Safari
      this.focus();
      gID(gvar.tID).setSelectionRange(pos,end);
    }
  },
  setElastic: function(max,winrez){
    var a, tid=gvar.tID;
  
    function setCols_Elastic(max){
      var a=gID(tid); a.setAttribute("cols", Math.floor(a.clientWidth/7));
      var w = Math.floor(a.clientWidth/7);
      _TEXT.setRows_Elastic(max)
    }
    a= gID(tid) || gID(gvar.tID);
    _TEXT.oflow='hidden';
    a.setAttribute('style','visibility:hidden; overflow:'+_TEXT.oflow+';letter-spacing:0;line-height:14pt;'+(max?'max-height:'+(max-130)+'pt;':''));
    if( !winrez ) $('#'+tid).keyup(function(){ setCols_Elastic(max) });
    setCols_Elastic(max); //110
    //gvar.$w.setTimeout(function(){ setCols_Elastic(max)} , 110); //110
  },
  setRows_Elastic: function(max){
    var a = gID(gvar.tID), c=a.cols, b=a.value.toString(), h;
    b=b.replace(/(?:\r\n|\r|\n)/g,"\n");
    for(var d=2,e=0,f=0;f<b.length;f++){
      var g=b.charAt(f);e++;if(g=="\n"||e==c){d++;e=0}
    }
    h=(d*14); a.setAttribute("rows",d); a.style.height=h+"pt";
    _TEXT.oflow = (max && (d*14>(max-130)) ? 'auto':'hidden');
    a.style.setProperty('overflow', _TEXT.oflow, 'important');
    $('#'+gvar.tID).css('visibility', 'visible');
  }, /*134*/
  saveDraft: function(e){
    if(e && (e.ctrlKey || e.altKey) ) return true;
    var liveVal = $('#'+gvar.tID).val();
    if( $('#qrdraft').get(0) && liveVal && liveVal!=gvar.silahken ){
      _DRAFT.title('save');
      $('#qrdraft').html('Save Now').attr('data-state', 'savenow');
      _DRAFT.switchClass('gbtn');
      $('#draft_desc').html('');
      clearTimeout( gvar.sITryLiveDrafting ); 
      gvar.isKeyPressed=1;
      if( gvar.settings.qrdraft )
        _DRAFT.quick_check();
    }
  },
  caretChk: function(s,e){
    this.setCaretPos(s, e);
    // restore scrollTop on overflow mode:scroll
    if(this.last_scrollTop && _TEXT.overflow!='hidden')
      gID(gvar.tID).scrollTop = (this.last_scrollTop+1);
  }
};

/*
* object urusan textcount
* event keypress di textarea trigger this object
* to show remaining char
*/
var _TEXTCOUNT = {
  init: function( target ){
    var cUL, _tc = this;
    cUL = String(gvar.settings.userLayout.config).split(',');

    _tc.limitchar = (gvar.thread_type == 'group' ? 1000 : 10000);
    _tc.$editor = $('#'+gvar.tID);
    _tc.$target = ("string" == typeof target ? $(target) : target);
    _tc.preload_length = 0;
    if( cUL[1] == '1' ){
      _tc.preload_length = String(gvar.settings.userLayout.template).replace(/{message}/, '').length;
    }   

    if( _tc.$target.length ){
      if(_tc.preload_length > 0)
         _tc.$target.find('.preload').show().text(' (+'+_tc.preload_length+')');
      else
        _tc.$target.find('.preload').hide();


      _tc.$target = _tc.$target.find('.numero:first');
      _tc.$target.text(_tc.count_it(_tc));
    }
    _tc.do_watch(_tc);
  },
  count_it: function(_tc){
    return (_tc.limitchar - _tc.preload_length - _tc.$editor.val().length);
  },
  do_watch: function(_tc){
    gvar.sTryTCount = window.setInterval(function() {
      _tc.$target.text( _tc.count_it(_tc) );
    }, 600);
  },
  dismiss: function(){
    gvar.sTryTCount && clearInterval( gvar.sTryTCount );
  }
};

/*
* object urusan countdown
* next-post count-down
*/
var _CTDOWN = {
  init: function(num, tgt){
    if( !gvar.settings.txtcount )
      return;
    _CTDOWN.ori_title = $('title').text();
    
    if( !num ) num = gvar.postlimit;
    _CTDOWN.counter = num;
    _CTDOWN.target = tgt;
    _CTDOWN.target_title = $('title').get(0);
    
    if( !num || num < 0 || gvar.sITryCountDown ) return;
    
    _CTDOWN.rundown();
  },
  rundown: function(){
    if( _CTDOWN.counter > -1){
      $(_CTDOWN.target).html( parseInt(_CTDOWN.counter) );
      $(_CTDOWN.target_title).html( '[' + parseInt(_CTDOWN.counter) + '] ' + _CTDOWN.ori_title );
      
      gvar.sITryCountDown = setTimeout(function(){ _CTDOWN.rundown() }, 1005);
      _CTDOWN.counter--;
    }else{
      clearTimeout(gvar.sITryCountDown);
      
      $(_CTDOWN.target_title).html( _CTDOWN.ori_title );
      if( gvar.user.isDonatur ) return;
      
      // autopost
      var box = 'body > #modal_capcay_box';
      if( $(box).is(':visible') 
        && $(box).find('#recaptcha_response_field').val()!="" 
        && !$(box).find('#box_post').hasClass('jfk-button-disabled')
      ){
        gvar.$w.setTimeout(function(){
          $(box).find('#box_post').click();
        }, 500);
      }
    }
  }
};

/*
* object urusan draft
* event check for any change in textarea to keep it drafted
*/
var _DRAFT= {
  el: null, dsc: null
  ,_construct: function(){
    _DRAFT.el = $('#qrdraft');
    _DRAFT.dsc= $('#draft_desc');
  }
  

  ,check: function(){
    clog('checking draft..');
    if( _DRAFT.el.get(0) && _DRAFT.el.attr('data-state')=='idle'){
      gvar.timeOld = new Date().getTime();
      clearInterval(gvar.sITryKeepDrafting);
      // default interval should be 120 sec || 2 minutes (120000)
      gvar.sITryKeepDrafting= window.setInterval(function() { _DRAFT.check() }, 120000);
    }

    var tmp_text= $('#'+gvar.tID).val(), timeNow=new Date().getTime()
    ,selisih=(timeNow-gvar.timeOld), minuten=Math.floor(selisih/(1000*60));

    if( _DRAFT.provide_draft() ) return false;
    if( tmp_text==gvar.silahken || tmp_text=="") return false;

    // any live change ? 
    if( isDefined(gvar.isKeyPressed) )
      _DRAFT.save();
    else
      _DRAFT.dsc.html( (minuten > 0 ? 'Last saved ' + minuten + ' minutes' : 'Saved seconds') + ' ago' );
  }
  ,provide_draft: function(){
    var tmp_text= $('#'+gvar.tID).val();
    if(tmp_text=="") {
      var blank_tmp = (gvar.tmp_text == "");
      _DRAFT.el.html('Draft').attr('data-state', 'idle');;
      _DRAFT.title( blank_tmp ? '' : 'continue');
      _DRAFT.switchClass( blank_tmp ? 'jfk-button-disabled' : 'gbtn');
      _DRAFT.dsc.html( blank_tmp ? 'blank' : '<a href="javascript:;" id="clear-draft" title="Clear Draft">clear</a> | available');
      $('#clear-draft').click(function(){ _DRAFT.clear() });
      if( !blank_tmp ) return true;
    }
    return false;
  }
  ,title: function(mode){
    var t = (mode=='save' ? 'Save Now' : (mode=='continue' ? 'Continue Draft' : '') );
    if(t!='') 
      _DRAFT.el.attr('title', t+' [Ctrl+Shift+D]');
    else
      _DRAFT.el.removeAttr('title');
  }
  ,save: function(txt){
    _DRAFT.switchClass('jfk-button-disabled');
    if( isUndefined(txt) ){
      _DRAFT.el.html('Saving ...').attr('data-state','saving');
      _DRAFT.title();
      window.setTimeout(function() { _DRAFT.save( $('#'+gvar.tID).val() )}, 600);
      return;
    }else{
      gvar.tmp_text = txt.toString();
      setValue(KS+'TMP_TEXT', gvar.tmp_text);
      _DRAFT.el.html('Saved').attr('data-state','saved');;
      _DRAFT.dsc.html('Saved seconds ago');
      if( isDefined(gvar.isKeyPressed) ) delete gvar.isKeyPressed;
    }
    gvar.timeOld = new Date().getTime();
  }
  ,clear: function(txt){
    gvar.tmp_text = '';
    setValue(KS+'TMP_TEXT', gvar.tmp_text);
    _DRAFT.title('continue');
    _DRAFT.el.html('Draft');
    _DRAFT.switchClass('jfk-button-disabled');
    _DRAFT.dsc.html('blank');
  }
  ,quick_check: function(){
    gvar.$w.setTimeout(function(){ _DRAFT.provide_draft() }, 300);
    gvar.sITryLiveDrafting = gvar.$w.setTimeout(function() { _DRAFT.check() }, 5000); // 5 sec if any live change
  }
  ,switchClass: function(to_add){
    var to_rem = (to_add=="gbtn" ? "jfk-button-disabled" : "gbtn" );
    _DRAFT.el.addClass(to_add).removeClass(to_rem);;
  }
  
};

/*
* object urusan uploader
* kaskus & custom uploader
*/
var _UPL_ = {
  init: function(){
    _UPL_.tcui = 'tabs-content-upl-inner';
    _UPL_.self = 'box-upload';
    _UPL_.sibl = 'box-smiley';
    _UPL_.def  = 'kaskus';
    
    _UPL_.main();
  },
  menus: function(){
    var idx=0, ret='', spacer='<div style="height:1px"></div>';
    if( gvar.upload_sel ){
      ret+=''
        +'<li><div style="padding-left:30px;"><b>:: Services :: </b></div></li>'
        +'<li>'+spacer+'</li>'
        +'<li class="qrt curent"><div id="tphost_0" title="kaskus.us" data-host="kaskus">kaskus</div></li>'
      ;
      for(host in gvar.upload_sel){
        ret+='<li class="qrt"><div id="tphost_'+(idx+1)+'" title="'+gvar.upload_sel[host]+'" data-host="'+host+'">' + host + ' <a class="externurl right" title="Goto this site" target="_blank" href="http://'+gvar.upload_sel[host]+'"><i class="icon-resize-full"></i></a></div></li>';
        idx++;
      }
    }
    return ret;
  },
  event_menus:function(){
    $('#tabs-content-upl .qrt').each(function(){
      $(this).click(function(e){
        if( (e.target||e).nodeName === 'DIV' ){
          var subtpl, ch= $(this).find('div:first'), id, lbl, gL, host;
          id = ch.attr('id').replace(/tphost_/gi,'');
          host = ch.attr('data-host');
          _UPL_.switch_tab( host );
          
          $(this).closest('#ul_group').find('.curent').removeClass('curent');
          $(this).addClass('curent');
        }
      });
    });
    $('#toggle-sideuploader').click(function(){
      var el, uc, ucs, todo = $(this).attr('data-state'), wleft=131;
      ucw = parseInt( $('#uploader_container').css('width').replace(/px/,'') );
      el = $(this).closest('.wraper_custom').find('.cs_left');
      uc = '#uploader_container';
      if(todo=='hide'){
        $(el).hide();
        $(uc).css('width', ucw + wleft ).css('max-width', ucw + wleft );
      }else{
        $(el).show();
        $(uc).css('width', ucw - wleft ).css('max-width', ucw - wleft );
      }
      $(this).html( HtmlUnicodeDecode(todo=='hide' ? '&#9658;' : '&#9664;') );
      $(this).attr('data-state', todo=='hide' ? 'show' : 'hide' );
    });
  },
  tplcont: function(host){
    return '<div id="content_uploader_'+host+'" class="content_uploader" style="display:none" />';
  },
  main: function(){
    var tpl='', iner = _UPL_.tcui;

    $('#'+iner).html( rSRC.getTPLUpload( _UPL_.menus() ) );
    _UPL_.event_menus();
    
    tpl = _UPL_.tplcont(_UPL_.def);
    for(host in gvar.upload_sel)
      tpl+=_UPL_.tplcont(host);
      
    $('#'+iner+' #uploader_container').html( tpl );
    _UPL_.switch_tab(_UPL_.def);
    
    $('.'+_UPL_.self).addClass('events');
    _UPL_.toggletab(true);
  },
  switch_tab: function(target){
    if( !target ) return;
    var tpl, tgt = 'content_uploader_'+ target;
    
    if( $('#'+tgt).html()=='' ){
      if(target ==_UPL_.def){
        
        tpl = ''
          +'<div id="preview-image-outer">'
          + '<div id="preview-image" />'
          +'</div>'
          +'<div id="loading_wrp" style="display:none"><div class="mf-spinner chrome-spinner-delay" id="upl_loading" /></div>'
          +'<div id="image-control" class="">'
          + '<div class="clickthumb" style="display:none">*Click thumbnail image to add to post content</div>'
          + '<input type="file" onchange="ajaxFileUpload();" name="forumimg" id="browse" class="small white"/>'
          +'</div>'
        ;
        $('#' + tgt ).html( tpl );
        inteligent_width();

        GM_addGlobalScript( gvar.kkcdn + 'themes_2.0/js/ajaxfileupload.js' );
        GM_addGlobalScript( rSRC.getSCRIPT_UPL() );
        
        $('#'+_UPL_.tcui+' #preview-image').bind('DOMNodeInserted DOMNodeRemoved', function(ev) {
          if( ev.type == 'DOMNodeInserted' ){
            $('#'+_UPL_.tcui+' .preview-image-unit').each(function(){
              var P=$(this), T = P.find('img'), tc='modal-dialog-title-close';
              if( P.hasClass('event') ) return;

              P.find('img').click(function(){ do_smile( $(this) ) });
              P.find('.'+tc).click(function(){
                if(confirm('Agan yakin mau delete gambar ini?')){
                  $(this).closest('.preview-image-unit').remove();
                  inteligent_width('remove');
                }
              });
              P.addClass('event');
            });
            inteligent_width('insert');
          }
        });
      }else
      {
        var ifname = 'ifrm_' + gvar.upload_sel[target].replace(/\W/g,'');
        tpl=''
          +'<a style="position:absolute; top:10px; right:20px; height:16px; width:50px; border:0; font-weight:normal" href="javascript:;" id="ifrm_reload_'+target+'" data-src="'+gvar.uploader[target]['src']+'">reload</a>'
          +'<div style="margin:10px 3px 15px 30px; display:inline-block;">'
          +'<a target="_blank" title="Goto '+ target +'" href="http://'+gvar.upload_sel[target]+'"><b>http://' + gvar.upload_sel[target] + '</b></a>'
          +'</div>'
          +'<ifr'+'ame id="'+ ifname +'" src="http://'+ gvar.uploader[target]['src'] +'" style="width:100%; height:300px"></if'+'rame>'
        ;
        $('#'+tgt).html( tpl );
        
        $('#ifrm_reload_'+target).click(function(){
          var itgt = $(this).attr('id').replace(/ifrm_reload_/,''), _src = $(this).data('src');
          $('#' + 'ifrm_' + gvar.upload_sel[itgt].replace(/\W/g,'') ).attr('src', 'http://' + _src);
        });
        
      }
    }
    $('#' + tgt).parent().find('.content_uploader.curent').removeClass('curent').hide();
    $('#' + tgt).addClass('curent').show()
  },
  toggletab: function(show){
    var bu='.'+_UPL_.self, bb='.box-bottom';
    if(show){
      $(bu + ', ' + bb).show();
      $('.'+_UPL_.sibl).hide();
    }else{
      $(bu + ', ' + bb).hide();
    }
  }
};

/*
* object urusan smilies
* kecil-besar-custom will be maintained here
*/
var _SML_ = {
  init: function(def){
    _SML_.tci = 'tabs-content-inner';
    _SML_.tch = 'tab-content-hidden';
    _SML_.self = 'box-smiley';
    _SML_.sibl = 'box-upload';
    if( !def ) def = 'tabs-sb-tkecil';

    _SML_.init_container();
    _SML_.load_smiley( def );
  },
  init_container: function(){
    var cL, tgt = $('#' + _SML_.tci), conts = ['tabs-sb-tkecil', 'tabs-sb-tbesar', 'tabs-sb-tcustom'];
    cL = conts.length; $(tgt).html('');
    for(var i=0; i< cL; i++)
      $(tgt).append('<div id="'+conts[i]+'" class="sml_main" style="display:none" />');
  },
  init_scustom: function(target, smilies){
    // smiley custom thingie
    $('#'+target).html( rSRC.getTPLCustom( _SML_.menus_scustom() ) );
    var gruptpl, tpl = '', idx=0;
    tpl = ''
      +'<input type="hidden" id="current_grup" value="'+ (gvar.smgroup && gvar.smgroup.length > 0 ? gvar.smgroup[0] : '') +'" />'
      +'<input type="hidden" id="current_order" value="'+ (gvar.smgroup ? '0':'') +'" />'
      +'<input type="hidden" id="scustom_todo" value="" />'
      +'<input type="hidden" id="scustom_todel" value="" />'
    ;
    $('#custom_bottom').append( tpl );
    if( gvar.settings.scustom_noparse )
        $('#scustom_noparse').attr('checked', true);
    
    // container rightside: #scustom_container
    gruptpl='<select id="pos_group_sets" tabindex="505" style="width: 50px;" class="gbtn">';
    tpl = '';
    
    for(grup in smilies){
      tpl+= '<div id="content_scustom_container_'+ grup +'" class="content_scustom" style="display:none"></div>';
      gruptpl+= '<option value="'+idx+'">'+ (idx + 1) +'</option>';
      idx++;
    }
    gruptpl+='</select>';
    
    if( tpl ){
      $('#scustom_container').html( tpl ).show();
      $('#position_group').html( gruptpl );
      $('#manage_help, #manage_cancel, #dv_menu_disabler').hide();
      $('#custom_bottom, #title_group').show();
    }
    
  },
  menus_scustom: function(){
    var gL, ret, spacer='<div style="height:1px"></div>';
    
    ret='<li class="qrt_first">'+spacer+'</li>'
      +'<li class="qrt add_group"><div class="add_group">Add Group</div></li>'
      +'<li>'+spacer+'</li>';
    ;
    if( gvar.smgroup && gvar.smgroup.length > 0 ){
      gL = gvar.smgroup.length;
      for(var i=0; i<gL; i++){
        ret+=''
          +'<li class="qrt'+(i==0 ? ' curent':'')+'"><div id="tbgrup_'+i+'" title="'+gvar.smgroup[i].replace(/_/g, ' ')+'">'
          + gvar.smgroup[i] +'<span class="num">'+(i+1)+'</span></div></li>';
      }
      ret+='<li class="qrt_first">'+spacer+'</li>';
    }
    return ret;
  },

  save_scustom: function(buf){

    setValue(KS+'CUSTOM_SMILEY', buf);

    (function(){
      gvar.settings.scustom_noparse = $('#scustom_noparse').is(':checked');
      setValue(KS+'SCUSTOM_NOPARSE', gvar.settings.scustom_noparse ? "1" : "0");
      
      // cold-boot
      var last_mod = parseInt($('#pos_group_sets').val());
    
      $('#tabs-sb-tcustom').html('');
      
      rSRC.getSmileySet(true, function(){
        var tbcustom = 'tabs-sb-tcustom';
        _SML_.init_scustom(tbcustom, gvar.smcustom);
        _SML_.event_scustom();
        
        _SML_.refresh_menus();
        
        if( $('#tbgrup_' + last_mod ).get(0) )
          $('#tbgrup_' + last_mod ).click();
        else
          $('#tbgrup_0').click();
      });
    })();
  },
  event_menus: function(){
    // add_group
    $('li.add_group').click(function(){
      var rnd = Math.random().toString();
      rnd = rnd.replace(/0\./g, '').substring(0, 3);
      $(this).addClass('curent');

      $('#label_group').html('Add Group');
      $('#manage_btn').html('Save');
      $('#textarea_scustom_container').val('').height(100);
      $('#input_grupname').val('untitled_' + rnd);

      $('#manage_help, #manage_cancel, #custom_bottom, #custom_addgroup_container, #dv_menu_disabler').show();
      $('#scustom_container, #title_group').hide();
      $('#delete_grupname').hide();
      $('#label_group').click();
      $('#scustom_todo').val('add');
    });
    // menus only
    $('#tabs-sb-tcustom .qrt').each(function(){
      if( !$(this).hasClass('add_group') )
       $(this).click(function(){

        var retEl, subtpl, ch= $(this).find('div:first'), id, lbl, gL, grup, islink;
        var uesc = function(txt){ return unescape(txt) };
        id = ch.attr('id').replace(/tbgrup_/gi,'');
        grup = gvar.smgroup[id];
        if( $('#content_scustom_container_'+grup).get(0) ){
          $('#scustom_container').find('.content_scustom.curent').removeClass('curent').empty().hide();
          $('#content_scustom_container_'+grup).addClass('curent').show();
        }
        $('#current_grup').val( grup );
        $('#current_order').val( id );
        $('#title_group').html( grup.replace(/_/g, ' ') );
        $(this).closest('#ul_group').find('.curent').removeClass('curent');
        $(this).addClass('curent');

        if( !gvar.smcustom ) rSRC.getSmileySet( true );
        if( gvar.smcustom && gvar.smcustom[grup] ){
          subtpl = ''; gL = gvar.smcustom[grup].length
          for(var k=0; k<gL; k++){
            
            if( !isString(gvar.smcustom[grup][k]) ){
              clog( gvar.smcustom[grup][k][0] )
              if( isLink( gvar.smcustom[grup][k][0] ) != null ){
                islink = 1;
                subtpl+='<img src="'+ gvar.smcustom[grup][k][0] +'" alt="_alt_'+ gvar.smcustom[grup][k][1] +'" title="[['+ gvar.smcustom[grup][k][1] + '] &#8212;' + gvar.smcustom[grup][k][0] +'" /> ';
              }else{
                try{
                  subtpl+= '<span title="[['+ gvar.smcustom[grup][k][1] +'] '+ HtmlUnicodeDecode('&#8212;') +' '+ uesc( gvar.smcustom[grup][k][0] ) +'" class="nothumb">'+ uesc( gvar.smcustom[grup][k][0] ) +'</span>' + ' ';
                }catch(e){}
              }
            }else{
            
              retEl = validTag( gvar.smcustom[grup][k], true, 'view' );
              if( !retEl ) continue;
              if( !/<br\s?\/?>/.test(retEl) ){
                if( subtpl!='' )
                  subtpl+= '<br/>';
                subtpl+= retEl + '<br/>';
              }else{
                subtpl+= retEl;
              }
            }
          }
          $('#content_scustom_container_'+grup).html( subtpl );
          _SML_.event_img('#'+_SML_.tci+' #tabs-sb-tcustom', 'tcustom');
        }
      
      });
    });
  
  },
  event_scustom: function(){
    
    $('#label_group').click(function(){
      gvar.$w.setTimeout(function(){ $('#input_grupname').focus() }, 100);
    });   
    $('#input_grupname').focus(function(){
      $(this).select()
    }).keydown(function(ev){
      if(ev.keyCode==13){
        do_an_e(ev);
        $('#manage_btn').click();
      }else if(ev.keyCode==27){
        $('#manage_cancel').click()
      }
    });
    
    // help
    $('#manage_help').click(function(){
      var nn="\n";
      alert('Each Smiley separated by newline.'+nn
        +'Format per line:'+nn
        +' tag|smileylink_or_autotext'+nn
        +''+nn
        +' eg.'+nn
        +'bersulang|'+ gvar.kkcdn +'images/smilies/sumbangan/smiley_beer.gif'+nn
        +( !gvar.settings.scustom_noparse ? ''
        +''+nn
        +'In that case, you can use custom smiley BBCODE with this format:'+nn
        +'[[bersulang]'+nn
        :'' )
      );
    });
    // cancel
    $('#manage_cancel').click(function(){
      $('li.add_group').removeClass('curent');
      
      $('#manage_help, #manage_cancel, #custom_addgroup_container, #dv_menu_disabler, #position_group').hide();
      $('#scustom_container, #title_group').show();
      
      if( gvar.smgroup.length > 0 ){
        $('#manage_btn').html('Manage');
        $('#custom_bottom').show();
      }else{
        $('#custom_bottom').hide();
      }
      
    });
    // manage | save
    $('#manage_btn').click(function(){
      var task = $(this).html().toLowerCase();

      if(task=='save'){
        var grupname, todo, niubuf, cleanGrup = function(){
          return trimStr( $('#input_grupname').val().replace(/[^a-z0-9]/gi,'_').replace(/_{2,}/g,'_') );
        }
        grupname = cleanGrup();
        todel = ($('#scustom_todel').val() == grupname);

        // needed to filter text to saved from smiley-custom
        var do_filter_scustom = function (text){
          var buf = text;
          if( buf!='' ){
            var re, sml, bL, sepr, retbuf='',  done = false;
            var tosingle = {
              '\\|{2,}' : '|'
              ,'(\\r\\n){2,}' : '\r\n{sctag:br}\r\n,'
              ,'(\\n){2,}' : '\n{sctag:br}\n'
            };
            // step -1 to strip
            buf = buf.replace(/[\[\]\,]/g,"");
            
            //clog('step-to single');
            for(var torep in tosingle){
              if(!isString(tosingle[torep])) continue;
              re = new RegExp(torep, "g");
              buf = buf.replace(re, tosingle[torep])
            }
            buf=(document.all ? buf.split("\r\n") : buf.split("\n")); // IE : FF/Chrome
            
            bL=buf.length;
            sepr = ','; // must be used on extracting from storage
            for(var line=0; line<bL; line++){
              if( !isString(buf[line]) ) continue;
              buf[line] = trimStr ( buf[line] ); // trim perline
                //clog('line='+line+'; val='+buf[line]);
              sml = /([^|]+)\|([\w\W]+)/.exec( buf[line] );
              if(sml && isDefined(sml[1]) && isDefined(sml[2]) ){
                // smiley thingie ?
                //clog('sml[0]='+sml[0]+'; sml[1]='+sml[1]+'; sml[2]='+sml[2]);
                retbuf+=sml[1]+'|' + ( /^https?\:\/\/.+$/i.test(sml[2]) ? sml[2] : escape(sml[2]) ) + sepr;
              }else if(sml=validTag( buf[line], false, 'saving' ) ){
                // valid tag ?
                //clog('saving-valid tag ?; ' + sml);
                retbuf+=sml+sepr;
              }
              done=true;
            } // end for    
          }
          return retbuf;
        }
        
        if( niubuf = $('#textarea_scustom_container').val() )
          niubuf = do_filter_scustom( trimStr(niubuf) );

        if( trimStr(grupname)=='' ){
          alert('Group Name can not be empty');
        }else if( !niubuf ){
          alert('Invalid tag and\/or smiley format');
        }else{
          //save custom smiley
          (function remixBuff(niubuf, todel){
            var ret='', curG, oldOrder, curOrder, todo, sEL, nOrder;
            todo = $('#scustom_todo').val();

            if( !niubuf )
              _SML_.save_scustom( false )
  
            if(todo == 'add' && gvar.smcustom[grupname] ){
              alert('Group Name is already exists');
              _SML_.save_scustom( false )
            }else if(todo == 'edit'){
              
              curOrder = $('#current_order').val();
              oldOrder = (curOrder ? curOrder : "");
              curG = [(curOrder ? curOrder : ""), $('#current_grup').val()];
              nOrder = $('#pos_group_sets option:selected').val();

              // reorder-group (manage | not add)
              if(curG[0]!="" && nOrder!=curG[0] && gvar.smgroup){
                var tomove = gvar.smgroup[curG[0]], newGrup=[];
                gvar.smgroup[curG[0]] = null;
                if(nOrder > curG[0])
                  gvar.smgroup.splice( curG[0], 1);
                
                gvar.smgroup.splice( nOrder, 0, tomove);
                // rescan dah .. 
                for(var i=0; i<gvar.smgroup.length; i++)
                  if(gvar.smgroup[i]) newGrup.push(gvar.smgroup[i]);
                gvar.smgroup = newGrup;
                //return;
              }
            }

            // good togo
            var ch_grup, tmp_SML = {}, grlen, degrup, joined;
            (function( _CS ){
              var curOrder, curG, cparts = (_CS ? _CS.split('<!>') : []), cprL = cparts.length;
              if( cprL ) for(var n=0; n<cprL; n++ ){
                part = cparts[n].split('<!!>');
                tmp_SML[ String(part[0]) ] = String( part[1] );
              }
              grlen = (gvar.smgroup ? gvar.smgroup.length : 0);
              
              
              if( todo == 'edit' ){
                curOrder = $('#current_order').val();
                curG = [(curOrder ? curOrder : ""), $('#current_grup').val()];
                ch_grup=(curG[1]!='' && grupname!='' && grupname!=curG[1] );
                
                for(var k=0; k<grlen; k++ ){
                  degrup = gvar.smgroup[k].toString();
                  if( degrup==curG[1] ){
                    if( todel ){
                      grupname = false;
                    }else{
                      tmp_SML[ degrup ] = niubuf.toString();
                      grupname = trimStr( ch_grup ? cleanGrup() : curG[1] ).replace(/\!/g,'\\!');
                    }
                  }else{
                    grupname = degrup;
                  }
                  ret+=(grupname ? grupname.toString()+'<!!>'+tmp_SML[degrup]+( (k+1) < grlen ? '<!>':'') : '');
                }
                // end for
              }
              else{
                joined = false;
                if(gvar.smgroup) for(var k=0; k<grlen; k++){
                  degrup = gvar.smgroup[k].toString();
                  joined=joined || ( degrup==grupname );
                  ret+= degrup+'<!!>'+tmp_SML[ degrup ] +(joined ? niubuf.toString():'') + ( (k+1) < grlen ? '<!>':'');
                }
                if(!joined) ret+='<!>'+ grupname.toString() +'<!!>'+ niubuf.toString();
              }
              _SML_.save_scustom(ret)
            })( getValue(KS + 'CUSTOM_SMILEY') );

          })(niubuf, todel);
          // end remixBuff
        }
      }
      else if(task=='manage'){

          $(this).html('Save');
          $('label_group').html('Group');
          $('#scustom_todo').val('edit');
          $('#manage_help, #manage_cancel, #custom_bottom, #custom_addgroup_container, #dv_menu_disabler, #position_group, #delete_grupname').show();
          $('#scustom_container, #title_group').hide();
          
          var gid, grupname = $('#current_grup').val(), buff_edit='';
          $('#input_grupname').val( grupname );
          gid = $('#current_order').val();
          // pos_group_sets
          $('#pos_group_sets option[value='+gid+']').attr('selected', 'selected');
          
          (function(retcs){
            var cparts = retcs.split('<!>'), cprL = cparts.length;
            for(var n=0; n<cprL; n++){
              part = cparts[n].split('<!!>');
              if( grupname==part[0] ){
                buff_edit = unescape( String( part[1] ).replace(/,/g, '\n').replace(/{sctag\:br}/g, '') );
              }
            }
            $('#textarea_scustom_container').val( buff_edit );
            $('#input_grupname').focus();
          })( getValue(KS + 'CUSTOM_SMILEY') );
        }
    });
    
    $('#delete_grupname').click(function(){
      var cGrp = $('#current_grup').val();
      if( confirm('You are about to delete this Group.\n'+'Name: '+cGrp+'\n\nContinue delete this group?\n') ){
        $('#scustom_todel').val( cGrp );
        $('#manage_btn').click();
      }
    });
    
    $('#textarea_scustom_container, #delete_grupname, #manage_help').keydown(function(ev){
      var land_id, tid, A = ev.keyCode || ev.keyChar;
      tid = $(this).attr('id');
      if( tid=='manage_help' ){
        if( $('#pos_group_sets').is(':visible') )
          return true;
        else
          land_id = '#input_grupname';
      }else{
        land_id = (tid == 'delete_grupname' ? '#input_grupname' : '#manage_btn');
      }
      
      if(A === 9){
        do_an_e(ev);
        gvar.$w.setTimeout(function(){ $(land_id).focus() }, 50);
      }
    });
    
    _SML_.event_menus();
  },
  
  
  event_img: function(tgt, label){
    $(tgt + ' img').each(function(){
      $(this).click(function(){ do_smile( $(this) ) })
    });
    $(tgt + ' span').each(function(){
      $(this).click(function(){ do_smile( $(this) ) })
    });
    _SML_.setClassEvents(label);
  },
  setClassEvents: function(label){
    var tabs=['tkecil', 'tbesar', 'tcustom'], tL = tabs.length;
    for(var i=0; i<tL; i++)
      $('.'+_SML_.self).removeClass('events-' + tabs[i]);
    $('.'+_SML_.self).addClass('events-'+label);
  },

  refresh_menus: function(){
    $('#ul_group').html( _SML_.menus_scustom() );
    _SML_.event_menus();
  },
  load_smiley: function(target){
    if( !gvar.smbesar || !gvar.smkecil || !gvar.smcustom )
      rSRC.getSmileySet();
    if(!target) target = 'tabs-sb-tkecil';
    
    if( !$('#' + target).hasClass('filled') ){
    
      var label, smilies, tpl='', tci = _SML_.tci, tch = _SML_.tch;
      label = target.replace('tabs-sb-', '');
      smilies = (label == 'tkecil' ? gvar.smkecil : (label=='tbesar' ? gvar.smbesar : gvar.smcustom) );
      $('.'+_SML_.self).append('<div id="'+target+'" class="'+tch+'"></div>');
      gvar.$w.setTimeout(function(){
        if( target!='tabs-sb-tcustom' ){
          $.each(smilies, function(i, img){
            tpl+= '<img src="'+ gvar.kkcdn + 'images/smilies/' + img[0] +'" alt="'+ img[1] +'" title="'+ img[1] + ' &#8212;' + img[2] +'" /> '
          });
          $('#'+target).html( tpl );
          _SML_.event_img('#' + target, label);
        }else{
          
          _SML_.init_scustom(target, smilies);
          _SML_.event_scustom();
          $('#tbgrup_0').click();
        }
        if( $('#' + target).html != '' )
          $('#' + target).addClass('filled');
        _SML_.switch_tab( target );
      }, 1);
      // klo dah keload semua termuat di #tabs-content-inner
    }else{
      // sumthin like switch only
      _SML_.switch_tab( target );
    }
  },
  switch_tab: function(target){
    if( $('#' + target).html() == "" ){

      //$('#' + target).removeClass('filled');

      _SML_.load_smiley(target);
      return;
    }
    $('#' + _SML_.tci).find('.active').removeClass('active').hide();
    $('.'+_SML_.self+' #tabs-loader').hide();
    $('#' + target).addClass('active').show();
  
  },
  toggletab: function(show){
    var bs='.'+_SML_.self, bb='.box-bottom';
    if(show){
      $(bs + ', ' + bb).show();
      $('.'+_SML_.sibl).hide();
      if($('.box-smiley .goog-tab-selected').get(0))
        $('.box-smiley .goog-tab-selected').click();
      else
        $('#tkecil').click();
    }else{
      $(bs + ', ' + bb).hide();
    }
  }
};

/*
* object urusan settings
* design s/d events & reset-settings
*/
var _STG = {
  e:{
     dialogname: 'qr-modalBoxFaderLayer'
    ,boxsetting: 'modal_setting_box'
  },
  init:function(){
    close_popup();
    $('body.forum').addClass('hideflow');
    _STG.main();
  },
  main:function(){
    $('#'+_STG.e.dialogname)
      .css('visibility', 'visible')
      .show();
    $('body').prepend( rSRC.getTPLSetting() );
    
    _STG.design();
    
    myfadeIn( $('#'+_STG.e.boxsetting), 130, function(){
      _STG.event_main()
    });   
    resize_popup_container(650);
  },
  design:function(){
    var mnus, mL, idx=0, tpl = '';
    mnus = {
       gen:  ['General', rSRC.getTPLGeneral()]
      ,exim: ['Export \/ Import', rSRC.getTPLExim()]
      ,kbs:  ['Keyboard Shortcut', rSRC.getTPLShortcut()]
      ,abt:  ['About', rSRC.getTPLAbout()]
    };
    mL = 4; // banyak tab
    tpl='<ul id="ul_group" class="qrset_mnu settingmnu">'
    $('#qr-box_setting .cs_right').html('');
    for(tipe in mnus){
      if(typeof tipe!='string') continue;
      
      tpl+= '<li data-ref="'+tipe+'" class="qrt'+(idx==0 ? ' curent': (idx==(mL-1) ? ' qrset_lasttab' : '')) +'"><div>'+mnus[tipe][0]+'</div></li>';
      $('#qr-box_setting .cs_right').append('<div class="stg_content'+(idx==0 ? ' isopen':'')+'" id="stg_content_'+tipe+'" style="display:none;">'+ (mnus[tipe][1] ? mnus[tipe][1] : '') +'</div>');
      idx++;
    }
    tpl+='</ul>'
    $('#qr-box_setting .cs_left').html( tpl );
    $('#qr-box_setting .st_contributor').scrollTop(0);
    $('#modal_setting_box .modal-dialog-title-text').css('left', '0');
  },
  event_main:function(){
    // menus
    $('#qr-box_setting .qrt').each(function(){
      $(this).click(function(){
        var btn, disb, par, tipe = $(this).attr('data-ref');
        par = $(this).parent();
        $('#qr-box_setting').find('.isopen').removeClass('isopen').hide();
        $('#stg_content_' + tipe).addClass('isopen').show();
        $(this).parent().find('.curent').removeClass('curent');
        $(this).addClass('curent');
        $('#box_preview_subtitle').html( ' ' + '&#187; ' +  $(this).find('div').html() );
        
        disb = 'jfk-button-disabled';
        btn = $('#box_action');
        btn.html('Save');
        if(tipe == 'exim'){
          if( !$('#textarea_rawdata').val() )
            _STG.load_rawsetting();
          $(btn).html('Import').removeClass(disb).attr('data-act', 'import');
        }else if(tipe == 'gen'){
          $(btn).removeClass(disb).attr('data-act', 'update');
        }else{
          $(btn).addClass(disb).attr('data-act', 'none');
        }
        $(btn).attr('data-todo', tipe);
      });
    });
    $('#qr-box_setting .optchk').each(function(){
      $(this).click(function(){
        var $tgt, chked, id = $(this).attr('id');
        chked = $(this).is(':checked');
        $tgt = $(this).closest('.stg_content').find('#'+id + '_child');

        if( $tgt.length ) {
          $tgt.css('display', chked ? 'block' : 'none' );
          if(id == 'misc_autolayout'){
            $('#edit_tpl_cancel').css('display', chked ? '' : 'none' );
            chked && $('#edit_tpl_txta').focus().select();
          }
        }
      });
    });
    $('#edit_tpl_cancel').click(function(){
      $('#misc_autolayout').removeAttr('checked').click().removeAttr('checked')
    });
    $('#qr-box_setting .goog-tab').each(function(){
      var id, $T = $(this);
      $T.hover(
        function(){$(this).addClass('goog-tab-hover')},
        function(){$(this).removeClass('goog-tab-hover')}
      );
      $T.click(function(){
        var $par = $(this).parent();
        $par.find('.goog-tab-selected').removeClass('goog-tab-selected');
        $(this).addClass('goog-tab-selected');
        $par.parent().find('.itemkbd').each(function(){
          var $me = $(this);
          if($me.hasClass('active')){
            $me.removeClass('active').hide();
          }
          else{
            $me.addClass('active').show();
          }
        });
      });
    });

    var val, pval, isChk = function(x){ return $(x).is(':checked') };
    $('#box_action').click(function(){

      if( $(this).attr('data-act') == 'update' ){
        var misc, reserved_CSA, tpltext, errMsg='', isError = 0;

        var restore_save = function(){
          $('#box_action').html('Save').removeClass('jfk-button-disabled');
          return false;
        };
        
        // box_action
        $('#box_action')
          .html('Saving..')
          .addClass('jfk-button-disabled');

        // validate
        pval = ( isChk('#misc_autolayout') ? '1' : '0' );
        tpltext = trimStr( $('#edit_tpl_txta').val().toString() );
        if( tpltext == "" )
          tpltext = '[B]{message}[/B]';

        if( pval && tpltext.toLowerCase().indexOf('{message}') != -1 ){
          gvar.settings.userLayout.config = ('0,' + pval).toString();
          setValueForId(gvar.user.id, gvar.settings.userLayout.config, 'LAYOUT_CONFIG'); //save layout
          gvar.settings.userLayout.template = val = tpltext;
          setValueForId( gvar.user.id, encodeURIComponent(val), 'LAYOUT_TPL', ['<!>','::'] );
        }else{
          isError = 1;
          errMsg = 'Invalid Layout format.\nCan\'t find "{message}" in template.\n\neg. [B]{message}[/B]';
        }
        
        if( isError && pval ){
          alert(errMsg);
          return restore_save();
        }
        
        // =============
        
        // QR_HOTKEY_KEY QR_HOTKEY_CHAR
        var oL, value, el, Chr;
        if( isChk( $('#misc_hotkey')) ){
          misc = ['misc_hotkey_ctrl','misc_hotkey_shift','misc_hotkey_alt'];    
          reserved_CSA = [(!gvar.isOpera ? '0,0,1' : '1,0,1'), '1,1,0']; /* Alt+Q OR Ctrl+Alt+Q -- Ctrl+Shift+Q */
          oL = misc.length;
          value = [];
          for(var id=0; id<oL; id++){
            if( !isString(misc[id]) ) continue;
            value.push( isChk( $('#'+misc[id]) ) ? '1' : '0' );
          }
          Chr = $('#misc_hotkey_char').val().toUpperCase();
          if( Chr=='Q' && (reserved_CSA[0]==String( value ) || reserved_CSA[1]==String( value )) ){ // bentrok        
            if( confirm('Hotkey is already reserved:\n ['+(!gvar.isOpera ? 'Alt + Q':'Ctrl + Alt +Q')+'] : Fetch Quoted Post\n [Ctrl + Shift + Q] : Deselect Quote\n\nDo you want to make a correction?') )
              return restore_save();
          }
        }else{
          value = ['0,0,0'];
        }
        if( Chr.length==0 || (Chr && Chr.match(/[A-Z0-9]{1}/)) ){
          gvar.settings.hotkeykey = String( value );
          gvar.settings.hotkeychar = String( Chr );
          
          setValue(KS+'QR_HOTKEY_KEY', String( value ));
          setValue(KS+'QR_HOTKEY_CHAR', String( Chr ))
        }
        
        // autoload smiley
        misc = ('kecil,besar,custom').split(',');
        value = [];
        value.push( isChk( $('#misc_autoshow_smile')) ? '1' : '0' );
        oL = misc.length;
        for(var id=0; id<oL; id++){
            if( !isString(misc[id]) ) continue;
            if(isChk( $('#misc_autoshow_smile_' + misc[id]) )){
                value.push(misc[id]);
                break;
            }
        }
        gvar.settings.autoload_smiley = String(value);
        setValue(KS+'SHOW_SMILE', gvar.settings.autoload_smiley);

        // txtcount
        value = '0';
        if( isChk($('#misc_txtcount')) ) {
          gvar.settings.txtcount = true;
          $('.counter').show();
          value = '1';
        }
        else{
          $('.counter').hide();
        }
        setValue(KS+'TXTCOUNTER', String( value ));

        window.setTimeout(function(){
          close_popup();
        }, 444);
      } //=end act update
      
      // import ==
      else{
        var rL, raw, btn='#box_action', tgt = '#textarea_rawdata', disb = 'jfk-button-disabled';
        $(tgt).addClass(disb);
        raw = trimStr( $(tgt).val() );
        
        if( gvar.buftxt && raw == trimStr(gvar.buftxt) ){
          $(btn).val('Nothing changed..');
          if(gvar.buftxt) delete( gvar.buftxt );
          window.setTimeout(function(){ $('#box_cancel').click() }, 750);
        }
        else{
          if( !confirm(''
              +'Are you sure to update these settings?'+'\n'
              +'Your current settings will be lost.'+'\n\n'
              +'Page may need to reload to apply new Settings.'+'\n') ){
            $(tgt).removeClass(disb);
            return;
          }else{
          
            $(btn).val('Saving..');
            raw = raw.split('\n'), rL = raw.length;
            var cucok, lastkey = false, line = 0;
            
            var query_save_setting = function(line){
              var newval = trimStr( raw[line] );
              if( cucok = newval.match(/^\[([^\]]+)]/) ){
                // is this a defined key?
                cucok[1] = trimStr(cucok[1]);
                lastkey = ( isDefined(OPTIONS_BOX[KS + cucok[1]]) ? cucok[1] : false ); // only allow registered key
              
              }else if( lastkey && newval && !newval.match(/^\#\s(?:\w.+)*/) ){
                // is lastkey is defined, newval is not blank and is not a komeng
                try{
                  setValue(KS+lastkey, newval.toString());
                  (function(){
                    //query_save_setting(line);
                    lastkey = false; // flushed, find next key
                  })();
                }catch(e){};
              }
              line++;

              if(line < rL){
                query_save_setting(line);

              }else{
                // done ...
                gvar.$w.setTimeout(function(){
                  getSettings( gvar.settings );
                  gvar.$w.setTimeout(function(){ location.reload(false) }, 50);
                }, 200);
              }
            };
            // let's save em all
            query_save_setting(line);
          }
        }
      }
    }); // box_action
    
    $('#exim_select_all').click(function(){
      $('#textarea_rawdata').focus();
      selectAll( $('#textarea_rawdata').get(0) );
    });
    
    $('#reset_settings').click(function(){
      _STG.reset_settings()
    });
    
    $('#box_cancel, .modal-dialog .modal-dialog-title-close').click(function(){ close_popup() });
    
    $('#qr-box_setting .curent').click();
    $('#'+gvar.tID).blur();
  },
  cold_boot: function(){
    var cscontainer = 'tabs-sb-tcustom';
    if( $('#tabs-content-inner').html() == "" || ($('#'+cscontainer).get(0) && $('#'+cscontainer).html()=="") )
      return;

    gvar.smcustom = null;
    $('#'+cscontainer).html();
    _SML_.load_smiley( cscontainer );
  },
  load_rawsetting: function(){
    // collect all settings from storage,. 
    var keys  = ['UPDATES','UPDATES_INTERVAL','WIDE_THREAD'
          ,'HIDE_AVATAR','QR_HOTKEY_KEY','QR_HOTKEY_CHAR','QR_DRAFT'
          ,'TXTCOUNTER','LAYOUT_CONFIG','LAYOUT_TPL','SCUSTOM_NOPARSE','CUSTOM_SMILEY'
    ];
    //if(gvar.user.isDonatur)  keys.push('PRELOAD_RATE');
    //else keys.push('QR_USE_RECAPCAY','QR_RECAPCAY_PROP');
  
    var keykomeng = {
       'UPDATES':'Check Update enabled? validValue=[1,0]'
      ,'UPDATES_INTERVAL':'Check update Interval (day); validValue=[0< interval < 99]'
      ,'QR_DRAFT':'Mode QR-Draft; validValue=[1,0]'
      ,'TXTCOUNTER':'Mode Text Couter; validValue=[1,0]'
      ,'HIDE_AVATAR':'Mode Show Avatar. validValue=[1,0]'
      ,'SHOW_SMILE':'Autoload smiley; [isEnable,smileytype]; validValue1=[1,0]; validValue2=[kecil,besar,custom]'
      ,'WIDE_THREAD':'Expand thread with css_fixup; validValue=[1,0]'
      ,'QR_HOTKEY_KEY':'Key of QR-Hotkey; [Ctrl,Shift,Alt]; validValue=[1,0]'
      ,'QR_HOTKEY_CHAR':'Char of QR-Hotkey; validValue=[A-Z0-9]'
      ,'LAYOUT_CONFIG':'Layout Config; [userid=isNaN,isEnable_autoLAYOUT]; isEnable\'s validValue=[1,0]'
      ,'LAYOUT_TPL':'Layout Template; [userid=LAYOUT]; validValue of LAYOUT is must contain escaped {MESSAGE}'
      ,'SCUSTOM_NOPARSE':'Smiley Custom Tags will not be parsed; validValue=[1,0]'   
      ,'CUSTOM_SMILEY':'Smiley Custom\'s Raw-Data; [tagname|smileylink]'
    };
    
    var z, nn, kL=keys.length, getToday = function(){var days=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];var d=new Date();return(d.getFullYear().toString() +'-'+ ((d.getMonth()+1).toString().length==1?'0':'')+(d.getMonth()+1)+'-'+(d.getDate().toString().length==1?'0':'')+d.getDate()+', '+days[d.getDay()]+'. '+(d.getHours().toString().length==1?'0':'')+d.getHours()+':'+(d.getMinutes().toString().length==1?'0':'')+d.getMinutes()+':'+(d.getSeconds().toString().length==1?'0':'')+d.getSeconds());};
    var parse_UA_Vers = function(){
      return ( window.navigator.userAgent.replace(/\s*\((?:[^\)]+).\s*/g,' ').replace(/\//g,'-') );
    };
    nn = '\n'; 
    gvar.buftxt = '# QR-Settings Raw-Data'+'\n';
    gvar.buftxt+= '# Version: QR'+(isQR_PLUS!==0?'+':'')+' '+gvar.sversion+'\n';
    gvar.buftxt+= '# Source: http://'+ 'userscripts.org/scripts/show/'+gvar.scriptMeta.scriptID+'\n';
    gvar.buftxt+= '# User-Agent: '+parse_UA_Vers()+'\n';
    gvar.buftxt+= '# Date-Taken: '+getToday()+'\n';
    gvar.buftxt+= nn;
    
    var query_settings = function(z){
      (function(ret){
        var cur_key = keys[z];
        if( ret && cur_key ){
          gvar.buftxt+= '# '+keykomeng[cur_key] + nn;
          gvar.buftxt+= '[' + cur_key + ']' + nn + ret + nn + nn;
        }
        if( (z+1) < kL ){
          z++;
          query_settings( z );
        }else{
          gvar.$w.setTimeout(function(){
            $('#textarea_rawdata').val( gvar.buftxt ).removeAttr('readonly');
          }, 200);
        }
      })( getValue(KS + keys[z]) );
    };
    z = 0;
    query_settings( 0 );
  },
  reset_settings: function(){
    (function(ret){
      var msg, space, csmiley, keys, yakin, home=[gvar.kask_domain + '16414069','http:/'+'/userscripts.org/topics/58227'];
      space = '';
      for(var i=0;i<20;i++) space+=' ';
      csmiley = ret.replace(/^\s+|\n|\s+$/g, "");
      msg = ( csmiley!="" ? 
        HtmlUnicodeDecode('&#182;') + ' ::Alert::\nCustom Smiley detected. You might consider of losing it.\n\n' : ""
      )
      +'This will delete/reset all saved data.'
      +'\nPlease report any bug or some bad side effects here:'+space+'\n'+home[1]+'\nor\n'+home[0] + '\n\n'
      + HtmlUnicodeDecode('&#187;')+' Continue with Reset?';        
      if( confirm(msg) ){
        keys = [
        'SAVED_AVATAR','LAST_SPTITLE','LAST_UPLOADER','HIDE_AVATAR','MIN_ANIMATE'
        ,'UPDATES_INTERVAL','UPDATES','TXT_COUNTER'
        ,'QUICK_QUOTE','CUSTOM_SMILEY','TMP_TEXT','WIDE_THREAD'
        ,'QR_HOTKEY_KEY','QR_HOTKEY_CHAR', 'QR_DRAFT'
        ,'LAYOUT_CONFIG','LAYOUT_TPL','PRELOAD_RATE'
        ,'QR_LastUpdate','QR_COLLAPSE','QR_LASTPOST'
        ,'UPLOAD_LOG','CSS_BULK','CSS_META','SCUSTOM_NOPARSE'
        ,'EXC_PLACES','INC_PLACES','ALL_PLACES'
        ,'DYNAMIC_QR','COUNTDOWN'
        ];
        var kL=keys.length, waitfordel, alldone=0;
        for(var i=0; i<kL; i++){
          try{
            if( isString(keys[i]) ){
              delValue(KS + keys[i]);
              alldone++;
              (function(){
                if( alldone >= kL )
                  gvar.$w.setTimeout(function() { location.reload(false); }, 500);
              })();
            }
          }catch(e){}
        }
      }
    })( getValue(KS+'CUSTOM_SMILEY') );

  }
};

/*
* object urusan parsing text
* mostly quick-quote purpose
*/
var _QQparse = {
  init:function(calee, cb){
    var par, mqs_id = [];
    $('.multi-quote.blue').each(function(){
      par = $(this).closest('.row');
      if( $(par).get(0) ) mqs_id.push( $(par).attr('id') );
    });
    if(mqs_id.length == 0){
      clog('no multiquote, perform to this calee');
      par = $(calee).closest('.row');
      if( $(par).get(0) ) mqs_id.push( $(par).attr('id') );
    }else{
      $('#sdismiss_quote').click();
    }
    this.cb = cb;
    this.mqs_id = mqs_id;
    this.title = false;
    this.start();
  },
  start:function(){
    var ret, buff, entrycontent, post_id, _QQ = this;
    $.each( _QQ.mqs_id, function(){
      post_id = this;
      entrycontent = $('#'+post_id).find('.entry');
      if( $(entrycontent).get(0) ){
        
        buff = String( $(entrycontent).html() ).replace(/(\r\n|\n|\r|\t|\s{2,})+/gm, "");
        buff = buff.replace(/(?:<\!-{2,}reason\s?[^>]+.)+/gi, '');
        
        ret = _QQ.parseMSG( buff );
        clog('ret after parseMSG=' + ret);
        
        _TEXT.init();

        if( ret )
          _TEXT.add( '[QUOTE=' + _QQ.get_quotefrom(post_id) + ']' + ret + '[/QUOTE]'  + "\n\n" );
      }
    });
  },
  count_spoilers: function($html){
    return $('.spoiler', $html).length
  },
  get_quotefrom: function(pid){
    var nameStr, el = createEl('div', {}, $('#'+pid).find('.nickname').html() );
    nameStr = trimStr($(el).text().toString()).replace(/\[\$\]$/, '');
    $(el).remove();
    return trimStr( nameStr ) + (gvar.thread_type == 'group' ? '' : ';'+pid.replace(/^post/i, ''));
  },
  clearTag: function(h, tag){
    if( isUndefined(tag) ){
      return trimStr( h.replace(/<\/?[^>]+>/gm,'') )||'';
    }else{
      var re = new RegExp('[\\r\\n\\t]?<\\\/?(?:'+tag+')(?:[^>]+)?.[\\r\\n\\t]?', "gim"); 
      return h.replace(re,'');
    } 
  },
  
  parseTITLE: function(el){
    var _src, _icon_name;
    _src = $('img', $(el));
    
    _src = ( $(_src).get(0) ? basename( $(_src).attr('src') ).replace(/\./g,'') : '' );
    this.title = {
      icon: _src, text: $(el).text()
    };
  },
  parseMSG: function(x){

    var _QQ = this;
    var $pCon,pCon,els,el,el2,eIner,cucok,openTag,sBox,nLength,LT,pairedEmote;
    var ret, contentsep, pos;
    
    LT = {'font':[],'sp':[],'a':[],'align':[],'coder':[],'list':[]};
    pairedEmote = false;
    
    var revealQuoteCode = function(html){

      var els,el,el2,el2tmp,tag, cucok, XPathStr='.//span[@class="post-quote"]', rvCon = pCon;
      if( isDefined(html) ){
        // fix align inside spoiler
        html = String(html).replace(/<(\/?)([^>]+)>/gm, parseSerials );
        rvCon = createEl('div',{style:'display:none'},html);
      }
      //clog('inside revealQuoteCode\n' + $(rvCon).html() )
      els = $D(XPathStr, rvCon);
      //clog(' quote objects len = ' + els.snapshotLength)
      if(els.snapshotLength) for(var i=0;i<els.snapshotLength; i++){
        el = els.snapshotItem(i);
        if( $(el).html().match(/Quote:/) ){
          //clog('ada Quote')
          el2 = createTextEl('\n');
          el.parentNode.replaceChild(el2,el);
          
        }
      }
      // remove last edited
      $('.edited', $(rvCon) ).remove();
      return $(rvCon).html();
    }
    ,br2nl = function(text){
      return text.replace(/<br\s*(?:[^>]+|)>/gi, "\n")
    }
    ,revealCoders = function(html){
      var els,el,cucok, XPathStr = './/div[contains(@style,"margin-bottom")]', rvCon = pCon;
      if( isDefined(html) ){
        // fix align inside spoiler
        html = String(html).replace(/<(\/?)([^>]+)>/gm, parseSerials );
        rvCon = createEl('div',{style:'display:none'},html);
      }
      
      //clog('inside revealCoders\n' + $(rvCon).html() )
      els = $D(XPathStr, rvCon);
      //clog(' quote objects len = ' + els.snapshotLength)
      if(els.snapshotLength) for(var i=0;i<els.snapshotLength; i++){
        el = els.snapshotItem(i);
        if(cucok = $(el).html().match(/(?:(HTML|PHP)\s{1})*Code:/)) {
          //clog('is coder..' + (cucok && cucok[1] ? cucok[1] : 'CODE') );
          $(el).next().attr('rel', (cucok && cucok[1] ? cucok[1] : 'CODE') );
          
          if(cucok[1]=='PHP' || cucok[1]=='HTML'){
            var _html = (cucok[1]=='PHP' ? $(el).next().find('code').html() : $(el).next().html() );
            if( _html ){
              _html = _html.replace(/<\/?span(?:[^>]+)?>/gim, '');
              _html = br2nl(_html);
              $(el).next().html( entity_encode(_html) );
            }
          }
        }
        try{Dom.remove(el)}catch(e){};
      }
    }
    ,parseSerials = function(S,$1,$2){
      var mct, parts, pRet, lastIdx, tag, _2up;
      _2up = $2.toUpperCase();
      clog('inside parseSerials 2up=[' + _2up + ']');

      // parse BIU -> I is using EM by now
      if ( $.inArray(_2up, ['B','EM','U']) != -1 ){
        clog('bbcode recognized: ['+_2up+']');
        (_2up == 'EM') && (_2up = 'I');
        return '[' + ($1 ? '/' : '') + _2up + ']';
      }else
      
      // parse code
      if( /^pre\s/i.test($2) || _2up=='PRE' ){
        mct = $2.toLowerCase().match(/\/?pre(?:(?:\s*(?:\w+=['"][^'"]+.\s*)*)?\s?rel=['"]([^'"]+))?/i);
        
        if( isDefined(mct[1]) ){
          LT.coder.push( mct[1].toUpperCase() );
        }else{
          mct[1] = false;
        }
        
        openTag= ( mct && mct[1] );
        if( openTag ){
          mct[1] = mct[1].toUpperCase();
          clog('bbcode recognized: ['+mct[1].toUpperCase()+']');
        }
        lastIdx = LT.coder.length-1;
        
        pRet= (openTag ? '['+mct[1]+']' : (isDefined(LT.coder[lastIdx]) ? '['+'/'+LT.coder[lastIdx].toUpperCase()+']' : '') );
        
        if( !openTag )
          LT.coder.splice(lastIdx,1);
        return pRet;
      }else

      // parse list (number/bullet)
      if( /^(?:ul|ol)\s/i.test($2) || _2up=='OL' || _2up=='UL'){
        mct = [];
        if( $2.indexOf('decimal;')!=-1 ){
          mct = ['','LIST=1']; // numbering...
        }else
        if( $2.indexOf(':disc;')!=-1 ){
          mct = ['', 'LIST']; // list
        }

        if( isDefined(mct[1]) ){
          mct[1] = mct[1].toUpperCase();
          LT.list.push( mct[1] );
        }else{
          mct[1] = false;
        }

        openTag = ( mct && mct[1] );
        if( openTag ){
          mct[1] = mct[1].toUpperCase();
          clog('bbcode recognized: ['+mct[1]+']');
        }
        lastIdx = LT.list.length-1;

        pRet= (openTag ? '['+mct[1]+']' : (isDefined(LT.list[lastIdx]) ? '['+'/'+LT.list[lastIdx].replace(/\=[^\b]+/g, '').toUpperCase()+']' : '') );
        
        if( !openTag )
          LT.list.splice(lastIdx,1);
        return pRet;
      }else

      // parse hand of list
      if( /^li/i.test($2) || _2up=='LI' ){
        if( (openTag = !$1) ){
          clog('bbcode recognized: [*]');
        }
        pRet= (openTag ? '[*]' : '');

        return pRet;
      }else
      
      // parse align | color | font | size;
      if( /^span\s/i.test($2) || _2up=='SPAN'){
        if( $2.indexOf('-align:')!=-1 ){
          
          mct = $2.match(/\/?span(?:(?:[^\-]+).align\:(\w+))?/i);
          openTag= ( mct && mct[1] );
        }else 
        if( $2.indexOf('color:')!=-1 ){

          mct = $2.match(/\/?span(?:(?:[^\'\"]+).(color)\:([^\!]+))?/i);
          openTag = (mct[1] && isDefined(mct[2]) && mct[2]);
        }
        else
        if( $2.indexOf('-family') != -1 ){
          mct = $2.match(/\/?span(?:(?:[^\'\"]+).(font)-family\:([^\!]+))?/);
          openTag = (mct[1] && isDefined(mct[2]) && mct[2]);
        }
        else
        if( $2.indexOf('-size') != -1 ){
          mct = $2.match(/\/?span(?:(?:[^\'\"]+).font-(size)\:([\d]+px))?/);
          openTag = (mct[1] && isDefined(mct[2]) && mct[2]);
          if( openTag ){
            var size_maper = {
              '10px': '1',
              '12px': '2',
              '14px': '3',
              '16px': '4',
              '20px': '5',
              '24px': '6',
              '28px': '7'
            }
            mct[2] = ( isDefined(size_maper[mct[2]]) ? size_maper[mct[2]] : '3');
          }
        }
        else{
          mct = [0,false];
          openTag = false;
        }

        if( isDefined(mct[1]) && mct[1] ){
          LT.align.push( mct[1].toUpperCase() );
        }
        
        if( openTag ){
          mct[1] = mct[1].toUpperCase();
          clog('bbcode recognized: ['+mct[1].toUpperCase()+']');
        }
        lastIdx = LT.align.length-1;
        
        pRet= (openTag ? '['+mct[1] + (mct[2] ? '='+trimStr(mct[2]) : '')+']' : (isDefined(LT.align[lastIdx]) ? '['+'/'+LT.align[lastIdx].toUpperCase()+']' : '') );
        
        if( !openTag )
          LT.align.splice(lastIdx,1);
        return pRet;
      }else
      
      // parse html | php | indent
      if( /^div\s/i.test($2) || _2up=='DIV'){
        if( mct = $2.toLowerCase().match(/\s1em\s40px/) )
          mct = [$2, 'INDENT'];
        else
          mct = $2.toLowerCase().match(/\/?div(?:(?:\s*(?:\w+=['"][^'"]+.\s*)*)?\s?rel=['"]([^'"]+))?/i);
        
        if( isDefined(mct[1]) ){
          LT.coder.push( mct[1].toUpperCase() );
          
        }else{
          mct[1] = false;
        }       
        openTag= ( mct && mct[1] );
        if( openTag ){
          mct[1] = mct[1].toUpperCase();
          clog('bbcode recognized: ['+mct[1].toUpperCase()+']');
        }
        lastIdx = LT.coder.length-1;
        
        pRet= (openTag ? '['+mct[1]+']' : (isDefined(LT.coder[lastIdx]) ? '['+'/'+LT.coder[lastIdx].toUpperCase()+']' : '') );
        
        if( !openTag )
          LT.coder.splice(lastIdx,1);
        return pRet;
      }else
      
      // parse linkify
      if( /\shref=/i.test($2) || _2up=='A' ){
        mct = $2.match(/\/?a\s*(?:(?:target|style|title|linkid)=[\'\"][^\'\"]+.\s*)*(?:\s?href=['"]([^'"]+))?/i);
        if( isDefined(mct[1]) ){
          tag = (/^mailto:/.test(mct[1]) ? 'EMAIL' : 'URL' );
          if( tag=='EMAIL' )
            mct[1] = mct[1].replace(/^mailto:/i,'');
          LT.a.push( tag );
        }else{
          mct[1] = false;
        }
        openTag = (mct && mct[1]);
        if( openTag ){
          mct[1] = (isLink(mct[1]) ? mct[1] : mct[1].toUpperCase());
          clog('bbcode recognized: ['+mct[1]+']');
        }
        lastIdx = LT.a.length-1;
        pRet = (mct && mct[1] ? (isDefined(LT.a[lastIdx]) ? '['+LT.a[lastIdx].toUpperCase()+(LT.a[lastIdx].toUpperCase()=='URL' ? '='+mct[1]:'') +']' :'') : (isDefined(LT.a[lastIdx]) ? '['+'/'+LT.a[lastIdx].toUpperCase()+']' : '') );
        
        if( !openTag )
          LT.a.splice(lastIdx,1);
        return pRet;
      }else
      
      // parse img
      if( /\ssrc=/i.test($2) ){
        mct = $2.match(/\ssrc=['"]([^'"]+)/i);
        
        if( mct && isDefined(mct[1]) ){

          if( /^embed\s*/i.test($2) && (cucok = mct[1].match(/\byoutube\.com\/(?:watch\?v=)?(?:v\/)?([^&\?]+)/i)) ){
            clog('bbcode recognized: [YOUTUBE]');
            return ( '[YOUTUBE]' + cucok[1] + '[/YOUTUBE]' );
          } else
          if( /^iframe\s*/i.test($2) && (cucok = mct[1].match(/\bvimeo\.com\/video\/([^&\b\?]+)/i)) ){
            clog('bbcode recognized: [VIMEO]');
            return ( '[VIMEO]' + cucok[1] + '[/VIMEO]' );
          } else
          if( /^iframe\s*/i.test($2) && (cucok = mct[1].match(/\bsoundcloud\.com\/tracks\/([^&\b\?]+)/i)) ){
            clog('bbcode recognized: [SOUNDCLOUD]');
            return ( '[SOUNDCLOUD]' + cucok[1] + '[/SOUNDCLOUD]' );
          } else
          if( cucok = $2.match(/img\s*(?:(?:alt|src|class|border)=['"](?:[^'"]+)?.\s*)*title=['"]([^'"]+)/i)){
            // is kaskus emotes?
            if(cucok){
              var pos, smilies = '/smilies/';
              pos = mct[1].indexOf(smilies);
              tag = mct[1].substring( pos + smilies.length );
              tag = tag.replace(/[^\w]/g,'').toString();
              
              if( !pairedEmote )
                pairedEmote = prep_paired_emotes();
              
              return ( isDefined(pairedEmote[tag]) ? pairedEmote[tag] : '[IMG]' + mct[1] + '[/IMG]' );
            }
          }else {
            clog('bbcode recognized: [IMG]');
            return '[IMG]' + mct[1] + '[/IMG]';
          }
        }else{
          return '';
        }
      }else{
        return S;
      }
    }
    ,double_encode= function(x){
      x = br2nl(x);
      return x
        .replace(/\&amp;/gm,'&amp;amp;')
        .replace(/\&lt;/gm,'&amp;lt;')
        .replace(/\&gt;/gm,'&amp;gt;')
      ;
    };
    
    // make a fake container for this inner x
    pCon = createEl('div', {style:'display:none'}, x);
  
    // clean messy from ksa, based on id=KSA-
    els = $D('.//span[starts-with(@id,"KSA-")]', pCon);
    nLength = (els.snapshotLength-1);
    for(var i=nLength; i>=0; i--){
      el = els.snapshotItem(i);
      if( el ) Dom.remove(el);
    }
    
    $pCon = $(pCon);
    // reveal simple quote
    $pCon.html( revealQuoteCode() );  
    //clog('pCon=' + $(pCon).html() );
    
    // reveal title post
    el = $('h2', $pCon);
    if( $(el).length ){
      this.parseTITLE( el );
      $('h2', $pCon ).remove();
    }
    
    // reveal spoiler inside
    var total_spoilers;
    //selector_1st_child = '> .spoiler';
    total_spoilers = this.count_spoilers($pCon);
    clog('total spoilers=' + total_spoilers );

    /*
    * when spoiler wrapped with any tags like [font,b,...],
    * will fail getting its 1deg spoiler, which might not be cleared in parseSerials
    * need to seach it first then.
    * still we limited around 63 nested tags only, fix-me!
    */
    if(total_spoilers > 0){
      var newhtml = (function($, $_pCon){
        var selectorSpoiler, selector_1st_child, notfound, threshold=100, step=0;
        selectorSpoiler = selector_1st_child = '> .spoiler';
        $_pCon.find('input[class^="spoiler_"]').remove();
        clog('indigo...=' + $_pCon.html());

        if($(selector_1st_child, $_pCon).length == 0){
          notfound = 1; step = 0;
          while(notfound){
            ++step;
            selectorSpoiler = '> * ' + selectorSpoiler;
            notfound = ($(selectorSpoiler, $_pCon).length == 0);
            if(step >= threshold) break;
          }
        }

        // bbcode_div
        $(selectorSpoiler, $_pCon).each(function(){
          var title, cucok, newEl, tmptit, _newhtml, iner = $(this).find('#bbcode_inside_spoiler:first').html()
          title = $(this).find('i:first').html();

          _newhtml = ('[SPOILER='+ (title ? title : ' ') +']'+ (iner ? iner : ' ') +'[/SPOILER]');
          iner = double_encode( _newhtml );
          iner = _QQ.parseMSG( iner );
          
          newEl = ( createTextEl(entity_decode(iner)) );
          $(this).replaceWith( $(newEl) );
        });
        return $_pCon.html();
      })($, $pCon);
      clog('pCon after spoiler=' + $pCon.html() );

      $pCon.html(newhtml);
    }

    clog('recheck spoiler=' + this.count_spoilers($pCon));
    if(this.count_spoilers($pCon) > 0){
      x = this.parseMSG($pCon.html());

      clog('return from recheck spoiler=' + x);
      $pCon.html(x);
    }

    // clean-up youtube thumb
    $('div[onclick*=".nextSibling"]', $pCon ).remove();
    
    // reveal code inside
    $pCon.html( revealCoders() );
    //clog('pCon after coder / before decode parseSerials=' + $pCon.html() );

    x = double_encode($pCon.html());
    pCon = null; $pCon = null;

    // serials parse
    ret = trimStr( String(x).replace(/<(\/?)([^>]+)>/gm, parseSerials ));
    
    // clean rest (unparsed tags)
    return unescapeHtml( entity_decode(this.clearTag( ret )) );
  }
};


/*
* cross-browser XHR method
*/
var GM_XHR = {
  uri:null,
  returned:null,
  forceGM:false, // force with GM-XHR & avoid using Native-XHR when with multifox
  cached:false,
  events:false,
  request: function(cdata, met, callback){
    if( !GM_XHR.uri ) return;
    met=(isDefined(met) && met ? met:'GET');
    cdata=(isDefined(cdata) && cdata ? cdata : null);
    if( typeof callback != 'function') callback=null;
    var pReq_xhr = {
      method: met,
      url:  GM_XHR.uri + (GM_XHR.cached ? '' : (GM_XHR.uri.indexOf('?')==-1?'?':'&rnd=') + Math.random().toString().replace('0.','')),
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      data: (isString(cdata) ? cdata : ''),
      onload: function(ret) {
        if(ret.status==503){
          clog('Reach 503, retrying...');
          window.setTimeout(GM_XHR.request(cdata,met,callback), 777);
        }else{
          var rets=ret;
          if(callback!=null)
            callback(rets);
          else
            GM_XHR.returned = rets;
        }
      }
    };
    if( !GM_XHR.forceGM ) // always use this native; except update checker
      NAT_xmlhttpRequest( pReq_xhr );
    else
      GM_xmlhttpRequest( pReq_xhr );
  }
};

/*
* native/generic XHR needed for Multifox, failed using GM_xmlhttpRequest.
*/
var NAT_xmlhttpRequest=function(obj) {
  var request = new XMLHttpRequest();
  request.onreadystatechange=function() {
    if(obj.onreadystatechange) { obj.onreadystatechange(request); }; if(request.readyState==4 && obj.onload) { obj.onload(request); }
  };
  request.onerror=function() { if(obj.onerror) { obj.onerror(request); } };
  try {
    request.open(obj.method,obj.url,true); 
  }catch(e) {
    if(obj.onerror) { obj.onerror( {readyState:4,responseHeaders:'',responseText:'',responseXML:'',status:403,statusText:'Forbidden'} ); }; return;
  }
  if(obj.headers) {
    for(name in obj.headers) { request.setRequestHeader(name,obj.headers[name]); }
  }
  request.send(obj.data);
  return request;
};

// mode = ['editor', 'saving', 'view']
function validTag(txt, doreplace, mode){
  if( !isString(txt) ) return false;
  var ret, val, title, matches, re, cucok = false;  
  ret = txt;
  matches = {
    "{title:(.+)}" : ['b', '$1'],
    "{sctag:(br)}" : ['br','']
  };
  for(var torep in matches){
    re = new RegExp(torep, "");
    if( ret.match(re) ){
      cucok=true;
      //clog('cur torep='+torep)
      if(isDefined(doreplace) && doreplace){ // must be from view mode
        val = ret.replace(re, matches[torep][1]);
        val = do_sanitize(val);
        ret = '<'+ matches[torep][0] + (matches[torep][0] == 'br' ? '/':'') + '>' + (val && matches[torep][0] != 'br' ? val + '</'+ matches[torep][0] +'>' : '');
      } else if(isDefined(mode) && mode=='editor') {
        // editor mode and it's a BR
        if(torep=='{sctag:(br)}') 
          ret=txt.replace(re, '\n');
        else{
          // guess it should be a title
          title = re.exec( txt );
          //clog('mode='+mode+'; title; title='+title)
          if(re && isDefined( title[1]) ){
            val = do_sanitize( title[1] );
            ret = '{title:'+val+'}\n'; 
          }else{
            ret = txt+'\n'; 
          }
        }
      }
      break;
    }
  }
  return (cucok ? ret : false);
}

function do_sanitize(text){
  var re, torep, do_it_again, fL, filter, ret = text;
  filter = [
    "[\\\"\\\'][\\s]*(javascript\\:+(?:[^\\\'\\\"]+))[\\\"\\\']"
    ,"((?:\\&lt;|<)*script(?:\\&gt;|>)*)"
    ,"((?:\\&lt;|<)*\\/script(?:\\&gt;|>)*)"
    ,"</?(?:[a-z][a-z0-9]*\\b).*(on(?:[^=]+)=[\\\"\\\'](?:[^\\\'\\\"]+)[\\\"\\\'])"
    ,"</?(?:[a-z][a-z0-9]*\\b).+(style=[\\\"\\\'](?:\\w+)\\/\\*[.+]*\\*\\/\\w+\\:[^\\\"]+\\\")"
    ,"<[\s]*>"
  ];
  do_it_again = '';
  fL = filter.length;
  
  // need a loop until it's really clean | no match patern
  while( do_it_again=='' || do_it_again.indexOf('1')!=-1 ) {
    do_it_again = '';
    for(var idx=0; idx<fL; idx++){
      if( !isString(filter[idx]) ) continue;
      re = new RegExp(filter[idx], "ig");
      if( ret.match(re) ){
        do_it_again+='1';
        torep = re.exec(ret);      
          //clog('replacing='+filter[idx]+'; torep='+torep[1]);
        if( torep && isDefined(torep[1]) )
        ret=ret.replace( torep[1], '' );
      }else{
        do_it_again+='0'; // must diff than (do_it_again=='')
      }
    }
  }
  return ret;
}

function myfadeIn(el,d, cb){
  var no_animate = 1;
  if( !d ) d = 100;
  if( typeof cb != 'function') cb = function(){};
  if(no_animate){
    $(el).show();
    d = parseInt(d);
    if(d > 0) gvar.$w.setTimeout(function(){ cb() }, d);
  }else{
    $(el).fadeIn(d, cb);
  }
}
function myfadeOut(el,d, cb){
  var no_animate = 1;
  if( !d ) d = 100; 
  if( typeof cb != 'function') cb = function(){};
  if(no_animate){
    $(el).hide(); 
    d = parseInt(d);
    if(d > 0) gvar.$w.setTimeout(function(){ cb() }, d);
  }else{
    $(el).fadeOut(d, cb);
  }
}

// load and prep paired kaskus smiley to do quick-quote parsing 
function prep_paired_emotes(){
  // '1' : [H+'ngakaks.gif', ':ngakaks', 'Ngakak (S)']
  // ( !gvar.smbesar || !gvar.smkecil || !gvar.smcustom )
  var sml, paired={}, tmp;
  if( !gvar.smbesar || !gvar.smkecil )
    rSRC.getSmileySet();
  tmp = gvar.smkecil;
  for(var i=0; i < tmp.length; i++){
    sml=tmp[i];
    paired[ sml[0].replace(/[^\w]/g,'').toString() ] = sml[1].toString();
  }
  tmp = gvar.smbesar;
  for(var i=0; i < tmp.length; i++){
    sml = tmp[i];
    paired[sml[0].replace(/[^\w]/g,'').toString()] = sml[1].toString();
  } 
  return paired;
}

function wrap_layout_tpl(text){
  var conf = String(gvar.settings.userLayout.config).split(',');  
  return (conf[1] == 1 ? gvar.settings.userLayout.template.replace(/{message}/gi, text) : text);
}

// domain guess for static or cdn
function domainParse(){
  var l = location.hostname
  return {
    "prot": location.protocol,
    "host": l,
    "statics" : 'cdn.kaskus.com'
  };
}


//=== mini-functions
// static routine
function isDefined(x)   { return !(x == null && x !== null); }
function isUndefined(x) { return x == null && x !== null; }
function isString(x) { return (typeof(x)!='object' && typeof(x)!='function'); }
function trimStr(x) { return (typeof(x)=='string' && x ? x.replace(/^\s+|\s+$/g,"") : '') };
function isLink(x) { return x.match(/((?:http(?:s|)|ftp):\/\/)(?:\w|\W)+(?:\.)(?:\w|\W)+/); }

function _o(m,e,f){Dom.Ev(e,m,function(e){typeof(f)=='function'?f(e):void(0)});}
function basename(path, suffix) {
  // Returns the filename component of the path  
  // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // *     example 1: basename('/www/site/home.htm', '.htm');    // *     returns 1: 'home'
  // *     example 2: basename('ecra.php?p=1');
  var b = path.replace(/^.*[\/\\]/g, '');
  if(typeof(suffix) == 'string' && b.substr(b.length-suffix.length) == suffix)
    b = b.substr(0, b.length-suffix.length);
  return b;
};
function gID(x) { return document.getElementById(x) }
function dump(x){return ("undefined" != typeof JSON ? JSON.stringify(x) : x)}

// native clean-up fetched post
function unescapeHtml(text){
  if( !text ) return;
  var tL, cleanRet='', temp = createEl('div',{},text);
  tL = temp.childNodes.length;
  for(var i=0; i<tL; i++){
    if( typeof(temp.childNodes[i])!='object' ) continue;
    cleanRet += (function (t){
            return t.replace( /\&\#(\d+);/g, function( ent, cG ){return String.fromCharCode( parseInt( cG ) )})
          })(temp.childNodes[i].nodeValue);
  }
  try{ temp.removeChild(temp.firstChild) }catch(e){}
  return cleanRet;
}
function entity_decode(S){
  return S.replace(/\&gt;/gm,'>').replace(/\&lt;/gm,'<').replace(/\&amp;/gm,'&');
}
function entity_encode(S){
  return S.replace(/>/gm,'&gt;').replace(/</gm,'&lt;');
}

function createTextEl(a) {
  return document.createTextNode(a)
}
function createEl(a, b, c) {
  var d = document.createElement(a);
  for (var e in b) if (b.hasOwnProperty(e)) d.setAttribute(e, b[e]);
  if (c) d.innerHTML = c;
  return d
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
function do_an_e(A) {
  if (!A) {
    window.event.returnValue = false;
    window.event.cancelBubble = true;
    return window.event
  } else {
    A.stopPropagation();
    A.preventDefault();
    return A
  }
}
function selectAll(e){
  e = e.target||e;
  if(typeof(e)!='object') return false;
  e.setSelectionRange(0, e.value.length );
}

function getHeight(){
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
function getCurrentYPos() {
  if (document.body && document.body.scrollTop)
    return document.body.scrollTop;
  if (document.documentElement && document.documentElement.scrollTop)
    return document.documentElement.scrollTop;
  if (gvar.$w.pageYOffset)
    return gvar.$w.pageYOffset;
  return 0;
}

function getValue(key, cb) {
  var ret, data = OPTIONS_BOX[key];
  if( !data ) return;
  return GM_getValue(key,data[0]);
}
function setValue(key, value, cb) {
  var ret, data=OPTIONS_BOX[key];
  if( !data ) return;
  return GM_setValue(key,value);
}
function delValue(key, cb){
  try{
    return GM_deleteValue( key );
  }catch(e){}
}

function setValueForId(userID, value, gmkey, sp){
  if( !userID ) return null;
  
  sp = [(isDefined(sp) && typeof(sp[0])=='string' ? sp[0] : ';'), (isDefined(sp) && typeof(sp[1])=='string' ? sp[1] : '::')];
  var i, ksg = KS+gmkey, info;
  return (function(val){
    info = val;
    if( !info ){
      setValue(ksg, userID+"="+value);
      return;
    }
    info = info.split( sp[0] );
    for(i=0; i<info.length; i++){
      if(info[i].split('=')[0]==userID){
        info.splice(i,1,userID+"="+value);
        setValue(ksg, info.join(sp[0]));
        return;
      }
    }
    
    info.splice(i, 0, userID+"="+value);
    return setValue(ksg, info.join(sp[0]));
  })( getValue(ksg) );
}

// values stored in format "userID=value;..."
// sp = array of records separator
// gvar.user.id, 'LAYOUT_TPL', ['<!>','::'], function
function getValueForId(userID, gmkey, sp, cb){
  if( !userID ) return null;
  clog(gmkey + ' inside');
  
  sp = [(isDefined(sp) && typeof(sp[0])=='string' ? sp[0] : ';'), (isDefined(sp) && typeof(sp[1])=='string' ? sp[1] : '::')];    
  var val, info, retValue=null;

  return (function(val){
    if( !val ) {

      clog(gmkey + ' blank; halted');
      retValue = null;
      return;
    }
    info = val.split( sp[0] );
    clog(gmkey + ' info=' + info);
    
    for(var i=0; i<info.length; i++){
      if( !isString(info[i]) ) continue;
      var recs = info[i].split('=');
      if( recs[0]==userID ){
        var rets = [userID], values = recs[1].split(sp[1]), vL=values.length;
        for(var idx=0; idx<vL; idx++){
          if( !isString(values[idx]) ) continue;
          rets.push(values[idx]);
        }
        retValue = rets;
        break;
      }
    }

    return retValue;
  })( getValue(KS + gmkey) );
}
function delValueForId(userID, gmkey){
  var ksg = KS+gmkey, tmp=[], info = getValue(ksg);
  info = info.split(';');
  for(var i=0; i<info.length; i++){
    if(info[i].split('=')[0]!=userID)
      tmp.push(info[i]);    
  }
  setValue(ksg, tmp.join(';'));
}


// play safe with Opera, it really suck so need this emulator of GM
//=== BROWSER DETECTION / ADVANCED SETTING
//=============snipet-authored-by:GI-Joe==//
function ApiBrowserCheck() {
  //delete GM_log; delete GM_getValue; delete GM_setValue; delete GM_deleteValue; delete GM_xmlhttpRequest; delete GM_openInTab; delete GM_registerMenuCommand;
  if(typeof(unsafeWindow)=='undefined') { unsafeWindow=window; }
  if(typeof(GM_log)=='undefined') { GM_log=function(msg) { try { unsafeWindow.console.log('GM_log: '+msg); } catch(e) {} }; }
  
  var needApiUpgrade=false;
  if(window.navigator.appName.match(/^opera/i) && typeof(window.opera)!='undefined') {
    needApiUpgrade=true; gvar.isOpera=true; GM_log=window.opera.postError; clog('Opera detected...',0);
  }
  if(typeof(GM_setValue)!='undefined') {
    var gsv; try { gsv=GM_setValue.toString(); } catch(e) { gsv='.staticArgs.FF4.0'; }
    if(gsv.indexOf('staticArgs')>0) {
      gvar.isGreaseMonkey=true; gvar.isFF4=false;
      clog('GreaseMonkey Api detected'+( (gvar.isFF4=gsv.indexOf('FF4.0')>0) ?' >= FF4':'' )+'...',0); 
    } // test GM_hitch
    else if(gsv.match(/not\s+supported/)) {
      needApiUpgrade=true; gvar.isBuggedChrome=true; clog('Bugged Chrome GM Api detected...',0);
    }
  } else { needApiUpgrade=true; clog('No GM Api detected...',0); }
  
  gvar.noCrossDomain = (gvar.isOpera || gvar.isBuggedChrome);
  if(needApiUpgrade) {
    //gvar.noCrossDomain = gvar.isBuggedChrome = 1;
    clog('Try to recreate needed GM Api...',0);
    //OPTIONS_BOX['FLASH_PLAYER_WMODE'][3]=2; OPTIONS_BOX['FLASH_PLAYER_WMODE_BCHAN'][3]=2; // Change Default wmode if there no greasemonkey installed
    var ws=null; try { ws=typeof(unsafeWindow.localStorage) } catch(e) { ws=null; } // Catch Security error
    if(ws=='object') {
      clog('Using localStorage for GM Api.',0);
      GM_getValue=function(name,defValue) { var value=unsafeWindow.localStorage.getItem(GMSTORAGE_PATH+name); if(value==null) { return defValue; } else { switch(value.substr(0,2)) { case 'S]': return value.substr(2); case 'N]': return parseInt(value.substr(2)); case 'B]': return value.substr(2)=='true'; } } return value; };
      GM_setValue=function(name,value) { switch (typeof(value)) { case 'string': unsafeWindow.localStorage.setItem(GMSTORAGE_PATH+name,'S]'+value); break; case 'number': if(value.toString().indexOf('.')<0) { unsafeWindow.localStorage.setItem(GMSTORAGE_PATH+name,'N]'+value); } break; case 'boolean': unsafeWindow.localStorage.setItem(GMSTORAGE_PATH+name,'B]'+value); break; } };
      GM_deleteValue=function(name) { unsafeWindow.localStorage.removeItem(GMSTORAGE_PATH+name); };
    } else if(!gvar.isOpera || typeof(GM_setValue)=='undefined') {
      clog('Using temporarilyStorage for GM Api.',0); gvar.temporarilyStorage=new Array();
      GM_getValue=function(name,defValue) { if(typeof(gvar.temporarilyStorage[GMSTORAGE_PATH+name])=='undefined') { return defValue; } else { return gvar.temporarilyStorage[GMSTORAGE_PATH+name]; } };
      GM_setValue=function(name,value) { switch (typeof(value)) { case "string": case "boolean": case "number": gvar.temporarilyStorage[GMSTORAGE_PATH+name]=value; } };
      GM_deleteValue=function(name) { delete gvar.temporarilyStorage[GMSTORAGE_PATH+name]; };
    }
    if(typeof(GM_openInTab)=='undefined') { GM_openInTab=function(url) { unsafeWindow.open(url,""); }; }
    if(typeof(GM_registerMenuCommand)=='undefined') { GM_registerMenuCommand=function(name,cmd) { GM_log("Notice: GM_registerMenuCommand is not supported."); }; } // Dummy
    if(!gvar.isOpera || typeof(GM_xmlhttpRequest)=='undefined') {
      clog('Using XMLHttpRequest for GM Api.',0);
      GM_xmlhttpRequest=function(obj) {
      var request=new XMLHttpRequest();
      request.onreadystatechange=function() { if(obj.onreadystatechange) { obj.onreadystatechange(request); }; if(request.readyState==4 && obj.onload) { obj.onload(request); } }
      request.onerror=function() { if(obj.onerror) { obj.onerror(request); } }
      try { request.open(obj.method,obj.url,true); } catch(e) { if(obj.onerror) { obj.onerror( {readyState:4,responseHeaders:'',responseText:'',responseXML:'',status:403,statusText:'Forbidden'} ); }; return; }
      if(obj.headers) { for(name in obj.headers) { request.setRequestHeader(name,obj.headers[name]); } }
      request.send(obj.data); return request;
    }; }
  } // end needApiUpgrade
  GM_getIntValue=function(name,defValue) { return parseInt(GM_getValue(name,defValue),10); };
}

// ----my ge-debug--------
function show_alert(msg, force) {
  if(arguments.callee.counter) { arguments.callee.counter++; } else { arguments.callee.counter=1; }
  GM_log('('+arguments.callee.counter+') '+msg);
  if(force==0) { return; }
}
function clog(msg) {
  if(!gvar.__DEBUG__) return;
  show_alert(msg);
}

//=== functions

function tokcap_parser(page, mode){
  try{
    page = decodeURIComponent( page );
  }catch(e){    
    
    page = page.replace(/\\\"/g, '').replace(/(\r\n|\n|\r|\t|\s{2,})/gm, "").replace(/\%/gm, '%25').toString();
    //page = decodeURIComponent( page );
    
    clog('decodeURI in tokcap_parser failed');
    clog('secondary result of page = ' + page)    
  }
  
  var cucok, match, rets=[0,0];
  if(cucok = /out\/\?\&hash=([^\'\"]+)/i.exec(page) ){
    
    clog('old securitytoken=' + gvar._securitytoken);
    
    gvar._securitytoken = rets[1] = cucok[1];
    $('#qr-securitytoken').val(gvar._securitytoken);
    clog('\n'
      +'securitytoken updated = ' + gvar._securitytoken 
      +'\n'
      +'securitytoken onfield = ' + $('#qr-securitytoken').val()
      +'\n'
    );
    
  }else{
    clog('Page is not containing securitytoken, update failed');
    clog('sdata - page='+page);
  }
  
  if( match = /recaptcha_response_field/i.exec(page) ){
    // recaptcha autodetect | force gvar.settings.recaptcha value  
    gvar.settings.recaptcha = true;
    clog('Forced gvar.settings.recaptcha ON');
  }else if( match = /id=\"hash\".*value=\"(\w+)/im.exec(page) ){
    // kaskus image capcay
    if(gvar.settings.recaptcha && gID('#imgcapcay'))
      $('#imgcapcay').html( '<input id="hash" name="humanverify[hash]" value="'+match[1]+'" type="hidden">\n' );
    rets[0] = match[1];
  }else if( match = /humanverify[^\>]+.Hitung\:\s?([^\=]+)/i.exec(page) ){
    // kaskus capcay cacat
    gvar.CAPCAT = true;
    gvar.soal_cacats = match[1];
    gvar.ans_cacats = try_solve( gvar.soal_cacats );
  }else gvar.CAPCAT = false;
  
  return (cucok ? rets : false);
}

//==
function try_solve(sol){
  var a, r;
  if( a = /(\d+)([\Wa-z])(\d+)/i.exec(sol.replace(/\s/g, '')) ){
    a[1] = parseInt(a[1]); a[3] = parseInt(a[3]); 
    switch( a[2] ){
      case "+": r = (a[1]+a[3]); break;
      case "x": r = (a[1]*a[3]); break;
      case ":": r = (a[1]/a[3]); break;
      case "-": r = (a[1]-a[3]); break;
    }
  }
  return r;
}
//==

function inteligent_width( mode ){
  if(!mode) mode = '';
  // inteligent width-detector
  gvar.$w.setTimeout(function(){
    var ct, L, leb, upkey, imgs=[];
    ct =' .clickthumb';
    leb = parseInt($('#preview-image .preview-image-unit').length);
    
    L = ( leb > 0 ? (leb * 57)+'px' : '100%');
    if( leb > 0 ) {
      $(ct).show();
    }else{
      $(ct).hide();
    }   
    $('#preview-image').css('width',  L);
    $('#preview-image-outer').css('visibility', 'visible');
    
    // update log
    $('#preview-image img').each(function(){
      imgs.push($(this).attr('src'));
    });
    
    upkey = 'UPLOAD_LOG';
    if( mode=='' ){
      // save history upload
      (function(ret){
        imgs = ret.split(',');
        if( ret && imgs.length > 0 ){
          $.each(imgs, function(){
            var tpl, _src=this;
            tpl = ''
              +'<div class="preview-image-unit">'
              + '<img src="'+ _src +'" width="46" height="46" alt="[img]'+ _src +'[/img]" />'
              + '<span title="remove" class="modal-dialog-title-close imgremover"/>'
              +'</div>'
            ;
            $('#preview-image').append( tpl );
          });
        }
      })( getValue(KS + upkey) );
    }else{
      // whether is [insert, delete]
      setValue(KS + upkey, String(imgs));
    }
    
  }, 10);
}

function clear_quoted(){
  $('.multi-quote.blue').removeClass('blue').addClass('white');
  $('#qr_remoteDC').click();
  _NOFY.dismiss();
}

function precheck_quoted( injected ){
  var cb_after, no_mqs = ($('.multi-quote.blue').length == 0);
  if(!injected && no_mqs && $("#tmp_chkVal").val()==""){
    _NOFY.dismiss(); return;
  }
  cb_after = function(){
    $('#sdismiss_quote').click(function(){ clear_quoted() });
    var mq_ids = $("#tmp_chkVal").val().split(',');
    $.each(mq_ids, function(){
      if( !$('#mq_' + this).hasClass('blue') )
        $('#mq_' + this).addClass('blue').removeClass('white');
    });
  };
  _NOFY.init({mode:'quote',msg:'You have selected one or more posts. <a id="sdismiss_quote" href="javascript:;">Dismiss</a>', cb:cb_after, btnset:true});
}

function close_popup(){
  try {
    gvar.sTryEvent.abort();
    gvar.sTryRequest.abort();
    if(gvar.$w.stop !== undefined){gvar.$w.stop()}
    else if(document.execCommand !== undefined){document.execCommand("Stop", false)}
  } catch (e) {}
  
  if( !gvar.user.isDonatur && $('body > #modal_capcay_box').get(0) ){
    var tgt = $('#wraper-hidden-thing #modal_capcay_box'), live=$('body > #modal_capcay_box'), ri='#recaptcha_image', rcf='#recaptcha_challenge_field';
    $(tgt).find(ri).replaceWith( $(live).find(ri) );
    $(tgt).find(rcf).replaceWith( $(live).find(rcf) );
  }
    
  $('#'+_BOX.e.dialogname).css('visibility', 'hidden');
  $('body > .modal-dialog').remove();
  $('body').removeClass('hideflow');
  $('#'+gvar.tID).focus();
}

// action to do insert smile
function do_smile(Obj, nospace){
  var bbcode, _src, tag='IMG';
  
  _TEXT.init();
  bbcode = Obj.attr("alt");
  
  if(bbcode && bbcode.match(/_alt_.+/)) {
    // custom mode using IMG tag instead
    _src=Obj.attr("src");
    _TEXT.setValue( '['+tag+']'+_src+'[/'+tag+']' + (!nospace ? ' ':''));
  }else if( Obj.get(0).nodeName != tag ) {
    bbcode=Obj.attr("title");
    _src = bbcode.split(' ' + HtmlUnicodeDecode('&#8212;'));
    _TEXT.setValue( _src[1] + (!nospace ? ' ':''));  
  }else{
    _TEXT.setValue(bbcode + (!nospace ? ' ':'') );
  }
  _TEXT.pracheck();
}

// action to do insert font/color/size/list
function do_insertTag(tag, value, $caleer){
  _TEXT.init();
  if(value)
    _TEXT.wrapValue(tag, value);
  else
    _TEXT.wrapValue(tag);

  if( ($.inArray(tag, ["FONT","COLOR","SIZE"]) != -1) && $caleer && $caleer.length ){
    $caleer.closest('ul').hide();
  }
}

// action to do insert media,codes,quote
function do_insertCustomTag(tag){
  _TEXT.init();
  
  var text, prehead, tagprop, ptitle, selected, ret;
  var pTag={
     'quote':'QUOTE','code' :'CODE','html' :'HTML','php' :'PHP'
    ,'link' :'URL',  'picture':'IMG'
    ,'spoiler' :'SPOILER','transparent':'COLOR','noparse' :'NOPARSE', 'youtube' :'YOUTUBE'
    ,'strike' :''
  };  
  var endFocus = function(){ _TEXT.focus(); return};
  if( isUndefined(pTag[tag]) ) return endFocus();
  selected = _TEXT.getSelectedText();
  tagprop = '';
  
  if(tag=='quote' || tag=='code' || tag=='html' || tag=='php'){
    _TEXT.wrapValue( tag );

  }else if(tag=='spoiler'){

    var title = prompt('Please enter the TITLE of your Spoiler:', '' );
    if(title==null) return endFocus();
    title = (title ? title : ' ');
    _TEXT.wrapValue( 'spoiler', title );  
    
  }else if(tag=='strike'){
    
    var strikeEm = function(t){
      var pr = t.split(''), r='';
      for(var i=0;i<pr.length;i++) r+=pr[i]+'\u0336';
      return String(r)
    };
    text = (selected!= '' ? selected :
      prompt('Please enter Text to strikethrough:', 'strikethrough') 
    );    
    if(text==null) return endFocus();
    ret = strikeEm(text);
    prehead = [0,(text.length*2)];
    if(selected=='')
      _TEXT.setValue( ret, prehead );
    else
      _TEXT.replaceSelected( ret, prehead );
  
    return endFocus();
  }else{

    var is_youtube_link = function(text){
      text = trimStr ( text ); //trim
      var rx;
      if( rx = text.match(/\byoutube\.com\/(?:watch\?v=)?(?:v\/)?([^&]+)/i) ){
        text = ( rx ? rx[1] : '');
      }else if( !/^[\d\w-]+$/.test(text) )
        text = false;
      return text;
    };
    
    if(selected==''){
      switch(tag){
      case 'transparent':
        tagprop = tag;
        text = prompt('Please enter the Text to be transparent:', 'text hantu');
      break;
      case 'noparse':
        text = prompt('Please enter Text or/with Tags to be no parsed:', '[code]-CODE-[/code]');
      break;
      case 'link':
        text = prompt('Please enter the URL of your link:', 'http://');
        tagprop = text;
      break;
      case 'picture':
        text = prompt('Please enter the URL of your image:', 'http://');
      break;
      case 'youtube':
        text = prompt('Please enter the Youtube URL or just the ID, \nhttp:/'+'/www.youtube.com/watch?v=########', '');
      break;
      }
      if(text==null) return endFocus();
      if(tag=='youtube')
        text = is_youtube_link(text);
      if(tag=='link' || tag=='picture')
        text = (isLink(text) ? text : null);
      if( !text ){
        return endFocus();
      }else{
        prehead = [('['+pTag[tag] + (tagprop!=''?'='+tagprop:'')+']').length, 0];
        prehead[1] = (prehead[0]+text.length);
        _TEXT.setValue( '['+pTag[tag] + (tagprop!=''?'='+tagprop:'')+']'+text+'[/'+pTag[tag]+']', prehead );
      }
      return endFocus();
    } // end selected==''
    
    tagprop = (tag=='transparent' ? 'transparent' : '');
    if(tag=='link'||tag=='image'||tag=='youtube'){
    
      ptitle=(tag=='youtube' ? ['Please enter the Youtube URL or just the ID, \nhttp:/'+'/www.youtube.com/watch?v=########',''] : ['Please enter the URL of your '+tag+':','http://']);
      text = prompt( ptitle[0], ptitle[1] );
      if(text==null) return endFocus();
    
      switch(tag){
        case 'link':
          tagprop = text;
          text = selected;
        break;
        case 'youtube':
          text = is_youtube_link(text);
          if(!text) return endFocus();
        break;
      }
      prehead = [('['+ pTag[tag] + (tagprop!=''?'='+tagprop:'')+']').length, 0];
      prehead[1] = (prehead[0]+text.length);
      _TEXT.replaceSelected( '['+pTag[tag] + (tagprop!=''?'='+tagprop:'')+']'+text+'[/'+pTag[tag]+']', prehead );
      return endFocus();
    }
    _TEXT.wrapValue( pTag[tag], (tagprop!='' ? tagprop:'') );
  }
}


function click_BIU(title){
  var pTag={
    'bold' :'B',    'italic' :'I',      'underline':'U',
    'left' :'LEFT', 'center' :'CENTER', 'right'    :'RIGHT'
  };
  if(title.indexOf('align ')!=-1) title = title.replace('align ','');
  if( isUndefined( pTag[title]) ) return;
  
  _TEXT.init();
  _TEXT.wrapValue( pTag[title], '' );
  _TEXT.pracheck();
}


function eventsController(){
  $('#form-title').focus(function(){
    var T=$(this), par = T.parent();
    if( par.attr('class').indexOf('condensed')!=-1 ){
      par.removeClass('condensed');
      T.val('');
    }
  }).blur(function(){
    var T=$(this), par = T.parent();
    if( trimStr( T.val() )=="" ){
      T.val( gvar.def_title );
      par.addClass('condensed');
    }
  }).keydown(function(ev){
    if(ev.keyCode==9)
      gvar.$w.setTimeout(function(){ $('#'+gvar.tID).focus() }, 50);
  }).keyup(function(){
    if ($(this).val() != "") $("#close_title").show();
    else $("#close_title").hide()
  });

  $("#pick_icon").click(function () {
    gvar.$w.clearTimeout(gvar.sTryEvent);
    $("#menu_posticon").slideToggle(81, function () {
      var editmode = $('.edit-options').is(':visible');
      if ($("#menu_posticon").is(":visible")){
        editmode && $('.edit-options .add-on').css('visibility', 'hidden');
        $("#fakefocus_icon").focus();
      }else{
        editmode && $('.edit-options .add-on').css('visibility', 'visible');
        $("#form-title").focus()
      }
    })
  });
  $("#fakefocus_icon").blur(function () {
    if ($("#menu_posticon").is(":visible")) gvar.sTryEvent = gvar.$w.setTimeout(function () {
      $("#pick_icon").click()
    }, 200)
  });
  
  $("#menu_posticon li a").each(function () {
    $(this).click(function () {
      var img = $(this).find("img");
      $("#hid_iconid").attr("checked", true);
      $("#hid_iconid").val($(this).attr("data-rel"));
      if (img.length == 0) {
        $("#img_icon").hide();
        return
      }
      $("#img_icon").attr("src", img.attr("src")).show()
    })
  });
  $("#close_title").click(function () {
    $("#form-title").val("").focus();
    $("#close_title").hide()
  });
  
  // menus
  $('#mnu_add_title').click(function(){
    !$('.ts_fjb-type').is(':visible') &&
    $('.title-message').slideToggle(123, function(){
      if( !$('.title-message').is(":visible") ){
        $("#hid_iconid").val(0);
        $("#img_icon").attr("src", "#").hide();
        $("#form-title").val("");
        $("#close_title").hide()
      }else{
        $("#form-title").focus()
      }
      $("#hid_iconid").attr("checked", true)
    });
  });
  
  
  // render font's fonts
  $('.fonts ul li a').each(function(){ $(this).css('font-family', $(this).attr('title')) });
  
  $('.markItUpDropMenu').each(function(){
    $(this).hover(function() {
      $(this).find('> ul').show();
      var that = $(this);
      // close dropmenu if click outside
      $(document).one('click', function() { $(that).find('> ul').hide() });
    }, function() {
      gvar.$w.clearTimeout( gvar.sTryHoverMenu );
      $(this).find('> ul').hide()
    });
  });
  
  // main-controller
  $('.markItUpButton a').each(function(){
    var el = $(this), _cls = el.attr('class'), par = el.parent();
    if( _cls && _cls.indexOf('ev_') != -1 ){
      _cls = _cls.replace(/ev_/,'');
      var tag, title, pTag;
      
      switch(_cls){
       case "biu": case "align":
        el.click(function(){
          title = $(this).attr('title').toLowerCase();
          click_BIU( title );
        });
       break;
       case "font":
        el.click(function(){
          _TEXT.init();
          do_insertTag('FONT', $(this).attr('title'), $(this));
          
          _TEXT.pracheck();
        });
       break;
       case "size":
        el.click(function(){
          _TEXT.init();
          do_insertTag('SIZE', $(this).attr('title'), $(this));
          
          _TEXT.pracheck();
        });
       break;
       case "color":
        el.click(function(){
          _TEXT.init();
          do_insertTag('COLOR', $(this).attr('title'), $(this));
          
          _TEXT.pracheck();
        });
       break;
       case "list":
        el.click(function(){
          _TEXT.init();
          var mode, title = $(this).attr('title').toLowerCase().replace(' list', '');
          
          mode=(title=='numeric' ? 'number':'dot'), selected = _TEXT.getSelectedText();
          
          if(selected=='') {
            var reInsert = function(pass){
              var ins=prompt("Enter a list item.\nLeave the box empty or press 'Cancel' to complete the list:");
              _TEXT.init();
              if(ins){
                _TEXT.setValue( '\n' + '[*]' + ins + '');
                reInsert(true);
              }else{
                return; 
              }
            };  
            do_insertTag('LIST', (mode=='number' ? 1:false) );
            gvar.$w.setTimeout(function(){ reInsert(); }, 10);
          }else{
            var ret = '', parts = selected.split('\n');
            for(var i=0; i< parts.length; i++)
              if(trimStr(parts[i])) ret+= '\n' + '[*]' + parts[i] + '';
            ret = '[LIST'+(mode=='number' ? '="1"' : '')+']' + ret + '\n[/LIST]';
            _TEXT.replaceSelected( ret, [0, ret.length] );
          }
          _TEXT.pracheck();
        });
       break;
       case "media":
        el.click(function(){
          tag = $(this).attr('data-bbcode');
          do_insertCustomTag( tag );
          
          _TEXT.pracheck();
        });

       break;
       case "codes":
        el.click(function(){
          tag = $(this).attr('data-bbcode');
          do_insertCustomTag( tag );
          
          _TEXT.pracheck();
        });

       break;
       case "quotes":
        el.click(function(){
          tag = $(this).attr('data-bbcode');
          do_insertCustomTag( tag );
          
          _TEXT.pracheck();
        });
       break;
       case "misc":
        el.click(function(){
          tag = $(this).attr('data-bbcode');
          do_insertCustomTag( tag );
          
          _TEXT.pracheck();
        });
       break;
       case "smiley":
        el.click(function(){
          var cbs = '.box-smiley', tgt_autoload = null;
          if( !$(cbs).is(':visible') ){
            if( !$(cbs).hasClass('events') ){
                clog('bloom ber events')
              $(cbs + ' .goog-tab').each(function(){
                var id, T = $(this);
                $(this).hover(
                  function(){$(this).addClass('goog-tab-hover')},
                  function(){$(this).removeClass('goog-tab-hover')}
                );
                $(this).click(function(){
                  var tid = $(this).attr('id');
                  if( tid ){
                    $(this).parent().find('.goog-tab-selected').removeClass('goog-tab-selected');
                    $(this).addClass('goog-tab-selected');
                    
                    // switch to sandboxed
                    _SML_.load_smiley( 'tabs-sb-' + tid );
                  }else{
                    // it must be close tab //close-tab
                    _SML_.toggletab(false);
                  }
                });
              });
              if(gvar.settings.autoload_smiley[0] == 1)
                tgt_autoload = gvar.settings.autoload_smiley[1];
              
              _SML_.init();
            }
            _SML_.toggletab(true);
            
            if(tgt_autoload && gvar.freshload)
                $('div.goog-tab#t'+tgt_autoload).click();
            
          }else{
            _SML_.toggletab(false);
          }
        });

       break;
       case "upload":
        el.click(function(){
          var cbu = '.box-upload';
          if( !$(cbu).is(':visible') ){
            if( !$(cbu).hasClass('events') ){
              $(cbu + ' .goog-tab').each(function(){
                var id, T = $(this);
                T.hover(
                  function(){T.addClass('goog-tab-hover')},
                  function(){T.removeClass('goog-tab-hover')}
                ).click(function(){
                  if( !T.attr('id') ){
                    // it must be close tab //close-tab
                    _UPL_.toggletab(false);
                  }
                });
              });
              _UPL_.init();
            }else{
              _UPL_.toggletab(true);
            }
          }else{
            _UPL_.toggletab(false);
          }
        });
       break;
      } // end switch

    }
  });
}

// proses event triger setelah start_main selesai me-layout template
function eventsTPL(){
  gvar.sTryEvent = null;
  
  $('#sbutton').click(function(ev){
    do_an_e(ev);
    _BOX.init();
    _BOX.presubmit();
  });
  $('#sadvanced').click(function(ev){
    do_an_e(ev);
    if( $('#form-title').closest('div.condensed').length == 1 )
      $('#form-title').val("");
    $('#formform').submit();
  });
  $('#spreview').click(function(ev){
    do_an_e(ev);
    _BOX.init();
    _BOX.preview();
  });
  $('#squote_post').click(function(){
    _AJAX.quote( $(this), function(){
      var func = function(){
        $('#dismiss_request').click(function(){ _NOFY.dismiss() });
      };
      _NOFY.init({msg:'Fetching... <a id="dismiss_request" href="javascript:;">Dismiss</a>', cb:func, btnset:false});
    }, function(){
      clear_quoted();
      _TEXT.lastfocus();
    });
  });
  $('#chk_fixups').click(function(){
    var chk, cssid = 'css_inject_widefix';
    if( chk = $(this).is(':checked')) {
      if($('#'+cssid).get(0))
        $('#'+cssid).remove();
      GM_addGlobalStyle(rSRC.getCSSWideFix(), cssid, 1);
    }else{
      $('#'+cssid).remove();
    }
    setValue(KS+'WIDE_THREAD', (chk ? '1' : '0'));
  });
  $('#squick_quote').click(function(){
    _QQparse.init();
  });
  
  $('#scancel_edit').click(function(){ _AJAX.edit_cancel() });
  $('#clear_text').click(function(){
    _TEXT.set("");
    _TEXT.pracheck();
    _DRAFT.provide_draft()
    $(this).hide()
  });
  $('#qr_chkval').click(function(){
    precheck_quoted( $('#tmp_chkVal').val() );
  });
  $('.ts_fjb-tags #form-tags').keydown(function(ev){
    var A = ev.keyCode || ev.keyChar;
    if(A === 9){
      do_an_e(ev);
      gvar.$w.setTimeout(function(){ $('#sbutton').focus() }, 50);
    }
  });
  $('.edit-reason #form-edit-reason').keydown(function(ev){
    var A = ev.keyCode || ev.keyChar;
    if(A === 9){
      do_an_e(ev);
      gvar.$w.setTimeout(function(){
        if( $('.ts_fjb-tags').is(':visible') )
          $('.ts_fjb-tags input[type="text"]:first').focus()
        else
          $('#sbutton').focus()
      }, 50);
    }
  });
  $('.additional_opt_toggle').click(function(){
    var $el = $('#additionalopts');
    if( $el.is(':visible') ){
      $el.hide();
      $(this).removeClass('active');
    }
    else{
      $el.show();
      $(this).addClass('active');
    }
  })

  $('#settings-button').click(function(){ _STG.init(); });
  
  gvar.maxH_editor = ( parseInt( getHeight() ) - gvar.offsetEditorHeight );
  _TEXT.setElastic(gvar.maxH_editor);
  $('#'+gvar.tID).focus(function(){
    if( gvar.settings.txtcount ){
      $('.counter:first').addClass('kereng');
      _TEXTCOUNT.init('#qr-content-wrapper .counter')
    }
  }).blur(function(){
    if( gvar.settings.txtcount ){
      $('.counter:first').removeClass('kereng');
      _TEXTCOUNT.dismiss();
    }
  }).keydown(function(ev){
    var B, A = ev.keyCode || ev.keyChar, pCSA = (ev.ctrlKey ? '1':'0')+','+(ev.shiftKey ? '1':'0')+','+(ev.altKey ? '1':'0');
    
    if(A === 9){
      do_an_e(ev);
      gvar.$w.setTimeout(function(){ $('#sbutton').focus() }, 50);
    }   
    
    // area kudu dg CSA
    if( (pCSA=='0,0,0' || pCSA=='0,1,0') || (A < 65 && (A!=13 && A!=9)) || A > 90 )
      return;
    
    var asocKey={
       '83':'sbutton'   // [S] Submit post
      ,'80':'spreview'  // [P] Preview
      ,'88':'sadvanced' // [X] Advanced
      
      ,'66' : 'bold' // B
      ,'73' : 'italic' // I
      ,'85' : 'underline' // U
      
      ,'69' : 'center' // E
      ,'76' : 'left' // L
      ,'82' : 'right' // R
    };
    if(ev.ctrlKey){

      if( $.inArray( A, [13,66,73,85,69,76,82] ) != -1 ){
        do_an_e(ev);
        if(A===13)
          $('#sbutton').click();
        else
          click_BIU( asocKey[A] );
      }
    }else if(ev.altKey){
      do_an_e(ev);
      $('#' + asocKey[A]).click();
    }
  }).keyup(function(ev){
    $('#clear_text').toggle( $(this).val()!=="" );
  });

  $('#qrtoggle-button').click(function(){
    $('#formqr').toggle(180, function(){
      toggleTitle();
      $('#'+gvar.tID).focus();
    });
  });
  
  // global-shortcut
  $(window).keydown(function (ev) {
    var A = ev.keyCode, doThi=0, CSA_tasks, pCSA = (ev.ctrlKey ? '1':'0')+','+(ev.shiftKey ? '1':'0')+','+(ev.altKey ? '1':'0');
    
    if( A == 27 && $("#" + _BOX.e.dialogname).is(":visible") && $("#" + _BOX.e.dialogname).css('visibility')=='visible' ){
      do_an_e(ev);
      close_popup();
      $("#" + gvar.tID).focus();
      return;
    }
    
    if( (pCSA=='0,0,0' || pCSA=='0,1,0') || A < 65 || A > 90 )
      return;
      
    CSA_tasks = {
       quickreply: gvar.settings.hotkeykey.toString() // default: Ctrl+Q
      ,fetchpost: (!gvar.isOpera ? '0,0,1' : '1,0,1' ) // Alt+Q [FF|Chrome] --OR-- Ctrl+Alt+Q [Opera]
      ,ctrlshift: '1,1,0' // Ctrl+Shift+..., due to Ctrl+Alt will be used above
    };
    
    switch(pCSA){ // key match in [Ctrl-Shift-Alt Combination]
    case CSA_tasks.quickreply:
      var cCode = gvar.settings.hotkeychar.charCodeAt();
      if(A == cCode) {
        doThi = 1;
        scrollToQR();
      }
      break;
    case CSA_tasks.fetchpost:
      if(A == 81) { // keyCode for Q
        doThi = 1;
        scrollToQR();
        $('#squote_post').click();
      }
      break;
    case CSA_tasks.ctrlshift:
      if(A == 81) { // keyCode for Q
        doThi=1;
        $('#sdismiss_quote').click()
      }else if(A == 68 // keyCode for D
          && !$('#qrdraft').hasClass('jfk-button-disabled') ){
          doThi=1;
          scrollToQR();
          $('#qrdraft').click();
      }
      break;
    };
    if(doThi) do_an_e(ev);
  }).resize(function () {
    var b = ($("#main > .row > .col").get(0) ? $("#main > .row > .col").width() : $('body').width());
    gvar.bodywidth = b;
    gvar.maxH_editor = parseInt( getHeight() ) - gvar.offsetEditorHeight;
    resize_popup_container();
  });


  if( gvar.settings.qrdraft ){
    $('#'+gvar.tID).keypress(function(e){
      var A = e.keyCode;
      if( A>=37 && A<=40 ) return; // not an arrow
      if( $('#qrdraft').get(0) )
        _TEXT.saveDraft(e);
      clearTimeout( gvar.sITryLiveDrafting );
      gvar.isKeyPressed=1; _DRAFT.quick_check();
    });
    
    // initialize draft check
    _DRAFT._construct();
    _DRAFT.check();

    // event click for save_draft
    $("#qrdraft").click(function(){
      var text, disb, me=$(this);
      text = $('#'+gvar.tID).val();
      disb = 'jfk-button-disabled';
      if( me.hasClass(disb) ) return;
      if( me.attr('data-state') == 'idle' ){
        _TEXT.init();
        if( text == gvar.silahken || text=="" ){
          _TEXT.set( gvar.tmp_text );
          _TEXT.lastfocus();
        }
        else{
          _TEXT.add( gvar.tmp_text );
        }
        $('#draft_desc').html('');
        me.html('Saved').attr('data-state', 'saved');
        _DRAFT.switchClass(disb);
        _TEXT.setElastic(gvar.maxH_editor);
      }else{
        if( text!=gvar.silahken && text!="" )
          _DRAFT.save();
      }
    });
  }

  if( !gvar.settings.txtcount ){
    $('.counter').hide();
  }
  
  eventsController();
  resize_popup_container(); // init to resize textarea
}

function get_userdetail() {
  var a={}, b, c; 
  c = $(".vcard.user");
  b = /\/profile\/(\d+)/.exec($(c).html());
  d = $(c).find('.fig img');
  a = {
     id: ("undefined" != typeof b[1] ? b[1] : null)
    ,name: $(c).find('.fn').text()
    ,photo:$(d).attr('src')
    ,isDonatur: ($('#quick-reply').get(0) ? true : false)
  };
  return a
}

function getSettings(stg){
  /**
  eg. gvar.settings.updates_interval
  */
  var hVal, settings = { lastused:{}, userLayout:{} };
  
  settings.lastused.uploader = getValue(KS+'LAST_UPLOADER');
  
  settings.userLayout.config = [];
  settings.userLayout.template = getValue(KS+'LAYOUT_TPL');
  
  settings.hideavatar = (getValue(KS+'HIDE_AVATAR') == '1');
  settings.minanimate = (getValue(KS+'MIN_ANIMATE') == '1');
  settings.qrdraft = (getValue(KS+'QR_DRAFT') != '0');
  settings.hotkeykey = getValue(KS+'QR_HOTKEY_KEY');
  settings.hotkeychar = getValue(KS+'QR_HOTKEY_CHAR');
  settings.tmp_text = getValue(KS+'TMP_TEXT');
  settings.updates = (getValue(KS+'UPDATES') == '1');
  settings.txtcount = (getValue(KS+'TXTCOUNTER') == '1');
  settings.scustom_noparse = (getValue(KS+'SCUSTOM_NOPARSE') == '1');
  settings.autoload_smiley = getValue(KS+'SHOW_SMILE');
  settings.widethread = (getValue(KS+'WIDE_THREAD') == '1');
  

  // hotkey settings, predefine [ctrl,shift,alt]; [01]
  hVal = settings.hotkeykey;
  settings.hotkeykey = ( hVal && hVal.match(/^([01]{1}),([01]{1}),([01]{1})/) ? hVal.split(',') : ['1','0','0'] );
  hVal = trimStr(settings.hotkeychar);
  settings.hotkeychar = ( !hVal.match(/^[A-Z0-9]{1}/) ? 'Q' : hVal.toUpperCase() );
  
  // smiley
  hVal = settings.autoload_smiley;
  settings.autoload_smiley = (hVal && hVal.match(/^([01]{1}),(kecil|besar|custom)+/) ? hVal.split(',') : ['0,kecil'] );

  // is there any saved text
  gvar.tmp_text = settings.tmp_text;
  if( gvar.tmp_text!='' && !settings.qrdraft ){
    setValue(KS+'TMP_TEXT', ''); //set blank to nulled it
    gvar.tmp_text = null;
  }
  delete (settings.tmp_text);

  // get layout config
  settings.userLayout.config = ('0,0').split(',');
  settings.userLayout.template = '[B]{message}[/B]';

  hVal = getValueForId(gvar.user.id, 'LAYOUT_CONFIG', [null,null]);
  if( !hVal ) hVal = ['', '0,0'];
  settings.userLayout.config = hVal[1].split(',');

  hVal = getValueForId(gvar.user.id, 'LAYOUT_TPL', ['<!>','::']);
  if( !hVal ) hVal = ['', '[B]{message}[/B]'];
  try{
    // warning this may trigger error
    settings.userLayout.template = decodeURIComponent(hVal[1]).replace(/\\([\!\:])/g, "$1");
    
  }catch(e){
    clog('decodeURI in get setting failed');
    settings.userLayout.template = (hVal[1]).replace(/\\([\!\:])/g, "$1");
  }

  getUploaderSetting();

  gvar.settings = settings;
  gvar.settings.done = 1;
  
  return settings;
}

function getUploaderSetting(){
  // uploader properties
  gvar.upload_sel={
     imageshack:'imageshack.us'
    ,imgzzz:'imgzzz.com'
    ,cubeupload:'cubeupload.com'
    ,imagetoo:'imagetoo.com'
    ,uploadimage_uk:'uploadimage.co.uk'
    ,uploadimage_in:'uploadimage.in'
    ,imgur:'imgur.com'
    ,imagevenue:'imagevenue.com'
  };
  gvar.uploader={
    imageshack:{
      src:'imageshack.us'
      ,post:'post.imageshack.us/'
      ,ifile:'fileupload'
      ,hids:{
         refer:'http://'+'imageshack.us/?no_multi=1'
        ,uploadtype:'on'
      }
    }
    ,imgur:{
      src:'imgur.com',noCross:'1' 
    }
    ,imgzzz:{
      src:'imgzzz.com',noCross:'1' 
    }
    ,cubeupload:{
      src:'cubeupload.com',noCross:'1' 
    }
    ,imagevenue:{
      src:'imagevenue.com/host.php',noCross:'1' 
    }
    ,imagetoo:{
      src:'imagetoo.com',noCross:'1' 
    }
    ,uploadimage_uk:{
      src:'uploadimage.co.uk',noCross:'1' 
    }
    ,uploadimage_in:{
      src:'uploadimage.in',noCross:'1' 
    }
  };
  // set last-used host
  try{
    if( gvar.settings.lastused.uploader )
      gvar.upload_tipe= gvar.settings.lastused.uploader;
    if( isUndefined( gvar.upload_sel[gvar.upload_tipe] ) )
      gvar.upload_tipe='kaskus';
  }catch(e){ gvar.upload_tipe='kaskus' }
}


function toggleTitle(){
  if( $('#formqr').is(':visible') ){
    $('#qrtoggle-button').html('&#9650;');
  }else{
    $('#qrtoggle-button').html('&#9660;');
  }
}

function resize_popup_container(force_width){
  var mW  = ( $('.hfeed').find('.entry').width() + 163 ); 
  
  var bW, bH = parseInt( getHeight() ), cTop=0;
  if( force_width )
    bW = force_width;
  else if( $(".modal-dialog").hasClass('static_width') )
    bW = $(".modal-dialog").width();
  else
    bW = ( gvar.bodywidth-100 );
  
  if( $(".modal-dialog").length > 0){
    var xleft = (document.documentElement.clientWidth/2) - ( (bW/2) + 50 );
    clog('bW:'+bW);
    clog('left:'+xleft);

    $('.modal-dialog')
      .css('top', gvar.offsetLayer + 'px')
      .css('width', bW + 'px')
      .css('left', ( (document.documentElement.clientWidth/2) - ( (bW/2) + 50 ) ) + 'px');

    cTop = (bH/2) - ( $('.modal-dialog').height()  ) - 5;
    bW = 305;
    $('.capcay-dialog')
      .css('top', cTop + 'px')
      .css('width', bW + 'px')
      .css('left', ( (document.documentElement.clientWidth/2) - ( (bW/2) + 50 ) ) + 'px');
    $('#box_preview')
      .css('max-height', ( bH - gvar.offsetMaxHeight - gvar.offsetLayer ) + 'px');
  }
  gvar.maxH_editor = ( bH - gvar.offsetEditorHeight );  
  _TEXT.setElastic(gvar.maxH_editor, 1);
}

function finalizeTPL(){
  var sec, cck, st='securitytoken', tt = gvar.thread_type;
  sec = $('*[name="'+st+'"]' + (gvar.thread_type == 'group' ? ':last' : '') ).val();
  if( !sec ){
    // this might be inaccessible thread, wotsoever
    clog('securitytoken not found, qr-halted');
    return;
  }
  
  gvar._securitytoken = String( sec );
  $('#formform').attr('action', gvar.domain + (tt=='forum' ? 'post_reply' : 'group/reply_discussion' ) + '/' + gvar.pID + (tt=='forum' ? '/?post=' : '') );
  $('#qr-'+st).val(gvar._securitytoken);
  $('#qr-content-wrapper .message').css('overflow', 'visible');
  
  if( tt=='group' ){
    $('#qr-discussionid').val(gvar.discID);
    $('#qr-groupid').val(gvar.pID);
  }

  $('body').prepend('<div id="qr-modalBoxFaderLayer" class="modal-dialog-bg" style="display:block; visibility:hidden;"></div><div id="wraper-hidden-thing" style="visibility:hidden; position:absolute; left:-99999; bottom:-9999;"></div>')
  $('body').prepend('<input id="remote_tooltip" type="button" value="_" style="position:absolute!important; left:-9999; bottom:-9999; visibility:hidden; height:0;" onclick="remote_xtooltip(this)"/>');
  
  
  if( !gvar.user.isDonatur ){
    GM_addGlobalScript(location.protocol+ '\/\/www.google.com\/recaptcha\/api\/js\/recaptcha_ajax.js', 'recap', true);
    $('#wraper-hidden-thing').append( rSRC.getBOX_RC() );
  }

  if( gvar.settings.widethread ){
    GM_addGlobalStyle(rSRC.getCSSWideFix(), 'css_inject_widefix', 1);
  }
  fixerCod();
}

// <br/> inside <pre>? ergh
function fixerCod(){
  $('.hfeed >.entry').each(function(){
    var rx, $e, $pre = $(this).find('pre');
    if( !$pre.length ) return true;

    $e = $pre.find('a:last');
    rx = /\[\/CODE\](?:.+)?/i;
    if($e.length && (cucok = rx.exec( $e.attr('href') )) )
      $e.attr('href', $e.attr('href').replace(rx, '') );

    $pre.find('br')
      .attr('style', 'display:block; margin-top:-12px;');
  });
}

function slideAttach(that, cb){
  var landed, tgt, destination, scOffset, prehide, isclosed, delay;
  tgt = $(that).closest('.row').find('.col:first');
  
  prehide = ($('#'+gvar.qID).closest('.row').attr('id') != tgt.parent().attr('id') );
  isclosed = !$('#formqr').is(':visible');
  delay = 350;
  
  if( prehide )
    $('#'+gvar.qID).hide();
  else
    delay = 100;
  
  destination = $(that).offset().top
  scOffset = Math.floor(gvar.$w.innerHeight / 5) * 2;
  landed = 0;
  $("html:not(:animated),body:not(:animated)").animate({ scrollTop: (destination-scOffset)}, delay, function() {
    if( !prehide && !isclosed ) {
      if(landed) return;
      $('#'+gvar.tID).focus();
      if( typeof cb == 'function') cb(that);
      landed = 1;
      return;
    } 
    tgt.append( $('#'+gvar.qID) );
    if(isclosed) toggleTitle();
    $('#formqr').show();
    $('#'+gvar.qID).slideDown(220, function(){
      if(landed) return;
      $('#'+gvar.tID).focus();
      if( typeof cb == 'function') cb(that);
      landed = 1;
    });
  });
}

function scrollToQR(){
  $('#' + gvar.qID).closest('.row').find('.button_qr').click();
}

// eval tooltip crossed dom, due to issue Opera
function xtip(sel, dofind){
  var $tgt = $('#remote_tooltip');
  $tgt.attr('data-selector', sel);
  dofind && $tgt.attr('data-selector_find', dofind);
  $tgt.click();
}

function start_Main(){

  var _loc = location.href;
  gvar.thread_type = (_loc.match(/\.kaskus\.[^\/]+\/group\/discussion\//) ? 'group' : (_loc.match(/\.kaskus\.[^\/]+\/show_post\//) ? 'singlepost' : 'forum') );
  gvar.classbody = String($('body').attr('class')).trim(); // [fjb,forum,group]
  
  if(gvar.thread_type == 'singlepost')
    return fixerCod();

  gvar.user = get_userdetail();
  // do nothin if not login | locked thread
  if( !gvar.user.id || $('.icon-lock').get(0) || !$('*[name="securitytoken"]').val() ){
    clog('Not login, no securitytoken, locked thread, wotever, get the "F"-out');
    return
  }
  GM_addGlobalStyle( rSRC.getCSS() ); 
  gvar.bodywidth = $('#main .col:first').width(); 
  
  gvar.last_postwrap = $('.hfeed:last').closest('.row').attr('id');
  
  // may reffer to groupid
  gvar.pID = (function get_thread_id(href){
    // *.kaskus.*/group/reply_discussion/6124
    // *.kaskus.*/post_reply/000000000000000007710877
    
    var cck, tt = gvar.thread_type;
    if( tt == 'group' ){
      cck = /\/group\/discussion\/([^\/]+)\b/i.exec( location.href );
      gvar.discID = (cck ? cck[1] : null);
    }
    cck = (tt == 'forum' ? /\/post_reply\/([^\/]+)\b/.exec( href ) : /\/reply_discussion\/([^\/]+)\b/.exec( href ) );
    return (cck ? cck[1] : false);
  })( $('#act-post').attr('href') );  
  gvar.settings = getSettings( gvar.settings );
  
  var maxTry = 50, iTry=0,
  wait_settings_done = function(){
    if( !gvar.settings.done && (iTry < maxTry) ){
      gvar.$w.setTimeout(function(){wait_settings_done() }, 60);
      iTry++;
    }else{
      var $_1stlanded, mq_class = 'multi-quote';
      
      // need a delay to get all this settings
      gvar.$w.setTimeout(function(){
        
        // push qr-tpl
        if(gvar.last_postwrap){
          $_1stlanded = $('#'+gvar.last_postwrap);
        }else{
          // di groups
          $_1stlanded = $('.hfeed:last').closest('.row');
        }
        $_1stlanded.find('.col').append( rSRC.getTPL() );
        // ignite show..
        $('#markItUpReply-messsage').show();
        
        $('.user-tools').each(function(idx){
          if(gvar.thread_type == 'group')
            $(this).closest('.row').attr('id', 'grpost_' + idx);
            
          var qqid, entry_id = $(this).closest('.row').attr('id');
          
          // leave quote button alone
          $(this).find('.button_qr').remove();

          $(this)
            .append('<a href="#" id="button_qr_'+ entry_id +'" class="button small white button_qr button_qrmod" rel="nofollow" onclick="return false" style="margin-left:5px;"> Quick Reply</a>')
            .append('<a href="#" id="button_qq_'+ entry_id +'" class="button small green button_qq" data-original-title="Quick Quote" rel="tooltip" onclick="return false" style="margin-left:-7px; padding:0 10px 0 12px;"><i class="icon-share-alt icon-large"></i> </a>')
          ;
          // event for quick reply
          $(this).find('.button_qr').click(function(ev){
            do_an_e(ev);
            var dothat = function(){
              slideAttach(that)
            }, that = $(this);
            if( gvar.edit_mode == 1 ){
              if( _AJAX.edit_cancel(false) )
                dothat();
              else
                _TEXT.focus();
            }else dothat();
          });
          
          // event for quote-quote
          $(this).find('.button_qq').click(function(ev){
            do_an_e(ev);
            var dothat = function(that){
              slideAttach(that, function(el){
                _QQparse.init(el, function(){
                  _TEXT.lastfocus();
                });
              });
            }, that = $(this);
            
            if( gvar.edit_mode == 1 ){
              if( _AJAX.edit_cancel(false) )
                dothat( $(this) );
              else
                _TEXT.lastfocus();
            }else dothat( $(this) );
          });
          
          // add-event to multi-quote
          $(this).find('a[id^="mq_"]').click(function(ev){
            if(gvar.sTry_canceling){
              delete(gvar.sTry_canceling);
              return;
            }
            if( gvar.edit_mode == 1 ){
              if( _AJAX.edit_cancel(false) ){
                window.setTimeout(function(){$('#qr_chkcookie').click()}, 100);
              }else{
                gvar.sTry_canceling = 1;
                $(this).click();
              }
            }else{
              window.setTimeout(function(){$('#qr_chkcookie').click()}, 100);
            }
            if(!$(this).hasClass(mq_class))
              $(this).addClass(mq_class)
          }).addClass(mq_class);
          
          // event for quick edit
          $(this).find('a[href*="/edit_post/"]').each(function(){
            $(this).click(function(ev){
              do_an_e(ev);
              _AJAX.edit( $(this), function(){
                var func = function(){
                  $('#dismiss_request').click(function(){ _NOFY.dismiss() });
                };
                _NOFY.init({mode:'quote', msg:'Fetching... <a id="dismiss_request" href="javascript:;">Dismiss</a>', cb:func, btnset:false});
              }, function(){
                _NOFY.init({mode:'edit', msg:'You are in <b>Edit-Mode</b>', btnset:true});
                _TEXT.lastfocus();
              });
              slideAttach( $(this) );
            });
          });
        });
        // end each of user-tools
        
        // kill href inside markItUpHeader
        $('.markItUpHeader a').each(function(){
          $(this).attr('href', 'javascript:;'); 
          $(this).click(function(e){ do_an_e(e) });
        });       
        
        finalizeTPL();
        $('#quick-reply').remove();
        
        eventsTPL();
        
        // almost done
        if( trimStr(gvar.tmp_text) && gvar.settings.qrdraft ){
          _DRAFT.switchClass('gbtn');
          _DRAFT.title('continue');
          $('#draft_desc').html( '<a href="javascript:;" id="clear-draft" title="Clear Draft">clear</a> | available' );
          $('#draft_desc #clear-draft').click(function(){ _DRAFT.clear() });
        }
        
        // infiltrate default script
        GM_addGlobalScript( rSRC.getSCRIPT() );
        (gvar.settings && gvar.settings.autoload_smiley[0] == 1) && window.setTimeout(function(){ $('.ev_smiley:first').length && $('.ev_smiley:first').click() }, 50);

        // trigger preload recapcay
        if(gvar.thread_type != 'group')
          window.setTimeout(function(){ $('#hidrecap_btn').click(); }, 100);

        if( !gvar.noCrossDomain && gvar.settings.updates && isQR_PLUS == 0 ){
          window.setTimeout(function(){
            //_UPD.check();
            // dead-end marker, should set this up at the end of process
            gvar.freshload=null;
          }, 2000);
        }
        $('.bottom-frame').is(':visible') && $('.btm-close').click();
        
        // opera is need backup evaluating js
        if(gvar.isOpera){
          window.setTimeout(function(){
            xtip('.user-tools', '*[rel="tooltip"]');
            xtip('#'+gvar.qID, '*[rel="tooltip"]');
          }, 1500);
        }else{
          $('.user-tools, #'+gvar.qID).find('*[rel="tooltip"]').tooltip();
        }
        
      }, 50);
      // settimeout pra-loaded settings 
    }
  };
  wait_settings_done();
}

// outside forum like u.kaskus.us || imageshack.us
function outSideForumTreat(){
  var whereAmId=function(){
    var _src, ret=false;
    getUploaderSetting();
    for(var host in gvar.uploader){
      _src = gvar.uploader[host]['src'] || null;
      if( _src && self.location.href.indexOf( _src )!=-1 ){
        ret= String(host); break;
      }
    }
    return ret;
  };

  var el,els,par,lb,m=20,loc = whereAmId(),CSS="",i="!important";
  /*
  # do pre-check hostname on location
  */
  if( window == window.top ) return;
 
  
  switch(loc){
    case "imageshack":
    CSS=''
    +'h1,#top,.reducetop,#panel,#fbcomments,#langForm,.menu-bottom,#done-popup-lightbox,.ad-col,ins,div>iframe{display:none'+i+'}'
    +'.main-title{border-bottom:1px dotted rgb(204, 204, 204);padding:5px 0 2px 0;margin:5px 0 2px 0}'
    +'.right-col input{padding:0;width:99%;font-family:"Courier New";font-size:8pt}'
    ;break;
    case "imgur":
    CSS=''
    +'.panel.left #imagelist,#colorbox .top-tr, #upload-global-dragdrop,#upload-global-clipboard,#upload-global-form h1,#upload-global-queue-description{display:none'+i+'}'
    +'#gallery-upload-buttons{width:50%}'
    +'#upload-global-file-list{margin-top:-20px'+i+'}'
    +'#colorbox{position:absolute'+i+';top:0'+i+'}'
    +'.textbox.list{overflow-y:auto'+i+';max-height:100px}'
    ;break;   
    case "imagevenue":
    CSS=''
    +'table td > table:first-child{display:none'+i+'}'
    ;break;
    case "imgzzz":
    CSS=''
    +'#toper,#mem-info,#bottom, .mainbox, .imargin h4{display:none'+i+'}'
    +'body > div{position:absolute;}'
    +'#mid-part{width:30px; background:#ddd; color:transparent;}'
    ;break;
    case "cubeupload":
    CSS=''
    +'.bsap{display:none'+i+'}'
    ;break;
    case "photoserver":
    CSS=''
    +'body,.content{margin:0'+i+';margin-top:35px'+i+'}'
    +'body>img,#topbar{top:0'+i+'}'
    +'body{background-color:#fff}'
    +'#loginbar{top:38px'+i+';display:block}'
    +'#footer{padding:0}'
    +'#overlay .content{top:3px'+i+'}'
    +'#overlay{position:absolute'+i+'}'
    ;break;
    case "imagetoo":
    CSS=''
    +'#topbar, div#top{display:none'+i+'}'
    ;break;
    case "uploadimage_uk":
    CSS=''
    +'ins{display:none'+i+'}'
    +'input[type="text"].location{width:80%}'
    ;break;
    case "uploadimage_in":
    CSS=''
    +'#logo, p.teaser{display:none'+i+'}'
    +'#header{padding:0; height:25px'+i+';}'
    ;break;
  };
  // end switch loc
  if( CSS!="" ) 
    GM_addGlobalStyle(CSS,'inject_host_css', true);

  // treat on imageshack
  el = $D('//input[@wrap="off"]',null,true);
  if(loc=='imageshack' && el){
    gvar.sITryKill = window.setInterval(function() {
      if( $D('.ui-dialog') ){
        clearInterval( gvar.sITryKill );
        var lL, ealb;

        // make sure, kill absolute div layer
        lb = $D('//div[contains(@style,"z-index")]',null);
        if( lL = lb.snapshotLength ){
          for(var i=0; i<lL; i++)
            Dom.remove( lb.snapshotItem(i) )
        }
        if( $D('#ad') ) Dom.remove( $D('#ad') );
        
        window.setTimeout(function(){
          el.removeAttribute('disabled');            
          var par=el.parentNode.parentNode;
          lb = $D('.tooltip',par);
          if(lb){
            lb[0].innerHTML=lb[1].innerHTML='';
            Dom.add(el,par);
          }
          // right-col manipulator
          var ei,et,rTitle=function(t){
            var e = createEl('div',{'class':'main-title'},t);
            return e;
          }, BBCodeImg=function(A){
            return '[IMG]'+A+'[/IMG]';
          }, BBCodeTh=function(A){
            var b=A.lastIndexOf('.'),c=A.substring(0,b)+'.th'+A.substring(b);
            return '[URL='+A+']'+BBCodeImg(c)+'[/URL]';
          };
          if( lb = $D('.right-col',null) ){
            lb[0].innerHTML='';
            et=rTitle('Direct Link'); Dom.add(et, lb[0]);
            ei = createEl('input',{type:'text', value:el.value, readonly:'readonly', 'class':'readonly'});
            _o('focus',ei, function(de){selectAll(de)}); Dom.add(ei, lb[0]);
            try{ei.focus();selectAll(ei)}catch(e){}
            
            et=rTitle('BBCode IMG'); Dom.add(et, lb[0]);
            ei = createEl('input',{type:'text', value:BBCodeImg(el.value), readonly:'readonly', 'class':'readonly'});
            _o('focus',ei, function(de){selectAll(de)}); Dom.add(ei, lb[0]);
            et=rTitle('BBCode Thumbnail'); Dom.add(et, lb[0]);
            ei = createEl('input',{type:'text', value:BBCodeTh(el.value), readonly:'readonly', 'class':'readonly'});
            _o('focus',ei, function(de){selectAll(de)}); Dom.add(ei, lb[0]);
          }
        }, 500);
      }else{
        if(max>0)
          m=m-1;
        else
          clearInterval(gvar.sITryKill);
      }
    },  50);
  }
  else if(loc == 'imgur'){
    window.setTimeout(function(){
      par = $D('#content');
      par.insertBefore($D('#gallery-upload-buttons'), par.firstChild);
      try{
        Dom.remove($D('//div[contains(@class,"panel") and contains(@class,"left")]//div[@id="imagelist"]',null,true))
      }catch(e){};
    }, 300);
    gallery = imgur = null;
  }
  return false;
}
 


function init(){
  gvar.inner = {
    reply : {
      title : "Quick Reply",
      stoken  : "",
      submit  : "Post Reply"
    },
    edit  : {
      title : "Quick Edit",
      submit  : "Save Changes"
    }
  };
  gvar.titlename= gvar.inner.reply.title + (isQR_PLUS!==0?'+':'');
  
  var kdomain = domainParse();
  gvar.domain = kdomain.prot + '//' + kdomain.host +'/';
  gvar.olddomain = gvar.domain.replace(/livebeta\./i, 'www.');
  gvar.kask_domain = 'http://kask.us/';
  gvar.kkcdn = kdomain.prot + '//'+ kdomain.statics + '/';
  gvar.kqr_static = 'http://' + (gvar.__DEBUG__ ? 
    '127.0.0.1/SVN/dev-kaskus-quick-reply/statics/kqr/' : 
    'dev-kaskus-quick-reply.googlecode.com/svn/trunk/statics/kqr/'
  );

  if( !/(?:www\.|)kaskus\./.test(location.hostname) ){
    return outSideForumTreat();
  }
  
  gvar.qID= 'qr-content-wrapper';
  gvar.tID= 'reply-messsage';
  gvar.def_title= 'Type new Title';
  gvar.loging_in= 'Logging in..';
  
  gvar.B  = rSRC.getSetOf('button');
  
  gvar.freshload = 1;
  gvar.uploader = gvar.upload_sel = gvar.settings = {};
  gvar.user = {id:null, name:"", isDonatur:false};
  gvar._securitytoken_prev = gvar._securitytoken= null;
  gvar.ajax_pid= {}; // each ajax performed {preview: timestamp, post: timestamp, edit: timestamp }
  gvar.MQ_count = gvar.edit_mode = gvar.pID = gvar.maxH_editor = gvar.bodywidth = 0;
  gvar.upload_tipe = gvar.last_postwrap = "";
  
  
  gvar.offsetEditorHeight = 160; // buat margin top Layer
  gvar.offsetLayer = 10; // buat margin top Layer
  gvar.offsetMaxHeight = 115; // buat maxHeight adjustment
  
  ApiBrowserCheck();
  //gvar.css_default = 'kqr_quad'+ (gvar.__DEBUG__ && !gvar.isOpera ? '.dev' : '')  +'.css';
  gvar.css_default = 'kqr_quad'+ (gvar.__DEBUG__ && !gvar.isOpera ? '.dev' : '.' + gvar.scriptMeta.cssREV)  +'.css';
  
  gvar.injected = false;
  gvar.mx = 30; gvar.ix = 0;
  
  
  jQ_wait();
}

function jQ_wait() {
  if ( (unsafeWindow && typeof unsafeWindow.jQuery == "undefined") && gvar.ix < gvar.mx) {
    gvar.$w.setTimeout(function () { jQ_wait() }, 200);
    if( !gvar.injected ){
      GM_addGlobalScript(location.protocol + "\/\/ajax.googleapis.com\/ajax\/libs\/jquery\/1.7.1\/jquery.min.js");
      gvar.injected = true;
    }
    gvar.ix++;
  } else {
    if ("undefined" == typeof unsafeWindow.jQuery) return;
    $ = unsafeWindow.$ = unsafeWindow.jQuery = unsafeWindow.jQuery.noConflict(true);
    gvar.ix = 0;

    window.setTimeout(function(){ start_Main() }, 350);
  }
}

if('undefined' == typeof mothership)
  var $;
init();
}
// main


function addJQuery(callback) {
  var script = document.createElement("script");
  script.setAttribute("src", location.protocol + "\/\/ajax.googleapis.com\/ajax\/libs\/jquery\/1.7.1\/jquery.min.js");
  script.addEventListener('load', function() {
    var script = document.createElement("script");
    script.textContent = "(" + callback.toString() + ")();";
    document.body.appendChild(script);
  }, false);
  document.body.appendChild(script);
}


var gsv; try { gsv=GM_setValue.toString(); } catch(e) { gsv='.errGSV'; }
if( 'undefined' == typeof chrome && 'undefined' == typeof ENV && 'undefined' == typeof GM_setValue || gsv.match(/not\s+supported/i) )
  addJQuery( main );
else if( 'undefined' != typeof chrome && 'undefined' != typeof ENV )
  main('tamper');
else if( 'undefined' != typeof GM_setValue )
  main('GM');

})();