// Initialize Firebase
var config = {
  apiKey: "AIzaSyC-CdT3dQA1hQ-hsnusEJkoQMiMx4r6WgY",
  authDomain: "train-scheduler-ea.firebaseapp.com",
  databaseURL: "https://train-scheduler-ea.firebaseio.com",
  projectId: "train-scheduler-ea",
  storageBucket: "train-scheduler-ea.appspot.com",
  messagingSenderId: "368394684268"
};
firebase.initializeApp(config);

var database = firebase.database();

function updateTime() {
  var currentTime = moment().format("HH:mm");
  $("#current-time").html(currentTime);
}
updateTime();
setInterval(function() {
  updateTime();
}, 5000);

// Example starter JavaScript for disabling form submissions if there are invalid fields
(function() {
  "use strict";
  window.addEventListener("load", function() {
    var form = document.getElementById("needs-validation");
    form.addEventListener("submit", function(event) {
      if (form.checkValidity() == false) {
        event.preventDefault();
        event.stopPropagation();
      }
      form.classList.add("was-validated");
    }, false);
  }, false);
}());

// Button for adding Trains
$("#add-train-btn").on("click", function(event) {
  event.preventDefault();
  //var trainNameRequired = true;
  // Grab train input
  var trainName = $("#train-name-input").val().trim();
  // Validating form entries
  // if(!document.getElementById('train-name-input').checkValidity()){
  //   console.log("Train name not valid")
  // }
  // //if(trainName.length < 3) {
    //trainNameRequired = false;

  //}
  var trainDestination = $("#destination-input").val().trim();
  var trainStart = $("#train-start-input").val().trim();
  //var trainStart = moment($("#train-start-input").val().trim(), "HH:mm").format("X");
  console.log(trainStart);
  var trainFrequency = $("#frequency-input").val().trim();


  //if( trainNameRequired){
   
  //}else {
    //alert('Please fill out all required fields');
  //}

  // Creates local "temporary" object for holding new train data
  var newTrain = {
    name: trainName,
    destination: trainDestination,
    start: trainStart,
    frequency: trainFrequency
  };

  // Uploads new train data to the Firebase database
  database.ref().push(newTrain);

  // Logs everything to console
  console.log(newTrain.name);
  console.log(newTrain.destination);
  console.log(newTrain.start);
  console.log(newTrain.frequency);

  //alert("New train successfully added");

  // Clears all of the input in the text-boxes
  $("#train-name-input").val("");
  $("#destination-input").val("");
  $("#train-start-input").val("");
  $("#frequency-input").val("");
});

//Create Firebase event for adding new train to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function(childSnapshot) {
  console.log(childSnapshot.val());

  // Store everything into a variable.
  var trainName = childSnapshot.val().name;
  var trainDestination = childSnapshot.val().destination;
  var trainStart = childSnapshot.val().start;
  var trainFrequency = childSnapshot.val().frequency;

  // Log Train Info
  console.log("train name: " + trainName);
  console.log("destination: " + trainDestination);
  console.log("train start: " + trainStart);
  console.log("train frequency: " + trainFrequency);

  // Next Train Calcuations
  // User inputs train frequency
  //var tFrequency = $("#frequency-input").val().trim();;

  // Current Time
  var currentTime = moment();
  console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

  // Time is the user input of the first train
  //var trainStart = moment($("#train-start-input").val().trim(), "HH:mm").format("X");
  //var trainStartPretty = moment.unix(trainStart).format("HH:mm");
  //console.log("train start pretty: " + trainStartPretty);

  // First Train Time (pushed back 1 year to make sure it comes before current time)
  var trainStartConverted = moment(trainStart, "HH:mm").subtract(1, "years");
  console.log("train start not converted: " + trainStart);
  console.log("Train Start Converted time: " + trainStartConverted);

  // Difference between the times in minutes
  var diffTime = moment().diff(moment(trainStartConverted), "minutes");
  console.log("DIFFERENCE IN TIME: " + diffTime);

  // Time apart (remainder)... how much time since last train arrived
  var tRemainder = diffTime % trainFrequency;
  console.log("this is tRemainder:" + tRemainder);

  // Minute Until Next Train ... take freq and subtract that remainder
  var tMinutesTilTrain = trainFrequency - tRemainder;
  console.log("MINUTES TILL TRAIN: " + tMinutesTilTrain);

  // Next Train
  var nextTrain = moment().add(tMinutesTilTrain, "minutes");
  console.log("NEXT TRAIN ARRIVAL TIME: " + moment(nextTrain).format("HH:mm"));
  // Prettify the Next Train Arrival
  var nextTrainPretty = moment.unix(nextTrain).format("HH:mm");
  var removeButton = $("<button>").addClass("remove").text("Remove");
  removeButton.attr('data-id', childSnapshot.key );
 
  // remove.attr("type", "button");
  // remove.addClass(".removeBtn");
  
  // Create the new row
  var newRow = $("<tr>").append(
    $("<td>").text(trainName),
    $("<td>").text(trainDestination),
    $("<td>").text(trainFrequency),
    //$("<td>").text(trainStartPretty),
    //$("<td>").text(nextTrainPretty),
    $("<td>").text(moment(nextTrain).format("HH:mm")),
    $("<td>").text(tMinutesTilTrain),
    $("<td>").append(removeButton)
  );

  // Append the new row to the table
  $("#train-table > tbody").append(newRow);

  $('#add-train').on('click', '.removeBtn', function(){
    $(this).closest ('tr').remove ();
  });

  //Remove row from table and from Firebase - working
  var removeRow = function (event) {
   
    event.preventDefault();
    var trainId = $(this).attr('data-id');
    database.ref().child(trainId).remove();
      $(this).closest("tr").remove();
  };
  $("#train-table").on("click", ".remove", removeRow);

  //Remove row from table and Firebase
  // var removeRow = function (event) {
  //   console.log("remove this row");
  //   event.preventDefault();
  //   event.stopPropogation();
  //     //$(this).closest("tr").remove();
  //     var key = $(this).data('key');
  //     if(confirm("Are you sure?")){
  //       firebase.database().ref().child.key.remove();
  //     }
  // };
  // $("#train-table").on("click", ".remove", removeRow);
});

