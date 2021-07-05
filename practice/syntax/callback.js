// 익명 함수(anonymous function)
// 익명함수를 변수에 할당
var a = function () {
    console.log('A');
}
// a();
// a 변수 뒤에 함수 호출 연산자()를 지정함으로써 a 변수에 담긴 함수를 호출

function slowfunc(callback) {
    callback();
}

slowfunc(a);