/**
 * Quick helper for build Bootstrap 4 interface on the fly
 * 
 * @link https://github.com/xv1t/bootstrap-go
 * @link https://getbootstrap.com/docs/4.3
 */

class BootstrapGo{
    
    /**
     * Add 'on' listen events from object keys to obj
     * 
     * @param {jquery|string} obj
     * @param {object} on
     * @returns {jQuery}
     */
    static applyEvents(obj, on = {}){
        for (var eventName in on){
            $(obj).on(eventName, on[eventName]);
        }
        return $(obj);
    }
    
    /**
     * @link https://getbootstrap.com/docs/4.3/utilities/spacing/
     * @param {type} object
     * @param {type} options
     * @returns {undefined}
     */
    static spacing(object, options){
        var property = {
            m: 'margin',
            p: 'paddong'
        }
        
        var sides = {
            t: 'top',
            b: 'bottom',
            l: 'left',
            r: 'right',
            x: ['left', 'right'],
            y: ['top', 'bottom']
        };
        
        for (var _prop in property){
            for (var _side in sides){
                var word = _prop + _side;
                if (word in options){
                    $(object).addClass(word + '-' + options[word]);
                }
            }
        }
        return object;
    }
    
    /**
     * Create button object and return it, or append to parent
     * 
     * @link https://getbootstrap.com/docs/4.3/components/buttons/
     * @param {object} options
     * @returns {BootstrapGo.btn.$btn|jQuery}
     */
    static btn(options = {}){
        
        Object.assign(options, {
            parent: options.parent ? $(options.parent) : this,
            tag: options.tag || 'button',
            attr: options.attr || {},
            type: options.type || 'button',
            outline: options.outline || false,
            style: options.style || 'primary',
            size: options.size || '',
            block: options.block || false,
            active: options.active || false,
            disabled: options.disabled || false,
            label: options.label || 'No label!'
        });
        
        var $btn = $('<' + options.tag + '>')
            .addClass('btn');
    
        //style
        $btn.addClass([
            'btn',
            options.outline ? '-outline' : '',
            '-' + options.style
        ].join(''));
        
        //size
        if (options.size){
            $btn.addClass('btn-' + options.size);
        }
        
        //block
        if (options.block === true){
            $btn.addClass('btn-block');
        }
        
        BootstrapGo.spacing($btn, options);

        if (options.disabled === true){
            options.attr['disabled'] = true;
        }

        if (options.active === true){
            $btn.addClass('active');
        }
        
        if (options.class){
            $btn.addClass(options.class);
        }
        
        switch (options.tag) {
            case 'a':
                Object.assign(options.attr, {
                    href: options.attr.href || '#',
                    role: 'button'
                });
                $btn.html(options.label);
                if (options.disabled === true){
                    $btn.addClass('disabled');
                    options.attr['aria-disabled'] = 'true';
                }
                break;
                
            case 'input':
                Object.assign(options.attr, {
                    type: options.type,
                    value: options.label
                });
                break;
                
            case 'button':
                Object.assign(options.attr, {
                    type: options.type
                });
                
                $btn.html(options.label);
                break;
        }
        
        if (options.data){
            $btn.data(options.data);
        }
        
        if (options.on){
            BootstrapGo.applyEvents($btn, options.on);
        }
        
        $btn.attr(options.attr);
        
        if (options.parent)
            $(options.parent).append($btn);
        
        return $btn;
    }
    
    static dropdown(options = {}){
        
    }
    
    /**
     * @link https://getbootstrap.com/docs/4.3/components/button-group/
     * @param {type} buttons
     * @param {type} options
     * @returns {jQuery}
     */
    static btnGroup(buttons = [], options = {}){
        var $btn_group = $('<div>')
            .addClass('btn-group')
            .attr({
                role: 'group',
                'aria-label': options['aria-label'] || ''
            });
        for(var btn of buttons) {
            if (btn instanceof jQuery){
                $btn_group.append(btn);
            } else {
                btn.parent = $btn_group;
                BootstrapGo.btn(btn);
            }
        }
        
        if (options.size)
            $btn_group.addClass('btn-group-' + options.size);
        
        if (options.class)
            $btn_group.addClass(options.class);
        
        if (options.attr)
            $btn_group.attr(options.attr);
        
        BootstrapGo.spacing($btn_group, options);
        
        if (options.parent)
            $(options.parent).append($btn_group);
        
        return $btn_group;
    }
    
    /**
     * @link https://getbootstrap.com/docs/4.3/components/button-group/#button-toolbar
     * @param {type} btn_groups
     * @param {type} options
     * @returns {jQuery}
     */
    static btnToolbar(btn_groups = [], options = {}){
        var $btn_toolbar = $('<div>')
            .addClass('btn-toolbar')
            .attr({
                role: 'toolbar'
            })
            
        for (var btn_group of btn_groups){
            if (btn_group instanceof jQuery){
                $btn_toolbar.append(btn_group);
            } else {
                var _buttons;
                var _options;
                [_buttons, _options] = btn_group;
                _options.parent = $btn_toolbar;
                BootstrapGo.btnGroup(_buttons, _options);
            }
        }
        
        if (options.attr)
            $btn_toolbar.attr(options.attr);
        
        BootstrapGo.spacing($btn_toolbar, options);
        
        if (options.parent)
            $(options.parent).append($btn_toolbar);
        
        console.log($btn_toolbar);
        
        return $btn_toolbar;
            
    }
    
    /**
     * Create full UI Bootstrap style from object-array options
     * 
     * @param {type} options
     * @returns {undefined}
     */
    static render(options){
        
    }
}

class bs extends BootstrapGo{};
