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
            console.log('Starting Prep');
            var timer = process.hrtime();
            if( dictionaryCache[0].points === undefined ){
                dictionaryCache = dictionaryCache
                .map((word)=>{
                    return {
                        points: Array.prototype.slice.call(word).reduce((total, char, index)=>{return total + points[char]*(index+1)},0),
                        word: word,
                        counts: Array.prototype.slice.call(word).reduce((counts, char)=>{counts[char]=(counts[char]?counts[char]+1:1);counts.total++;return counts},{total:0}),
                    };
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

function getDictionary(){
    return dictionaryCache;
}

module.exports = {
    loadDictionary: loadDictionary,
    prep: prep,
    getDictionary: getDictionary
};