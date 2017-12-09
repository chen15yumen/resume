/*--LOADING--*/
let loadingRender = (function ($) {
    let $loadingBox = $('.loadingBox'),
        $run = $loadingBox.find('.run');

    //=>我们需要处理的图片
    let imgList = ["img/icon.png", "img/zf_concatAddress.png", "img/zf_concatInfo.png", "img/zf_concatPhone.png", "img/zf_course.png", "img/zf_course1.png", "img/zf_course2.png", "img/zf_course3.png", "img/zf_course4.png", "img/zf_course5.png", "img/zf_course6.png", "img/zf_cube1.png", "img/zf_cube2.png", "img/zf_cube3.png", "img/zf_cube4.png", "img/zf_cube5.png", "img/zf_cube6.png", "img/zf_cubeBg.jpg", "img/zf_cubeTip.png", "img/zf_emploment.png", "img/zf_messageArrow1.png", "img/zf_messageArrow2.png", "img/zf_messageChat.png", "img/zf_messageKeyboard.png", "img/zf_messageLogo.png", "img/zf_messageStudent.png", "img/zf_outline.png", "img/zf_phoneBg.jpg", "img/zf_phoneDetail.png", "img/zf_phoneListen.png", "img/zf_phoneLogo.png", "img/zf_return.png", "img/zf_style1.jpg", "img/zf_style2.jpg", "img/zf_style3.jpg", "img/zf_styleTip1.png", "img/zf_styleTip2.png", "img/zf_teacher1.png", "img/zf_teacher2.png", "img/zf_teacher3.jpg", "img/zf_teacher4.png", "img/zf_teacher5.png", "img/zf_teacher6.png", "img/zf_teacherTip.png"];

    //=>控制图片加载进度
    let total = imgList.length,
        cur = 0;
    let computed = function () {
        imgList.forEach(function (item) {
            let tempImg = new Image;
            tempImg.src = item;
            tempImg.onload = function () {
                tempImg = null;
                cur++;
                runFn();
            }
        });
    };

    //=>计算滚动条加载长度
    let runFn = function () {
        $run.css('width', cur / total * 100 + '%');
        if (cur >= total) {
            let delayTimer = setTimeout(() => {
                $loadingBox.remove();
                phoneRender.init();
                clearTimeout(delayTimer);
            }, 1500);
        }
    };

    return {
        init: function () {
            $loadingBox.css('display', 'block');
            computed();
        }
    }
})(Zepto);

/*--PHONE--*/
let phoneRender = (function ($) {
    let $phoneBox = $('.phoneBox'),
        $time = $phoneBox.find('.time'),
        $listen = $phoneBox.find('.listen'),
        $listenTouch = $listen.find('.touch'),
        $detail = $phoneBox.find('.detail'),
        $detailTouch = $detail.find('.touch');

    let audioBell = $('#audioBell')[0],
        audioSay = $('#audioSay')[0];

    let $phonePlan = $.Callbacks();

    //=>控制盒子的显示隐藏
    $phonePlan.add(function () {
        $listen.remove();
        $detail.css('transform', 'translateY(0)');
    });

    //=>控制SAY播放
    $phonePlan.add(function () {
        audioBell.pause();
        audioSay.play();
        $time.css('display', 'block');

        //=>随时计算播放时间
        let sayTimer = setInterval(() => {
            //=>总时间和已经播放时间:单位秒
            let duration = audioSay.duration,
                current = audioSay.currentTime;
            let minute = Math.floor(current / 60),
                second = Math.floor(current - minute * 60);
            minute < 10 ? minute = '0' + minute : null;
            second < 10 ? second = '0' + second : null;
            $time.html(`${minute}:${second}`);

            //=>播放结束
            if (current >= duration) {
                clearInterval(sayTimer);
                enterNext();
            }
        }, 1000);
    });

    //=>DETAIL-TOUCH
    $phonePlan.add(() => $detailTouch.tap(enterNext));

    //=>进入下一个区域(MESSAGE)
    let enterNext = function () {
        audioSay.pause();
        $phoneBox.remove();
        messageRender.init();
    };

    return {
        init: function () {
            $phoneBox.css('display', 'block');

            //=>控制BELL播放
            audioBell.play();

            //=>LISTEN-TOUCH
            $listenTouch.tap($phonePlan.fire);
        }
    }
})(Zepto);

/*--MESSAGE--*/
let messageRender = (function ($) {
    let $messageBox = $('.messageBox'),
        $talkBox = $messageBox.find('.talkBox'),
        $talkList = $talkBox.find('li'),
        $keyBord = $messageBox.find('.keyBord'),
        $keyBordText = $keyBord.find('span'),
        musicAudio = $messageBox.find('#musicAudio')[0];
    $submit = $keyBord.find('.submit');
    let $plan = $.Callbacks();
    //=>控制消息列表逐条显示
    let step = -1,
        autoTimer = null,
        interval = 1500,
        offset = 0;
    $plan.add(() => {
        autoTimer = setInterval(() => {
            step++;
            let $cur = $talkList.eq(step);

            $cur.css({
                opacity: 1,
                transform: 'translateY(0)'
            });
            //=>当第三条完全展示后立即调取出键盘（step===2 && 当前LI显示的动画已经完成）
            if (step === 2) {
                //=>transitionend 当前元素正在运行的CSS3过渡动画已经完成就会触发这个事件；（有几个元素样式需要改变，就会被触发执行几次）；
                //=》zepto和jQ中有个方法one，想要实现的事件只绑定依次，触发依次后，给事件绑定的方法自动移除
                $cur.one('transitionend', () => {
                    $keyBord.css('transform', 'translateY(0)').one('transitionend', textMove);
                });
                clearInterval(autoTimer);
                return;
            }
            ;
            //=>从第五条开始，每当展示一个LI，都需要让UL整体上衣
            if (step >= 4) {
                offset += -$cur[0].offsetHeight;
                $talkBox.css('transform', `translateY(${offset}px)`);

            }
            //=>已经把LI都展示了：结束动画，进入到下一个区域即可；
            if (step >= $talkList.length - 1) {
                clearInterval(autoTimer);
                let delayTimer = setTimeout(() => {
                    musicAudio.pause();
                    $messageBox.remove();
                    cubeRender.init();
                    clearTimeout(delayTimer);
                }, interval)
            }
        }, interval);
    });
    //=>控制文字及其打印机效果
    let textMove = function () {
        let text = $keyBordText.html();
        $keyBordText.css('display', 'block').html('');
        let timer = null,
            n = -1;
        timer = setInterval(() => {
            if (n >= text.length) {
                //=>打印机效果完成：让发送按钮显示(并且给其绑定点击事件)
                clearInterval(timer);
                $keyBordText.html(text);
                $submit.css('display', 'block').tap(() => {
                    $keyBordText.css('display', 'none');
                    $keyBord.css('transform', 'translateY(3.7rem)');
                    $plan.fire();//=>此时计划表中只有一个方法，重新通知计划表中这个方法执行；

                });
                return;
            }
            n++;
            $keyBordText[0].innerHTML += text.charAt[n];
        }, 100)
    }

    return {
        init: function () {
            $messageBox.css('display', 'block');
            musicAudio.play();
            $plan.fire();
        }
    }
})(Zepto);
/*messageRender.init();*/

//=>只要再移动端浏览器中实现话哦对那个操作们都需要把浏览器默认的滑动行为(例如：页卡切换等)禁止掉
$(document).on('touchstart touchmove touchend', function (e) {
    e.preventDefault();
})
var cubeRender = (function (e) {
    let $cubeBox = $('.cubeBox');
    let $box = $cubeBox.find('.box');
    let touchBegin = function (e) {

        let point = e.changedTouches[0];
        $(this).attr({
            strX: point.clientX,
            strY: point.clientY,
            isMove: false,
            changeX: 0,
            changeY: 0
        })


    };
    let touching = function (e) {
        let point = e.changedTouches[0],
            $this = $(this);
        let changeX = point.clientX - parseFloat($this.attr('strX')),
            changeY = point.clientY - parseFloat($this.attr('strY'));
        if (Math.abs(changeX) > 10 || Math.abs(changeY) > 10) {
            $this.attr({
                isMove: true,
                changeX: changeX,
                changeY: changeY
            })
        }

    };
    let touchEnd = function (e) {
        let point = e.changedTouches[0],
            $this = $(this);
        let isMove = $this.attr('isMove'),
            changeX = parseFloat($this.attr('changeX')),
            changeY = parseFloat($this.attr('changeY')),
            rotateX = parseFloat($this.attr('rotateX')),
            rotateY = parseFloat($this.attr('rotateY'));
        if (isMove === 'false') return;
        rotateX = rotateX - changeY * 10;
        rotateY = rotateY + changeX * 10;
        $this.css(`transform`, `scale(.6) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`).attr({
            rotateX: rotateX,
            rotateY: rotateY
        })
    };


    return {
        init: function () {
            $cubeBox.css('display', 'block');
            //=>事件绑定实现效果
            $box.attr({
                rotateX: -30,
                rotateY: 45
            }).on({
                touchstart: touchBegin,
                touchmove: touching,
                touchend: touchEnd
            });
            $box.find('li').tap(function () {
                $cubeBox.css('display', 'none');
                let index = $(this).index();
                detailRender.init(index);
            })

        }
    }
})();
/*
cubeRender.init();*/

let detailRender = (function () {
    let $detailBox = $('.detailBox'),
        $returnLink = $detailBox.find('.returnLink'),
        $cubeBox = $(".cubeBox"),
        swipeExample = null;

    let change = function (example) {
        console.log(swipeExample === example);
        //example.activeIndex //=>当前活动块的索引；
        //=>example.slides//=>数组，存储了当前所有活动块
        // example.slides[example.activeIndex] //=>当前活动块
        let $makisuBox = $('#makisuBox');
        let {slides: slideAry, activeIndex} = example;
        if (activeIndex === 0) {
            $makisuBox.makisu({
                selector:'dd',
                overlap:0.6,
                speed:0.8
            })
            $makisuBox.makisu('open');
        } else {
            $makisuBox.makisu({
                selector:'dd',
                overlap:0,
                speed:0
            });
            $makisuBox.makisu('close');
        }

        //=》给当前活动块设置ID，其他块移除ID
        [].forEach.call(slideAry,(item,index)=>{
            if(index===activeIndex){
                item.id='page'+(activeIndex+1);
                return;
            }else{
                item.id=null;
            }
        })

    };

    return {
        init: function (index = 0) {
            $detailBox.css('display', 'block');
            $returnLink.tap(() => {
                $detailBox.css('display', 'none');
                $cubeBox.css('display', 'block');
            });
            //init swiper
            if (!swipeExample) { //=>不存在实例的情况下我们初始化，如果已经初始化过了，下一次直接运动到具体位置即可，不需要重新初始化
                swipeExample = new Swiper('.swiper-container', {
                    effect: 'coverflow',
                    onInit:change,
                    onTransitionEnd:change,
                    /* loop:true*/ //->如果使用3D效果，不要设置loop（循环衔接）：true >部分安卓机有BUG

                });


            }
            index = index > 5 ? 5 : index;
            swipeExample.slideTo(index, 0);//+>运动到指定索引的slide位置，第二个参数是speed,我们设置0是让其立即运动到指定位置


        }
    }
})();
loadingRender.init();
detailRender.init(1);

/*
 *基于swiper首先每一个页面的动画
 * 1、滑到某一个页面的时候，给当前页面设置一个ID，例如：滑动到第二个页面,我们给其设置一个ID=page2
 * 2、当滑出这个页面的时候，我们吧之前设置的ID移除掉
 * 3、我们吧当前页面中元素需要的动画效果全部写在指定的ID下
 *
 * #page2 h2{
 *  animation:xxx 1s ....
 * }
 *   细节处理
 *   1、我们是基于animate.css帧动画完成的动画
 *   2、我们让需要运动的元素初始样式:opacity=0 （开始是隐藏的）
 *   3、当设置ID让其运动的时候，我们自己在动画完成的时候，让其透明度为1
 * */

