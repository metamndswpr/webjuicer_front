// 선택되거나 호버되면 이미지는 투명도를 조절하고, 다른 것들은 폰트색 및 배경색의 투명도를 조정 (나쁜 부모 아래 착한 자식 있도록)
//// 부모를 나쁘다 그러면 일단 자동적으로 자식들도 나쁜거. 그러나 그 중 착한 자식 선택 가능. 
//// modify toggleHoverEffect

window.onload = function () { init(); };
document.onclick = function () { updateNodeState(); };

var targetOpacity = 0.44444;
var targetAlpha = 0.44444;
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

    if (juiceButtonPressed) {
        for (var i = 0; i < allButtons.length; i++) {
            allButtons[i].disabled = true;
        }
        for (var i = 0; i < allHrefs.length; i++) {
            allHrefs[i].style.pointerEvents = 'none';
        }
    } else {
        for (var i = 0; i < allButtons.length; i++) {
            allButtons[i].disabled = false;
        }
        for (var i = 0; i < allHrefs.length; i++) {
            allHrefs[i].style.pointerEvents = 'auto';
        }
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
        if (_currentNode.style.opacity == targetOpacity) {
            _currentNode.style.opacity = 1.0;
        }
    } else {
        // add 'juicy-false' to current node's class and update opacity
        _currentNode.className += ' juicy-false';
        var parentElementNode = findParentElementNode(_currentNode);
        if (parentElementNode.style.opacity != targetOpacity) {
            _currentNode.style.opacity = targetOpacity;
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

var findAllParentsElementNodes = function(_node){
    var allParents = [];
    var tempParent = findParentElementNode(_node);
    while(tempParent){
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