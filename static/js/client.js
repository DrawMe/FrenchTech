
var socket;
var video = $('#webcam')[0];
// users
var uid;
var cid ='';

// peer
var peerCoon;
var peerCall ='';


var userCall;

var usersToConnect = [];


var caller = "";
var called = "";

var timeTimer = 6;

var ConnectVideo = function () {
    // Cross broswer shit for getUserMedia
    navigator.getUserMedia = ( navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
};

ConnectVideo.prototype.init = function () {
    this.initVars();
    this.initSocket();
    this.initEvents();
};

ConnectVideo.prototype.initVars = function () {
    // video
   // var video = $('#video')[0];
    // users
   // var uid;
   // var cid ='';

    // peer
   //var peerCoon;
    //var peerCall ='';

    // IO
   // socket;
};

/** CONNECT IO **/
ConnectVideo.prototype.initSocket = function () {
    socket = io();

    // connection
    socket.on('connect', this.socketReady);
};

ConnectVideo.prototype.initEvents = function(){
    /** SENDING CALL **/
    // listen for click on users list to connect
   // $('body').on('click', '#users a', this.askCall);
};


ConnectVideo.prototype.socketReady = function () {
    console.log('socket ready');

    // listen socket
    socket.on('getUserId', connectVideo.getUserId);
    socket.on('getUsersList', connectVideo.getUsersList);
    socket.on('getUsersToConnectList', function(usersTab){
        usersToConnect = usersTab;
    });

    // call for userid
    socket.emit('getUserId');
};


/** IO EVENTS **/
ConnectVideo.prototype.getUserId = function (id) {
    console.log('get user id', id);
    // user id
    uid = id;
    $('#user').text(uid);

    // now that we got the user id, connect peer
    connectVideo.connectPeer();
};

ConnectVideo.prototype.getUsersList = function (users) {
    console.log('get users list', users);

    // empty list
    $('#users').empty();

    // display list
    var i = 0;
    for (i; i < users.length; i++) {

        // don't display the current user
        if (users[i] != uid) {
            $('#users').append('<li><a class="userLink" style="width:20px:height:20px;" data-user="' + users[i] + '">Call ' + "user "+ i + '</a></li>');
        }
    }
};

/** CONNECT PEER **/
    // peer connection
ConnectVideo.prototype.connectPeer = function () {

    console.log('connect peer');

    // connect peer
    peerCoon = new Peer(uid, {
            host: '172.28.55.80', port: 3000, path: '/peer',
            config: {
                'iceServers': [
                    {url: 'stun:stun1.l.google.com:19302'},
                    {url: 'turn:numb.viagenie.ca', credential: 'muazkh', username: 'webrtc@live.com'}
                ]
            }
        }
    );

    // listen for peer open
    peerCoon.on('open', connectVideo.peerReady);

    // listen for a call
    peerCoon.on('call', connectVideo.receiveCall);
};

// peer is ready
ConnectVideo.prototype.peerReady = function (peerId) {

    console.log('peer ready');
    $("#state").text("Connected to peer server");

    // ok peer connection is ready - now get user list
    socket.emit('getUsersList');
};



// ask
ConnectVideo.prototype.askCall = function (e) {
    console.log('call');

    // get user to call
   // cid = $(e.currentTarget).data('user');
    cid = e;

    // get our video
    //navigator.getUserMedia({audio: true, video: true}, connectVideo.sendCall, connectVideo.gotError);
    connectVideo.sendCall(localStream);
};

// send call
ConnectVideo.prototype.sendCall = function (stream) {
    console.log('really call');

    // call someone - send our audio stream
    peerCall = peerCoon.call(cid, stream);

    // listen call for stream
    peerCall.on('stream', connectVideo.receiveStream);
};

/** GETTING CALL **/
ConnectVideo.prototype.receiveCall = function (call) {
    console.log('get call');

    $(".information").removeClass('hide');

    userCall = call;
};


ConnectVideo.prototype.connectUser = function(userId){
    var userId = userId;

    console.log("connectUser");
    console.log("connectUser tab: "+usersToConnect.length);


    if(usersToConnect.length < 1) {
        caller = userId;
        usersToConnect.push(userId);
        connectVideo.askCall(userId);
        socket.emit('getUsersToConnectList', usersToConnect);
    }
    else if(usersToConnect.length == 1){
        called = userId;

        interactWebCam.stopWebcam(); //stop client's webcam

        // call
        peerCall = userCall;

        // listen call for stream
        peerCall.on('stream', connectVideo.receiveStream);

        // get our micro stream
       // navigator.getUserMedia({audio: true, video: true}, connectVideo.answerCall, connectVideo.gotError);
        connectVideo.answerCall(localStream);

        $(".information").addClass('hide');
    }

};

// answer call
ConnectVideo.prototype.answerCall = function (stream) {
    var that = this;
    console.log('answer call');

    // answering to the call - sending our micro stream
    peerCall.answer(stream);

    var endTime = timeTimer*1000;
    setTimeout(function (){
        that.loadDrawing();
    }, endTime);
};


ConnectVideo.prototype.loadDrawing = function(){
    //load the drawings
    setTimeout(function () {
        loadColorDrawing();
    }, 500);
};


/** GET STREAM **/
    // receive stream
ConnectVideo.prototype.receiveStream = function (stream) {

    console.log('reveive stream', stream);

    // push the stream to video
    video.src = window.URL.createObjectURL(stream);

    //$("#colorFont").addClass('hide');
    connectVideo.loadThemeForUser();
};


ConnectVideo.prototype.loadThemeForUser = function (userId) {
    console.log("loadThemeForUser");
    console.log("userId : "+userId);
    console.log("caller: "+caller);
    console.log("called: "+called);

    var $callerExplication = $('#callerExplication');
    var $calledExplication = $('#calledExplication');
    var $timerText = $("#timer");

    $(".header").addClass('hide');

    if(caller != ""){
        console.log("this is the caller");
        var theme = randomWord(dataTheme, false);
        $callerExplication.removeClass('hide');
    }
    else{
        console.log("this is the called");
        var theme = randomWord(dataTheme, true);
        $calledExplication.removeClass('hide');
    }
    $("#result").append(theme);

    var i = timeTimer;
    var timer = setInterval(function (){
        i--;
        console.log("timer"+i+" s");
        $timerText.html(i);
        if(i == 0){
            $("#colorFont").addClass('hide');
            if(!$callerExplication.hasClass('hide')){
                $callerExplication.addClass('hide');
            }
            if(!$calledExplication.hasClass('hide')){
                $calledExplication.addClass('hide');
            }
            $timerText.addClass('hide');
            $timerText.html('');
            $("#colors").removeClass('hide');
            clearInterval(timer);
        }
    }, 1000);
};



/** UTILS **/
    // got error
ConnectVideo.prototype.gotError = function (err) {
    console.log(err);
};


var connectVideo = new ConnectVideo();
connectVideo.init();