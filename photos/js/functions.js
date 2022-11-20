function setOutherSize(e,w,h) { // set outer size, return inner size
    e.outerHeight(h).outerWidth(w);
    return {w:e.width(),h:e.height()};
}

function place(e,opts) {
    e.css("position","absolute");
    opts.collision  = opts.collision  || "none";
    e.parent($(opts.of));
    e.position(opts);
}

function onResizeWindow() {
    var w=$(window).width();
    var h=$(window).height();
    var mcs=setOutherSize($(".maincontent"),w,h);

    setOutherSize($("#navigator"),mcs.w*0.15,mcs.h);
    setOutherSize($("#viewer"),mcs.w*0.85,mcs.h);

    place($("#navigator"), { my:"left top", at: "left top", of: ".maincontent" });
    place($("#viewer"), { my:"right top", at: "right top", of: ".maincontent" });
    place($("#closebtn"), { my:"right top", at: "right top", of: "body" });
}

function i2s(v,d) {
    let s=`${v}`;
    while (s.length<d) s='0'+s;
    return s;
}

let elemToCenter=null;
let centeringTimer=null;
let prevYc=undefined;
function stopCentering() {
    if (centeringTimer) {
        clearTimeout(centeringTimer);
        centeringTimer=null;
    }
}
function startCentering(el) {
    elemToCenter=el;
    if (!centeringTimer) {
        prevYc=undefined;
        centeringTimer=setInterval(doCentering, 100);
    }
}
function doCentering() {
    if (!elemToCenter) {
        stopCentering();
        return;
    }
    let ye=elemToCenter.position().top+elemToCenter.height()/2.0;
    let yp=$("#navigator").position().top+$("#navigator").height()/2.0;
    let delta=(ye-yp)*0.75;
    if (delta>100) delta=100;
    if (delta<-100) delta=-100;
    let yc=$("#navigator").scrollTop();
    if (prevYc==yc) {
        stopCentering();
        return;
    }
    prevYc=yc;
//    console.log(elemToCenter.position().top,elemToCenter.height(),$("#navigator").position().top,$("#navigator").height(), ye,yp,delta,yc);
    console.log(ye,yp,delta,yc);
    if (delta<1 && delta>-1) {
        stopCentering();
        return;
    }
    yc+=delta;
    if (yc<0) yc=0;
    $("#navigator").scrollTop(yc);
}

let currentImage;
function nextImage() {
    let i=currentImage+1;
    if (i>93) i=1;
    onSelectImage(i);
}

function onSelectImage(i) {
    currentImage=i;
    $('#viewer').css('background-image', `url(images/image${i2s(i,3)}.jpg)`);
    let id=`thumb-${i2s(i,3)}`;
    startCentering($('#'+id));
    return false;
}

function loadThumbs() {
    for (let i=1; i<=93; i++) {
        let div=$(`<div id="thumb-${i2s(i,3)}">`);
        let img=$(`<a href="javascript: onSelectImage(${i})" class=thumb><img src=thumbs/image${i2s(i,3)}.jpg width=95%></a>`);
        div.append(img);
        $('#navigator').append(div);
        img.focus((e)=>{ console.log(e); onSelectImage(i); });
    }
}


function initPage() {
    $(window).resize(onResizeWindow);
    onResizeWindow();
    loadThumbs();
    onSelectImage(1);
    $('#viewer').click(nextImage);
}

$(initPage);