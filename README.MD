# var let and const variable differents below

<!-- var -->
 console.log(x); When the variable declare before call then the output is undefined.
function testVar()
{
    var x = 12;
    console.log(x);
}
 var x = 30; 
 var x = 40;
console.log(x); Here the var variable redeclare type.

// testVar();
 console.log(x); 
 Here the var variable does not run the outside of the function
 So var variable works in the function scoped.It doesn't block scope.

 <!-- let -->

 function testLet()
{
    let l = 43;
    console.log(l);
}
console.log(l);

// let block scoped { } declare and access the outside then the donot work.
// if we declare the let variable after calling then the error .

// console.log(f);
// let f = 32;

let m = 23;
let m = 44;
Here the error code .It doesn't redeclare
but m = 44 is redeclare .without let its redeclare

<!-- const -->

// const variable type is the doesn't change the value. it doesn't redeclare

// const f = 23;
// f = 34; here the don't work redcelare.
// console.log(f);

function testConst()
{
    const taj = 355;
     
}
// console.log(taj);

// Here the const is also block scoped but array and object property also modify the const type variable;

const array = [23, 44, 22];
array.pop(2);
console.log(array);


# Difference between the map (),forEach()and filter()

<!-- map() -->
map() is the return of the new array and every elements transform a new array

const arr = [2, 3, 5];
const triple = arr.map(n=>n*3);
console.log(triple);
// Calls a defined callback function on each element of an array, and returns an array that contains the results.

<!-- forEach() -->
// forEach() doesn't return it give undifined
// For any iteration to use the forEach() like loop.For


const numbers = [2, 4, 6];
numbers.forEach(x => console.log(x * 2));

<!-- filter() -->

// filter is the conditional statements allow.when the one condition is satisfied then the return the array of this value 
const numbers = [23, 42, 53, 66];
const aboveFifty = numbers.filter(x => x >= 50);
console.log(aboveFifty);

# Arrow function in ES6

It is short syntax of writting function
Don't allow this binding to use the lexical this.

Noraml function 

function add (a,b){
    return a+b;
}
console.log(add(34,42));

but this function use of ES6 then format
function add(a,b)=>a+b;
console.log(add(24,12));

# Destructing of assignment in ES6

The assignment 6 of the array of object to separate then the variable and short syntax use of ES6.
when the array and object to differently follow the rules.

# Template literals in ES6

This is the most useful features in connected the dynamically to the website to the javascripts .The innerHTML use of the backtick(``) and the functionality call dynimically ${} this variable interpolation

and also use the multiline code to support this feature.

