// ==UserScript==
// @name          Kaskus Thread Preview - reCoded-2
// @namespace     http://userscripts.org/scripts/show/
// @version       1.0
// @dtversion     110103101
// @timestamp     1294206678821
// @description	  Preview vbuletin thread, without having to open the thread.
// @author        Indra Prasetya (http://www.socialenemy.com/)
// @moded         idx (http://userscripts.org/users/idx)
// @include       */forumdisplay.php?*
// @include       */usercp.php*
// @include       */subscription.php?*
//
// -!--latestupdate
//
//
//  v1.0 - 2011-01-05
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
  timestamp: 1294206678821 // version.timestamp

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
var _LOADING = '';


function init(){

  if(page_is_notloaded('Page is temporary not available')) show_alert('Page is not available', 0);
  
  //------------
    ApiBrowserCheck();
  //------------
  gvar.domain= 'http://'+'www.kaskus.us/';
  gvar.domainstatic= 'http://'+'static.kaskus.us/';
  gvar.ngaskus = 'http://'+'www.ngaskus.us/'
  
  gvar.codename= 'Kaskus Thread Preview';
  gvar.id_textarea= 'vB_Editor_001_textarea';
  _LOADING = '<img src="'+gvar.domainstatic+'images/misc/11x11progress.gif" border="0"/>&nbsp;<small>loading...</small>';
  
  gvar.zIndex = 99997; // one level above KFTI
  gvar.offsetTop= -35; // buat scroll offset
  gvar.offsetMaxHeight= 130; // buat maxHeight adjust
  gvar.meta_refresh = null;
  gvar.fixed_ktfi = false;
  
  //gvar.curThread={};
  
  gvar.setting = {};
  getSettings();
  gvar.offsetLayer= (gvar.fixed_ktfi ? 38 : 20); // buat margin top Layer
  
  gvar.B= rSRC.getSetOf('button');
  gvar.TS= {}; // all about TS: {id:'',name:'',tid:'',pid:'',urifetch:''}
  gvar.LPOST= {}; // all about LASTPOST: {id:'',name:'',pid:'',urifetch:''}  
  gvar.user= {}; // all about logged is user: {id:'',name:'',isDonat:[1,0]}
  gvar.current= {}; // {cImg:'',cEmote:'',cSPL:'',content:'',isLastPost:'',QR_isLoaded:''}

  //GM_addGlobalStyle( getCSS() + getCSS_fixed(gvar.setting.fixed_preview) );
  GM_addGlobalStyle( rSRC.getCSS() );
  GM_addGlobalStyle( rSRC.getCSS_fixed(gvar.setting.fixed_preview), 'css_position', 1 ); // to body for css-fixed
  
  GM_addGlobalScript('http:\/\/www.google.com\/recaptcha\/api\/js\/recaptcha_ajax\.js');
  GM_addGlobalScript( rSRC.getSCRIPT() );  

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

// main starter
function start_Main(){
  // prep recreate clone meta-refresh | it will be killed/re-add when popup showed up
  var head = getTag('head');
  if( isDefined(head[0]) ) {
    nodes = $D("//meta[@http-equiv='refresh']", null, true);
	if(nodes) Dom.remove(nodes);
    gvar.meta_refresh = createEl('meta', {id:'meta_refresh',content:'600','http-equiv':'refresh'});
	Dom.add(gvar.meta_refresh, head[0]);
  }
  tTRIT.init();
  

} // end start_Main


var LINK = {
  getTID: function(link){
    var cucok = link.match(/\.php\?t=(\d+)/im);
    return (cucok ? cucok[1] : false);
  }
 ,getPID: function(link){
    //showthread.php?p=340941629#post340941629   >>=become=>>   showpost.php?p=340941629
    var cucok = link.match(/\.php\?p=(\d+)/im);
    return (cucok ? cucok[1] : false);
  }
};


var tTRIT = {
  init: function(){
    // append icon [+] on all thread & lastpost link
    var nodes = $D("//a[starts-with(@id,'thread_title')]");
    var lnodes, node, href, tid, pid, par, Attr, el;
    if(nodes.snapshotLength > 0){
     for(var i=0, lg=nodes.snapshotLength; i<lg; i++) {
      node = nodes.snapshotItem(i);
	  tid = LINK.getTID(node.href);
	  Attr = {id:'remoteTID_'+tid,'class':'thread_preview',style:'',rel:node.href};
	  el = createEl('span',Attr,'[+]');
	  par = node.parentNode; // parent of cont (DIV)
	  par.insertBefore(el, par.firstChild);
	  // attach event-click
	  Dom.Ev(el, 'click', function(e){ tTRIT.clickNode(e); }); // end click event
	  
	  // lastpost nodes (single node)
	  lnodes = $D(".//a[contains(@href,'#post')]", nodes.snapshotItem(i).parentNode.parentNode.parentNode, true);
	  if(lnodes){
	    pid = LINK.getPID(lnodes.href);
		Attr = {id:'remotePID_'+pid,'class':'thread_preview lastpost',style:'',rel:'showpost.php?p='+pid,title:'Preview Last Post'};
		el = createEl('span',Attr,'[+]');
		Dom.add(el, lnodes.parentNode);
	  }
	  // attach event-click
	  Dom.Ev(el, 'click', function(e){ tTRIT.clickNode(e); }); // end click event
	 }
	}
	gvar.user= tTRIT.getUserId();
  }
 ,collectRowInfo: function(e){
    var task = (e.getAttribute('class') && e.getAttribute('class').indexOf('lastpost')!=-1 ? 'lastpost' : 'firstpost');
	var trInner, inner, ret, cucok, isLast; 
	isLast = gvar.current.isLastPost = (task=='lastpost');
    trInner = gvar.current.cRow = e.parentNode.parentNode.parentNode;
    trInner = trInner.innerHTML;
    if(isLast){ // find its parent (TR)

      gvar.TS.tid = LINK.getTID(trInner);
      inner = e.parentNode.innerHTML;
    }else{
      gvar.TS.tid = LINK.getTID( e.getAttribute('rel') );
      inner = trInner;
    }
	// buat action form
	gvar.current.action = 'newreply.php?do=postreply&t='+gvar.TS.tid;
	gvar.current.tofetch = e.getAttribute('rel');
	
	// nyari TS.id & TS.name
	cucok = trInner.match(/member\.php\?u=(\d+)[^>]+.([^<]+).\/span>/im);
	gvar.TS.id = (cucok ? cucok[1]:null); gvar.TS.name = (cucok ? cucok[2]:null);
	gvar.TS.pid = null; // ntar aj nyarinya.. abis fetch
	
	// nyari LPOST, actualy needed only on lastpost
	cucok = inner.match(/by\s*<[^>]+.([^<]+).\/a>/im);
	gvar.LPOST = (cucok ? {id:'#', name:cucok[1]} : {id:null,name:null} ); // # dulu id-nya
	cucok = inner.match(/id=[\'\"]remotePID_(\d+)/m);
	gvar.LPOST.pid = (cucok ? cucok[1] : null);
	
	clog('TS.id:'+gvar.TS.id+'; TS.name:'+gvar.TS.name+'; TS.tid:'+gvar.TS.tid+'; TS.pid:'+gvar.TS.pid+'; ');
	clog('LPOST.id:'+gvar.LPOST.id+'; LPOST.name:'+gvar.LPOST.name+'; LPOST.pid:'+gvar.LPOST.pid+'; ');
	
 }
 ,clickNode: function(e){
    e = e.target||e;
	// reset this gvar.
	gvar.current= {};
	if($D('#hideshow')) {
	  tPOP.closeLayerBox('hideshow');
	  if($D('#prev_loader')) $D('#prev_loader').parentNode.innerHTML = '[+]';
	}
	if( isUndefined(e.getAttribute('rel')) ) return;
	// kill the meta
	if($D('#meta_refresh')) Dom.remove($D('#meta_refresh'));
	
	e.innerHTML = '<img id="prev_loader" src="'+gvar.domainstatic+'images/misc/11x11progress.gif" style="margin:0 4px 0 3px;" border="0"/>';
	tTRIT.collectRowInfo(e);
	
	// re-syncroning from storage avoid changed value when qr-click
	gvar.setting.fixed_preview = (getValue(KEY_KTP+'FIXED_PREVIEW')=='1');
	Dom.g('css_position').innerHTML = rSRC.getCSS_fixed( gvar.setting.fixed_preview );
	
	// pre-check kfti position, walau udah di setting, this one is per-click.
	// user might resize / change the state of kfti
	chk_kfti_pos();
	
	//loadLayer(gvar.curThread.tid);
	
	// fetching thread
	tTRIT.fetch();
  }
 
 ,fetch: function(){
    getFetch(gvar.current.tofetch, tTRIT.fetch_cb);
  }  
 ,is_fetch_expire: function(){
	var caller_id = (gvar.current.isLastPost ? 'remotePID_'+gvar.LPOST.pid : 'remoteTID_'+gvar.TS.tid);
    return ( !$D('#' + caller_id) );
  }
 ,fetch_cb: function(reply_html){
    // callback of fetch progress
	var caller = ($D('#prev_loader') ? $D('#prev_loader').parentNode : null);
	// tahap-1 yg bikin failed
	if( !reply_html || !caller ) tTRIT.fetch_failed('t1');
	
	reply_html = reply_html.responseText;
    var rets = tTRIT.parse_preview(reply_html);
	
	if(rets===null){
	  if(caller) {
	    caller.innerHTML = '<blink title="">[X]</blink>';
	    window.setTimeout(function() { caller.innerHTML='[+]';}, 3500);
	  }
	  tTRIT.fetch_failed('t2, ' + 'Thread Not Loaded, might be `kepenuhan`'); // end of story
	}	
	// tahap-3 yg bikin failed
	if( tTRIT.is_fetch_expire() ) tTRIT.fetch_failed('t3');	
	
	// done let's restore loader
	if( caller ) tTRIT.fetch_done(caller);	
	
	// ready to next step
	gvar.current.newreply = rets.newreply;
    gvar.current.content= rets.content;
	
	// now tPOP object is starting..
	tPOP.init(rets);
	
  }
 ,fetch_failed: function(msg){
	clog('Fetch Failed::' + msg);
	return false;
  }
 ,fetch_done: function(caller){
	if(caller){
	 caller.innerHTML = '[+]';
	 addClass('thread_preview-readed', caller);
	 if(gvar.current.cRow) addClass('selected_row', gvar.current.cRow);
	 //showhide($D('#hideshow'), true);
	}
  }

 ,parse_preview: function(text){
   // sumthin like kepenuhan
   if(text.indexOf('td_post_')==-1) return null;
   var cucok, wraper, poss, _ret, _tit, _nr;
   /*content*/
   _ret = text.split('td_post_');
   _ret = _ret[1];
   wraper = ['>', '<!-- / message -->'];
   poss = [_ret.indexOf(wraper[0]), _ret.indexOf(wraper[1])];
   _ret = _ret.substring(poss[0]+wraper[0].length, poss[1]);
   // a lil hack to strip this.innerText = '', which bring error on GC.
   _ret = _ret.replace(/<input(?:.*)onclick=\"(?:(?:[^;]+).\s*(this\.innerText\s*=\s*'';\s*)(?:[^;]+).(?:[^;]+).\s*(this\.innerText\s*=\s*'';\s*))[^\>]+./gim, function(str,$1,$2){ return( str.replace($1,'').replace($2,'') ) });
 //clog(_ret);
   _ret = tTRIT.parse_image(_ret);
   
   /*title*/
   cucok = text.match(/<title>(.+)<\/title>/);
 //clog(cucok);

   if(cucok) {
     _tit = cucok[1].replace(/\s*\-\s*Kaskus\s*\-\s*The Largest Indonesian Community/,"").trim();
     // step-two if it's single post
	 //if(_tit.indexOf('- View Single Post -')!=-1){
	 if(gvar.current.isLastPost){
	    _tit = _tit.replace(/^[^(?:P)]+.ost\s*\-\s*/,"").trim();
		cucok = text.match(/name[\'\"]\s*href=[\'\"][^\?]+.u=(\d+)[^\>]+.([^\<]+).\/a>/im);
		if(cucok){
		   gvar.LPOST.id = cucok[1];
		   gvar.LPOST.name = cucok[2];
		}
	 }else{
	    // store pid of TS
		cucok = text.match(/newreply\.php\?do=newreply([^\"\']+)/im);
		if(cucok) cucok = cucok[1].replace(/\&amp;/gi,'&').replace(/\&noquote=1/gi,'').replace(/\&/,'.php?');		
		clog(cucok);
		gvar.TS.pid = (cucok ? LINK.getPID( cucok ) : false);
	 }
	 clog('after');
	 clog('TS.id:'+gvar.TS.id+'; TS.name:'+gvar.TS.name+'; TS.tid:'+gvar.TS.tid+'; TS.pid:'+gvar.TS.pid+'; ');
	 clog('LPOST.id:'+gvar.LPOST.id+'; LPOST.name:'+gvar.LPOST.name+'; LPOST.pid:'+gvar.LPOST.pid+'; ');
   }
   /*newreply*/
   //cucok = text.match(/newreply\.php(?:[^\"]+)/);
   //if(cucok) _nr = cucok[0].replace(/\&amp;/gi,"&");
   return {content:_ret, title:_tit, newreply:(gvar.current.isLastPost ? gvar.LPOST.pid : gvar.TS.pid) };
  }
  // param can be manualy supplied. mode=[0:hideall,1:emote,2:showall]; flag:[link, img];
 ,parse_image: function(text, flag, mode){
   if(isUndefined(flag)) flag = 'link';
   if(isUndefined(mode)) mode= gvar.setting.imgload;
   if(flag=='link'){
     var ori = text;
     if(mode=='0'){
       // no-load all 
	   text = text.replace(/<img\s*src=[\"\']([^\"|\']+).(?:\sborder=.0.)*(?:\salt=..)*\s*title=[\"\']([^\"|\']+)[^>]+./gim, function(str, $1, $2) { return('<a class="imgthumb" href="'+$1+'" title="'+$2+'">'+basename($1)+'</a> '); });
	   gvar.current.cEMOTE = (ori!=text);
     }
     if(mode != '2'){
	  ori = text
      text = text.replace(/<img\s*src=[\"\']([^\"|\']+).(?:\s*border=.0.)(?:\s*alt=..)(?:[\s*\/]+)>/gim, function(str, $1) { return('<a class="imgthumb" href="'+$1+'">'+$1+'</a> '); });
	  gvar.current.cIMG = (ori!=text);
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
 ,getUserId: function(){
    var logusers = $D("//a[contains(@href, 'member.php')]", null, true);
    if(logusers){
      var uid = logusers.href.match(/member\.php\?u=(\d+$)/);
      ret = {id:(uid ? uid[1] : null), name:(logusers ? logusers.innerHTML : null) };
    }
    return (logusers && ret ? ret : false);
  }

}; // end tTRIT


var tPOP = {
  init: function(rets){
    tPOP.loadLayer();
	showhide($D('#hideshow'), true);	
	if(!$D('#hideshow')) return;	
	tPOP.fillLayer(rets);
  } 
 ,loadLayer: function(){
    var Attr = {id:'hideshow',style:'display:none;'};
    var el = createEl('div', Attr, rSRC.getTPL_preview() );
    getTag('body')[0].insertBefore(el, getTag('body')[0].firstChild);
	tPOP.event_Static();
 }
 ,fillLayer: function(rets){
    $D('#preview_content').innerHTML = rets.content;
	if($D('#btn_reply_qr')){
	  $D('#btn_reply_qr').setAttribute('href', 'newreply.php?do=newreply&p='+rets.newreply );
	  Dom.Ev($D('#btn_reply_qr'), 'click', function(){
		tPOP.toggleQuoting(true);
		var uri = gvar.current.newreply;
		//if( tQR.isLoaded() ){
		if( gvar.current.QR_isLoaded ){
		  tQR.fetch(uri);
		}else{
		  tPOP.openQR();
		  tQR.init(uri);
		}
	  });
	}
	if($D('#btn_reply_quote')) $D('#btn_reply_quote').setAttribute('href', 'newreply.php?do=newreply&p='+rets.newreply );
	$D('#prev_title').innerHTML = '<a href="showthread.php?t='+gvar.TS.tid+'" target="_blank" title="Goto Thread - '+(rets.title)+'">'+rets.title+'</a>';
	
	// recalibrate top position only if not in fixed_preview
    $D('#popup_container').style.setProperty('top', (gvar.setting.fixed_preview ? gvar.offsetLayer : ss.getCurrentYPos()+gvar.offsetLayer ) +'px','');
	
	//gvar.LPOST.id poster_userlink
	if($D('#poster_userlink')) {
	  $D('#poster_userlink').innerHTML = '<a onclick="return false" href="member.php?u='+gvar.LPOST.id+'" class="ktp-user_link cyellow"><b>'+gvar.LPOST.name+'</b></a>';
	}	
	//ts_userlink poster_userlink
	tPOP.event_Userlink();
	
	//ts_userlink poster_userlink
	tPOP.event_Additional();
	
	
 }
 ,event_Static: function(){

    // sticky toggle
    Dom.Ev($D("#imgsticky"), 'click', function(){ tPOP.toggleSticky(); });

	// close button
    Dom.Ev($D("#imghideshow"), 'click', function(){ tPOP.closeLayerBox('hideshow'); });	
    // cancel preview
    Dom.Ev($D('#preview_cancel'), 'click', function(){ SimulateMouse($D('#imghideshow'), 'click', true); } );
	
	// #head_layer; #atoggle
    if($D('#head_layer')) Dom.Ev($D('#head_layer'),'dblclick',function(){ tPOP.toggleCollapse(); });
    if($D('#atoggle')) Dom.Ev($D('#atoggle'),'click',function(){ tPOP.toggleCollapse(); });

	// detect window resize to resize textbox and controler wraper
    Dom.Ev(window, 'resize', function() { 
      Dom.g('css_position').innerHTML = rSRC.getCSS_fixed( gvar.setting.fixed_preview );
	});	
	
	// qr_button
	if(gvar.user.id && $D('#qr_button'))
     Dom.Ev($D('#qr_button'), 'click', function(){
      tPOP.openQR();	  
	  tQR.init(gvar.current.newreply+'&noquote=1');
	 });
    
	// #preview_setting
    if($D('#preview_setting')) Dom.Ev($D('#preview_setting'), 'click', function(){
        if($D('#setting_container')) {
         $D('#setting_container').innerHTML = rSRC.getTPL_setting();
    	 tPOP.toggleCollapse();
         $D('#setting_container').style.display='';
		 
		 // #save_settings #cancel_settings
	     if($D('#cancel_settings')) Dom.Ev($D('#cancel_settings'), 'click', function(){ tPOP.toggleCollapse(); });
        }       
    });

  }
 ,event_Userlink: function(){
    var nodes = $D('//a[contains(@class,"ktp-user_link")]');
    if(nodes.snapshotLength > 0){
     for(var i=0, lg=nodes.snapshotLength; i<lg; i++) {
	    node = nodes.snapshotItem(i);
	    Dom.Ev(node, 'click', function(e){
		  var cucok, uid, prev;		  
		  var par, el_img, el, Attr, sp_1, sp_par, dumy_el_img;
	      e=e.target||e;
		  if(e.nodeName!='A') e = e.parentNode;
		  if(e.href){
		    cucok = e.href.match(/\?u=(\d+)/);
			uid = (cucok ? cucok[1]:false);
			if($D('#img_ngaskuser')){
		      prev = $D('#img_ngaskuser').getAttribute('rel');
		 	  if(prev == uid) {
			    if($D('#post_detail')){
			     $D('#post_detail').innerHTML = '';
				 $D('#post_detail').style.setProperty('display','none','');
				 return;
				}
			  }
		    }
			var loaduser = function(uid){
			   
			   par = createEl('div', {});
			   Attr = {id:'dumy_img_ngaskuser',border:'0',src:gvar.ngaskus+'kaskus.php?u='+uid,style:"display:none;"};
			   dumy_el_img = createEl('img', Attr);			   
			   
			   Attr = {id:'img_ngaskuser',border:'0', style:"display:none;",rel:uid};
			   el_img = createEl('div', Attr);
			   sp_par = createEl('span', {id:'powby','class':'powby',style:'visibility:hidden;'}, '&copy;&#183;');
			   sp_1 = createEl('span', {'class':'b'}, 'ngas'); Dom.add(sp_1, sp_par);
			   sp_1 = createEl('span', {'class':'or'}, 'kus'); Dom.add(sp_1, sp_par);
			   sp_1 = createTextEl('.us'); Dom.add(sp_1, sp_par);
			   Dom.add(sp_par, el_img);
			   Dom.add(el_img, par);			   
			   
			   if($D('#post_detail')){
			     $D('#post_detail').innerHTML = '';
				 Dom.add(par, $D('#post_detail'));
				 $D('#post_detail').innerHTML+=''
				  +"\n\n"+'<style type="text/css">'
				  +'#img_ngaskuser{background:transparent url("'+gvar.ngaskus+'kaskus.php?u='+uid+'") no-repeat 0 0;}'
				  +'</style>';
			   }
			};
		    loaduser(uid);
			if($D('#post_detail')) {
			  $D('#post_detail').style.setProperty('display','block','');
			  $D('#post_detail').innerHTML+= '<span id="wait_userlink">'+_LOADING+'</span>';
			}
	        gvar.sITryLoadCard = window.setInterval(function() {
              var img = dumy_el_img;
		      if(img && img.height || img.width){
	            clearInterval(gvar.sITryLoadCard);
		        if($D('#img_ngaskuser')) $D('#img_ngaskuser').style.display = 'block';
		        if($D('#powby')) $D('#powby').style.visibility = 'visible';
				if($D('#wait_userlink')) Dom.remove($D('#wait_userlink'));
				dumy_el_img = null;
	        	return;
	          }
            }, 150);
			
		  }
	    });
	 }
    }

  }
 ,event_Additional: function(){
    // additional events 
    // #show_images #show_emotes #open_spoilers
    if(gvar.current.cEMOTE && $D('#show_emotes')){
      Dom.Ev($D('#show_emotes'), 'click', function(e){
        e=e.target||e;
    	var _ret = parse_image(gvar.current.content, 'img', 1);
    	$D('#preview_content').innerHTML = gvar.current.content = _ret;
    	Dom.remove(e);
      });
      $D('#show_emotes').style.setProperty('display','inline','important');
    }
    if(gvar.current.cIMG && $D('#show_images')){
        Dom.Ev($D('#show_images'), 'click', function(e){
           e=e.target||e;
           var _ret = parse_image(gvar.current.content, 'img', 2);
           $D('#preview_content').innerHTML = gvar.current.content = _ret;
    	   Dom.remove(e);
        });
        $D('#show_images').style.setProperty('display','inline','important');
    }
    // re-evaluate for spoiler button 
    var nodes = $D('//input[@type="button" and @value and @onclick]', $D('#preview_content'));
    gvar.current.cSPL = (nodes.snapshotLength > 0);
    if( gvar.current.cSPL ){
       if($D('#open_spoilers')){
        Dom.Ev($D('#open_spoilers'), 'click', function(e){
    	  e = e.target||e;
    	  var inode, show = (e.value.indexOf("Show")!=-1);
    	  inode = getTag('input');
    	  if(inode.length > 0)
    	    for(var i=0; i<inode.length; i++){
    	      if(show && inode[i].value=="Show") {
    			  inode[i].click();
    			  inode[i].value = "Hide";					
    		  }else if(inode[i].value=="Hide") {
    			  inode[i].click();
    			  inode[i].value = "Show";
    		  }				  
    	    }
    	  e.blur();
    	  e.value = (show ? 'Hide':'Show')+' Spoilers';
    	  inode = $D('//div[@id="preview_content"]', null, true);
    	  if(inode)
    	    gvar.current.content= inode.innerHTML;
    	  else
    	    gvar.current.content= $D('#preview_content').innerHTML;
    	});
       }
       $D('#open_spoilers').style.setProperty('display','inline','important');
    }
    //if( !gvar.current.is_singlepost || gvar.current.cEMOTE || gvar.current.cIMG || gvar.current.cSPL )
    if( !gvar.current.is_singlepost ) {
	  if( gvar.current.cEMOTE || gvar.current.cIMG || gvar.current.cSPL )
        $D('#thread_separator').style.setProperty('display','','');
	  
	  clog(gvar.LPOST.pid)
	  clog($D('#remotePID_'+gvar.LPOST.pid).getAttribute('rel'));
	  if( $D('#last_post') && $D('#remotePID_'+gvar.LPOST.pid) )
        Dom.Ev($D('#last_post'), 'click', function(){ SimulateMouse($D('#remotePID_'+gvar.LPOST.pid), 'click', true); });		
	}
 
  } // end addition events
 
 ,openQR: function(isFetching){
    $D('#qr_container_head').style.display='';
	$D('#collapseobj_quickreply').style.display='';
	
	// change from fixed to absolute is a must..!!
	tPOP.toggleSticky(false, 'quickreply');
	Dom.remove($D("#imgsticky"));
	
	// moving link to #button_preview
	if($D('#button_preview')){
	  if($D('#preview_cancel')){ Dom.add($D('#preview_cancel'), $D('#button_preview')); removeClass('cyellow', $D('#preview_cancel')); }
	  if($D('#preview_setting')){ Dom.add($D('#preview_setting'), $D('#button_preview')); removeClass('cyellow', $D('#preview_setting')); }
	}
	
	if($D('#tr_qr_button')) Dom.remove('tr_qr_button');
	if($D('#qr_container'))
	   $D('#qr_container').innerHTML = '<div id="preview_loading">'+_LOADING+'</div>';
  }
 ,toggleQuoting: function(isFetching){
    if(isUndefined(isFetching)) isFetching = false;
     if($D('#quote_loading')) $D('#quote_loading').style.display=(isFetching ? '' : 'none');
	 if($D('#btn_reply_qr')) $D('#btn_reply_qr').style.display=(isFetching ? 'none' : '');

 }
 ,toggleSticky: function(flag, caller){
    var obj= $D('#popup_container');
    // flag ? doFixed :doAbs
    if(isUndefined(flag))
      flag = (gvar.setting.fixed_preview === false);
    Dom.g('css_position').innerHTML = rSRC.getCSS_fixed(flag);
    var yNow = parseInt(ss.getCurrentYPos());
    
    var newOfset = (yNow==0 ? gvar.offsetLayer : yNow+( ($D('#preview_content').clientHeight+$D('#qr_container').clientHeight) > (parseInt(getScreenHeight())-gvar.offsetMaxHeight-gvar.offsetLayer) ? 0 : gvar.offsetLayer) );
    var vnewtop = (flag ? gvar.offsetLayer : newOfset);
    obj.style.setProperty('top', vnewtop+'px', '');
    if($D("#imgsticky"))
      $D("#imgsticky").src = (flag ? gvar.B.sticky1_png : gvar.B.sticky2_png );
    
    if( isUndefined(caller) ){  // dont save the state when caller is define | asumed from quickreply
      setValue(KEY_KTP+'FIXED_PREVIEW', (flag ? '1' : '0') );
    }
    gvar.setting.fixed_preview = (flag);
  }
 ,toggleCollapse: function(){
    var el, show, tohide = ['vbform','thread_tools','threadpost_navi','thread_separator','tbl_separator'];
    show = ($D('#row_content').style.display!='none');
    $D('#row_content').style.display = (show ? 'none' : '');
    for(var i=0; i<tohide.length; i++){
       if(!isString(tohide[i])) continue;
       el = Dom.g( tohide[i] );
       if(el) el.style.display = (show ? 'none' : '');
    }

	if( gvar.current.isLastPost && !gvar.current.cEMOTE && !gvar.current.cIMG && !gvar.current.cSPL )
	  if($D('#thread_separator')) $D('#thread_separator').style.display='none';

    if($D('#qr_container_head').style.display!='none') Dom.g('button_preview').style.display = (show ? 'none' : '');
	var img = $D('#collapseimg_quickreply');
	if(img){
	  var src = img.getAttribute('src');
	  img.setAttribute('src', (src && show ? src.replace('.gif','_collapsed') : src.replace('_collapsed.gif','') ) + '.gif' );
	}
	if(!show && $D('#setting_container') && $D('#setting_container').style.display!='none'){
	  $D('#setting_container').innerHTML = '';
	  $D('#setting_container').style.display='none';
	}
  }

 ,closeLayerBox: function(tgt){
	if(gvar.current.cRow){
	  var lastRow = gvar.current.cRow;
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
	//restore the meta refresh
	var head = getTag('head');
	if( isDefined(head[0]) && gvar.meta_refresh ){
	  Dom.add(gvar.meta_refresh, head[0]);
	}
	Dom.remove( Dom.g(tgt) );
  }
}; // end tPOP


var tQR = {
  init: function(fetch_uri){
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
            var validate= ( !gvar.user.isDonatur  ? tQR.prepost_QR() : true );
			if(validate){
			   tQR.lockInput(true);
			   tQR.post();
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
    
    tQR.fetch(fetch_uri);
  }

 ,isLoaded: function(){
    return ($D('#loggedin_as') && $D('#loggedin_as').innerHTML!='');
  }
 ,event_TPL_vB: function(){
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
 ,fetch: function(pid){
    // colecting necessary hidden value
    getFetch(gvar.domain+'newreply.php?do=newreply&p='+pid, tQR.fetch_cb, true);
  }
 ,fetch_cb: function(reply_html){
	if( !reply_html ) return;
	reply_html = reply_html.responseText;
	tPOP.toggleQuoting(false);
	
	if( !gvar.current.QR_isLoaded ){
	  $D('#qr_container').innerHTML = rSRC.getTPL_qr();	
	  tQR.event_TPL_vB();
	  $D('#loggedin_as').innerHTML = '&nbsp;'
	   +HtmlUnicodeDecode('&#8592;')+'&nbsp;[<small>Logged in as</small>&nbsp;<a class="cyellow" href="./member.php?u='+gvar.user.id+'">'
	   +gvar.user.name+'</a>'+(gvar.user.isDonatur ? ' <b class="cred">$</b>':'')+']';
	  $D('#button_preview').style.display = '';
	  gvar.current.QR_isLoaded = 1;
	}
	if(gvar.user.isDonatur){
	    // kill capcay container
	    Dom.remove('recapctha_header');
	    Dom.remove('recaptcha_cont');
	}else{
	    // click to build recapctha & keep click to reload
        SimulateMouse($D('#hidrecap_btn'), 'click', true);
	}
	// parse response then fill hidden values
	gvar.current.qr_fetch = tQR.parse_fetch(reply_html);
	vB_textarea.init();
	vB_textarea.add(gvar.current.qr_fetch);
	var snapTo = function(){
      //vB_textarea.init();
	  if(gvar.current.qr_fetch === null){
	    var notice = $D('#quoted_notice');
		addClass('g_notice-error', notice);
	    notice.innerHTML = 'Fetch failed, server might be busy.'; // <a href="javascript:;" id="quote_now">Try again</a>
	    notice.setAttribute('style','display:block;');
	  }else{
	    //vB_textarea.add(gvar.current.qr_fetch);
	  }	  
	};
	ss.STEPS = 10; // scroll speed; smaller is faster
    ss.smoothScroll( Dom.g(gvar.id_textarea), function(){ snapTo() } );
  }
  
 ,unescapeHtml: function(text){
    // clean-up fetched post
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
 ,parse_fetch: function(text){
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
	  if( cucok = text.match(re) )
	     if( Dom.g(hid) ) Dom.g(hid).value = cucok[1];
    } // end for   
    // isDonatur check
    gvar.user.isDonatur = (text.indexOf('recaptcha_response_field')==-1);
    
	// get textarea
    // this regexp failed on symbolize userid : http://bit.ly/9A9GMg
    //match = /<textarea\sname=\"message\"(?:[^>]+.)([^<]+)*</i.exec(text);    
    var parts, pos;   
    // back to stone-age method :hammer:
    if(text.indexOf(gvar.id_textarea)==-1) return null;
    pos = [ text.indexOf(gvar.id_textarea), text.lastIndexOf('</textarea') ];
    parts = text.substring(pos[0], pos[1]);
    pos[0] = parts.indexOf('>');
    parts = parts.substring( (pos[0]+1), parts.length);
    return (parts ? tQR.unescapeHtml(parts) : '');   
  }
  
 ,prepost_QR: function(){
    var ret, rrf = $D('#recaptcha_response_field');
    if(!rrf) return;
    ret = (!rrf || (rrf && rrf.value.trim()=='') ? false : true );
    if( !ret ){
      alert('Belum Mengisi capcay...');
      window.setTimeout(function() { $D('#recaptcha_response_field').focus();}, 200)	 
    }
    return ret;
  }
 ,lockInput: function(flaglock){
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
    } else {
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
  }
 ,buildQuery: function(){
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
 ,post: function(){
    var spost = tQR.buildQuery();
	if(spost===false) {
      //SimulateMouse($D('#imghideshow'), 'click', true);
      return false;
    }	
	GM_XHR.uri = gvar.curThread.action;
    GM_XHR.cached = true;
    GM_XHR.request(spost.toString(),'post', post_cb);
 }
 ,post_cb: function(reply_html){
    if( !reply_html ) return;
	reply_html = reply_html.responseText;
	
 clog(reply_html);
	var retpost = callback_post(reply_html);
 clog('error='+retpost.error+ '; msg='+retpost.msg);
	
	var notice = $D('#quoted_notice');
	if(retpost.error != 0){
	   addClass('g_notice-error', notice);
	   notice.innerHTML = retpost.msg;
	   notice.setAttribute('style','display:block;');
	   tQR.lockInput(false); // reopen the hive :D
	   // reload capcay
	   SimulateMouse($D('#hidrecap_reload_btn'), 'click', true);
       return;
    }else{
	   var msg = 'Thank you for posting!';
	   Dom.remove( $D('#preview_submit') );
	   if(gvar.setting.then_goto_thread && isDefined(retpost.redirect) ){
	     msg+= ' Redirecting...';
		 tQR.after_post('redirect', function(){ location.href=retpost.redirect; });
	   }else{
	     msg+= ' Closing...';
		 tQR.after_post('close', function(){ tPOP.closeLayerBox('hideshow'); });
	   }
	   $D('#qr_container').innerHTML = '<div id="quoted_notice" class="g_notice" style="display:block;">'+msg+'</div>';
	}

  }
 ,parse_post: function(text){
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
  }
 ,after_post: function(){
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

}; // end tQR


// ========
// common function

function getFetch(u, cb, cache){
  if(isUndefined(u)) return;
  cache = (isUndefined(cache) ? true : cache);
  // prep xhr request
  GM_XHR.uri = u; GM_XHR.cached = cache;
  GM_XHR.request(null, 'GET', cb);
}
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


// end-common function

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
function getScreenHeight(){
  var y = 0;
  if (self.innerHeight){ // FF; Opera; Chrome
     y = self.innerHeight;
  } else if (document.documentElement && document.documentElement.clientHeight){ 
     y = document.documentElement.clientHeight;
  } else if (document.body){
     y = document.body.clientHeight;
  }
  return y;
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
var GM_addGlobalScript=function(script, id, tobody) { // Redefine GM_addGlobalScript with a better routine
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
var GM_addGlobalStyle=function(css, id, tobody) { // Redefine GM_addGlobalStyle with a better routine 
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
var $D=function (q, root, single) {
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
var GM_XHR = {
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
var ss = {
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
var vB_textarea = {
  init: function(id) {
    this.Obj = (isUndefined(id) ? Dom.g(gvar.id_textarea) : Dom.g(id));
    this.content = (this.Obj ? this.Obj.value : "");
    this.cursorPos = this.rearmPos(); // [start, end]
    //this.last_scrollTop = this.Obj.scrollTop; // last scrolltop pos
  },
  rearmPos: function(){ return [this.getCaretPos(), this.Obj.selectionEnd]; },
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
  },
  add: function(text){ // used on fetch post only
   this.Obj.value+=text; this.enabled(); this.focus();
   // fix chrome weird
   var lastpos=(this.cursorPos[0] + text.length);
   this.setCaretPos( lastpos, lastpos );
  },
  getCaretPos : function() {
    this.enabled(); /* this.focus();*/
    var CaretPos = 0;    
    if(this.Obj) //Mozilla/Firefox/Netscape 7+ support 
      if (this.Obj.selectionStart || this.Obj.selectionStart == '0')
        CaretPos = this.Obj.selectionStart;
    return CaretPos;
  },  
  setCaretPos : function (pos,end){
    if(isUndefined(end)) end = pos;
    if(this.Obj.setSelectionRange)    { // Firefox, Opera and Safari
        this.focus();
        this.Obj.setSelectionRange(pos,end);
    }
  },
};
//== end Global Var ==

// main Object



var rSRC = {
 getSetOf: function(type){
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
,getCSS: function(){
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
    +'#button_preview{margin:2px 0;padding:3px 8px 3px 3px;text-align:center;}'
    +'.spacer{height:5px;}'
    +'.spc1{height:1px;}'
    +'a.cyellow{color:#F0F000!important;}'
    +'.cred{color:#FF0000!important;}'
    +'.qrsmallfont, .qrsmallfont div, .g_notice{font-size:11px;}'
    +'.selected_row td{background-color:#D5FFD5!important;}'
    +'#thread_tools input{margin-left:5px;display:none;}'
    //+'#preview_content div table{width:auto;}'
    +'#post_detail{border:0; border-bottom:1px solid #8B8B8B;padding-bottom:5px;margin-bottom:5px;display:none;}'
    +'.g_notice{display:none;padding:.4em;margin-bottom:3px;background:#DFC;border:1px solid #CDA;line-height:16px;}'
    +'.g_notice-error{background:#FFD7FF!important;}'
    +'.hd_layer{background-color:transparent;-moz-user-select:none;-webkit-user-select:none;}'
    +'.hd_layer-right{float:right; margin-right:5px;}'
    +'.hd_layer-left{float:left; margin-left:5px;}'
	+'.qr_button_cont{width:100%; text-align:center;}'
	+'#qr_button{margin-right:-40px;}'
	+'#preview_cancel,#preview_setting{margin:2px 0 0 5px;font-size:13px;}'
    +'#collapseimg_quickreply{border:0;}'
    +'#atoggle{outline:none;}'

/* ==settings== */ 
    +'a.lilbutton{padding:1px 5px; 2px 5px!important;text-shadow:none;}'
    +'a.lilbutton.twbtn-primary{color:#F0F000;}a.lilbutton.twbtn-primary:hover{color:#fff;}'
	


/* ==ktp popup== */ 
    +'#img_ngaskuser{height:120px;}'
    +'#post_detail .powby{color:#363636;position:absolute;cursor:default;margin:88px 0 0 353px;font-size:10px;-moz-user-select:none;-webkit-user-select:none;}'
    +'#post_detail .powby .b,#post_detail .powby .or{font-weight:bold;}'
    +'#post_detail .powby .b{color:#0000CE;}#post_detail .powby .or{color:#DD6F00;}'

/* ==preview popup== */ 
  	+'#hideshow {position:absolute;min-width:100%;top:0;left:0;}'
  	+'#preview_content {overflow:auto;height:auto;padding-right:5px;}'
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
    +'*html #popup_container{'
    +  'position: absolute;'
    +  'top:expression(eval(document.compatMode && document.compatMode==\'CSS1Compat\') ? documentElement.scrollTop'
    +  '+((documentElement.clientHeight-this.clientHeight)/2) : document.body.scrollTop'
    +  '+((document.body.clientHeight-this.clientHeight)/2));'
    +  'left:expression(eval(document.compatMode && document.compatMode==\'CSS1Compat\') ? documentElement.scrollLeft'
    +  '+(document.body.clientWidth /2 ) : document.body.scrollLeft + (document.body.offsetWidth/2));'
    +'}'
	/* twitter's button */
    
    +'.twbtn{background:#ddd url("'+gvar.B.twbutton_gif+'") repeat-x 0 0;font:11px/14px "Lucida Grande",sans-serif;width:auto;margin:0;overflow:visible;padding:0;border-width:1px;border-style:solid;border-color:#999;border-bottom-color:#888;-moz-border-radius:4px;-khtml-border-radius:4px;-webkit-border-radius:4px;border-radius:4px;color:#333;text-shadow:1px 1px 0 #B1B1B1;cursor:pointer;} .twbtn::-moz-focus-inner{padding:0;border:0;}.twbtn:hover,.twbtn:focus,button.twbtn:hover,button.twbtn:focus{border-color:#999 #999 #888;background-position:0 -6px;color:#000;text-decoration:none;} .twbtn-m{background-position:0 -200px;font-size:12px;font-weight:bold;line-height:10px!important;padding:5px 8px; -moz-border-radius:5px;-khtml-border-radius:5px;-webkit-border-radius:5px;border-radius:5px;margin:-4px 0 -3px 0;} a.twbtn{text-decoration:none;} .twbtn-primary{border-color:#3B3B3B;font-weight:bold;color:#F0F000;background:#21759B;} .twbtn:active,.twbtn:focus,button.twbtn:active{background-image:none!important;text-shadow:none!important;outline:none!important;}.twbtn-disabled{opacity:.6;filter:alpha(opacity=60);background-image:none;cursor:default!important;}'
	/* thumb image */
	+'.imgthumb:hover {background-color:#80FF80 !important;}'
	+'.imgthumb {line-height:20px;font-size:11px;padding:2px;padding-left:28px;background:#DDFFDD url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAUCAIAAAD3FQHqAAAABnRSTlMAAAAAAABupgeRAAAACXBIWXMAAAsTAAALEwEAmpwYAAADHUlEQVR42qWUW28bVRDH/7M+Xu+uL3VcJzGlkYAWmVZKZKkS5fLQJ5CQ+gnyGSueIvFAJSoI9KFKWglQSFpCoMjxJb6u1157d2Z4WKd2kpdWnPNw5vzn6HdmRnMOPfr20dbWFv732NnZMbVarbJWUdWr7qvisvLGVlVjTLVaNQCY+fsnvwz9MVHig6qqqojI+SLJ0HNjSbn9wfvffPUAgEnYx6/bJ/41iyiVUicTsegosKLYYhYWi0ViJpZkS8wLIxYh/JtA5ixjUoWsk0nrZjXYvO2xyN7B6MUf2VkEYWURFmUWFmURXlJENGX5F1mWlXXSldXxl7X19ZX70Djv7Xb7QbPjJZkwK4uKzHEii23KCi6wLAuunS7k4GUKBAMynpMr5ifB2BZRUT0vkLLI4PVeprCRyl2PWZgV0AVLVS1C1kmHYe60c2IbVxCfnjWiqJj3FixVFdFu/dCQtA8fv7f5MOsWAFhKRLQUF5Hn2oD9+0ur1TlURatTNpaXc1VUVZGwJsGwfvR07cN7k8DvnzyrfvoQgBlZl1iadWwQSEtnnRUFCMi5UMz7QxUx8/6T7/xh/+7q2p/AxG+XCi6AcHKJBXiOudiXi6mKKOLjg71W/S8ABjGAGxsfFbIZAFGKLMta1Kt51vu78xtAy12dhDOdRWEYxdHEb/6aya4BePbzY2Pn+mH+hx+fA7i1OiUiIprHEoZhN+zjTeMDzDKL4uksTt6KcDyaOZPAB9QYN2YzabXzRSIiub6Uo6oGQdDszpLCMAuzyNUXagqWa48G7TgY5ovrzdN/Op3WSvkmywoRQXXOGg79eiN6m/+A7DzEOmvVb94oG2LXIyeTbjQbjUZjnuMsigaDwTt8MZT5+kHts3t3p9PpYDDY3f3p6OilAUBEpLGDd2IhDEfhJOz3+91u1806dz65Q6+OX5VL5aHvC0tSQiICgUBLRqJe8D1/sTceTTrdjkmnPr//xf7+vhmPx/G12PPc8/soWS7HQZelXq/X7/XXK5Xqx9VSqbS9vT0/cXB4YKdtFn7LFEVkHAQrxZLjOHEcb2xsAPgPkT44D3rdTkkAAAAASUVORK5CYII=) no-repeat !important; color:#000 !important;}'
  );
 } 
,getCSS_fixed: function(fixed){
  return (''
   +'#popup_container{' + (fixed ? 'position:fixed;top:'+gvar.offsetLayer+'px;':'position:absolute;') + '}'
   +'#preview_content {overflow:auto;height:auto; max-height:'+(parseInt(getScreenHeight()) - gvar.offsetMaxHeight - gvar.offsetLayer)+'px; }'
   +'#preview_content div table{max-width:95%;overflow:auto;}'
  );
 }
,getSCRIPT: function(){
  return (''
   +'function showRecaptcha(element){'
   + 'Recaptcha.create("6Lf8xr4SAAAAAJXAapvPgaisNRSGS5uDJzs73BqU",element,'
   +  '{theme:"red",lang:"en"'
   +    ',custom_translations:{refresh_btn:"Reload reCapcay :: [Alt+R]",instructions_visual:"Masukkan reCapcay:"}'
   +  '}'
   + ');'
   +'};'
  );  
 }
// tPL
,getTPL_preview: function(){
  return (''
 +'<div id="popup_container" class="popup_block"> '
 + '<div class="popup" id="popup_child">'
 +  '<a tabindex="209" href="javascript:;"><img id="imghideshow" title="Close" class="cntrl" src="'+gvar.B.closepreview_png+'"/></a>'
 +  '<a tabindex="208" href="javascript:;"><img id="imgsticky" title="Toggle Fixed View" class="sticky" src="'+(gvar.setting.fixed_preview ? gvar.B.sticky1_png : gvar.B.sticky2_png)+'"/></a>'
 +  '<table class="tborder" align="center" border="0" cellpadding="6" cellspacing="1" width="100%">'
 +  '<tbody><tr>'
 +   '<td class="tcat" id="head_layer" style="cursor:s-resize;">'
 
 +     '<div class="hd_layer"><span id="prev_title"></span>&nbsp;' +HtmlUnicodeDecode('&#8592;') 
 + (gvar.TS.id ? '[<small>TS :: </small><a id="ts_userlink" onclick="return false" href="member.php?u='+gvar.TS.id+'" title="Thread starter by '+gvar.TS.name+'" class="ktp-user_link cyellow" ><b>'+gvar.TS.name+'</b></a>]' : '')
 
 // 
 + (gvar.current.isLastPost ? ' - [<small><a href="showthread.php?p='+gvar.LPOST.pid+'#post'+gvar.LPOST.pid+'" target="_blank" title="View Single Post">Single Post</a> :: </small><span id="poster_userlink" class="cyellow"><b>'+gvar.LPOST.name+'</b></span>]' : '')
 
 +     '<a id="atoggle" href="javascript:;" class="hd_layer-right"><img id="collapseimg_quickreply" src="'+gvar.domainstatic+'images/buttons/collapse_tcat.gif" alt="" /></a>'
 +     '<span id="ktp_version" class="hd_layer-right" style=""><a href="javascript:;" title="Home '+gvar.codename+' - '+gvar.sversion+'">'+gvar.sversion+'</a></span>'
 +    '</div>' // #head_layer 

 +   '</td>'
 +  '</tr><tr id="row_content">'
 +  '<td class="alt1">'

 +   '<div id="post_detail"></div>' // kaskus badge | user detail
 +   '<div id="preview_content"></div>' // main post-content
 + (gvar.user.id ? ''
 +   '<div id="container_reply" style="text-align:right;padding:3px 15px 0 0;margin:5px 0 -6px 0;border-top:1px solid #DBDBDB;">'
 +    '<a id="btn_reply_qr" onclick="return false" href="javascript:;" target="_blank" style="margin-right:5px;">'
 +     '<img src="'+gvar.domainstatic+'images/buttons/quickreply.gif" alt="Quick-Reply" title="Quick Reply this message" border="0"/></a>'
 +    '<span id="quote_loading" style="margin-right:5px;display:none;">'+_LOADING+'</span>'
 +    '<a id="btn_reply_quote" href="javascript:;" target="_blank">'
 +     '<img src="'+gvar.domainstatic+'images/buttons/quote.gif" alt="Quote" title="Reply With Quote" border="0"/></a>'
 +   '</div>' : '') // #container_reply

 +  '</td></tr>'
 +  '<tbody></table>'

 +  '<div id="tbl_separator" class="spacer"></div>'

 +( !gvar.current.isLastPost ? ''
 +  '<div id="threadpost_navi" style="float:right;">'
 +    '<input type="button" id="last_post" class="twbtn twbtn-m" value="Show Last Post" style="margin-right:5px;" />' 
 +  '</div>' 
 : '')
 +  '<div id="thread_tools" style="float:left;">'
 +    '<input type="button" id="open_spoilers" class="twbtn twbtn-m" value="Show Spoilers" style="margin-right:10px;" />' 
 +    '<input type="button" id="show_emotes" class="twbtn twbtn-m" value="Show Emotes" style="" />'
 +    '<input type="button" id="show_images" class="twbtn twbtn-m" value="Show All Images" style="" />'
 +  '</div>'
 +  '<div id="thread_separator" style="height:25px; display:'+(gvar.current.isLastPost?'none':'')+';"></div>'

 // quick-reply form
 +(gvar.user.id ? '<form action="'+gvar.current.action+'" method="post" name="vbform" id="vbform" style="display:;">' : '')
 +   '<div style="display:none;">'
 +    '<input type="submit" name="real_submit" value="Submit Post"/>'
 +   '</div>'
 +  '<table id="qr_container_table" class="tborder" align="center" border="0" cellpadding="6" cellspacing="1" width="100%">'
 +  '<thead id="qr_container_head" style="display:none;"><tr>'
 +   '<td class="tcat">'
 +    'Quick Reply<span id="loggedin_as"></span>'
 +    '<span id="ktp_version" class="hd_layer-right" style="">'+gvar.codename+'</span>'
 +   '</td>'
 +  '</tr></thead>'
 +  '<tbody id="collapseobj_quickreply" style="display:none;">'
 +   '<tr><td class="panelsurround">'
 +    '<div class="panel">'
 +    '<div id="qr_container">'

 +      '<div>'+_LOADING+'</div>' // this will be injected w/ getTPL_QuickReply()

 +    '</div>' // #qr_container 
 +    '</div>' // .panel 
 +  '</td></tr><tbody>'
 
 +  '<tfoot id="tr_qr_button">' // this node will killed once qr pressed 
 +  '<tr><td class="tcat">' 
 +    '<a tabindex="206" id="preview_cancel" href="javascript:;" class="cyellow hd_layer-left" style=""><b>Cancel</b></a>'
 + (gvar.user.id ? ''
 +    '<a tabindex="207" id="preview_setting" href="javascript:;" class="cyellow hd_layer-right" style=""><b>Setting</b></a>'
 +    '<div id="qr_button_cont" class="qr_button_cont">'
 +     '<input type="button" id="qr_button" class="twbtn twbtn-m" value="Quick Reply" style="width:300px;" />'
 +    '</div>' : '')
 +  '</td></tr>'
 +  '</tfoot>' 
 +'</table>'

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
 +    '<span><input tabindex="205" id="preview_submit" type="button" class="twbtn twbtn-m twbtn-primary" value=" Post " />&nbsp;'
 +    '<label for="then_gotothread"><input type="checkbox" id="then_gotothread" value="1"'+(gvar.setting.then_goto_thread ? ' checked="checked"':'')+' /><small style="font-weight:bold;">Then Goto Thread</small></label></span>'
 +   '</div>' // #button_preview
 +(gvar.user.id ? '</form>' : '')
 
 + '<div id="setting_container" style="position:absolute;right:1%;min-width:450px;border:2px outset;background:#F5F5FF;margin-top:1px;display:none;">'
 //+ rSRC.getTPL_setting()
 + '</div>' // #setting_container 
 
 + '</div>' // #popup_child
 +'</div>' // #popup_container
 );
}
,getTPL_setting: function(){
 var spacer = '<div class="spc1" style=""></div>';
 return (''
 + '<table id="tbl_setting" cellpadding="0" cellspacing="0" border="0" style="">'
 + '<tr><td colspan="2" align="center">'
 +  '<div class="g_notice" style="display:inline-block;padding-top:5px;height:20px;width:450px;">'
 +   '<div style="float:left;margin-left:20px;"><strong>Thread Preview Settings</strong></div>'
 +   '<div style="float:right;margin-right:10px;">'
 +     '<a id="save_settings" href="javascript:;" class="twbtn twbtn-m twbtn-primary lilbutton" style="">save</a>&nbsp;&nbsp;'
 +     '<a id="cancel_settings" href="javascript:;">cancel</a></div>'
 +  '</div>'
 + '</td></tr><tr>'
 + '<td id="td_setting_control" valign="top" style="padding-left:5px;">'
 +  '<div style="padding:1px 0 3px 25px;"><b>::QR::</b></div>'
 +  '<input id="misc_autolayout_sigi" type="checkbox" /> AutoSignature&nbsp;'
 +  '<small><a id="edit_sigi" class="twbtn twbtn-m lilbutton" href="javascript:;">edit</a>&nbsp;&nbsp;<a id="edit_sigi_cancel" href="javascript:;" class="cancel_layout cancel_layout-invi">X</a></small><br />'
 +  '<div id="edit_sigi_Editor" style="display:none;"></div>'
 +spacer
 +  '<input id="misc_autolayout_tpl" type="checkbox" /> AutoLayout&nbsp;'
 +  '<small><a id="edit_tpl" class="twbtn twbtn-m lilbutton" href="javascript:;">edit</a>&nbsp;&nbsp;<a id="edit_tpl_cancel" href="javascript:;" class="cancel_layout cancel_layout-invi">X</a></small><br />'
 +  '<div id="edit_tpl_Editor" style="display:none;"></div>'
 +spacer
 +  '<input id="misc_autoshow_smile" type="checkbox" /> AutoLoad Smiley<br />'
 +  '<small style="margin-left:20px;">'
 +   '<label for="misc_autoshow_smile_kecil"><input id="misc_autoshow_smile_kecil" type="radio" value="kecil" />kecil</label>&nbsp;'
 +   '<label for="misc_autoshow_smile_besar"><input id="misc_autoshow_smile_besar" type="radio" value="besar" />besar</label>&nbsp;'
 +   '<label for="misc_autoshow_smile_custom"><input id="misc_autoshow_smile_custom" type="radio" value="custom" />[+]</label>'
 +  '</small>'
 +spacer
   
 + '</td>'
 
 + '<td width="220" style="border-left:1px solid #000; padding-left:5px;" valign="top">'
 +  '<div style="padding:1px 0 3px 25px;"><b>::General::</b></div>'
 //gvar.noCrossDomain
 +  '<label for="misc_updates" title="Check Userscripts.org for QR latest update"><input id="misc_updates" type="checkbox" /> Updates</label>&nbsp;&nbsp;<small><a id="chk_upd_now" class="twbtn twbtn-m lilbutton" href="javascript:;" title="Check Update Now">check now</a></small>'
 +spacer
 +  '<small style="margin-left:20px;" title="Interval check update, 0 &lt; interval &lt;= 99">Interval:&nbsp;<input id="misc_updates_interval" type="text" value="1" maxlength="5" style="width:40px; padding:0pt; margin-top:2px;"/>&nbsp;days</small>'
 +spacer
 
 +  '<input id="misc_autoload_qr" type="checkbox" /> AutoLoad QR<br />'
 +  '<input id="misc_autoshow_spoiler" type="checkbox" /> AutoShow Spoiler<br />'
 +  '<input id="misc_showimages" type="checkbox" /> Show Images<br />'
 +  '<small style="margin-left:20px;">'
 +   '<label for="misc_showimages_external"><input id="misc_showimages_external" type="checkbox" /> External</label>' + '&nbsp;&nbsp;'
 +   '<label for="misc_showimages_emotes"><input id="misc_showimages_emotes" type="checkbox" /> Emotes-Only</label>'
 +  '</small>'
 +spacer
 +  '<input id="misc_scrollto_lastrow" type="checkbox" /> Scroll to Last Opened Row<br />'
 +  '<input id="misc_reload_afterpost" type="checkbox" /> Reload after Posting<br />'
 +spacer
 + ''

 
 + '</td></tr>'
 + '</table>'
 + '<div class="spacer"></div>'
 );
}
,getTPL_qr: function(){
 return (''
 +'<div id="quoted_notice" class="g_notice"></div>' // Quoted notice
 +'<table cellpadding="0" cellspacing="0"><tr>'
 + '<td><div class="qrsmallfont">'
 + '<div style="float:left;">Title:&nbsp;<a href="javascript:;" id="atitle" title="Optional Title Message">[+]</a>&nbsp;</div><div id="titlecont" style="display:none;"><div id="dtitle" style="float:left;margin-top:-3px;""><input id="input_title" type="text" tabindex="1" name="title" class="input_title" title="Optional"/></div>&nbsp;<div class="spacer">&nbsp;</div></div>'
 +'Message:&nbsp;<a id="textarea_clear" href="javascript:;" title="Clear Editor">reset</a>'
 + '</div></td>'
 + '<td id="recapctha_header" valign="bottom">reCAPTCHA&nbsp;&nbsp;</td>'
 + '</tr><tr>'
 
 // vB_Editor_QR_textarea
 +  '<td class="txta_cont panelsurrounds">'
 
 +   '<div class="panel"><div>'
 +   rSRC.getTPL_vbEditor()
 +   '</div></div>'
 
 // Setting container will be containing from rSRC.getTPL_setting()
 //+'<div id="settings_cont"></div>' 
 
 +   '</td>'
 
 +   '<td id="recaptcha_cont">'
 +    '<div id="recaptcha_container" style="text-align:center;">'
 +      '<div>'+_LOADING+'</div>'
 +    '</div>'
 +   '</td>'
 + '</tr></table>'

 /* -remote-capctha- */
 +'<fieldset class="fieldset" id="fieldset_capcay" style="display:none;">'    
 + '<input id="hidrecap_btn" value="reCAPTCHA" type="button" style="display:" onclick="showRecaptcha(\'recaptcha_container\');" />' // fake button create
 + '<input id="hidrecap_reload_btn" value="reload_reCAPTCHA" type="button" style="display:" onclick="Recaptcha.reload();" />' // fake button reload
 //+ '<input id="docapcayfocus" value="" type="hidden"  />' // flag for callback caller click capcay
 +'</fieldset>'
 );
}
,getTPL_vbEditor: function(){
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

}; // end rSRC
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

// end- main Object
// ------
init();
// ------

})();