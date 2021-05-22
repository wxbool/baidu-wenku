$(function () {
    new PageScript();
});

class PageScript {
    constructor() {
        this.clear = false;
        let $this = this;

        $(function () {
            $this.pageEvent();
        });
    }

    pageEvent () {
        let $this = this;
        //正常加载页面
        //注入操作栏
        $("body").append($this.toolbarHtml());

        //清理文档多余DOM
        $("body").delegate("#myzoom_12138 ._clearDocumentDom_" , 'click' , function () {
            fyAlert.msg("正在清理中，请稍等！操作过程中，请勿关闭页面" , {icon:0,animateType:1,time:3000});

            function findDocumentAll (finishCallback) {
                $("#app .content-wrapper .reader-wrap .fold-page-content .read-all").click();
                let hide = $("#app .content-wrapper .reader-wrap .fold-page-content .read-all").is(':visible');

                if (!hide && $("#app .content-wrapper .reader-wrap .fold-page-content .read-all").length > 0) {
                    console.log("继续展开文档！");
                    setTimeout(function () {
                        findDocumentAll(finishCallback);
                    } , 2500);
                } else {
                    finishCallback && finishCallback();
                }
            }

            let totalIndex = 0;
            let lastOffsetTop = 0;
            let lastIndex = 0;
            let queue = [];

            function showDocumentPage(queue , finishCallback) {
                if (queue.length <= 0) {
                    finishCallback && finishCallback();
                    return;
                }

                let obj = queue[0];
                //清理内部文档
                $(`#reader-container .__wm${obj.index-1}`).remove();
                // $(`#reader-container .__wm${obj.index}`).remove();
                //校验渲染
                if (obj && $(obj.ele).find("> .loading-page").length > 0) {
                    //渲染
                    if (lastIndex) {
                        if (lastIndex != obj.index) {
                            if (lastOffsetTop >= obj.ele.offsetTop) {
                                $("html, body").animate({scrollTop:window.scrollY + 1000}, 1200);
                            } else {
                                $("html, body").animate({scrollTop:obj.ele.offsetTop + 350}, 1200);
                            }
                        } else {
                            $("html, body").animate({scrollTop:window.scrollY + 100}, 800);
                        }
                    } else {
                        $("html, body").animate({scrollTop:obj.ele.offsetTop + 350}, 1200);
                    }

                    fyAlert.msg(`正在渲染第${obj.index}页，请勿关闭页面` , {icon:0,animateType:1,time:1500});
                    lastOffsetTop = window.scrollY;
                    lastIndex = obj.index;
                } else {
                    queue.shift(); //移除项
                    if (obj && obj.index) fyAlert.msg(`第${obj.index}页渲染成功` , {icon:0,animateType:1,time:1000});
                }

                setTimeout(function () {
                    showDocumentPage(queue , finishCallback);
                } , 500);
            }


            setTimeout(function () {
                //尝试展开全部
                findDocumentAll(function () {
                    //查询页面列表
                    $("#reader-container div[data-page-no]").each(function (index , e) {
                        queue.push({ele:e , index:(index+1)});
                        totalIndex++;
                    });
                    //渲染页面
                    showDocumentPage(queue , function () {
                        //删除多余DOM
                        setTimeout(function () {
                            $("#app .header-wrapper").remove();
                            $("#app .content-wrapper .right-wrapper").remove();
                            $("#app .content-wrapper .doc-info-wrapper").remove();
                            $("#app .content-wrapper .no-full-screen").remove();
                            $("#app .content-wrapper .reader-wrap .fold-page-content").remove();
                            $("#app .content-wrapper .reader-wrap .try-end-fold-page").remove();
                            $("#app .content-wrapper .reader-wrap .copyright-wrap").remove();
                            $("#app .content-wrapper .hx-warp").remove(); //删除广告
                            $("#app .top-theme-tips-wrap").remove(); //删除广告
                            $("#app .bottom-pop-wrap").remove();
                            $("#app .footer-wrapper").remove();
                            $("#app .sidebar-wrapper").remove();
                            $("#app #page-footer").remove();

                            //清理内部文档
                            // $("#reader-container .reader-pic-item").remove();

                            //css
                            setTimeout(function () {
                                $("#app").css({background:"#fff"});
                                $("#app").removeClass("niunianxianding");
                                $("#app .content-wrapper .left-wrapper .reader-topbar").css({display:"none"});

                                // let pageHtmls = [];
                                // //遍历另存为页面
                                // $("#reader-container div[data-page-no]").each(function (index , e) {
                                //     let p = $(e).find(".reader-txt-layer .ie-fix").html();
                                //     pageHtmls.push(p);
                                //     // $(e).html("");
                                // });
                                // //移除整个文档
                                // $("#app .content-wrapper .left-wrapper #reader-container").html("");
                                // console.log(pageHtmls.join(""));
                                // //重新输出文档
                                // $("#app .content-wrapper .left-wrapper #reader-container").html(pageHtmls.join(""));

                                //同步宽度
                                setTimeout(function () {
                                    let docWidth = $("#app .content-wrapper .left-wrapper").width();
                                    $("#app .content-wrapper").css({width:docWidth});
                                } , 200)

                                fyAlert.msg("渲染成功，清理操作完成！" , {icon:0,animateType:1,time:1500});
                                $this.clear = true;
                            } , 500);
                        } , 1000);
                    });
                });
            } , 500);
        });


        $("body").delegate("#myzoom_12138 ._importDocument_" , 'click' , function () {
            if (!$this.clear) {
                fyAlert.msg("请先点击 “清理DOM”，再进行导出操作" , {icon:0,animateType:1,time:1500});return;
            }

            fyAlert.msg("请注意：<br/>1.目标打印机需要选择 “另存为PDF” 才能导出PDF文件 <br/>2.请在 更多设置 中，勾选 “背景图形”" , {icon:0,animateType:1,time:1500});
            $("#myzoom_12138").remove();
            //同步宽度
            let docWidth = $("#app .content-wrapper .left-wrapper").width();
            $("#app .content-wrapper").css({width:docWidth});

            setTimeout(function () {
                window.print();
            } , 1800);
        });
    }

    toolbarHtml() {
        return ` <div id="myzoom_12138">
                    <div class="_title">
                        百度文库
                    </div>
                    <div class="_btn">
                        <button type="button" class="btn-primary _clearDocumentDom_">清理DOM</button>
                        <button type="button" class="btn-primary _importDocument_">导出文档</button>
                         
                        <div style="clear: both;"></div>
                    </div>
                </div>`;
    }
}