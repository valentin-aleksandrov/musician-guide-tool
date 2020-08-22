const Notes = function (selector, tuner) {
  this.tuner = tuner;
  this.isAutoMode = true;
  // this.$root = document.querySelector(selector);
  // this.$notesList = this.$root.querySelector(".notes-list");
  this.$notes = [];
  this.$notesMap = {};
  // this.createNotes();
};
const Application = function () {
  this.tuner = new Tuner();
  this.notes = new Notes(".notes", this.tuner);
};
Application.prototype.start = function () {
  const self = this;

  this.tuner.onNoteDetected = function (note) {
    if (self.notes.isAutoMode) {
      if (self.lastNote === note.name) {
        console.log("note --> ", note);
      } else {
        self.lastNote = note.name;
      }
    }
  };

  swal("Натиснете Продължи за да започнете обучението...").then(function () {
    self.tuner.init();
  });
};

const app = new Application();
app.start();
