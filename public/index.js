$(function() {
  const player = beats => {
    const drums = new Tone.Synth({
      "oscillator" : {
        "type" : "fmsine4",
        "modulationType" : "square"
      }
    }).toMaster();

    const loop = new Tone.Pattern(function(time, note){
      drums.triggerAttackRelease(note, "16n", time);
      // Draw.schedule takes a callback and a time to invoke the callback
      Tone.Draw.schedule(function(){
        //the callback synced to the animation frame at the given time
        $("#"+note).css("opacity", 1).animate({"opacity" : 0}, 300)
      }, time);
    }, beats).start(0);
    loop.interval = "16n";

    Tone.Transport.start("+0.1");
  }

  const beatMaker = data => {
    return player(data.results.map(e => {
      return e.sentiment.sentiment_type == 'negative' ? "G3" : "G9";
    })
  )};

  function hiphopAPI(query) {
    $.get('/api/' + query, function(data){
      if (jQuery.isEmptyObject(data)) {
        $("#chart").text("Not a valid keyword");
        // state = false;
      } else {
        $("#chart").empty();
        beatMaker(data);
      }
    });
  };

  $("#query-button").on("click", function(event) {
    event.preventDefault();
    let query = $("#query-button").val().trim();
    hiphopAPI(query);
  });

  // $("#stop-button").on("click", function(event) {
  //   event.preventDefault();
  //   Tone.Transport.pause();
  //   state = false;
  // });
  //
  // function buildChords(data) {
  //   var chords = [];
  //   //TODO https://github.com/Tonejs/Tone.js/wiki/Time
  //   var time = 0;
  //   for (key in data) {
  //     var chord = [];
  //     chord.push(time + "i");
  //     time+=10;
  //     var notes = [];
  //     for (var i = 1; i <= data[key].length; i++){
  //       if (data[key][i-1] === "#196127") {
  //         notes.push(data[key][i-1] = "E" + i);
  //       }
  //       else if (data[key][i-1] === "#239a3b") {
  //         notes.push(data[key][i-1] = "D" + i);
  //       }
  //       else if (data[key][i-1] === "#7bc96f") {
  //         notes.push(data[key][i-1] = "B" + i);
  //       }
  //       else if (data[key][i-1] === "#c6e48b") {
  //         notes.push(data[key][i-1] = "A" + i);
  //       }
  //       else {
  //         notes.push(data[key][i-1] = "G" + i);
  //       }
  //     }
  //     chord.push(notes);
  //     chords.push(chord);
  //   }
  //   playScrape(chords);
  // }// end buildChords
  //
  // //TODO read up on better handling of Draw https://tonejs.github.io/docs/r11/Part
  // function playScrape(chords) {
  //   var n = '16n';
  //   synthPart = new Tone.Part(function(time, chord){
  //     synth.triggerAttackRelease(chord, n, time);
  //
  //     Tone.Draw.schedule(function(){
  //       renderGraph(chord);
  //       if (chord == chords[0][1]) {
  //         $("#contribution-graph").empty();
  //       }
  //
  //     }, time);
  //   }, chords).start("0");
  //
  //   synthPart.loop = true;
  //   synthPart.humanize = false;
  //
  //   Tone.Transport.bpm.value = 10;
  //   Tone.Transport.start("+0.1");
  // } // end playScrape
  // //TODO https://github.com/Tonejs/Tone.js/wiki/Arpeggiator
  //
  // function renderGraph(chord) {
  //
  //   var sun = $("<div>&nbsp;</div>").attr("class", chord[0]);
  //   var mon = $("<div>&nbsp;</div>").attr("class", chord[1]);
  //   var tue = $("<div>&nbsp;</div>").attr("class", chord[2]);
  //   var wed = $("<div>&nbsp;</div>").attr("class", chord[3]);
  //   var thu = $("<div>&nbsp;</div>").attr("class", chord[4]);
  //   var fri = $("<div>&nbsp;</div>").attr("class", chord[5]);
  //   var sat = $("<div>&nbsp;</div>").attr("class", chord[6]);
  //
  //   var week = $("<div>").addClass("animated pulse week").append(sun, mon, tue, wed, thu, fri, sat);
  //   $("#contribution-graph").append(week);
  //
  // }
});
