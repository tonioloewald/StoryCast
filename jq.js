// super minimal jQuery replacement
var $ = function(s){ 
    if( typeof s === 'function' ){
        setTimeout( s, 0 );
    } else if( typeof s === 'string' ){
        return document.querySelectorAll(s)
    }
};

$.noop = function(){};
$.log = function(msg){ console.log( msg ); };
$.identity = function(x){ return x; };

Object.prototype.extend = function( obj ){
    self = this;
    obj.each( function(prop){
        self[prop] = this;
    });
}

// JSON
$.json = function(url, data, method, success, failure, complete){
    data = data || false;
    method = method || 'GET';
    success = success || $.log;
    failure = failure || $.noop;
    complete = complete || $.noop;
    
    var xmlhttp =  new XMLHttpRequest();

    xmlhttp.onreadystatechange = function() {
        var data;
        if( xmlhttp.readyState !== 4){
            return;
        }
        if( Math.floor( xmlhttp.status / 100 ) !== 2 ){
            failure.call(this);
            return;
        }
        try {
            data = xmlhttp.responseText ? JSON.parse( xmlhttp.responseText ) : null;
        } catch(e){
            data = null;
        }
        success.call(this, data );
    }
    
    if( data && method.match(/GET|DELETE/) ){
        data.each( function(prop){
            if( url.indexOf('?') < 0 ){
                url += '?' + prop + '=' + this;
            } else {
                url += '&' + prop + '=' + this;
            }
        });
    }

    xmlhttp.open(method, url, true);
    xmlhttp.send(JSON.stringify(data));
}

// shims for Safari
if( !$('body').querySelector ){
    NodeList.prototype.querySelector = function(selector){
        if( this.length >= 1 ){
            console.warn( 'querySelector not fully implemented' );
            return this[0].querySelector(selector);
        }
    }
}
if( !$('body').querySelectorAll ){
    NodeList.prototype.querySelectorAll = function(selector){
        if( this.length >= 1 ){
            console.warn( 'querySelector not fully implemented' );
            return this[0].querySelectorAll(selector);
        }
    }
}

// iterators
Object.prototype.each = function( f ){
    for( i in this ){
        if( this.hasOwnProperty(i) ){
            if( f.call(this[i], i) === false ){
                return;
            };
        }
    }
};
NodeList.prototype.each = function( f ){
    for( var i = 0; i < this.length; i++ ){
        if( f.call(this[i], i) === false ){
            return;
        }
    }
    return this;
}

// safely access deep properties by name
Object.prototype.valueByName = function(key, value){
    key = key.split(/\./);
    var i = 0,
        lastPart,
        member = this;
    
    if( value ){
        if( key.length ){
            lastPart = key.pop();
            key.each(function(){
                if( member[this] === undefined ){
                    member[this] = {};
                }
                member = member[this];
            });
        }
        member[lastPart] = value;
        return this;
    } else {
        key.each(function(){
            if( typeof member[this] === undefined ){
                member = undefined;
                return false;
            } else {
                member = member[this];
            }
        });
        return member;
    }
}

// DOM utilities
Node.prototype.toNodeList = function(){
    var fragment = document.createDocumentFragment();
    fragment.appendChild(this);
    return fragment.childNodes;
}
Node.prototype.addClass = function( c ){
    if( !this.classList.contains(c) ){
        this.classList.add(c);
    }
    return this;
}
Node.prototype.removeClass = function( c ){
    if( this.classList.contains(c) ){
        this.classList.remove(c);
    }
    return this;
}
NodeList.prototype.addClass = function( c ){
    this.each( function(){
        this.addClass(c);
    });
    return this;
};
NodeList.prototype.removeClass = function( c ){
    this.each( function(){
        this.removeClass(c);
    });
    return this;
};
NodeList.prototype.toggleClass = function( c ){
    this.each( function(){
        if( this.classList.contains(c) ){
            this.classList.remove(c);
        } else {
            this.classList.add(c);
        }
    });
    return this;
};
NodeList.prototype.css = function( prop, val ){
    this.each( function(){
        this.css( prop, val );
    });
    return this;
};
Node.prototype.css = function( prop, val ){
    var settings = prop,
        style = this.style;
    if( typeof prop !== 'object' ){
        settings = {};
        settings[prop] = val;
    }
    settings.each( function( prop ){
        if( style[prop] !== undefined ){
            style[prop] = this;
        } else {
            // convert prop to camelcase
            prop = prop.replace(/-([a-z])/g, '\U\2');
            if( style[prop] !== undefined ){
                style[prop] = this;
            }
        }
    });
    return this;
};
Node.prototype.attr = function( prop, val ){
    var settings = prop,
        node = this;
    if( typeof prop !== 'object' ){
        settings = {};
        settings[prop] = val;
    }
    settings.each(function(prop){
        node.setAttribute(prop, this);
    });
    return this;
};
Node.prototype.hide = function(){
    if( this.style.display !== 'none' ){
        this.attr('data-display', this.style.display);
        this.css('display','none');
    }
    return this;
};
Node.prototype.show = function(){
    this.css('display', this.getAttribute('data-display') || "block");
    return this;
}
NodeList.prototype.hide = function(){
    this.each(function(){ this.hide() });
    return this;
};
NodeList.prototype.show = function(){
    this.each(function(){ this.show() });
    return this;
};
Node.prototype.is = function(selector){
    return $(selector).indexOf(this) >= 0;
};
Node.prototype.closest = function(selector){
    var elt = this;
    while( elt ){
        if( elt.is(selector) ){
            return elt;
        } else {
            elt = elt.parentElement;
        }
    }
    return elt; // will be null if not found
};
NodeList.prototype.indexOf = function(elt){
    var found = -1;
    this.each(function(idx){
        if(this === elt){
            found = idx;
            return false;
        }
    });
    return found;
};
NodeList.prototype.remove = function(){
    this.each( function(){
        this.remove();
    });
}

// events
function on(evt, f){
    this.addEventListener(evt, f);
    return this;
}
window.on = on;
Node.prototype.on = on;
NodeList.prototype.on = function(evt, f){
    this.each( function(){
        this.on( evt, f );
    });
    return this;
}

// binding
Node.prototype.table = function(rows, decorators){
    decorators = decorators || {};
    var tbody = this.querySelector('tbody'),
        templateRow = tbody.querySelector('.template').css('display', 'none');
    
    tbody.querySelectorAll('.instance').remove();
    rows.each(function(){
        var row = this,
            tr = templateRow.cloneNode(true).removeClass('template').addClass('instance').css('display','');
        tr.toNodeList().values(row, decorators);
        tbody.appendChild(tr);
    });
    return this;
}
NodeList.prototype.values = function(values, decorators){
    decorators = decorators || {};
    var setting = !!values,
        values = values || {};
    this.each(function(){
        this.querySelectorAll('[name]').each(function(){
            var name = this.getAttribute('name'),
                decorator = decorators[this.getAttribute('decorator')] || $.identity,
                value;
            if( name ){
                if( setting ){
                    if( values.valueByName(name) ){
                        value = decorator(valueByName(name));
                        if( this.type === 'file' ){
                            if( this.required && value ){
                                this.required = false;
                                this.setAttribute('data-required', true);
                            } else if ( this.getAttribute('data-required') && !value ) {
                                this.required = true;
                            }
                        } else if( this.value !== undefined ){
                            this.value = value;
                        } else if ( this.href !== undefined ) {
                            this.href = value;
                        } else if ( this.src !== undefined ){
                            this.src = value;
                        } else {
                            this.innerHTML = value;
                        }
                    }
                } else {
                    value = this.value || this.textContent.trim()
                    if( value ){
                        values.valueByName(name, value);
                    }
                }
            }
        });
    });
    if( setting ){
        return this;
    } else {
        return values;
    }
}