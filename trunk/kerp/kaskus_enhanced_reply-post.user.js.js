// ==UserScript==
// @name          Kaskus Enhanced Reply-Post
// @namespace     http://userscripts.org/scripts/show/79879
// @include       http://u2.kaskus.us/*
// @include       http://u.kaskus.us/*
// @include       http://www.kaskus.us/newreply.php?*
// @include       http://www.kaskus.us/editpost.php?*
// @include       http://www.kaskus.us/private.php?*
// @include       http://www.kaskus.us/visitormessage.php?*
// @include       http://www.kaskus.us/group.php?*
// @include       http://www.kaskus.us/blog_post.php?*
// @include       http://www.kaskus.us/newthread.php?*
// @version       2.23
// @dtversion     110113223
// @timestamp     1294933194918
// @description   Integrate kaskus uploader; Show Mostly Used Smiley beside your vb_Textarea Editor; Integrate Custom Kaskus Smiley list; Set your fav image/smiley colection; Hover preview++
// @author        idx (http://userscripts.org/users/idx)
// --------------------------------------------------------
// 
// -!--latestupdate
// 
// v 2.24 - 2011-01-24
// : Fix minor CSS (blog_post.php)
// 
// v 2.23 - 2011-01-13
// : Fix CSS (Improve CSS3 Opera)
// : Fix Uploader (deprecate some CSS; -Opera)
// 
// -/!latestupdate---
// ==/UserScript==
/*
// 
// v 2.22 - 2011-01-12
// : Fix smiley (kecil) failed using IMG tag
// : Fix smiley (besar) invalid path (using IMG tag)
// : Lil improve Uploader
// 
// v 2.21 - 2011-01-10
// : Improve reorder smiley(kecil;besar) sort based on QR's, Add missing emote :bingung
// : Fix subdomain kaskus uploader
// : Minor CSS fix
// : Lil fix on Updater.mparser()
// 
// v 2.20 - 2010-12-27
// : Deprecate unused GM_addGlobalScript
// : Improve GM_addGlobalStyle
// : Set static domain for all kaskus emotes
// 
//
// v 0.1 - 2010-06-20
// : Init
// ------------
// By: Idx._ccpb
// ------------
*/// ==/UserScript==
(function () {
// Initialize Global Variables
var gvar=function() {}

gvar.codename   = 'KERP'+HtmlUnicodeDecode('&#8482;');
gvar.sversion   = 'v' + '2.23';
/* timestamp-GENERATOR
javascript:window.alert(new Date().getTime());
javascript:(function(){var d=new Date(); alert(d.getFullYear().toString().substring(2,4) +((d.getMonth()+1).toString().length==1?'0':'')+(d.getMonth()+1) +(d.getDate().toString().length==1?'0':'')+d.getDate()+'');})()
*/
gvar.scriptMeta = {
  timestamp: 1294933194918 // version.timestamp
 ,dtversion : 110112222 // script-Id
 
 ,titlename : gvar.codename
 ,scriptID : 79879 // script-Id
};
const OPTIONS_BOX = {  
  KEY_SAVE_SMILEY_BOX:    ['1'] // default state of show/hide smiley_box 
, KEY_SAVE_TABS:          ['0,1,0,1'] // default state of show/hide tabs (small/big/custom/mysmile)

, KEY_SAVE_MYSMILE_COUNT: ['0'] // count saved image link 
, KEY_SAVE_MYSMILE_DATA:  [''] // raw data image
, KEY_SAVE_S_INFO:        ['0:0'] // script info
, KEY_SAVE_KERP_LastUpdate: ['0'] // lastupdate timestamp

};
const GMSTORAGE_PATH      = 'GM_';
var _LOADING = '';


// prototype Inititalizing
Array.prototype.inArray = function(valeur, like) {
    for (var i in this) { if(this[i] == valeur) return i; }
    return -1;
};
String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g,"");
};

GM_addGlobalStyle=function(css, id, tobody) { // Redefine GM_addGlobalStyle with a better routine 
  var sel=document.createElement('style'); sel.setAttribute('type','text/css'); 
  if(isDefined(id) && isString(id)) sel.setAttribute('id', id);
  sel.appendChild(createTextEl(css));
  if(isDefined(tobody) && tobody){
    document.body.insertBefore(sel,document.body.firstChild);
  }else{
    var hds = getTag('head');
    if( isDefined(hds[0]) && hds[0].nodeName=='HEAD' )
     window.setTimeout(function() { hds[0].appendChild(sel); }, 100);
    else
     document.body.insertBefore(sel,document.body.firstChild);
  }
  return sel;
};
vB_textarea = {
  init: function(id) {
    this.Obj = (isUndefined(id) ? getById(gvar.id_textarea) : getById(id));
    this.content = (this.Obj ? this.Obj.value : "");
	this.cursorPos = this.rearmPos(); // [start, end]
	this.last_scrollTop = this.Obj.scrollTop; // last scrolltop pos
  },
  rearmPos: function(){ return [this.getCaretPos(), this.Obj.selectionEnd]; },
  clear: function (){ this.set('');this.focus();},
  focus: function (){ this.Obj.focus(); },
  getWidth: function(){
    return this.Obj.style.width;
  },
  setWidth: function(_width, is_addition){    
	var nwidth;	
	if(isDefined(is_addition) && is_addition){
	  nwidth = (parseInt(this.getWidth()) + parseInt(_width) );
	} else {
	  nwidth = ( parseInt(_width) );	
	}
	this.Obj.style.width=nwidth+'px';
	return nwidth;	
  },
  set: function(value){    
    if(!this.Obj)
      this.Obj = getById(gvar.id_textarea);
    this.Obj.value = this.content = value;
  },
  lastfocus: function (){
    var pos = this.content.length;
    if(this.Obj.setSelectionRange)	{
        this.focus();
        this.Obj.setSelectionRange(pos,pos);
    }
    else if (this.Obj.createTextRange) {
        var range = this.Obj.createTextRange();
        range.collapse(true);
        range.moveEnd('character', pos);
        range.moveStart('character', pos);
        range.select();
    }
	this.focus();
  },
  add: function(text){ this.Obj.value+=text; this.focus(); },
  subStr: function(start, end){ return this.content.substring(start, end);},
  getSelectedText : function() {    
	return (this.cursorPos[0]==this.cursorPos[1]? '': this.subStr(this.cursorPos[0], this.cursorPos[1]) );
  },
  getCaretPos : function() {
    //this.focus();
    var CaretPos = 0;
    //Mozilla/Firefox/Netscape 7+ support 
    if(this.Obj)
	  if (this.Obj.selectionStart || this.Obj.selectionStart == '0')
        CaretPos = this.Obj.selectionStart;
    return CaretPos;
  },  
  setCaretPos : function (pos,end){
    if(!end) end = pos;
    if(this.Obj.setSelectionRange)	{ // Firefox, Opera and Safari
        this.focus();
        this.Obj.setSelectionRange(pos,end);
    }
  },
  // ptpos stand to puretext position [start, end]
  setValue : function(text, ptpos){
    if(!text) return;
    var start=this.cursorPos[0];
	var end=this.cursorPos[1];
    if(isUndefined(ptpos)) ptpos=[text.length,text.length];
	if(start!=end) {
	  this.replaceSelected(text,ptpos);
	  return;
	}
    var bufValue = this.subStr(0, start) + text + this.subStr(start, this.content.length);
	this.set(bufValue);
	 // fix chrome weird
	this.setCaretPos( (start + ptpos[0]), (start+ptpos[1]) );
	this.Obj.scrollTop = (this.last_scrollTop);
    return bufValue; 
  },
  wrapValue : function(tag, title){
	var start=this.cursorPos[0];
	var end=this.cursorPos[1];
	tag = tag.toUpperCase();
	{
    var bufValue = this.subStr(0, start) + 
	    '['+tag+(title?'='+title:'')+']' + 
		 (start==end ? '' : this.subStr(start, end)) + 
		'[/'+tag+']' + 
		this.subStr(end, this.content.length);
	}
	this.set(bufValue);

	var st2 = (start + ('['+tag+(title?'='+title:'')+']').length);
	this.setCaretPos( st2, st2+this.subStr(start, end).length );
	
	this.Obj.scrollTop = (this.last_scrollTop);
    return bufValue; 
  },
  replaceSelected : function(text, ptpos){
    if(!text) return;
    var start=this.cursorPos[0];
	var end=this.cursorPos[1];
    if(isUndefined(ptpos)) ptpos=[text.length,text.length];
	if(start==end) return;	
    var bufValue = this.subStr(0, start) + text + this.subStr(end, this.content.length);
	this.set(bufValue);
	this.setCaretPos( (start + ptpos[0]), (start+ptpos[1]) );
	this.Obj.scrollTop = (this.last_scrollTop);
  }
  
};
// utk add - remove element
Dom = {
  get: function(el) {
   if(!el) return false;
   if (typeof el === 'string')
     return document.getElementById(el);
   else
     return el;
  },
  add: function(el, dest) {    
    var el = this.get(el);
    var dest = this.get(dest);
    if(el && dest) dest.appendChild(el);
  },
  remove: function(el) {
    var el = this.get(el);
	if(el && el.parentNode)
      el.parentNode.removeChild(el);
  }
};
Ev={
  add: function() {
    if (window.addEventListener) {
      return function(el, type, fn) {
        Dom.get(el).addEventListener(type, fn, false);
      };	  
    } else 
	if (window.attachEvent) {
      return function(el, type, fn) {
        var f = function() {
          fn.call(Dom.get(el), window.event);
        };
        Dom.get(el).attachEvent('on' + type, f);
      };
    }
  }()
};

// Fliper :: wordflip.net
FlipWordsEngine = {    
    flipTable: {
        a : '\u0250',
        b : 'q',
        c : '\u0254',
        d : 'p',
        e : '\u01DD',
        f : '\u025F',
        g : '\u0183',
        h : '\u0265',
        i : '\u0131',
        j : '\u027E',
        k : '\u029E',
        l : '\u05DF',
        m : '\u026F',
        n : 'u',
        r : '\u0279',
        t : '\u0287',
        v : '\u028C',
        w : '\u028D',
        y : '\u028E',
        '.' : '\u02D9',
        '[' : ']',
        '(' : ')',
        '{' : '}',
        '?' : '\u00BF',
        '!' : '\u00A1',
        "\'" : ',',
        '<' : '>',
        '_' : '\u203E',
        '\\' : '\\',
        ';' : '\u061B',
        '\u203F' : '\u2040',
        '\u2045' : '\u2046',
        '\u2234' : '\u2235'
    },    
    flipText: function(input) {
        var last = input.length - 1;
        var result = new Array(input.length);
        for (var i = last; i >= 0; --i) {
            var c = input.charAt(i);
            var r = this.flipTable[c];
            result[last - i] = r != undefined ? r : c;
        }
        return result.join('');
    },    
    init: function() {
        // setup table data
        for (i in this.flipTable) {
            this.flipTable[this.flipTable[i]] = i;
        }        
    }
};
GM_XHR = {
  uri:null,
  returned:null,
  cached:null,
  request: function(cdata,met,callback){
    if(!GM_XHR.uri) return;
	met=(isDefined(met) && met ? met:'GET');
	cdata=(isDefined(cdata) && cdata ? cdata:null);
		
	if(typeof(callback)!='function') callback=null;	
	if(cdata) GM_xmlhttpRequest.data=cdata;
	
    GM_xmlhttpRequest( {
		method:met,
		url:GM_XHR.uri + (GM_XHR.cached ? '':(GM_XHR.uri.indexOf('?')==-1?'?':'&rnd=') + Math.random().toString().replace('0.','')),
		//data:cdata,
		onload: function(ret) {
		  if(ret.status==503){
		    console.log('Reach 503, retrying...');
		    setTimeout(GM_XHR.request(cdata,met,callback), 777);
		  }else{
		    var rets=ret;
		    if(callback!=null)
			   callback(rets);
			else
			   GM_XHR.returned = rets;
		  }
		}
	} );
  }
};

// utk cek update (one_day = 1000*60*60*24 = 86400000 ms) // milisecs * seconds * minutes * hours
// customized from FFixer & userscript_updater
Updater = {
  caller:''
 ,check: function(forced){
    var intval = (1000*60*60*gvar.settings.updates_interval);
    if((forced)||(parseInt( getValue("KEY_SAVE_"+"KERP_LastUpdate") ) + parseInt(intval) <= (new Date().getTime()))) {
	 gvar.updateForced = forced;
	 if(!forced) Updater.caller='';
     // prep xhr request
	 
     GM_XHR.uri = 'http://'+'userscripts.org'+'/scripts/source/'+ gvar.scriptMeta.scriptID + '.meta.js';
     GM_XHR.cached = false;
     GM_XHR.request(null,'GET',Updater.callback);
    }
  }
 ,callback: function(r){
    setValue("KEY_SAVE_"+"KERP_LastUpdate", new Date().getTime() + "");
	if(Dom.get(Updater.caller))
	  Dom.get(Updater.caller).innerHTML = 'check now';
	r = r.responseText || false;
	
	var oltimestamp = r.match(/@timestamp(?:[^\d]+)([\d\.]+)/);
	oltimestamp = (oltimestamp ? oltimestamp[1] : false);
	
	if(r){
      if (oltimestamp && oltimestamp > gvar.scriptMeta.timestamp) {
        Updater.initiatePopup(r); 
      } else {
        Updater.notify_done(false);
        if (gvar.updateForced){
          if(r.match(/title>404\sNot\sFound<\/title>/i))
		    alert(GM_XHR.uri +"\n\n"+ "404 Not Found, server might be busy.");
		  else
		    alert("No update is available for "+gvar.scriptMeta.titlename);
		}
      }
	}else{
	  // nothing, r is failed
	  Updater.notify_done(false);
	  if(gvar.updateForced)
	    alert(GM_XHR.uri +"\n\n"+ "Request failed.");
	}
  }
 ,initiatePopup: function(rt){    
    Updater.meta=Updater.mparser(rt);
	Updater.showDialog(
       '<img id="nfo_version" src="'+gvar.B.news_png+'" class="qbutton" style="float:left; margin:3px 5px 0 2px;padding:3px;"/> '
	  +'<b>New'+' '+gvar.scriptMeta.titlename+'</b> (v'+ Updater.meta.cvv[1]+') is available'
      +'<div style="float:right;margin:9px 0 0 15px;"><a class="qbutton" href="http://'+ 'userscripts.org'
      +'/scripts/show/'+gvar.scriptMeta.scriptID+'" target="_blank" title="Goto KERP Home">Home</a></div>'
      +'<div style="float:right;margin-top:9px;"><a id="do_update" class="qbutton" href="javascript:;"><b>Update</b></a></div>'
      +'<div style="margin-left:22px;">Wanna make an action?</div>'
    );
    Ev.add(Dom.get('upd_close'),'click', function(){
       Dom.remove('upd_cnt');
    });    
    Ev.add(Dom.get('upd_notify_lnk'),'click', function(){
       if(Dom.get('upd_cnt')){
         Dom.remove('upd_cnt');
       }else{
         Updater.notify_progres();
         Updater.check(true);
       }
    });    
    Ev.add(Dom.get('do_update'),'click', function(){  
      GM_openInTab('http://'+'userscripts.org'+'/scripts/source/'+gvar.scriptMeta.scriptID+'.user.js');      
      window.setTimeout(function(){ Dom.remove('upd_cnt'); }, 1000);
    });    
  }
 ,showDialog: function(inner){
    var Attr, el;
    if(Dom.get('upd_cnt')) Dom.remove(Dom.get('upd_cnt'));
    Attr = {id:'upd_cnt','class':'tborder qrdialog',style:'position:fixed;z-index:999999;'};
    el = mycreateElement('div', Attr);
    getTag('body')[0].insertBefore(el, getTag('body')[0].firstChild);
    
    Attr = {'class':'qrdialog-close'};
    el = mycreateElement('div', Attr, false, '<a id="upd_close" class="qbutton" javascript:; title="Close"><img src="'+gvar.domainstatic+'images/misc/menu_open.gif" /></a>');
    Dom.add(el, Dom.get('upd_cnt'));

    Attr = {id:'upd_child','class':'qrdialog-child'};
    el = mycreateElement('div', Attr, false, inner);
    Dom.add(el, Dom.get('upd_cnt'));
	// nfo news
	if( Updater.meta.news ){
	  Dom.get('nfo_version').setAttribute('title', 'What\' New...');
	  Dom.get('nfo_version').style.setProperty('cursor', 'pointer', '');
	  Ev.add(Dom.get('nfo_version'), 'click', function(){ alert( gvar.scriptMeta.titlename+'\n== Last LOG Update ==' + Updater.meta.news );});
	}    
    Updater.notify_done(true);
 }
  
 ,notify_progres: function(caller){
    Dom.get('upd_notify').innerHTML = '<img style="margin-left:10px;" id="fetch_update" src="'+gvar.B.loading_gif+'" border="0"/>';
	if(Dom.get(caller)) {
	  Updater.caller=caller;
	  //Dom.get(caller).innerHTML='checking..'; // OR check now
	  Dom.get(caller).setAttribute('title','checking..'); // OR check now
	}
 }
 ,notify_done: function(anyupd){
    Dom.get('upd_notify').innerHTML = (anyupd ? '<a id="upd_notify_lnk" href="javascript:;" title="Update Available"><img style="position:absolute;margin:-5px 0 0 5px;" src="'+gvar.B.updates_png+'" width="17" border="0"/></a>':'');
    if(Dom.get('upd_notify').innerHTML==''){
	   el = mycreateElement('img',{'src':gvar.B.upd_png,alt:'[Update]',border:'0'});
	   Ev.add(el, 'click', function(){
         Updater.notify_progres('upd_notify');
	     Updater.check(true);
	     return false;
	   });

	   Dom.get('upd_notify').appendChild(el);
    }
 }
 ,mparser: function(rt){
	return {
     tv:rt.match(/@timestamp(?:[^\d]+)([\d]+)/)||[null],
     cvv:rt.match(/@version(?:[^v\d]+)([\d\.\w]+)/)||[null],
     news:(function(x){
	      var wrp=['// -!--latestupdate','// -/!latestupdate---'];
	      var p=[x.indexOf(wrp[0]), x.indexOf(wrp[1])];
		  return (p[0]!=-1 && p[1]!=-1 ? String( x.substring(p[0]+wrp[0].length, p[1]) ).replace(/\/+\s*/gm, function($str,$1){return " ";}) : '');
	    })(rt)
    };	
  }
}; // -end Updater

// =============

// initialize global var
function init(){

  // checking browser
  ApiBrowserCheck();
  
  //gvar.scriptInfo = ['79879','0',gvar.vversion.toString()]; // [scriptId,usoversion,vversion]
  
  gvar.loc = location.href;
  gvar.dmkaskus = 'kaskus.us';
  gvar.domainstatic = 'http://'+'static.'+gvar.dmkaskus+'/';
  gvar.dmUploader = 'u.'+gvar.dmkaskus;
  gvar.isUploader = (gvar.loc.match(/^http:\/\/u\.kaskus\.us\/.*/));
  
  gvar.id_smilebox = 'vB_Editor_001_smiliebox';
  gvar.id_textarea = 'vB_Editor_001_textarea';
  
  gvar.width_smilebox = '280';
  
  gvar.uso = 'userscripts.org';
  gvar.akronim = 'Kaskus Enhanced Reply-Post';
  
  gvar.INTERVAL = null;
  
  // icon resource
  gvar.B = getSetOf('button');
  _LOADING = '<img src="'+gvar.B.loading_gif+'" border="0"/>&nbsp;<small>loading...</small>';
  
  
  // id tab
  gvar.tabTitleId = ['skecil_container', 'sbesar_container', 'scustom_container', 'mysmiley_container']; 
  gvar.tabSmiley = []; // show/hide tab smile
  gvar.smiley_box = 1; // show/hide tab smile
  
  var isPm = (gvar.loc.indexOf('private.php')!=-1);
  gvar.imgTagMode = (isPm ? ['1','1']:['0','0']); // toogle between mode imgtagor bbcode :: 'skecil_container','sbesar_container'
  
  gvar.settings = {
     autochkUpdates: true // enable update-check ?
    ,updates_interval: 3 // 1 day(s)
  };  
  
  gvar.tabIndex_order = [];
  
  // Offsetnya preview image
  gvar.xOffset = 20;
  gvar.yOffset = 20;
  
  // do check whether uploader or editor
  precheck_location();
  
}
function precheck_location() {
    // = pre-check location is it uploader or forum =
    if(gvar.isUploader != null){
      // chk the identity before hiding elements  
      if(GM_getValue('iframe_preload', 0) == 0){
        show_alert('iframe_preload=0; returning..',0);
  	  return;
  	  }
      try{
        var h2 = getTag('h2');
        h2[0].style.display='none';
        getById('pt6').style.display='none';
        getById('pt4').style.display='none';
        getById('theform').setAttribute('style', 'width:37.5em;');
        getById('pt5').setAttribute('style', 'width:36.7em; padding:0.7em;');    
        // replace a href link
  	    var pt5 = getById('pt5');
  	    if(pt5){
  	      neoInner = pt5.innerHTML.replace(/\/view\/\w+\//ig, '\/').replace(/(href=\"(?:[^>]+))/ig, '$1 target="_blank"');
  	      getById('pt5').innerHTML = neoInner;
  	    }
        // clean it up
        window.setTimeout(function() {
          GM_setValue("iframe_preload", 0);
        }, 0);
  	
      } catch(e) {}	
  	  show_alert('Done manipulate Uploader; returning..',0);
  	  return;   
    }
   
    if(!getById(gvar.id_textarea)) {
      show_alert('vbTextarea notfound, failed create smilebox; returning', 0);
      return;
    }else{	
	  
      start_routine(); 
    }
}
function start_routine(){

  // place global style 
  GM_addGlobalStyle(getCSS());
  
  
  // reorder tabIndex & stuff on newreply  
  if( gvar.loc.match(/^https?\:\/\/w{3}\.kaskus\.us\/newreply\.php\?.*/i) ){
    reorder_tabIndex();
  }

  // get & Load smilie
  getSmilieSets();
  getOptions();
  
  //align adjuster
  align_adjuster();
  
  // recreate smilebox container on PM
  if(!getById(gvar.id_smilebox)) recreate_smilebox();

  // recreate editor on VM  
  if(gvar.loc.indexOf('visitormessage.php')!=-1) recreate_editor();
  
  // alocate/build smiliebox DOM and its content
  loadSmilieBox();
  
  // load text counter
  loadCounter();
  
  if(gvar.loc.indexOf('visitormessage.php')==-1){
    init_smileyeditor();
  }
  if(false && gvar.loc.indexOf('visitormessage.php')==-1){
    // add- remove element
    loadAddRemove();	
	// if ada mysmiley tambahin dah tuh & yap gak berlaku di VM
    if(gvar.mysmile_count > 0) fillwith_MySmile();
  }  
  
  // add customed controller
  spoiler_act();  
  
  var fieldset = getTag('fieldset');
  if(fieldset){
    var fldset_upload = false;
    for (var i=0;i<fieldset.length; i++){
        if(fieldset[i].innerHTML.indexOf('Upload Images') != -1){
    		fldset_upload = fieldset[i];
            break;
        }
    }	
    if(!fldset_upload){
	  show_alert('fieldset Upload "fldset_upload" not found; Failed create uploader...',0);
      //return;  // fieldset legend Upload Images not found
	} else {
	  var legend = getTag('legend', fldset_upload);
	  if(legend){
	    legend = legend[0];
	    var Attr = {id:'legend_subtitle', style:'font-weight:bold;'};
        var el = mycreateElement('span',Attr);
		Dom.add(el, legend);
	  }
	  // create form DOM upload
      attach_form();
      Dom.remove(getTag('a', fldset_upload)[0]);      
      // load iframe and upload button
      fldset_upload.appendChild( get_tpl() );
	}	
  } else {
    show_alert('tag legend "fieldset" not found; Failed create uploader...',0);
    //return; // tag legend not found
  }
  
  // additional event for some elements
  additional_event();
  
  if(!gvar.noCrossDomain && gvar.settings.autochkUpdates)
    window.setTimeout(function(){ Updater.check(); }, 5000);

} // end start_routine

function init_smileyeditor(){
  // daptarin smwa var dulu ah
  var Div1, Div2, Div3, el, p0, Attr;
  var editorID = 'mysmileyeditor_content';
  
  // parent container
  Attr = {'class':'smallfont',style:'margin-top:10px;'};
  Div1 = mycreateElement('div',Attr);
  
  // 'mysmiley_container'
  Attr = {'class':'smallfont addremove',
   style:'display:'+ (gvar.tabSmiley[3]==1 ? '':'none') +';',
   id:gvar.tabTitleId[3] 
  };
  Div2 = mycreateElement('div',Attr);
  Div1 = judulSmiley(Div1, 'My Smiley', Div2.id);
  
  p0 = mycreateElement('p', {'style':'margin:0;padding:0;'});
  Attr = {'class':'twbtn twbtn-m lilbutton',style:'float:left;margin-top:5px;',id:'manage-smiley'};
  Obj = mycreateElement('small',Attr,false,'Manage MySmiley');
  p0.appendChild(Obj);
  Attr = {'class':'twbtn twbtn-m lilbutton',style:'float:left;margin:5px 0 0 10px;display:none;',id:'manage-cancel'};
  Obj = mycreateElement('small',Attr,false,'Cancel');
  p0.appendChild(Obj);
  
  Attr={id:'help_manage',href:'javascript:;','class':'twbtn twbtn-m lilbutton',style:'float:right;display:none;margin-top:5px;',title:'RTFM'};
  Obj = mycreateElement('small',Attr,false,' ? ');  
  
  p0.appendChild(Obj);

  // append element customsmiley_content
  // 'scustom_container'
  Attr={'class':'smallfont smilebesar',id: gvar.tabTitleId[3]+'_img'};
  Div3= mycreateElement('div',Attr,false,'<span class="no_smile">--no smiley--</span>');
  Div2.appendChild(Div3);
  Div2.appendChild(p0);
  
  // append element smileyeditor_content  
  Attr={id:editorID,style:'display:;clear:left;'};
  Div3= mycreateElement('div',Attr);
  
  // append editor
  Div2.appendChild(Div3);  
  
  Div1.appendChild(Div2);
  getById(gvar.id_smilebox).appendChild(Div1);
  
  reload_mysmiley();
  
  if(Dom.get('help_manage'))
    Ev.add('help_manage', 'click', function(){
     alert(''
     +'Each Smiley separated by newline.\nFormat per line:\n tag|smileylink'
     +'\n eg.\ncheers|http:/'+'/static.kaskus.us/images/smilies/sumbangan/smiley_beer.gif'
     );
    });
  if(Dom.get('manage-smiley'))
    Ev.add('manage-smiley', 'click', function(e){manage_smiley(e);});
  if(Dom.get('manage-cancel'))
    Ev.add('manage-cancel', 'click', function(e){manage_smiley(e);}); 
}

function manage_smiley(e){
    e = e.target||e;
	var el, imgtxta, task = e.innerHTML;
	var txtaID = 'textarea_mysmiley';
	var editorID = 'mysmileyeditor_content';
	var par = Dom.get(editorID);
	
	var buff = '';
	switch(task){
	  case "Manage MySmiley":
	   par.innerHTML = '';
       Attr = {id:txtaID,'class':'textarea txta_smileyset',wrap:'off'};
       imgtxta = mycreateElement('textarea',Attr);
	   var img, tag, prefix = 'my__';
	   
	   for (var i in gvar.mysmilies) {
	      // pick image with defined prefix only
          if(i.indexOf(prefix) == -1 || typeof(gvar.mysmilies[i])=='function') 
	         continue;
          img=gvar.mysmilies[i];
		  if( !isString(img) ){
	        buff+= img[2]+'|'+img[0] + '\n';
		  }else{
		    var retEl=validTag(img, false, 'editor');
			buff+= retEl;
		  }
	   }
	   imgtxta.value = buff;
	   par.appendChild(imgtxta);
	  break;	  
	  
	  case "Save":
		buff = { ret:'',count:0 };
		imgtxta = Dom.get(txtaID);
        if(imgtxta) 
		  buff = do_filter_scustom(imgtxta.value);
		  
		var ks = 'KEY_SAVE_';
		setValue( ks + 'MYSMILE_COUNT', buff['count'] );
        setValue( ks + 'MYSMILE_DATA', buff['ret'] );
		getOptions();
		// re attach
        window.setTimeout(function() { reload_mysmiley() }, 200);
		
		Dom.remove(imgtxta);
	  break;
	  
	  case "Cancel":
	    task='Save';
		el = Dom.get(txtaID);
		if(el) el.style.display = (task=='Save' ? 'none':'');
	  break;	
	}
	
	el = Dom.get('manage-cancel');
	if(el) el.style.display = (task=='Save' ? 'none':'');
	el = Dom.get('help_manage');
	if(el) el.style.display = (task=='Save' ? 'none' : '');

	if(e.innerHTML!='Cancel')
	  e.innerHTML = (task=='Save' ? 'Manage MySmiley':'Save');
	else
	  Dom.get('manage-smiley').innerHTML = (task=='Save' ? 'Manage MySmiley':'Save');
}

function reload_mysmiley(tgt){
  var img, span0, title, prefix = 'my__';
  var tosave = [];
  var recount = 0;
  if(isUndefined(tgt)) tgt = gvar.tabTitleId[3]+'_img';
  Div_image = Dom.get(tgt);
  
  Div_image.innerHTML = '';
  for (var i in gvar.mysmilies) {
    // pick image with defined prefix only
    if(i.indexOf(prefix) == -1 || typeof(gvar.mysmilies[i])=='function')
	   continue;    
    img=gvar.mysmilies[i];
	if( !isString(img) ){
      // Unity tag container
      Attr = {id:'tag_'+i};
      spanCon = mycreateElement('span', Attr);
      // start creating element..
      Attr = {rel:HtmlUnicodeDecode('&#8212;')+img[2],'class':'bbc_big',id:i};
      if( img[1] ) 
	    Attr.tag = img[1];
      title = img[2].replace(prefix,'');
	  
      span0 = createSmile(Attr,title);
	  
      spanCon.insertBefore(span0, spanCon.firstChild);
      //spanCon.appendChild(createTextEl(' '));
	  spanCon.appendChild(createTextEl(' '+HtmlUnicodeDecode('&#183;')+' '));
	  Dom.add(spanCon,Div_image);
      
	  tosave.push( i+'::'+img[0].replace(/^http:\/\//,'')+'::'+title );
	  recount++;
    }else {
	   // this is string and do replace to suitable value
       var sep, retEl=validTag(img, true, 'view');
       if(!retEl) continue;
       if(retEl.nodeName=='B'){
         if(Div_image.innerHTML!='') {
            sep = mycreateElement('br', {});
            Dom.add(sep,Div_image);
         }
         Dom.add(retEl,Div_image);
         sep = mycreateElement('br', {});
         Dom.add(sep,Div_image);
       }else{
         Dom.add(retEl,Div_image);
       }
	   tosave.push( 'my__sgtag'+'::'+img );
    }	 
  }

  //
  if( recount == 0 ){
    Div_image.innerHTML = '<span class="no_smile">--no smiley--</span>';
  }

  return String(tosave).replace(/\,/g,'||');
}

function do_filter_scustom(text){
  var buf=text;
  var count=0, retbuf='';
  if(buf!=''){
    var re,sml;
    var tosingle = {
       '\\|{2,}' : '|'
      ,'(\\r\\n){2,}' : '\r\n{sctag:br}\r\n,'
      ,'(\\n){2,}' : '\n{sctag:br}\n'
    };
    // step -1 to strip
    //buf = buf.replace(/[\[\]\,]/g,"");
    buf = buf.replace(/(?:\:\:)|(?:\|\|)|[\,]/g,"");
         //show_alert('step-to single');
    for(var torep in tosingle){
      if(!isString(tosingle[torep])) continue;
      re = new RegExp(torep, "g");
      buf = buf.replace(re, tosingle[torep])
    }
    // step -3 to validate per line    
    buf=(document.all ? buf.split("\r\n") : buf.split("\n")); // IE : FF/Chrome
    
    var fkey, smllink, sml;
    var sepr = '||'; // must be used on extracting from storage	
	
	gvar.mysmilies = {};
    for(var line in buf){
        if(!isString(buf[line])) continue;
        buf[line] = trimStr ( buf[line] ); // trim perline
        sml = /([^|]+)\|(http(?:[s|*])*\:\/\/.+$)/.exec( buf[line] );
		// smiley thingie ?
        if(sml && isDefined(sml[1]) && isDefined(sml[2]) ){
		   	retbuf+='my__'+sml[1]+'::'+sml[2].replace(/^http(?:[s|*])*:\/\//,'')+'::'+sml[1] + sepr; // new separator
            count++;
        }else if(sml=validTag( buf[line], false, 'saving' ) ){ // valid tag ?
            retbuf+='my__sgtag'+'::'+sml+sepr;
        }
    } // end for	
  }
  if(count==0) delete(gvar.mysmilies);
  return {'ret': retbuf, 'count': count};
}
function do_sanitize(text){
  var ret=text;
  var filter = [
     "[\\\"\\\'][\\s]*(javascript\\:+(?:[^\\\'\\\"]+))[\\\"\\\']"
    ,"((?:\\&lt;|<)*script(?:\\&gt;|>)*)"
    ,"((?:\\&lt;|<)*\\/script(?:\\&gt;|>)*)"
    ,"</?(?:[a-z][a-z0-9]*\\b).*(on(?:[^=]+)=[\\\"\\\'](?:[^\\\'\\\"]+)[\\\"\\\'])"
    ,"</?(?:[a-z][a-z0-9]*\\b).+(style=[\\\"\\\'](?:\\w+)\\/\\*[.+]*\\*\\/\\w+\\:[^\\\"]+\\\")"
    ,"<[\s]*>"
   ];
  var re, torep, do_it_again='';
  // need a loop until it's really clean | no match patern
  while( do_it_again=='' || do_it_again.indexOf('1')!=-1 )
  {
    do_it_again = '';
    for(var idx in filter){
     if(!isString(filter[idx])) continue;
     re = new RegExp(filter[idx], "ig");
     if(ret.match(re)){
      do_it_again+='1';
      torep = re.exec(ret);      
          //clog('replacing='+filter[idx]+'; torep='+torep[1]);
      if(torep && isDefined(torep[1]))
        ret=ret.replace(torep[1], '');
     }else{
      do_it_again+='0'; // must diff than (do_it_again=='')
     }
    }
  }
  
  return ret;
}
function validTag(txt, doreplace, mode){
  if(!isString(txt)) return false;
  ret=txt;
  var re,cucok = false;  
  var matches = {
   "{title:(.+)}" : ['b', '$1'],
   "{sctag:(br)}" : ['br','']
  };
  var val;
  for(var torep in matches){
    re = new RegExp(torep, "");
    if(ret.match(re)){
      cucok=true;
         //clog('cur torep='+torep)
      if(isDefined(doreplace) && doreplace){ // must be from view mode
        val=ret.replace(re, matches[torep][1]);
        val = do_sanitize(val);
        ret = mycreateElement(matches[torep][0],{'class':'mytitle'},false,val);
      } else if(isDefined(mode) && mode=='editor') // editor mode and it's a BR
        if(torep=='{sctag:(br)}') {
          ret=txt.replace(re, '\n');
        }else{
          // guess it should be a title
          var title = re.exec(txt);
            //clog('mode='+mode+'; title; title='+title)
          if(re && isDefined(title[1])){
            val = do_sanitize(title[1]).replace(/\:/g,'\\:');
            ret='{title:'+val+'}\n'; 
          }else{
            ret=txt.replace(/\:/g,'\\:')+'\n'; 
          }
        }
      break;
    }
  }
  return (cucok ? ret : false);              
}

// =============
// fetch options from saved state store it on gvar
function getOptions(){

  // getValue will try get from GM_getValue, if not available it will take from const OPTIONS_BOX
  var ks = 'KEY_SAVE_';
  var tabs = getValue(ks+'TABS').toString().split(',');
  
  for(var i in tabs){
      if(typeof(tabs[i])!='function') // ignore inArray element
    /*>>*/ gvar.tabSmiley[i] = tabs[i];
  }
  
  /*>>*/ gvar.smiley_box = getValue(ks+'SMILEY_BOX'); // get visibility smiley_box  
  /*>>*/ gvar.mysmile_count = getValue(ks+'MYSMILE_COUNT'); // get how any imglink
  
  var raw_str, raws, row, dumy;
  gvar.mysmilies = {};
  raw_str = getValue(ks+'MYSMILE_DATA');  
  if(raw_str!=''){
    raws = raw_str.split('||');
	var raws_l = raws.length;
	for(var j=0;j<raws_l; j++){
       /**
       // rawdata will be looks like this
       // image link w/o prefix http://
       // my__artist::www.magazine.ucla.edu/depts/style/artist.jpg::artist||my__asal::www.magazine.ucla.edu/depts/style/asal.jpg::asal
       */
       row = raws[j].split('::');      
       //if( row[0] && row[1] && row[2] ){
       if( row[0] && row[1] ){
	     if( row[0].indexOf('my__')!=-1 ){            
				gvar.mysmilies[row[0]] = ( isDefined(row[2]) ? ['http://'+row[1], '', row[2]] : row[1] );
		 }else{
          /*>>*/ gvar.smiliecustom[row[0]] = ['http://'+row[1], '', row[2]];
		 }
		 //show_alert( gvar.smiliecustom[row[0]] );
       }
	}
  }
  return gvar.mysmile_count;
}

// add some event on element
function additional_event(){
  var form = getByName('vbform', 'form');
  var el = mycreateElement('input', {id:'submit_type',value:'sbutton',type:'hidden'} );
  form.appendChild(el);
  
  // search for every submit type button
  var nodes = getByXPath('.//input[@type="submit"]', form);
  if(nodes)
    for(var i=0; i<nodes.snapshotLength; i++){
	   Ev.add(nodes.snapshotItem(i), 'click', function(e){
	     e=e.target||e;
	     Dom.get('submit_type').value=e.name;
	   });
	}  
  Ev.add(form, 'submit', function(e){
	if(Dom.get('submit_type').value=='preview') return;
    var hi=(Dom.get('hash') ? Dom.get('recaptcha_response_field') : null);
	if(hi.value==''){
      alert('Belum Isi Image Verification'); hi.focus();
      e.preventDefault(); // return false;
      return false;
	}
  });
}

// reorder tabIndex, focus field
function reorder_tabIndex(){
  
  var par=getTag('div', getByClas('panel', 'div') )[0];
  var nodes = getByXPath('.//input[@class="bginput"]', par );  
  var hi = Dom.get('recaptcha_response_field'); // capcay_input
  if(hi){
	hi.setAttribute('tabindex', 1);
  }else{
    hi = nodes.snapshotItem(0); // Reason for Editing
  }

  if(nodes)
    for(var i=0; i<nodes.snapshotLength; i++)
	  nodes.snapshotItem(i).setAttribute('tabindex', 1);

  if(getById(gvar.id_textarea))
     getById(gvar.id_textarea).setAttribute('tabindex', 1);
	 
  var isPreviewMode = getByXPath_containing('//td', false, 'Preview');
  isPreviewMode = (isPreviewMode && isPreviewMode.length > 0 && isPreviewMode[0].getAttribute('class')=='tcat' ? true:false);
  
  window.setTimeout(function(){
     try{ hi.focus(); 
	   if(isPreviewMode){var mo=(getById('Middleorgna')?getAbsoluteTop(getById('Middleorgna')):95);scrollTo(0,mo);} 
	 } catch(e){}; // first load, try focus to element
   }, 200);
}

// in private.php (PM) need to create this node first
function recreate_smilebox(){
 var txa = getById(gvar.id_textarea);
 {
   var parent;
   if(txa.parentNode.nodeName=='TD')
     parent = txa.parentNode.parentNode;
   else	{
     parent = txa.parentNode;
	 parent.parentNode.setAttribute('style', 'max-width: 90%;');
	 parent.setAttribute('style', 'height:220px !important;');
     txa.setAttribute('style', 'float:left;width:480px;');
   }
 }
 var fieldset = mycreateElement('fieldset', { id:gvar.id_smilebox,style:'max-width:'+gvar.width_smilebox+'px;' } ); 
 var holder= document.createElement( (parent.nodeName=='TR' ? 'td' : 'div') );
 if(parent.nodeName=='DIV')
   fieldset.setAttribute('style', 'float:left;');   
 
 holder.appendChild(fieldset);
 parent.appendChild(holder);
}
// in visitor message need to recreate editor container
function recreate_editor(){
  var chld = [getById(gvar.id_textarea).parentNode, getById(gvar.id_smilebox)]; // txtarea, smilebox
  var par = getByClas('panel', 'div'); // style yakin >,<
  par = getTag('div', par);
  var Attr, div0,ctbl,ctr,ctd, tbl,tr,td;
  tbl = mycreateElement('table', {cellpadding:'0',cellspacing:'0',border:'0'});
  tr = mycreateElement('tr',{});  
  td = mycreateElement('td',{id:'vB_Editor_001',colspan:'2','class':'vBulletin_editor',width:par[0].clientWidth});
  div0 = mycreateElement('div',{'class':'controlbar',id:'vB_Editor_001_controls'});
  Attr = {cellpadding:'0',cellspacing:'0',border:'0'};
  ctbl = mycreateElement('table',Attr);
  ctr = mycreateElement('tr',{});
   ctd = mycreateElement('td',{},false,'&nbsp;'); // harus &nbsp; utk xpath
  ctr.appendChild(ctd);
   ctd = mycreateElement('td',{width:'100%'},false,'&nbsp;'); // harus 100% utk xpath
  ctr.appendChild(ctd);
  ctbl.appendChild(ctr);
  div0.appendChild(ctbl);
  td.appendChild(div0);
  
  ctbl = mycreateElement('table',Attr);
  ctr = mycreateElement('tr',{});
   ctd = mycreateElement('td',{});
  ctr.appendChild(ctd);
  ctbl.appendChild(ctr);  
  div0.appendChild(ctbl);
  td.appendChild(div0);
  // end vB_Editor_001_controls
  
  ctbl = mycreateElement('table',Attr);
  ctr = mycreateElement('tr',{});
   ctd = mycreateElement('td',{valign:'top'});
   ctd.appendChild(chld[0]); // appending textarea
  ctr.appendChild(ctd);
   ctd = mycreateElement('td',{valign:'top'});
   ctd.appendChild(chld[1]); // appending smilebox
  ctr.appendChild(ctd);
  ctbl.appendChild(ctr);  
  td.appendChild(ctbl);
  tr.appendChild(td);

  tbl.appendChild(tr);
  par[0].appendChild(tbl);  
}

// add buttons to blue control box
function spoiler_act(){
  //
  var vb_Control = getById('vB_Editor_001_controls');
  if(vb_Control){
    var tbl_cont=getTag('table',vb_Control);
	var Attr = {};
    var div1,el;
	if(tbl_cont){
      // guessing lastchild table is the target
	  tbl_cont = tbl_cont[parseInt(tbl_cont.length)-1];
	  tbl_cont.width='100%';
	  var tr_cont = getTag('tr', tbl_cont);
	  if(!tr_cont) {
	  
	    show_alert('failed create spoiler button');
		
	  } else {
		
		// separator
		var Insert = {
		  separator: function(){
		    var p = mycreateElement('td', {});
		    var g = mycreateElement('img', {src:'http:/'+'/www.'+gvar.dmkaskus+'/images/editor/separator.gif'});
		    p.appendChild(g);
		    return p;
		  },
		  spacer: function(ln){
		    var bufspc='';
			for(i=0;i<=ln;i++)bufspc+='&nbsp;';	
		    return mycreateElement('span',{},false,bufspc);			
		  }
		}
		// tambahin separator
		if(gvar.loc.indexOf('visitormessage.php')==-1)
		  tr_cont[0].appendChild(Insert.separator().cloneNode(true));		
		
		Attr = {'class':'smilekecil tcat',style:'padding:1px;width:100%;min-width:130px;'};
		td = mycreateElement('td', Attr);
		
		if(gvar.loc.indexOf('visitormessage.php')==-1){ // no controler for VM
		  Attr={id:'vB_Editor_001_cmd_wrap0_addcontroller','class':'imagebutton'};		
		  div1 = mycreateElement('div', Attr);		
		  
		  // tombol spoiler
		  Attr={title:'Wrap [SPOILER] tags around selected text',
		        alt:'[SPOILER]',style:'vertical-align:bottom',src:gvar.B.spoiler_png
		       };
		  el = mycreateElement('img', Attr);
		  //Ev.add(el, 'click', function(){ return do_addspoiler(); });
		  Ev.add(el, 'click', function(e){ return do_btncustom(e); });
		  div1.appendChild(el);
		  
		  // tombol transparent
	      Attr={title:'Wrap [COLOR=transparent] tags around selected text',
		        alt:'[Transparent]',style:'vertical-align:bottom',src:gvar.B.transp_png
		       };
		  el = mycreateElement('img', Attr);
		  Ev.add(el, 'click', function(e){ return do_btncustom(e); });
		  div1.appendChild(el);
		  		  
		  // tombol flip word
	      Attr={title:'Flip words around selected text',
		        alt:'[FlipWord]',style:'vertical-align:bottom',src:gvar.B.flipw_png
		       };
		  el = mycreateElement('img', Attr);
		  Ev.add(el, 'click', function(){ return do_fliper(); });		  
		  div1.appendChild(el);
		  
		  // tombol noparse
	      Attr={title:'Wrap noparse tags around selected text',
		        alt:'[noparse]',style:'vertical-align:bottom',src:gvar.B.noparse
		       };
		  el = mycreateElement('img', Attr);
		  Ev.add(el, 'click', function(e){ return do_btncustom(e); });
		  div1.appendChild(el);

		  // tombol youtube
	      Attr={title:'Insert Youtube URL',
		        alt:'[youtube]',style:'vertical-align:bottom',src:gvar.B.youtube_gif
		       };
		  el = mycreateElement('img', Attr);
		  Ev.add(el, 'click', function(e){ return do_btncustom(e); });
		  div1.appendChild(el);

		  // end additional button		  
		  td.appendChild(div1);
		}
		tr_cont[0].appendChild(td);
		
		td = mycreateElement('td', {'class':'tcat','width':'100%'});
		Attr={id:'vB_Editor_001_cmd_wrap0_spoiler','class':'imagebutton'};
		div1 = mycreateElement('div', Attr);
		
		// tombol smiley
		var sp = mycreateElement('span', {'class':'smallfont',style:'margin-top:-40px !important;font-weight:bold;line-height:15px;'});
		Attr = {href:'javascript:;',title:'Toogle Smiley',style:'text-decoration:none;'};
		el = mycreateElement('a',Attr,false,'SMILEY');
		Ev.add(el, 'click', function(){ return toogle_smiley_box();return false; });
		sp.appendChild(el);
		div1.appendChild(sp);		
		
		// tombol update
		if(!gvar.notSafe){ // will not availabe on Opera/Chrome
		  //Attr = {href:'javascript:;',id:'chk_update',title:'Check Update..',style:'text-decoration:none;margin-left:10px;'};
		  Attr = {href:'javascript:;',id:'upd_notify',title:'Check Update..',style:'text-decoration:none;margin-left:10px;'};
		  var span0 = mycreateElement('a',Attr);
		  el = mycreateElement('img',{'src':gvar.B.upd_png,alt:'[Update]',border:'0'});
		  Ev.add(el, 'click', function(){
            Updater.notify_progres('chk_upd_now');
			Updater.check(true);
		    return false;
		  });
		  span0.appendChild(el);
		  div1.appendChild(span0);
		  el = mycreateElement('span',{id:'loading_ajax',style:'display:none;'});
		  div1.appendChild(el);
		}
		
		td.appendChild(div1);		
		tr_cont[0].appendChild(td);
	  }
	} // end tbl_cont
	
	// nyiapin nyari elemen buat return update
    var top_cont = getByXPath('//td[@width="100%"]', vb_Control);
	if(top_cont){
	   i=-1;var nodecont;
	   while(i<top_cont.snapshotLength){
	     i++; nodecont=top_cont.snapshotItem(i); 
	     if( (nodecont.innerHTML==''||nodecont.innerHTML=='&nbsp;') && nodecont.nodeName=='TD') break;		  
       }
	   // assume we always got this node, make div container
	   nodecont.style.textAlign='right';	   
	   var div0 = mycreateElement('div',{id:'upd_container',style:'display:none;'},false,' ');
	   nodecont.appendChild(div0);
	}
  } // end vb_Control
}

function toogle_smiley_box(){
    var tdsmbx = Dom.get(gvar.id_smilebox).parentNode;
    var dsp = (tdsmbx.style.display=='none' ? '':'none');
		
	gvar.smiley_box = (dsp==''?1:0);
	var calibrate = (dsp==''?-28:28);
	var addition_width = (( (dsp==''?-1:1) * parseInt(gvar.width_smilebox) ) + calibrate );
	
	vB_textarea.init();
	vB_textarea.setWidth(addition_width, true); // yes true add the width, not really set w/ that value
	tdsmbx.style.display=dsp;
	
	setValue('KEY_SAVE_' + 'SMILEY_BOX', gvar.smiley_box);
	vB_textarea.focus();
}

function do_fliper(){
  vB_textarea.init();
  FlipWordsEngine.init();
  var selected = vB_textarea.getSelectedText();
  var text = (selected==''? prompt('Please enter the TexT to flip:', 'saya jangan dibalik') : selected);
  if(text===false) 
    return;
  else{
    text = FlipWordsEngine.flipText(text.toLowerCase());
	var prehead = [0, text.length];	 
    vB_textarea.replaceSelected(text, prehead);
  }  
}
function do_transp(){  
  vB_textarea.init();
  var selected = vB_textarea.getSelectedText();
  var text = (selected==''? prompt('Please enter the Text to be transparent:', 'text hantu') : selected);
  if(!text) return;  
  if(selected!='')
    vB_textarea.wrapValue( 'color', 'transparent' );
  else
    vB_textarea.setValue('[COLOR="transparent"]'+text+'[/COLOR]');
}
function do_addspoiler(){  
  var title = prompt('Please enter the TITLE of your Spoiler:', 'judule');
  if(!title) return; 
  vB_textarea.init();  
  vB_textarea.wrapValue( 'spoiler', (title ? title : 'judule') );  
}
function do_btncustom(e){
  e = e.target||e;
  var tag=e.alt;
  var tagprop = '';
  tag = tag.replace(/[\[\]]/g,'').toLowerCase();
  var pTag={	
    'spoiler':'SPOILER', 'transparent':'COLOR',
    'noparse':'NOPARSE', 'youtube':'YOUTUBE',
  };
  if(isUndefined(pTag[tag])) return;
  vB_textarea.init();
  
  if(tag=='spoiler'){
    var title = prompt('Please enter the TITLE of your Spoiler:', 'title');
    if(!title) return;
	vB_textarea.wrapValue( 'spoiler', (title ? title : 'title') );

  }else{
    var text, selected = (tag=='youtube' ? '':vB_textarea.getSelectedText());
	var is_youtube_link = function(tx){
	    tx = tx.replace(/^\s+|\s+$/g,""); //trim
	    if(tx.match(/youtube\.com\/watch\?v=\w+/i)){
	     var rx = /youtube\.com\/watch\?v=([^&]+)/i.exec(tx);
	     tx = ( rx ? rx[1] : '');
	    }else if(!/^[\d\w-]+$/.test(tx))
	     tx = false;
		return tx;
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
	    case 'youtube':
		  text = prompt('Please enter the Youtube URL or just the ID, \nhttp:/'+'/www.youtube.com/watch?v=########', '');
		  text = (text ? is_youtube_link(text) : false);
		break;
	  }
	  if(!text) 
	    return false;
	  else{
	    var prehead = [('['+pTag[tag]+(tagprop!=''?'='+tagprop:'')+']').length, 0];
		prehead[1] = (prehead[0]+text.length);		
	    vB_textarea.setValue( '['+pTag[tag]+(tagprop!=''?'='+tagprop:'')+']'+text+'[/'+pTag[tag]+']', prehead );
	  }
	  return;
	} // end selected==''
	
	  tagprop = (tag=='transparent' ? 'transparent' : '');
	  vB_textarea.wrapValue( pTag[tag], (tagprop!='' ? tagprop:'') );
  }
}

function align_adjuster(){
  // fix panel alignment; may eat alot of resource so doit later
  window.setTimeout(function() {
	 var w = parseInt(getById(gvar.id_textarea).style.width.replace(/px/,''))+60;
	 if(gvar.smiley_box==1)
	   w+=parseInt(gvar.width_smilebox);
	 var tgt=getTag('div', getByClas('panel', 'div') )[0];
     tgt.style.maxWidth=tgt.style.width= w+'px';
  }, 200);
}

function loadCounter(){
   vB_textarea.init();
   var tdTxtA = getById(gvar.id_textarea);
   if(tdTxtA) 
    tdTxtA= tdTxtA.parentNode;
   else return;
   var curlen = vB_textarea.content.length;
   
   var Attr,el,cont;
   Attr = {id:"counter_container", style:"float:right;text-align:left;"};      
   cont = mycreateElement('div', Attr, false, "<small>Text Counter:<small>&nbsp;");
   Attr = { id:"txta_counter",'class':(curlen >=10000 ? 'txta_counter_red':'txta_counter'),
     readonly:"readonly",value:curlen};
   el = mycreateElement('input', Attr);
   cont.appendChild(el);
   tdTxtA.appendChild(cont);
   
   // attaching event for textarea
   if(vB_textarea.Obj) {
     Ev.add(vB_textarea.Obj, 'change', function(){updateCounter();});
     Ev.add(vB_textarea.Obj, 'focus', function(){updateCounter();});
   }
   
   // Object clear / reset text
   Attr = { style:'float:left;',title:'Clear Textarea'};
   cont = mycreateElement('small', Attr);
   Attr = { id:"txta_clear",href:'javascript:;'};
   el = mycreateElement('a', Attr,false,'reset');
   Ev.add(el, 'click', function(){vB_textarea.init();vB_textarea.clear();});
   cont.appendChild(el);
   tdTxtA.appendChild(cont);
}

function updateCounter(){
  // Stop any pending updating Counter value
  clearInterval(gvar.INTERVAL);
  gvar.INTERVAL = window.setInterval( function(){
    vB_textarea.init();
	if(getById('txta_counter')){
	   getById('txta_counter').value = vB_textarea.content.length;	   
	   getById('txta_counter').setAttribute('class', (vB_textarea.content.length >= 10000 ? 'txta_counter_red' : 'txta_counter') );	   
	}	
  }, 10);
}

function loadSmilieBox(){
  var smbx = getById(gvar.id_smilebox);
  // bersihiin dulu, coz pake append
  if(smbx)
    smbx.innerHTML = '';
  else 
    return;
  
  // check smiley toogle for toggle smilebox parent container
  smbx.parentNode.style.display = (gvar.smiley_box==1 ? '':'none');
  
  // Fixups adaptation, literaly state width
  smbx.style.width=parseInt(gvar.width_smilebox) +'px'; 
  
  if(gvar.smiley_box!=1){    
    vB_textarea.init();
    var new_width = vB_textarea.getWidth().replace(/px/,'');
    new_width = ( parseInt(new_width) + parseInt(gvar.width_smilebox) ) ;    
    vB_textarea.setWidth(new_width); // definitely set w/ new_width
  }
  var Attr,img, img0;   
  var Leg= document.createElement('legend');
  Attr = {href:'http://'+gvar.uso+'/scripts/show/'+gvar.scriptMeta.scriptID,target:'_blank',title:gvar.akronim+' Home'};
  var a0 = mycreateElement('a', Attr, false, gvar.codename);
  Leg.appendChild(a0);
  Leg.appendChild(createTextEl(' '+'Smilies' +' '+gvar.sversion));

  Attr = {width:gvar.width_smilebox,border:'0',cellspacing:'0',cellpadding:'0'};
  var Obj = mycreateElement('table', Attr);
  
  var Tr1= document.createElement('tr');
  var Td1= document.createElement('td');
  var Div1= document.createElement('div');
  Div1.setAttribute('class', 'smallfont');  

  // load smile kecil
  Attr = {'class':'smallfont smilekecil',style:'display:'+ (gvar.tabSmiley[0]==1 ? '':'none') +';',
          id:gvar.tabTitleId[0] // 'skecil_container'
         };
  var Div2 = mycreateElement('div', Attr);
  if(gvar.tabSmiley[0]==1)
      preload_small_emote(Div2);  
  
  // create judul and event toogle_smile click, and attach it to its parent, Div1
  Div1 = judulSmiley(Div1, '[Smiley Kecil]', Div2.id);
  Div1.appendChild(Div2);
    
  // load smile besar
  Attr ={'class':'smallfont smilebesar',style:'display:'+ (gvar.tabSmiley[1]==1 ? '':'none') +';',
         id:gvar.tabTitleId[1] // 'sbesar_container'
        };
  Div2 = mycreateElement('div', Attr);
  
  var span0,span1;
  for (var i in gvar.smiliebesar) {
    {
       if( typeof(gvar.smiliebesar)=='function') continue;
	   img=gvar.smiliebesar[i];
	   Attr = {
	     rel:img[1]+' '+HtmlUnicodeDecode('&#8212;')+img[2],
         alt:img[1],'class':'bbc_big',id:i
       };
	   span0 = createSmile(Attr,img[1]);
	   Div2.appendChild(span0);
	   Div2.appendChild(createTextEl(' '+HtmlUnicodeDecode('&#183;')+' '));
    }
  }

  Div1 = judulSmiley(Div1, '[Smiley Besar]', Div2.id);  
  Div1.appendChild(Div2);
  
  // More smilie
  var atxt = '[ <a href="javascript:;" onclick="vB_Editor[\'vB_Editor_001\'].open_smilie_window(smiliewindow_x, smiliewindow_y); return false" title="Showing all total smilie.">More</a> ]';
  var p0 = mycreateElement('p', {id:'more_smile'}, false, atxt);
  Div1.appendChild(p0);
  
  if(gvar.loc.indexOf('visitormessage.php')==-1){
    // load smile custom
	Attr={'class':'smallfont smilebesar',style:'display:'+ (gvar.tabSmiley[2]==1 ? '':'none') +';',
           id:gvar.tabTitleId[2] // 'scustom_container'
         };
    Div2 = mycreateElement('div', Attr);
    for (var i in gvar.smiliecustom) {
      {
         if( typeof(gvar.smiliecustom)=='function' ) continue;
         if( i.indexOf('my__') !=-1 ) continue;
	     img=gvar.smiliecustom[i];
	     Attr={rel:HtmlUnicodeDecode('&#8212;')+img[2],'class':'bbc_big',id:i};
	     if(img[1]) Attr.tag = img[1];
		 span0 = createSmile(Attr,img[2]);
	     Div2.appendChild(span0);
	     //Div2.appendChild(createTextEl('  '));
		 Div2.appendChild(createTextEl(' '+HtmlUnicodeDecode('&#183;')+' '));
      }
    }    
    Div1 = judulSmiley(Div1, '[Smiley Custom]', Div2.id);  
    Div1.appendChild(Div2);
  }
  
  // closing td
  Td1.appendChild(Div1);
  Tr1.appendChild(Td1);
  Obj.appendChild(Tr1);
  
  smbx.setAttribute('title', '');
  smbx.appendChild(Leg);
  smbx.appendChild(Obj);

} // end loadSmilieBox

function judulSmiley(parent, title, target){
  var B1 = mycreateElement('b', {style:'cursor:pointer;clear:left;','class':'judul_smiley'}, false, title);
  Ev.add(B1, 'click', function(){toogle_smile(target);});
  
  // prep create checkbox for tag img mode |&| will not available on visitormessage.php
  var besarkecil = ['skecil_container','sbesar_container'];
  var Elm=false;
  if(besarkecil.inArray(target)!=-1 && gvar.loc.indexOf('visitormessage.php')==-1){
    if(target.indexOf('kecil')==-1) parent.appendChild(document.createElement('br'));
	var mix_id = 'imgmode_id_'+target;
	var Attr = {id: mix_id,value:(target.indexOf('kecil')!=-1 ? '1' : '2'),type:'checkbox',name:'imgmode',style:'cursor:pointer'};
	if(target.indexOf('kecil')!=-1) {
	  if(gvar.imgTagMode[0]=='1') Attr.checked = 'checked';
	} else {
	  if(gvar.imgTagMode[1]=='1') Attr.checked = 'checked';
	}	  

	var chk_inp = mycreateElement('input', Attr);
	Ev.add(chk_inp, 'click', function(){set_imgMode(this); return false;});
	
	mix_id = 'imgmode_id_'+target;
	Attr = {'for': mix_id,'class': 'label_imgmode'};
	var Elm = mycreateElement('label', Attr);
	Elm.appendChild(chk_inp);
	Elm.appendChild(createTextEl('use IMG Tag'));
  }

  // add separator if in VM
  if(gvar.loc.indexOf('visitormessage.php')!=-1 && target.indexOf('kecil')==-1){
    parent.appendChild(document.createElement('br'));
  }
    
  parent.appendChild(createTextEl('::'));
  parent.appendChild(B1);
  parent.appendChild(createTextEl('::'));
    
  if(Elm) parent.appendChild(Elm);
  return parent;
}

// checkbox for tag IMG mode state will send to global var
function set_imgMode(Obj){
  var cval = (parseInt(Obj.value)-1);
  gvar.imgTagMode[cval] = (Obj.checked ? '1' : '0');  
}

function createSmile(Attr, title){
  var smile = mycreateElement('span', Attr, false, title );
  Ev.add(smile, 'click', function(){e_click(this);});
  Ev.add(smile, 'mouseover', function(e){ preview(e, this) });
  Ev.add(smile, 'mouseout', function(){ removeme(); });
  Ev.add(smile, 'mousemove', function(e){ trackme(e); });
  return smile;
}


// callback setelah loading_img preview
function chkDimensi(e, Obj){
//chkDimensi = function(e, Obj){
   var e = (e) ? e : ((window.event) ? window.event : null);
   var rez = (Obj.width > 400 || Obj.height > 400 ? true : '');
   var lDim = [Obj.width,Obj.height]; // width,height
   // should we resize it?
   var is_oversize = (lDim[0] > 400 || lDim[1] > 400);   
   if(lDim[0] > 400){ // over-width
      Obj.setAttribute('style', 'width:400px;');
   }else if(lDim[1] > 400){ // over-height
      Obj.setAttribute('style', 'height:400px;');
   }
   if(lDim[0] > 400 || lDim[1] > 400)
     rez = ' (resized from: '+lDim[0]+'px X '+lDim[1]+'px)';	 
   
   var prev=Obj.parentNode; // getById("preview")
   var Margin = {
     y:(lDim[0] > 400 ? '300': (Obj.height >0 ? Math.floor(parseInt(Obj.height))+10 : '60') )
	,x:(lDim[1] > 400 ? '300': (Obj.width > 0 ? Math.floor(parseInt(Obj.width))/2 : '60') )
   };   
   if(getById("loading_img")) Dom.remove(getById("loading_img"));
   prev.style.display='none';

   window.setTimeout(function() {
     trackme(e, Margin);
     Obj.style.display = '';
     prev.style.display='';
	 var imgsub = getById('imgsubtitle');
	 if(imgsub && imgsub.innerHTML.indexOf('(resized from')==-1)
	    getById('imgsubtitle').innerHTML+= rez;	 
   }, 100);
   return false;
}

// preview event
function trackme(e, Mrg){
  var e = (isDefined(e) ? e : ((window.event) ? window.event : null) );
  var prev = getById("kerp_preview");
  if(!prev) return;
  var img0 = getTag('img',prev)[0];
  if(isUndefined(Mrg))
    Mrg = {y : (img0 ? img0.height : '300'),x : (img0 ? img0.width  : '300')};  
  var is_oversize = (img0.height > 400 || img0.width > 400);
  prev.setAttribute('style', (isDefined(is_oversize) && is_oversize ? 
    'position:absolute;top:'+ parseInt(getCurrentYPos()+40) +'px; left:15px;z-index:10;' : 
	'top:'+(e.pageY - gvar.yOffset) + 'px; left:'+(e.pageX) + 'px;'
	+'margin:-'+(Mrg.y ? (Math.floor(parseInt(Mrg.y))+10) : gvar.yOffset)+'px 0px 0px -' + (Mrg.x > 400 ? '300' : (Mrg.y > 0 ? Math.floor(parseInt(Mrg.y))/2 : '60') ) + 'px'
	)
  );
//  prev.setAttribute('style', 
//    'top:'+(e.pageY - gvar.yOffset) + 'px; left:'+(e.pageX) + 'px;'
//   +'margin:-'+(Mrg.y ? (Math.floor(parseInt(Mrg.y))+10) : gvar.yOffset)+'px 0px 0px -' + (Mrg.x > 400 ? '300' : (Mrg.y > 0 ? Math.floor(parseInt(Mrg.y))/2 : '60') ) + 'px');
}
function removeme(){
   if(getById('kerp_preview')) Dom.remove(getById('kerp_preview'));
}
// triggered on mouseover span, big smilie
function preview(e, Obj){   
    var e = (e) ? e : ((window.event) ? window.event : null);
	var Attr = {'class':'prev_cont',id:'kerp_preview'};
	var p0 = mycreateElement('p', Attr);	
	var image_sets = ( Obj.getAttribute('alt') ? gvar.smiliebesar : (Obj.id.indexOf('my__')!=-1 ? gvar.mysmilies : gvar.smiliecustom) );
	Attr = {border:0,src:image_sets[Obj.id][0],style:'display:none;'};
	var img0 = mycreateElement('img', Attr);
	
	Ev.add(img0, 'load', function(){ chkDimensi(e, this);});
	p0.appendChild( mycreateElement('blink', {id:'loading_img',style:'color:#770000;font-size:9px;'},false,' Loading... ') );

	p0.appendChild(img0);
	var innerImg=mycreateElement('div', {'class':'imgtitle'});
	var small=mycreateElement('small', {id:'imgsubtitle'});
	small.appendChild(createTextEl(Obj.getAttribute('rel') ));
	innerImg.appendChild(small);
	p0.appendChild(innerImg);
	var concon = getById(gvar.id_smilebox).parentNode;
    concon.insertBefore(p0,concon.firstChild);    
	
}


// event click smile
function e_click(Obj, nospace){
    var bbcode; 
	var parent = Obj.parentNode;
	
    if(Obj.getAttribute("alt")){
  
	  if(parent.id.indexOf('besar')!=-1 && gvar.imgTagMode[1]==1)
	    bbcode = '[IMG]' + gvar.smiliebesar[Obj.id][0] + '[/IMG]';
	  else if(Obj && Obj.nodeName=='IMG' && gvar.imgTagMode[0]==1)
	    bbcode = '[IMG]' + Obj.src + '[/IMG]';
	  else
	    bbcode = Obj.getAttribute("alt");
		
	}else if(Obj.id.indexOf('my__')!=-1){
	    bbcode = '[IMG]' + gvar.mysmilies[Obj.id][0] + '[/IMG]';	
	  
	}else{
	  bbcode = '[IMG]' + gvar.smiliecustom[Obj.id][0] + '[/IMG]';
	  
	  // find any tags property to add
	  var tag = Obj.getAttribute('tag');
	  if(tag && tag.match(/^\w+$/)) bbcode = '[' + tag.toUpperCase() +  ']' + bbcode + '[/' +tag.toUpperCase() + ']';
	}

	vB_textarea.init();
	vB_textarea.setValue( bbcode + (!nospace ? ' ':'') );
	return false;
}

function preload_small_emote(parent){
    var img, img0, imgDum, Attr, pmain;
    if(typeof(parent)=='string') parent = Dom.get(parent);
    img0 = getTag('img', parent);
    if(gvar.smiliekecil && img0.length == 0){
	   parent.innerHTML = '<div id="preload_smiley">'+_LOADING+'</div>'; // ... loading ...
	   Attr = {id:'main_se_content',style:'display:none;'};
	   pmain = mycreateElement('div', Attr);
       for (var i in gvar.smiliekecil) {
  	     if( typeof(gvar.smiliekecil)=='function') continue;
           img=gvar.smiliekecil[i];
  	     Attr = {src:img[0],alt:img[1],title:img[1]+' '+HtmlUnicodeDecode('&#8212;')+img[2]};
           img0 = mycreateElement('img', Attr);
  	     Ev.add(img0, 'click', function(){e_click(this);});
		 Dom.add(img0, pmain);
       }
	   
	   var showContent = function(){
          var pEl, el= Dom.get('preload_smiley');
          if(el) Dom.remove(el);
          el = Dom.get('main_se_content');
          if( el ) el.style.display='';
       };
       Attr = {alt:'dummy_img', style:'visibility:hidden;', src:gvar.domainstatic + 'images/editor/separator.gif' + '?'+String( Math.random() ).replace('0.','')};
       imgDum = mycreateElement('img',Attr);
	   Ev.add(imgDum, 'load', function(){ showContent(); });
       if(imgDum.height) // obj has beed loaded before this line executed
          showContent();
	   Dom.add(imgDum, pmain);
	   Dom.add(pmain, parent);
    }
}

function toogle_smile(target_id, show){
  var idxtab = gvar.tabTitleId.inArray(target_id);
  if(idxtab==-1) return;
  var tgt = getById(target_id);  
  
  // special tret on smiley kecil
  if(target_id == 'skecil_container'){
    preload_small_emote(tgt);
  }
  
  if(isUndefined(show)) show = (tgt.style.display=='' ? true : false);     
  
  tgt.style.display = (show ? 'none' : '');
  gvar.tabSmiley[idxtab] = (show ? 0 : 1);    
  setValue('KEY_SAVE_' + 'TABS', gvar.tabSmiley.join(',').toString() );
}

function getSetOf(type){
  if(isUndefined(type)) return false;
  switch(type){
    case 'button':
	   return {
	    dead_png : ''
		 +'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAANCAYAAABy6+R8AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTU'
		 +'UH2AMJCQkjdGXwDAAAAcpJREFUeNptkj9PFHEQhp/ZBcIhxyKHYgNCYUxogE0OpdDGxsQCY6e5ggS1Mn4Ce621u7MCYqOdX4DkSLTBqwyNiQmJBiJiDjmWP/ub1+IAMXGq'
		 +'mTx5M5nJY5wpwRiQHPfoL2rG8PVksDOBlKRYZWgwxcwkIQlc0o+fDe3sPu6E1dOQIGWg/yUT4zOUBiLtHYAHFBy6YvRrW+Hzl4/e/P2kAJ8iwRhJscrE+AzDwxG3Z2E/oO9b'
		 +'KMvhzj104aLZ1dFr9PZUWzDWASQMDaYqDZjdvAWzd2HkMlpcJKpUsMlJdHiI3i1Ffr4v9d29pEMnt7UyfOkNNjKKTU8Tl8tghq+sEGqvUZwjZA5EAiShPIetLXxhASSIY3'
		 +'An1Gr4xkabq70iar9OkOeoWCSqVMAM8hzMiObnIUnQ0RFyR0DkgNylzhh7cB+bmsLrdQ7n5gj1OlG5TPxoHro7kUsC4mdQUB5u0NdziW/r5q2M/PkLfG2NsLwMkRHevyVkWQ'
		 +'ib26t+FJYMIIOUvt5XdmXkunXEke/sQchRCNDdRfAQ8vXND97af1qCxqkRLUj9XKFq/cUUMMmRQHKFZquh7OBhCRr/aATQ/I97foxKZ9z7A9QA5voyr3dtAAAAAElFTkSuQmCC'
		,spoiler_png : ''
		 +'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAIAAAAC64paAAAABnRSTlMA4QDhAOKdNtA9AAAACXBIWXMAAAsTAAALEwEAmpwYAAABg0lEQVR42t'
		 +'VUPUsDQRB9M7dBQi4iypWJhgQsU1lIUtklIgg2tmJhK3b+gLT+AtHaP2AqtUmwslGMTSJcUgaSKEc+bu/DYmGJMR+glVs8HrO8fTOzs0u23cRvF+MP609iodn1Y70SbC8UhL'
		 +'3O1a6vOOmaj6tWds32Xc9gigpDMEUYBvNyVESYIwZiERHaK6+1h8+P2unJ4WTaw6Hs9+WgL0cD6Q6lO/S8kRe4PqRP0mcvMNd7uf0tAC9v79/SBpDaWIUfEkMwM0AEMC0JJqK'
		 +'AMDBYMrHB3U53smYA7tMNMRNzIASBiJmIXabFDQNwfnRWbTm5hFlutAtpS3GNABR5vitNEVdbTj5pAgAsAID5A1FpwpVyyj3nEmal6YQhFN7W2xorTUcFZw5JudHOJ00iACBC'
		 +'MWMBKGYsFdFb08WFtKWPV24AdGSec7Z+r7pChHF/xVUvZjp77iiXMLXnuL/OYl7NynkWahKPxyZnG0Dp4tJx+vMfRjwe28ykDvZ2JsX/5zP4AtVMzoKTk38hAAAAAElFTkSuQmCC'
		,flipw_png : ''
		 +'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAIAAAAC64paAAAABnRSTlMA/wD/AP83WBt9AAAArElEQVR42mP8//8/A7mAiYECQAPNHjP4idL9HwO'
		 +'4T+e78GSX+3S+/4QAA1adEERQPxOaazt918C5nb5r8LufCc2fu97MhYtA2B4z+Gt2+dfs8ifsZzRnf4eBlA16BJyNBzx+/mAwJRIWNL4MY+DkLUuf/F/PwMDgbOkJF3e29ISE6'
		 +'I6Mj/gSCTzkvqMCzGhnwJMGkPVjTTAM+NMQRD+upMZAMAHjSaSMQ7MwAACna6I+hLmZ+gAAAABJRU5ErkJggg=='
		,transp_png : ''
		 +'data:image/gif;base64,R0lGODlhFAAUAPcAAAAAAIAAAACAAICAAAAAgIAAgACAgMDAwMDcwKbK8EAgAGAgAIAgAKAgAMAgAOAgAABAACBAAEBAAGBAAIBAAKBAAMBAAOB'
		 +'AAABgACBgAEBgAGBgAIBgAKBgAMBgAOBgAACAACCAAECAAGCAAICAAKCAAMCAAOCAAACgACCgAECgAGCgAICgAKCgAMCgAOCgAADAACDAAEDAAGDAAIDAAKDAAMDAAODAAADg'
		 +'ACDgAEDgAGDgAIDgAKDgAMDgAODgAAAAQCAAQEAAQGAAQIAAQKAAQMAAQOAAQAAgQCAgQEAgQGAgQIAgQKAgQMAgQOAgQABAQCBAQEBAQGBAQIBAQKBAQMBAQOBAQABgQCBgQE'
		 +'BgQGBgQIBgQKBgQMBgQOBgQACAQCCAQECAQGCAQICAQKCAQMCAQOCAQACgQCCgQECgQGCgQICgQKCgQMCgQOCgQADAQCDAQEDAQGDAQIDAQKDAQMDAQODAQADgQCDgQEDgQGDgQ'
		 +'IDgQKDgQMDgQODgQAAAgCAAgEAAgGAAgIAAgKAAgMAAgOAAgAAggCAggEAggGAggIAggKAggMAggOAggABAgCBAgEBAgGBAgIBAgKBAgMBAgOBAgABggCBggEBggGBggIBggKBg'
		 +'gMBggOBggACAgCCAgECAgGCAgICAgKCAgMCAgOCAgACggCCggECggGCggICggKCggMCggOCggADAgCDAgEDAgGDAgIDAgKDAgMDAgODAgADggCDggEDggGDggIDggKDggMDggOD'
		 +'ggAAAwCAAwEAAwGAAwIAAwKAAwMAAwOAAwAAgwCAgwEAgwGAgwIAgwKAgwMAgwOAgwABAwCBAwEBAwGBAwIBAwKBAwMBAwOBAwABgwCBgwEBgwGBgwIBgwKBgwMBgwOBgwACAwCC'
		 +'AwECAwGCAwICAwKCAwMCAwOCAwACgwCCgwECgwGCgwICgwKCgwMCgwOCgwADAwCDAwEDAwGDAwIDAwKDAwP/78KCgpICAgP8AAAD/AP//AAAA//8A/wD//////yH5BAEAAP8ALAAA'
		 +'AAAUABQABwhMAP8JHEiwoMGDCBMqREiq4b+GpB5GhGgw4kKLBDEm1FjQ4cSHGxeC7Djw48eRIkVaNHmSI8qQCj2+JHmxosqKHnNKdJmyp8+fQAUGBAA7'
		,noparse : ''
		 +'data:image/gif;base64,R0lGODlhFAAUAPcBAAAAAAEBAQICAgMDAwQEBAUFBQYGBgcHBwgICAkJCQoKCgsLCwwMDA0NDQ4ODg8PDxAQEBERERISEhMTExQUFBUVFRYWFhcXF'
		 +'xgYGBkZGRoaGhsbGxwcHB0dHR4eHh8fHyAgICEhISIiIiMjIyQkJCUlJSYmJicnJygoKCkpKSoqKisrKywsLC0tLS4uLi8vLzAwMDExMTIyMjMzMzQ0NDU1NTY2Njc3Nzg4ODk5O'
		 +'To6Ojs7Ozw8PD09PT4+Pj8/P0BAQEFBQUJCQkNDQ0REREVFRUZGRkdHR0hISElJSUpKSktLS0xMTE1NTU5OTk9PT1BQUFFRUVJSUlNTU1RUVFVVVVZWVldXV1hYWFlZWVpaWltbW1'
		 +'xcXF1dXV5eXl9fX2BgYGFhYWJiYmNjY2RkZGVlZWZmZmdnZ2hoaGlpaWpqamtra2xsbG1tbW5ubm9vb3BwcHFxcXJycnNzc3R0dHV1dXZ2dnd3d3h4eHl5eXp6ent7e3x8fH19fX5'
		 +'+fn9/f4CAgIGBgYKCgoODg4SEhIWFhYaGhoeHh4iIiImJiYqKiouLi4yMjI2NjY6Ojo+Pj5CQkJGRkZKSkpOTk5SUlJWVlZaWlpeXl5iYmJmZmZqampubm5ycnJ2dnZ6enp+fn6Cgo'
		 +'KGhoaKioqOjo6SkpKWlpaampqenp6ioqKmpqaqqqqurq6ysrK2tra6urq+vr7CwsLGxsbKysrOzs7S0tLW1tba2tre3t7i4uLm5ubq6uru7u7y8vL29vb6+vr+/v8DAwMHBwcLCwsP'
		 +'Dw8TExMXFxcbGxsfHx8jIyMnJycrKysvLy8zMzM3Nzc7Ozs/Pz9DQ0NHR0dLS0tPT09TU1NXV1dbW1tfX19jY2NnZ2dra2tvb29zc3N3d3d7e3t/f3+Dg4OHh4eLi4uPj4+Tk5OXl5'
		 +'ebm5ufn5+jo6Onp6erq6uvr6+zs7O3t7e7u7u/v7/Dw8PHx8fLy8vPz8/T09PX19fb29vf39/j4+Pn5+fr6+vv7+/z8/P39/f7+/v///yH5BAHoAwEALAAAAAAUABQAAAhNAAMIHEi'
		 +'woMGDCBMqXMiwoUIAEBlCBCAwYkOLFiVSDBBxYsaJFTdipNiRpMmQKEtyPLky5UmVLVuqhFnSpE2UMTWG3Pgwo8OfQIMCDQgAOw=='
		,youtube_gif : ''
		 + 'data:image/gif;base64,R0lGODlhFAAUAPcAAAQCBLySRGSKzKTG5PTmrHxKDPzOzPzy7PyytERmrNz6/OweBPyanPxWTPza3Oyq/Pz+/NSubJza7JxyFPzS1Py6vNz+/PwiFKBs'
		 +'yBQM6XeLEgMBADioAOboABISAAAAABZqYND/AEUjAHUCAAAANwAAFh8A7QAA/wBF/wAA/wAA/wAA/6goHxStiHciNgMAdVAAybYAiHMfNgMAdQDgpACv6wAiEgAAAACwAQDoAAASAAAA'
		 +'AABFAAAAAAAAAAAAAAAoAACtAAAiAAAAAAAA5AAA5wAAEgAAAAASAgAAAB8AAAAAAFAc/Lbo6XMSEgMAAABF4wAAYgAAOwAAdXwAiOYAihIfwQAAFggo/gCt/28i/wAA/wccjQDoiAA'
		 +'SNgAAdeouMcdndkVpNnVmdZMARYE0OuPrXGN2AOAhcwKtZVFFcgB1czgAU7YB33MARQMAdQEAbwAAjwAA4wAAY0iMALbnAHMSAAMAAHQnAOY7ABLrAAB2AK8saB87gOvrInZ2AFATALYs'
		 +'gHMcIgNzADEAVB8A6OsAEnYAAAAAEQABAQAAAAAAAEghsLat6HNFEgN1AIBkmufnkxISTAAAdbwRt8IBuEUAtHUAFgBv/gCA/x/j/wBj/wC0UwDn3wASRQAAdVCRSbas2HNFRQN1dQAAa'
		 +'AAAgAAAIgAAAAAAPgEA0gAARgAAdcvYL8K1j0Xn43V2Y8xfAOcsABIcAABzAFB5ALbpAHMSAAMAAAwMAJ6hADtPAHUAAAFkSAAA6QAAEgAAAAIAAX8AAAAAAAAAAGeUkGnn6DUSEjEAAF'
		 +'wMEXShAXJPAGkAAGtgYG/7+20SEnMAAGVNmmzXk1/nTHZ2dTJHp1zBtXPlt3QFFmH+/nT//2n//2P//1zYPmm10m3nRmF2dWdbiGV/gXNIQlx1AADcaPPogBISIgAAACBrAAB/AABIAA'
		 +'B1AACNeQCt6QBFEgB1ANABMfYArYsARQEAdQ4xMwEAjwAw4wAAY0XJMTqIrQA2RQF1dQUuagBncQBpSABmACH5BAEAABIALAAAAAAUABQABwipACUIHEiwoMGDCA1CiFAAQoIBECJKnEg'
		 +'wIoAHACZqjFhxIQCIAQAIgJAxI8eBEQkAUKCSpIKSEjuqtNASgIUJL2OihKBSAYSQIyMASKBT4MajRSU4uMC0qVOnDghekOgUwlOmUqc+tXo1K4QGVr9GrHChwgEDF7yCnboWAoOIFNI'
		 +'OZCqWbdi3TQkuYFshYgMDEBBceItW6oLDiBMrJgjgquMLABJKnkw5IAA7'
		,upd_png : ''
		 +'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAAPCAIAAACN07NGAAAABnRSTlMA/wD/AP83WBt9AAAAvElEQVR42mP8//8/AxGgMD4QwuhfuJ4Fv9LTsZIQRhSSIA'
		 +'t+DUZhXgzf3zEwMLx5+Oqta/Ps/smmyHrgRsKBcWrm/48PMc1CscfI1wLOZhRUxmU/E5xluvj5uc0niAkPJmQOkdqYGEgHLOgBheQlBgaGc6u2ITiXoqPQ7MHUcHb2dNPFzyFoGZMFd/'
		 +'HSZUwW6PageuaE6eLnBNyGSwV1woBYPZ+17pOgZ8XVFgYGhi+aDy6xHnsevJ+BgQEAPyZCDBBnRMQAAAAASUVORK5CYII='
		,compare_png : ''
		 +'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAIAAAAC64paAAAABnRSTlMA/wD/AP83WBt9AAABZ0lEQVR42mP8//8/A7mAiYECQJFmFjT+lWu3jhw7c/7SNQY'
		 +'GBkM9LRsrEx0tNVyaGZH9vHf/se27D5qZ6IcFeTEwMKxat+3UmYuervbOjlbYdf+HgctXbxZXtv3////Xr1+/f//5/fvPr1+/fv78VVzZdvnqzf/YAMLPR46dMTPR//37NxMTEyMjAyMjA'
		 +'xMTExsbq5mJ/pFjZwjYnJZb/f///9+///z58+fXr98/f/5Ck8IE6AHGwsLMwMDAzExiVBnqaa1atw1Txap12wz1tAhotrEyOXXmIqaKU2cu2liZYNXM3NDQAGGJiQozMzFPm73kw8fP2p'
		 +'qEDvnL15z+/5DPj5eQz1NAvGMNZGcPn9l66793m6OLCfaYiefwR7aeMC8JWu73RnObZrS7c6APZ7xpeETbc7ZUxgYGJyzp/R4MJKWMWInn9k7NQfCFlc1xpkxcIGSHf97PBjFVY113BJxB'
		 +'tgQKQwAEBEGm/Ylok4AAAAASUVORK5CYII='
		,plus_png : ''
		 +'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAIAAAAC64paAAAABnRSTlMA/wD/AP83WBt9AAAAuUlEQVR42tWUQQrEIAxFfwcv4FpyA69WcNWeoa4KXs0bSHGZ'
		 +'I3QWhSDWQmtnM1klgU98ycdh33f0xgcv4pVYNbve+5SSlEQ0TdNdcUppWRYp53l+MBlAznnbNgDGmB5mZmbmW8wVJwBrreTjOJ751RVnzlnyK3515mTmcubRjzFqrSv+n97ZGNNcb/WWWkx'
		 +'E67pK6ZyTvOwTUUNceujYbYxRZoYQHpgEgNa6x9vC3yOu+EvOMob//Ay+pDJOJ8FoQwQAAAAASUVORK5CYII='
		,fbajax_png : ''
		 +'data:image/gif;base64,R0lGODlhEAALALMMAOXp8a2503CHtOrt9L3G2+Dl7vL0+J6sy4yew1Jvp/T2+e/y9v///wAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQFCwAMACwA'
		 +'AAAAEAALAAAEK5DJSau91KxlpObepinKIi2kyaAlq7pnCq9p3NZ0aW/47H4dBjAEwhiPlAgAIfkECQsADAAsAAAAAAQACwAABA9QpCQRmhbflPnu4HdJVAQAIfkECQsADAAsAAAAABAACwA'
		 +'ABDKQySlSEnOGc4JMCJJk0kEQxxeOpImqIsm4KQPG7VnfbEbDvcnPtpINebJNByiTVS6yCAAh+QQJCwAMACwAAAAAEAALAAAEPpDJSaVISVQWzglSgiAJUBSAdBDEEY5JMQyFyrqMSMq03b'
		 +'67WY2x+uVgvGERp4sJfUyYCQUFJjadj3WzuWQiACH5BAkLAAwALAAAAAAQAAsAAAQ9kMlJq73hnGDWMhJQFIB0EMSxKMoiFcNQmKjKugws0+navrEZ49S7AXfDmg+nExIPnU9oVEqmLpXMBo'
		 +'uNAAAh+QQFCwAMACwAAAAAEAALAAAEM5DJSau91KxlpOYSUBTAoiiLZKJSMQzFmjJy+8bnXDMuvO89HIuWs8E+HQYyNAJgntBKBAAh+QQFFAAMACwMAAIABAAHAAAEDNCsJZWaFt+V+ZVUBAA7'
        ,news_png : ''
         +'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAANCAIAAAD5fKMWAAAABnRSTlMAAAAAAABupgeRAAAArklEQVR42mNkYGBgYGBob29/9OgRA1'
		 +'4gJyfHAlHHz88/bdo0/KqzsrJYHj16lF/auG/Hmvv37587dw6XUiMjIwYGBhY4X1FRUVFREb/xLMic9knLGRgYKvMiT158jKbOXF+WgYGBiYEUgGJ2ZV4kCarR7B2'
		 +'07ubn52dhYGB4ev+yh4fHhw8fIKLvPn4XFUAxRYif8/79+wwMDIxHjhzZsmXLx48f8buBn5/fw8MDAOiiPC0scvhsAAAAAElFTkSuQmCC'
        ,updates_png : ''
         +'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAARCAIAAACNaGH2AAAABnRSTlMA/wD/AP83WBt9AAAACXBIWXMAAA7EAAAOxAGVKw4bAAABg0'
         +'lEQVR42n2SPW4UQRCFX417MXh3JbJ1hIwRxyBCGImjICQHIALOYF+Bi8AduIYdIeT9m5mq9xHMYhLMUwUt9Wu9r6orvv64/Nn/2o61NvvyOnNbtRkzbZepciZVT'
         +'p90j7vduIEgQoGxAgAhIYENAoHX47ob7JQSyjJyTa4ACRQRIaGITkTb2X15MGknpFxQWEIStpBCANA2maM9mgH6cqLRhGQDYGFTxgjaNisVCUN5lIeskcMdJiSQN'
         +'FGpbbKIGOzR9NCDEDaG8p9eNYG1TVnBYKcZjKdQeRrEAYPCKKLtsko2SiOMLXAac18ThqDtXUyIAYXLwgJXyWDbU45ALfd9N2sytiVxSOAAXBaOCEC4HWe3G3fRd'
         +'YojYaZ/G0ZXSaKmd4E9ny3jZn1zu7mV9On7RxBOzNvzi4uX7yYAxTQPnS5P22q+Ws1XklyF3bX24unZ51df9C+1+xNZR0+Oz5fPr95c6wH9dc8WJ2eLZ1evrxePF'
         +'g+5D+sCvP/24a6/47/6DW1k0UQglGH2AAAAAElFTkSuQmCC'
        ,choose_gif : ''
		 +'data:image/gif;base64,R0lGODlhTwAWAOZsAC0tLSYmJisrKyoqKu7u7ubm5unp6fT09CgoKCcnJ+Pj46mpqUNDQ1VVVfb29vLy8vz8/O3t7fj4+OLi4vr6+jU1Nezs7Pv7+'
		 +'2FhYYODg/Hx8cHBwd7e3jQ0NMXFxTw8PP7+/kRERIyMjDIyMmBgYHx8fOvr642NjVFRUYSEhEhISDExMUdHR9TU1PDw8MbGxl5eXo6OjiUlJTY2NnJycqqqqoGBgUJCQiQkJH19fZ'
		 +'CQkE9PT4qKiltbW4mJibe3t1lZWZycnFxcXGlpad/f30tLS0lJST4+PkVFRaurqzAwMJqamlRUVEpKSiMjI4CAgJ2dnX9/f6enp19fX0FBQXBwcEZGRlZWVjg4OD09PcnJyWZmZvX1'
		 +'9Zubm4+Pj1dXV35+foKCglhYWDMzM7i4uHNzcywsLG1tbSkpKeXl5f///y4uLv///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'
		 +'AACH5BAEAAGwALAAAAABPABYAAAf/gGyCgxcHBAYFaYqLjI2Oj5CRkooFBgQHF4OagxAPBpOgoaKjBg8Qm4ISEWkFlxRqsLGys7S1tre4sSAUhokREpsSJmkWDhsZDRVoy8zNzs/Q0d'
		 +'LTyxUNGRsOFmkmwIIQqwQcKR0zKkJDZ+rr7O3u7/Dx8mdDPSxHPhwEaRGnbA/EONBQsgNIkw8j1ihcyLChw4cQI0pUOOKDkRAliGx7wOYCIgcplKAosmKiyZMoT674cMJBpUJpCGzo'
		 +'sKNIwzAaYCkQoEYFgJQTdcCKUcNMz59A13TYsM9QmgMZZgApuVCMGjABsqJRg2RA0ogKqgRIgIZn169mMhyI+YlCAxVN/xpCWSAjAJoBPD2oaSHgiwI1ChoASAKraBlYT8zYgEXDjEKh'
		 +'aniIWMCTAZO/QcwgnQigAYU0iNKAqCDkQ8MkIgIIWKhGyhg1Ich0CbDEAxMNIRhowFBjwVgsu0m0QPMTwAQYOCZvZfDiRAcNMxyfrACCVaLRWxIynItA+ho1VGSouTEBQwAME3J4GOuh'
		 +'RAgP5VnIUq3weIATCxKoYTAh1hSv01VXSRpu9aDdQleokcNqCo2HwHg/LIFAEC+g4AIDVmhAAlkieICGBjA4gQN9ayhAAgIx5LffDzyIGMAAm0XU2WeWPJUBC6YxBEAULuhU2XIo9DcB'
		 +'CgEsAAtdL8BSQuwCGPSoRncKmYiiigyE0AIsGDyhgGJb2rBljGmtdUlMGxxhhENmIJCVXWgggBcCy6x5VwJZJTAAGlkhIACeAUC5hgBumsEMnAPQ6eYAeAmQ6ADeKcXUUx4V4IAPIVDF'
		 +'kBmK4mWGZgBwqqgAAHSKqGafeooXUp2G2ummoZbK6quaLWRGCi4ZkAlAFnBQQo5f9eormjRwsNE34RBxQhZrxPjrsiZ12kEK+vDjDxvCEOOAFl4kQ8223HYLjTXYaMONN4OowgoBXLySy'
		 +'7rstlvLLr3wQ64mnXwyyr343lvKtKh0ZEho+QYccCWXZLJJIAA7'
        ,twbutton_gif : ""
         +"data:image/gif;base64,R0lGODlhCgBYAsQfAPPz8+vr6/7+/uHh4fn5+eXl5d7e3vv7++jn6Ofo5/j4+Ojo6d/g4Ofn59/g3+Pk5OPj4/f29vv7+vz7/ODf3/"
		 +"Dw8Pb29vv8+/z8/ODf4O/v7+fn5unp6N/f3+Dg4P///yH5BAEAAB8ALAAAAAAKAFgCAAX/oCCOZGmeIqau7OG6UiwdRG3fSqTs/G79wCDAMiwSiYCkUllpOp+aqHQ"
		 +"a0FSvVmtgy+VyvoEvZxFeIBKLRQK93rg3hbf7UaAX6vQHZM/vD/6AgR6DhIUdBgaHHYuLiI6PkJEfk5SVlpeYmZqbnJ2en6ChoqOkpaanqKmqq6ytrq+wsbKztLW2"
		 +"t7i5uru8vb6/wMHCw8TFxsfIycrLwijOz9DRLNMYEy8u1jAy2zM33gQ94TkR5OQW5UHpQElH7Evv8O9P8xVT9VL3U/pXW1ld/wABihko5kyDBAgaIFCTYEMDOQ7d3"
		 +"JlIEY+eBxgx9tm4J5DHAR4+hvSQoQMFDwwKzzFgtIiCA0aPDiGSGammJGY4c+rcybOnz59AgwodSrSo0aNIkypdyrRps2hQo0otoUIANRUTLhyYgOHAha4utIa9NkM"
		 +"GjAMxvEnAocBGW3A94O7QMW6ujwg/8ALRq+6HEXd+4wkeXGEJvcOH9SleLAWL44CQIwskGOZLmgVj0mQ+eDDhmYQNHoZ2M/oOHNMVU9/JmBGCRo4b//AZMPujx5CCc"
		 +"IMktLsDgwwOUHro4GAly+OJaM60yfyR0+fQo0ufTr269evYs2vfzr2791IhAAA7"
        ,loading_gif : ""
         +"data:image/gif;base64,R0lGODlhCwALALMIAEdHRyQkJGtra7Kyso+Pj9bW1gAAAP///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEA"
		 +"AAAh+QQFAAAIACwAAAAACwALAAAEJBBJaeYMs8pz6bYIVnFgKQEoMBVsYZoCQiADGMtSLd14Xs6WCAAh+QQFAAAIACwAAAAACwALAAAEJBBJGeYEs0pz6bYIVnFgKQm"
		 +"oMB3sYZoEMiAFGMtSLd14Xs6WCAAh+QQFAAAIACwAAAAACwALAAAEJBBJCeYUs8pw6bYIVnFgKREoMRmsYZoDUiAHGMtSLd14Xs6WCAAh+QQFAAAIACwAAAAACwALAA"
		 +"AEJBBJKeYks0pw6bYIVnFgKQ3oMAVsYJoFciAGGMtSLd14Xs6WCAAh+QQFAAAIACwAAAAACwALAAAEJBBJSeYcs0px6bYIVnFgKRVoMQEsYJoHYiABGMtSLd14Xs6WCA"
		 +"Ah+QQFAAAIACwAAAAACwALAAAEJBBJOeYss0py6bYIVnFgKR3oMQmsYJoGEiAAGMtSLd14Xs6WCAAh+QQFAAAIACwAAAAACwALAAAEJBBJWeY8s8px6bYIVnFgKRmoMRE"
		 +"sYZoBAiACGMtSLd14Xs6WCAAh+QQFAAAIACwAAAAACwALAAAEJBBJeeY0s8py6bYIVnFgKQVoMA3sYJoAIiAEGMtSLd14Xs6WCAA7"		 
	   }
	break; 
  }
}

function getCSS() {
  var css = 
    '#vB_Editor_001 *:focus { outline: 0; }'
    +'#uparent_container{ position: relative;width:680px; }'
    +'label.cabinet{ cursor:default !important;overflow:hidden;display:block;float:left;'
	 +(!gvar.isOpera ? 'width:79px; height:22px;background: url('+gvar.B.choose_gif+') 0 0 no-repeat;' : '')
	+'}'
	+'label.cabinet input.file{position: relative;height:100%;width:auto;z-index:9!important;'
	+(gvar.isOpera ? 'filter:alpha(opacity=70); opacity:0.7;-moz-opacity:0.7; -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=70)";' : 'filter:alpha(opacity=0); opacity:0;-moz-opacity:0; -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=0)";')
	+'}'
	
	+'input.greenButton{width:auto;margin:0 0 0 15px; padding:2px 4px 2px 4px;color:white; background-color:#589d39; outline:none;border:1px solid #006600; border-radius: 8px; -moz-border-radius: 8px;-khtml-border-radius: 8px;-webkit-border-radius:8px;float:left;}'
	+'input.greenButton:active{background-color:#006600;padding:3px 3px 2px 5px;border:1px solid #007575;}'
	
	+'.judul_smiley:hover{color:#FF4400;}'
	+'#target_upload {width:100%;height:120px;border: 2px outset;clear:left;display:block;}'
	+'#toogler {float:right;z-index:9 !important;}'
	
	+'#skecil_container, #sbesar_container, #scustom_container, #mysmiley_container{white-space:inherit; width:auto;}'
	+'#sbesar_container, #scustom_container, #mysmiley_container{color:#C5C5C5;}'
	+'.mytitle, .no_smile{color:#5F5F5F;}'
	+'#mysmiley_container h1, #mysmiley_container h2,#mysmiley_container p {padding:0;margin:0;}'	
	
	+'.smilekecil, .smilebesar, .addremove {margin:5px 0 10px 0;}'
	+'.smilekecil img, .bbc_big {margin:1px 0.7px;border:1px solid transparent;cursor:default}'
	+'.bbc_big {color:#0B1379;padding:0.8px 3px;white-space:nowrap;}'
	+'.smilekecil img:hover, .smilebesar .bbc_big:hover, .addremove .bbc_big:hover, #nfo_version:hover {color:#000;border:1px solid #2085C1;background-color:#B0DAF2;}'
	+'.smilebesar {text-align:justify;}'
    +'.prev_cont{clear:both;margin:0;padding:.5em 0;}'
    +'#kerp_preview{position:absolute;border:1px solid #2085C1;background-color:#B0DAF2; opacity:0.75; filter:alpha(opacity=75); -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=75)";padding:5px;color:#fff;}'
	+'#addrem_container p {margin-top:10px !important;}'
	+'.imgtitle {background-color:#000064;color:#fff;}'
	+'.rowcontainer {padding:.3px;clear:left;}'
	+'.rowcontainer input{margin-right:2px;}'
	+'.texts{float:left;width:80px;font-size:12px;}'
	+'.imglink {width:130px;}'
	+'.hapus:hover {text-decoration:none !important;}'
	+'.hapus {cursor:pointer;display:inline-block !important;background: url("'+gvar.B.dead_png+'") no-repeat scroll 100% 50%;padding-right:17px;}'
	+'.hapus_midlenes {margin:3px 0 0 -5px;}'
	+'#vB_Editor_001_cmd_wrap0_spoiler {background:#00006A;border:1px solid #0000A6;border-radius:9px 9px;-moz-border-radius:9px 9px;-khtml-border-radius:9px 9px; -webkit-border-radius:9px 9px; margin:1px 5px;width:100px;height:17px;text-align:center;}'
	+'#vB_Editor_001_cmd_wrap0_addcontroller {background:transparent;padding:0 3px;margin:0 10px;width:100%;}'
	+'#upd_container {border:1px solid #D99509;background:#FCE8BC;width:300px;height:22px;text-align:left;float:right;padding:0 10px 2px 10px;font-size:11px;}'
	
    +'.txta_counter, .txta_counter_red{width:120px;text-align:right;font-weight:bold;padding:1px 5px;border:1px solid #CDCDCD;}'
    +'.txta_counter{background:#DFC;color:#3A3A3A;}'
	+'.txta_counter_red{background:#FB0000;color:#FFF;}'	
    +'.textarea{width:100%;height:100px;font-family:monospace,Courier;font-size:11px;}'

    /* for updates */
    +'.qbutton:hover{background-color:#DDDDDD;}'
    +'.qbutton{padding:1px 3px;border:1px solid #1E67C1;background-color:#C7C7C7;color:#000;text-decoration:none;border-radius:3px;border-radius:3px; -moz-border-radius:3px; -khtml-border-radius:3px; -webkit-border-radius:3px;}'

    +'.qrdialog{border-bottom:1px transparent;width:100%;left:0px;bottom:0px;padding:3px;}'
    +'.qrdialog-close{padding:5px;margin:5px 15px 0 0;cursor:pointer;float:right;}'
    +'.qrdialog-child'
    +'{background:#BFFFBF; border:1px solid #9F9F9F; height:30px;width:400px;margin-left:3px;padding:.2em .5em;font-size:8pt;border-radius:5px;border-radius:5px;-moz-border-radius:5px;-khtml-border-radius:5px;-webkit-border-radius:5px; box-shadow:3px 3px 15px #888;-moz-box-shadow:3px 3px 15px #888;-khtml-box-shadow:3px 3px 15px #888;-webkit-box-shadow:3px 3px 15px #888;}'
	
	+'.lilbutton{padding:1px 5px; 2px 5px!important;text-shadow:none;}'
	/* twitter's button */
    +'.twbtn{background:#ddd url("'+gvar.B.twbutton_gif+'") repeat-x 0 0;font:11px/14px "Lucida Grande",sans-serif;width:auto;margin:0;overflow:visible;padding:0;border-width:1px;border-style:solid;border-color:#999;border-bottom-color:#888; border-radius:4px; -moz-border-radius:4px; -khtml-border-radius:4px;-webkit-border-radius:4px;color:#333;text-shadow:1px 1px 0 #B1B1B1;cursor:pointer;} .twbtn::-moz-focus-inner{padding:0;border:0;}.twbtn:hover,.twbtn:focus,button.twbtn:hover,button.twbtn:focus{border-color:#999 #999 #888;background-position:0 -6px;color:#000;text-decoration:none;} .twbtn-m{background-position:0 -200px;font-size:12px;font-weight:bold;line-height:10px!important;padding:5px 8px; border-radius:5px; -moz-border-radius:5px; -khtml-border-radius:5px; -webkit-border-radius:5px; margin:-4px 0 -3px 0;} a.twbtn{text-decoration:none;} .twbtn-primary{border-color:#3B3B3B;font-weight:bold;color:#F0F000;background:#21759B;} .twbtn:active,.twbtn:focus,button.twbtn:active{background-image:none!important;text-shadow:none!important;outline:none!important;}.twbtn-disabled{opacity:.6;filter:alpha(opacity=60);background-image:none;cursor:default!important;}'

	+'';

  return css;
}
// end getCSS


// kaskus uploader Area
// =====================
function do_postBack(name, url) {
	var Elm;
	var frmAct = getById('frmPageAction');
	var inputElm = getById(name, frmAct);
	if(typeof(inputElm)=='object'){
	    Dom.remove(inputElm);
	}
	else{
	   inputElm = getById(name);
	}
    frmAct.appendChild(inputElm);

	var hiddenElm = getById('referer', frmAct);
	if(typeof(hiddenElm)=='object'){
	   Dom.remove(hiddenElm);
	}
	else{
	    var Attr = {value:'http://'+gvar.dmUploader,type:'hidden',name:'referer',id:'referer'};
	    Elm = mycreateElement('input', Attr);
	}	
    frmAct.appendChild(Elm);
	
	// recreate new input file for the original place
	getById('label_file').appendChild(inputElm.cloneNode(true));
  
	if (url == null) {
	   url = 'http://'+gvar.dmUploader+'/upload/do_upload';
	}
	frmAct.action = url;
	frmAct.submit();
	Dom.remove(inputElm);
	inputElm = getById(name);
	if(inputElm) Ev.add(inputElm, 'change', function(e){
	  e=e.target||e;
	  if(getById("legend_subtitle"))
	    getById("legend_subtitle").innerHTML= ' '+HtmlUnicodeDecode('&#8592;') + ' ' + basename(e.value);
	});
}
function check_submitform() {
    var file_id = 'userfile';	
    var inputElm = getById(file_id, getById('frmPageAction'));
	if(isDefined(inputElm) && typeof(inputElm)=='object'){
	   Dom.remove(inputElm);
	}
	else{
	   inputElm = getById(file_id);
	}	
	
    var allowed_ext = ['jpg','jpeg','gif','png','zip','rar'];
	var filename = inputElm.value;
    var ext = filename.substr(filename.lastIndexOf('.') + 1).toLowerCase();
	if(allowed_ext.inArray(ext) != -1){
	  toogle_iframe( 1 );
      GM_setValue('iframe_preload', 1);
	} else {
	  if(filename=='')
	    alert('Belum memilih file');
	  else
	    alert('forbidden file format');
	}
	return (allowed_ext.inArray(ext) != -1);
}
function trans_post(){
  if(check_submitform()){
    do_postBack("userfile");
	getById("userfile").value='';
	getById("legend_subtitle").innerHTML='';
  }
}
function toogle_iframe(visb){
   var ifrm=getById("target_upload");
   if(isUndefined(visb)) visb = (ifrm.style.display=="none");
   if(visb=='none'){
	    //ifrm.src = 'about:blank';
   } else {
       // preload identity for u.kaskus.us 
	   window.setTimeout(function() {
         GM_setValue("iframe_preload", 1);
       }, 0);	   
	   if(ifrm.src!='http://'+gvar.dmUploader+'/')
	       ifrm.src = 'http://'+gvar.dmUploader+'/';
   }     
   ifrm.style.display=(visb ? "" : "none");
}
// Building Upload Images HTML
function get_tpl(){

  var Attr;
  var Div0= document.createElement('div');
    Div0.id = 'uparent_container';
  var Div1= document.createElement('div');
	Div1.id = 'upload_container';
	
  var Lbl= document.createElement('label');
	Lbl.setAttribute('class', 'cabinet');
	Lbl.id = 'label_file';

	Attr = {type:'file','class':'file',name:'userfile',id:'userfile'};	 
  var Elm = mycreateElement('input', Attr);
    Ev.add(Elm, 'change', function(e){
	  e=e.target||e;
	  if(getById("legend_subtitle"))
	    getById("legend_subtitle").innerHTML= ' '+HtmlUnicodeDecode('&#8592;') + ' ' + basename(e.value);
	});
  //
	Lbl.appendChild(Elm);
	Div1.appendChild(Lbl);	

	Attr = {type:'button','class':'button greenButton',title:'Upload now ..',value:'Upload'};
	Elm = mycreateElement('input', Attr);
	Ev.add(Elm, 'click', function(){trans_post()});
	Div1.appendChild(Elm);
	
  var Div2= document.createElement('div');	
	Div2.setAttribute('style', 'float:left;font-weight:bold;margin-left:20px;');
	
	var upldr = 'http://'+gvar.dmUploader+'/';
	Attr = {href:upldr,target:'_blank',title:'Go to '+upldr};
  var a0 = mycreateElement('a', Attr, false, gvar.dmUploader);	
	Div2.appendChild(a0);
	Div1.appendChild(Div2);
	
	Div2= document.createElement('div');	
	Div2.setAttribute('style', 'float:right;font-weight:bold;font-size:10px;');

	Attr = { href: 'javascript:;' };	
	a0 = mycreateElement('a', Attr, false, 'Toogle Iframe');
	// prevent unsafeWindow access violation we're doing event with this
	Ev.add(a0, 'click', function(){toogle_iframe();});
	Div2.appendChild(a0);
	
	Div1.appendChild(Div2);
	Div0.appendChild(Div1);
	
	  // initialize iframe with about:blank instead of gvar.dmUploader
	Attr = {style:'display:none;',src:'about:blank',name:'target_upload',scrolling:'auto',id:'target_upload'};	
  var ifrm = mycreateElement('iframe', Attr);	
	Div0.appendChild(ifrm);
	
  return Div0;
}
// building fake form outside form
function attach_form(){
	var Attr;
	Attr = {
	 enctype:'multipart/form-data',action:'http://'+gvar.dmUploader+'/upload/do_upload',
	 target:'target_upload',method:'post', name:'frmPageAction',id:'frmPageAction'
	};	 
	var Obj = mycreateElement('form', Attr);
	Attr = {type:'hidden',name:'referer',value:''};
	var Elm = mycreateElement('input', Attr);
	Obj.appendChild(Elm);	
    getTag('body')[0].insertBefore(Obj, document.body.firstChild);
}
// /End kaskus uploader Area
// =====================


// Smiley Resource
// =======================
function getSmilieSets(){
  var http = 'http://';
  var uks = gvar.dmUploader;
  var H = gvar.domainstatic + 'images/smilies/';
  var s = 'sumbangan/';
  
  gvar.smiliekecil = {
 '1' : [H+'ngakaks.gif', ':ngakaks', 'Ngakak (S)']
,'2' : [H+'mahos.gif', ':mahos', 'Maho (S)']
,'3' : [H+'s_sm_cendol.gif', ':cendolb', 'Blue Guy Cendol (S)']
,'4' : [H+'s_sm_batamerah.gif', ':bata', 'Blue Guy Bata (S)']
,'5' : [H+'cendols.gif', ':cendols', 'Cendol (S)']
,'6' : [H+'takuts.gif', ':takuts', 'Takut (S)']

,'7' : [H+'batas.gif', ':batas', 'Bata (S)']
,'8' : [H+'s_sm_smile.gif', ':)bs', 'Blue Guy Smile (S)']
,'9' : [H+'s_sm_peace.gif', ':Yb', 'Blue Guy Peace']
,'10': [H+'iloveindonesias.gif', ':iloveindonesias', 'I Love Indonesia (S)']
,'11': [H+'cekpms.gif', ':cekpms', 'Cek PM (S)']
,'12': [H+'berdukas.gif', ':berdukas', 'Berduka (S)']
,'13': [H+'capedes.gif', ':capedes', 'Cape d... (S)']
,'14': [H+'bingungs.gif', ':bingungs', 'Bingung (S)']

,'15': [H+'malus.gif', ':malus', 'Malu (S)']
,'16': [H+'iluvkaskuss.gif', ':ilovekaskuss', 'I Love Kaskus (S)']
,'17': [H+'kisss.gif', ':kisss', 'Kiss (S)']
,'18': [H+'mads.gif', ':mads', 'Mad (S)']
,'19': [H+'sundulgans.gif', ':sundulgans', 'Sundul Gan (S)']
,'20': [H+'najiss.gif', ':najiss', 'Najis (S)']
,'21': [H+'hammers.gif', ':hammers', 'Hammer (S)']
,'22': [H+'reposts.gif', ':reposts', 'Repost (S)']
,'23': [H+s+'004.gif', ':matabelo:', 'Belo']
,'24': [H+s+'q11.gif', ':nohope:', 'Nohope']
,'25': [H+s+'8.gif', ':hammer:', 'Hammer']
,'26': [H+s+'24.gif', ':army:', 'army']
,'27': [H+s+'005.gif', ':Peace:', 'Peace']
,'28': [H+s+'12.gif', ':mad:', 'Mad']

,'29': [H+s+'fuck-8.gif', ':fuck3:', 'fuck3']
,'30': [H+s+'fuck-6.gif', ':fuck2:', 'fuck2']
,'31': [H+s+'fuck-4.gif', ':fuck:', 'fuck']

,'32': [H+s+'7.gif', ':confused:', 'Confused']
,'33': [H+s+'34.gif', ':rose:', 'rose']
,'34': [H+s+'35.gif', ':norose:', 'norose']
,'35': [H+s+'017.gif', ':angel:', 'angel']
,'36': [H+s+'3.gif', ':kagets:', 'Kagets']
,'37': [H+s+'4.gif', ':eek:', 'EEK!']
,'38': [H+s+'014.gif', ':kissing:', 'kisssing']
,'39': [H+s+'q03.gif', ':genit:', 'Genit']

,'40': [H+s+'001.gif', ':wowcantik', 'Wowcantik']
,'41': [H+s+'amazed.gif', ':amazed:', 'Amazed']
,'42': [H+s+'vana-bum-vanaweb-dot-com.gif', ':bikini:', 'Bikini']
,'43': [H+s+'crazy.gif', ':gila:', 'Gila']
,'44': [H+s+'shit-3.gif', ':tai:', 'Tai']
,'45': [H+s+'5.gif', ':shutup:', 'Shutup']
,'46': [H+s+'q20.gif', ':berbusa:', 'Busa']
,'47': [H+s+'49.gif', ':shakehand', 'shakehand']
,'48': [H+s+'48.gif', ':thumbdown', 'thumbdown']
,'49': [H+s+'47.gif', ':thumbup:', 'thumbsup']
,'50': [H+s+'020.gif', ':siul:', 'siul']
,'51': [H+s+'1.gif', ':malu:', 'Malu']
,'52': [H+s+'14.gif', ':D', 'Big Grin']
,'53': [H+s+'15.gif', ':)', 'Smilie']
,'54': [H+s+'06.gif', ':(', 'Frown']

,'55': [H+'ngacir.gif', ':ngacir:', 'Ngacir']
,'56': [H+s + '26.gif', ':linux2:', 'linux2']
,'57': [H+'bolakbalik.gif', ':bingung:', 'Bingung']
,'58': [H+'tabrakan.gif', ':tabrakan:', 'Ngacir Tubrukan']

,'59': [H+s+'q17.gif', ':metal:', 'Metal']
,'60': [H+s+'05.gif', ':cool:', 'Cool']
,'61': [H+s+'hi.gif', ':hi:', 'Hi']
,'62': [H+s+'6.gif', ':p', 'Stick Out Tongue']
,'63': [H+s+'13.gif', ';)', 'Wink']

,'64': [H+s+'01.gif', ':rolleyes:', 'Roll Eyes (Sarcastic)']
,'65': [H+s+'18.gif', ':doctor:', 'doctor']

,'66': [H+s+'006.gif', ':think:', 'Thinking']
,'67': [H+s+'07.gif', ':o', 'Embarrassment']
,'68': [H+s+'36.gif', ':kissmouth', 'kiss']
,'69': [H+s+'37.gif', ':heart:', 'heart']
,'70': [H+s+'e03.gif', ':flower:', 'flower']
,'71': [H+s+'e02.gif', ':rainbow:', 'rainbow']
,'72': [H+s+'008.gif', ':sun:', 'Matahari']
,'73': [H+s+'007.gif', ':moon:', 'Moon']
,'74': [H+s+'40.gif', ':present:', 'present']

,'75': [H+s+'41.gif', ':Phone:', 'phone']
,'76': [H+s+'42.gif', ':clock:', 'clock']
,'77': [H+s+'44.gif', ':tv:', 'televisi']
,'78': [H+s+'39.gif', ':table:', 'table']
,'79': [H+s+'32.gif', ':ricebowl:', 'ricebowl']
,'80': [H+s+'rice.gif', ':Onigiri:', 'Onigiri']
,'81': [H+s+'31.gif', ':coffee:', 'coffee']
,'82': [H+s+'33.gif', ':medicine:', 'medicine']
,'83': [H+s+'43.gif', ':email:', 'mail']

,'84': [H+s+'paw.gif', ':Paws:', 'Paw']
,'85': [H+s+'29.gif', ':anjing:', 'anjing']
,'86': [H+s+'woof.gif', ':buldog:', 'Buldog']
,'87': [H+s+'28.gif', ':kucing:', 'kucing']
,'88': [H+s+'frog.gif', ':frog:', 'frog']
,'89': [H+s+'27.gif', ':babi:', 'babi']
,'90': [H+s+'52.gif', ':exclamati', 'exclamation']

,'91': [H+s+'smiley_beer.gif', ':beer:', 'Angkat Beer']
,'92': [H+s+'kribo.gif', ':afro:', 'afro']
,'93': [H+'smileyfm329wj.gif', ':fm:', 'Forum Music']
,'94': [H+s+'kaskuslove.gif', ':ck', 'Kaskus Lovers']

  };

  gvar.smiliebesar = {
 //'291': [H+s+'smiley_beer.gif', ':beer:', 'Angkat Beer']
//,'292': [H+s+'kribo.gif', ':afro:', 'afro']
//,'293': [H+'smileyfm329wj.gif', ':fm:', 'Forum Music']
//,'294': [H+s+'kaskuslove.gif', ':ck', 'Kaskus Lovers']
'295': [H+'s_sm_ilovekaskus.gif', ':ilovekaskus', 'I Love Kaskus']

/* New Big Smilies */
,'500': [H+'I-Luv-Indonesia.gif', ':iloveindonesia', 'I Love Indonesia']

,'501': [H+'najis.gif', ':najis', 'Najis']
,'502': [H+'s_sm_maho.gif', ':maho', 'Maho']
,'503': [H+'hoax.gif', ':hoax', 'Hoax']
,'504': [H+'marah.gif', ':marah', 'Marah']
,'505': [H+'nosara.gif', ':nosara', 'No Sara Please']
,'506': [H+'berduka.gif', ':berduka', 'Turut Berduka']
,'507': [H+'sorry.gif', ':sorry', 'Sorry']

,'508': [H+'capede.gif', ':cd', 'Cape d...']
,'509': [H+'nohope.gif', ':nohope', 'No Hope']
,'510': [H+'bingung.gif', ':bingung', 'Bingung']

,'511': [H+'hammer.gif', ':hammer', 'Hammer2']
,'512': [H+'dp.gif', ':dp', 'DP']
,'513': [H+'takut.gif', ':takut', 'Takut']
,'514': [H+'salah_kamar.gif', ':salahkamar', 'Salah Kamar']

,'515': [H+'s_big_batamerah.gif', ':batabig', 'Blue Guy Bata (L)']
,'516': [H+'s_big_cendol.gif', ':cendolbig', 'Blue Guy Cendol (L)']
,'517': [H+'toastcendol.gif', ':toast', 'Toast']
,'518': [H+'s_sm_repost1.gif', ':repost', 'Blue Repost']
,'519': [H+'matabelo1.gif', ':matabelo', 'Matabelo']

,'520': [H+'shakehand2.gif', ':shakehand2', 'Shakehand2']

,'521': [H+'mewek.gif', ':mewek', 'Mewek']
,'522': [H+'sundul.gif', ':sup2:', 'Sundul']
,'523': [H+'ngakak.gif', ':ngakak', 'Ngakak']

,'524': [H+'recseller.gif', ':recsel', 'Recommended Seller']
,'525': [H+'jempol2.gif', ':2thumbup', '2 Jempol']
,'526': [H+'jempol1.gif', ':thumbup', 'Jempol']
,'527': [H+'selamat.gif', ':selamat', 'Selamat']

,'528': [H+'ultah.gif', ':ultah', 'Ultah']
,'529': [H+'rate5.gif', ':rate5', 'Rate 5 Star']
,'530': [H+'request.gif', ':request', 'Request']
,'531': [H+'cekpm.gif', ':cekpm', 'Cek PM']

,'532': [H+'ngacir2.gif', ':ngacir2', 'Ngacir2']
,'533': [H+'ngacir3.gif', ':ngacir', 'Ngacir']
,'534': [H+'babyboy.gif', ':babyboy', 'Baby Boy']
,'535': [H+'babyboy1.gif', ':babyboy1', 'Baby Boy 1']
,'536': [H+'babygirl.gif', ':babygirl', 'Baby Girl']
,'537': [H+'kaskus_radio.gif', ':kr', 'Kaskus Radio']
,'538': [H+'traveller.gif', ':travel', 'Traveller']

/* Dec-2010, :kimpoi,:ngacir,:salahkamar,:ultah,:rate5 */
,'539': [H+'kimpoi.gif', ':kimpoi', 'Kimpoi']

// -- OLD ---
,'901': [H+'fd_1.gif', ':jrb:', 'Jangan ribut disini']
,'901': [H+'fd_6.gif', ':kts:', 'Kemana TSnya?']
,'902': [H+'fd_5.gif', ':sup:', 'Sundul Up']
,'903': [H+'fd_4.gif', ':kbgt:', 'Kaskus Banget']
,'904': [H+'fd_8.gif', ':kacau:', 'Thread Kacau']
,'905': [H+'fd_3.gif', ':bigo:', 'Bukan IGO']
,'906': [H+'fd_7.gif', ':repost:', 'Repost']
,'907': [H+'fd_2.gif', ':cd:', 'Cape deeehh']
  };  
  
  gvar.smiliecustom = {
 '11001': [http+'img.kaskus.us/images/kaskusmobile_bb.gif', 'right', 'kaskusmobile_bb']
,'11002': [http+'img.kaskus.us/images/kaskusmobile_hp.gif', 'right', 'kaskusmobile_hp']
,'11003': [http+'i38.tinypic.com/wbywxe.gif', '', 'mahobig']
  };  
 
}
// end getSmilieSets


// =======================
// my recent use - routine

function isDefined(x)   { return !(x == null && x !== null); }
function isUndefined(x) { return x == null && x !== null; }
function isString(x) { return (typeof(x)!='object' && typeof(x)!='function'); }
function trimStr(x) { return x.replace(/^\s+|\s+$/g,""); };
function getValue(key) {
  var data=OPTIONS_BOX[key];
  return (!data ? '': GM_getValue(key,data[0]));
}
function setValue(key, value) {
  var data=OPTIONS_BOX[key];
  return (!data ? '': GM_setValue(key,value));
}
function getByClas(clasname, tag, parent){
  if(isUndefined(parent)) parent = document;
  if(isUndefined(tag)) tag = '*';
  if(!clasname) return;  
  var elem = getTag(tag, parent);
  if(elem.length>0){
    for(var j=0; j<elem.length; j++){
	   if(clasname == elem[j].getAttribute('class')){
		  return elem[j]; break;
	   }
	}
  }return false;
};
function getByName(txtName,tag){
  var ret=false; var el=getTag(tag);
  if(el.length>0)
   for(var i=0; i<el.length;i++)
    if(txtName == el[i].getAttribute('name')){
	   ret = el[i]; break;
	}
  return ret;
};
function getTag(name, parent){
    if(isUndefined(parent)) parent = document;
	if(typeof(parent)!='object')
	    parent = document;	
	return parent.getElementsByTagName(name);
}
function getById(id, parent){
  if(!parent)
    parent = document;
  var obj = false
  try{obj = parent.getElementById(id)}catch(e){};
  return obj;
}
function getByXPath (xp, par, snapshot) {
  if(isUndefined(par)) par = document;
  if(isUndefined(snapshot)) snapshot = XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE;
  return document.evaluate(xp, par, null, snapshot, null);
}
function getByXPath_containing(xp, par, contain){
  if(!par) par = document;
  if(typeof(contain)!='string') return;
  var rets=[];
  var ev = document.evaluate(xp, par, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
  if(ev.snapshotLength)
     for(var i=0;i<ev.snapshotLength;i++)
	   if(ev.snapshotItem(i).innerHTML.indexOf(contain)!=-1) rets.push(ev.snapshotItem(i));  
  return rets;  
}
function mycreateElement(type, attrArray, evtListener, html){
	var node = document.createElement(type);
	for (var attr in attrArray) if (attrArray.hasOwnProperty(attr)){
		node.setAttribute(attr, attrArray[attr]);
	}
	if(evtListener){
		var a = evtListener.split(' ');
		node.addEventListener(a[0], eval(a[1]), eval(a[2]));
	}  
	if(html) node.innerHTML = html;	
	return node;
}
function createTextEl(x){
  return document.createTextNode(x);
};
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
function basename (path, suffix) {
  // Returns the filename component of the path  
  // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // *     example 1: basename('/www/site/home.htm', '.htm');    // *     returns 1: 'home'
  // *     example 2: basename('ecra.php?p=1');
  var b = path.replace(/^.*[\/\\]/g, '');
  if (typeof(suffix) == 'string' && b.substr(b.length-suffix.length) == suffix) {
      b = b.substr(0, b.length-suffix.length);
  }
  return b;
};
function getAbsoluteTop(element) {
  var AbsTop=0;
  while (element) { AbsTop=AbsTop+element.offsetTop; element=element.offsetParent; }
  return(AbsTop);
}
function getCurrentYPos(){
    if (document.body && document.body.scrollTop)
      return document.body.scrollTop;
    if (document.documentElement && document.documentElement.scrollTop)
      return document.documentElement.scrollTop;
    if (window.pageYOffset)
      return window.pageYOffset;
    return 0;
}
//=========================== BROWSER DETECTION / ADVANCED SETTING ===========================================//
function ApiBrowserCheck() {
  //delete GM_log; delete GM_getValue; delete GM_setValue; delete GM_deleteValue; delete GM_xmlhttpRequest; delete GM_openInTab; delete GM_registerMenuCommand;
  if(typeof(unsafeWindow)=='undefined') { unsafeWindow=window; }
  if(typeof(GM_log)=='undefined') { GM_log=function(msg) { try { unsafeWindow.console.log('GM_log: '+msg); } catch(e) {} }; }
  
  var needApiUpgrade=false; gvar.notSafe = needApiUpgrade;
  if(window.navigator.appName.match(/^opera/i) && typeof(window.opera)!='undefined') {
    needApiUpgrade=true; gvar.isOpera=true; GM_log=window.opera.postError; show_alert('Opera detected...',0);
  }
  if(typeof(GM_setValue)!='undefined') {
    var gsv=GM_setValue.toString();
    if(gsv.indexOf('staticArgs')>0) { gvar.isGreaseMonkey=true; show_alert('GreaseMonkey Api detected...',0); } // test GM_hitch
    else if(gsv.match(/not\s+supported/)) { needApiUpgrade=true; gvar.isBuggedChrome=true; show_alert('Bugged Chrome GM Api detected...',0); }
  } else { needApiUpgrade=true; show_alert('No GM Api detected...',0); }

  gvar.noCrossDomain = (gvar.isOpera || gvar.isBuggedChrome);
  if(needApiUpgrade) {
    gvar.notSafe=needApiUpgrade;
    GM_isAddon=true; show_alert('Try to recreate needed GM Api...',0);
    //OPTIONS_BOX['FLASH_PLAYER_WMODE'][3]=2; OPTIONS_BOX['FLASH_PLAYER_WMODE_BCHAN'][3]=2; // Change Default wmode if there no greasemonkey installed
    var ws=null; try { ws=typeof(unsafeWindow.localStorage) } catch(e) { ws=null; } // Catch Security error
    if(ws=='object') {
      show_alert('Using localStorage for GM Api.',0);
      GM_getValue=function(name,defValue) { var value=unsafeWindow.localStorage.getItem(GMSTORAGE_PATH+name); if(value==null) { return defValue; } else { switch(value.substr(0,2)) { case 'S]': return value.substr(2); case 'N]': return parseInt(value.substr(2)); case 'B]': return value.substr(2)=='true'; } } return value; }
      GM_setValue=function(name,value) { switch (typeof(value)) { case 'string': unsafeWindow.localStorage.setItem(GMSTORAGE_PATH+name,'S]'+value); break; case 'number': if(value.toString().indexOf('.')<0) { unsafeWindow.localStorage.setItem(GMSTORAGE_PATH+name,'N]'+value); } break; case 'boolean': unsafeWindow.localStorage.setItem(GMSTORAGE_PATH+name,'B]'+value); break; } }
      GM_deleteValue=function(name) { unsafeWindow.localStorage.removeItem(GMSTORAGE_PATH+name); }
    } else if(!gvar.isOpera || typeof(GM_setValue)=='undefined') {
      show_alert('Using temporarilyStorage for GM Api.',0); gvar.temporarilyStorage=new Array();
      GM_getValue=function(name,defValue) { if(typeof(gvar.temporarilyStorage[GMSTORAGE_PATH+name])=='undefined') { return defValue; } else { return gvar.temporarilyStorage[GMSTORAGE_PATH+name]; } }
      GM_setValue=function(name,value) { switch (typeof(value)) { case "string": case "boolean": case "number": gvar.temporarilyStorage[GMSTORAGE_PATH+name]=value; } }
      GM_deleteValue=function(name) { delete gvar.temporarilyStorage[GMSTORAGE_PATH+name]; };
    }
    if(typeof(GM_openInTab)=='undefined') { GM_openInTab=function(url) { unsafeWindow.open(url,""); } }
    if(typeof(GM_registerMenuCommand)=='undefined') { GM_registerMenuCommand=function(name,cmd) { GM_log("Notice: GM_registerMenuCommand is not supported."); } } // Dummy
    if(!gvar.isOpera || typeof(GM_xmlhttpRequest)=='undefined') {
      show_alert('Using XMLHttpRequest for GM Api.',0);
      GM_xmlhttpRequest=function(obj) {
        var request=new XMLHttpRequest();
        request.onreadystatechange=function() { if(obj.onreadystatechange) { obj.onreadystatechange(request); }; if(request.readyState==4 && obj.onload) { obj.onload(request); } }
        request.onerror=function() { if(obj.onerror) { obj.onerror(request); } }
        try { request.open(obj.method,obj.url,true); } catch(e) { if(obj.onerror) { obj.onerror( {readyState:4,responseHeaders:'',responseText:'',responseXML:'',status:403,statusText:'Forbidden'} ); }; return; }
        if(obj.headers) { for(name in obj.headers) { request.setRequestHeader(name,obj.headers[name]); } }
        request.send(obj.data); return request;
  } } } // end needApiUpgrade
  GM_getIntValue=function(name,defValue) { return parseInt(GM_getValue(name,defValue),10); }
}

// ======================
// my ge-debug
function show_alert(msg, force) {
  if(arguments.callee.counter) { arguments.callee.counter++; } else { arguments.callee.counter=1; }
  GM_log('('+arguments.callee.counter+') '+msg);
  if(force==0) { return; }
}

// ==========
// initialize & set global variable
init();

})();
/* Code.By Idx */