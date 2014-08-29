var Capsule = require('vz.capsule'),
    Property = require('vz.property'),
    
    sheet = new Property(),
    RE = /[A-Z]|(^(webkit|moz|ms|o)(?=[A-Z]))/g,
    atRE = /^(@[^ {]+)(.*)$/;

function CssGroup(sh,extra){
  var i,keys;
  
  sheet.of(this).value = sh;
  
  if(extra){
    keys = Object.keys(extra);
    for(i=0;i<keys.length;i++) this.add(keys[i],extra[keys[i]]);
  }
}

function addRule(sheet,rule){
  if(sheet.insertRule) sheet.insertRule(rule,sheet.cssRules.length);
  else sheet.appendRule(rule);
  return sheet.cssRules[sheet.cssRules.length - 1];
}

function hyphenize(m){
  return '-' + m.toLowerCase();
}

function JSONtoCSS(obj){
  var ret = '',i,
      keys = Object.keys(obj),j;
  
  for(i=0;i<keys.length;i++){
    j = keys[i];
    ret += j.replace(RE,hyphenize) + ': ' + obj[j] + '; ';
  }
    
  return ret;
}

Object.defineProperties(CssGroup.prototype,{
  addTxt: {value: function(txt){
    var ret = addRule(sheet.of(this).value,txt);
    
    if(ret.style) return new Capsule(ret.style);
    else if(ret.cssRules) return new CssGroup(ret);
    else return new Capsule(ret);
    
  }},
  add: {value: function(selector,properties){
    var sh = sheet.of(this).value,
        rule,
        atSelector,
        rest,
        match,
        ret;
    
    properties = properties || {};
    
    match = selector.match(atRE);
    
    if(match){
      atSelector = match[1];
      rest = match[2];
    }else{
      atSelector = '';
      rest = selector;
    }
    
    switch(atSelector){
      case '@keyframes':
        
        try{
          rule = addRule(sh,'@keyframes' + rest + '{}');
        }catch(e){
          rule = addRule(sh,'@-webkit-keyframes' + rest + '{}');
        }
        
        return new CssGroup(rule,properties);
      case '@document':
      case '@media':
      case '@supports':
        return new CssGroup(addRule(sh,selector + '{}'),properties);
      case '@charset':
      case '@import':
      case '@namespace':
        return addRule(sh,selector + ';');
      case '@font-face':
        rule = addRule(sh,selector + '{' + JSONtoCSS(properties) + '}');
        return new Capsule(rule.style);
      default:
      // @page
        rule = addRule(sh,selector + '{}');
        
        ret = new Capsule(rule.style);
        ret.set(properties);
        return ret;
    }
    
  }},
  remove: {value: function(r){
    var sh = sheet.of(this).value,
        rule = r.get?r.get():sheet.of(r).value,
        rules = sh.cssRules,
        i;
    
    for(i = 0;i < rules.length;i++) if(rules[i] == rule || rules[i].style == rule) break;
    if(i == rules.length) return;
    
    sh.deleteRule(i);
  }}
});

(function(){
  var style = document.createElement('style');
  document.head.appendChild(style);
  
  module.exports = new CssGroup(style.sheet);
})();

