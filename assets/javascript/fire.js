// Initializing Firebase
  var config = {
    apiKey: "AIzaSyBVdl8fNbGzmoWsmMgVe4JR5WZBJilMK38",
    authDomain: "loco-8842f.firebaseapp.com",
    databaseURL: "https://loco-8842f.firebaseio.com",
    projectId: "loco-8842f",
    storageBucket: "",
    messagingSenderId: "8054701919"
  };
  firebase.initializeApp(config);
  console.log(config);
// Var to refrence DB 
var database = firebase.database();

// Onclick to capture Submit button 
$("#add-train").on("click", function(event){
    event.preventDefault();
    var name = $("#name-input").val().trim();
    var dest = $("#dest-input").val().trim();
    var time = moment($("#time-input").val().trim(), "HH:mm").format("");
    var freq = $("#freq-input").val().trim();
    // console.log(name,dest,time,freq);
    
    database.ref().push({
        Train: name,
        Destination: dest,
        Time: time,
        Frequency: freq,
    })

    alert("Train successfully added!");

    //clears all of the text boxes
	$('#name-input').val("");
	$('#dest-input').val("");
	$('#time-input').val("");
	$('#freq-input').val("");

    return false;
});
database.ref().on("child_added", function(childSnapshot){
   
//    Store everything in a variable 
    var trainName = childSnapshot.val().Train;
    var destination = childSnapshot.val().Destination;
    var firstTime = childSnapshot.val().Time;
    var frequency = childSnapshot.val().Frequency;

    // console.log(trainName);

//convert first time (push back 1 year to make sure it comes before current time)
	var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
	// console.log(firstTimeConverted);

	//current time
	var currentTime = moment();
	// console.log("CURRENT TIME: " + moment(currentTime).format("HH:mm"));

	//difference between the times
	var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
	// console.log("DIFFERENCE IN TIME: " + diffTime);

	//time apart (remainder)
	var tRemainder = diffTime % frequency;
	// console.log(tRemainder);

	//minute until train
	var tMinutesTillTrain = frequency - tRemainder;
	// console.log("MINUTES TIL TRAIN: " + tMinutesTillTrain);

	//next train
	var nextTrain = moment().add(tMinutesTillTrain, "minutes");
	var nextTrainConverted = moment(nextTrain).format("hh:mm a");
	// console.log("ARRIVAL TIME: " + moment(nextTrain).format("HH:mm"));


    $(".display").append("<tr><th>" + trainName + "</th><td>" + destination + "</td><td>" + "Every " + frequency + " minutes" + "</td><td>" + nextTrainConverted + "</td><td>" + tMinutesTillTrain + " Minutes away" + "</td></tr>");

});
