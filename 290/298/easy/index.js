var cleanParens = require('./cleanParens.js');

function testSuite(tests, label){
    console.log('Running: '+label);
    var result;
    for( var i=0; i<tests.length; i++ ){
        result = undefined;
        error = undefined;
        try{
            result = cleanParens(tests[i].in);
        } catch (e){
            error = e.stack;
        } finally {
            console.log(result == tests[i].out ? 'Pass': 'Fail');
            console.log('  Expected \''+tests[i].in+'\' -> \''+tests[i].out+'\'');
            if( error ){
                console.log('    Result: '+error);
            }
            else{
                console.log('    Result: \''+result+'\'');
            }
        }
    }
}

var tests = [
{in: "((a((bc)(de)))f)",    out: "((a((bc)(de)))f)"},
{in: "(((zbcd)(((e)fg))))", out: "((zbcd)((e)fg))"},
{in: "ab((c))",             out: "ab(c)"}
];

var bonusTests = [
{in: "()",                  out: ""},
{in: "((fgh()()()))",       out: "(fgh)"},
{in: "()(abc())",           out: "(abc)"}
];

testSuite(tests, 'Base Tests');
testSuite(bonusTests, 'Bonus Tests');