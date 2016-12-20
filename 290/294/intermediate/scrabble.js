var _ = require('lodash'),
    fs = require('fs');

var dictionaryCache = undefined;

var points = {
    a: 1,
    b: 3,
    c: 3,
    d: 2,
    e: 1,
    f: 4,
    g: 2,
    h: 4,
    i: 1,
    j: 8,
    k: 5,
    l: 1,
    m: 3,
    n: 1,
    o: 1,
    p: 3,
    q: 10,
    r: 1,
    s: 1,
    t: 1,
    u: 1,
    v: 4,
    w: 4,
    x: 8,
    y: 4,
    z: 10
};

function loadDictionary(){
    var timer = process.hrtime();
    return new Promise((resolve, reject)=>{
        if( !dictionaryCache ){
            dictionaryCache = [];
            var rs = fs.createReadStream('./enable1.txt', {
                    encoding: 'utf8'
                });
            rs.on('readable', ()=>{
                var chunk,
                    word = '';
                while((chunk = rs.read(1)) != null){
                    if( chunk.match(/\r|\n/g) ){
                        if( word !== '' ){
                            dictionaryCache.push(word)
                        }
                        //newline, we need to start over
                        word = '';
                    }
                    else{
                        word += chunk;
                    }
                }
            });
            rs.on('end', ()=>{
                timer = process.hrtime(timer);
                console.log(`Load took ${timer[0]*1000+timer[1]/1e6} ms`);
                resolve();
            });
            rs.on('error', (err)=>{
                reject(err);
            });
        }
        else{
            resolve();
        }
    });
};

function prep(){
    return new Promise((resolve, reject)=>{
        loadDictionary().then(()=>{
            var timer = process.hrtime();
            if( dictionaryCache[0].points === undefined ){
                dictionaryCache = dictionaryCache
                .map((word)=>{
                    var obj = {
                        points: 0,
                        word:word,
                        counts: {}
                    };
                    for( var i=0; i<word.length; i++ ){
                        obj.points += points[word[i]]*(i+1);
                        obj.counts[word[i]] = (obj.counts[word[i]]||0)+1
                    }
                    return obj;
                })
                .sort((a,b)=>{
                    if( a.points > b.points ){
                        return -1;
                    }
                    else if( b.points > a.points ){
                        return 1;
                    }
                    return 0;
                });
            }
            timer = process.hrtime(timer);
            console.log(`Prep took ${timer[0]*1000+timer[1]/1e6} ms`);
            resolve();
        });
    });
};

function highest(tiles){
    return new Promise((resolve, reject)=>{
        loadDictionary().then(function (){
            for( var i=0; i<dictionaryCache.length; i++ ){
                if( scrabble(tiles, dictionaryCache[i]) ){
                    resolve(dictionaryCache[i]);
                    break;
                }
            }
            resolve(undefined);
        });
    });
};

function scrabble(tiles, word){
    var tileCount = getTileCounts(tiles);
    //reduce tile counts until we make the word or run out.
    for( var i=0; i<word.word.length; i++ ){
        //check and decrement
        if( !tileCount[word.word[i]] ){
            //see if we can use a wildcard
            if( !tileCount['?'] ){
                //can't make the word, no wildcards to use
                return false;
            }
            else{
                tileCount['?']--;
            }
        } else {
            tileCount[word.word[i]]--;
        }
    }
    return true;
}

//utility function to snag tile counts
function getTileCounts(tiles){
    var count = {};
    for( var i=0; i<tiles.length; i++ ){
        count[tiles[i]] = (count[tiles[i]]||0)+1
    }
    return count;
}

module.exports = {
    loadDictionary: loadDictionary,
    prep: prep,
    highest: highest
};