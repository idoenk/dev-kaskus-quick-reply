// ==UserScript==
// @name          Kaskus Fix-ObfuscatorII
// @namespace     http://userscripts.org/scripts/show/90164
// @description   De-obfuscates words 'censored' by kaskus + antibetmen
// @author        hermawanadhis, idx
// @version       0.7.3
// @include       http://livebeta.kaskus.co.id/show_post/*
// @include       http://livebeta.kaskus.co.id/edit_post/*
// @include       http://livebeta.kaskus.co.id/post/*
// @include       http://livebeta.kaskus.co.id/thread/*
// @include       *.kaskus.co.id/showthread.php?*
// @include       *.kaskus.co.id/showpost.php?*
// @include       *.kaskus.co.id/editpost.php?*
// @include       *.kaskus.co.id/newthread.php?*
// @include       *.kaskus.co.id/blog.php?*
// @include       *.kaskus.co.id/group.php?*
// @include       http://m.kaskus.co.id/thread/*
// @include       http://archive.kaskus.co.id/thread/*
// ==/UserScript==
/*
Kaskus Fix-ObfuscatorII 
Dibuat oleh Pandu E Poluan {http://userscripts.org/users/71414/}
Penghargaan kepada: Chaox, D3v1love, hermawanadhis (from 0.6.x), idx (http://code.google.com/p/dev-kaskus-quick-reply/), Piluze
Tempat diskusi    : daftar kata kata yang disensor oleh Kaskus [Cekidot Gan!!!] - http://www.kaskus.co.id/showthread.php?t=4492393 
                  :: All About Mozilla Firefox (Add-ons, Scripts, Fans Club) :: - http://www.kaskus.co.id/showthread.php?t=8689106

Skrip ini bertujuan mengembalikan semua kata-kata yang disensor pada situs KasKus.co.id (misal: "rapid*share") menjadi sediakala.
This script replaces all obfuscated words in kaskus (e.g., "rapid*share") and replaces it with the unobfuscated word.
Changelog:
------------
0.7.3
- replace include domain .co.id
- self-link helper (avoid bouncing-link)
- optimize node selection for livebeta
+/post/
0.7.2
- tambahan darurat dukungan kaskus beta 
0.7.13
- linkify ftp or with (s) --inline-conditional :D
0.7.12
- full-linkify on singlepost
- Fix fixme for unicode href, (eg. wikiedia or Asian web)
0.7.11
- wildcard character(*) in obfuscated links will be globally removed; entire for obfuscated with random shift, i guess;
- (as above) link replacements list should no longer needed 
+ editpost.php?*
+ newthread.php?*
- missed regular words replacements in links
- avoid strip neutral wildcard
0.7.10
* "file\\*serve":"fileserve",
* "file\\*sonic":"filesonic",
* "hot\\*file":"hotfile",
* "indo\\*web\\*ster":"indowebster",
* "media\\*fire":"mediafire",
* "media\\*fire":"mediafire",
* "wup\\*load":"wupload",
- "detik..com": "detik.com",
- "detikhot..com": "detikhot.com",
- "detikinet..com": "detikinet.com",
- "detiknews..com": "detiknews.com",
- "maknyos..com":"maknyos.com",
0.7.9
+ maknyos..com, maknyos.com
0.7.8.1
+ indo*web*ster.., indowebster
0.7.8
+ media*fire..com, mediafire.com
+ file*serve..com, fileserve.com
+ file*sonic..com, filesonic.com
+ hot*file..com, hotfile.com
+ indo*web*ster...com, indowebster.com
+ wup*load..com, wupload.com
0.7.7
+ fileserve..com,fileserve.com
+ filesonic..com,filesonic.com
+ hotfile..com,hotfile.com
+ indowebster...com,indowebster.com
+ wupload..com,wupload.com 
0.7.6
+ mediafire..com,mediafire.com
0.7.5
- roll back update from v0.7.2
- full long url linkify
- debfuscate link with (\.{2,}com)
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
- prefered using domain kaskus.co.id than IP
- added from http://www.kaskus.co.id/showthread.php?t=4492393
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
    
    var gvar = function(){};
    gvar.__DEBUG__ = 0;
    
    var replacements, lreplacements, regex, lregex, thenodes, node, s;

    // You can customize the script by adding new pairs of words.
    // First, let's build the "obfuscated":"de-obfuscated" words list
    // To prevent inadvertently using some regexp control modifiers,
    // prepend symbols (i.e. non-alphanumerics) with two backslashes ( i.e. \\ )
    replacements = {
        "kimpoi": "kawin",
        "krack": "crack",
        "paypai": "paypal",
        "pocongk+": "pocong",
        "indo\\*web\\*ster\\.\\.":"indowebster",
        "\\*Forbidden\\*": ".co.cc",
    };
    
    // reusable func to perform & manipulating in wildcard links or data value 
    var fixme = function(s){
        for (key in replacements) 
            s = s.replace(regex[key], replacements[key]);
            
        if( /\w{1}\*\w{1}/.test(s) )
            s = s.replace(/(\w{1})\*(\w{1})/g, function(S,$1,$2){return (!$1 || !$2 ? S : ''+$1+$2)} );
            
        if( /\w{3,}\.{2,}(?:com|net|in|to|ly)\b/i.test(s) )        
            s = s.replace(/\.{2,}(com|net|in|to|ly)\b/g, '.$1' );
        return s;
    };
    
    regex = {};
    for (key in replacements) 
        regex[key] = new RegExp(key, 'gi');
        
        
    // Now, retrieve the text nodes. default: //body//text()
    thenodes = document.evaluate('//body//text()', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
    
    // Perform a replacement over all the nodes
    for (var i = 0; i < thenodes.snapshotLength; i++) {
        node = thenodes.snapshotItem(i);
        s = node.data;
        if(!s || s.length<5 || !s.match(/[a-z0-9\.]/i) ) continue; // pre-check
        s = fixme( s );
        node.data = s;
    }

    // Now, retrieve the A nodes. default: //a
    // Optimized, we just need all this specified href links
    thenodes = document.evaluate('//a[contains(@href,"http\:\/\/") and not(contains(@href,"\.kaskus\.co\.id")) and not(contains(@href,"\.kaskusnetworks\.com\/"))]',
               document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
    
    // Finally, perform a replacement over all A nodes
    for (var i = 0; i < thenodes.snapshotLength; i++) {
        node = thenodes.snapshotItem(i);
        // Here's the key! We must replace the "href" instead of the "data"
        s = fixme( decodeURI( node.href ) );
        node.href = s;
    }

	// --
    // initiate additional features :: anti-batman, self-link
    var whereAmI = function(href){
		var asocLoc = {
           '/showthread.php': 'td_post_'
          ,'/showpost.php'	: 'td_post_'
          ,'/blog.php'		: 'blog_message'
          ,'/group.php'		: 'gmessage_text_'
		  
          ,'/thread/'		: 'post0'
          ,'/post/'			: 'post0'
          ,'/show_post/'	: 'post0'
		  
        }, ret='';
		
        for(var theID in asocLoc){
          if(href.indexOf(theID)!=-1) {
            ret = asocLoc[theID]; break;
          }
        }
        return ret;
    }, 
    isBatman = function(inner){
        return (inner.match(/<input\s*(?:(?:value|style|type)=[\'\"][^\'\"]+[\'\"]\s*)*onclick=[\'\"]/i));
    }, 
    newHref = function(href){
        var a = createEl('span', { 'rel':href, 'class':'smallfont','style':'color:red; cursor:pointer; margin-left:10px;', 'target':'_blank'}, 'Hidden Link &gt;&gt; '+href );
        a.addEventListener('click', function(e){
            e=e.target||e; e.style.color='black'
            var newWindow = window.open(e.getAttribute('rel'), '_blank');
            newWindow.focus(); return false;
        }, true);
        return a; 
    },
	linkConvert = function(link){
		var ml_2old, ml_2new, bid, cucok, hn, prot, kb_maxlen, ret, posid;
		ret = link;
		prot = location.protocol;
		hn = location.hostname;
		
		// kasbet_maxleng item-id
		kb_maxlen = 24;
		
		ml_2old = {
			 'thread'	: 'showthread.php?t='
			,'post'		: 'showthread.php?p='
			,'show_post': 'showpost.php?p='
		};
		ml_2new = {
			 'showpost'		: 'show_post'
			,'showthread'	: 'thread'
		};
		if( cucok = /(thread|show_post|post)\/([^\/]+)/i.exec(link) ){
			bid = cucok[2].replace(/^0+/,'');
			ret = prot + '//' + hn + '/' + ml_2old[cucok[1]] 
				+ (cucok[1]=='post' ? bid + '#post' : '') + bid;
				
		}
		else if( cucok = /(showpost|showthread)\.php\?(t|p)=([\d]+)(\#)?(?:\&postcount=(\d+))?/i.exec(link) ){
			bid = (function(num){
				var ret = '', add = (kb_maxlen - ('' + num).length);
				for(var i=0; i<add; i++)
					ret = '0' + String(ret);
				return ret + num + '';
			})(cucok[3]);
			
			posid = (cucok[2]=='p' && cucok[4]);
			
			ret = prot + '//' + hn + '/' + (posid ? 'post' : ml_2new[cucok[1]]) + '/'
				+ (posid ? bid + '#post' : '') + bid
				+ (cucok[5] ? '/' + parseInt(cucok[5]) : '')
		}
		return ret;
	};
    
    var pnode, pnodes, cucok, newlink, ksa;
    // perform anti-batman @container id
    pnodes = document.evaluate("//*[contains(@id,'" + whereAmI(location.href) + "')]", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
	
	if(pnodes.snapshotLength > 0) for (var i = 0; i < pnodes.snapshotLength; i++) {
        pnode = pnodes.snapshotItem(i);        
        thenodes = document.evaluate(".//a", pnode, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
        
        if(thenodes.snapshotLength >0 ) for (var j = 0; j < thenodes.snapshotLength; j++) {
            node = thenodes.snapshotItem(j);            
            if(node.innerHTML.indexOf(' onclick="')!=-1 && isBatman(node.innerHTML)){
               
               var inps, inerDiv=node.getElementsByTagName('div');
               if(inerDiv){
                inps = inerDiv[0].getElementsByTagName('input');
                if(inps.length)
                    inps[0].parentNode.appendChild( newHref(node.href) );                
               }
               node.removeAttribute('href');
            }else if(/^(?:ftps?|https?)\:\/\/.+(\.\.\.).+/.test(node.innerHTML)){ // full linkify
               node.innerHTML = decodeURI(node.href);
            }
			
			
			// self-link helper for kaskus domain (avoid bouncing around links)
			if(cucok = /^https?\:\/\/((?:livebeta|www)\.kaskus\.[^\/]+).(?:thread|show_post|post|showthread|showpost)[\/\.]/i.exec(node.href)){
				
				if(location.hostname != cucok[1]){					
					newlink = linkConvert(node.href);
					
					// should wrap it with //span#KSA incase it need to removed by QQ
					ksa = createEl('span', {id:'KSA-selflink', title:'Self-Link :: ' + newlink, rel:newlink, style:'display:inline-block; background:url(http://static.kaskus.co.id/images/buttons/lastpost.gif) no-repeat; margin-right:5px; width:12px; height:12px;'}, '<a href="'+newlink+'" style="display:block;width:12px;line-height:12px;outline:none">&nbsp;</a>');
					
					node.style.color = 'red';
					node.parentNode.insertBefore(ksa, node);
				}
			}
			
			
        }
    }
    //

    function createEl(type, attrArray, html) {
        var node = document.createElement(type);
        for (var attr in attrArray)
            if (attrArray.hasOwnProperty(attr)) node.setAttribute(attr, attrArray[attr]);
        if (html) node.innerHTML = html;
        return node;
    }
    //
    
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

    
})();