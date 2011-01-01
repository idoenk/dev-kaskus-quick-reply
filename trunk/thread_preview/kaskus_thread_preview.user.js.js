// ==UserScript==
// @name          Kaskus vBulletin Thread Preview - Recoded
// @namespace     http://userscripts.org/scripts/show/
// @version       1.0
// @dtversion     110102101
// @timestamp     1293916844999
// @description	  Preview vbuletin thread, without having to open the thread.
// @author        Indra Prasetya
// @moded         idx (http://userscripts.org/users/idx)
// @include       */forumdisplay.php?*
// @include       */usercp.php?*
// @include       */subscription.php?*
//
// -!--latestupdate
//
//  v1.1 - 2010-01-02
//    add ajax post-method
//
//  v1.0 - 2011-01-01
//    init recoded
//
// -/!latestupdate---
//
// ==/UserScript==
(function () {

// Initialize Global Variables
var gvar=function() {};

gvar.sversion = 'v' + '1.0';
gvar.scriptMeta = {
  timestamp: 1293916844999 // version.timestamp

 ,scriptID: 0 // script-Id
};
/*
javascript:window.alert(new Date().getTime());
javascript:(function(){var d=new Date(); alert(d.getFullYear().toString().substring(2,4) +((d.getMonth()+1).toString().length==1?'0':'')+(d.getMonth()+1) +(d.getDate().toString().length==1?'0':'')+d.getDate()+'');})()
*/
//=-=-=-=--=
//========-=-=-=-=--=========
gvar.__DEBUG__ = false; // development debug
//========-=-=-=-=--=========
//=-=-=-=--=
OPTIONS_BOX = {
  KEY_KTP_IMGLOAD:       ['2'] // 0:no-load, 1:load-smilies-only, 2:load-all
 ,KEY_KTP_FIXED_PREVIEW: ['1'] // fixed position or absolute
 ,KEY_KTP_SCROLL_THREAD: ['1'] // scroll to last opened-thread
 ,KEY_KTP_THEN_GOTHREAD: ['0'] // goto-thread after submit post
};
GMSTORAGE_PATH      = 'GM_';
KEY_KTP = 'KEY_KTP_';

// initilaize primary const
gvar.domainstatic= 'http://'+'static.kaskus.us/';
const _LOADING = '<img src="'+gvar.domainstatic+'images/misc/11x11progress.gif" border="0"/>&nbsp;<small>loading...</small>';

// initialize assign global var
function init(){

  if(page_is_notloaded('Page is temporary not available')) show_alert('Page is not available', 0);
  
  //------------
   ApiBrowserCheck();
  //------------
  gvar.domain= 'http://'+'www.kaskus.us/';
  
  gvar.codename= 'Kaskus Thread Preview';
  gvar.id_textarea= 'vB_Editor_001_textarea';
  gvar.zIndex = 99997; // one level above KFTI
  
  gvar.offsetTop= -35; // buat scroll offset
  
  gvar.meta_refresh = null;
  gvar.fixed_ktfi = false;
  gvar.curThread={};
  
  gvar.setting = {};
  getSettings();
  gvar.offsetLayer= (gvar.fixed_ktfi ? 38 : 20); // buat margin top Layer
  
  gvar.B= getSetOf('button');
  gvar.user= getUserId(); //will be [gvar.user.id, gvar.user.name]

  GM_addGlobalStyle( '', 'css_position', 1 ); // to body for css-fixed
  GM_addGlobalStyle( getCSS() + getCSS_fixed(gvar.setting.fixed_preview) );
  
  GM_addGlobalScript('http:\/\/www.google.com\/recaptcha\/api\/js\/recaptcha_ajax\.js');
  GM_addGlobalScript( getSCRIPT() );  

  //-----Let's Roll-------
    start_Main();
  //----------------------
  
} // end-init

// populate setting value
function getSettings(){
  /** 
  eg. gvar.setting.fixed_preview
  */  
//  var hVal,hdc;
  gvar.setting = {
     imgload: ( getValue(KEY_KTP + 'IMGLOAD') ) // [0,1,2]
    ,fixed_preview:    (getValue(KEY_KTP+'FIXED_PREVIEW')=='1') // boolean
    ,thread_lastscroll:(getValue(KEY_KTP+'SCROLL_THREAD')=='1') // boolean
    ,then_goto_thread: (getValue(KEY_KTP+'THEN_GOTHREAD')=='1') // boolean
  };
  chk_kfti_pos();  
  
}
// end getSettings

function start_Main(){

  // append icon [+] on all thread link
  var nodes = $D("//a[starts-with(@id,'thread_title')]");
  var href, par, Attr, el;
  if(nodes.snapshotLength > 0){
	for(var i=0, lg=nodes.snapshotLength; i<lg; i++) {
	  var node = nodes.snapshotItem(i);
	  par = node.parentNode;
	  Attr = {'class':'thread_preview',style:'',rel:node.href};
	  el = createEl('span',Attr,'[+]');
	  par.insertBefore(el, par.firstChild);
	}
  }
  nodes = $D("//span[@class='thread_preview']");
  if(nodes.snapshotLength > 0){
    for(var i=0, lg=nodes.snapshotLength; i<lg; i++) {
	  var node = nodes.snapshotItem(i);
	  Dom.Ev(node, 'click', function(e){
	    e = e.target||e;
		if(Dom.g('hideshow')) {
		  closeLayerBox('hideshow');
		  if(Dom.g('prev_loader')){
		    var par = Dom.g('prev_loader').parentNode;
			par.innerHTML = '[+]';
		  }
		}
		var href=false;
		if(isDefined(e.getAttribute('rel')))
		  href = e.getAttribute('rel') || false;
		if(!href) return;
		
		e.innerHTML = '<img id="prev_loader" src="'+gvar.domainstatic+'images/misc/11x11progress.gif" style="margin:0 4px 0 3px;" border="0"/>';
		
		// load layer preview
		gvar.curThread = {
		   href: href
		  ,cRow: find_parentRow(e)
		  ,TS: find_TS(e)
		};
		var tid = getThreadId(gvar.curThread.href);
		chk_kfti_pos();
		gvar.curThread.action = 'newreply.php?do=postreply&amp;t='+tid;
		loadLayer(tid);
		
		// fetching thread		
		ajax_thfetch();	    
	  }); // end click event	
	} // end for
  }
  
  //<meta http-equiv="refresh" content="600">
  var head = getTag('head');
  if( isDefined(head[0]) ) {
    nodes = $D("//meta[@http-equiv='refresh']", null, true);
	if(nodes) Dom.remove(nodes);
    gvar.meta_refresh = createEl('meta', {id:'meta_refresh','http-equiv':'refresh',content:'600'});
	Dom.add(gvar.meta_refresh, head[0]);	
  }
  
  // window event
  Dom.Ev(window, 'resize', function() {
   //controler_resizer(); //165 
   $D('#preview_content').style.setProperty('max-height', (parseInt(getScreenHeight()) - 130 - gvar.offsetLayer )+'px;', 'important');
  });
  //
} // end start_Main

function chk_kfti_pos(){
  // try check KTFI, if it's fixed
  try{
   if($D('#TextInfo')){
     var tbL = getTag('table', $D('#TextInfo'));
	 if(tbL.length > 0) tbL = tbL[0];
	 gvar.fixed_ktfi = ( tbL.style.getPropertyValue('position') == 'fixed' );	
   }
  }catch(e){gvar.fixed_ktfi=false;}
  gvar.offsetLayer= (gvar.fixed_ktfi ? 38 : 20); // buat margin top Layer
}

// load after loadLayer
function event_TPL(){
    // event close button
    Dom.Ev($D("#imghideshow"), 'click', function(){closeLayerBox('hideshow');});
	
    // event sticky toggle
    Dom.Ev($D("#imgsticky"), 'click', function(){ toggle_sticky(); });
	
    // cancel preview
    Dom.Ev($D('#preview_cancel'), 'click', function(){ SimulateMouse($D('#imghideshow'), 'click', true); } );	
	
	// qr_button
    Dom.Ev($D('#qr_button'), 'click', function(){
	  $D('#qr_container_head').style.display='';
	  $D('#collapseobj_quickreply').style.display='';
	  
	  // change from fixed to absolute is a must..!!
	  toggle_sticky(false);
	  Dom.remove($D("#imgsticky"));
	  
	  // removing preview_cancel button_preview
	  if($D('#preview_cancel') && $D('#button_preview')){
	    Dom.add($D('#preview_cancel'), $D('#button_preview'));
		removeClass('cyellow', $D('#preview_cancel'));
	  }
	  
	  if($D('#tr_qr_button')) Dom.remove('tr_qr_button');
	  $D('#qr_container').innerHTML = '<div id="preview_loading">'+_LOADING+'</div>';
	  preload_quick_reply();
	});
	//#head_layer
    if($D('#head_layer')){
      Dom.Ev($D('#head_layer'),'dblclick',function(){
		 var tgt = $D('#row_content');
		 var show = (tgt.style.display!='none');
		 tgt.style.display = (show ? 'none' : '');    	
      });
    }
}
function event_TPL_vB(){
	Dom.Ev($D('#textarea_clear'), 'click', function(){ vB_textarea.clear(); });
	
	if($D('#atitle'))
	 Dom.Ev($D('#atitle'), 'click', function() {
      $D('#input_title').style.width=(Dom.g(gvar.id_textarea).clientWidth-80)+'px';
      var disp=$D('#titlecont');
      disp.style.display=(disp.style.display=='none' ? 'block':'none');
      $D('#atitle').innerHTML = '['+(disp.style.display=='none'?'+':'-')+']';
	  if(disp.style.display!='none')
        window.setTimeout(function() { try{$D('#input_title').focus();}catch(e){}; }, 100);
      else
        window.setTimeout(function() { try{Dom.g(gvar.id_textarea).focus();}catch(e){}; $D('#input_title').value=''; }, 100);
     }); // #atitle
	
}
function ajax_fetch_newreply(reply_html){
   // initialize
  if(isUndefined(reply_html)){ // is there ret from XHR :: reply_html
    // prep xhr request  
    GM_XHR.uri = gvar.curThread.newreply;
    GM_XHR.cached = true;
    GM_XHR.request(null,'GET', ajax_fetch_newreply);
  }else{    
	if( !reply_html ) return;
	reply_html = reply_html.responseText;
	// parse response then fill hidden values
	parse_newreply(reply_html);
	
	$D('#qr_container').innerHTML = getTPL_QuickReply();
	// click to build recapctha
    SimulateMouse($D('#hidrecap_btn'), 'click', true);
	
	$D('#loggedin_as').innerHTML = '&nbsp;'+HtmlUnicodeDecode('&#8592;')+'&nbsp;[<small>Logged in as</small>&nbsp;<a class="cyellow" href="./member.php?u='+gvar.user.id+'">'+gvar.user.name+'</a>'+(gvar.user.isDonatur ? ' <b class="cred">$</b>':'')+']';
	$D('#button_preview').style.display = '';
	
	if(gvar.user.isDonatur){
	  // kill capcay container
	  Dom.remove('recapctha_header');
	  Dom.remove('recaptcha_cont');
	}
	
	var snapTo = function(){
	  event_TPL_vB();
      vB_textarea.init();
      vB_textarea.clear();
	};
	ss.STEPS = 10; // scroll speed; smaller is faster
    ss.smoothScroll( Dom.g(gvar.id_textarea), function(){ snapTo() } );
  }
}
function lock_input(flaglock){
  var el;
  if(isUndefined(flaglock)) flaglock = true; // do lock is default
  if(flaglock){
    vB_textarea.readonly();
    el = $D('#recaptcha_response_field');
	if(el) {
	  el.setAttribute('readonly',true);
	  addClass('txa_readonly', el);
	}
	el = $D('#preview_submit');
	if(el) {
	  el.setAttribute('disabled','disabled');
	  addClass('twbtn-disabled', el);
	  el.value='Posting...';
	}
	el = $D('#then_gotothread');
	if(el) {
	  el.setAttribute('disabled','disabled');
	  //addClass('twbtn-disabled', el);
	}
  }else{
    vB_textarea.enabled();
	el = $D('#recaptcha_response_field');
	if(el) {
	  el.removeAttribute('readonly');
	  removeClass('txa_readonly', el);
	}
	el = $D('#preview_submit');
	if(el) {
	  el.removeAttribute('disabled');
	  removeClass('twbtn-disabled', el);
	  el.value=' Post ';
	}
	el = $D('#then_gotothread');
	if(el) {
	  el.removeAttribute('disabled');
	  //addClass('twbtn-disabled', el);
	}
  }
  //txa_readonly
}
function buildQuery(){
  var hidden = getTag( 'input', $D('#vbform') );
  var el, q='';
  for(var h in hidden)
    if( typeof(hidden[h].getAttribute)!='undefined' && hidden[h].getAttribute('type')=='hidden' )
      q+='&' + hidden[h].getAttribute('name') + '=' + encodeURIComponent(hidden[h].value);
  q+= '&sbutton=Reply+Post';

  el = $D('#recaptcha_response_field');
  if(el) q+= '&recaptcha_response_field='+$D('#recaptcha_response_field').value;
  
  var adtnl = [gvar.id_textarea, 'input_title']; // ids of textarea message and title and recaptcha
  el = Dom.g(adtnl[0]);
  if( el && el.value!='' && el.value!=gvar.silahken ){
    var msg = trimStr(el.value);
    //msg = template_wrapper(); // template ntar ajah...
    q = '&' + el.getAttribute('name') + '=' + encodeURIComponent( toCharRef(msg) )  + q;
  }
  el = Dom.g(adtnl[1]);
  if( el && el.value!='' )
    q = '&' + el.getAttribute('name') + '=' + encodeURIComponent(el.value) + q;
  return q;
}
function ajax_post_QR(reply_html){
  // initialize
  if(isUndefined(reply_html)){ // is there ret from XHR :: reply_html
    var spost = buildQuery();
	if(spost===false) {
      //SimulateMouse($D('#imghideshow'), 'click', true);
      return false;
    }	
	GM_XHR.uri = gvar.curThread.action;
    GM_XHR.cached = true;
    GM_XHR.request(spost.toString(),'post', ajax_post_QR);
  } else {
    if( !reply_html ) return;
	reply_html = reply_html.responseText;
    if(gvar.__DEBUG__) show_alert(reply_html);
	
	var retpost = callback_post(reply_html);	
    if(gvar.__DEBUG__) show_alert('error='+retpost.error+ '; msg='+retpost.msg);
	
	var notice = $D('#quoted_notice');
	if(retpost.error!=0){
	   addClass('g_notice-error', notice);
	   notice.innerHTML = retpost.msg;
	   notice.setAttribute('style','display:block;');
	   lock_input(false); // reopen the hive :D
	   // reload capcay
	   SimulateMouse($D('#hidrecap_reload_btn'), 'click', true);
       return;
    }else{
	   var msg = 'Thank you for posting!';	   
	   Dom.remove( $D('#preview_submit') );
	   if(gvar.setting.then_goto_thread && isDefined(retpost.redirect) ){
	     msg+= ' Redirecting...';
		 exec_afterpost('redirect', function(){ location.href=retpost.redirect; });
	   }else{
	     msg+= ' Closing...';
		 exec_afterpost('close', function(){ closeLayerBox('hideshow'); });
	   }
	   $D('#qr_container').innerHTML = '<div id="quoted_notice" class="g_notice" style="display:block;">'+msg+'</div>';	   
	}
  }
}
// mode might be: redirect | close
function exec_afterpost(mode, fn){
  if(isUndefined(mode)) mode = 'close';
  gvar.blinkRow=20;
  var myvar = "";
  var mcallback = (typeof(fn)=='function' ? fn : null);
  gvar.sITryDonePost = window.setInterval(function() {
    window.status = (mode=='close' ? "Closing..." : "Redirecting...") + myvar;
    myvar+= " .";
    if(gvar.blinkRow > 0){
       gvar.blinkRow -= 1;
    }else{
	   clearInterval(gvar.sITryDonePost);
       if(mcallback) mcallback();
    }
  }, 100);  
}


function callback_post(text){
   var cucok, ret={error:0,msg:''};
   if(text.indexOf('POSTERROR')!=-1){
    // there's some error
	cucok = text.match(/<ol><li>([^\<]+)<\/li><\/ol>/i);
	if(cucok) ret = {error: 1, msg:cucok[1] };
   }else if( cucok = text.match(/<meta\s*http\-equiv=[\"\']Refresh[\"\']\s*content=[\"\']\d+;\s*URL=([^\"\']+)/i) ){
     // success
	 ret = {error: 0, redirect:cucok[1] };
   }
   return ret;
  // if(text.indexOf('>Redirecting...<')!=-1)
}

//POSTERROR
function prepost_QR(){
   var ret, rrf = $D('#recaptcha_response_field');
   if(!rrf) return;
   ret = (!rrf || (rrf && rrf.value.trim()=='') ? false : true );
   if( !ret ){
     alert('Belum Mengisi capcay...');
	 window.setTimeout(function() { $D('#recaptcha_response_field').focus();}, 200)	 
   }
   return ret;
}
function preload_quick_reply(){
   
	gvar.sITryFocusOnLoad = window.setInterval(function() {
      if ($D('#recaptcha_response_field')) {
	    clearInterval(gvar.sITryFocusOnLoad);
		Dom.Ev( $D('#recaptcha_response_field'), 'keydown', function(e){
            var C = (!e ? window.event : e );
			var A = C.keyCode ? C.keyCode : C.charCode;
            if( A===13 ){ // mijit enter
			    show_alert(A);
                SimulateMouse($D('#preview_submit'), 'click', true);
                C = do_an_e(C);
            }else if( A===9 ){ // mijit tab
				$D('#preview_submit').focus();
                C = do_an_e(C);
            }else if( (C.altKey && A===82) || (A===33||A===34) /*Alt+R(82) | Pg-Up(33) | Pg-Down(34)*/ ) {
                SimulateMouse($D('#hidrecap_reload_btn'), 'click', true);
				C = do_an_e(C);
			}
        });
        // reorder tabindex //'recaptcha_response_field',
		Dom.g('recaptcha_response_field').setAttribute('tabindex', '202');
		var reCp_field=['recaptcha_reload_btn','recaptcha_switch_audio_btn','recaptcha_switch_img_btn','recaptcha_whatsthis_btn'];
		for(var i=0; i<reCp_field.length; i++)
		  if( $D('#'+reCp_field[i]) ) $D('#'+reCp_field[i]).setAttribute('tabindex', '21'+(i+1) + '');
		
		
		//#preview_submit
        if($D('#preview_submit'))
          Dom.Ev($D('#preview_submit'), 'click', function(){
            var validate= ( !gvar.user.isDonatur  ? prepost_QR() : true );
			if(validate){
			   lock_input(true);
			   ajax_post_QR();
			}
          });
		//#then_gotothread
		if($D('#then_gotothread'))
		  Dom.Ev($D('#then_gotothread'),'click',function(e){
		    e = e.target||e;
			setValue(KEY_KTP+'THEN_GOTHREAD', (e.checked ? '1':'0'));
			gvar.setting.then_goto_thread = ( e.checked );
		  });		
		Dom.Ev($D('#vbform'),'submit',function(e){ 
		  var C = (!e ? window.event : e ); C = do_an_e(C);
		});
		Dom.g(gvar.id_textarea).removeAttribute('disabled');
      } // end #recaptcha_response_field
    }, 200); // end sITryFocusOnLoad
    
    ajax_fetch_newreply();
}
function closeLayerBox(tgt){
    
	if(gvar.curThread.cRow){
	  var lastRow = gvar.curThread.cRow;
	  if(gvar.setting.thread_lastscroll && gvar.setting.fixed_preview){
	    ss.STEPS = 21;
	    ss.smoothScroll( lastRow, null );
	  }
	  gvar.blinkRow=0;
	  gvar.sITryBlinkRow = window.setInterval(function() {
        if(gvar.blinkRow >= 7){
	      clearInterval(gvar.sITryBlinkRow);
	  	  removeClass('selected_row', lastRow);
		  
	  	  return;
	    }
	    gvar.blinkRow++;
		if(typeof(lastRow.getAttribute('class'))=='string' && lastRow.getAttribute('class').trim()!=""){
	      if(lastRow.getAttribute('class').indexOf('selected_row')!=-1)
	        removeClass('selected_row', lastRow);
	      else
			addClass('selected_row', lastRow);		  
		}else{
		  lastRow.setAttribute('class', 'selected_row');
		}
      }, 250);
	}
	
	Dom.remove( Dom.g(tgt) );
}


function loadLayer(tid){
    var Attr,el;
    Attr = {id:'hideshow',style:'display:none;',tid:tid};
    el = createEl('div', Attr, getTPL_Preview() );
    getTag('body')[0].insertBefore(el, getTag('body')[0].firstChild);
    
	event_TPL();
}
function toggle_sticky(flag){
  var obj= $D('#popup_container');
  // flag ? doFixed :doAbs
  if(isUndefined(flag))
    flag = (gvar.setting.fixed_preview === false);
  Dom.g('css_position').innerHTML = getCSS_fixed(flag);
  var yNow = ss.getCurrentYPos();
  obj.style.setProperty('top',( flag ? gvar.offsetLayer: ($D('#qr_container_head').style.display!='none' ? yNow : yNow+gvar.offsetLayer) )+'px','');
  if($D("#imgsticky"))
    $D("#imgsticky").src = (flag ? gvar.B.sticky1_png : gvar.B.sticky2_png );

  setValue(KEY_KTP+'FIXED_PREVIEW', (flag ? '1' : '0') );
  gvar.setting.fixed_preview = (flag);
}

function getCSS_fixed(fixed){
  return '#popup_container{' + (fixed ? 'position:fixed;top:'+gvar.offsetLayer+'px;':'position:absolute;') + '}';
}

function parse_newreply(text){
   if(text.indexOf('vbform')==-1) return null;

   var hidden_name = {
     "qr_hash": "humanverify\\\[hash\\\]"
    ,"qr_securitytoken": "securitytoken"
    ,"qr_do":"do","qr_t":"t","qr_p":"p"
    ,"qr_specifiedpost": "specifiedpost"
    ,"qr_loggedinuser": "loggedinuser"
   };
   var cucok, re, ret={};
   for(var hid in hidden_name){
     if(!isString(hidden_name[hid])) continue;
	 
	 re = new RegExp('name=\\\"'+hidden_name[hid]+'\\\"\\\svalue=\\\"([^\\\"]+)', "i");
	 if( cucok = text.match(re) ){
	    if( Dom.g(hid) ) Dom.g(hid).value = cucok[1];
	 }
   } // end for
   
   // isDonatur check
   gvar.user.isDonatur = (text.indexOf('recaptcha_response_field')==-1);
}
function parse_preview(text){
   // sumthin like kepenuhan
   if(text.indexOf('td_post_')==-1) return null;
   var cucok, wraper, poss;
   var _ret, _tit, _nr;
   /*content*/
    _ret = text.split('td_post_');
    _ret = _ret[1];
    wraper = ['>', '<!-- / message -->' ];
    poss = [_ret.indexOf(wraper[0]), _ret.indexOf(wraper[1])];
    _ret = _ret.substring(poss[0]+wraper[0].length, poss[1]);
    // a lil hack to strip this.innerText = '', which error on GC.
    _ret = _ret.replace(/<input(?:.*)onclick=\"(?:(?:[^;]+).\s*(this\.innerText\s*=\s*'';\s*)(?:[^;]+).(?:[^;]+).\s*(this\.innerText\s*=\s*'';\s*))[^\>]+./gim, function(str,$1,$2){ return( str.replace($1,'').replace($2,'') ) });
    if(gvar.__DEBUG__) show_alert(_ret);
    _ret = parse_image(_ret);
   
   /*title*/
   cucok = text.match(/<title>(.+)<\/title>/);
   if(cucok) _tit = cucok[1].replace(/\s*\-\s*Kaskus\s*\-\s*The Largest Indonesian Community/,"").trim();
   /*newreply*/
   cucok = text.match(/newreply\.php(?:[^\"]+)/);
   if(cucok) _nr = cucok[0].replace(/\&amp;/gi,"&");
   return {content:_ret, title:_tit, newreply:_nr};
}

// param can be manualy supplied. mode=[0:hideall,1:emote,2:showall]; flag:[link, img];
function parse_image(text, flag, mode){
   if(isUndefined(flag)) flag = 'link';
   if(isUndefined(mode)) mode= gvar.setting.imgload;
   if(flag=='link'){
     var ori = text;
     if(mode=='0'){
       // no-load all 
	   text = text.replace(/<img\s*src=[\"\']([^\"|\']+).(?:\sborder=.0.)*(?:\salt=..)*\s*title=[\"\']([^\"|\']+)[^>]+./gim, function(str, $1, $2) { return('<a class="imgthumb" href="'+$1+'" title="'+$2+'">'+basename($1)+'</a> '); });
	   gvar.curThread.adaEMOTE = (ori!=text ? '1' : '0');
     }
     if(mode != '2'){
	  ori = text
      text = text.replace(/<img\s*src=[\"\']([^\"|\']+).(?:\s*border=.0.)(?:\s*alt=..)(?:[\s*\/]+)>/gim, function(str, $1) { return('<a class="imgthumb" href="'+$1+'">'+$1+'</a> '); });
	  gvar.curThread.adaIMG = (ori!=text ? '1' : '0');
     }
   }
   else if(flag=='img'){
     
     // reverse turn back to images
	 //emotes
	 if(mode=='1')
	  text = text.replace(/<a\s*class=\"imgthumb\"\s*href=[\"\']([^"|\']+).\s*title=[\"\']([^\"\']+).>(?:[^>]+).(?:\s|)/gim, function(str, $1, $2){ return('<img src="'+$1+'" border="0" alt="'+$2+'" title="'+$2+'" />'); });
	 // common-images
	 if(mode=='2')
	  text = text.replace(/<a\s*class=\"imgthumb\"\s*href=[\"\']([^"|\']+).>(?:[^>]+).(?:\s|)/gim, function(str, $1){ return('<img src="'+$1+'" border="0" alt="" />'); });
   }
   return text;
}

// this will only fetch additional opt only
function ajax_thfetch(reply_html){
  // initialize
  if(isUndefined(reply_html)){ // is there ret from XHR :: reply_html
    // prep xhr request  
    GM_XHR.uri = gvar.curThread.href;
    GM_XHR.cached = true;    
    GM_XHR.request(null,'GET',ajax_thfetch);
  }else{
    // yg bikin failed
	var caller = (Dom.g('prev_loader') ? Dom.g('prev_loader').parentNode : null);
	if( !reply_html || !$D('#hideshow') || !caller ) return;
	
	if($D('#hideshow')){
	  var tid = $D('#hideshow').getAttribute('tid');
	  if(tid != getThreadId(gvar.curThread.href) ) return;
	}
    reply_html = reply_html.responseText;
    var rets = parse_preview(reply_html);
	
	
	if(rets===null){
	  var retmsg = 'Thread Not Loaded, might be "kepenuhan".';
	  if(caller) {
	    caller.innerHTML = '<blink title="">[X]</blink>';
	    window.setTimeout(function() { caller.innerHTML='[+]';}, 3500);
	  }
	  show_alert(retmsg,0); // end of story	  
	}
	else{
	
	  gvar.curThread.newreply= rets.newreply;
	  gvar.curThread.content= rets.content;
	  if($D('#hideshow')){
		$D('#hideshow').style.display = '';
	    $D('#preview_content').innerHTML = rets.content;
	    $D('#prev_title').innerHTML = '<a href="'+gvar.curThread.href+'" target="_blank" title="Goto Thread - '+(rets.title)+'">'+rets.title+'</a>';
		
		// recalibrate top position only if not in fixed_preview
        $D('#popup_container').style.setProperty('top', (gvar.setting.fixed_preview ? gvar.offsetLayer : ss.getCurrentYPos()+gvar.offsetLayer ) +'px','');

		// addition events
	    // #show_images #show_emotes #open_spoilers
	    if(gvar.curThread.adaEMOTE=='1' && $D('#show_emotes')){
		  Dom.Ev($D('#show_emotes'), 'click', function(e){
		    e=e.target||e;
			var _ret = parse_image(gvar.curThread.content, 'img', 1);
			$D('#preview_content').innerHTML = gvar.curThread.content = _ret;
			Dom.remove(e);
		  });
		  $D('#show_emotes').style.setProperty('display','inline','important');
		}
	    if(gvar.curThread.adaIMG=='1' && $D('#show_images')){
         Dom.Ev($D('#show_images'), 'click', function(e){
		    e=e.target||e;
	        var _ret = parse_image(gvar.curThread.content, 'img', 2);
	        $D('#preview_content').innerHTML = gvar.curThread.content = _ret;
			Dom.remove(e);
	     });
	     $D('#show_images').style.setProperty('display','inline','important');
	    }
		// re-evaluate for spoiler button		
		var nodes = $D('//input[@type="button" and @value and @onclick]', $D('#preview_content'));
		if(nodes.snapshotLength > 0){
		   if($D('#open_spoilers')){
		    Dom.Ev($D('#open_spoilers'), 'click', function(e){
			  e = e.target||e;
			  var inode, show = (e.value.indexOf("Show")!=-1);
			  inode = getTag('input');
			  if(inode.length > 0)
			    for(var i=0; i<inode.length; i++){
			      if(show){
				    if(inode[i].value=="Show") {
					  inode[i].click(); inode[i].value = "Hide";
					}
				  }else{
				    if(inode[i].value=="Hide") {
					  inode[i].click(); inode[i].value = "Show";
					}
				  }
			    }
			  e.blur();
			  e.value = (show ? 'Hide':'Show')+' Spoilers';
			  inode = $D('//div[@id="preview_content"]', null, true);
			  if(inode)
			    gvar.curThread.content= inode.innerHTML;
			  else
			    gvar.curThread.content= $D('#preview_content').innerHTML;
			});
		   }
		   $D('#open_spoilers').style.setProperty('display','inline','important');
		}		
		// end addition events		
	  }
	  // done let's restore loader
	  if(caller) {
	    caller.innerHTML = '[+]';
	    addClass('thread_preview-readed', caller);
	  }
	  if(gvar.curThread.cRow) addClass('selected_row', gvar.curThread.cRow);
	  showhide(Dom.g('hideshow'), true);
	}
  }
  //
} // end ajax_thfetch


function find_TS(e){
  var par = e.parentNode.parentNode;
  var ret = {id:'',name:''};
  if(par.nodeName=='TD'){	
    var inner = par.innerHTML;
    var cucok = inner.match(/member\.php\?u=(\d+)[^\>]+.(.+)<\/span>/im);
	ret = (cucok ? {id:cucok[1], name:cucok[2]} : null);
  }
  return ret;
}
function find_parentRow(e){
  var par = e.parentNode, maxjump = 10, i=0;
  var gotit = false;
  while( !gotit && i < maxjump ){
    par = par.parentNode;
	gotit = (par.nodeName=='TR');
	i++;
  }
  return (gotit ? par : false);
}
function getThreadId(href){
  var match = href.match(/\?t=(\d+)/);
  return (match ? match[1] : '');
}
function getScreenHeight(){
   return window.innerHeight;
}
// if type is not defined, return [id,username]
function getUserId(type){
  var ret=false;
  var logusers = $D("//a[contains(@href, 'member.php')]", null, true);
  if(logusers){
    var uid = logusers.href.match(/member\.php\?u=(\d+$)/);
    ret = {id:uid[1], name:logusers.innerHTML };
  }
  return ret;
}


// statics
function getSCRIPT() {
 return (''
  +'function showRecaptcha(element){'
  +  'Recaptcha.create("6Lf8xr4SAAAAAJXAapvPgaisNRSGS5uDJzs73BqU",element,'
  +    '{theme:"red",lang:"en"'
  +     ',custom_translations:{refresh_btn:"Reload reCapcay :: [Alt+R]",instructions_visual:"Masukkan reCapcay:"}'
  +    '}'
  +  ');'
  +'};'    
 );  
}
function getTPL_Preview(){
  return (''
 //+'<div class="trfade"></div> '
 //+'<div class="fade"></div> '
 +'<div id="popup_container" class="popup_block"> '
 + '<div class="popup" id="popup_child">'
 +  '<a tabindex="209" href="javascript:;"><img id="imghideshow" title="Close" class="cntrl" src="'+gvar.B.closepreview_png+'"/></a>'
 +  '<a tabindex="210" href="javascript:;"><img id="imgsticky" title="Toggle Fixed View" class="sticky" src="'+(gvar.setting.fixed_preview ? gvar.B.sticky1_png : gvar.B.sticky2_png)+'"/></a>'
 +  '<table class="tborder" align="center" border="0" cellpadding="6" cellspacing="1" width="100%">'
 +  '<tbody><tr>'
 +   '<td class="tcat">'
 //gvar.curThread.TS.id | name
 +     '<div id="head_layer" class="hd_layer" style="cursor:s-resize; selection" ><span id="prev_title"></span>&nbsp;' +HtmlUnicodeDecode('&#8592;')+ (gvar.curThread.TS.id ? '[<small>Thread Starter</small> <a title="Thread starter" class="cyellow" href="member.php?u='+gvar.curThread.TS.id+'"><b>'+gvar.curThread.TS.name+'</b></a>]' : '')
 +     '<span id="ktp_version" style="float:right; margin-right:5px;">'+gvar.codename+' '+HtmlUnicodeDecode('&#8212;')+' '+gvar.sversion+'</span></div>'
 +   '</td>'
 +  '</tr><tr id="row_content">'
 +  '<td class="alt1">' 
 +   '<div id="preview_content"></div>' 
 +  '</td></tr>'
 +  '<tbody></table>'
 //
 +  '<div class="spacer"></div>'
 +  '<div id="thread_tools" style="width:98%;">'
 +    '<input type="button" id="open_spoilers" class="twbtn twbtn-m" value="Show Spoilers" style="margin-right:10px;" />' 
 +    '<input type="button" id="show_emotes" class="twbtn twbtn-m" value="Show Emotes" style="" />'
 +    '<input type="button" id="show_images" class="twbtn twbtn-m" value="Show All Images" style="" />'
 +  '</div>'
 +  '<div class="spacer"></div>'
 
 // quick-reply | 
 +'<form action="'+gvar.curThread.action+'" method="post" name="vbform" id="vbform">'
 +   '<div style="display:none;">'
 +    '<input type="submit" name="real_submit" value="Submit Post"/>'
 +   '</div>'
 +  '<table class="tborder" align="center" border="0" cellpadding="6" cellspacing="1" width="100%">'
 +  '<thead id="qr_container_head" style="display:none;"><tr>'
 +   '<td class="tcat">Quick Reply<span id="loggedin_as"></span></td>'
 +  '</tr></thead>'
 +  '<tbody id="collapseobj_quickreply" style="display:none;">'
 +   '<tr><td class="panelsurround">'
 +    '<div class="panel">'
 +    '<div id="qr_container">'
 +      '<div>'+_LOADING+'</div>'
 +    '</div>' // #qr_container 
 +    '</div>' // .panel
 +  '</td></tr><tbody>'
 
 +  '<tfoot id="tr_qr_button">'
 +  '<tr><td class="tcat">'
 
 +    '<a tabindex="206" id="preview_cancel" href="javascript:;" class="cyellow qrsmallfont" style=""><b>Cancel</b></a>'
 
 +    '<div id="qr_button_cont" class="qr_button_cont">'
 +     '<input type="button" id="qr_button" class="twbtn twbtn-m" value="Quick Reply" style="width:300px;" />'
 +    '</div>'
 +  '</td></tr>'
 +  '</tfoot></table>'
 +  ''
 //
 +   '<div id="button_preview" style="display:none;">'
 +'<input type="hidden" name="humanverify[hash]" value="" id="qr_hash" />'
 +'<input type="hidden" name="s" value="" />'
 +'<input type="hidden" name="securitytoken" value="" id="qr_securitytoken" />'
 +'<input type="hidden" name="do" value="postreply" id="qr_do" />'
 +'<input type="hidden" name="t" value="" id="qr_t" />'
 +'<input type="hidden" name="p" value="" id="qr_p" />'
 +'<input type="hidden" name="specifiedpost" value="0" id="qr_specifiedpost" />'
 +'<input type="hidden" name="loggedinuser" value="" id="qr_loggedinuser" />'
 +'<input type="hidden" name="multiquoteempty" id="multiquote_empty_input" value="" />'
 +'<input type="hidden" name="parseurl" value="1" />'
 +'<input type="hidden" name="wysiwyg" value="0" />'
 +'<input type="hidden" name="styleid" value="0" />' + "\n\n"
 +    '<span><input tabindex="205" id="preview_submit" type="button" class="twbtn twbtn-m button" value=" Post " />&nbsp;'
 +    '<label for="then_gotothread"><input type="checkbox" id="then_gotothread" value="1"'+(gvar.setting.then_goto_thread ? ' checked="checked"':'')+' /><small style="font-weight:bold;">Then Goto Thread</small></label></span>'
 +''
 +   '</div>'
 +'</form>'
 
 
 + '</div>' // #popup_child
 +'</div>' // #popup_container
 );
}
function getTPL_QuickReply(){
 return (''
    +'<div id="quoted_notice" class="g_notice"></div>' // Quoted notice
    +'<table cellpadding="0" cellspacing="0"><tr>'
    +'<td><div class="qrsmallfont">'
    +'<div style="float:left;">Title:&nbsp;<a href="javascript:;" id="atitle" title="Optional Title Message">[+]</a>&nbsp;</div><div id="titlecont" style="display:none;"><div id="dtitle" style="float:left;margin-top:-3px;""><input id="input_title" type="text" tabindex="1" name="title" class="input_title" title="Optional"/></div>&nbsp;<div class="spacer">&nbsp;</div></div>'
    +'Message:&nbsp;<a id="textarea_clear" href="javascript:;" title="Clear Editor">reset</a>'
    +'</div></td>'
    +'<td id="recapctha_header" valign="bottom">reCAPTCHA&nbsp;&nbsp;</td>'
    +'</tr><tr>'
    
    // vB_Editor_QR_textarea
    +'<td class="txta_cont panelsurrounds">'

    +'<div class="panel"><div>'
    +getTPL_vbEditor()
    +'</div></div>'
    
    // Setting container will be containing from getTPL_Settings()
    //+'<div id="settings_cont"></div>' 
	
    +'</td>'
	
	+'<td id="recaptcha_cont">'
    +  '<div id="recaptcha_container" style="text-align:center;">'
    +    '<div>'+_LOADING+'</div>'
    +  '</div>'
    +'</td>'
    +'</tr></table>'
	+''
	/* -remote-capctha- */
    +'<fieldset class="fieldset" id="fieldset_capcay" style="display:none;">'    
    + '<input id="hidrecap_btn" value="reCAPTCHA" type="button" style="display:" onclick="showRecaptcha(\'recaptcha_container\');" />' // fake button create
    + '<input id="hidrecap_reload_btn" value="reload_reCAPTCHA" type="button" style="display:" onclick="Recaptcha.reload();" />' // fake button reload
    //+ '<input id="docapcayfocus" value="" type="hidden"  />' // flag for callback caller click capcay
    +'</fieldset>'
	);
}
function getTPL_vbEditor(){
  return (''
  +'<table cellpadding="0" cellspacing="0" border="0" width="100%">'
  +'<tr><td id="vB_Editor_001" class="vBulletin_editor">'
  +  '<div id="vB_Editor_001_controls" class="controlbar" style="width:100%;">'
  +    '' // controller should we fill this?
  +  '</div>' // end #vB_Editor_001_controls
  +  '<table cellpadding="0" cellspacing="0" border="0" width="100%">'
  +   '<tr><td class="controlbar">'
  +     '<textarea name="message" id="'+gvar.id_textarea+'" class="textarea" rows="10" tabindex="201" dir="ltr" disabled="disabled"></textarea>'
  +   '</td></tr>'
  +  '</table>'
  +'</td></tr>'
  +'</table>'
  +''
  +''
  );
}
// end tpl
function getCSS() {
  return (''
    +'span.thread_preview,span.thread_preview-readed{cursor:pointer;font:bold 13px/16px "Comic Sans MS";margin-right:1px;}'
    +'span.thread_preview{color:#FF0000;}'
    +'span.thread_preview-readed{color:#6B6BB6;}'
    +'#controller_wraper{border:1px solid transparent;background-color:transparent;margin-top:-20px;line-height:80px;}'
	+'.textarea{clear:both;height:100px;width:99%;margin:0 3px;}'
	+'.controlbar{text-align:left;}'
    +'.txta_cont{min-width:100%;width:100%;padding-right:5px;}'
    +'.panelsurrounds .panel, .imagebutton{background:#DFDFE0;}'
    +'.input_title, .textarea{border:1px solid #B1B1B1;}'
    +'.input_title:focus, .textarea:focus, .activeField:focus{border:1px solid #275C7C;}'
    +'#recapctha_header{min-width:320px;text-align:right;font-weight:bold;}'
    +'.txa_enable, .txa_readonly{border:1px solid #949494;}'
    +'.txa_enable{background-color:#FFF;color:#000;}'
    +'.txa_readonly{background-color:#E8E8E8;color:#4F4F4F;}'
    +'#button_preview{margin:2px 0;}'
    +'.spacer{height:5px;}'
    +'a.cyellow{color:#F0F000!important;}'
    +'.cred{color:#FF0000!important;}'
    +'.qrsmallfont, .qrsmallfont div, .g_notice{font-size:11px;}'
    +'.selected_row td{background-color:#D5FFD5!important;}'
    +'#thread_tools input{margin-left:5px;display:none;}'
    +'#preview_content div table{width:auto;}'
    +'.g_notice{display:none;padding:.4em;margin-bottom:3px;background:#DFC;border:1px solid #CDA;line-height:16px;}'
    +'.g_notice-error{background:#FFD7FF!important;}'
    +'.hd_layer{background-color:transparent;-moz-user-select:none;-webkit-user-select:none;}'
	+'.qr_button_cont{width:100%; text-align:center;}'
	+'#qr_button{margin-left:-40px;}'
	+'#preview_cancel{float:left;margin:2px 0 0 5px;font-size:13px;}'
	

	
/* ==preview popup== */ 
  	+'#hideshow {position:absolute;min-width:100%;top:0;left:0;}'
	//white-space:sWrap
  	+'#preview_content {overflow:auto;height:auto;max-height:'+(parseInt(getScreenHeight()) - 130 - gvar.offsetLayer)+'px; }'
    +'#popup_container {'
    +  'z-index:'+gvar.zIndex+';'
    +  'background: #ddd; color:black; padding: 5px; border: 5px solid #fff;'
    +  'border-radius:5px; -moz-border-radius:5px; -khtml-border-radius:5px; -webkit-border-radius:5px;'
    +'}'
    +'#popup_container {width:95%;left:1%;}'
    +'.popup_block .popup {'
    +  'float: left; width: 100%; background: #D1D4E0; margin: 0;'
    +  'padding: 0; border: 1px solid #bbb;'
    +'}'
    +'.popup img.cntrl, .popup img.sticky {position:absolute;border:0px;}'
    +'.popup img.cntrl {right:-20px;top:-20px;}'
    +'.popup img.sticky {left:0;top:-3px;}'
    +'#button_preview {padding:3px;text-align:center;}'
    +'*html #popup_container{'
    +  'position: absolute;'
    +  'top:expression(eval(document.compatMode && document.compatMode==\'CSS1Compat\') ? documentElement.scrollTop'
    +  '+((documentElement.clientHeight-this.clientHeight)/2) : document.body.scrollTop'
    +  '+((document.body.clientHeight-this.clientHeight)/2));'
    +  'left:expression(eval(document.compatMode && document.compatMode==\'CSS1Compat\') ? documentElement.scrollLeft'
    +  '+(document.body.clientWidth /2 ) : document.body.scrollLeft + (document.body.offsetWidth/2));'
    +'}'
	/* twitter's button */
    
    +'.twbtn{background:#ddd url("'+gvar.B.twbutton_gif+'") repeat-x 0 0;font:11px/14px "Lucida Grande",sans-serif;width:auto;margin:0;overflow:visible;padding:0;border-width:1px;border-style:solid;border-color:#999;border-bottom-color:#888;-moz-border-radius:4px;-khtml-border-radius:4px;-webkit-border-radius:4px;border-radius:4px;color:#333;text-shadow:1px 1px 0 #fff;cursor:pointer;} .twbtn::-moz-focus-inner{padding:0;border:0;}.twbtn:hover,.twbtn:focus,button.twbtn:hover,button.twbtn:focus{border-color:#999 #999 #888;background-position:0 -6px;color:#000;text-decoration:none;} .twbtn-m{background-position:0 -200px;font-size:12px;font-weight:bold;line-height:10px!important;padding:5px 8px; -moz-border-radius:5px;-khtml-border-radius:5px;-webkit-border-radius:5px;border-radius:5px;margin:-4px 0 -3px 0;} .twbtn:active,.twbtn:focus,button.twbtn:active{background-image:none!important;text-shadow:none!important;outline:none!important;}.twbtn-disabled{opacity:.6;filter:alpha(opacity=60);background-image:none;cursor:default!important;}'
	/* thumb image */
	+'.imgthumb:hover {background-color:#80FF80 !important;}'
	+'.imgthumb {line-height:20px;font-size:11px;padding:2px;padding-left:28px;background:#DDFFDD url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAUCAIAAAD3FQHqAAAABnRSTlMAAAAAAABupgeRAAAACXBIWXMAAAsTAAALEwEAmpwYAAADHUlEQVR42qWUW28bVRDH/7M+Xu+uL3VcJzGlkYAWmVZKZKkS5fLQJ5CQ+gnyGSueIvFAJSoI9KFKWglQSFpCoMjxJb6u1157d2Z4WKd2kpdWnPNw5vzn6HdmRnMOPfr20dbWFv732NnZMbVarbJWUdWr7qvisvLGVlVjTLVaNQCY+fsnvwz9MVHig6qqqojI+SLJ0HNjSbn9wfvffPUAgEnYx6/bJ/41iyiVUicTsegosKLYYhYWi0ViJpZkS8wLIxYh/JtA5ixjUoWsk0nrZjXYvO2xyN7B6MUf2VkEYWURFmUWFmURXlJENGX5F1mWlXXSldXxl7X19ZX70Djv7Xb7QbPjJZkwK4uKzHEii23KCi6wLAuunS7k4GUKBAMynpMr5ifB2BZRUT0vkLLI4PVeprCRyl2PWZgV0AVLVS1C1kmHYe60c2IbVxCfnjWiqJj3FixVFdFu/dCQtA8fv7f5MOsWAFhKRLQUF5Hn2oD9+0ur1TlURatTNpaXc1VUVZGwJsGwfvR07cN7k8DvnzyrfvoQgBlZl1iadWwQSEtnnRUFCMi5UMz7QxUx8/6T7/xh/+7q2p/AxG+XCi6AcHKJBXiOudiXi6mKKOLjg71W/S8ABjGAGxsfFbIZAFGKLMta1Kt51vu78xtAy12dhDOdRWEYxdHEb/6aya4BePbzY2Pn+mH+hx+fA7i1OiUiIprHEoZhN+zjTeMDzDKL4uksTt6KcDyaOZPAB9QYN2YzabXzRSIiub6Uo6oGQdDszpLCMAuzyNUXagqWa48G7TgY5ovrzdN/Op3WSvkmywoRQXXOGg79eiN6m/+A7DzEOmvVb94oG2LXIyeTbjQbjUZjnuMsigaDwTt8MZT5+kHts3t3p9PpYDDY3f3p6OilAUBEpLGDd2IhDEfhJOz3+91u1806dz65Q6+OX5VL5aHvC0tSQiICgUBLRqJe8D1/sTceTTrdjkmnPr//xf7+vhmPx/G12PPc8/soWS7HQZelXq/X7/XXK5Xqx9VSqbS9vT0/cXB4YKdtFn7LFEVkHAQrxZLjOHEcb2xsAPgPkT44D3rdTkkAAAAASUVORK5CYII=) no-repeat !important; color:#000 !important;}'
  );
}
function getSetOf(type){
  if(isUndefined(type)) return false;
  switch(type){
    case "button":
     return {
      closepreview_png : ""
        +"data:image/png;base64,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%3D%3D"
      ,twbutton_gif : ""
        +"data:image/gif;base64,R0lGODlhCgBYAsQfAPPz8+vr6/7+/uHh4fn5+eXl5d7e3vv7++jn6Ofo5/j4+Ojo6d/g4Ofn59/g3+Pk5OPj4/f29vv7+vz7/ODf3/"
		+"Dw8Pb29vv8+/z8/ODf4O/v7+fn5unp6N/f3+Dg4P///yH5BAEAAB8ALAAAAAAKAFgCAAX/oCCOZGmeIqau7OG6UiwdRG3fSqTs/G79wCDAMiwSiYCkUllpOp+aqHQ"
		+"a0FSvVmtgy+VyvoEvZxFeIBKLRQK93rg3hbf7UaAX6vQHZM/vD/6AgR6DhIUdBgaHHYuLiI6PkJEfk5SVlpeYmZqbnJ2en6ChoqOkpaanqKmqq6ytrq+wsbKztLW2"
		+"t7i5uru8vb6/wMHCw8TFxsfIycrLwijOz9DRLNMYEy8u1jAy2zM33gQ94TkR5OQW5UHpQElH7Evv8O9P8xVT9VL3U/pXW1ld/wABihko5kyDBAgaIFCTYEMDOQ7d3"
		+"JlIEY+eBxgx9tm4J5DHAR4+hvSQoQMFDwwKzzFgtIiCA0aPDiGSGammJGY4c+rcybOnz59AgwodSrSo0aNIkypdyrRps2hQo0otoUIANRUTLhyYgOHAha4utIa9NkM"
		+"GjAMxvEnAocBGW3A94O7QMW6ujwg/8ALRq+6HEXd+4wkeXGEJvcOH9SleLAWL44CQIwskGOZLmgVj0mQ+eDDhmYQNHoZ2M/oOHNMVU9/JmBGCRo4b//AZMPujx5CCc"
		+"IMktLsDgwwOUHro4GAly+OJaM60yfyR0+fQo0ufTr269evYs2vfzr2791IhAAA7"
      ,sticky1_png : ""
        +"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAAUCAIAAADgN5EjAAAABnRSTlMAAAAAAABupgeRAAAACXBIWXMAAA7EAAAOxAGVKw4bAAABS0l"
		+"EQVR42mNgoD9gROPPmDoHU5HEx90MDAy6vA+Uc09i1zlj6pz0rOSZ0+Ym232EC97dPIWVV4xXXPbzy8e/P79i5RWD6GdB08bAwPCHEWHcowOrhFSMBWS0GRgYBGS0P"
		+"zy5+u7OWYgUE5o2NPDhyXWINgiAsO9ONkexc+a0uci2QQA3vzCaCCuvGISB0InsNzj4+vHtz4+v2Pmhqn9+fPXhyXXjzk8I12IF53577P9t+/T8jg9PrjIwMHx4cvXV"
		+"nXMCMprodmJqm7lkKQODvqGSHevLdY/P7mJgYBCQ0YRHDAsebSJCQrXGdzlkhBkYwuQYGOYe4s/IToGrYcGlzdvJxU/+PAODCi5HsWBqW7tte3pMtBHrDvypjwVN2+k"
		+"TJ2qN73IQ0oai88eTO0/+vky3/YDHhdh1csio+DGcJyevYM0lyAA5YIccAAA3ZH1T/MtQvwAAAABJRU5ErkJggg=="
      ,sticky2_png : ""
        +"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAAUBAMAAACdextHAAAAMFBMVEUEAgSkoqT8+vx8fnzEwsT8/vy6APHcAHYAADoAADUAAPEAAHZ"
		+"AgtgMAAROAAABAAD3wbpfAAAAEHRSTlMA////////////////////wFCLQwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAGtJREFUeNqNzssNgDAMA9B2A1LIAqW5g9IFg"
		+"ExQyfuvQj9wRMKnp8iy4txHPBHp1smMNXd7cNnNGkNltmWuJOKymDWyAHkUGEhqx8NLVfuWJAWmxhCv8yGnjJeHyFsIMaIMSoGMa3uMyP3IDRceE8PdUxi6AAAAAEl"
		+"FTkSuQmCC"
      ,updates_png : ""
        +"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAARCAIAAACNaGH2AAAABnRSTlMA/wD/AP83WBt9AAAACXBIWXMAAA7EAAAOxAGVKw4bAAABg0"
        +"lEQVR42n2SPW4UQRCFX417MXh3JbJ1hIwRxyBCGImjICQHIALOYF+Bi8AduIYdIeT9m5mq9xHMYhLMUwUt9Wu9r6orvv64/Nn/2o61NvvyOnNbtRkzbZepciZVT"
        +"p90j7vduIEgQoGxAgAhIYENAoHX47ob7JQSyjJyTa4ACRQRIaGITkTb2X15MGknpFxQWEIStpBCANA2maM9mgH6cqLRhGQDYGFTxgjaNisVCUN5lIeskcMdJiSQN"
        +"FGpbbKIGOzR9NCDEDaG8p9eNYG1TVnBYKcZjKdQeRrEAYPCKKLtsko2SiOMLXAac18ThqDtXUyIAYXLwgJXyWDbU45ALfd9N2sytiVxSOAAXBaOCEC4HWe3G3fRd"
        +"YojYaZ/G0ZXSaKmd4E9ny3jZn1zu7mV9On7RxBOzNvzi4uX7yYAxTQPnS5P22q+Ws1XklyF3bX24unZ51df9C+1+xNZR0+Oz5fPr95c6wH9dc8WJ2eLZ1evrxePF"
        +"g+5D+sCvP/24a6/47/6DW1k0UQglGH2AAAAAElFTkSuQmCC"
     };
    break;
  };
  return false;
}


// static routine
function isDefined(x)   { return !(x == null && x !== null); }
function isUndefined(x) { return x == null && x !== null; }
function isString(x) { return (typeof(x)!='object' && typeof(x)!='function'); }
function trimStr(x) { return x.replace(/^\s+|\s+$/g,""); };
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
function toCharRef(text){
    var charRefs = [], codePoint, i;
    for(i = 0; i < text.length; ++i) {
        codePoint = text.charCodeAt(i);
        if(!text[i].match(/[\w\[\]\<\>\s\?\'\"\;\:\=\+\-\_\)\(\&\^\%\$\#\@\!\~\}\{\|\/\r\n]/)){
         if(0xD800 <= codePoint && codePoint <= 0xDBFF) {
            i++;
            codePoint = 0x2400 + ((codePoint - 0xD800) << 10) + text.charCodeAt(i);
         }
         charRefs.push('&#' + codePoint + ';');
        }else
          charRefs.push(text[i]);
    }
    return charRefs.join('');
};
function do_an_e(A) {
  A.stopPropagation();
  A.preventDefault();
  return A;
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
function SimulateMouse(elem,event,preventDef) {
  if(typeof(elem)!='object') return;
  var evObj = document.createEvent('MouseEvents');
  preventDef=(isDefined(preventDef) && preventDef ? true : false);
  evObj.initEvent(event, preventDef, true);
  try{elem.dispatchEvent(evObj);}
  catch(e){
    //clog('Error. elem.dispatchEvent is not function.')
  }
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
function getValue(key) {
  var data=OPTIONS_BOX[key];
  return (!data ? '': GM_getValue(key,data[0]));
}
function setValue(key, value) {
  var data=OPTIONS_BOX[key];
  return (!data ? '': GM_setValue(key,value));
}
function showhide(obj, show){
  if(isUndefined(obj)) return;
  if(isUndefined(show)) show = (obj.style.display=='none'); // toggle mode
  obj.setAttribute('style','display:'+ (show ? '':'none') );
}
function getTag(name, parent){
  var ret = (typeof(parent)!='object' ? document.getElementsByTagName(name) : parent.getElementsByTagName(name) );
  return (isDefined(ret[0]) ? ret : false);
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
function page_is_notloaded(t){
   var tg = getTag('title');
   return (tg && isDefined(tg[0]) && tg[0].innerHTML.indexOf(typeof(t)=='string' ? t : 'Page is temporary not available')!=-1);
}
// end static routine

//=== BROWSER DETECTION / ADVANCED SETTING
//=============snipet-authored-by:GI-Joe==//
function ApiBrowserCheck() {
  //delete GM_log; delete GM_getValue; delete GM_setValue; delete GM_deleteValue; delete GM_xmlhttpRequest; delete GM_openInTab; delete GM_registerMenuCommand;
  if(typeof(unsafeWindow)=='undefined') { unsafeWindow=window; }
  if(typeof(GM_log)=='undefined') { GM_log=function(msg) { try { unsafeWindow.console.log('GM_log: '+msg); } catch(e) {} }; }
  
  var needApiUpgrade=false;
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
    GM_isAddon=true; show_alert('Try to recreate needed GM Api...',0);
    //OPTIONS_BOX['FLASH_PLAYER_WMODE'][3]=2; OPTIONS_BOX['FLASH_PLAYER_WMODE_BCHAN'][3]=2; // Change Default wmode if there no greasemonkey installed
    var ws=null; try { ws=typeof(unsafeWindow.localStorage) } catch(e) { ws=null; } // Catch Security error
    if(ws=='object') {
      show_alert('Using localStorage for GM Api.',0);
      GM_getValue=function(name,defValue) { var value=unsafeWindow.localStorage.getItem(GMSTORAGE_PATH+name); if(value==null) { return defValue; } else { switch(value.substr(0,2)) { case 'S]': return value.substr(2); case 'N]': return parseInt(value.substr(2)); case 'B]': return value.substr(2)=='true'; } } return value; };
      GM_setValue=function(name,value) { switch (typeof(value)) { case 'string': unsafeWindow.localStorage.setItem(GMSTORAGE_PATH+name,'S]'+value); break; case 'number': if(value.toString().indexOf('.')<0) { unsafeWindow.localStorage.setItem(GMSTORAGE_PATH+name,'N]'+value); } break; case 'boolean': unsafeWindow.localStorage.setItem(GMSTORAGE_PATH+name,'B]'+value); break; } };
      GM_deleteValue=function(name) { unsafeWindow.localStorage.removeItem(GMSTORAGE_PATH+name); };
    } else if(!gvar.isOpera || typeof(GM_setValue)=='undefined') {
      show_alert('Using temporarilyStorage for GM Api.',0); gvar.temporarilyStorage=new Array();
      GM_getValue=function(name,defValue) { if(typeof(gvar.temporarilyStorage[GMSTORAGE_PATH+name])=='undefined') { return defValue; } else { return gvar.temporarilyStorage[GMSTORAGE_PATH+name]; } };
      GM_setValue=function(name,value) { switch (typeof(value)) { case "string": case "boolean": case "number": gvar.temporarilyStorage[GMSTORAGE_PATH+name]=value; } };
      GM_deleteValue=function(name) { delete gvar.temporarilyStorage[GMSTORAGE_PATH+name]; };
    }
    if(typeof(GM_openInTab)=='undefined') { GM_openInTab=function(url) { unsafeWindow.open(url,""); }; }
    if(typeof(GM_registerMenuCommand)=='undefined') { GM_registerMenuCommand=function(name,cmd) { GM_log("Notice: GM_registerMenuCommand is not supported."); }; } // Dummy
    if(!gvar.isOpera || typeof(GM_xmlhttpRequest)=='undefined') {
      show_alert('Using XMLHttpRequest for GM Api.',0);
      GM_xmlhttpRequest=function(obj) {
        var request=new XMLHttpRequest();
        request.onreadystatechange=function() { if(obj.onreadystatechange) { obj.onreadystatechange(request); }; if(request.readyState==4 && obj.onload) { obj.onload(request); } }
        request.onerror=function() { if(obj.onerror) { obj.onerror(request); } }
        try { request.open(obj.method,obj.url,true); } catch(e) { if(obj.onerror) { obj.onerror( {readyState:4,responseHeaders:'',responseText:'',responseXML:'',status:403,statusText:'Forbidden'} ); }; return; }
        if(obj.headers) { for(name in obj.headers) { request.setRequestHeader(name,obj.headers[name]); } }
        request.send(obj.data); return request;
  }; } } // end needApiUpgrade
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
// -end static
// -----------

//========= Global Var Init ====
GM_addGlobalScript=function(script, id, tobody) { // Redefine GM_addGlobalScript with a better routine
  var sel=createEl('script',{type:'text/javascript'});
  if(isDefined(id) && isString(id)) sel.setAttribute('id', id);
  if(script.match(/^https?:\/\/.+/))
    sel.setAttribute('src', script);
  else
    sel.appendChild(createTextEl(script));
  if(isDefined(tobody) && tobody){
    document.body.insertBefore(sel,document.body.firstChild);
  }else{
    var hds = getTag('head');
    if( isDefined(hds[0]) && hds[0].nodeName=='HEAD' )
     window.setTimeout(function() { hds[0].appendChild(sel);}, 100);
    else
     document.body.insertBefore(sel, document.body.firstChild);
  }
  return sel;
};
GM_addGlobalStyle=function(css, id, tobody) { // Redefine GM_addGlobalStyle with a better routine 
  var sel=createEl('style',{type:'text/css'});
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

// Get Elements
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
// utk add - remove element
Dom = {
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
GM_XHR = {
  uri:null,
  returned:null,
  cached:false,
  events:false,
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
          if(ret.status==503){
            show_alert('Reach 503, retrying...');
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
/* Modified Smooth scrolling
   Todd Anglin  14 October 2006, sil, http://www.kryogenix.org/
   v1.1 2005-06-16 wrap it up in an object
*/
ss = {
  smoothScroll: function(anchor, cb) {
    var destinationLink = anchor;

    // If we didn't find a destination, give up and let the browser do its thing
    if (!destinationLink) return true;

    // Find the destination's position
    var desty = destinationLink.offsetTop;
    var thisNode = destinationLink;
    while (thisNode.offsetParent && 
          (thisNode.offsetParent != document.body)) {
      thisNode = thisNode.offsetParent;
      desty += thisNode.offsetTop + gvar.offsetTop;
    }

    // Stop any current scrolling
    clearInterval(ss.INTERVAL);
    
    // check is there any callback
    ss.callback = (typeof(cb)=='function' ? cb:null);

    cypos = ss.getCurrentYPos();
    ss_stepsize = parseInt((desty-cypos)/ss.STEPS);
    
    ss.initPos = (cypos < desty);
    ss.INTERVAL = setInterval( function(){
        ss.scrollWindow(ss_stepsize,desty,anchor)
    }, 8);
    
  },

  scrollWindow: function(scramount,dest,anchor) {
    wascypos = ss.getCurrentYPos();
    isAbove = (wascypos < dest);
    window.scrollTo(0,wascypos + scramount);
    iscypos = ss.getCurrentYPos();
    isAboveNow = (iscypos < dest);
    //show_alert('wascypos:'+wascypos+'; '+'isAbove:'+isAbove+'; '+'iscypos:'+iscypos+'; '+'isAboveNow:'+isAboveNow);
    if ((isAbove != isAboveNow) || (wascypos == iscypos) || (isAbove == isAboveNow && (ss.initPos!=isAbove || ss.initPos!=isAboveNow)) ) {
      // if we've just scrolled past the destination, or
      // we haven't moved from the last scroll (i.e., we're at the
      // bottom of the page) then scroll exactly to the link
      //  additional conditional if user scrolling will prevent of dead end scrollpage
      window.scrollTo(0,dest);
      // cancel the repeating timer
      clearInterval(ss.INTERVAL);
      // and jump to the link directly so the URL's right
      if(isString(anchor)) location.hash = anchor;
      if(ss.callback) ss.callback();
      return;
    }
  },

  getCurrentYPos: function() {
    if (document.body && document.body.scrollTop)
      return document.body.scrollTop;
    if (document.documentElement && document.documentElement.scrollTop)
      return document.documentElement.scrollTop;
    if (window.pageYOffset)
      return window.pageYOffset;
    return 0;
  }
};
vB_textarea = {
  init: function(id) {
    this.Obj = (isUndefined(id) ? Dom.g(gvar.id_textarea) : Dom.g(id));
    this.content = (this.Obj ? this.Obj.value : "");
    //this.cursorPos = this.rearmPos(); // [start, end]
    //this.last_scrollTop = this.Obj.scrollTop; // last scrolltop pos
  },
  clear: function (id){
    if(!this.Obj) this.Obj = (isUndefined(id) ? Dom.g(gvar.id_textarea) : Dom.g(id));
    this.set('');
    this.enabled();
    //if(gvar.settings.textareaExpander[0]) this.adjustGrow();
    this.focus();
  },
  readonly: function(id){
     //clog('txta readonly');
    this.Obj = (isUndefined(id) ? Dom.g(gvar.id_textarea) : Dom.g(id));
    removeClass('txa_enable', this.Obj);
    addClass('txa_readonly', this.Obj);
    this.Obj.setAttribute('readonly',true);
  },
  enabled: function(id){
    //clog('txta enabled');
    if(!this.Obj) this.Obj = (isUndefined(id) ? Dom.g(gvar.id_textarea) : Dom.g(id));
    this.Obj.removeAttribute('disabled');
    this.Obj.removeAttribute('readonly');

    removeClass('txa_readonly', this.Obj);
    addClass('txa_enable', this.Obj);
  },
  focus: function(){
    //clog('txta focused');
    this.Obj.focus(); 
  },
  set: function(value){
    if(!this.Obj)
      this.Obj = Dom.g(gvar.id_textarea);
    this.Obj.value = this.content = value;
  }
  
};

// ------
init();
// ------

})();