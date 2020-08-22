const Notes = function (selector, tuner) {
  this.tuner = tuner;
  this.isAutoMode = true;
  // this.$root = document.querySelector(selector);
  // this.$notesList = this.$root.querySelector(".notes-list");
  this.$notes = [];
  this.$notesMap = {};
  // this.createNotes();
};

// const debounce = (fn, timeMs) => {
//   let timeout;

//   return (...rest) => {
//     if (!timeMs) {
//       fn(...rest);
//     } else {
//       timeout && window.clearTimeout(timeout);
//       timeout = window.setTimeout(() => fn(...rest), timeMs);
//     }
//   };
// };

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

let currentNoteIndex = 0;
let song = [
  { name: "E" },
  { name: "E" },
  { name: "F" },
  { name: "G" },
  { name: "G" },
  { name: "F" },
  { name: "E" },
  { name: "D" },
  { name: "C" },
  { name: "C" },
  { name: "D" },
  { name: "E" },
  { name: "E" },
  { name: "D" },
  { name: "D" },
];

const Application = function () {
  this.tuner = new Tuner();
  this.notes = new Notes(".notes", this.tuner);
};
Application.prototype.start = function () {
  const self = this;
  document.getElementsByClassName(
    "next-note-container"
  )[0].innerHTML = `Следваща нота: ${song[0].name}`;

  const callBack = throttle(function onNoteDetected(note) {
    if (self.notes.isAutoMode) {
      if (self.lastNote === note.name) {
        const currentNoteFromTheSong = song[currentNoteIndex]
          ? song[currentNoteIndex].name
          : undefined;
        // console.log("note --> ", currentNoteFromTheSong, currentNoteIndex);

        if (note.name === currentNoteFromTheSong) {
          currentNoteIndex++;
          const nextNote = song[currentNoteIndex]
            ? song[currentNoteIndex].name
            : undefined;
          const nextNoteDomElement = document.getElementsByClassName(
            "next-note-container"
          )[0];

          nextNoteDomElement.classList.add("on-success");
          nextNoteDomElement.innerHTML =
            nextNote === undefined
              ? `Последната нота: ${song[song.length - 1].name}`
              : `Следваща нота: ${nextNote}`;
          setTimeout(
            () => nextNoteDomElement.classList.remove("on-success"),
            80
          );
        } else if (currentNoteFromTheSong === undefined) {
          document.getElementsByClassName("next-note-container")[0].innerHTML =
            "Поздравления!";
        }
      } else {
        self.lastNote = note.name;
      }
    }
  }, 200);

  this.tuner.onNoteDetected = callBack;

  // this.tuner.onNoteDetected = function (note) {
  //   if (self.notes.isAutoMode) {
  //     if (self.lastNote === note.name) {
  //       const currentNoteFromTheSong = song[currentNoteIndex]
  //         ? song[currentNoteIndex].name
  //         : undefined;
  //       console.log("note --> ", currentNoteFromTheSong, currentNoteIndex);
  //       if (note.name === currentNoteFromTheSong) {
  //         console.warn("Success");
  //         currentNoteIndex++;
  //       }
  //     } else {
  //       self.lastNote = note.name;
  //     }
  //   }
  // };

  swal("Натиснете Продължи за да започнете обучението...").then(function () {
    self.tuner.init();
  });
};

const app = new Application();
app.start();
