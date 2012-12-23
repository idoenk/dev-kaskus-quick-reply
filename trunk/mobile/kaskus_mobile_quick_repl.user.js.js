// ==UserScript==
// @name           Kaskus Mobile Quick Reply
// @namespace      http://userscripts.org/scripts/show/91051
// @description    Provide Quick Reply on Kaskus Mobile
// @author         idx (http://userscripts.org/users/idx)
// @version        1.0
// @dtversion      121223100
// @timestamp      1356268839221
// @include        http://m.kaskus.co.id/post/*
// @include        http://m.kaskus.co.id/thread/*
// @license        (CC) by-nc-sa 3.0
//
// -!--latestupdate
//
// v1.0 - 2012-12-09 . 1356268839221
//  new kaskus
//
// -/!latestupdate---
// ==/UserScript==
/*
//
// v0.3.4 - 2011-04-07
//  Fix always use native-XHR.
//
//
// more...
//
// v0.1.1 - 2010-11-23
// Init
//------
// ###@@###
// *dependency            https://addons.mozilla.org/en-US/firefox/addon/59/
// *XML of User Agent     http://techpatterns.com/downloads/firefox/useragentswitcher.xml
//
// Creative Commons Attribution-NonCommercial-ShareAlike 3.0 License
// http://creativecommons.org/licenses/by-nc-sa/3.0/deed.ms
// --------------------------------------------------------
*/
(function(){

  var gvar = function(){};
  gvar.sversion = 'v' + '1.0';
  gvar.scriptMeta = {
    timestamp: 1356268839221 // version.timestamp

   ,scriptID: 91051 // script-Id
  };
  /*
  javascript:window.alert(new Date().getTime());
  */
  //========-=-=-=-=--=========
  gvar.__DEBUG__ = 0; // development debug
  //========-=-=-=-=--=========

  const OPTIONS_BOX = {};
  const GMSTORAGE_PATH = 'GM_';
  const KS       = 'KEY_SAVE_';

  //========= Global Var Init ====
  var GM_XHR = {
    uri: null,
    returned: null,
    cached: false,
    request: function(cdata,met,callback){
      if(!GM_XHR.uri) return;
      met=(isDefined(met) && met ? met:'GET');
      cdata=(isDefined(cdata) && cdata ? cdata:null);
      if(typeof(callback)!='function') callback=null;
      var pReq_xhr = {
        method: met,
        url: GM_XHR.uri + (GM_XHR.cached ? '':(GM_XHR.uri.indexOf('?')==-1?'?':'&rnd=') + Math.random().toString().replace('0.','')),
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        data: (isString(cdata) ? cdata : ''),
        onload: function(ret) {
          if(callback!=null)
            callback(ret);
          else
            GM_XHR.returned = ret;
        }
      };
      NAT_xmlhttpRequest( pReq_xhr );  
    }
  };
  var Dom= {
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
  var $D=function (q, root, single) {
    var el;
    if (root && typeof root == 'string') {
        root = $D(root, null, true);
        if (!root) { return null; }
    }
    if( !q ) return false;
    if ( typeof q == 'object') return q;
    root = root || document;
    if (q[0]=='/' || (q[0]=='.' && q[1]=='/')) {
        if (single) { return document.evaluate(q, root, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue; }
        return document.evaluate(q, root, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    }
    else if (q[0]=='.') {
      el = root.getElementsByClassName(q.substr(1));
      return single ? el[0] : el;
    }
    else { return root.getElementById( (q[0]=='#' ? q.substr(1):q.substr(0)) ); }
    return root.getElementsByTagName(q);
  };
  // native/generic XHR needed for Multifox, failed using GM_xmlhttpRequest.
  var NAT_xmlhttpRequest=function(obj) {
    var request=new XMLHttpRequest();
    request.onreadystatechange=function() { if(obj.onreadystatechange) { obj.onreadystatechange(request); }; if(request.readyState==4 && obj.onload) { obj.onload(request); } }
    request.onerror=function() { if(obj.onerror) { obj.onerror(request); } }
    try { request.open(obj.method, obj.url, true); } catch(e) { if(obj.onerror) { obj.onerror( {readyState:4,responseHeaders:'',responseText:'',responseXML:'',status:403,statusText:'Forbidden'} ); }; return; }
    if(obj.headers) { for(name in obj.headers) { request.setRequestHeader(name,obj.headers[name]); } }
    request.send(obj.data); return request;
  };

  var GM_addGlobalScript = function (a, b, c) {
    var d = createEl("script", { type: "text/javascript"});
    if (isDefined(b) && isString(b)) d.setAttribute("id", b);
    if (a.match(/^https?:\/\/.+/)) d.setAttribute("src", a);
    else d.appendChild(createTextEl(a));
    if (isDefined(c) && c) {
      document.body.insertBefore(d, document.body.firstChild)
    } else {
      var e = document.getElementsByTagName("head");
      if (isDefined(e[0]) && e[0].nodeName == "HEAD") window.setTimeout(function () {
        e[0].appendChild(d)
      }, 100);
      else document.body.insertBefore(d, document.body.firstChild)
    }
    return d
  };
  var GM_addGlobalStyle=function(css, id) { // Redefine GM_addGlobalStyle with a better routine
     var sel=createEl('style',{type:'text/css'});
     if(isDefined(id) && isString(id)) sel.setAttribute('id', id);
     sel.appendChild(createTextEl(css));
     var hds = getTag('head');
     if(hds && hds.nodeName=='HEAD')
      window.setTimeout(function() { hds[0].appendChild(sel); }, 100);
     else
      document.body.insertBefore(sel,document.body.firstChild);
     return sel;
  };
  var _TEXTCOUNT = {
    init: function( target ){
      var cUL, _tc = _TEXTCOUNT;

      _tc.limitchar = (gvar.thread_type == 'group' ? 1000 : 10000);
      _tc.$editor = $D('#'+gvar.tID);
      _tc.$target = ("string" == typeof target ? $D(target,null,1) : target);

      if( _tc.$target ){
        addClass('ffc', _tc.$target);
        _tc.$target.value = _tc.count_it(_tc);
      }
      _tc.do_watch(_tc);
    },
    count_it: function(_tc){
      return (_tc.limitchar - _tc.$editor.value.length);
    },
    do_watch: function(_tc){
      gvar.sTryTCount = window.setInterval(function() {
        _tc.$target.value = _tc.count_it(_tc);
      }, 600);
    },
    dismiss: function(){
      var _tc = _TEXTCOUNT;
      gvar.sTryTCount && clearInterval( gvar.sTryTCount );
      _tc.$target && removeClass('ffc', _tc.$target);
    }
  };
  var _TEXT = {
    e : null, eNat : null,
    content: "",
    cursorPos: [],
    last_scrollTop: 0,
    insert: {
      tagBIU: function(title){
        var pTag={
          'bold' :'B',    'italic' :'I',      'underline':'U',
          'left' :'LEFT', 'center' :'CENTER', 'right'    :'RIGHT'
        };
        if(title.indexOf('align ')!=-1) title = title.replace('align ','');
        if( isUndefined( pTag[title]) ) return;

        _TEXT.init();
        _TEXT.wrapValue( pTag[title], '' );
        _TEXT.pracheck();
      },
      // action insert font/color/size/list
      tagHibrid: function(tag, value, $caleer){
        _TEXT.init();
        if(value)
          _TEXT.wrapValue(tag, value);
        else
          _TEXT.wrapValue(tag);

        if( (["FONT","COLOR","SIZE"].indexOf(tag) != -1) && $caleer ){
          showhide( closest($caleer, {'tag':'ul'}), false);
        }
        _TEXT.pracheck();
      },
      tagCustom: function(tag){
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
            text = trimStr( text );
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
    },
    init: function() {
      this.e = $D('#'+gvar.tID);
      this.eNat = Dom.g(gvar.tID);
      this.content = this.e.value;
      this.cursorPos = this.rearmPos(); // [start, end]
    },
    rearmPos: function(){ return [this.getCaretPos(), Dom.g(gvar.tID).selectionEnd]; },
    subStr: function(start, end){ return this.content.substring(start, end);},
    set: function(value){
      this.content = value;
      // track latest scrollTop, doing val() might reset it to 0
      this.last_scrollTop = Dom.g(gvar.tID).scrollTop;
      $D('#'+gvar.tID).value = this.content;
      
      //_TEXT.setRows_Elastic();
      _TEXT.init();

      //this.saveDraft();
      this.pracheck();
    },
    wrapValue : function(tag, title){
      var bufValue, st2, start = this.cursorPos[0], end = this.cursorPos[1];
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
    // ptpos stand to puretext position [start, end]
    setValue : function(text, ptpos){
      var bufValue, start = this.cursorPos[0], end=this.cursorPos[1];
      if(isUndefined(ptpos)) ptpos=[text.length,text.length];
      if(start!=end) {
        this.replaceSelected(text,ptpos);
        return;
      }
      bufValue = this.subStr(0, start) + text + this.subStr(start, this.content.length);
      this.set( bufValue );
      this.caretChk( (start+ptpos[0]), (start+ptpos[1]) );
      return bufValue; 
    },
    pracheck: function(foc){
      if( isUndefined(foc) )
        foc = true;
      
      //_TEXT.setElastic(gvar.maxH_editor);
      el = $D('.QxM',null,1);
      if( $D('#'+gvar.tID).value !="" )
        showhide(el, true);
      else
        showhide(el, false);

      foc && _TEXT.focus();
    },
    focus: function(){ 
      window.setTimeout(function(){ $D('#'+gvar.tID).focus() }, 10);
    },
    clear: function(dofocus){
      $D('#'+gvar.tID).value = this.content = '';
      dofocus && _TEXT.focus();
    },
    lastsroll: function (){
      // scroll to bottom editor line
      !_TEXT.e && (_TEXT.e = $D('#'+gvar.tID));
      _TEXT.e && _TEXT.e.scrollTop(_TEXT.e[0].scrollHeight);
    },
    getSelectedText : function() {
      return (this.cursorPos[0]==this.cursorPos[1]? '': this.subStr(this.cursorPos[0], this.cursorPos[1]) );
    },
    getCaretPos : function() {  
      var CaretPos = 0;
      if(Dom.g(gvar.tID))
        if (Dom.g(gvar.tID).selectionStart || Dom.g(gvar.tID).selectionStart == '0')
        CaretPos = Dom.g(gvar.tID).selectionStart;
      return CaretPos;
    },  
    setCaretPos : function (pos,end){
      if(isUndefined(end)) end = pos;
      if(Dom.g(gvar.tID).setSelectionRange)    { // Firefox, Opera and Safari
        this.focus();
        Dom.g(gvar.tID).setSelectionRange(pos,end);
      }
    },

    caretChk: function(s,e){
      this.setCaretPos(s, e);
      // restore scrollTop on overflow mode:scroll
      if(this.last_scrollTop && _TEXT.overflow!='hidden')
        Dom.g(gvar.tID).scrollTop = (this.last_scrollTop+1);
    }
  };

  //=== rSRC
  var rSRC = {
    mCls: ['mBT','mDM','<li class="mSP">---------------</li>'],
    getTPL: function(){
      return ''
      +'<div class="form-input reply-input">'
      +'<hr class="sxln"/>'
      +'<div class="legend qrtitle">'
      + '<span>mQuick Reply <a target="_blank" href="http://userscripts.org/scripts/show/'+gvar.scriptMeta.scriptID.toString()+'" class="mqrlink">'+gvar.sversion+'</a></span>'
      +'</div>'
      +'<hr class="sxln"/>'
      +'<form action="" name="postreply" method="post">'
      +'<fieldset>'
      +'<div class="in-txt" id="wrp_title">'
      + '<input type="text" name="title" maxlength="85" placeholder="Title" value="" />'
      + '<span class="Qxc tgctr" style="display:none;">&times;</span>'
      + '<span class="Qct tgctr"></span>'
      +'</div>'
      +'<div class="in-txt" id="wrp_control" style="display:none;">'
      + rSRC.getControlers()
      +'</div>'
      +'<div class="in-txt" id="wrp_msg">'
      + '<textarea name="message" id="message" placeholder="Body"></textarea>'
      + '<span class="QxM tgctr" style="display:none;">&times;</span>'
      + '<div class="chr"><input readonly="readonly" disabled="disabled" size="3" value="10000" id="txtLen" /></div>'
      +'</div>'

      +(!gvar.user.isDonatur ? ''
      +'<div class="in_cpcy_boxed" id="wrp_cpcy" style="display:none;">'
      + '<div class="center" style="position:absolute; bottom:0; left:46%; margin-bottom:-16px; font-size:20px; color:#ddd;">&#9660;</div>'

      + '<label class="cpcy-title" style="">Verification</label>'
      + '<span class="Qcp tgctr">&times;</span>'
      + '<div class="mqr-cpcy">' + rSRC.getCUSTOM_ReCapcay() + '</div>'
      +'</div>' // in_cpcy_boxed
      :'')

      +'<div class="r">'
      +(!gvar.user.isDonatur ? ''
        // fake capcay.controller [create,reload]
      + '<input id="hidrecap_btn" value="reCAPTCHA" type="button" onclick="showRecaptcha(\'in_cpcy_boxed\');" class="ninja" />' 
      + '<input id="hidrecap_reload_btn" value="reload_reCAPTCHA" type="button" onclick="Recaptcha.reload();" class="ninja" />'
      :'')
      + '<input type="hidden" name="securitytoken" id="securitytoken" value=""  />'
      + '<div class="in-btn action">' //in-btn blue
        // 1356214234-a2512d6c8da864b4f9f7aea14927321f
        // [btn-red,blue]
      +  '<input type="submit" id="sbutton" name="sbutton" class="btn btn-red" value="Post Reply" />'
      + '</div>'
      +'</div>' // r
      +'</fieldset>'
      +'</form>'
      +'</div>' // form-input
      ;
    },
    getCUSTOM_ReCapcay: function(){
      return ''
      +'<div id="recaptcha_image" style="width:300px; height: 57px;min-height:57px; display:block;"><img style="height:57px; width:300px;"/></div>'
      +'<div class="recaptcha-main">'
      +'<label style="width:100%!important; float:none!important;">'
      + '<span class="recaptcha_only_if_image" id="recaptcha_instructions_image"><strong>Please Insert Capcay</strong></span>'
      + '<span id="recaptcha_challenge_field_holder" style="display: none;"></span>'
      + '<div class="in-txt">'
      +  '<input id="recaptcha_response_field" name="recaptcha_response_field" autocomplete="off" type="text" />'

      +  '<div class="recaptcha-buttons">'
      +   '<a title="Get a new challenge" href="javascript:Recaptcha.reload()" id="recaptcha_reload_btn"><span>Reload reCapcay</span></a>'
      +   '<a title="Help" href="javascript:Recaptcha.showhelp()" id="recaptcha_whatsthis_btn"><span>Help</span></a>'
      +   '<a title="What the heck.." href="javascript:" id="recaptcha_stg"><span>Wth</span></a>'
      +  '</div>' // recaptcha-buttons
      + '</div>'
      +'</label>'
      +'<div class="recaptcha-auth" style="display:none;">'
      + '<input type="checkbox" id="chk-auth" value="1" />'
      + '<label for="chk-auth">I dont need captcha to post, remember this!</label>'
      +'</div>'
      +'</div>' //recaptcha-main
      +'';
    },

    _menuFont: function(id){
      var li_cls = rSRC.mCls, item = ['Arial','Arial Black','Arial Narrow','Book Antiqua','Century Gothic','Comic Sans MS','Courier New','Georgia','Impact','Lucida Console','Times New Roman','Trebucher','Verdana'], buff, lf=item.length;
      buff='<li class="'+li_cls[0]+' '+li_cls[0] + id + ' fonts '+li_cls[1]+'"><a title="Fonts" href="javascript:;">Fonts</a><ul>';
      for(var i=0; i<lf; i++)
        //buff+='<li class="'+li_cls[0]+' '+li_cls[0] + id +'-'+(i+1)+' font-'+item[i].toLowerCase()+'"><a title="'+item[i]+'" class="ev_font" href="javascript:;">'+item[i]+'</a></li>';
        buff+='<li class="'+li_cls[0]+' '+li_cls[0] +id+ ' font-'+item[i].toLowerCase().replace(/\s/gi,'')+'"><a title="'+item[i]+'" class="ev_font" href="javascript:;">'+item[i]+'</a></li>';
      buff+='</ul></li>';
      return buff;
    },
    _menuSize: function(id){
      var li_cls = rSRC.mCls, buff;
      buff='<li class="'+li_cls[0]+' '+li_cls[0] + id + ' size '+li_cls[1]+'"><a title="Size" href="javascript:;">Size</a><ul>';
      for(var i=1; i<=7; i++)
        buff+='<li class="'+li_cls[0]+' '+li_cls[0] + id + '-1 size-'+i+'"><a title="'+i+'" class="ev_size" href="javascript:;">'+i+'</a></li>';
      buff+='</ul></li>';
      return buff;
    },
    _menuColor: function(id){
      var li_cls = rSRC.mCls, buff, capt, kolors = rSRC.getSetOf('color');
      buff='<li class="'+li_cls[0] + ' ' + li_cls[0] + id + ' ' + li_cls[1]+'"><a title="Colors" href="javascript:;">Colors</a>';
      buff+='<ul class="mBT'+id+'-wrapper">';
      for(hex in kolors){
        capt = kolors[hex];
        buff+='<li class="'+li_cls[0] +'"><a title="'+capt+'" class="ev_color"  style="width:0; background-color:'+hex+'" href="javascript:;">'+capt+'</a></li>';
      }
      buff+='</ul></li>';
      return buff;
    },

    _menuBIU: function(start){
      var li_cls = rSRC.mCls, item = ['Bold','Italic','Underline'], buff='', lf=item.length;
      for(var i=0; i<lf; i++)
        buff+='<li class="'+li_cls[0]+' '+li_cls[0] +(i+start)+'"><a title="'+item[i]+'" class="ev_biu" href="javascript:;">'+item[i]+'</a></li>';
      return buff;
    },
    _menuAlign: function(start){
      var li_cls = rSRC.mCls, item = ['Align Left','Align Center','Align Right'], buff='', lf=item.length;
      for(var i=0; i<lf; i++)
        buff+='<li class="'+li_cls[0]+' '+li_cls[0] +(start+i)+'"><a title="'+item[i]+'" class="ev_align" href="javascript:;">'+item[i]+'</a></li>';
      return buff;
    },
    _menuList: function(ids){
      var li_cls = rSRC.mCls, item = ['Numeric list','Bulleted list'], buff='', lf=item.length;
      for(var i=0; i<lf; i++)
        buff+='<li class="'+li_cls[0]+' '+li_cls[0] +(ids[i])+'"><a title="'+item[i]+'" class="ev_list"  href="javascript:;">'+item[i]+'</a></li>';
      return buff;
    },
    _menuMedia: function(ids){
      var bbcode, li_cls = rSRC.mCls, item = ['Insert Link','Insert Picture','Embedding Youtube'], buff='', lf=item.length;
      bbcode = ['link','picture','youtube'];
      for(var i=0; i<lf; i++)
        buff+='<li class="'+li_cls[0]+' '+li_cls[0] +(ids[i])+'"><a title="'+item[i]+'" class="ev_media" data-bbcode="'+bbcode[i]+'" href="javascript:;">'+item[i]+'</a></li>';
      return buff;
    },
    _menuCode: function(ids){
      var bbcode, li_cls = rSRC.mCls, item = ['CODE','HTML','PHP'], buff='', lf=item.length;
      bbcode = ['code','html','php'];
      for(var i=0; i<lf; i++)
        buff+='<li class="'+li_cls[0]+' '+li_cls[0] +(ids[i])+'"><a title="Wrap ['+item[i]+'] around text" class="ev_codes" data-bbcode="'+bbcode[i]+'" href="javascript:;">Wrap ['+item[i]+'] around text</a></li>';
      return buff;
    },
    _menuQuote: function(ids){
      var bbcode, li_cls = rSRC.mCls, item = ['QUOTE','SPOILER'], buff='', lf=item.length;
      bbcode = ['quote','spoiler','transparent','noparse'];
      for(var i=0; i<lf; i++)
        buff+='<li class="'+li_cls[0]+' '+li_cls[0] +(ids[i])+'"><a title="Wrap ['+item[i]+'] around text" class="ev_quotes" data-bbcode="'+bbcode[i]+'" href="javascript:;">Wrap ['+item[i]+'] around text</a></li>';
      return buff;
    },
    _menuIcon: function () {
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
    getControlers: function(){
      var _sp = rSRC.mCls[2], lc=rSRC.mCls[0];
      return ''
      + '<div class="mktH">' 
      + "<ul>"
      + rSRC._menuBIU(1) 
      + _sp + rSRC._menuAlign(4) 
      + _sp + rSRC._menuList([8,7]) 
      + _sp
      + rSRC._menuFont(19) 
      + rSRC._menuSize(20) 
      + rSRC._menuColor(95) 
      + _sp + rSRC._menuMedia([11, 14, 22]) 
      + _sp + rSRC._menuCode([16, 50, 51]) 
      + _sp + rSRC._menuQuote([15, 21, 97, 52]) 
      + _sp + '<li class="' + lc + " " + lc + '53 "><a class="ev_misc" title="Strikethrough text" href="javascript:;" data-bbcode="strike">Strikethrough text</a></li>'
      + "</ul>"
      + '<div id="qr_plugins_container"></div>'
      + "</div>" // mktH
      ;
    },

    getCSS: function(){
      var imgcdn1,imgcdn2,imgcdn3, BTN;
      imgcdn1 = gvar.kkcdn + 'images/editor/';
      imgcdn2 = gvar.kkcdn + 'img/editor/';
      imgcdn3 = gvar.kkcdn + 'css_v0.1/img/editor/';
      BTN = rSRC.getSetOf('button'); // BTN.strikethrough

      return ''
      +'a.btn.qq{margin-left:5px;}'
      +'a.btn.qf{margin-right:-1px;}'
      +'a.btn.qf.bling{text-decoration:blink;}'
      +'#site-header.fx, .mQR fieldset, .mQR #wrp_title, .mQR #wrp_msg, .mqr-cpcy .in-txt{position:relative;}'
      +'#site-header.fx #site-nav, .fx hr.sxln{width:620px;position:fixed;top:0;z-index:99999;}'
      +'#site-header.fx hr.sxln{top:29px;height:2px;}'
      +'#site-header.fx .main-h.r{margin-top:30px}'

      +'.mQR .legend, .mQR .form-input{margin-bottom:0;border-bottom:0;}'
      +'.mQR .qrtitle, .mQR .qrtitle a{text-shadow:1px 1px #666;background:#f93;color:#fff;font-size:1.05em;}'
      +'.mQR .qrtitle a:hover{text-decoration:underline;}'
      +'.mQR .in-btn.action .btn{text-transform:uppercase;color:#fff;text-shadow:0 1px rgba(0,0,0,0.1);}'
      +'.mQR .btn-red{border:1px solid transparent!important;text-transform:uppercase;background-color:#d14836;background-image:linear-gradient(top,#dd4b39,#d14836);}'
      +'.mQR .form-input{padding-bottom:0; border-bottom:0;}'
      +'.mQR .form-input .action.in-btn{border:0!important; background:none;}'
      +'.mQR .form-input .action .btn{width:120px; float:none!important; margin:0 auto;}'
      +'.mQR .in-txt{margin-top:-1px;}'
      +'.mQR .in-txt #message{height:90px; min-height:50px; min-width:590px; max-width:590px;}'
      +'.mQR #txtLen.ffc{color:#666!important;}'
      +'.mQR li.mBT a{outline:none}'
      +'.mQR li.mBT {border:1px solid transparent;}'
      +'.mQR li.mBT:hover{border:1px solid #ddd;background:#f0f0f0;}'
      +'.mQR li.mDM:hover {}'
      +'.mQR #wrp_title input[type="text"]{width:94%;}'
      +'.mQR .tgctr{position:absolute;top:2px; padding:5px 3px; font-size:1.2em; line-height:0.7em; cursor:pointer;}'
      +'.mQR .tgctr:hover{color:#333!important;}'
      +'.mQR .tgctr.Qct {background:url('+BTN.contr_stg+') no-repeat;opacity:.25;width:12px;height:12px;}'
      +'.mQR .tgctr.Qct:hover, .mQR .Qct.active{opacity:.8;}'
      +'.mQR .tgctr.Qct, .mQR .tgctr.Qcp {right:3px;}'
      +'.mQR .tgctr.Qxc, .mQR .tgctr.QxM{color:#666;right:25px;border:0;}'
      +'.mQR .tgctr.Qcp{border:0;}'
      +'.mQR .ninja{position:absolute!important;z-index:99; left:-999999; visibility:hidden;}'
      +'.mQR .error{border-color:#FF0A0A;}'

      +'#wrp_cpcy {width:310px;position:absolute; z-index:999; bottom:53px; background:#e3e3e3;-moz-border-radius:10px;-webkit-border-radius:10px; border-radius:10px;border-top:solid 1px #ccc;border-right:solid 1px #ddd;border-bottom:solid 1px #ddd;border-left:solid 1px #ccc;margin:20px -20px 0; padding:10px; padding-bottom:5px;}'
      +'#wrp_cpcy .cpcy-title{font-size:1.1em; color:#666; margin:4px 0;}'
      +'.mqr-cpcy {width:310px;background:#fff;border:1px solid #e5e5e5;}'
      +'.mqr-cpcy #recaptcha_stg {background:url('+BTN.goog_stg+') no-repeat;}'
      +'.mqr-cpcy #recaptcha_reload_btn {background:url(http://ssl.gstatic.com/accounts/recaptcha-sprite.png) -63px;}'
      +'.mqr-cpcy #recaptcha_whatsthis_btn {background:url(http://ssl.gstatic.com/accounts/recaptcha-sprite.png);}'
      +'.mqr-cpcy .in-txt {margin-top:2px;}'
      +'.mqr-cpcy .in-txt input[type="text"]{padding-right:75px!important; max-width:222px;}'
      +'.mqr-cpcy .recaptcha-buttons {position:absolute;bottom:4px;right:10px;}'
      +'.mqr-cpcy .recaptcha-buttons span{text-indent:-9999px;display:block;}'
      +'.mqr-cpcy .recaptcha-buttons a {display:inline-block; height:21px;width:21px;margin-left:2px;background:#fff;background-position:center center;background-repeat:no-repeat; line-height:0; opacity:.55;outline:none;}'
      +'.mqr-cpcy .recaptcha-buttons a:hover {opacity:.8;}'
      +'.mqr-cpcy .recaptcha-auth {margin-top:4px;padding:5px 0;}'
      +'.mqr-cpcy .recaptcha-auth input[type="checkbox"] + label{display:inline-block;vertical-align:middle;height:14px;}'
      +'.mqr-cpcy .recaptcha-auth label{margin:1px 0 0 5px;}'
      +'.mqr-cpcy #recaptcha_response_field[disabled="disabled"]{color:#ccc;}'
      

      +'.sxln{margin:0;padding:0;border:0;height:1px;background:-webkit-gradient(linear,left top,right top,color-stop(0%,hsla(0,0%,0%,.04)),color-stop(50%,hsla(0,0%,0%,.35)),color-stop(100%,hsla(0,0%,0%,.04)));background:-webkit-linear-gradient(left,hsla(0,0%,0%,.04) 0,hsla(0,0%,0%,.35) 50%,hsla(0,0%,0%,.04) 100%);background:-moz-linear-gradient(left,hsla(0,0%,0%,.04) 0,hsla(0,0%,0%,.35) 50%,hsla(0,0%,0%,.04) 100%);background:-ms-linear-gradient(left,hsla(0,0%,0%,.04) 0,hsla(0,0%,0%,.35) 50%,hsla(0,0%,0%,.04) 100%);background:-o-linear-gradient(left,hsla(0,0%,0%,.04) 0,hsla(0,0%,0%,.35) 50%,hsla(0,0%,0%,.04) 100%);background:linear-gradient(left,hsla(0,0%,0%,.04) 0,hsla(0,0%,0%,.35) 50%,hsla(0,0%,0%,.04) 100%)}​'
      
      +'.mktH{background-color:#f9f9f9;zoom:1;filter:progid:DXImageTransform.Microsoft.gradient(gradientType=0,startColorstr="#FFF9F9F9",endColorstr="#FFF0F0F0");background-image:linear-gradient(top,#f9f9f90%,#f0f0f0100%)}.mktH:after{content:"";display:block;clear:both;height:0;visibility:hidden}.mktH ul li{list-style:none;float:left;position:relative;height:20px}.mktH ul .mDM{margin-right:5px;background:transparent url('+imgcdn2+'menu.png) no-repeat right center}.mktH ul .mDM li{margin-right:0}.mktH ul .mSP{width:1px;height:16px;background-color:#ddd;overflow:hidden;text-indent:-999px;margin:0 2px}.mktH ul ul{display:none;position:absolute;top:18px;left:0;background:#f5f5f5;height:inherit;z-index:10}.mktH ul ul li{float:none;border-bottom:1px solid #d6d6d6}.mktH ul li:hover>ul{display:block}.mktH ul a{display:block;width:16px;height:16px;text-indent:-10000px;background-repeat:no-repeat;margin:0;padding:3px}.mktH ul ul a{display:block;text-indent:0;width:120px;padding:5px 5px 5px 25px}.mktH ul ul a:hover{background-color:#ddd}.mQR .mBT1 a{background-image:url('+imgcdn1+'bold.gif)}.mQR .mBT2 a{background-image:url('+imgcdn1+'italic.gif)}.mQR .mBT3 a{background-image:url('+imgcdn1+'underline.gif)}.mQR .mBT4 a{background-image:url('+imgcdn1+'justifyleft.gif)}.mQR .mBT5 a{background-image:url('+imgcdn1+'justifycenter.gif)}.mQR .mBT6 a{background-image:url('+imgcdn1+'justifyright.gif)}.mQR .mBT7 a{background-image:url('+imgcdn1+'insertunorderedlist.gif)}.mQR .mBT8 a{background-image:url('+imgcdn1+'insertorderedlist.gif)}.mQR .mBT9 a{background-image:url('+imgcdn1+'indent.gif)}.mQR .mBT10 a{background-image:url('+imgcdn1+'outdent.gif)}.mQR .mBT11 a{background-image:url('+imgcdn1+'createlink.gif)}.mQR .mBT12 a{background-image:url('+imgcdn1+'unlink.gif)}.mQR .mBT13 a{background-image:url('+imgcdn1+'email.gif)}.mQR .mBT14 a{background-image:url('+imgcdn1+'insertimage.gif)}.mQR .mBT15 a{background-image:url('+imgcdn1+'quote.gif)}.mQR .mBT16 a{background-image:url('+imgcdn1+'code.gif)}.mQR .mBT17 a{background-image:url('+imgcdn1+'removeformat.gif)}.mQR .mBT18{width:25px}.mQR .mBT18 a{background-image:url('+imgcdn1+'color.gif)}.mQR .mBT18 ul{width:81px;padding:1px}.mQR .mBT18 li{width:24px;height:24px;overflow:hidden;float:left;border:0;margin:1px 2px;padding:0}.mQR .mBT18 ul a{width:22px;height:22px;overflow:hidden;text-indent:-9999px;display:block;border-radius:3px;opacity:.68;border:solid 1px #ddd;margin:0;padding:0}.mQR .mBT18 ul a:hover{opacity:1;border-color:#ccc}.mQR .mBT18 .col1-1 a{background:#FF0}.mQR .mBT18 .col1-2 a{background:orange}.mQR .mBT18 .col1-3 a{background:red}.mQR .mBT18 .col2-1 a{background:blue}.mQR .mBT18 .col2-2 a{background:purple}.mQR .mBT18 .col2-3 a{background:green}.mQR .mBT18 .col3-1 a{background:#FFF}.mQR .mBT19 a{width:45px;text-indent:0;text-align:center;line-height:14px;background:#fff;padding:1px}.mQR .mBT19 li a{padding:4px 5px}.mQR .mBT19 ul a{width:120px;line-height:16px;height:16px;font-weight:500;text-indent:0!important;text-align:left}.mQR .mBT19 .font-arial a{font-family:Arial,"DejaVu Sans","Liberation Sans",Freesans,sans-serif}.mQR .mBT19 .font-arialblack a{font-family:"Arial Black",Gadget,sans-serif}.mQR .mBT19 .font-arialnarrow a{font-family:"Arial Narrow","Nimbus Sans L",sans-serif}.mQR .mBT19 .font-bookantiqua a{font-family:Times New Roman,Times,serif}.mQR .mBT19 .font-centurygothic a{font-family:"Century Gothic",futura,"URW Gothic L",Verdana,sans-serif}.mQR .mBT19 .font-comicsansms a{font-family:"Comic Sans MS",cursive}.mQR .mBT19 .font-couriernew a{font-family:"Courier New",Courier,"Nimbus Mono L",monospace}.mQR .mBT19 .font-georgia a{font-family:Constantina,Georgia,"Nimbus Roman No9 L",serif}.mQR .mBT19 .font-impact a{font-family:Impact,Haettenschweiler,"Arial Narrow Bold",sans-serif}.mQR .mBT19 .font-lucidaconsole a{font-family:"Lucida Sans Unicode","Lucida Grande","Lucida Sans","DejaVu Sans Condensed",sans-serif}.mQR .mBT19 .font-timesnewroman a{font-family:Cambria,"Times New Roman","Nimbus Roman No9 L",Freeserif,Times,serif}.mQR .mBT19 .font-Trebucher a{font-family:"Trebuchet MS",sans-serif}.mQR .mBT19 .font-Verdana a{font-family:Verdana,Geneva,"DejaVu Sans",sans-serif}.mQR .mBT20 a{background-image:url('+imgcdn3+'fonts.png);width:20px}.mQR .mBT20 li{height:auto}.mQR .mBT20 ul a{height:auto;text-align:center;padding:5px;display:block;line-height:16px;background-image:none}.mQR .mBT20 .size-1 a{font-size:10px;line-height:10px}.mQR .mBT20 .size-2 a{font-size:12px;line-height:12px}.mQR .mBT20 .size-5 a{font-size:20px;line-height:20px}.mQR .mBT20 .size-6 a{font-size:24px;line-height:24px}.mQR .mBT20 .size-7 a{font-size:28px;line-height:28px}.mQR .mBT22 a{width:25px;background:url('+imgcdn3+'youtube.gif) center top no-repeat}.mQR .mBT23 a{background:url('+imgcdn3+'vimeo.gif) center top no-repeat;width:25px}.mQR .mBT95{width:25px}.mQR .mBT95-wrapper{width:180px!important;padding:5px 2px}.mQR .mBT95 li{float:left!important;border:0!important;padding:0 3px 3px;height:15px!important}.mQR .mBT95 li a{overflow:hidden;text-indent:-9999px!important;display:block;-moz-border-radius:3px;-webkit-border-radius:3px;border-radius:3px;opacity:.78;height:10px!important;width:10px!important;border:solid 1px #ddd;padding:0}.mQR .mBT95 li a:hover{opacity:1;border-color:#333!important;background:#fff}.mQR .mBT95>a{background-image:url('+imgcdn1+'color.gif)}.mQR .mBT50 a{background-image:url('+imgcdn1+'html.gif)}.mQR .mBT51 a{background-image:url('+imgcdn1+'php.gif)}.mQR .mBT95,.mQR .mBT20,.mQR .mBT19{height:auto}.mQR .mBT95 li a,.mQR .mBT20 li a,.mQR .mBT19 li a{background:#f5f5f5}'

      +'.mktH .mBT53 a {background-image:url('+BTN.strikethrough+');}'
      +'.mktH .mBT21 a {background-image:url('+BTN.spoiler+');}'
      ;
    },
    getSCRIPT: function(){
      return ''
      +'function showRecaptcha(element){'
      + 'if( "object" != typeof(Recaptcha) ){'
      +   'window.setTimeout(function () { showRecaptcha() }, 200);'
      +   'return;'
      + '}else{'
      +   'try{ Recaptcha.create("6Lc7C9gSAAAAAMAoh4_tF_uGHXnvyNJ6tf9j9ndI", '
      +   'element, {theme:"custom", lang:"en", custom_theme_widget:"mqr-cpcy"}); }catch(e){};'
      + '}'
      +'}'
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
          news_png : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAANCAIAAAD5fKMWAAAABnRSTlMAAAAAAABupgeRAAAArklEQVR42mNkYGBgYGBob29/9OgRA14gJyfHAlHHz88/bdo0/KqzsrJYHj16lF/auG/Hmvv37587dw6XUiMjIwYGBhY4X1FRUVFREb/xLMic9knLGRgYKvMiT158jKbOXF+WgYGBiYEUgGJ2ZV4kCarR7B207ubn52dhYGB4ev+yh4fHhw8fIKLvPn4XFUAxRYif8/79+wwMDIxHjhzZsmXLx48f8buBn5/fw8MDAOiiPC0scvhsAAAAAElFTkSuQmCC",
          spoiler : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAIAAAAC64paAAAABnRSTlMA4QDhAOKdNtA9AAAACXBIWXMAAAsTAAALEwEAmpwYAAABg0lEQVR42tVUPUsDQRB9M7dBQi4iypWJhgQsU1lIUtklIgg2tmJhK3b+gLT+AtHaP2AqtUmwslGMTSJcUgaSKEc+bu/DYmGJMR+glVs8HrO8fTOzs0u23cRvF+MP609iodn1Y70SbC8UhL3O1a6vOOmaj6tWds32Xc9gigpDMEUYBvNyVESYIwZiERHaK6+1h8+P2unJ4WTaw6Hs9+WgL0cD6Q6lO/S8kRe4PqRP0mcvMNd7uf0tAC9v79/SBpDaWIUfEkMwM0AEMC0JJqKAMDBYMrHB3U53smYA7tMNMRNzIASBiJmIXabFDQNwfnRWbTm5hFlutAtpS3GNABR5vitNEVdbTj5pAgAsAID5A1FpwpVyyj3nEmal6YQhFN7W2xorTUcFZw5JudHOJ00iACBCMWMBKGYsFdFb08WFtKWPV24AdGSec7Z+r7pChHF/xVUvZjp77iiXMLXnuL/OYl7NynkWahKPxyZnG0Dp4tJx+vMfRjwe28ykDvZ2JsX/5zP4AtVMzoKTk38hAAAAAElFTkSuQmCC",
          contr_stg : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB9wMFxAYA6YinkAAAAE7SURBVDjLrZRBS8NAEIW/SRM1UDGgB0H6Bzz5X/SHe/IslKIHe4hQra3JeHkbh2Urgi68w5t9mczOvF0bxxEz4y/L3TF3x8xmwBUwhH0T1uLngAtpzYCVuw+4O8BCgk3ATrE7wRWLGgcW7k6tzJ/AEuhTtUADnABPij0CW2CvSgHO9O2UyCXahrJHfZBiH8I+aI7TUetCT3JeZTzXEBOZjtIEUeIW+JANbNqPiVqVHkVtqKgNkyLEDJjGfwTcpMZpVcKD+LX6NgZNDdy7+y5WdJo1MiWai88Lib6PnvnoVeiBd8VuBVesD7qij1bBRxR8tAw+4icfvQnRkEMYwKZgyOaQj6qQqAog43bIR4QEv7rweaAOf+sKZmuDbzo1O/aoSxUnH1XAZTbadB1exC8Kz0gFPLv7aP/1sH0BL4CCxuBHWEkAAAAASUVORK5CYII=",
          goog_stg : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB9wMFwwCGmdYlk8AAAHzSURBVDjLrdVLS5ZRFAXg53gJ00pJVKyMIqhBF0fdCCKiUT+gX9L/adQvaFCNAiEogmgUDSolKyNN0NLP2+dpsj56/aqZBw7n8u6z9tp7r3PeUmu1n63HPre+7o1SCtzGKSzgcePznv1/Rdf3DyfDuIuTWMYZzGU8iyG8wlgpZbF5sNb6B7CUIh5bObCLo7iKazH7hl+ZH4/NYQxiCd9Lh3YppRdtDOASbmIUB9EfRysBGcr4HucxhUe11ofNkC/GU39Y9QRgLfM2NlBiM4LrmcNkdw7vhd1G1isJ73OYrIXtueSzLyxrUvS8G3Ay3teSj3bAXtda5xu5bqE3vYWfeFZrfdcNOBPQAzHcxdcmWCo5V0oZjwq2o4SVTlF7GoYP8CQeN+JsJ7rs1mk739shcQETe25KDBcCuJuQRjDQAc04mP1OdL24g/vdIY82Kr2NHVzGIcyUUlaiyxsR+E4cb+f8YDfgFUwnjK0cGI+EJlLxIzgRVktJzQfMptp7AKcwho+RzHAqPoZbKdYmfmAx83m8iPPSDfgmzGbxKWz7Y9hqAK6nr4Xdam28Es2rV7LezbqTr9MB7kmYA3Gyk7v9tNa6+ddrEy/N96jdSPo6XuJLijedx+FYg/l/n69ma8V4AW9rrW0sRz6rEfXWHp3u9y/gN28Pu01Pz4YXAAAAAElFTkSuQmCC",
          strikethrough : "data:image/gif;base64,R0lGODlhFAATAPcAACQeJHx+fFRSVDQ2NLSytGxqbJSWlExGTKSipGRiZEQ+RHx6fDQuLDw+PHRydJyenIyKjFxaXDw2PGxudJyWnCQmJFRWVJza7GxubExKTKyqrGRmZDQuNIyOjDw6PJyanBbQIND2iGRJdHcBAABF4AAA63EAEgAAAAAYVQCI1QB0mQAAd3gApOYA63VxEgAAAPhY/omT/5Z0/wMA/wBoNAANAABJAAABAABFaAAAAAAAagAAAAAYYACIhQB0dAAAAAAAKAAAAgAAAAAAAAAjAgABAAAAAAAAAAAYAADoAHESAAAAAPhFaIkAAJYAAAMAAAAAAAAAAABxAAAAAHwYaOaIABJ0AAAAAAgYRADo6W8SEgAAABGFYAA0hQCddAB3AOouaMdnAGRpAHdmAcYARMRHOsQ0XFZ3AOAhcwKtZVFkcgB3c+AAU4kB35YAZAMAdwEAOgAAygAAxAAAVvCMAInnAJYSAAMAAHQ3AOY7ABKdAAB3AMc8yB87d52ddHd3APirAIlIcJY0dAN3AEkAVB8A6J0AEncAAAAAEQABAQAAAAAAAPAhsImt6JZkEgN3AIBkmufnkxISawAAd7wA4sIq/WRxsncAIQA6/gDF/3HE/wBW/wC0UwDn3wASZAAAd/iRSYms2JZkZAN3dwAAyAAAdwAAdAAAAAAAPgEA0gAAZQAAd8vgesKzymSZxHd3VsznAOdIABI0AAB3APh5AInpAJYSAAMAAAwMAJ6hAHtPAHcAAAEgAAAAAAAAAAAAAwIAAX8AAAAAAAAAAHOUkC3n6G0SEmUAAG4MzXWhq1xPugAA3DxgYAD7+wASEgAAAABVmgDVkwCZawB3dwHX8gCl8AG7swAAITb+/iX//8f//1b//zjgPuez0hKZZQB3d5RbiAp/gcVnQnZ3AATcyOfodxISdAAAAA5rAAF/AABnAAB3AAWNeQCt6QBkEgB3ABAAMQAArQAAZAAAdwAwZgAAygAAxAAAVkQAMToArQAAZAAAd1QuagxncUlpSAFmACH5BAEAABcALAAAAAAUABMARwhnAC8IHEiwoMGBGCRAuIAhwgEHAgMkQHCwosWLGC8YAHAAAAYPDBJA/MChQYCMKA1aoIhxgMuXMGMOSEmzps2bFydouOngAcoOAhNc2LBQAYICBCo6yHChwgUBCy4ooNBAKM6rWAkGBAA7",
          throbber_gif : "data:image/gif;base64,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%3D"
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
    getBtn: function(){
      return {
       btn_max: ''
      +'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAIAAADZF8uwAAAABnRSTlMAAAAAAABupgeRAAAAUklEQVR42mNkYGBwSDjAgBscWODAiF8F'
      +'BLAgc/bPt0eTdkw8yMDAwMRABGBC0wfRik8RVhvRFcFVoJnHRFAFAwMDNAjwqMDicKy+IyowGYmJFgC0SBv8eaPcgAAAAABJRU5ErkJggg=='
      ,loading_gif : ""
        +"data:image/gif;base64,R0lGODlhCwALALMIAEdHRyQkJGtra7Kyso+Pj9bW1gAAAP///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH/C05FVFNDQVBFMi4wA"
      +"wEAAAAh+QQFAAAIACwAAAAACwALAAAEJBBJaeYMs8pz6bYIVnFgKQEoMBVsYZoCQiADGMtSLd14Xs6WCAAh+QQFAAAIACwAAAAACwALAAAEJBBJGeYEs0pz6bYIV"
      +"nFgKQmoMB3sYZoEMiAFGMtSLd14Xs6WCAAh+QQFAAAIACwAAAAACwALAAAEJBBJCeYUs8pw6bYIVnFgKREoMRmsYZoDUiAHGMtSLd14Xs6WCAAh+QQFAAAIACwAA"
      +"AAACwALAAAEJBBJKeYks0pw6bYIVnFgKQ3oMAVsYJoFciAGGMtSLd14Xs6WCAAh+QQFAAAIACwAAAAACwALAAAEJBBJSeYcs0px6bYIVnFgKRVoMQEsYJoHYiABG"
      +"MtSLd14Xs6WCAAh+QQFAAAIACwAAAAACwALAAAEJBBJOeYss0py6bYIVnFgKR3oMQmsYJoGEiAAGMtSLd14Xs6WCAAh+QQFAAAIACwAAAAACwALAAAEJBBJWeY8s"
      +"8px6bYIVnFgKRmoMREsYZoBAiACGMtSLd14Xs6WCAAh+QQFAAAIACwAAAAACwALAAAEJBBJeeY0s8py6bYIVnFgKQVoMA3sYJoAIiAEGMtSLd14Xs6WCAA7"
      ,btn_maxmin: ''
      +'data:image/png;base64,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'
      
      ,blue_back: ''
      +'data:image/jpg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAYEBAQFBAYFBQYJBgUGCQsIBgYICwwKCgsKCgwQDAwMDAwMEAwODxAPDgwTExQUExMcGxsbHCA'
      +'gICAgICAgICD/2wBDAQcHBw0MDRgQEBgaFREVGiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICD/wAARCAAWAAEDAREAAhEBAxEB/'
      +'8QAFgAAAwAAAAAAAAAAAAAAAAAAAwUG/8QAGBAAAwEBAAAAAAAAAAAAAAAAAAIUFWH/xAAXAQADAQAAAAAAAAAAAAAAAAADBAYH/8QAFhEBAQEAAAAAAAAAAAAAAAAAABI'
      +'R/9oADAMBAAIRAxEAPwAdSmh0l8T2j0TseSChhShsf//Z'
      ,btn_qr: ''
      +'data:image/gif;base64,R0lGODlhGQAWAPf/AMDAyb2+xqirrLq8vLe2sn2KpYJ8fOO8k4WRq2h9oVtymlxti6mLeNK1nD1Sdebn64uSm2B1meHi6XONvKKjo66xs2q'
      +'GtJKaosWihZeTktHR3cyoipaSjWV6nnuDlGFzkm2BpPT09snI0L/Fx7a4u+Li5Vdtlf7TquzEm9TU23SJrGt7nP39/VpnfHuRtnWFod3d4srO0PHy9HJ8jkFVeayfke/u8'
      +'XiQuoyXsOLj4llphtra4b6cfsyrk1ZMSc7OzmVxgouGgvr6+qKiqLGzuHN3fq2yuM7P12J9rcnJ1erq8YiUrE9jhtXW1tPV2W2Aos7Q1cbGznWCm+fm57ychn6Vvklegm+'
      +'Gru/x8u7u7lVqjt7e3niGo6Khna+SeDlMa8nKzXmOsvL09PHx8zlNccXIysfHzcLCx4GaxX6Vu6y0xvj4+a2tsaepr/Du74KEitPU3MvM1cXFzcPEzW+EqaSkqltpgZKTm'
      +'P////7+/s/Q2VtwlPT0/sfH0vPz/cXGzvn5/P7//1ZnhKenrIaBgMC/wayvtd24mKqOgsbL23ySt+jp6Ovs7tDT1pCWn8zM1Ly+wcrL2ZKetdXW4NDO1uXn8//+/+rs+O7'
      +'Govv7+05gf8TGyv7//mJvgLW90OPj6+Tl6KSvw3qFm8Ohi9HS2vj3+vPLpoiCf2N/sebm79XW3J+qwIyLhoqJj8yzmF54pHiBjry+w8bJ0bu8xn5wb3eMsF5thOrq9P79/'
      +'2aArNjc62dsdqCEbtOwlYuVofDw+vb3+aWsvUdUakVafpmZnMLCzH2In9nb52h2kcTDzN3d5sTDy2dhXm97iWBxjuvq7JZ9aZB9d9DR0Gl5l5CVoJmcoqKlqWNYVVxrguP'
      +'An0VWcoCKlHGGqpOVmJqkuJWXnLCNbsTGzZSVmrSWfGt/o2uApcvL0nR6g2uCq22DqL+hgvDw8Ozs9vDz8vLz87eXgFZohmaDuNrb39rc32J3m8LI2ICOqcbM3DFGajdIZ'
      +'aursVFmisHBwV1TUby8w/X1/yH5BAEAAP8ALAAAAAAZABYAQAj/AP+lIlKiEZgyZSCRIEGkQgVIA5Tx+edHlaEoO26tshABCh4zlJZF8RfuDJ5FtDBl60HlHAg0E5C88Ja'
      +'AnA48IZJoiJSh25ApeIIGbUEvwh4tVpD9Y0cNz7MSU2zYcBNiTSahsK5tQIFhHK83ABDQAdEMDzBQoFRBmcPhTatC61jMUKFIkYsw6XT8WzHsC4SgWaQ1IQEBiLB8X744c'
      +'ECjsQMyl/59sobnzqAhbOoI3QzgFxQfGA7wABdEVzwTeEolA/DnSAAAAcwBkMeKgasidpzRe4UkFI4rHS7gATCrmBkYMHYMQHSiV41dH1RUqXIDnbMl5EDYwiMhThw9ejL'
      +'c/xnSJoA+PCOic6NDbo+Oeh06wHMSlAUBCj+ybA7qi4kVGo8t8Y8EAuAhAx6B4JHHfkE9QhEcPnhRAwUA/KNEG3iwoQ8xcQzxzRnVxCKUEbL0s8EB6ngBzR3/lKPAZpzkk'
      +'UkIY2DxwBhrMEMFChvwwAA2WhzjiQUKtBOCHOYEIEchJRwhwh8CRHPCIRu8I8UNE6CyhCQW0GMEHiKoksIjURxBBCNB9GBKL6MU8YELaNyQyzQIXJHANniwENSCeLgTTQN'
      +'dDNCEHXSlkYYL6SyAAAhPAIFHCgAc0QcpmxhQxxaZiIHHBU+EEUYtKnQgCA413aREH3BMMgch4oDhhiVBhVywQDnkdBDBPguo0UECOqwDiAafPHAKP1vouVknC2jhHw1SV'
      +'BJBBJp8iUcOXfyQgxBB4RIDBC1oA+Bj+KjxDx/3BOPIPBd4MMMMHohiTAH2FFAAF1y8QK89ifwTEAA7'
      ,btn_edit: ''
      +'data:image/gif;base64,R0lGODlhRgAWAPcAAHiY0HqVxP///yozeIKOoZOds+np7bS2uZGr2aKru3SLs2d8oL3AynaDoamzyFxsieTm8g0akry+wlxxlUxhhYWRqpmmv'
      +'Wl1hFlky4Kdy42s4WyCpqyts4up3Wl9oeTl62R5nfj4+j1SdXWVzJqhrc7R20lZmLzA2t/h5TpOcOnq9YyaswoUaGB1mYmVq4Og0nmOskVafjRJbSs4sp26656qwl55qHmWy'
      +'eHi53GGqiczjpSivIadx8PEzHaLr32Ko3WOunSSxcnJ0cXJzHOSynF2koWj2FltkZey5Imk08zP1IKJltXa5IiQmc3Q1tzd4aOnrEFWenqSu4aRpdjZ3nuFmiY1z9HT2Uleg'
      +'hcp0HqRuWl6mRgmrHyRtl90mG+EqLC4ylJhe1Vul1Rkghov96uxutHS1vb292WCs2uGtoCe0ufp9MHBxlFlilVpjp2ksHyazThDiLe6v8vN2hskbwkTefHy9IiRopakvXOAn'
      +'8jK1WV/qtLW3u3u+IqYsPf4+VpqnGN0lJCu4tTV3GR4mUddhKGotW6Fvvz8/PT198nMz+3t75iz5XuSuKCltYim2neUxsrN0rm9yVlogxQeePDx8oagzfr6+4SWtHiGo22Mw'
      +'3GIsXGPwlhngpWZo/Pz/RAfrxIbaWaEuGWArV92nVpij1ZohWyErm99lm6Dp26BowYPWllxmmZ4l/Hx++fo6Y+Wn3+XwH2UunWRv36Jm0NWdwUPZmuApPT0/mN4nOvs987S4'
      +'JSiu3SIq5yowM3O0kpRg1p0nmZsmKutur/H14CMp9fY3pOftiY486C972F+sH+Yw01co0xcirO2wJigrHWBjkhZekVMe01abg4dwI2cuLfAz3d/iszM1Gd+qMzL0unp8neMs'
      +'Ozs9t7g66SuwEJQil1wkEVfi+/w+khQiFZmmV1jll1lm2h0kHqUwJSw33uTvBUhgjNCuWp/o9HS3NXU2pKhu5GhvUxhlIyXr/P09fTz9lNluF57r3KHq0NPhY+VqZCZrWiCr'
      +'lhxnfX1/yH5BAEAAP8ALAAAAABGABYAQAj/AP8JhHDAjBlFQ4awkSBBzoEDciS8cyWwosWLGDNq3IgRF6lRaIKVuQTvirZfPYSwQfQqTp06uWbNOmKrDqB0OAPoTKelmh8/K'
      +'1bIS2fJUpIMDphYS0qMh1ME6hghUYfgaAAgaUbZCDbP2ppwuUAsMEUl0Zx3JeYM+oUikYC3AvQhW6DDRKovePGmclcBLtxOkt7WcyLAyRsBJUyVgZtggpcJE44ccdOGQowoM'
      +'vhV7AMF0aInHwwYcMSChS1yKATAKlCjdQ1fsH1ZmE3bAh7beHLrxrOjNy/fvYPvtuDrG5g5uio2XrDBw4VEA1aVDkVnwIA4wEqZiwCKi4nvgHp1/xk/nltfv3wIvCXwYLGSw'
      +'07CvKXVKgcM8l1gcPORasGRGGMItMsWbdRyjV+vSADLBdOkkIIItcSABRYmUGDhhRhOqKGGhcTg4YceRiHiiCSKKMKJKaDyiUUQQCHAARxw4Akdwkhyhl8cbMPRjjz2eBET+'
      +'IgixhMhqNSDMSkNQ0cdLAzwTBpwwKHGlGoYYcQjWHagpQZcdimIIBp8KeaXXGqJ5SNGvKAGHCMEwYkmh4iCzzH/EENKNqeA0ERhPaRkzBPG2PNWJTqw08sXEWyyznXrrCNFo'
      +'wq48NYbBEyxQg5f+PFNAnIUhsoUP1TxliF+YLJOLKg6CoQCp2TDSiGogP8xAQgeeDAJIgbosc8AdUTgq6+gHILDJKAw48OxyCL7xRTzBbJFIIYUFk4r0SpBQmHyCUCAKjl0i'
      +'2kqt3gAghdHUCDCA/9Y0EIuuZjCgV/w+lVGFvdMQE05Hrjjzi0b9LtBKgDfpVe4/LrjwQIgtPAYZRdiEWIUKDoYzYoCffCuHZf8oXG8AsjRjY8gh6xRN++yEeMQRdhiywBVX'
      +'PIWB970IbMuuqhg880qrJHzGjxD0DMEQAct9NBB86wLRRlZk40blcB1CSJnSEJJaXQ84UIaAGSt9dZcZz0CACOELbbYRJRNxAhmp532m2lgUlEFaKDByhBFaiMBNmzggI0zv'
      +'Nb/UcoeQUACCRBA3BCllGq8oHgGGbyQRBIdCKIOEowwUhUCmKtDQzLJ0OA5DYwI8sgLN3CShijK2CDGON4EM8oppDyDCDZmXOGEEFcwgIMAi7jUzKq2zANIBPngZDwQK8S7S'
      +'SxSAPHFNwJcYQEf1njwVjyx8FCUJRkskw4Qm/Rjgz/iuOCAF9n0B80fehiDwgeL1BNCCAY0/cQq1VESBzihDCBFI11oRCO4ISkBUGoKFdgCA+DlhGhd4Qp+AQMMZEFBAcJAA'
      +'TnwwAQK8YBvTGAB4XqAALAhDVuU5oQnjMAMuNAOGLjwhTDsBbMMOAUX/CBaTmiFKhIgAGshphNvmUIv/2C4n17kIxUe8IIbojCGEhwhFwuw1SLscRY9kOAcM5iBFTBwgrd0I'
      +'gugMEEvcpCPMppRFeoRgDMcYYgEoGJStFCCACLxDGy9hQSmyEQUDwaCXJDLDZZJ0T+2EBYQmGIIfxgEDhYRAo4JAB1kuMUWIuCFW1jyku4gRDgewMkHhIMQgUAFezYZDlKSC'
      +'x1VqMID3ECZylBgQpcRgQz08A8VhENhY4CFIwVgB0UsqBNtIAMZrFDIBRjzmHzsI7taoLDHRIaVrnTYZSB2oojJ4JoFuAgEGOCJX0ChCUtYwh32wY8CFOAY6DTnCujBThe4s'
      +'wLwrEAx5knPH/wgE/hsgD71mROHfvrzn3nQZyaKQY8E7EIguAgIADs%3D'
      };
    },
  };

  function init(){
    var kdomain = domainParse();
    gvar.domain = kdomain.prot + '//' + kdomain.host +'/';
    gvar.kkcdn = kdomain.prot + '//'+ kdomain.statics + '/';
    
    gvar.qID = 'mqr-content-wrapper';
    gvar.tID = 'message';
    gvar.mode = 'qr';

    // draft no decision yet
    gvar.user = {isDonatur:false}; //gvar.user.isDonatur

    // -- let's roll --
    start_Main();
  } // end-init


  function start_Main(){
    // first assume
    gvar.thread_type = 'forum'; // [forum,group]
    gvar.act_uri = '';
    gvar.sec_tok = '';
    

    design();
  }


  function design(){
    // [design]

    // inject CSS
    GM_addGlobalStyle(rSRC.getCSS());

    // inject SCRIPT
    if( !gvar.user.isDonatur ){
      GM_addGlobalScript(location.protocol+ '\/\/www.google.com\/recaptcha\/api\/js\/recaptcha_ajax.js', 'recap', true);
      GM_addGlobalScript(rSRC.getSCRIPT());
    }

    var par, node, lg, el, nodes;
    // scan all quote
    nodes = $D('//a[contains(@class, "btn s") and contains(@href,"post_reply/")]')
    if(nodes.snapshotLength > 0){
      for(var i=0, lg = nodes.snapshotLength; i<lg; i++) {
        node = nodes.snapshotItem(i);
        par = node.parentNode;
        el = createEl('a', {'href':'javascript:;', 'class':'qq btn s'}, 'Quick Reply');
        par && append(par, el);


        el = createEl('a', {'href':'javascript:;', 'class':'qf btn s'}, 'Fetch');
        par && prepend(par, el, node);
      }
    }


    // templating :: find entry:last
    nodes = $D('//div[@class="entry"][last()]');
    if( (par = nodes ? nodes.snapshotItem(0) : null) ){
      el = createEl('div',{'id':gvar.qID, 'class':'mQR'}, rSRC.getTPL());
      append(par, el);

      // bottom controls
      if(par = par.nextSibling){
        el = $D('.//a[contains(@href,"/post_reply/")]', par, 1);
        gvar.act_uri = gvar.domain + getAttr('href', el).substr(1);
      }

      if(el = $D('//a[contains(@href,"/logout/")]',null,1))
        update_token( getAttr('href', el) );
    }

    // fixed topnav
    if( par = $D('#site-header') ){
      el = createEl('hr', {'class':'sxln'});
      append(par, el);
    }

    // attach event
    events_tpl();
  }

  function events_tpl(){
    var nodes, node, el;
    // [events]
    nodes = $D('//a[contains(@class, "qq btn s") or contains(@class, "qf btn s")]');
    if(nodes.snapshotLength > 0){
      for(var i=0, lg = nodes.snapshotLength; i<lg; i++) {
        node = nodes.snapshotItem(i);
        Dom.Ev(node, 'click', function(e){
          attach_qr_from(e);
        })
      }
    }

    // toggle wrp_control
    Dom.Ev($D('.Qct',null,1), 'click', function(e){
      var tgt = $D('#wrp_control');
      showhide( tgt );
      e = e.target||e;
      if( isVisible(tgt) )
        addClass('active', e);
      else
        removeClass('active', e);
      _TEXT.focus();
    });
    // clear editor
    Dom.Ev($D('.QxM',null,1), 'click', function(e){
      e = e.target||e;
      _TEXT.clear(true);
      
      showhide(e, false);
    });
    // clear title
    Dom.Ev($D('.Qxc',null,1), 'click', function(e){
      e = e.target||e;
      var tgt = $D('.//div[@id="wrp_title"]/input[@type="text"]',null,1);
      if( tgt ){
        tgt.value=''; tgt.focus();
      }
      showhide(e, false);
    });

    Dom.Ev($D('#recaptcha_reload_btn'), 'click', function(){
      toggle_auth_noneed_cpcy(false);
      _TEXT.focus();
    });
    Dom.Ev($D('#recaptcha_stg'), 'click', function(){
      toggle_whattheheck();
    });

    Dom.Ev($D('.//div[@id="wrp_title"]/input[@type="text"]',null,1), 'keyup', function(e){
      e=e.target||e;
      var tgt = $D('.Qxc',null,1);
      if( e.value.length )
        showhide(tgt, 1);
      else
        showhide(tgt, false);
    });

    node = $D('//div[@id="wrp_msg"]/textarea',null,1);
    Dom.Ev(node, 'keyup', function(e){
      e = e.target||e;
      toggle_clear_editor( e.value.length > 0 );
    });
    Dom.Ev(node, 'focus', function(){
      _TEXTCOUNT.init('#txtLen');
    });
    Dom.Ev(node, 'blur', function(){
      _TEXTCOUNT.dismiss();
    });

    Dom.Ev($D('#chk-auth'), 'change', function(e){
      var ischecked = toggle_auth_noneed_cpcy();

      // store to localstorage ... later..
    })
    
    !gvar.user.isDonatur && window.setTimeout(function(){
      (node = $D('#hidrecap_btn'))
        && SimulateMouse(node, 'click', true);  

      // close capcay
      Dom.Ev($D('.Qcp',null,1), 'click', function(){
        toggle_capcay();
      });

      poscap();
    }, 1500);

    // form-submit
    node = $D('//form[@name="postreply"]',null,1);
    if( node ){
      setAttr('action', gvar.act_uri, node);
      Dom.Ev(node, 'submit', function(e){
        var rrf, elcpcy, tgt, el;
        e.preventDefault();

        el = $D('#'+gvar.tID);
        if( !el.value || (el.value && el.value.length < 5) ){
          // blank-msg
          addClass('error', el.parentNode);
          window.setTimeout(function(){
            removeClass('error', $D('#'+gvar.tID).parentNode);
          }, 3000);
          _TEXT.focus();
          return;
        }

        var gogo = function(){
          toggle_response_field(true);
          post_reply();
          return 0;
        };
        if( !gvar.user.isDonatur ){
          if( isChecked( $D('#chk-auth') ) )
            return gogo();

          rrf = $D('#recaptcha_response_field');
          if( !isVisible($D('#wrp_cpcy')) ){
            toggle_capcay(true);
            tgt = $D('#sbutton');
            removeClass('btn-red', tgt);
            addClass('blue', tgt);
          }
          else{
            if( rrf && !rrf.value ){
              toggle_response_field(false, true);
            }
            else{
              return gogo();
            }
          }

          window.setTimeout(function(){ rrf && rrf.focus() }, 123);
        }
        return false;
      }); // end-submit-ev
    }

    Dom.Ev(window, 'scroll', function(){
      var el, nVScroll = document.documentElement.scrollTop || document.body.scrollTop;
      el = $D('#site-header');
      if( nVScroll > 0){
        addClass('fx', el);
      }
      else{
        removeClass('fx', el);
      }
    });

    // initialize editor
    _TEXT.init();
    eventsController();
  } // end-events_tpl

  function eventsController(){
    var ch, node, nodes, par;
    if( par = $D('.mktH',null,1) ){
      var tag, title, pTag;
      nodes = $D('.//a[starts-with(@class,"ev_")]', par);
      if( nodes.snapshotLength ){
        for(var i=0; i<nodes.snapshotLength; ++i){
          node = nodes.snapshotItem(i);
          switch( String(getAttr('class', node)).replace(/^ev_/,'') ){
            case "biu": case "align":
              Dom.Ev(node, 'click', function(e){
                e = e.target||e;
                title = getAttr('title', e).toLowerCase();
                _TEXT.insert.tagBIU(title);
              });
            break;
            case "font": case "size": case "color":
              Dom.Ev(node, 'click', function(e){
                var _cls, el = e.target||e;
                _cls = String(getAttr('class', el)).replace(/^ev_/,'');
                tag = _cls.toUpperCase();

                _TEXT.insert.tagHibrid(tag, getAttr('title', el), el);
                _TEXT.pracheck();
                e.preventDefault();
              });
            break;
            case "list":
              Dom.Ev(node, 'click', function(e){
                e = e.target||e;
                _TEXT.init();
                var selected, mode, title;
                title = getAttr('title', e).toLowerCase().replace(' list', '')
                mode = (title=='numeric' ? 'number':'dot');
                selected = _TEXT.getSelectedText();

                if(selected=='') {
                  var reInsert = function(pass){
                    var ins=prompt("Enter a list item.\nLeave the box empty or press 'Cancel' to complete the list:");
                    _TEXT.init();
                    if( ins ){
                      _TEXT.setValue( '\n' + '[*]' + ins + '');
                      reInsert(true);
                    }else{
                      return; 
                    }
                  };  
                  _TEXT.insert.tagHibrid('LIST', (mode=='number' ? 1:false) );
                  window.setTimeout(function(){ reInsert(); }, 10);
                }
                else{
                  var ret = '', parts = selected.split('\n');
                  for(var i=0; i< parts.length; i++)
                    if(trimStr(parts[i])) ret+= '\n' + '[*]' + parts[i] + '';
                  ret = '[LIST'+(mode=='number' ? '="1"' : '')+']' + ret + '\n[/LIST]';
                  _TEXT.replaceSelected( ret, [0, ret.length] );
                }
                _TEXT.pracheck();
              });
            break;
            case "media": case "codes": case "quotes": case "misc":
              Dom.Ev(node, 'click', function(e){
                e = e.target||e;
                tag = getAttr('data-bbcode', e);
                _TEXT.insert.tagCustom(tag);
                _TEXT.pracheck();
              });
            break;
          }
          // end switch
        }
      }

      if( nodes = $D('.mDM', par) ){
        for(var i=0;i<nodes.length; ++i){
          Dom.Ev(nodes[i], 'mouseover', function(e){
            var tgt = $D('.//ul', (e.target||e), 1);
            tgt && tgt.style.removeProperty('display');
          })
        }
      }

      // in the end add the class to flaging
      addClass('events', par);
    }
  } // end -eventsController


  function fetch_post_cb(ret){
    ret = ret.responseText;
    var tgt, tmpval, subret, pos={};
    // chunk
    pos['start'] = ret.indexOf('<textarea');
    pos['end'] = ret.indexOf('</textarea');

    subret = ret.substr(pos['start'], (pos['end'] - pos['start']));
    subret = subret.replace(/<textarea[^>]+./i, '');
    tmpval = $D('#'+gvar.tID).value;
    $D('#'+gvar.tID).value = tmpval + unescapeHtml( subret );
    toggle_clear_editor( true );

    (tgt = $D('.bling',null,1)) && removeClass('bling', tgt);
  }

  function fetch_post(e){
    if(!e) return 
    var furl, el, keyuri;
    el = $D('.//a[contains(@href,"post_reply")]', e.parentNode, 1);
    furl = getAttr('href', el);
    if( furl.indexOf('http:') == -1 )
      furl = gvar.domain + furl.substr(1);
    
    GM_XHR.uri = furl;
    clog('geting post ...: ' + GM_XHR.uri);
    GM_XHR.cached = true;
    GM_XHR.request(null, 'GET', fetch_post_cb);
  }

  function attach_qr_from(e){
    e = e.target||e;
    var mode, par = closest(e, {'class':'entry'});
    par && append(par, $D('#'+gvar.qID));
    mode = String(getAttr('class', e)).indexOf('qq') != -1 ? 'attach' : 'fetch';
    if( mode== 'fetch' ){
      addClass('bling', e);
      fetch_post(e);
    }
    _TEXT.focus();
  }

  function update_token(text){
    var cucok = /\bhash=([\w-]+)/gi.exec(String(text));
    cucok && (gvar.sec_tok = cucok[1]);
    $D('#securitytoken').value = gvar.sec_tok;
  }

  function post_reply_cb(ret){
    ret = ret.responseText;
    var cucok;

    // error-pattern
    if( /[\\\"]+err-msg[\\\"]+>/i.test(ret) ){
      if( ret.indexOf('image verification did not match')!=-1 ){
        toggle_capcay(true);
        toggle_response_field(false, true);
        toggle_auth_noneed_cpcy(false);
        alert('Error Capcay bro..');
      }
    }
    // submit-pattern
    else if( /[\\\"]+s-msg[\\\"]+>/i.test(ret) ){
      if( cucok = /\bpost\/([\d\w]+)\#post([\d\w]+)\b[^\>]+.Click\shere/i.exec(ret) ){
        var next = gvar.domain + 'post/' + cucok[1] + '#' + cucok[2];
        top.location.href = next;
      }
      else if( ret.indexOf('security token was invalid.<')!=-1 ){
        alert('Invalid securitytoken');
      }
      else{
        alert('Unknown Error');
        clog(ret);
      }
    }
    update_token(ret);
    //alert(dump(ret));
  }

  function post_reply(){
    GM_XHR.uri = gvar.act_uri;
    clog('submting ...: ' + GM_XHR.uri);

    GM_XHR.cached = true;
    var sdata = build_data_form(true);
    GM_XHR.request(sdata, 'POST', post_reply_cb);
  }

  function build_data_form(toString){
    var data, node, nodes, par;
    if( par = $D('//form[@name="postreply"]',null,1) ){
      data = (toString ? '' : {});
      nodes = $D('.//*[@name]', par);
      if( nodes.snapshotLength ){
        for(var i=0; i<nodes.snapshotLength; ++i){
          node = nodes.snapshotItem(i);
          if(toString)
            data+='&' + String(getAttr('name', node)) + '=' + node.value;
          else
            data[String(getAttr('name', node))] = node.value;
        }
      }
    }
    return data;
  }

  // capcay positioning
  function poscap(){
    // #wrp_cpcy
    var lOffset, lpos, cppos, mQRpos, tgt = $D('#wrp_cpcy');
    tgt.style.removeProperty('visibility');
    tgt.style.setProperty('display', '', '');

    cppos = getPosDim(tgt)
    mQRpos = getPosDim($D('.mQR',null,1))
    lpos = (Math.floor(mQRpos['w']/2) - Math.floor(cppos['w']/2) );
    lOffset = 15;
    tgt.style.setProperty('left', parseInt(lpos+lOffset)+'px', '');
    tgt.style.setProperty('display', 'none', '');
  }

  function toggle_clear_editor(flag){
    if("undefined" == typeof flag)
      flag = true;

    showhide($D('.QxM',null,1), flag);
  }
  function toggle_auth_noneed_cpcy(flag){
    var el, chk = $D('#chk-auth');
    if("undefined" == typeof flag)
      flag = isChecked(chk);

    el = $D('#recaptcha_response_field');
    chk.checked = flag;
    if( flag ){
      setAttr('disabled', 'disabled', el);
    }
    else{
      el.removeAttribute('disabled');
    }
    return flag;
  }
  function toggle_whattheheck(){
    var rrf = $D('#recaptcha_response_field');
    showhide($D('.recaptcha-auth',null,1));
    rrf.focus();
  }

  function toggle_response_field(isGood, dofocus){
    var rrf = $D('#recaptcha_response_field'), p = rrf.parentNode;
    if( isGood ){
      removeClass('error', p);
    }
    else{
      addClass('error', p);
    }
    dofocus && window.setTimeout(function(){ rrf && rrf.focus() }, 123);
  }
  function toggle_capcay(flag){
    var el, tgt;
    showhide((tgt = $D('#wrp_cpcy')), flag);

    if( !gvar.user.isDonatur && !isVisible(tgt) ){
      if( !isChecked($D('#chk-auth')) ){
        el = $D('#sbutton');
        removeClass('blue', el);
        addClass('btn-red', el);
      }

      toggle_response_field(true);
    }
  }

  // domain guest
  function domainParse(){
    var r, l = location.hostname
    //return {"prot": location.protocol, "host": l, "statics" : l.replace(/^\w{3}\./i, 'static.')};
    return {"prot": location.protocol, "host": l, "statics" : l.replace(/^\w+\./i, 'kkcdn-static.')};
  }

  function getPosDim(el) {
    var r = {x:0,y:0, w:el.offsetWidth, h:el.offsetHeight};
    for (var lx=0, ly=0; el != null;
      lx+= el.offsetLeft, ly+= el.offsetTop, el = el.offsetParent);
    r['x'] = lx; r['y']=ly;
    return r;
  }
  // static routine
  function dump(x) { return x && JSON ? JSON.stringify(x) : x}
  function isDefined(x) { return !(x == null && x !== null); }
  function isUndefined(x) { return x == null && x !== null; }
  function isString(x) { return (typeof(x)!='object' && typeof(x)!='function'); }
  function trimStr(x) { return (typeof(x)=='string' && x ? x.replace(/^\s+|\s+$/g,"") : '') };
  function isLink(x) { return x.match(/((?:http(?:s|)|ftp):\/\/)(?:\w|\W)+(?:\.)(?:\w|\W)+/); }
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
  function do_an_e(A) {
    A.stopPropagation();
    A.preventDefault();
    return A;
  };
  function getTag(name, parent){
     var ret = (typeof(parent)!='object' ? document.getElementsByTagName(name) : parent.getElementsByTagName(name) );
     return (isDefined(ret[0]) ? ret : false);
  }
  function isVisible(el){
    return el.offsetWidth > 0 || el.offsetHeight > 0;
  }
  function isChecked(el){
    return el.checked;
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
  function showhide(obj, show, isImportant){
    if(isUndefined(obj)) return;
    if(isUndefined(show)) show = (obj.style.display=='none'); // toggle mode
    if(!show){
      obj.style.setProperty('display', 'none', isImportant ? 'important' : ''); // important
    }else{
      obj.style.removeProperty('display');
    }
  };
  function closest(obj, params){
    if(!obj || (obj && !obj.parentNode))
      return;
    var criteria, gotit, par, ijump, threshold;
    gotit = null; threshold = 20; ijump = 0;
    for(crt in params){
      if("string" == typeof crt)
        criteria = crt;
    }
    par = obj;
    while(!gotit){
      par = par.parentNode;
      switch(criteria){
        case "class":
          gotit = getAttr('class', par);
          gotit = gotit && (gotit.indexOf(params[criteria]) != -1);
        break;
        case "id":
          gotit = getAttr('id', par);
          gotit = gotit && (gotit == params[criteria]);
        break;
        case "tag":
          gotit = par.nodeName.toLowerCase();
          gotit = gotit && (gotit == params[criteria].toLowerCase());
        break;
        default:
          gotit = getAttr(criteria, par);
          gotit = gotit && (gotit == params[criteria]);
        break;
      }
      ++ijump;
      if(ijump > threshold)
        break;
    }
    return gotit ? par : null;
  }
  function prepend(parent, child, before){
    if(!parent || ("object"!=typeof child)) return;
    if("undefined" == typeof before)
        before = parent.firstChild;
    parent.insertBefore(child, before);
  }
  function append(parent, childs){
    if(!parent || ("object"!=typeof childs)) return;
    if("string" == typeof childs.innerHTML){
      parent.appendChild(childs);
    }
    else{
      for(var i=0; i<childs.length; ++i){
        parent.appendChild(childs[i]);
      }
    }
  }
  function addClass(cName, Obj){
    if(cName=="") return;
    var neocls = (Obj.className ? Obj.className : '');
    if(neocls.indexOf(cName)!=-1) return;
    neocls+=(neocls!=''?' ':'')+cName;
    setAttr('class', neocls, Obj);
  }
  function removeClass(cName, Obj){
    if(cName=="") return;
    var neocls = (Obj.className ? Obj.className : '');
    neocls = trimStr ( neocls.replace(cName,"") ); // replace and trim
    setAttr('class', neocls, Obj);
  }
  function hasClass(cName, Obj){
    if(!cName || !Obj) return;
    var clss = getAttr('class', Obj).split(' ');
    return (clss.indexOf(cName) != -1);
  }
  function getAttr(name, Obj){
    if("string" === typeof name && "object" === typeof Obj)
      return Obj.getAttribute(name)||'';
    else
      return;
  }
  function setAttr(name, value, Obj){
    if("string" === typeof name && "object" === typeof Obj)
      return Obj.setAttribute(name, value);
  }

  function getValue(key) {
    var data=OPTIONS_BOX[key];
    return (!data ? '': GM_getValue(key,data[0]));
  }
  function setValue(key, value) {
    var data=OPTIONS_BOX[key];
    return (!data ? '': GM_setValue(key,value));
  }
  function SimulateMouse(elem,event,preventDef) {
    if(typeof(elem)!='object') return;
    var evObj = document.createEvent('MouseEvents');
    preventDef=(isDefined(preventDef) && preventDef ? true : false);
    evObj.initEvent(event, preventDef, true);
    try{elem.dispatchEvent(evObj);}
    catch(e){}
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

  // ------
  //Dom.Ev('window', 'load', function(){init()});
  init()
})();
/* Mod By Idx. */ 