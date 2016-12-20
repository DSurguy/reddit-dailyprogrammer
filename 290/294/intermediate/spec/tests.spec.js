var scrabble = require('../scrabble.js');

describe('Highest Score', function (){
    beforeAll((done)=>{
        scrabble.prep().then(done);
    });
    it('highest("iogsvooely") -> 44 ("oology")', (done)=>{
        scrabble.highest("iogsvooely").then((word)=>{
            expect(word.word).toBe("oology");
            done();
        }).catch(console.error);
    });
    it('highest("seevurtfci") -> 52 ("service")', (done)=>{
        scrabble.highest("seevurtfci").then((word)=>{
            expect(word.word).toBe("service");
            done();
        }).catch(console.error);
    });
    it('highest("vepredequi") -> 78 ("reequip")', (done)=>{
        scrabble.highest("vepredequi").then((word)=>{
            expect(word.word).toBe("reequip");
            done();
        }).catch(console.error);
    });
    it('highest("umnyeoumcp") -> 52 ("eponym")', (done)=>{
        scrabble.highest("umnyeoumcp").then((word)=>{
            expect(word.word).toBe("eponym");
            done();
        }).catch(console.error);
    });
    it('highest("orhvtudmcz") -> 41 ("vouch")', (done)=>{
        scrabble.highest("orhvtudmcz").then((word)=>{
            expect(word.word).toBe("vouch");
            done();
        }).catch(console.error);
    });
    it('highest("fyilnprtia") -> 67 ("nitrify")', (done)=>{
        scrabble.highest("fyilnprtia").then((word)=>{
            expect(word.word).toBe("nitrify");
            done();
        }).catch(console.error);
    });
});