var {scrabble, longest} = require('../scrabble.js');

describe('Basic Requirements', function (){
    // scrabble("ladilmy", "daily") -> true
    // scrabble("eerriin", "eerie") -> false
    // scrabble("orrpgma", "program") -> true
    // scrabble("orppgma", "program") -> false
    it('"ladilmy", "daily" -> true', function (){
        expect(scrabble("ladilmy", "daily")).toBe(true);
    });
    it('"eerriin", "eerie" -> false', function (){
        expect(scrabble("eerriin", "eerie")).toBe(false);
    });
    it('"orrpgma", "program" -> true', function (){
        expect(scrabble("orrpgma", "program")).toBe(true);
    });
    it('"orppgma", "program" -> false', function (){
        expect(scrabble("orppgma", "program")).toBe(false);
    });
});

describe('Wildcard', function (){
    // scrabble("pizza??", "pizzazz") -> true
    // scrabble("piizza?", "pizzazz") -> false
    // scrabble("a??????", "program") -> true
    // scrabble("b??????", "program") -> false

    it('"pizza??", "pizzazz" -> true', function (){
        expect(scrabble("pizza??", "pizzazz")).toBe(true);
    });
    it('"piizza?", "pizzazz" -> false', function (){
        expect(scrabble("piizza?", "pizzazz")).toBe(false);
    });
    it('"a??????", "program" -> true', function (){
        expect(scrabble("a??????", "program")).toBe(true);
    });
    it('"b??????", "program" -> false', function (){
        expect(scrabble("b??????", "program")).toBe(false);
    });
});

describe('Longest From Dictionary', function (){
    // longest("dcthoyueorza") ->  "coauthored"
    // longest("uruqrnytrois") -> "turquois"
    // longest("rryqeiaegicgeo??") -> "greengrocery"
    // longest("udosjanyuiuebr??") -> "subordinately"
    // longest("vaakojeaietg????????") -> "ovolactovegetarian"
    
    it('"dcthoyueorza" -> "coauthored"', function (done){
        longest("dcthoyueorza")
        .then((result)=>{
            expect(result).toBe("coauthored");
            done();
        }).catch((err)=>{
            console.error(err);
            expect(false).toBe(true);
            done();
        });
    });
    it('"uruqrnytrois" -> "turquois"', function (done){
        longest("uruqrnytrois")
        .then((result)=>{
            expect(result).toBe("turquois");
            done();
        }).catch((err)=>{
            console.error(err);
            expect(false).toBe(true);
            done();
        });
    });
    it('"rryqeiaegicgeo??", "greengrocery" -> true', function (done){
        longest("rryqeiaegicgeo??")
        .then((result)=>{
            expect(result).toBe("greengrocery");
            done();
        }).catch((err)=>{
            console.error(err);
            expect(false).toBe(true);
            done();
        });
    });
    it('"udosjanyuiuebr??" -> "subordinately"', function (done){
        longest("udosjanyuiuebr??")
        .then((result)=>{
            expect(result).toBe("subordinately");
            done();
        }).catch((err)=>{
            console.error(err);
            expect(false).toBe(true);
            done();
        });
    });
    it('"vaakojeaietg????????" -> "ovolactovegetarian"', function (done){
        longest("vaakojeaietg????????")
        .then((result)=>{
            expect(result).toBe("ovolactovegetarian");
            done();
        }).catch((err)=>{
            console.error(err);
            expect(false).toBe(true);
            done();
        });
    });
});