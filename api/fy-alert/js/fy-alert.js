var zIndex = 2501314;
var fyAlertKey = 0;         

var fyAlert = {
    alert : function(opts){
        var fyAlertOpt = {
            title    :'提示', //标题
            icon     : '',
            content  : '',    //内容 
            skin     : '',    //皮肤
            position : 'fixed',//定位方式
            closeBtn : true,   //是否显示关闭按钮
            type     : 1,      //type=2 为iframe
            drag     : false,   //是否开启拖动
            time     : 2000,   //当无头或无底部按钮时自动关闭时间
            shadow   : [0.3,'#000'], //遮罩
            shadowClose : true,  //是否点击遮罩关闭
            animateType : 0, // 0为默认动画 1为底部弹出 2为顶部弹出 3为左部弹出 4为右部弹出
            aniExtend: '',   //例 css动画名 opacity
            area     : ['auto','auto'], //设置宽高
            minmax   : false,
            direction: ['center','center'], //方向 key1:right left center  key2: top bottom center
            btns     : {                   //按钮组
               /* '确定' : function(){},*/
            },
            success  : function(){},  //弹出后回调
            end      : function(){}   //关闭后回调
        };       
        this.params = $.extend({},fyAlertOpt,opts);
        
        this.setParamsFun();
        //icon图片设置
        this.createElem(); //创建Element
        return this.deepCopy(this);
    },

    msg : function(content,opts){ 

        var fyAlertOpt = {
            title    :false, //标题
            icon     : '',
            content  : content,    //内容
            skin     : 'fy-alert-msg',    //皮肤
            position : 'fixed',//定位方式
            closeBtn : false,   //是否显示关闭按钮
            type     : 1,      //type=2 为iframe
            drag     : false,   //是否开启拖动
            time     : 2000,   //当无头或无底部按钮时自动关闭时间
            shadow   : false, //遮罩
            shadowClose : false,  //是否点击遮罩关闭
            animateType : 1, // 0为默认动画 1为底部弹出 2为顶部弹出 3为左部弹出 4为右部弹出
            aniExtend: '',   //例 css动画名 opacity 此参数存在后animateType无效
            area : ['auto','auto'],
            direction: ['center','center'], //方向 key1:right left center  key2: top bottom center
            btns     : {                   //按钮组
               /* '确定' : function(){},*/
            },
            success  : function(){},  //弹出后回调
            end      : function(){}   //关闭后回调
        };       
        
        this.params = $.extend({},fyAlertOpt,opts);
        
        this.setParamsFun();
        this.createElem(); //创建Element
        return this;
    },

    setAnimateType : function(params){
        //动画类型
        this.animateType = '';
        if(params.aniExtend){
            this.animateType = params.aniExtend;
        }else{
            switch(params.animateType){
                case 0:
                    this.animateType = 'rollIn';
                    break;
                case 1:
                    this.animateType = 'slideBottom';
                    break;
                case 2: 
                    this.animateType = 'slideTop';
                    break;
                case 3: 
                    this.animateType = 'slideLeft';
                    break;
                case 4: 
                    this.animateType = 'slideRight';
                    break;
                defalut:
                    this.animateType = 'slideBottom';
            }
        }
        
    },

    setParamsFun : function(){

        this.setAnimateType(this.params);
        //icon图片设置
        this.iconType = '';
         switch(this.params.icon){
            case 0:
                this.iconType = '';
                break;
            case 1:
                this.iconType = '&#xe602;';
                break;
            case 2: 
                this.iconType = '&#xe603;';
                break;
            case 3: 
                this.iconType = '&#xe631;';
                break;
            case 4: 
                this.iconType = '&#xe601;';
                break;
            case 5: 
                this.iconType = '&#xe600;';
                break;
            defalut:
                this.iconType = '';
        }
    },

     createElem : function(){
        var that = this;
        fyAlertKey = fyAlertKey += 1;

        //弹框DOM
        var alertBox = $("<div id=alertKey"+fyAlertKey+" style='width:"+this.params.area[0]+";height:"+this.params.area[1]+"' class='fy-alert-box "+this.params.skin+"'></div>"); 
        var alertTitle = $("<div class='fy-alert-header'>"+(this.params.title ? this.params.title : '')+"</div>"); 
        var alertContent = $("<div class='fy-alert-content'></div>");
        var alertShadow = !this.params.shadow ? '' : $("<div class='fy-alert-shadow'></div>");
        var alertFooter = $("<div class='fy-alert-footer'></div>");
        var closeBtn = $("<button class='fy-alert-close'><i class='alert-iconfont'>&#xe671;</i></button>");
        var iframe = $('<iframe class="fy-alert-iframe" src="'+this.params.content+'"></iframe>');
        var minmaxBtn = $("<button class='fy-alert-minmax'><i class='fy-alert-max-btn'></i></button>");

        var currentObj = {
            alertBox:alertBox,
            alertShadow:alertShadow,
            params:that.params
        };

        //设置关闭按钮
        if(this.params.closeBtn){
            alertTitle.append(closeBtn); 
            //绑定关闭按钮

            (function(that){
                closeBtn.bind('click',function(){
                    that.destory(currentObj);
                });
            })(that)
        }

        //设置内容
        if(this.params.type == 2){
            alertContent.addClass('fy-alert-content-iframe').append(iframe);
        }else{

            //当type == 1时iconType 有效
            if(this.iconType){
                alertContent.addClass('fy-alert-icon');
                var alertIconType = $('<i class="fy-alert-iconType'+this.params.icon+' alert-iconfont">'+this.iconType+'</i>')
                if(this.params.icon == 4 || this.params.icon == 5){
                    alertIconType.addClass('fy-alert-icon-loading');
                }
                alertContent.append(alertIconType);
            }
            this.params.content = typeof(this.params.content) == 'string' ? this.params.content : this.params.content.clone().show();
            alertContent.append(this.params.content);
            
        }


        this.alertBox = alertBox;
        this.alertShadow = alertShadow;
        this.alertContent = alertContent;
        this.alertTitle = alertTitle;
        this.alertFooter = alertFooter;
        this.minmaxBtn = minmaxBtn;

        //设置放大与缩放按钮
        if(this.params.minmax){
            this.minmaxType = 1;
            alertTitle.append(this.minmaxBtn); 
            (function(that){
                that.minmaxBtn.bind('click',function(){
                    that.scaleFun(that);
                });
            })(that.deepCopy(this))
            
        }

        //添加按钮组
        for(var key in this.params.btns){

            var btns = $('<button class="fy-alert-btn">'+key+'</button>');
            (function(index,that){
                btns.click(function(e){
                    that.params.btns[index](that);
                });
            })(key,that.deepCopy(that))

            alertFooter.append(btns);
        }

        //判断是否存在title
        if(this.params.title){
            alertBox.append(alertTitle);
        }
        alertBox.append(alertContent);

        //判断是否存在底部按钮
        if(alertFooter.find('.fy-alert-btn').length > 0){
            alertBox.append(alertFooter);
        }

        //如果无头部与尾部则自动关闭弹框
        if(!this.params.title && alertFooter.find('.fy-alert-btn').length == 0){
            
            (function(obj){
                setTimeout(function(){ 
                    that.destory(obj);
                },that.params.time);
            })(currentObj);
        }

        $('body').append(alertBox).append(alertShadow);

        //设置位置
        this.setAlertLocation();

        //设置内容区域高度
        this.setAlertContentHeight();
        //是否开启拖动
        if(this.params.drag){
            this.dragElem(alertTitle);
        }

        //层级添加
        this.addAlertZIndex(this.alertTitle);

        //点击遮罩是否可以关闭
        if(this.params.shadowClose){
            this.alertShadow.length && (function(obj){that.alertShadow.bind('click',function(){
                that.destory(obj);
            })})(currentObj);
        }

        //显示弹框
        this.show();

        //设置位置
        $(window).bind('resize',$.proxy(this,'setAlertLocation'));
     },

    deepCopy : function(obj) {

        var result = Array.isArray(obj) ? [] : {};
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
              if (typeof obj[key] === 'object' && obj[key]!==null && !(obj[key] instanceof jQuery) ) {
                result[key] = this.deepCopy(obj[key]);   //递归复制
              } else {
                result[key] = obj[key];
              } 
            }
        }

        return result;
    },

     //点击当前弹框增加层级
     addAlertZIndex : function($alertTitle){
        $alertTitle.bind('click',function(event){ 
            zIndex = zIndex+10;
            $alertTitle.css('z-index',zIndex);
            event.stopPropagation();    
        })
     },

     //拖放
     dragElem : function($alertBox){
        //鼠标按下，要在移动元素上按下
        $(document).on('mousedown',$alertBox,function(e){
            $('body').attr('onselectstart','return false');
            var ele = $(e.target).closest('.fy-alert-box');
            var initX = e.clientX,
                initY = e.clientY,
                itemX = parseInt(ele.css('left')),
                itemY = parseInt(ele.css('top'));
            $(document).on('mousemove',$alertBox,function(e){
                //移动鼠标时改变元素位置
                var curX = e.clientX,
                    curY = e.clientY;
                ele.css({
                    left:itemX + (curX - initX) + 'px',
                    top:itemY + (curY - initY) + 'px'
                });
                e.stopPropagation();
            });
            e.stopPropagation();
        });
        //鼠标放开
        $(document).on('mouseup',function(){
            $('body').attr('onselectstart','return true');
            //解除鼠标移动事件
            $(document).off('mousemove');
        });
     },

     //设置弹框位置
     setAlertLocation:function(){ 

         //设置样式对象
        this.setAlertStyle = {};

         //设置层级
        zIndex += 10;
        this.setAlertStyle['z-index'] = zIndex;

        //设置shadow样式
        this.alertShadow.length && this.alertShadow.css('z-index',zIndex-1);
        if($.isArray(this.params.shadow)){
            this.alertShadow.length && this.alertShadow.css({
                'opacity'    : this.params.shadow[0],
                'background' : this.params.shadow[1],
            })
        }else{
            this.alertShadow.length && this.alertShadow.css({
                'opacity'    : this.params.shadow,
            })
        }

        //设置位置
        this.setAlertStyle['position'] = this.params.position;

        this.alertBox.css(this.setAlertStyle);

        if(this.params.direction[0] == 'center'){
            this.setAlertStyle['margin-left'] = -this.alertBox[0].clientWidth / 2;
        }

        if(this.params.direction[1] == 'center'){
            this.setAlertStyle['margin-top'] = -this.alertBox[0].clientHeight / 2;
        }

        //设置左右位置
        if(/^\d/.test(this.params.direction)){
            this.setAlertStyle['left'] = this.params.direction[0];
        }else{
            if(this.params.direction[0] != 'center'){
                this.setAlertStyle[this.params.direction[0]] = 0;
            }else{
                this.setAlertStyle['left'] = '50%';
            }
        }

       //设置上下位置
       if(/^\d/.test(this.params.direction)){
            this.setAlertStyle['top'] = this.params.direction[1];
        }else{
            if(this.params.direction[1] != 'center'){
                this.setAlertStyle[this.params.direction[1]] = 0;
            }else{
                this.setAlertStyle['top'] = '50%';
            }
        }

        this.alertBox.css(this.setAlertStyle);
        //设置位置
     },

     //设置弹框内容高度
     setAlertContentHeight:function(){
        this.alertContent.css('height',this.alertBox[0].clientHeight - (!!this.alertTitle[0] ? this.alertTitle[0].clientHeight : 0) - this.alertFooter[0].clientHeight);
     },

     //缩放方法
     scaleFun:function(that){

        that = that ? that : this;
        
        if(that.minmaxType == 1){
            
            that.alertBox.css({
                width   : '100%',
                height  : '100%',
                "margin-left" : 0,
                "margin-top"  : 0,
                left    : 0,
                top     : 0
            });
            that.minmaxType = 2;
            that.minmaxBtn.find('i').removeClass('fy-alert-max-btn').addClass('fy-alert-min-btn');
        }else{
            that.alertContent.css('height','auto');
            that.alertBox.css({
                "margin-left" : 'auto',
                "margin-top"  : 'auto',
                left    : 'auto',
                top     : 'auto',
            })
            that.alertBox.css({
                width   : that.params.area[0],
                height  : that.params.area[1],
            })
            this.setAlertLocation();
            that.minmaxType = 1;
            that.minmaxBtn.find('i').removeClass('fy-alert-min-btn').addClass('fy-alert-max-btn');
        }

        //设置内容区域高度
        that.setAlertContentHeight();
       
     },

     //销毁方法
     destory : function(obj){

        var alertBox = $.isPlainObject(obj) ? obj.alertBox : this.alertBox;
        var alertShadow = $.isPlainObject(obj) ? obj.alertShadow : this.alertShadow;
        $.isPlainObject(obj) && this.setAnimateType(obj.params);
        alertBox.addClass(alertBox.addClass(this.animateType+'_hide'));
        alertShadow.length && alertShadow.fadeOut(300);

        (function(alertBox,alertShadow){
            setTimeout(function(){
                 alertBox.remove();
                 alertShadow.length && alertShadow.remove();
            },300)
        })(alertBox,alertShadow);
        
        
        typeof(this.params.end) == 'function' ? this.params.end(this) : console.warn('此参数必须是一个方法');
     },
     //隐藏方法
     hide : function(obj){
        var that = this;

        var alertBox = $.isPlainObject(obj) ? obj.alertBox : this.alertBox;
        var alertShadow = $.isPlainObject(obj) ? obj.alertShadow : this.alertShadow;
        $.isPlainObject(obj) && this.setAnimateType(obj.params);
        alertBox.addClass(alertBox.addClass(this.animateType+'_hide'));
        alertShadow.length && alertShadow.fadeOut(300);
        setTimeout(function(){
             alertBox.removeClass(that.animateType).removeClass(that.animateType+'_hide').hide();
        },300)
       
        typeof(this.params.end) == 'function' ? this.params.end(this) : console.warn('此参数必须是一个方法');
     },
     //显示方法
     show : function(obj){

        var alertBox = $.isPlainObject(obj) ? obj.alertBox : this.alertBox;
        var alertShadow = $.isPlainObject(obj) ? obj.alertShadow : this.alertShadow;
        $.isPlainObject(obj) && this.setAnimateType(obj.params);
        alertBox.show(0).addClass(this.animateType);
        alertShadow.length && alertShadow.fadeIn(300);
        typeof(this.params.success) == 'function' ? this.params.success(this) : console.warn('此参数必须是一个方法');
     }

}       