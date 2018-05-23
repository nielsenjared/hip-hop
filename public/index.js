$(function() {
  let state = 0;
  const player = beats => {
    const drums = new Tone.MembraneSynth().toMaster();

    const loop = new Tone.Pattern(function(time, note){
      drums.triggerAttackRelease(note, "16n", time);
      // Draw.schedule takes a callback and a time to invoke the callback
      Tone.Draw.schedule(function(){
        //the callback synced to the animation frame at the given time
        // $("#beat-" + state + " .beat").css("opacity", 1).animate({"opacity" : 0}, 300);
        $("#beat-" + state + " .beat").css("opacity", 1).animate({"opacity" : 0}, 300);
        state++;
        if (state > 7) {
          state = 0;
        }
      }, time);
    }, beats).start(0);
    loop.interval = "8n";

    Tone.Transport.start("+0.1");
  };// end player()
  //TODO https://github.com/Tonejs/Tone.js/blob/master/examples/animationSync.html

  const beatMaker = data => {
    for (let i = 0; i < 8; i++) {

      let t = $('<div>').addClass("title");
      t.append(`<p>"${data.results[i].title}"</p>`);
      $("#beat-" + i).append(t);
      let b = $('<div>').addClass("beat");
      // b.append(`<p>"${data.results[i].sentiment.sentiment_type}"</p>`);
      $("#beat-" + i).append(b);
      // $("#beat-" + i).append(`<p>"${data.results[i].title}"</p>`);
      $("#beat-" + i).append(`<p>${data.results[i].artist.name}</p>`);

    }

    return player(data.results.slice(0, 8).map(e => {
      return e.sentiment.sentiment_type == 'negative' ? "C2" : "C4";
    })
  )};// end beatMaker()




  function hiphopAPI(query) {
    $.get('/api/' + query, function(data){
      if (jQuery.isEmptyObject(data)) {
        $("h1").text("Not a valid keyword");
      } else {
        beatMaker(data);
      }
    });
  };

  $("#query-button").on("click", function(event) {
    event.preventDefault();
    let query = $("#query-button").val().trim();
    hiphopAPI(query);
  });


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
