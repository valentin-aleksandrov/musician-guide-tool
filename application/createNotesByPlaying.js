function downloadNotes() {
        window.domtoimage.toPng(document.getElementById('paper-wrapper'))
            .then(function (dataUrl) {
                var link = document.createElement('a');
                link.download = 'my-image-name.jpeg';
                link.href = dataUrl;
                link.click();
            })
}

function selectionCallback(abcelem) {
        var note = {};
        for (var key in abcelem) {
                if (abcelem.hasOwnProperty(key) && key !== "abselem")
                        note[key] = abcelem[key];
        }
        var el = document.getElementById("selection");
        el.innerHTML = "<b>selectionCallback parameter:</b><br>" + JSON.stringify(note);
}

function initEditor() {
        new ABCJS.Editor("abc", { paper_id: "paper",
                generate_warnings: true,
                warnings_id:"warnings",
                abcjsParams: {
                        generateDownload: true,
                        clickListener: selectionCallback
                }
        });
}


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

const normilizeNotes = (notes) => {
    const tranformed = notes.map(note => {
        if(note.length > 1) {
            return '^' + note[0];
        }
        return note;
    }).map(note => note + '2');
    let output = '';
    for(let i = 0; i < tranformed.length; i++){
        output = output + tranformed[i];
        if(i !== 0 && i % 4 === 0){
            output = output + '|';
        }
        if(i !== 0 && i % 16 === 0) {
            output = output + '\r\n';
        }
    }
    return output;
}

const notesLimit = 30;
let currentNoteIndex = 0;
let song = [];

const Application = function () {
  this.tuner = new Tuner();
  this.notes = new Notes(".notes", this.tuner);
};
Application.prototype.start = function () {
  const self = this;

  const callBack = throttle(function onNoteDetected(note) {
    if (self.notes.isAutoMode) {
      if (self.lastNote === note.name) {
          song[currentNoteIndex++] = note.name;
          const textArea = document.getElementById('abc');
          const textAreaOutput = normilizeNotes(song);
          textArea.value = textAreaOutput;
          initEditor();
          window.scrollTo(0,document.body.scrollHeight);
          document.getElementById('download-notes').style.visibility = 'visible';

     } else {
       self.lastNote = note.name;
     }
    }
  }, 250);

  this.tuner.onNoteDetected = callBack;


  swal("Натиснете Продължи за да започнете...").then(function () {
    self.tuner.init();
  });
};

const app = new Application();
app.start();
