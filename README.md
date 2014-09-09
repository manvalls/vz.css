# vz css

[![NPM](https://nodei.co/npm/vz.css.png?downloads=true)](https://nodei.co/npm/vz.css/)

No piece of software is ever completed, feel free to contribute and be humble

**Note:** This package is supposed to be used in a browser context using a tool like browserify

## Sample usage:

```javascript

var css = require('vz.css'),
    bodyRule = css.add('body',{
      backgroundColor: 'black',
      fontSize: 'big'
    }),
    rotation = css.add('@keyframes rotation',{
      from: {
        transform: 'rotate(0deg)'
      },
      to: {
        transform: 'rotate(360deg)'
      }
    }),
    rot50;

bodyRule.set({
  fontSize: 'small' // Dynamically change the rules
});

css.remove(bodyRule); // Remove rule

rot50 = rotation.add('50%',{
  transform: 'rotate(90deg)' // Dynamically add a rule to an @rule
});

rotation.remove(rot50); // Remove the rule

```

## Reference

### CssGroup object

#### CssGroup.add(selector[,properties])
#### CssGroup.addTxt(css text)

Adds a css rule to the group. If the added rule is also a group of rules, eg an @supports rule, a new CssGroup is returned, in other case a [Capsule](https://www.npmjs.org/package/vz.capsule "vz.capsule") with the css declaration as internal object will be returned.

#### CssGroup.remove(rule)

Removes rules from the group. *rule* is the object returned from CssGroup.add, once it has been removed from the CssGroup there's no way to add it back, a new rule must be created.



