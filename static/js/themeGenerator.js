var dataTheme;

function ajaxRequest(){
    var activexModes=["Msxml2.XMLHTTP", "Microsoft.XMLHTTP"]; //activeX versions to check for in IE
    if (window.ActiveXObject){ //Test for support for ActiveXObject in IE first (as XMLHttpRequest in IE7 is broken)
        for (var i=0; i<activexModes.length; i++){
            try{
                return new ActiveXObject(activexModes[i])
            }
            catch(e){
                //suppress error
            }
        }
    }
    else if (window.XMLHttpRequest) // if Mozilla, Safari etc
        return new XMLHttpRequest();
    else
        return false
}

var myGetRequest=new ajaxRequest();

myGetRequest.onreadystatechange=function(){
    if (myGetRequest.readyState==4){
        if (myGetRequest.status==200 || window.location.href.indexOf("http")==-1){
            var jsonData=eval("("+myGetRequest.responseText+")"); //retrieve result as an JavaScript object
            console.log(jsonData);
            dataTheme=jsonData;
        }
        else{
            alert("An error has occured making the request")
        }
    }
};

function randomWord(obj, caller) {
    var item =  obj[Math.floor(Math.random() * obj.length)];
    var word = item.word;
    var image = item.image;

    var wordOutput = '<h1>'+ word+'<h1>';
    var imageOutput = '<img src="'+ image+'" />';

    if(caller == true){
        return wordOutput;
    }
    else{
        return imageOutput;
    }

}

myGetRequest.open("GET", "words.json", true);
myGetRequest.send(null);