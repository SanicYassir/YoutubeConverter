
const form = document.getElementById('form');
const progress = document.querySelector('.progress');

form.addEventListener('submit',()=>{
  console.log('submited');
  progress.classList.remove('hide')
})

