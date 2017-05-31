// div 에서 onclick 액션이 달려있으면

window.onload = function () {
    init();
};
document.onclick = function () {
    updateNodeState();
};

var targetOpacity = 0.44444;
var targetAlpha = 0.2;
var juiceButtonPressed = false;

var init = function () {
    addButton();
}

var addButton = function () {
    var fragment = createFrag('<button id="web-juicer-button" type="button">Let\'s juice!</button>');
    document.body.insertBefore(fragment, document.body.childNodes[0]);
    var buttonNode = document.getElementById('web-juicer-button');
    buttonNode.style.backgroundColor = 'white';
    buttonNode.onclick = function () {
        updateButtonState();
        toggleClickables();
        // toggleHoverEffect();
    }
    buttonNode.style.padding = '22px 22px';
    buttonNode.style.borderRadius = '25px';
}

var toggleHoverEffect = function () {
    if (juiceButtonPressed) {
        var allChildren = document.getElementsByTagName("*");
        for (var i = 0; i < allChildren.length; i++) {
            allChildren[i].onmouseover = function () {
                this.style.opacity = targetOpacity;
            }
            allChildren[i].onmousemove = function () {
                var x = event.clientX;
                var y = event.clientY;
                var elementMouseIsOver = document.elementFromPoint(x, y);
                if (elementMouseIsOver !== this) {
                    var classNames = (this.className + "").split(" ");
                    if (classNames[classNames.length - 1] != 'juicy-false') {
                        this.style.opacity = 1.0;
                    }
                }
            }
            allChildren[i].onmouseout = function () {
                var classNames = (this.className + "").split(" ");
                if (classNames[classNames.length - 1] != 'juicy-false') {
                    this.style.opacity = 1.0;
                }
            }

        }
    }
}

// function to update juice button
var updateButtonState = function () {
    var button = document.getElementById('web-juicer-button');
    var buttonColor;
    if (juiceButtonPressed == false) {
        buttonColor = 'yellow';
        juiceButtonPressed = true;
    } else {
        buttonColor = 'white';
        juiceButtonPressed = false;
    }
    button.style.backgroundColor = buttonColor;
}

// function to enable or disable all the buttons or hyperlinks
var toggleClickables = function () {
    var allButtons = [].concat(document.getElementsByTagName('button'));
    for (var i = 0; i < allButtons.length; i++) {
        if (allButtons[i].id == 'web-juicer-button') {
            allButtons.splice(i, 1);
        }
    }
    var allHrefs = document.getElementsByTagName('a');
    // var allVideos = document.getElementsByTagName('video');

    if (juiceButtonPressed) {
        for (var i = 0; i < allButtons.length; i++) {
            allButtons[i].disabled = true;
        }
        for (var i = 0; i < allHrefs.length; i++) {
            allHrefs[i].style.pointerEvents = 'none';
        }
        // for (var i = 0; i < allVideos.length; i++) {
        //     allVideos[i].src = '';
        // }
    } else {
        for (var i = 0; i < allButtons.length; i++) {
            allButtons[i].disabled = false;
        }
        for (var i = 0; i < allHrefs.length; i++) {
            allHrefs[i].style.pointerEvents = 'auto';
        }
        // for (var i = 0; i < allVideos.length; i++) {
        //     allVideos[i].src = '';
        // }
    }
}

var updateNodeState = function (_evt) {
    if (juiceButtonPressed == true) {
        var evt = window.event || _evt; // window.event for IE
        if (!evt.target) {
            evt.target = evt.srcElement; // extend target property for IE
        }
        var clickedNode = evt.target;

        // update juicy state and color
        if (clickedNode.id != 'web-juicer-button') {
            var classNames = (clickedNode.className + "").split(" ");
            if (classNames[classNames.length - 1] == 'juicy-false') {
                // change state from juicy-false to juicy-true
                propagateJuicyState(clickedNode, true)
            } else {
                // change state from juicy-true to juicy-false
                propagateJuicyState(clickedNode, false)
            }
        }
    }
}

var propagateJuicyState = function (_currentNode, _juicyState) {
    if (_juicyState == true) {
        // remove 'juicy-false' from current node's class and update opacity
        var temp = (_currentNode.className + '').split(' ');
        temp.pop();
        temp = [].concat(temp);
        _currentNode.className = temp.join(' ');

        var colorCoord = parseColorString(getComputedStyle(_currentNode).color);
        var colorCoordBg = parseColorString(getComputedStyle(_currentNode).backgroundColor);
        if (colorCoord.length == 4 && colorCoord[3] == targetAlpha) {
            _currentNode.style.color = makeRgbaString(colorCoord, 1.0);
            _currentNode.style.backgroundColor = makeRgbaString(colorCoordBg, 1.0);
        }
        if (_currentNode.tagName == 'IMG' && _currentNode.style.opacity == targetOpacity) {
            _currentNode.style.opacity = 1.0;
        }
    } else {
        // add 'juicy-false' to current node's class and update opacity
        _currentNode.className += ' juicy-false';
        var parentElementNode = findParentElementNode(_currentNode);
        if (parentElementNode.style.opacity != targetOpacity) {
            if (_currentNode.tagName == 'IMG') {
                _currentNode.style.opacity = targetOpacity;
            } else {
                var colorString = getComputedStyle(_currentNode).color;
                var colorCoord = parseColorString(colorString);
                var rgba_c = makeRgbaString(colorCoord, targetAlpha);
                _currentNode.style.color = rgba_c;

                var colorString_bc = getComputedStyle(_currentNode).backgroundColor;
                var colorCoord_bc = parseColorString(colorString_bc);
                var rgba_bc = makeRgbaString(colorCoord_bc, targetAlpha);
                console.log('before: ' + rgba_bc);
                if (colorCoord_bc[0] === '0' && colorCoord_bc[1] === '0' && colorCoord_bc[2] === '0') {
                    // if rgba is (0,0,0,x) then it usually means there was no specified color.
                    // thus make it white as default.
                    rgba_bc = 'rgba(255, 255, 255, 0)';
                }
                console.log('after: ' + rgba_bc);
                _currentNode.style.backgroundColor = rgba_bc;
                // _currentNode.style.backgroundColor = 'white';
                // console.log('white');
            }
        }
    }

    // update all children's sates recursively
    var children = _currentNode.childNodes;
    for (var i = 0; i < children.length; i++) {
        if (children[i].tagName) {
            propagateJuicyState(children[i], _juicyState);
        }
    }
}


/////////////////////////////// Utils //////////////////////////////////

var parseColorString = function (_colorString) {
    var colorCoord = _colorString.split(/[\s,()]+/);
    colorCoord = colorCoord.filter(Boolean);
    colorCoord = colorCoord.splice(1);
    return colorCoord;
}

var makeRgbaString = function (_colorCoord, _alpha) {
    var alphaString = _alpha + "";
    var rgbaString = 'rgba(' + _colorCoord[0] + ', ' + _colorCoord[1] + ', ' + _colorCoord[2] + ', ' + alphaString + ')';
    return rgbaString;
}


var findParentElementNode = function (_node) {
    var parentElementNode;
    var tempParent = _node.parentNode;
    while (tempParent) {
        if (tempParent.tagName) {
            parentElementNode = tempParent;
            break;
        } else {
            tempParent = tempParent.parentNode;
        }
    }
    return parentElementNode;
}

var findAllParentsElementNodes = function (_node) {
    var allParents = [];
    var tempParent = findParentElementNode(_node);
    while (tempParent) {
        allParents.concat(tempParent);
        tempParent = findParentElementNode(tempParent);
    }
    return allParents;
}

var findAllChildrenElementNodes = function (_node) {
    return _node.getElementsByTagName('*');
}

// function to create fragment (node of DOM) using HTML string
var createFrag = function (_htmlString) {
    var frag = document.createDocumentFragment();
    var temp = document.createElement('div');
    temp.innerHTML = _htmlString;
    while (temp.firstChild) {
        frag.appendChild(temp.firstChild);
    }
    return frag;
}