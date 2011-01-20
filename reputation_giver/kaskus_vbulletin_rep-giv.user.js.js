// ==UserScript==
// @name          Kaskus VBulletin Rep-Giver
// @namespace     http://userscripts.org/scripts/show/65502
// @include       http://*.kaskus.us/usercp.php
// @version       1.16
// @dtversion     11012016
// @timestamp     1295458935400
// @description   (Kaskus Forum) automatically get (a|some) reputation(s) giver's link 
// @author        idx (http://userscripts.org/users/idx)
//
// Kaskus VBulletin Rep-Giver
// Mod :: Idx
// Improved from bimatampan code
// Released under the GPL license; http://www.gnu.org/copyleft/gpl.html
//
// ----CHANGE LOG-----
/*
// mod.R.16 : 2011-01-20
// Fix failed get reputation rank title
// 
// 
// mod.R.15 : 2011-01-17
// Fix missing reputation rank title
// Try Fix failed load image "</a></span>" issue
// 
// mod.R.14 : 2011-01-14
// Fix red/black sender
// Fix minor CSS, kaskus-donat sender
// 
// mod.R.13 : 2011-01-03
// Fix prefer to define 'var' on global namespace (major issue Opera-11)
// 
//
//
// mod.R.2 : 2010-01-08
*/
/*
 :: About this script ::
  ~ .foobar.
*/
// ==/UserScript==
(function () {
 
// Global Variables
var gvar=function() {}

gvar.sversion = 'R' + '16';
gvar.scriptMeta = {
  timestamp: 1295458935400 // version.timestamp

 ,scriptID: 80409 // script-Id
};
/*
javascript:window.alert(new Date().getTime());
javascript:(function(){var d=new Date(); alert(d.getFullYear().toString().substring(2,4) +((d.getMonth()+1).toString().length==1?'0':'')+(d.getMonth()+1) +(d.getDate().toString().length==1?'0':'')+d.getDate()+'');})()
*/
//========-=-=-=-=--=========
gvar.__DEBUG__  = false; // development debug
gvar._SIMULATE_ = false; // debug simulate sender
//========-=-=-=-=--=========
const OPTIONS_BOX = {
  // Color Loader
  LIGHT_COLOR_DL_OPTIONS_TEXT: ['00CC00']
 
  // Color Loader              
, DARK_COLOR_DL_OPTIONS_TEXT : ['B6B6B6']
 
, KEY_SAVE_EXPIRED           : ['0'] // will be unix time of expired data
, KEY_SAVE_DATA              : [''] // bufferData, value might be very large; limit is still unknown 
 
  // Userdata expired in hour(s)
, INTERVAL_FORCE_RELOAD_USERDATA:    12
};
const GMSTORAGE_PATH      = 'GM_';
 
// utk add - remove element
var Dom = {
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
    dest.appendChild(el);
  },
  remove: function(el) {
    var el = this.get(el);
    el.parentNode.removeChild(el);
  },
  Ev: function() {
    if (window.addEventListener) {
      return function(el, type, fn) {
        this.get(el).addEventListener(type, function(e){fn(e);}, false);
      };      
    }else if (window.attachEvent) {
      return function(el, type, fn) {
        var f = function() { fn.call(this.get(el), window.event); };
        this.get(el).attachEvent('on' + type, f);
      };
    }
  }()
};
//--
 
 
// del all old.value
function delOldVal(all){
  var todel = ['IDENTITY','USER_COUNT'];
  for(var i in todel)
    try{ if( isString(todel[i]) ) delValue(todel[i])}catch(e){}
  for(var i=0; i<10; i++)
    try{delValue('bufferDATA_'+i.toString());}catch(e){}
 
  // dev - mode
  for(var i=0; i<10; i++)
    try{delValue('undefined_'+i.toString());}catch(e){}
    
  if(isDefined(all)){
    todel = ['KEY_SAVE_DATA','KEY_SAVE_EXPIRED'];
    for(var i in todel)
      try{ if( isString(todel[i]) ) delValue(todel[i])}catch(e){}
  }
}
 
// initialize global var & const
function init(){
  
  // it's needed for cross-browser work properly
  ApiBrowserCheck();  // snippet code - By GI-Joe
  
  delOldVal();  
  
  gvar.home = 'http://'+'userscripts.org/scripts/show/65502';
  gvar.codeName = 'KVRG';
  gvar.titleName = 'Kaskus vBulletin Reputation Giver';
  
  gvar.uri = {
      'avatar' : 'http://'+'static.kaskus.us/customavatars',
      'user_link' : 'http://'+'www.kaskus.us/member.php?u=',
      'rep_link' : 'http://'+'www.kaskus.us/reputation.php?p=',
      'cendol_img' : 'http://'+'static.kaskus.us/images/reputation/',
      'rep_img0' : 'reputation_balance.gif',
      'rep_offimg' : 'reputation_off.gif', // item
      
      'rep_img' : 'reputation_pos.gif',
      'rep_img2' : 'reputation_highpos.gif',
      'rep_redimg' : 'reputation_neg.gif', // red-gelap
      'rep_redimg2' : 'reputation_highneg.gif', // red-terang
     };
  gvar.spliter = '[||]'; // for data
  gvar.f = ['uid','kaskus_id','tag_id','location','join_date','total_post','avatar_url','rep_count','rep_filename','rep_rank_title'];
  
  gvar.dereplace = {
   '\\[\\|\\]' : gvar.spliter,
   '\\[}\\]' : '}'
  }
  
  gvar.rep_id_tbody = 'collapseobj_usercp_reputation';
  
  gvar.user=getUserId(); // current active user
  gvar.userID=[];  // set of users rep-giver 
  gvar.userData='';
  gvar.stillOnIt=false;
  
  // for donatur this will be temporary value
  gvar.el_senders_head=null;
  gvar.el_senders=[];
  gvar.name_senders=[];
  
  // let's roll----
  start_Main();  
}
 
 
 
// == ==== ==
// == MAIN ==
// =====Page manipulation====
function start_Main() {
 
    var tdTable, Attr; 
    var tbcontainer = getContainer();
    if(!tbcontainer) return;
	
	setTitle(tbcontainer);
    
    // replacement head column
    var trTable = tbcontainer.getElementsByTagName("tr")[0];
    if(trTable){
      Attr = {'class':'thead','width':'10%', id:'psby', style:'min-width:110px;'};
      var td = createEl('td', Attr);
      Attr = {'style':'float:left;width:auto;',id:'divpsby'};
      var div = createEl('div', Attr, '<u>Posted By</u>');
      mass_append(trTable, [td,div]);
      
      Dom.Ev(div, 'mouseover', function(){
        if(Dom.get('fetcher') && Dom.get('fetcher').style.display!='none') return;
        var ch = Dom.get('spanClear');
        if(ch) ch.style.display ='';
      });
      Dom.Ev(div, 'mouseout', function(){
        var ch = Dom.get('spanClear');
        if(ch) ch.style.display ='none';
      });
      Attr = {'style':'display:none;',id:'spanClear'};
      var el = createEl('span', Attr);
      var el2 = createEl('a', {style:'margin-left:3px;font-weight:normal;',title:'Reset Saved Data',href:'javascript:;'}, 'reset');
      Dom.Ev(el2, 'click', function(e){ resetdefault(); });
      el.appendChild(el2);
      div.appendChild(el);
      
      Attr = {'class':'thead'};
      td = createEl('td', Attr, 'Reputation');
      trTable.appendChild(td);  
    } // end trTable (head column)
    
    // add colspan for 2 additional td
    tdTable = eval_XPath("//td[contains(@colspan, "+(gvar.user.isDonatur ? '5':'4')+")]");
    if(tdTable.snapshotItem(0)) 
      tdTable.snapshotItem(0).colSpan = (gvar.user.isDonatur ? '7':'6');
    else
      show_alert('E.001: Node tdTable not found', 0);
    
    // resize Thread column to 25%
    tdTable = eval_XPath("//td[@class='alt1Active' and contains(@width, '50%')]", tbcontainer);
    if(tdTable.snapshotLength)
     for(var i=0;i<tdTable.snapshotLength;i++)
        tdTable.snapshotItem(i).width="25%";
    else
     show_alert('E.002: Node tdTable not found', 0);    
    
    var dstr, repID = [];    
    if( gvar._SIMULATE_ ){
    
      // intercept to simulate ; 1174280
      //dstr = '3,446837,16644,232784,1817178,247123,507569,265074,1726340,1174280'; // selected kaskuser just to simulate error
      dstr = '3,446837,16644,232784,1817178,247123,507569,862335,196369,601934'; // selected kaskuser just to simulate error
      gvar.userID = dstr.split(',');
      dstr = '347914936,341574768,339584718,339584718,339584718,339584718,339584718,339584718,339584718,339584718'; // just a sample, not a major
      repID = dstr.split(',');
      
    }else{
      // fetch repID and postID
      repID=[]; //var userID=[];
      dstr = tbcontainer.innerHTML.replace(/\n|\r|\r\n/g, '').split('"time"');
      for(var i=0;i<dstr.length;i++) {
        if(cucok = dstr[i].match(/alt1Active"\sid="p(\d{9})(\d+)"\swidth/i)){ 
          gvar.userID[i] = cucok[2];
          repID[i] = cucok[1];    
        }
      }
    }
    
    var trs = getTag('tr', Dom.get('collapseobj_usercp_reputation'));
    if(trs && gvar.user.isDonatur)     
     for(var baris in trs){
        if(typeof(trs[baris])!='object') continue;
        var tds, el_a;
        tds = getTag('td', trs[baris]);        
        if(trs[baris].innerHTML.indexOf('class="alt')!=-1){
            el_a = getTag('a', tds[3]);
            gvar.name_senders.push(el_a[0].innerHTML);
            gvar.el_senders.push(tds[3]);
        }else{
           gvar.el_senders_head = tds[3];
        }
     }
    
    
    // replace comment; add additional td after td comment
    tdTable = eval_XPath("//td[@class='alt"+(gvar.user.isDonatur ? '2':'1')+"' and contains(@width, '50%')]", tbcontainer);
    if( tdTable.snapshotLength ) {
      var elem,td,span,div,a1;
      for(var i=0; i<tdTable.snapshotLength; i++){
        elem = tdTable.snapshotItem(i);
        elem.width = "65%";
        
        Attr = {'class':'alt'+(gvar.user.isDonatur ? '1':'2'),width:'13%'};
        td = createEl('td', Attr);// posted by
            
        Attr = {id:'_ucnd' + i};
        div = createEl('div', Attr);
        
        Attr = {'class':'smallfont', href:gvar.uri['user_link']+gvar.userID[i] };
        a1 = createEl('a', Attr, (gvar.user.isDonatur ? gvar.name_senders[i] : 'u=' + gvar.userID[i]) );
        mass_append(elem.parentNode, [td,div,a1]);
        // -- 
        Attr = {'class':'alt'+(gvar.user.isDonatur ? '2':'1'),width:'13%'};
        td = createEl('td', Attr); // reputation
        
        //Attr = {id:'_pcnd' + i};
        //span = createEl('span', Attr);
        
        Attr = {'class':'smallfont', href:gvar.uri['rep_link']+repID[i] };
        a1 = createEl('a', Attr, 'p='+repID[i]);
        mass_append(elem.parentNode, [td,a1]);
 
      } // end for
    } // end tdTable
    else show_alert('E.003: Node tdTable not found', 0);    
    
    // chk is re-fetch  user detail needed
    if( !gvar._SIMULATE_ && noneed_upd() ) {
        loadstorage(); // load from availabe storage
     }else{
        startDetail(gvar.userID, 0); // reload detail again
    }
    if(gvar.user.isDonatur)
      destroy_column(gvar.el_senders);
}
// end retransform_table
 
 
function destroy_column(els){
   if(isUndefined(els)) return;
   var par;
   for(var x in els){
      if(typeof(els[x])!='object') continue;
      par = els[x].parentNode;
      if(par) par.removeChild(els[x]);
   }
   par = gvar.el_senders_head.parentNode;   
   par.removeChild(gvar.el_senders_head);
}
 
function resetdefault(){
  var msg = ''
   +'This will delete all saved buffer data.\n'
   +'Please report any bug or some bad side effects here:\n'+gvar.home+'\n\n'
   +'  Continue with Reset?';
  var yakin = confirm(msg);
  if(yakin) {
    delOldVal(true); // delete all
    window.setTimeout(function() { location.reload(false); }, 300);
  }
}
 
// get container
function setTitle(tbody){
    if(typeof(tbody) != 'object') return false;
	var el, Attr, inner, epar, par = getTag('thead', tbody.parentNode);
	if(par && par.length > 0){
	  epar = getTag('td', par[0]); //
	  if(epar && epar.length > 0){
	    Attr = {id:"sc_subtitle",title:'Home '+gvar.titleName+' - '+gvar.sversion};
		inner = ' '+ HtmlUnicodeDecode('&#8212;') + ' <b>'+gvar.codeName+'</b> '+HtmlUnicodeDecode('&#183;')+' <a href="'+gvar.home+'" target="_blank" style="text-decoration:underline;">'+gvar.sversion+'</a>';
		el = createEl('span', Attr, inner);		
		Dom.add(el, epar[0]);
	  }
	}
}
// get container
function getContainer(){
    var tbret = null;
    // find table reputation container
    var ar_Table = eval_XPath("//tbody[contains(@id, '"+gvar.rep_id_tbody+"')]");
    if(!ar_Table) {
      show_alert('reputation container ['+gvar.rep_id_tbody+'] not found! halted()');      
    } else {
      tbret = ar_Table.snapshotItem(0);
    }    
    return tbret;
}
 
 
// ==chk fetch detail
function noneed_upd(){
  var Identity = '';
  var buff = getBuffer(gvar.user.id);
  if(buff){
    Identity = buff.identity;
    gvar.user.bufferDATA = buff.data;
    gvar.user.givercount = buff.givercount;    
  }  
  var is_noneed = (gvar.userID.toString().replace(/\,/g,'') == Identity && notExpired() );
  drawLoaderImg(is_noneed);
  return is_noneed;
};
 
function getBuffer(uid){
  var data = getValue("KEY_SAVE_DATA");
  var ret = false;
  if(data && data.indexOf(uid+'{')!=-1 ){
    var re = new RegExp(uid+'{([^\\}]+)', "i");
    var cucok = re.exec(data);
    if(cucok) {
      data = cucok[1].split(gvar.spliter);
      var ddata, serial_id='';
      ret = {'data':{}, 'identity':'', 'givercount':0};
      var givercount = 0;
      for(var i in data){
        if(!isString(data[i])) continue;
        ret.data['giver_'+givercount] = data[i];
        ddata = data[i].split(';;');
        serial_id+= ddata[0];
        givercount++;
      } // end loop i
      ret['identity']=serial_id;
      ret['givercount']=givercount;
    }
  }
  return ret;
}
 
function loadstorage(){
  if(gvar.user.bufferDATA && gvar.user.givercount > 0){
    var rwddata, rwdata = gvar.user.bufferDATA;
    var Obj_Data = {};
    for(var i=0; i<gvar.user.givercount; i++){
      rwddata = rwdata['giver_' + i].split(';;');
      for(var j=0; j<gvar.f.length; j++){
        if( !isString(gvar.f[j]) ) continue;
        Obj_Data[gvar.f[j]] = rwddata[j];
      }
      if(rwddata) createSender(Obj_Data, i);
    }
  }else{  
    startDetail(gvar.userID, 0);
  }
}
 
/* draw loader button */
function drawLoaderImg(noneed){
  if(noneed) return;
  var parentpostby = Dom.get('psby');  
  Attr = {id:'fetcher',
          style:'height:19px;float:right;position:relative;cursor:pointer;margin:-2px;',
          title:'Fetch user detail'
         };
  var newElement2td1Div = createEl('div', Attr);  
  var buttonCtx=addTransparentCanvas(newElement2td1Div,19,19).getContext('2d');
  draw_Button(0,buttonCtx);
  parentpostby.appendChild(newElement2td1Div);
  option_turn(true);
}
 
function hideLoader(){
    option_turn(false);
    try{Dom.get('fetcher').style.display = 'none';}catch(e){}
}
// --
 
 
function startDetail(userSets, x){
 GM_xmlhttpRequest({
      method: "get",
      url: gvar.uri['user_link'] + userSets[x] + '?'+Math.random().toString().replace('0.',''),
    onerror: function(result) { this.onload(result); },
      onload: function(result) {
      if(result.status!=200) { 
        hideLoader();
        show_alert('Err. status 200 failed', 0); 
      }
        res = result.responseText.replace(/\r|\n|\t|\r\n/g, '');
      if(res!=""){
         var dat = parseIt(res);
         pushData(dat);
         createSender(dat, x); 
         x++;
         if(x<userSets.length) {
            startDetail(userSets, x);
         }else{
            // -- DONE fetching --
            hideLoader();            
            var tmp = gvar.userData;
            tmp = tmp.substring(0,tmp.length-gvar.spliter.length);
            gvar.userData = gvar.user.id.toString() + '{' + tmp + '}';
            
            doSaveDat(gvar.userData);
         }
         }
    }
  });
}; 
// end func startDetail();
 
 
function pushData(dat){
  if(typeof(dat)=='object'){
    var ret='';
    for(var i in dat){
       //if(typeof(dat[i])=='object' || typeof(dat[i])=='function') continue;
       if(!isString(dat[i])) continue;
       ret+=dat[i]+';;';
    }
    ret=ret.substring(0,ret.length-2);
    
    // prevent spliter / separator abuse
    if(ret.indexOf(gvar.spliter)!=-1) 
      ret=ret.replace(gvar.spliter, '[|]'); 
    if(ret.indexOf(gvar.user.id.toString()+'{')!=-1)    
      ret=ret.replace(gvar.user.id.toString()+'{', gvar.user.id.toString()+' {');
    if(ret.indexOf('}')!=-1)    
      ret=ret.replace('}', '[}]');
     
    gvar.userData+= ret + gvar.spliter;
  }
}
 
function parseIt(page){
  var dpage; var result = {};
 
  dpage = page.split('finduser')[1];
  if(ret = getBetween(dpage, 'u=(\\d+)\\"')) result[gvar.f[0]] = ret; // uid
  
  dpage = page.split('View Profile')[1];
  if(ret = getBetween(dpage, '^\\:\\s(.+)<\\/title')) result[gvar.f[1]] = ret; // kaskus_id
  
  dpage = page.split('<h2>')[1];
  if(ret = getBetween(dpage, '^(.+)<\\/h2>')) result[gvar.f[2]] = ret; // tag_id
  
  if(page.indexOf('Location')!=-1){
    dpage = page.split('Location</dt>')[1].split('</dd>')[0]; //location
    if(ret = getBetween(dpage, '<dd>(.+)')) result[gvar.f[3]] = ret; 
  }else{
    result[gvar.f[3]] = 'N/A';
  }
  
  dpage = page.split('Join Date:')[1].split('</li>')[0];
  if(ret = getBetween(dpage, '>\\s(.+)')) result[gvar.f[4]] = ret; // join_date
  
  dpage = page.split('Total Posts:')[1].split('</li>')[0];
  if(ret = getBetween(dpage, '>\\s(.+)')) result[gvar.f[5]] = ret; // total_post
  
  if(page.indexOf('user_avatar')!=-1){
    dpage = page.split('user_avatar')[0];
    dpage = dpage.substring(parseInt(dpage.length)-200); // assumed we mundur 200 char
    if(ret = getBetween(dpage, '<img\\ssrc=\\"([^\\"]+)')){
      result[gvar.f[6]] = basename(ret); // avatar_url
      gvar.uri['avatar'] = ret.replace(result[gvar.f[6]], ""); // update to make sure
      if(gvar.uri['avatar'].substr(-1) == '/')
        gvar.uri['avatar'] = gvar.uri['avatar'].substr(0, gvar.uri['avatar'].length-1);
    }
  }else{
    result[gvar.f[6]]='';
  }
  dpage = page.split('<div id="reputation">')[1];
  var cnt = dpage.split('images/reputation/').length;
  result[gvar.f[7]] = parseInt(cnt-1); // rep_count
  
  var rep_fn = [gvar.uri['rep_img0'], gvar.uri['rep_offimg'], gvar.uri['rep_img'], gvar.uri['rep_img2'], gvar.uri['rep_redimg'], gvar.uri['rep_redimg2']];
  result[gvar.f[8]] = '';
  for(var i=0; i<rep_fn.length; i++){
    if(dpage.indexOf('/'+rep_fn[i])!=-1){
       result[gvar.f[8]] = rep_fn[i]; // rep_filename
       break;
    }
  }
  //rep_rank_title
  var re = new RegExp('<img\\\s*(?:(?:title|class|src)=[\\\'\\\"][^\\\'\\\"]+.\\\s*)*alt=[\\\'\\\"]([^\\\'\\\"]+)',  'im');
  var cucok = dpage.match(re);
  result[gvar.f[9]] = (cucok ? cucok[1].replace(/\s{2,}/g,' ') : result[gvar.f[1]] + '\'s reputation rank');  
  
  return result;
}
// end parseIt
 
function ucendol(data){
  var bufcen = '<div title="'+data["rep_rank_title"]+'" style="cursor:help;min-width:110px;text-align:right;float:right;">', halftag = '<img src="'+gvar.uri['cendol_img'];
  var upto = (data["rep_count"]<5 ? data["rep_count"] : 5);
  for(j=0;j<upto;j++){ bufcen+= halftag + data["rep_filename"] + '"/>';}
  if((j-1) < data["rep_count"])
     for(k=j;k<data["rep_count"];k++)
        bufcen+= halftag + (data["rep_filename"].indexOf('neg.')!=-1 ?  gvar.uri['rep_redimg2'] : gvar.uri['rep_img2']) + '"/>';
  return bufcen+'</div>';
};
 
function createSender(data, x){
  var replacer = function(text){
    if(!isString(text)) return text;
    var re, ret = text;
    for ( key in gvar.dereplace ) {
      if(!isString(gvar.dereplace[key])) continue;
      re = new RegExp(key, 'gi');
      ret = ret.replace( re , gvar.dereplace[key] );
    }
    return ret;
  };
  var filterChar = function(text){
    var ret = text.replace(/[<]/g,'&lt;').replace(/[>]/g,'&gt;').replace(/[\"]/g,'&quot;').replace(/[\']/g,'&apos;');
    ret = toCharRef(ret); // filter unicode chars
    return ret;
  };
  if(!Dom.get("_ucnd"+x)) return;
  
  var is_donat = ( data["tag_id"] && data["tag_id"].match(/Kaskus\s*Donator/i) ? '&nbsp;<b style="color:red;">[$]</b>':'');
  data["kaskus_id"] = filterChar( data["kaskus_id"] );
  
  //overflow:wrap;  //Kaskus Donator
  var inner = ''
  +'<div id="_ucnddiv'+x+'" class="tborder alt2" style="float:right; position:absolute; width:100px; text-align:center;padding:3px; margin:-3px 0 0 -110px; font-size:9px; display:none;">'
  +'<div id="img_cont'+x+'">'+(data["avatar_url"].length > 0 ? gvar.uri['avatar'] + '/'+ data["avatar_url"]+'||[avatar'+data["uid"]+']' : '||')+'</div>'
  +'<div><b>'+( data["kaskus_id"] )+'</b>'+(is_donat)+'</div>'
  +'<div>'+data["tag_id"]+'</div>'
  +'<div>'+filterChar( replacer(data["location"]) )+'</div>'
  +'<div>'+data["join_date"]+'</div>'
  +'<div>Post: '+data["total_post"]+'</div>'
  +'</div>';

  // last act, attaching..  
  var tgt = Dom.get("_ucnd"+x);
  tgt.innerHTML = inner + '<a class="smallfont" href="' + gvar.uri['user_link'] + data["uid"] +'"><b>'
    + ( data["kaskus_id"] ) + '</b></a>'+(is_donat)+'<div style="clear:left;"></div><div style="float:right;padding-top:2px;margin-bottom:-5px;">'
    + ucendol(data) +'</div>';
 
  var par = tgt.parentNode; // trying node tr
  Dom.Ev(par, 'mouseout', function(e){
      if(gvar.stillOnIt) return;
      e = e.target || e;      
      Dom.get('_ucnddiv'+x).style.display = 'none';
  });
  Dom.Ev(par, 'mouseover', function(e){
      e = e.target || e;
      var imgObj = Dom.get('img_cont'+x);
      var img = getTag('img', imgObj);
      if(!img && imgObj.innerHTML!='[no-avatar]'){
        var parts = imgObj.innerHTML.split('||');
        imgObj.innerHTML = '';
        if(isDefined(parts[0]) && parts[0]!=''){
         var el = createEl('img', {src:parts[0], alt:parts[1]})
         imgObj.appendChild(el);
        }else{
         imgObj.innerHTML = '[no-avatar]';
        }           
      }
      Dom.get('_ucnddiv'+x).style.display = '';
  });
}
// end createSender()
 
function getBetween(text, regx){
  re = new RegExp(regx, "i");
  var cocokah = re.exec(text)
  return (cocokah ? cocokah[1] : "");
}
 
// save each data user as a buffer
function doSaveDat(userdata){  
  // existing data
  var data = getValue("KEY_SAVE_DATA");
  if(data && data.indexOf(gvar.user.id+'{')!=-1 ){
    var re = new RegExp(gvar.user.id+'{([^\\}]+)', "i");
    data = data.replace(re, '');
  }
  setValue("KEY_SAVE_DATA", userdata+data);
  
  // set expire time
  var Date_Now=new Date(); 
  Date_Now.setHours(Date_Now.getHours() + Math.floor(Math.abs(OPTIONS_BOX["INTERVAL_FORCE_RELOAD_USERDATA"])) );
  setValue("KEY_SAVE_EXPIRED", Date_Now.getTime().toString() );
}
 
function notExpired(){
  var lastSave = getValue('KEY_SAVE_EXPIRED');
  var Date_Now=new Date();
  if( lastSave ){
    return (Date_Now.getTime() > lastSave ? false : true);
  }else{
    return false;
  }  
}
 
// if type is not defined, return [id,username]
function getUserId(type){
  var xp="//a[contains(@href, 'member.php')]", id=[null,false], ret=false;
  var logusers=getByXPath(xp,false,'singlenode');
  if(logusers){
    var cDonat = getByXPath_containing('//td', false, 'Posted By');     
    id = logusers.href.match(/member\.php\?u=(\d+$)/);    
    if(isDefined(type)) {
      if(type=='id'){
        ret = id[1];        
      }else if(type=='name'){
        ret = logusers.innerHTML;
      }else if(type=='isDonatur'){
        ret = (isUndefined(cDonat[0]) ? false:true);
      }else{
        ret=false;        
      }
    }else{
      ret = {id:id[1], name:logusers.innerHTML, isDonatur:(isUndefined(cDonat[0]) ? false:true)};
    }
  }
  return ret;
}
 
// --- needed tool
function isDefined(x)   { return !(x == null && x !== null); }
function isUndefined(x) { return x == null && x !== null;    }
function isString(x) { return (typeof(x)!='object' && typeof(x)!='function'); }
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
function delValue(key) {
  //try{GM_deleteValue('KEY_SAVE_'+key);}catch(e){}
  try{GM_deleteValue(key);}catch(e){}
}
function getValue(key) {
  var data=OPTIONS_BOX[key];
  return (!data ? '': GM_getValue(key,data[0]));
}
function setValue(key, value) {
  var data=OPTIONS_BOX[key];
  return (!data ? '': GM_setValue(key,value));
}
function createEl(type, attrArray, html){
 var node = document.createElement(type);
 for (var attr in attrArray) 
   if (attrArray.hasOwnProperty(attr))
    node.setAttribute(attr, attrArray[attr]);
 if(html) node.innerHTML = html;
   return node;
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
function eval_XPath (xp, par) {
    if(isUndefined(par)) par = document;
    return document.evaluate(xp, par, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
}
// singlenode: singlenode or set of array
// value (singlenode only): value based on type object which is href;value;innerHTML
function getByXPath (xp, par, singlenode, value, ordered) {
  if(!par) par = document;
  if(!singlenode) singlenode = 'array';
  ordered = (!ordered ? XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE : XPathResult.ORDERED_NODE_SNAPSHOT_TYPE);  
  var ev = document.evaluate(xp, par, null, ordered, null);
  if(ev.snapshotLength) {
    if(singlenode=='singlenode'){
      ev = ev.snapshotItem(0);
      if(!value) return ev; // if value is not defined/requested then return as object/node
      var fret=null;
      switch(ev.nodeName.toLowerCase()){
        case 'a': 
          fret= ev.href;
          break;
        case 'input': 
          fret= ev.value;
          break;
        default: 
          fret= (gvar.isBuggedChrome ? ev.value : ev.innerHTML);
          break;
      }
      return fret;
    }else{
      return ev; // this is set of snapshotItem
    }
  }else{
    return null;
  }
}
 
function mass_append(parent, chnodes, serial){
  serial = (isUndefined(serial) ? true : false);
  var n=chnodes.length;
  if(typeof(parent)=='object' && typeof(chnodes)=='object' && n>0){
    if(serial){
      for(i=n-1;i>0;i--) chnodes[i-1].appendChild(chnodes[i]);
      parent.appendChild(chnodes[0]);
    }else{
      for(i=0;i<n;i++) parent.appendChild(chnodes[i]);
    }
  }
}
// end mass_append
function getTag(name, parent){
  var ret = (typeof(parent)!='object' ? document.getElementsByTagName(name) : parent.getElementsByTagName(name) );
  return (isDefined(ret[0]) ? ret : false);
}
function color(name,dark) {
  if(isDefined(dark)) { arguments.callee.dk=dark; return; }
  return color_change(arguments.callee.dk,name);
}
function color_change(dark,name) {
  return '#' + (!dark ? getValue('LIGHT_COLOR_'+name) : getValue('DARK_COLOR_'+name) );
}
function setValue(key, value, idx) {
  var data=OPTIONS_BOX[key];
  return (!data ? '': GM_setValue(key,value));
}
function getValue(key, idx) {
  var data=OPTIONS_BOX[key];
  return (!data ? '': GM_getValue(key,data[0]));
}
function option_turn(state) {
  if(isDefined(state)) {
    arguments.callee.laststate=state;
    if(isUndefined(arguments.callee.idInterval)) { arguments.callee.idInterval=0; }
    if(state && (arguments.callee.idInterval<=0)) { arguments.callee.idInterval=window.setInterval( function() { option_turn(); }, 100); }
  }
  else {
    var angle=draw_Button();
    if((angle%90==0) && !arguments.callee.laststate) { arguments.callee.idInterval=clearInterval(arguments.callee.idInterval); }
  }
}
function addTransparentCanvas(ParentEl,widthEl,heightEl) {
  var canvasEl=document.createElement('canvas');
  canvasEl.setAttribute('height',heightEl+'px');
  canvasEl.setAttribute('width' ,widthEl +'px');
  ParentEl.appendChild(canvasEl);
  return(canvasEl);
}
function draw_Button(angle,buttonCtx) {
  if(isDefined(buttonCtx)) { arguments.callee.mCtx=buttonCtx; }
  if(isDefined(angle)) { arguments.callee.mAngle=angle; } else { arguments.callee.mAngle=(arguments.callee.mAngle+10) % 360; }
  buttonCtx=arguments.callee.mCtx; angle=arguments.callee.mAngle;
  buttonCtx.fillStyle=color('DL_OPTIONS_TEXT');
  buttonCtx.clearRect(0,0,19,19);
  buttonCtx.save(); buttonCtx.translate(9.5,9.5); buttonCtx.rotate(Math.PI*angle/180); buttonCtx.translate(-9.5,-9.5);
  buttonCtx.beginPath(); buttonCtx.arc(9.5, 5,2.8,0,Math.PI*2,true); buttonCtx.fill();
  buttonCtx.beginPath(); buttonCtx.arc(9.5,14,2.8,0,Math.PI*2,true); buttonCtx.fill();
  buttonCtx.save(); buttonCtx.translate( 5,9.5); buttonCtx.rotate(Math.PI*45/180); buttonCtx.fillRect(-2.4,-2.4,4.8,4.8); buttonCtx.restore();
  buttonCtx.save(); buttonCtx.translate(14,9.5); buttonCtx.rotate(Math.PI*45/180); buttonCtx.fillRect(-2.4,-2.4,4.8,4.8); buttonCtx.restore();
  buttonCtx.restore();
  return(angle);
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

function show_alert(msg, force) {
  if(arguments.callee.counter) { arguments.callee.counter++; } else { arguments.callee.counter=1; }
  GM_log('('+arguments.callee.counter+') '+msg);
  if(force==0) { return; }
}
function clog(msg) {
  if(!gvar.__DEBUG__) return;
  show_alert(msg);
}
 
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
// end ApiBrowserCheck
 
// -- -- -- -- 
init();
// -- -- -- -- 
 
})();
/* Mod By Idx. */
