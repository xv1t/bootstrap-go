/**
 * Quick helper for build Bootstrap 4 interface on the fly
 * 
 * @link https://github.com/xv1t/bootstrap-go
 * @link https://getbootstrap.com/docs/4.3
 */

'use strict';

class BootstrapGo {
    
    /**
     * Check function from Function or from string funcname
     * @param {string|function} func
     * @returns {Function}
     */
    static getFunction( func ) {
        if ( typeof func === 'function' ) {
            return func;
        }
        
        if ( typeof func === 'string' ) {
            return new Function( "return typeof " + func + " === 'function' ? " + func + ":function(){console.error('Function [" + func + "]: is not defined')}" )();
        }
    }
    
    /**
     * Add 'on' listen events from object keys to obj
     * 
     * @param {jquery|string} obj
     * @param {object} on
     * @returns {jQuery}
     */
    static applyEvents( obj, options = {} ) {
        
        var on;
        
        if ( options.on ) {
            on = options.on;
        }
          
        for ( var eventName in on ) {
            $( obj ).on( eventName, this.getFunction( on[eventName] ) );
        }
        
        /* @link https://api.jquery.com/category/events/mouse-events/ */
        for ( var _event of [ 'click', 'dblclick', 'hover', 'contextmenu', 'toggle', 'mousedown', 'mouseenter', 'mouseleave', 'mouseout', 'mouseover', 'mouseup' ] ) {
            if ( options[_event] ) {
                $( obj ).on( _event, this.getFunction( options[ _event ] ) );
            }
        }
        
        return $( obj );
    }
    
    /**
     * Generate class for size `lg` or `sm`
     * 
     * @param {string} baseName
     * @param {object} options
     * @param {jQuery} $object
     * @returns {jQuery}
     */
    static applySize( baseName, options, $object ) {
        if ( options.size ) {
            $object.addClass( baseName + '-' + options.size )
        }
        return $object;
    }
    
    /**
     * Add contextual class
     * 
     * @param {string} baseName
     * @param {object} options
     * @param {jQuery} $object
     * @returns {jQuery}]
     */
    static applyStyle( baseName, options, $object ) {
        if ( options.style ) {
            $object.addClass( baseName + '-' + options.style )
        }
        return $object
    }
    
    /**
     * Apply [css] key to object
     * 
     * @param {string|jQuery} object
     * @param {object} options
     * @returns {jQuery}
     */
    static applyCss( object, options ) {
        if ( options.css ) {
            $( object ).css( options.css );
        }
        return $( object );
    }
    
    /**
     * Add spacing class from options key
     * 
     * @link https://getbootstrap.com/docs/4.3/utilities/spacing/
     * @param {type} object
     * @param {type} options
     * @returns {undefined}
     */
    static spacing( object, options ) {
        var property = {
            m: 'margin',
            p: 'padding'
        }
        
        var sides = {
            t: 'top',
            b: 'bottom',
            l: 'left',
            r: 'right',
            x: [ 'left', 'right' ],
            y: [ 'top', 'bottom' ]
        };
        
        for ( var _prop in property ) {
            for ( var _side in sides ) {
                var word = _prop + _side;
                if ( word in options ) {
                    $( object ).addClass( word + '-' + options[ word ] );
                }
            }
        }
        return object;
    }
    
    /**
     * Recalculate parent from options
     * 
     * @param {type} options
     * @param {type} parent
     * @returns {undefined}
     */
    static setParent( options = {}, parent = null, context ) {
        if ( options.parent ) {
            options.parent = $( options.parent );
            return;
        }
        
        if ( parent ) {
            options.parent = $( parent );
            return;
        }
        
        if ( !context instanceof this )
            options.parent = $( context );
    }
    
    /**
     * Create button object and return it, or append to parent
     * 
     * @link https://getbootstrap.com/docs/4.3/components/buttons/
     * @param {object} options
     * @returns {BootstrapGo.btn.$btn|jQuery}
     */
    static button( options = {}, parent = null ) {
        Object.assign( options, 
        {            
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
        
        this.setParent( options, parent );
        
        var $btn = $( '<' + options.tag + '>' )
            .addClass( 'btn' );
    
        //style
        $btn.addClass( [
            'btn',
            options.outline ? '-outline' : '',
            '-' + options.style
        ].join( '' ) );
        
        //size
        this.applySize( 'btn', options, $btn );
        
        //block
        if ( options.block === true ) {
            $btn.addClass( 'btn-block' );
        }
        
        BootstrapGo.spacing( $btn, options );

        if ( options.disabled === true ) {
            options.attr[ 'disabled' ] = true;
        }

        if ( options.active === true ) {
            $btn.addClass( 'active' );
        }
        
        if ( options.class ) {
            $btn.addClass( options.class );
        }
        
        switch ( options.tag ) {
            case 'a':
                Object.assign( options.attr, {
                    href: options.attr.href || '#',
                    role: 'button'
                } );
                $btn.html( options.content );
                if ( options.disabled === true ) {
                    $btn.addClass( 'disabled' );
                    options.attr[ 'aria-disabled' ] = 'true';
                }
                break;
                
            case 'input':
                Object.assign( options.attr, {
                    type: options.type,
                    value: options.label
                } );
                break;
                
            case 'button':
                Object.assign( options.attr, {
                    type: options.type
                } );

                $btn.html( options.content );
                break;
        }

        if ( options.data ) {
            $btn.data( options.data );
        }
        
        this.spacing( $btn, options );  
        
        BootstrapGo.applyEvents( $btn, options );

        
        $btn.attr( options.attr );
        
        if ( options.parent ) {
            $( options.parent ).append( $btn );
        }

        return $btn;
    }

    /**
     * @link https://getbootstrap.com/docs/4.3/components/dropdowns/#split-button
     * @param {type} options
     * @param {type} parent
     * @returns {undefined}
     */
    static dropdownSplitButton( options = {}, parent ) {
        var $container = $( '<div>' )
            .addClass( 'btn-group' );

        if ( options.class ) {
            $container.addClass(options.class);
        }
        
        var $button = this.button( options.button );
        
        $container.append( $button );
        
        var $toggle_button = this.button( {
            style: options.button.style,
            size: options.button.size,
            content: '<span class="sr-only">Toggle Dropdown</span>',
            attr: {
                'data-toggle'  : "dropdown", 
                'aria-haspopup': "true" ,
                'aria-expanded': "false"
            }
        } );

        $toggle_button.addClass( 'dropdown-toggle dropdown-toggle-split' );
        
        this.spacing( $toggle_button, options.button );
        
        $container.append( $toggle_button );
        $container.append( this.dropdownMenu( options ) );
        if ( $container.parent ) {
            $( parent ).append( $container );
        }
        
        return $container;
    }
    
    static dropdownMenu( options, parent ) {
       var $dropdown_menu = $( '<div>' )
                .addClass( 'dropdown-menu' );
                
        for ( var action of options.content ) {
            if ( action === '-' ) {
                $dropdown_menu.append( $( '<div class="dropdown-divider">' ) );
                continue;
            }
            
            action.attr = action.attr || {};
            action.attr.href = action.attr.href || action.href || '#'; 
            
            var $a = $( '<a>' )
                .html( action.content )
                .addClass( 'dropdown-item' )
                .attr( action.attr );

            this.applyEvents( $a, action );
            
            $dropdown_menu.append( $a );
        }
        
        if ( parent ) {
            $( parent ).append( $dropdown_menu );
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
    static dropdownSingleButton( options = {}, parent ) {
        var $dropdown = $( '<div>' )
                .addClass( 'btn-group' );
        
        var $button = this.button( options.button );
        
        $button
            .addClass( 'dropdown-toggle' )
            .attr( {
                'data-toggle'  : 'dropdown',
                'aria-haspopup': "true", 
                'aria-expanded': "false"
        } );
                
        var $dropdown_menu = this.dropdownMenu( options );
        $dropdown.append( $button );
        $dropdown.append( $dropdown_menu );
        
        this.setParent( options, parent );
        
        if ( options.parent )
            $( options.parent ).append( $dropdown );
        
        return $dropdown;
    }
    
    /**
     * Return random unique string
     * 
     * @returns {String}
     */
    static uniqueid( prefix ) {
        prefix = prefix || 'id';
        return prefix + ( Math.random()*1000000000000 ).toFixed( 0 );
    }
    
    /**
     * @link https://getbootstrap.com/docs/4.3/components/button-group/
     * @param {type} buttons
     * @param {type} options
     * @returns {jQuery}
     */
    static buttonGroup( options = {}, parent ) {
        options.content = options.content || [];
        var $btn_group = $( '<div>' )
            .addClass( 'btn-group' )
            .attr( {
                role: 'group',
                'aria-label': options[ 'aria-label' ] || ''
            } );
            
        for ( var btn of options.content ) {
            if ( btn instanceof jQuery ) {
                $btn_group.append( btn );
            } else {
                btn.parent = $btn_group;
                this.button( btn );
            }
        }
        
        if ( options.size ) {
            $btn_group.addClass( 'btn-group-' + options.size );
        }
        
        if ( options.class ) {
            $btn_group.addClass( options.class );
        }
        
        if ( options.attr ) {
            $btn_group.attr( options.attr );
        }
        
        this.spacing( $btn_group, options );
        this.setParent( options, parent );
        
        if ( options.parent ) {
            $( options.parent ).append( $btn_group );
        }
        
        return $btn_group;
    }
    
    /**
     * @link https://getbootstrap.com/docs/4.3/components/button-group/#button-toolbar
     * @param {type} btn_groups
     * @param {type} options
     * @returns {jQuery}
     */
    static buttonToolbar( options = {}, parent = null ) {
        options.content = options.content || [];
        var $btn_toolbar = $( '<div>' )
            .addClass( 'btn-toolbar' )
            .attr( {
                role: 'toolbar'
            } );
            
        for ( var btn_group of options.content ) {
            if ( btn_group instanceof jQuery ) {
                $btn_toolbar.append( btn_group );
            } else {                
                btn_group.parent = $btn_toolbar;
                this.buttonGroup( btn_group );
            }
        }
        
        if ( options.attr ) {
            $btn_toolbar.attr( options.attr );
        }
        
        this.spacing( $btn_toolbar, options );
        this.setParent( options, parent );
        
        if ( options.parent ) {
            $( options.parent ).append( $btn_toolbar );
        }

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
    static navTabs( options, parent ) {
        var $nav_tabs = $( '<div>' )
                .addClass( 'nav nav-tabs' )
                .attr( {
                    role: 'tablist'
                } );
        var $tab_content = $( '<div>' )
                .addClass( 'tab-content' );
        
        var activeTabChecked = false;
        
        for ( var item of options.content ) {
            if ( typeof item.nav === 'string' ) {
                item.nav = {
                    content: item.nav,
                    attr: {}
                };
            }
 
            if ( typeof item.pane === 'string' ) {
                item.pane = {
                    content: item.pane,
                    attr: {}
                };
            }
            
            if ( $.isPlainObject(item.pane) && item.pane._type ){
                item.pane = { content: item.pane, attr: {} };
            }
            
            var pane_id = this.uniqueid( 'pane' ),
                tab_id = pane_id + '-tab';
            
            
            item.nav.attr = item.nav.attr || {};
            
            Object.assign( item.nav.attr, 
            {
                id: tab_id,
                'data-toggle': "tab", 
                href: "#" + pane_id, 
                role: "tab", 
                'aria-controls': pane_id, 
                'aria-selected': "true"
            } );
            
            var $a = $( '<a>' )
                .addClass( 'nav-item nav-link' )
                .html( item.nav.content )
                .attr( item.nav.attr );
        
            $nav_tabs.append( $a );
            
            item.pane.attr = item.pane.attr || {};
            
            Object.assign( item.pane.attr, {
                id: pane_id, 
                role: "tabpanel", 
                'aria-labelledby': tab_id
            } );
            
            var $pane = $( '<div>' )
                    .attr( item.pane.attr )
                    .addClass( 'tab-pane fade' );
            
            if ( typeof item.pane.content === 'string' ) {
                    $pane.html( item.pane.content );
            }
            
            if ( $.isPlainObject(item.pane.content) && item.pane.content._type ){
                    $pane.append( this.buildElement( item.pane.content ) );
            }
            
            if ( item.pane.content instanceof jQuery ) {
                    $pane.append( item.pane.content );
            }
            
            if ( item.active === true ) {
                $a.addClass( 'active' );
                $pane.addClass( 'active show' );
                activeTabChecked = true;
            }
            
            $tab_content.append( $pane );
        }
        
        if ( !activeTabChecked ) {
            $tab_content.find( '> .tab-pane:first' )
                    .addClass( 'active show' );
            $nav_tabs.find( '> a:first' )
                    .addClass( 'active' );
        }
        
        var $container = $( '<div>' )
                .addClass( 'bootstrap-go-navtabs' );
        
        $container
            .append( $( '<nav>' ).append( $nav_tabs ) )
            .append( $tab_content );
        
        this.spacing( $container, options );
        
        if ( options.parent ) {
            $( options.parent ).append( $container );
        }
        
        if ( parent ) {
            $( parent ).append( $container );
        }
        
        return $container;
    }
    
    static row( options = {}, parent ) {
        var $row = $( '<div class="row">' );
        for ( var item of options.content ) {
            
            if ( typeof item === 'string' || typeof item === 'number' ) {
                item = { content: item };
            }
            
            if ( item instanceof jQuery ){
                item = { content: item };
            }
            
            if ( $.isPlainObject(item) && item._type ){
                item = { content: item };
            }
            
            var $col = $( '<div>' );
            
            if ( item.col || options.col ) {
                $col.addClass( 'col-' + ( item.col || options.col ) );
            }
            
            for ( var aspect of [ 'sm', 'md', 'lg', 'xl' ] ) {
                if ( item[aspect] || options[aspect] ) {
                    $col.addClass( 'col-' + aspect + '-' + ( item[aspect] || options[aspect] ) );
                }
            }
            
            if ( typeof item.content === 'string' ) {
                $col.html( item.content );
            }
            
            if ( item.content instanceof jQuery ) {
                $col.append( item.content );
            }  else if ( $.isPlainObject(item.content) && item.content._type ) {
                $col.append( this.buildElement( item.content ) );
            }  else{
                $col.html( item.content );
            }
            
            
            this.applyEvents( $col, item );

            this.spacing( $col, item );
            
            $row.append( $col );
        }
        
        this.setParent( options, parent );        
        this.spacing( $row, options );
        
        if ( options.parent ) {
            $( parent ).append( $row );
        }
        
        return $row;
    }
    
    static paginationItem( options, pageNumber, label ) {
        var $li = $( '<li class="page-item">' );
        var $a  = $( '<a class="page-link">'  );

        $a.html( label || pageNumber );
        $a.attr( 'href', '#' );
        $a.attr( 'data-page', pageNumber );

        if ( typeof options.change === 'function' ) {
            $a.click( function() {
                var page = $( this ).data( 'page' );
                options.change.call( this, page );
            } );
        }

        if ( pageNumber === options.pages.current ) {
            $li.addClass( 'active' );
            $a = $( '<span class="page-link">' ).text( pageNumber );
        }

        $li.append( $a );
        
        return $li;
    }
    
    /**
     * @link https://getbootstrap.com/docs/4.3/components/pagination/
     * @param {type} options
     * @param {type} parent
     * @returns {undefined}
     */
    static pagination( options, parent ) {
        var $nav = $( '<nav>' );
        var $pagination = $( '<ul class="pagination">' );
        $nav.append( $pagination );
        
        options.pages = options.pages || { total: 40, limit: 9, current: 4 };
        options.buttons = options.buttons || {};
        
        if ( options.buttons.first === true ) {
            $pagination.append( this.paginationItem( options, 1, '|<' ) );
        }
        
        if ( options.buttons.prev === true ) {
            $pagination.append( this.paginationItem( options, options.pages.current - 1, '<' ) );
        }
        
        for ( var pageNumber = 1; pageNumber <= options.pages.limit; pageNumber++ ) {
            var $pagination_item = this.paginationItem( options, pageNumber );
            $pagination.append( $pagination_item );
        }
        
        if ( options.buttons.next === true ) {
            $pagination.append( this.paginationItem( options, options.pages.current + 1, '>' ) );
        }
        
        if ( options.buttons.last === true ) {
            $pagination.append( this.paginationItem( options, options.pages.total , '>|' ) );
        }
        
        this.setParent( options, parent );
        
        if ( options.parent ) {
            $( parent ).append( $nav );
        }
        
        return $nav;
    }
    
    /**
     * @example 
     *  options = {
     *      height: 40,
     *      mb: 4,
     *      bar: [
     *          20,
     *          {
     *              value: 25,
     *              bg: 'success'
     *          },
     *          {
     *              value: 17,
     *              striped: true,
     *              animated: true
     *          }
     *      ]
     *  }
     * @link https://getbootstrap.com/docs/4.3/components/progress/
     * @param {object} options
     * @returns {undefined}
     */
    static progress( options, parent ) {
        var $progress = $( '<div class="progress">' );
        
        if ( options.height ) {
            $progress.css( 'height', options.height );
        }
        
        if ( options.bar) {
            if ( typeof options.bar === 'object' &&
                !options.bar instanceof Array ) {
                options.bar = [
                    options.bar
                ];
            }
            
            if ( typeof options.bar === 'number' ) {
                options.bar = [
                    {
                        value: options.bar
                    }
                ]; 
            }
        }
        
        for ( var bar of options.bar ) {
            
            var $bar = $( '<div class="progress-bar">' );
            
            if ( typeof bar === 'number' ) {
                bar = {
                    value: bar
                };
            }
            
            bar.attr = bar.attr || {};
            bar.attr.role = 'progressbar';
            bar.attr[ 'aria-valuenow' ] = bar.value || 0;
            bar.attr[ 'aria-valuemin' ] = bar.min   || 0;
            bar.attr[ 'aria-valuemax' ] = bar.max   || 100;
            
            /* @link https://getbootstrap.com/docs/4.3/components/progress/#striped */
            if ( bar.striped === true ) {
                $bar.addClass( 'progress-bar-striped' );
            }
            
            /* @link https://getbootstrap.com/docs/4.3/components/progress/#animated-stripes */
            if (bar.animated === true) {
                $bar.addClass( 'progress-bar-animated' );
            }
            
            /* @link https://getbootstrap.com/docs/4.3/components/progress/#backgrounds */
            if ( bar.bg ) {
                $bar.addClass( 'bg-' + bar.bg );
            }
            
            $bar
                .css( 'width', bar.value + '%' )
                .attr( bar.attr );
            
            $progress.append( $bar );
        }
             
        this.spacing( $progress, options );
        
        if ( options.attr ) {
            $progress.attr( options.attr );
        }
        
        this.setParent( options, parent );
        
        if ( options.parent ) {
            $( parent ).append( $progress );
        }
        
        return $progress;        
    }
    
    static formGroup( options ) {};
    
    static formInput( options, parent ) {
        options.type = options.type || 'text';
        options.attr = options.attr || {};
        
        options.attr.type  = options.type;
        options.attr.value = options.value;
        options.attr.name  = options.name;
        
        
        var $input = $( '<INPUT>' )
                .attr( options.attr );
        
        return $input;
    }
    
    /**
     * Return data from key path, such as 'data.User.id'
     * 
     * @param {PlainObject} data
     * @param {string} key
     * @returns {mixed}
     */
    static getPlainObjectData( data, key ) {
        var _tmpFunc = new Function( 'data', "return data." + key );
        var value = _tmpFunc( data );
        _tmpFunc = undefined;
        return value;        
    }
    
    static getPlainObjectValueType( data, key ) {
        return typeof this.getPlainObjectData( data, key );
    }
    
    /**
     * Set key value by the path, for example, 'data.User.name' to 'John'
     * 
     * @param {PlainObject} data
     * @param {string} key
     * @param {mixed} value
     * @returns {PlainObjectS}
     */
    static setPlainObjectData( data, key, value ){
        var _tmpFunc;
        
        if ( typeof value === 'string' ) {
            _tmpFunc = new Function( 'data', 'key', 'value', "data." + key + " = '" + value + "'" );
        } else if (typeof value === 'object') {
            _tmpFunc = new Function( 'data', 'key', 'value', "data." + key + " = " + JSON.stringify( value ) );
        } else {
            _tmpFunc = new Function( 'data', 'key', 'value', "data." + key + value );
        }        
        
        _tmpFunc(data, key, value);
        _tmpFunc = undefined;
        return data;
    }
    
    /**
     * 
     * @param {mixed} element
     * @returns {Boolean}
     */
    static isElementObject(element, _type){
        if ( _type ) {
            return $.isPlainObject( element ) && element._type && element._type === _type;
        } else {
            return $.isPlainObject( element ) && element._type;
        }
    }
    
    /**
     * Build input form element from options
     * 
     * @param {type} options
     * @param {type} data
     * @returns {undefined}
     */
    static input( options = {}, data ) {
        var $form_group = $( '<div class="form-group">' );
        
        options.attr = options.attr || {};
        if ( !options.attr.id ) {
            options.attr.id = 'Input' + options.dataField.replace( /\./g, '' );
        }
        
        if ( options.required ) {
            options.attr.required = true;
        }
        
        if ( !options.label && options.dataField ) {
            options.label = options.dataField.replace( /\./g, ' ' );
        }
        
        var $label;
        
        if ( options.label ) {
            $label = $('<label>')
                    .attr('for', options.attr.id)
                    .html(options.label);
        }
        
        if ( !options.attr.name ) {
            options.attr.name = 'data[' + options.dataField.replace( /\./g, '][' ) + ']';
        }
        
        var $input;
        
        switch (options.type) {
            case 'text':
            case 'number':
                $input = $( '<input>' )
                        .attr( options.attr )
                        .attr( 'type', options.type )
                        .addClass('form-control' );
                $form_group.append( $label );
                break;
                
            case 'select':
                $input = $('<select>')
                    .attr( options.attr )
                    .addClass('form-control' );                
                
                for ( var key in options.options ) {
                    var $option = $( '<OPTION>' )
                            .attr( 'value', key )
                            .text( options.options[ key ] );
                    $input.append( $option );
                }
                $form_group.append( $label );
                break;
                
            case 'checkbox':
                $form_group.removeClass( 'form-group') .addClass( 'form-check' );
                
                var $input_hidden = $( '<input type="hidden" value="0">' )
                        .attr( 'id', options.attr.id )
                        .attr( 'value', "0" )
                        .attr( 'name', options.attr.name );
                
                $form_group.append( $input_hidden );
                
                $input = $( '<input value="98432987438976">' )
                        .attr( options.attr )
                        .attr( 'type', options.type )
                        .attr( '_value', "1" )
                        .addClass( 'form-check-input' );
                break;
                
            default:
                
                break;
        }
        
        
        /* @link https://getbootstrap.com/docs/4.3/components/forms/#help-text */
        if ( options.helpBlock ) {
            $form_group.append( $( '<small class="form-text text-muted">' ).html( options.helpBlock ) )
        }
        
        if ( data && options.dataField && $input){
            $input.val( this.getPlainObjectData( data, options.dataField ) );
        }
        
        $form_group.append( $input );
        
        if ( options.type === 'checkbox' ) {
            $label.addClass('form-check-label');
            $form_group.append( $label );
        }
        
        return $form_group;
    }

    /**
     * Build HTML form
     * 
     * @param {PlainObject} options
     * @param {string|jQuery} parent
     * @returns {jQuery}
     */
    static form( options, parent ) {
        var $form = $( '<form>' );
        
        options.attr = options.attr || {};
        options.data = options.data || {};
        options.hidden = options.hidden || {};
        options.attr.action = options.action;
        options.method = options.method || 'POST';
        
        if ( options.method.toUpperCase() === 'GET' ) {
            $form.append( this.formInput( {
                name: '_method',
                value: 'GET',
                type: 'hidden'
            } ) );
            options.attr.method = 'GET';
        } else {
            options.attr.method = 'POST';
            $form.append( this.formInput( {
                type: 'hidden',
                name: '_method',
                value: options.method.toUpperCase()                
            } ) );
        }
        
        if ( options.hidden ) {
            for ( var hiddenField in options.hidden ) {
                var hiddenOptions = {
                    name: hiddenField,
                    value: options.hidden[ hiddenOptions ],
                    type: 'hidden'
                };
                $form.append( this.formInput( hiddenOptions ) );
            }
        }
        
        $form.attr( options.attr );
        
        //Fieldsets
        options.fieldsets = options.fieldsets || [];
        
        for ( var fieldset of options.fieldsets ) {
            fieldset.attr = fieldset.attr || {};
            fieldset.elements = fieldset.elements || [];
            
            var $fieldset = $( '<fieldset>' )
                    .attr( fieldset.attr );
            if ( fieldset.legend ) {
                $fieldset.append( $( '<legend>' ).html( fieldset.legend ) );
            }
            
            for ( var element of fieldset.elements ) {
                var $element;
                if ( this.isElementObject( element ) ) {
                    if ( element._type === 'input' ) {
                        element.options.type = element.options.type || 'text';
                        $element = this.input(element.options, options.data);
                    }
                }
                $fieldset.append($element);
            }
 
            $form.append( $fieldset );
        }

        if ( parent ) {
            console.log($(parent));
            $( parent ).append( $form );
        }
        
        //console.log( $( '<div>' ).append( $form ).html() );
        
        return $form;
    }
    
    /**
     * Generate simple jQuery element from PlainObject options
     * 
     * @param {PlainObject} options
     * @param {string|jQuery} parent
     * @returns {jQuery}
     */
    static element( options = {}, parent ) {        
        options         = options         || {};
        options.tag     = options.tag     || 'div';
        options.content = options.content || '';
        options.attr    = options.attr    || {};
        options.css     = options.css     || {};
        options.class   = options.class   || '';
        
        var $element = $( '<' + options.tag + '>' )
            .attr( options.attr )
            .html( options.content )
            .css( options.css )
            .addClass( options.class );
        
        this.applyEvents( $element, options );
        this.spacing( $element, options );        
        
        if ( options.parent ) {
            $( parent ).append( $element );
        }

        return $element;
    }
    
    /**
     * Build $object from PlainObject options
     * 
     * @param {PlainObject} options
     * @returns {jQuery}
     */
    static buildElement( options = {}, parent ){
        options._type = options._type || 'element';
        
        var $element;
            
            switch ( options._type ) {                    
                case 'group':
                    $element = this.render( options );
                    break;
                    
                default:                    
                    if ( typeof this[ options._type ] === 'function' ) {
                        $element = this[ options._type ]( options.options );
                    } else {
                        console.error( '_type [' + options._type + '] not found!' );
                    }
                    break;
            }
        if ( parent ) {
            $( parent ).append( $element );
        }
            
        return $element;
    }
    
    /**
     * Create full UI Bootstrap style from PlainObject options
     * 
     * @param {object} options
     * @param {jQuery|string} parent
     * @returns {undefined}
     */
    static render( options = {}, parent ) {
        var $render;
        
        if ( parent ) {
            $render = $( parent );
        } else {
            $render = $( '<div>' );
        }
        
        for ( var element of options.elements ) {
            if ( element instanceof jQuery ) {
                $render.append( element );
                continue;
            }
            
            if ( typeof element === 'string' ) {
                $render.append( $( element ) );
                continue;
            }            
            
            $render.append( this.buildElement( element ) );
        }
        
        return $render;
    }
}