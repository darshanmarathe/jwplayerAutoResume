//Setup the database


 var idbAdapter = new LokiIndexedAdapter('loki');
var db = new loki("fireApp",   {
        autoload: true,
        autoloadCallback : loadHandler,
        autosave: true, 
        autosaveInterval: 10000, // 10 seconds
        adapter: idbAdapter
      });

var videos;

function loadHandler() {
      // if database did not exist it will be empty so I will intitialize here
      videos = db.getCollection('videos');
      if (videos === null) {
        videos = db.addCollection('videos', { indices: ['name'] });
      }
      console.log(videos);
}
 


// Setup the player
const player = jwplayer('player').setup({
    file: '/assets/sample.mp4',
    volume: 10
});

// Listen to an event
player.on('pause', (event) => {

    var position = player.getPosition();
    var file = player.getPlaylistItem()['sources'][jwplayer().getCurrentQuality()].file;
    videos.insert({
        name: file,
        position: position
    });
});



player.on('play', (event) => {

    var position = player.getPosition();
    var file = player.getPlaylistItem()['sources'][jwplayer().getCurrentQuality()].file;
   
   console.log("file =>" + file)
    currentvideo = videos.find({name : file})[0];
    player.seek(currentvideo.position);
});

// Call the API
const bumpIt = () => {
    const vol = player.getVolume();
    player.setVolume(vol + 10);
}
document.querySelector('#bumpit').onclick = () => { bumpIt(); }