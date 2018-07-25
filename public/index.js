$(function() {
  let state = 0;
  const player = beats => {
    const drums = new Tone.MembraneSynth().toMaster();
    // Tone.Transport.stop();
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
        console.log(data);
        beatMaker(data);
      }
    });
  };

  $("#query-button").on("click", function(event) {
    event.preventDefault();
    for (let i = 0; i < 8; i++) {
      $("#beat-" + i).empty();
    }
    let query = $("#query-input").val().trim();
    hiphopAPI(query);
  });
});
