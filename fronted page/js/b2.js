var final_transcript = '';
var recognizing = false;

if ('webkitSpeechRecognition' in window) {

	var recognition = new webkitSpeechRecognition();

	recognition.continuous = true;
	recognition.interimResults = true;

	recognition.onstart = function() {
		recognizing = true;
	};

	recognition.onerror = function(event) {
		console.log(event.error);
	};

	recognition.onend = function() {
		recognizing = false;
	};

	recognition.onresult = function(event) {
		var interim_transcript = '';
		for (var i = event.resultIndex; i < event.results.length; ++i) {
			if (event.results[i].isFinal) {
				final_transcript += event.results[i][0].transcript;
			} else {
				interim_transcript += event.results[i][0].transcript;
			}
		}
		final_transcript = capitalize(final_transcript);
		// final_span.innerHTML = linebreak(final_transcript);
		// interim_span.innerHTML = linebreak(interim_transcript);
		console.log("this is interm ");
		console.log(interim_transcript);
		console.log("this is final ");
		console.log(final_transcript);
		if( interim_transcript != ""){
			document.getElementById("search_text").value = interim_transcript;
		}
		else if(final_transcript != ""){
			document.getElementById("search_text").value = final_transcript;
		}

	};
}

var two_line = /\n\n/g;
var one_line = /\n/g;
function linebreak(s) {
	return s.replace(two_line, '<p></p>').replace(one_line, '<br>');
}

function capitalize(s) {
	return s.replace(s.substr(0,1), function(m) { return m.toUpperCase(); });
}

function startDictation(event) {
	if (recognizing) {
		recognition.stop();
		return;
	}
final_transcript = '';
recognition.lang = 'en-US';
recognition.start();
final_span.innerHTML = '';
interim_span.innerHTML = '';
}

function validateForm() {
    var msg = document.getElementById("search_text").value;
    if (msg == "") {
        alert("Please input your hint word!");
		return false;
    }
	var endpoint = "https://hw3-photo-bucket.s3.us-east-2.amazonaws.com/";
	//新建client
    var apigClient = apigClientFactory.newClient();
    //发送数据与接收反馈：
    apigClient.searchGet(
	{
     search:"",q:msg
    },{},
    {})
    .then(function(result){
    console.log(result)
    body = result.data.response
    console.log(body)
	if(body != null){
	   var pic_all = "";
       for( var i = 0; i < body.length; i++){
		   var pic = body[i]
		   console.log(pic)
		   var pic_url = endpoint + pic
		   var pic_ele = "<div class=\"col-md-2 col_1\"><img src=\" " +  pic_url +" \" class=\"img-responsive\" alt=\"\"/></div>"
		   // $("#picgrid").append(pic_ele)
		   pic_all += pic_ele;
	   }
	   pic_all += "<div class=\"clearfix\"> </div>"
	   $("#picgrid").html(pic_all);
	}  
    }).catch( function(result){
       console.log(result)
    });
}

function uploadpic(){

 var pic = document.getElementById("uploadpic")
 // var preview = document.getElementById("imgprev")
 var filename = pic.files[0].name;
 console.log(filename)
 var filebinary = pic.files[0];
 var apigClient = apigClientFactory.newClient();
 var reader  = new FileReader();
 reader.onloadend = function () {
  console.log(reader.result)
     // preview.src = reader.result;
     var file = reader.result;
     console.log("show file")
     console.log(file)
     apigClient.photoPut(
   {name:filename,"Content-Type":"application/x-binary"},
   {name:filename,file:file},
   {})
  .then(function(result){
       // Add success callback code here.
       console.log(result)
       alert("upload successfully!")
     }).catch( function(result){
       // Add error callback code here.
       console.log(result)
     });
   }

 if (filebinary) {
     reader.readAsDataURL(filebinary);
     // console.log(preview.src)
  }
}