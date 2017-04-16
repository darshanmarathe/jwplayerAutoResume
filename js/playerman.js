//Setup the database


 var idbAdapter = new LokiIndexedAdapter('loki');
var db = new loki("fireApp",   {
        autoload: true,
        autoloadCallback : loadHandler,
        autosave: true, 
        autosaveInterval: 250, // 10 seconds
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
    file: 'http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4',
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
    console.log(videos.find({name : file}));
});



player.on('play', (event) => {

    var position = player.getPosition();
    var file = player.getPlaylistItem()['sources'][jwplayer().getCurrentQuality()].file;
   
   console.log("file =>" + file)
    currentvideo = videos.find({name : file})[0];
    setTimeout(function(){
        DeleteOldData(videos.find({name : file}));
    },2000)
    console.log(currentvideo);
    player.seek(currentvideo.position);
});

function DeleteOldData(collection){
    for (var index = 1; index < collection.length; index++) {
        var element = collection[index];
        videos.remove(element);
    }
}

// Call the API
const bumpIt = () => {
    const vol = player.getVolume();
    player.setVolume(vol + 10);
}
document.querySelector('#bumpit').onclick = () => { bumpIt(); }