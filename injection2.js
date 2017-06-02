document.onclick = function () {
    updateNodesState();
};

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
        toggleHoverEffect();
    }
    buttonNode.style.padding = '22px 22px';
    buttonNode.style.borderRadius = '25px';
}

var toggleHoverEffect = function () {
    if (juiceButtonPressed) {
        var allChildren = document.getElementsByTagName("*");
        for (var i = 0; i < allChildren.length; i++) {
            allChildren[i].onmouseover = function (evt) {
                evt.stopPropagation();
                this.style.backgroundColor = 'red';
                console.log('mouse over');
            }
            allChildren[i].onmouseout = function (evt) {
                evt.stopPropagation();
                console.log('mouse out');
                this.style.backgroundColor = 'green';
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

var updateNodesState = function (_evt) {
    if (juiceButtonPressed == true) {
        var evt = window.event || _evt; // window.event for IE
        if (!evt.target) {
            evt.target = evt.srcElement; // extend target property for IE
        }
        var clickedNode = evt.target;

        // update juicy state and color
        if (clickedNode.id != 'web-juicer-button') {
            if (!clickedNode.twj_juicyState) {
                // if current juicy state is false...
                console.log('juicy true');
                propagateJuicyState(clickedNode, true)
            } else {
                // if current juicy state is true...
                console.log('juicy false');
                propagateJuicyState(clickedNode, false)
            }
        }
    }
}

var propagateJuicyState = function (_currentNode, _juicyState) {
    _currentNode.twj_juicyState = _juicyState;
    if (_juicyState == true) {
        // save original color
        if (!_currentNode.twj_originalColor) {
            _currentNode.twj_originalColor = getComputedStyle(_currentNode).backgroundColor;
        }
        // save original filter
        if(!_currentNode.twj_originalFilter){
            _currentNode.twj_originalFilter = getComputedStyle(_currentNode).filter;
        }
        if(_currentNode.tagName == 'IMG'){
            _currentNode.style.filter = 'sepia(1)';
        } else {
            _currentNode.style.backgroundColor = 'yellow';
        }

    } else {
        // reset its color
        if (_currentNode.twj_originalColor) {
            _currentNode.style.backgroundColor = _currentNode.twj_originalColor;
        }
        // reset its filter
        if (_currentNode.twj_originalFilter){
            _currentNode.style.filter = _currentNode.twj_originalFilter;
        }
    }

    // update all children's juicy states and colors recursively
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