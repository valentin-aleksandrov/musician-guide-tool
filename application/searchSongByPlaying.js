const Notes = function (selector, tuner) {
  this.tuner = tuner;
  this.isAutoMode = true;
  this.$notes = [];
  this.$notesMap = {};
};

function throttle(callback, limit) {
  var waiting = false; // Initially, we're not waiting
  return function () {
    // We return a throttled function
    if (!waiting) {
      // If we're not waiting
      callback.apply(this, arguments); // Execute users function
      waiting = true; // Prevent future invocations
      setTimeout(function () {
        // After a period of time
        waiting = false; // And allow future invocations
      }, limit);
    }
  };
}

const notesLimit = 30;
let currentNoteIndex = 0;
let song = [];
let sendMusic = false;

const Application = function () {
  this.tuner = new Tuner();
  this.notes = new Notes(".notes", this.tuner);
};
Application.prototype.start = function () {
  const self = this;

  const callBack = throttle(function onNoteDetected(note) {
    if(sendMusic) {
        return
    }
    if (self.notes.isAutoMode) {
      if (self.lastNote === note.name) {
          song[currentNoteIndex++] = note.name;
          if(currentNoteIndex > notesLimit) {
              sendMusic = true;
              fetch('http://localhost:3000/song', {
                method: 'POST', // *GET, POST, PUT, DELETE, etc.
                //mode: 'cors', // no-cors, *cors, same-origin
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({ song: song.join(',') }) 
              })
                  .then(res => res.json())
                  .then(res => {
                      const [ resultElement ] = document.getElementsByClassName('found-song');
                      const resultText = document.createTextNode(`${res.songTitle} композирана от ${res.songComposer}`);
                      const header = document.createElement('h1');
                      const notFound = document.createTextNode('НЕоктрита песен');
                      if(res.found) {
                        header.appendChild(resultText);
                        const imageElement = document.getElementById('found-image');
                          imageElement.style.visibility = 'visible';
                        document.getElementsByTagName('h2')[0].classList.add('hide-element');
                        imageElement.src = res.songImage;
                      } else {
                        header.appendChild(notFound);
                        document.getElementsByTagName('h2')[0].classList.add('hide-element');
                      }
                      resultElement.appendChild(header);
                  });
          }
     } else {
       self.lastNote = note.name;
     }
    }
  }, 250);

  this.tuner.onNoteDetected = callBack;


  swal("Натиснете Продължи за да започнете търсенето на песен...").then(function () {
    self.tuner.init();
  });
};

const app = new Application();
app.start();
