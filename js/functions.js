function setOutherSize(e,w,h) { // set outer size, return inner size
    e.outerHeight(h).outerWidth(w);
    return {w:e.width(),h:e.height()};
}

function animate( to ) {
    $( this ).stop( true, false ).animate( to );
}

function place(e,opts) {
    e.css("position","absolute");
    opts.collision  = opts.collision  || "none";
    e.parent($(opts.of));
    e.position(opts);
}

function startVideo(n) {
    stopVideo();
    $("#player").attr("src","videos/"+n+".mp4");
    $("#player").show();
    $("#closePlayerButton").show();
    placePlayer();
    $("#player").get(0).play();
}

function stopVideo() {
    $("#player").get(0).pause();
    $("#player").attr("src","");
    $("#player").hide();
    $("#closePlayerButton").hide();
}


function loadPlaylist() {
    $.each(getcontent(), (i,en)=> {
        e=$("<div class=videothumb>");
        if (typeof en == typeof "") {
            thumb=`url('images/${en}.jpg')`;
            hndlr=()=>{ startVideo(en); };
        } else {
            thumb=`url('images/${en.thumb}.jpg')`;
            hndlr=()=>{ location=en.target; };
        }
        e.css("background-image",thumb);
        e.prop("userData",{"name":en});
        e.click(hndlr);
        $("#playlist").append(e);
    });
}

function onResizeWindow() {
    var w=$(window).width();
    var h=$(window).height();
    var mcs=setOutherSize($(".maincontent"),w,h);
    setOutherSize($("#player"),w*0.8,h);
    placePlayer();
}
function placePlayer() {
    place( $("#player"), {my:"center top", at:"center top", of: ".maincontent"} );
    place( $("#closePlayerButton"), {my:"right top", at:"right top", of: "#player"} );
}

function initPage() {
    stopVideo();
    loadPlaylist();
    $(window).resize(onResizeWindow);
    onResizeWindow();
    $("#closePlayerButton").click(()=>{stopVideo();});
}

$(initPage);