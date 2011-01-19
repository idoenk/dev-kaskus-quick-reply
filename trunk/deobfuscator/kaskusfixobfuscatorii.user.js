// ==UserScript==
// @name          Kaskus Fix-ObfuscatorII
// @namespace     http://userscripts.org/scripts/show/90164
// @description   De-obfuscates words 'censored' by kaskus
// @author        hermawanadhis
// @version       0.6.7.1
// @include       http://www.kaskus.us/showthread.php?*
// @include       http://www.kaskus.us/showpost.php?*
// @include       http://archive.kaskus.us/thread/*
// @include       http://m.kaskus.us/thread/*
// ==/UserScript==
/*
Kaskus Fix-ObfuscatorII 
Created by Pandu E Poluan {http://userscripts.org/users/71414/}
Edited 1 by Chaox
Edited 2 by D3v1love
Edited 3 by hermawanadhis (from 0.6.x)

This script replaces all obfuscated words in kaskus (e.g., "rapid*share")
and replaces it with the unobfuscated word.
Changelog:
------------
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

/* 
   You can customize the script by adding new pairs of words.
   First, let's build the "obfuscated":"de-obfuscated" words list
   To prevent inadvertently using some regexp control modifiers,
   prepend symbols (i.e. non-alphanumerics) with two backslashes ( i.e. \\ )
*/
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
        "Rossi": "rossi",
        "rapid\\*share": "rapidshare",
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
        for (key in replacements) {
            s = s.replace(regex[key], replacements[key]);
        }
        node.data = s;
    }

    // Now, retrieve the A nodes
    thenodes = document.evaluate("//a", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

    // Finally, perform a replacement over all A nodes
    for (var i = 0; i < thenodes.snapshotLength; i++) {
        node = thenodes.snapshotItem(i);
        // Here's the key! We must replace the "href" instead of the "data"
        s = node.href;
        for (key in replacements) {
            s = s.replace(regex[key], replacements[key]);
        }
        node.href = s;
    }
    for (var i = 0; i < thenodes.snapshotLength; i++) {
        node = thenodes.snapshotItem(i);
        z = node.data;
        for (key in replacements) {
            z = s.replace(regex[key], replacements[key]);
        }
        node.data = z;
    }

})();