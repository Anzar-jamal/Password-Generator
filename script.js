const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");

const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateBtn");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '@#$%&!?<>*';

let password = "";
let passwordLength = 10;
let checkCount = 0;


handleSlider();


// set password length
function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
}


function setIndicator(color) {
    indicator.style.backgroundColor = color;
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max-min)) +min;
}


function generateRandomNumber(){

    return getRndInteger(0,10);
}


function generateLowercase() {
    
    return String.fromCharCode(getRndInteger(97,123));
}


function generateUppercase() {

    return String.fromCharCode(getRndInteger(65,91));
}


function generateSymbol() {

    return symbols.charAt(getRndInteger(0,symbols.length));

}



function calcStrength() {

    let hasUpper = false
    let hasLower = false
    let hasNum = false
    let hasSym = false

    if(uppercaseCheck.checked) hasUpper = true;
    if(lowercaseCheck.checked) hasLower = true;
    if(numbersCheck.checked) hasNum = true;
    if(symbolsCheck.checked) hasSym = true;


    if( hasUpper && hasLower && (hasNum || hasSym) && passwordLength>=8){

        setIndicator("#0f0");

    }
    else if( (hasUpper || hasLower) && (hasNum || hasSym) && passwordLength>=6 ){

        setIndicator("#ff0");
    }

    else{
        setIndicator("#f00");
    }

}


async function copyContent() {

    try{

        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    }

    catch(e) {

        copyMsg.innerText("failed");
    }

    copyMsg.classList.add("active");

    setTimeout( () => {

        copyMsg.classList.remove("active");
    },2000)
}



function handleCheckBoxChange () {
    checkCount = 0;
    allCheckBox.forEach( (checkbox) => {
        if(checkbox.checked)
            checkCount++;
    });


    // special condition
    if(passwordLength < checkCount ){

        passwordLength = checkCount;
        handleSlider();
    }
}



allCheckBox.forEach( (checkbox) => {
    checkbox.addEventListener('change',handleCheckBoxChange)
});


inputSlider.addEventListener('input', (e) =>{
    passwordLength = e.target.value;
    handleSlider();
});


copyBtn.addEventListener('click', () => {
    if(passwordDisplay.value){

        copyContent();
    }
});




generateBtn.addEventListener('click', () => {

    if(checkCount <= 0) return;

    if(passwordLength < checkCount){

        passwordLength = checkCount;
        handleSlider();
    }


    // lets start the journey to find new password

    // remove old password

    password = "";



    let funcArr = [];

    if(uppercaseCheck.checked)
        funcArr.push(generateUppercase);

    if(lowercaseCheck.checked)
        funcArr.push(generateLowercase);

    if(numbersCheck.checked)
        funcArr.push(generateRandomNumber);

    if(symbolsCheck.checked)
        funcArr.push(generateSymbol)



    // compulsary addition

    for(let i=0; i<funcArr.length; i++){

        password += funcArr[i]();
    }



    // remaining addition

    for(let i=0; i<passwordLength - funcArr.length; i++){

        let randIndex = getRndInteger(0, funcArr.length);
        password += funcArr[randIndex]();
    }


    passwordDisplay.value = password;

    calcStrength();

    
});