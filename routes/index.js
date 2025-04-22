var express = require('express');
var router = express.Router();
var ytbsearch = require('youtube-search-without-api-key');
const ytdl = require('@distube/ytdl-core');
const fs = require('fs');



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Youtube mp3 Converter' });
});

router.post('/',async (req,res,next)=>{
  const search = req.body.search;
  videos = await ytbsearch.search(search);
  res.render('index', { title: 'Youtube mp3 Converter',videos:videos });
})


router.post('/download', async (req, res, next) => {
  try {
    const videoId = req.body.videoId;
    const info = await ytdl.getInfo(videoId, {
      requestOptions: { 
        headers: { 
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' 
        } 
      }
    });

    const title = info.videoDetails.title
      .replace(/[/\\:*?"<>|]/g, "") 
      .trim() 
      .replace(/\s+/g, "_"); 

    const encodedTitle = encodeURIComponent(title);

    res.header(
      'Content-Disposition',
      `attachment; filename="${encodedTitle}.mp3"; filename*=UTF-8''${encodedTitle}.mp3`
    );
    res.header('Content-Type', 'audio/mpeg');

    // Stream the audio
    ytdl(videoId, { quality: 'highestaudio', filter: 'audioonly' })
      .on('error', (err) => next(err))
      .pipe(res);

  } catch (error) {
    next(error);
  }
});

router.get('/info/:videoId',async (req,res,next)=>{
  const videoId = req.params.videoId;
  const videos = await ytbsearch.search(videoId);
  res.render('videoinfo', { video:videos[0] });
})



module.exports = router;
