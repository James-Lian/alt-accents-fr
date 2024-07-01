var test = document.getElementById('test')

function css( element, property ) {
    return window.getComputedStyle( element, null ).getPropertyValue( property );
}

document.getElementById("test").innerHTML = css(test, 'font-family')

/* end of test - will delete later */

var accent_ind = 0;
const overlay = document.getElementById('box');

overlay.style.display = block;

/* shorcut pressed */
document.addEventListener('keydown', (event) => {
    overlay.style.display = block;
})

/* shortcut released */
document.addEventListener('keyup', (event) => {
    overlay.style.display = none;
})

function showPopup() {

}