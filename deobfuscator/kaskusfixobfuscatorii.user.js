// ==UserScript==
// @name          Kaskus Fix-ObfuscatorII
// @namespace     http://userscripts.org/scripts/show/90164
// @description   De-obfuscates words 'censored' by kaskus + antibetmen
// @author        hermawanadhis
// @version       0.7.10
// @include       http://www.kaskus.us/showthread.php?*
// @include       http://www.kaskus.us/showpost.php?*
// @include       http://www.kaskus.us/blog.php?*
// @include       http://www.kaskus.us/group.php?*
// @include       http://archive.kaskus.us/thread/*
// @include       http://m.kaskus.us/thread/*
// ==/UserScript==
/*
Kaskus Fix-ObfuscatorII 
Dibuat oleh Pandu E Poluan {http://userscripts.org/users/71414/}
Credit			: Chaox, D3v1love, hermawanadhis (from 0.6.x), idx (http://code.google.com/p/dev-kaskus-quick-reply/), Piluze
tempat diskusi	: daftar kata kata yang disensor oleh Kaskus [Cekidot Gan!!!] - http://www.kaskus.us/showthread.php?t=4492393 
				  :: All About Mozilla Firefox (Add-ons, Scripts, Fans Club) :: - http://www.kaskus.us/showthread.php?t=8689106

This script replaces all obfuscated words in kaskus (e.g., "rapid*share")
and replaces it with the unobfuscated word.
Changelog:
------------
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
    
    var gvar = function(){};
    gvar.__DEBUG__ = 1;
    
	var replacements, regex, key, thenodes, node, s, z;

    // You can customize the script by adding new pairs of words.
    // First, let's build the "obfuscated":"de-obfuscated" words list
    // To prevent inadvertently using some regexp control modifiers,
    // prepend symbols (i.e. non-alphanumerics) with two backslashes ( i.e. \\ )
    replacements = {
		"file\\*serve":"fileserve",
		"file\\*sonic":"filesonic",
		"hot\\*file":"hotfile",
		"indo\\*web\\*ster":"indowebster",
		"media\\*fire":"mediafire",
		"media\\*fire":"mediafire",
		"wup\\*load":"wupload",
        "4\\*shared": "4shared",
        "\\*Forbidden\\*": ".co.cc",
        "dragon\\*adopters": "dragonadopters",
        "file\\*den": "fileden",
        "kimpoi": "kawin",
        "krack": "crack",
        "paypai": "paypal",
        "pocongk": "pocong",
        "rapid\\*share": "rapidshare",
        "tiny\\*url": "tinyurl",
        "zid\\*du": "ziddu"
    };
    regex = {};
    for (key in replacements) {
        regex[key] = new RegExp(key, 'gi');
    }

    // Now, retrieve the text nodes
    thenodes = document.evaluate("//body//text()", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

    // Perform a replacement over all the nodes
    for (var i = 0; i < thenodes.snapshotLength; i++) {
        node = thenodes.snapshotItem(i);
        s = node.data;
        if(!s || s.length<5 || !s.match(/[a-z0-9\.]/i) ) continue; // pre-check
        for (key in replacements) 
            s = s.replace(regex[key], replacements[key]);
        if(/\w\.{2,}com/i.test(s))
            s = s.replace(/\.{2,}com/gi, '.com');
        node.data = s;
    }

    // Now, retrieve the A nodes
    thenodes = document.evaluate("//a", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

    // Finally, perform a replacement over all A nodes
    for (var i = 0; i < thenodes.snapshotLength; i++) {
        node = thenodes.snapshotItem(i);
        // Here's the key! We must replace the "href" instead of the "data"
        s = unescape(node.href);
        if(!s || s.match(/^https?:\/\/[^\.]+\.kaskus\.us|kaskusnetworks\.com/i) ) continue; // pre-check
        for (key in replacements)
			s = s.replace(regex[key], replacements[key]);
        if(/\w\.{2,}com/i.test(s))
            s = s.replace(/\.{2,}com/gi, '.com');
        node.href = s;
    }
	
	var whereAmI = function(href){
		var asocLoc = {
		   'td_post_' : '/showthread.php'
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
    }, newHref = function(href){
        var a = createEl('span', { 'rel':href, 'class':'smallfont','style':'color:red; cursor:pointer; margin-left:10px;', 'target':'_blank'}, 'Hidden Link &gt;&gt; '+href );
        a.addEventListener('click', function(e){
            e=e.target||e; e.style.color='black'
            var newWindow = window.open(e.getAttribute('rel'), '_blank');
            newWindow.focus(); return false;
        }, true);
        return a; 
    };
    
    
    var el, pnode, newEl, xID = whereAmI(location.href);
    
	// perform anti-batman @container id
    var pnodes = document.evaluate("//*[contains(@id,'"+xID+"')]", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
    
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
            }else if(/^https?\:\/\/.+(\.\.\.).+/.test(node.innerHTML)){ // full linkify
			   node.innerHTML = node.href;
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
    
})();