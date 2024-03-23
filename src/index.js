var modes = ["standard", "convert", "history"]
var btns = []
var ifms = []
var this_mode = 0
const smallsize="15px"
const bigsize = "18px"



window.onload = () => {
  for (let i = 0; i < modes.length; i++) {
    btns.push(document.getElementById(modes[i] + "-btn"))
    ifms.push(document.getElementById(modes[i] + "-ifm"))
    ifms[i].style.width="100%"
    ifms[i].style.height=window.outerHeight-90+"px"
    if (i != this_mode) {
      ifms[i].style.display = "none"
    }
    else {
      ifms[i].style.display = "block"
    }
  }
  btns[this_mode].style.color = "blue"
  btns[this_mode].style.fontSize = bigsize
  let j = 0

  function setSrc() {
    ifms[j].src ="html/"+modes[j] + ".html"
    ifms[j].onload = setSrc
    j++
  }
  setSrc()

}


function change_mode(new_mode) {
  var i = btns.indexOf(new_mode)
  if (i != this_mode) {
    btns[this_mode].style.color = "black"
    btns[this_mode].style.fontSize = smallsize
    btns[i].style.fontSize = bigsize
    btns[i].style.color = "blue"
    for (ifm of ifms) {
      ifm.style.display = "block"
      ifm.style.left = parseInt(window.getComputedStyle(ifm).left) - (i - this_mode) * screen.width + "px"
    }
    setTimeout(() => {
      for (ifm of ifms) {
        if (ifm.id != ifms[btns.indexOf(new_mode)].id) {
          ifm.style.display = "none"
        }
      }
    }, 160)
    this_mode = i
  }
}

function getViewportSize() {
  var viewportWidth = window.innerWidth
  var viewportHeight = window.innerHeight
  return {
    width: viewportWidth,
    height: viewportHeight
  };
}