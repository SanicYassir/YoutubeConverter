var express = require('express');
var router = express.Router();
var ytbsearch = require('youtube-search-without-api-key');
const ytdl=  require('ytdl-core');
const fs = require('fs');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Youtube Converter' });
});

router.post('/',async (req,res,next)=>{
  const search = req.body.search;
  videos = await ytbsearch.search(search);
  res.render('index', { title: 'Youtube Converter',videos:videos });
})

router.post('/download',async (req,res,next)=>{
  
  const videoId = req.body.videoId;
  const info = await ytdl.getInfo(videoId);
  const title = info.videoDetails.title.replace(/[/\:*?"<>|]/gi," ");
  let links = [];
  
  ytdl(videoId,{quality:'highestaudio'})
   .pipe(fs.createWriteStream(`./public/songs/${title}.mp3`)).on('open',()=>{
     console.log('Song is downloading!');
   }).on('close',()=>{
     links.push({
      title : title,
      path : `/songs/${title}.mp3`
     })
     res.render('links',{links : links })
   })
 
})

router.get('/info/:videoId',async (req,res,next)=>{
  const videoId = req.params.videoId;
  const videos = await ytbsearch.search(videoId);
  res.render('videoinfo', { video:videos[0] });
})



module.exports = router;
