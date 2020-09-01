var db = require('../db');


getAllSongs = () => new Promise((resolve, reject) => {
    db.query('SELECT * from song', function (error, results, fields) {
        if (error){
            reject();
        }else{
            resolve(results);
        }
    });
});

module.exports = {
    getAllSongs,
};
