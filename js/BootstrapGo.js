/**
 * Quick helper for build Bootstrap 4 interface on the fly
 * 
 * @link https://github.com/xv1t/bootstrap-go
 * @link https://getbootstrap.com/docs/4.3
 */

'use strict';

class BootstrapGo{
    
    /**
     * Add 'on' listen events from object keys to obj
     * 
     * @param {jquery|string} obj
     * @param {object} on
     * @returns {jQuery}
     */
    static applyEvents(obj, on = {}){
        if (!on)
            return;
        for (var eventName in on){
            $(obj).on(eventName, on[eventName]);
        }
        return $(obj);
    }
    
    /**
     * Generate class for size `lg` or `sm`
     * 
     * @param {type} baseName
     * @param {type} options
     * @param {type} $object
     * @returns {undefined}
     */
    static applySize(baseName, options, $object){
        if (options.size){
            $object.addClass(baseName + '-' + options.size)
        }
    }
    
    static applyStyle(baseName, options, $object){
        if (options.style){
            $object.addClass(baseName + '-' + options.style)
        }
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
            p: 'padding'
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
     * Recalculate parent for options
     * 
     * @param {type} options
     * @param {type} parent
     * @returns {undefined}
     */
    static setParent(options = {}, parent = null, context){
        if (options.parent){
            options.parent = $(options.parent);
            return;
        }
        
        if (parent){
            options.parent = $(parent);
            return;
        }
        
        if (!context instanceof this)
            options.parent = $(context);
    }
    
    /**
     * Create button object and return it, or append to parent
     * 
     * @link https://getbootstrap.com/docs/4.3/components/buttons/
     * @param {object} options
     * @returns {BootstrapGo.btn.$btn|jQuery}
     */
    static button(options = {}, parent = null){
        
        Object.assign(options, {            
            tag: options.tag || 'button',
            attr: options.attr || {},
            type: options.type || 'button',
            outline: options.outline || false,
            style: options.style || 'primary',
            size: options.size || '',
            block: options.block || false,
            active: options.active || false,
            disabled: options.disabled || false,
            content: options.content || 'No label!'
        });
        
        this.setParent(options, parent);
        
        var $btn = $('<' + options.tag + '>')
            .addClass('btn');
    
        //style
        $btn.addClass([
            'btn',
            options.outline ? '-outline' : '',
            '-' + options.style
        ].join(''));
        
        //size
        this.applySize('btn', options, $btn);
        
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
                $btn.html(options.content);
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
                
                $btn.html(options.content);
                break;
        }
        
        if (options.data){
            $btn.data(options.data);
        }
        
        this.spacing($btn, options);  
        
        if (options.on){
            BootstrapGo.applyEvents($btn, options.on);
        }
        
        $btn.attr(options.attr);
        
        if (options.parent)
            $(options.parent).append($btn);
        
        return $btn;
    }
    
    /**
     * @link https://getbootstrap.com/docs/4.3/components/dropdowns/#split-button
     * @param {type} options
     * @param {type} parent
     * @returns {undefined}
     */
    static dropdownSplitButton(options = {}, parent){
        var $container = $('<div>')
            .addClass('btn-group');
    
        if (options.class)
            $container.addClass(options.class);
        
        var $button = this.button(options.button);
        
        $container.append($button);
        
        var $toggle_button = this.button({
            style: options.button.style,
            size: options.button.size,
            content: '<span class="sr-only">Toggle Dropdown</span>',
            attr: {
                'data-toggle': "dropdown", 
                'aria-haspopup': "true" ,
                'aria-expanded': "false"
            }
        });
        $toggle_button.addClass('dropdown-toggle dropdown-toggle-split');
        
        this.spacing($toggle_button, options.button);
        
        $container.append($toggle_button);
        $container.append(this.dropdownMenu(options));
        if ($container.parent)
            $(parent).append($container);
        
        return $container;
    }
    
    
    static dropdownMenu(options, parent){
       var $dropdown_menu = $('<div>')
                .addClass('dropdown-menu');
                
        for (var action of options.content){
            if (action === '-') {
                $dropdown_menu.append($('<div class="dropdown-divider">'));
                continue;
            }
            action.attr = action.attr || {};
            action.attr.href = action.attr.href || action.href || '#'; 
            var $a = $('<a>')
                    .html(action.content)
                    .addClass('dropdown-item')
                    .attr(action.attr);
            this.applyEvents($a, action.on);
            
            $dropdown_menu.append($a);
        }
        
        if (parent){
            $(parent).append($dropdown_menu);
        }
        
        return $dropdown_menu;
    }
    
    /**
     * 
     * options
     *  - "button" - button options
     *  - "content" - Array - actions
     *  @link https://getbootstrap.com/docs/4.3/components/dropdowns/#single-button
     * @param {type} options
     * @returns {undefined}
     */
    static dropdownSingleButton(options = {}, parent){
        var $dropdown = $('<div>')
                .addClass('btn-group');
        
        var $button = this.button(options.button);
        $button.addClass('dropdown-toggle');
        $button.attr({
            'data-toggle': 'dropdown',
            'aria-haspopup': "true", 
            'aria-expanded': "false"
        });
                
        var $dropdown_menu = this.dropdownMenu(options);
        $dropdown.append($button);
        $dropdown.append($dropdown_menu);
        
        this.setParent(options, parent);
        
        if (options.parent)
            $(options.parent).append($dropdown);
        
        return $dropdown;
    }
    
    /**
     * Return random unique string
     * 
     * @returns {String}
     */
    static uniqueid(prefix){
        prefix = prefix || 'id';
        return prefix + (Math.random()*1000000000000).toFixed(0);
    }
    
    /**
     * @link https://getbootstrap.com/docs/4.3/components/button-group/
     * @param {type} buttons
     * @param {type} options
     * @returns {jQuery}
     */
    static buttonGroup(options = {}, parent){
        options.content = options.content || [];
        var $btn_group = $('<div>')
            .addClass('btn-group')
            .attr({
                role: 'group',
                'aria-label': options['aria-label'] || ''
            });
            
        for(var btn of options.content) {
            if (btn instanceof jQuery){
                $btn_group.append(btn);
            } else {
                btn.parent = $btn_group;
                this.button(btn);
            }
        }
        
        if (options.size)
            $btn_group.addClass('btn-group-' + options.size);
        
        if (options.class)
            $btn_group.addClass(options.class);
        
        if (options.attr)
            $btn_group.attr(options.attr);
        
        this.spacing($btn_group, options);        
        this.setParent(options, parent);
        
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
    static buttonToolbar(options = {}, parent = null){
        options.content = options.content || [];
        var $btn_toolbar = $('<div>')
            .addClass('btn-toolbar')
            .attr({
                role: 'toolbar'
            })
            
        for (var btn_group of options.content){
            if (btn_group instanceof jQuery){
                $btn_toolbar.append(btn_group);
            } else {                
                btn_group.parent = $btn_toolbar;
                this.buttonGroup(btn_group);
            }
        }
        
        if (options.attr)
            $btn_toolbar.attr(options.attr);
        
        this.spacing($btn_toolbar, options);
        this.setParent(options, parent);
        
        if (options.parent)
            $(options.parent).append($btn_toolbar);
        
        console.log($btn_toolbar);
        
        return $btn_toolbar;
            
    }
    
    /**
     * 
     * @link https://getbootstrap.com/docs/4.3/components/navs/#javascript-behavior
     * 
     * @param {type} options
     * @param {type} parent
     * @returns {undefined}
     */
    static navTabs(options, parent){
        var $nav_tabs = $('<div>')
                .addClass('nav nav-tabs')
                .attr({
                    role: 'tablist'
                });
        var $tab_content = $('<div>')
                .addClass('tab-content');
        
        var activeTabChecked = false;
        
        for (var item of options.content){
            if (typeof item.nav === 'string'){
                item.nav = {
                    content: item.nav,
                    attr: {}
                };
            }
 
            if (typeof item.pane === 'string'){
                item.pane = {
                    content: item.pane,
                    attr: {}
                };
            }
            
            var pane_id = this.uniqueid('pane');
            var tab_id = pane_id + '-tab';
            
            
            item.nav.attr = item.nav.attr || {};
            
            Object.assign(item.nav.attr, {
                id: tab_id,
                'data-toggle': "tab", 
                href: "#" + pane_id, 
                role: "tab", 
                'aria-controls': pane_id, 
                'aria-selected': "true"
            });
            
            var $a = $('<a>')
                .addClass('nav-item nav-link')
                .html(item.nav.content)
                .attr(item.nav.attr);
        
            $nav_tabs.append($a);
            
            item.pane.attr = item.pane.attr || {};
            
            Object.assign(item.pane.attr, {
                id: pane_id, 
                role: "tabpanel", 
                'aria-labelledby': tab_id
            });
            
            var $pane = $('<div>')
                    .attr(item.pane.attr)
                    .addClass('tab-pane fade');
            if (typeof item.pane.content === 'string'){
                    $pane.html(item.pane.content);
            }
            if (item.pane.content instanceof jQuery){
                    $pane.append(item.pane.content);
            }
            
            if (item.active === true){
                $a.addClass('active');
                $pane.addClass('active show');
                activeTabChecked = true;
            }
            
            $tab_content.append($pane);
        }
        
        if (!activeTabChecked){
            $tab_content.find('> .tab-pane:first')
                    .addClass('active show');
            $nav_tabs.find('> a:first')
                    .addClass('active');
        }
        
        var $container = $('<div>')
                .addClass('bootstrap-go-navtabs');
        $container.append($('<nav>').append($nav_tabs));
        $container.append($tab_content);
        
        this.spacing($container, options);
        
        if (options.parent)
            $(options.parent).append($container);
        
        if (parent)
            $(parent).append($container);
        
        return $container;
    }
    
    static row(options = {}, parent){
        var $row = $('<div class="row">');
        for (var item of options.content){
            
            if (typeof item === 'string' || typeof item === 'number'){
                item = {content: item};
            }
            
            if (item instanceof jQuery){
                item = {content: item};
            }
            
            var $col = $('<div>');
            if (item.col || options.col)
                $col.addClass('col-' + (item.col || options.col));
            
            for (var aspect of ['sm', 'md', 'lg', 'xl']){
                if ( item[aspect] || options[aspect] )
                    $col.addClass('col-' + aspect + '-' + (item[aspect] || options[aspect]))
            }
            
            if (typeof item.content === 'string')
                $col.html(item.content);
            
            if (item.content instanceof jQuery)
                $col.append(item.content)
            else 
                $col.html(item.content);

            this.spacing($col, item);
            
            $row.append($col);
            console.log($col.html())
        }
        this.setParent(options, parent);
        
        this.spacing($row, options);
        
        if (options.parent)
            $(parent).append($row);
        
        return $row;
    }
    
    static formGroup(options){};
    
    static formInput(options, parent){
        options.type = options.type || 'text';
        options.attr = options.attr || {};
        
        options.attr.type = options.type;
        options.attr.value = options.value;
        options.attr.name = options.name;
        
        
        var $input = $('<INPUT>')
                .attr(options.attr);
        
        return $input;
    }

    static form(options, parent){
        var $form = $('<form>');
        
        options.attr = options.attr || {};
        options.attr.action = options.action;
        options.attr.method = options.action || 'POST';
        
        if (options.hidden){
            for (var hiddenField in options.hidden){
                var hiddenOptions = {
                    name: hiddenField,
                    value: options.hidden[hiddenOptions],
                    type: 'hidden'
                };
                $form.append(this.formInput(hiddenOptions));
            }
        }
        
        $form.attr(options.attr);
        
        console.log($('<div>').append( $form ).html());
        
        return $form;
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

