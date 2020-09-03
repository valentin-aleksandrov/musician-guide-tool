var db = require('../db');


const getAllSongs = () => new Promise((resolve, reject) => {
    db.query('SELECT * from song', function (error, results, fields) {
        if (error){
            reject();
        } else{
            resolve(results);
        }
    });
});

const getUniqSequence = (notesAsArray) => {
    let uniqSequnce = [notesAsArray[0]];
    for(let i = 1; i < notesAsArray.length; i++){
        if(notesAsArray[i-1] !== notesAsArray[i]) {
            uniqSequnce.push(notesAsArray[i]);
        }
    }
    return uniqSequnce;
}

const MIN_PERCENTAGE_OF_HITS = 60;

const areSongsEquals = (inputSong, song) => {
    let songFromDB = song;
    const pairsOfThreeNotes = [];
    for(let i = 2; i < inputSong.length; i+=3) {
        pairsOfThreeNotes.push([inputSong[i-2], inputSong[i-1], inputSong[i]]); 
    }

    const miNumberOfHits = (MIN_PERCENTAGE_OF_HITS/100) * pairsOfThreeNotes.length 
    let numberOfHits = 0;
    for(let i = 0; i < pairsOfThreeNotes.length; i++) {
        const foundIndex = songFromDB.indexOf(pairsOfThreeNotes[i].join(','));

        if(foundIndex >= 0) {
            numberOfHits++;
            songFromDB = songFromDB.substring(foundIndex + 6);
        }
    }

    return numberOfHits >= miNumberOfHits;
}


const findSongByNotes = ( notes ) => {
    const notesAsArray = notes.split(',');
    let uniqSequnce = getUniqSequence(notesAsArray);

    return new Promise((resolve, reject) => {
        db.query('SELECT * from song', function (error, results, fields) {
        if (error){
            reject();
        } else{
            for(let i = 0; i < results.length; i++) {
                const currentFoundSong = results[i];
                const songAsArray = currentFoundSong.value.split(',');
                const songWithUniqNotes = getUniqSequence(songAsArray);
                const areEquals = areSongsEquals(uniqSequnce, songWithUniqNotes.join(','));
                if(areEquals) {
                    resolve({ found: true, title: currentFoundSong.name });
                    break;
                }
            }
            resolve({ found: false, title: '', });
        }
    });
    });
}

module.exports = {
    getAllSongs,
    findSongByNotes,
};
