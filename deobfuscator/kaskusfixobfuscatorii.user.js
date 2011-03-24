// ==UserScript==
// @name          Kaskus Fix-ObfuscatorII
// @namespace     http://userscripts.org/scripts/show/90164
// @description   De-obfuscates words 'censored' by kaskus + antibetmen
// @author        hermawanadhis
// @version       0.7.4
// @include       http://www.kaskus.us/showthread.php?*
// @include       http://www.kaskus.us/showpost.php?*
// @include       http://www.kaskus.us/blog.php?*
// @include       http://www.kaskus.us/group.php?*
// @include       http://archive.kaskus.us/thread/*
// @include       http://m.kaskus.us/thread/*
// ==/UserScript==
/*
Kaskus Fix-ObfuscatorII 
Created by Pandu E Poluan {http://userscripts.org/users/71414/}
Credit: Chaox, D3v1love, hermawanadhis (from 0.6.x), idx (http://code.google.com/p/dev-kaskus-quick-reply/)

This script replaces all obfuscated words in kaskus (e.g., "rapid*share")
and replaces it with the unobfuscated word.
Changelog:
------------
0.7.4 (idx)
- fix toggle spoiler in Chrome
- add full linkify
- add showall spoiler
0.7.3
- fix anti-batman fail at spoiler with img inside 
0.7.2
- fix unescaped href required for GC
0.7.1
- clear up debug line
- add // @include       http://www.kaskus.us/group.php?* 
0.7 (idx)
- add // @include       http://www.kaskus.us/blog.php?* 
- enhance+antibetmen
- removed "Rossi"
0.6.7.1
- clearing up script
0.6.7
Rewrites dragon*adopters to dragonadopters

0.6.6.2
- use http://www.kaskus.us/showthread.php?* address
- removed "** SENSOR **" 

0.6.5
- Rewrites tiny*url to tinyurl

0.6.4
- Rewrites file*den to fileden

0.6.3
- add domain wap.kaskus.us, opera.kaskus.us, blackberry.kaskus.us

0.6.2
- add domain m.kaskus.us

0.6.1
- add cite sign
- fix autoupdate

0.6
- prefered using domain kaskus.us than IP
- added from http://www.kaskus.us/showthread.php?t=4492393

v0.5   : Rewrites "*Forbidden*" to ".co.cc"
       : Rewrites "pocongk" to "pocong"
v0.4.x : Rewrites "detiknews..com" to "detiknews.com"
       : Rewrites "4*shared" to "4shared"
v0.4.1 : Added more IP's
v0.4   : Rewrites "detik..com" to "detik.com" (i.e., removes additional period)
       : Rewrites "kimpoi" to "kawin"
v0.3.1 : Added more IP's
v0.3   : Rewrites "zid*du" to "ziddu"
v0.2   : Rewrites also obfuscated URLs
         Rewrites "krack" to "crack"
v0.1.1 : Added 119.110.77.4 to be included
v0.1   : First release
*/

(function () {

	var replacements, regex, key, thenodes, node, s, z;

    // You can customize the script by adding new pairs of words.
    // First, let's build the "obfuscated":"de-obfuscated" words list
    // To prevent inadvertently using some regexp control modifiers,
    // prepend symbols (i.e. non-alphanumerics) with two backslashes ( i.e. \\ )
    replacements = {
/*
sumber: http://www.kaskus.us/showthread.php?t=4492393, hasil laporan atau coba-coba sendiri
megawati,meganil
** SENSOR **,bangsat
** SENSOR **,kontol
** SENSOR **,ngentot
***,dinomarket
***,t35
*Forbidden*,ceriwis.us
*Forbidden*,.co.cc
*Forbidden*,killerjo.net
4*shared,4shared
Rossi,rossi
detik..com,detik.com
detikhot..com,detikhot.com
detikinet..com,detikinet.com
detiknews..com,detiknews.com
file*den,fileden
kaskus,anakayam
kaskus,duniasex
kaskus,kikil
kimpoi,kawin
krack,crack
paypai,paypal
pocongk,pocong
rapid*share,rapidshare
tiny*url,tinyurl
yahoo,ueuo
zid*du,ziddu
dragon*adopters,dragonadopters
        */
        "dragon\\*adopters": "dragonadopters",
        "tiny\\*url": "tinyurl",
        "file\\*den": "fileden",
        "4\\*shared": "4shared",
        "\\*Forbidden\\*": ".co.cc",
        "detik..com": "detik.com",
        "detikhot..com": "detikhot.com",
        "detikinet..com": "detikinet.com",
        "detiknews..com": "detiknews.com",
        "kimpoi": "kawin",
        "krack": "crack",
        "paypai": "paypal",
        "pocongk": "pocong",
        "rapid\\*share": "rapidshare",
        "zid\\*du": "ziddu"
    };
    regex = {};
    for (key in replacements) {
        regex[key] = new RegExp(key, 'gi');
    }

    // Now, retrieve the text nodes
    thenodes = xP("//body//text()", document);

    // Perform a replacement over all the nodes
    for (var i = 0; i < thenodes.snapshotLength; i++) {
        node = thenodes.snapshotItem(i);
        s = node.data;
        if(!s || s.length<5 || !s.match(/[a-z0-9\.]/i) ) continue; // pre-check
        for (key in replacements) 
            s = s.replace(regex[key], replacements[key]);
        node.data = s;
    }

    // Now, retrieve the A nodes
    thenodes = xP("//a", document);

    // Finally, perform a replacement over all A nodes
    for (var i = 0; i < thenodes.snapshotLength; i++) {
        node = thenodes.snapshotItem(i);
        // Here's the key! We must replace the "href" instead of the "data"
        s = unescape(node.href);
        if(!s || s.match(/^https?:\/\/[^\.]+\.kaskus\.us|kaskusnetworks\.com/i) ) continue; // pre-check
        for (key in replacements)
			s = s.replace(regex[key], replacements[key]);
        node.href = s;
    }
	
	var whereAmI = function(href){
		var asocLoc = {
		   'td_post_' : '/showthread.php'
		  ,'td_post' : '/showpost.php'
		  ,'blog_message' : '/blog.php'
		  ,'gmessage_text_' : '/group.php'
		};
		for(var theID in asocLoc){
		  if(href.indexOf(asocLoc[theID])!=-1) 
		    return theID;
		}
	};	
    var isBatman = function(inner){
		return (inner.match(/<input\s*(?:(?:value|style|type)=[\'\"][^\'\"]+[\'\"]\s*)*onclick=[\'\"]/i));
    };	
    var el, pnode, bpnode, xID = whereAmI(location.href);

	// perform anti-batman @container id
    var pnodes = xP("//*[contains(@id,'"+xID+"')]", document);
	
    if(pnodes.snapshotLength > 0) for (var i = 0; i < pnodes.snapshotLength; i++) {
        pnode = pnodes.snapshotItem(i);		
        // href
		thenodes = xP(".//a", pnode);
        if(thenodes.snapshotLength >0 ) for (var j = 0; j < thenodes.snapshotLength; j++) {
            node = thenodes.snapshotItem(j);
            // check for betmen
            if(node.innerHTML.indexOf(' onclick="')!=-1 && !node.innerHTML.match(/^<img\s*[^>]+/i) && isBatman(node.innerHTML)){
			   pnode.insertBefore(
			    (function(href){
					var isKaskus = ( /^http\:\/\/\w+\.kaskus\.us\//i.test(href) ), c=['','FFD7FF',''];
					if(!isKaskus) c=['title="BEWARE! This link is a trick for you, it may contain harmfull or annoying contents."','FFAEFF','text-decoration:overline'];
					return createEl('div', {}, (href ? '<div style="font-size:11px;margin-bottom:-5px;font-weight:bold;"><a style="text-decoration:none" href="'+href+'" target="_blank" '+c[0]+'>[ <span style="color:red;text-decoration:blink">BETMEN-DETECTED</span> ]<span style="margin-left:20px;background:#'+c[1]+';font:12px/14px \'Courier New\',sans-serif!important;'+c[2]+'">'+href+'</span></a></div>':''));
			    })(node.href) ,
			   node.previousSibling);
			   
               node.removeAttribute('href');
               node.setAttribute('title','Spoiler healed, link deactived');
			   
            }else if(/^https?\:\/\/.+(\.\.\.).+/.test(node.innerHTML)){ // full linkify
			   node.innerHTML = node.href;
			}
        }
		
		// -------------------
		// spoiler enhancement
		thenodes = xP(".//input[@value='Show' and contains(@onclick,'if')]", pnode);
		var toggle_sAll=function(e){
		  e=e.target||e;var h=g('kfo_show_all'),p=h.parentNode||false,
		  rel=e.getAttribute('rel'); if(!rel||!g(rel))return;
		  if(p && p.id.indexOf('kfo_hidAll_')!=-1) p.innerHTML='&#187;';
		  g(rel).innerHTML=''; 
		  if(h) g(rel).appendChild(h);
		  h.style.display='';
		}
		,alnodes=xP(".//input[@value='Show' or @value='Hide' and contains(@onclick,'if')]", document)
		,t=(alnodes.snapshotLength > 1 ? 'Show all spoiler. Found: ['+alnodes.snapshotLength+'] spoilers':''), id;

		if(thenodes.snapshotLength >0 ) for (var j = 0; j < thenodes.snapshotLength; j++) {
			node = thenodes.snapshotItem(j); hid='kfo_hidAll_'+i+''+j;
		    el=createEl('span',{id:hid,style:'color:red'},'&#187;');
			node.setAttribute('rel',hid);
			// a lil hack to strip this.innerText = '', which bring error on GC(Chrome)
			node.setAttribute('onclick', ''
			 +"var gT=function(t,p){return (!p?document:p).getElementsByTagName(t)},"
			 +"p=gT('div',this.parentNode.parentNode)[1],d1=gT('div',p)[0];"
			 +"if(d1.style.display!=''){d1.style.display='';this.value='Hide'"
			 +"} else {"
			 +"d1.style.display='none';"
			 +"this.value='Show'"
			 +"}"
			);
			node.addEventListener('mousemove', function(e){return toggle_sAll(e);}, false);
			node.parentNode.appendChild( el );
		}
		node=createEl('input',{id:'kfo_show_all',value:'Show All',type:'button',style:'display:none;font-size:10px;padding:0 10px'});
		node.setAttribute('title',t);
		node.addEventListener('click', function(e){
		  e=e.target||e; var m=e.value,lTop=[],scToP=function(x){
			var nx = [getYPos(),document.body.clientHeight];
			if(nx[1]!=x[1]) scrollTo(0,(x[0] + x[1]) );
		  };		  
		  lTop = [e.offsetTop,getYPos(),document.body.clientHeight];
		  var node,thenodes = xP(".//input[@value='"+(m=='Show All'?'Show':'Hide')+"' and contains(@onclick,'if')]", document),m=e.value,t=e.getAttribute('title');
		  if(thenodes.snapshotLength >0 ) for (var z = 0; z < thenodes.snapshotLength; z++) {
		    node = thenodes.snapshotItem(z);
			SimulateMouse(node, 'click', true);
		  }
		  lTop[0] = (e.offsetTop-lTop[0]);
		  e.setAttribute('title', (m=='Show All' ? t.replace(/^Show/,'Hide') : t.replace(/^Hide/,'Show') ) );
		  e.value = (m=='Show All' ? 'Hide':'Show')+' All';
		  
		  scToP(lTop); // scrollto this postbit
		}, false);
		document.body.appendChild(node);
    }// end scan post-container

    // additional func
    function gT(t,p){return (!p?document:p).getElementsByTagName(t)}
    function g(x,p){return (!p?document:p).getElementById(x)}
	function xP(x,p) {
	  return document.evaluate(x, (p?p:document), null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
	}
    function createEl(type, attrArray, html) {
        var node = document.createElement(type);
        for (var attr in attrArray)
			if (attrArray.hasOwnProperty(attr)) node.setAttribute(attr, attrArray[attr]);
        if (html) node.innerHTML = html;
        return node;
    }
	function getYPos() {
      if (document.body && document.body.scrollTop) return document.body.scrollTop;
      if (document.documentElement && document.documentElement.scrollTop) return document.documentElement.scrollTop;
      if (window.pageYOffset) return window.pageYOffset;
      return 0;
    }
    function SimulateMouse(elem,event,preventDef) {
      if(typeof(elem)!='object') return;
      var evObj = document.createEvent('MouseEvents');
      preventDef=(!preventDef ? false:true);
      evObj.initEvent(event, preventDef, true);
      try{elem.dispatchEvent(evObj);} catch(e){};
    }
    //

})();