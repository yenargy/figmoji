import './ui.css'

let emojiUnicodeList = [];

const removeElementByClass = elemName => {
    var elem = document.getElementsByClassName(elemName);
    if (elem.length > 0) {
        elem[0].remove();
    }
}

// Listing all the Emojis from the unicode list onto the view
const populateEmojis = (list) => {
    let emojiUnicodes = '';
    for(let i=0; i<list.length; i++) {
        if(!emojiUnicodes.includes(twemoji.convert.fromCodePoint(list[i].codes))) {
            emojiUnicodes += twemoji.convert.fromCodePoint(list[i].codes);
        }
    }
    removeElementByClass('emoji-inner-container');
    let div = document.createElement('div');
    div.textContent = emojiUnicodes;
    div.className = 'emoji-inner-container';
    document.getElementById('emoji-container').appendChild(div);

    twemoji.parse(document.getElementById('emoji-container'), {
        folder: 'svg',
        ext: '.svg',
        size: 128
    });

    let imgs = document.getElementsByTagName("img");
    for (let i = 0; i < imgs.length; i++) {
        let src = imgs[i].src;
        imgs[i].onclick = function() {fetchImg(src)};
    }
}

/* Fetching the unicodelist from
 * https://github.com/amio/emoji.json
 */
const fetchEmojiUnicodes = () => {
    fetch("https://unpkg.com/emoji.json@12.1.0/emoji.json")
    .then(res => res.json())
    .then((emojiList) => {
        emojiUnicodeList = emojiList;
        populateEmojis(emojiList);
    })
    .catch(() => {
        console.log('There was an issue while fetching the emoji list');
        document.getElementById('emoji-container').setAttribute('style', 'display:none');
        document.getElementById('error').setAttribute('style', 'display:flex');
    });
}

// Asking figma to add selected emoji onto canvas
const postMessage = (svg) => {
    parent.postMessage({
        pluginMessage: {
            type: 'insert-image',
            svg,
        }
    }, '*');
}

// Fetching svg code of selected Emoji
const fetchImg = url => {
    fetch(url).then(r => r.arrayBuffer()).then(buff => {
        let blob = new Blob([new Uint8Array(buff)], {type: "image/svg"});
        const reader = new FileReader()
        reader.onload = () => postMessage(reader.result);
        reader.readAsText(blob);
    });
}

// Debounce setup variables
let typingTimer;
let doneTypingInterval = 500;
let searchInput = document.getElementById('search');

// On keyup event listener
searchInput.addEventListener('keyup', () => {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(doneTyping, doneTypingInterval);
});

// After debounce function
function doneTyping () {
    const searchValue = searchInput.value;
    if (searchValue) {
        let filteredEmojiList = emojiUnicodeList.filter((element, index) =>  {
            if (element.name.includes(searchValue) || element.category.includes(searchValue)) {
                return true;
            }
            return false;
        });
        if (filteredEmojiList.length === 0) {
            removeElementByClass('emoji-inner-container');
            document.getElementById('empty-search').setAttribute('style', 'display: flex');
        } else {
            document.getElementById('empty-search').setAttribute('style', 'display:none');
            populateEmojis(filteredEmojiList);
        }
    } else {
        populateEmojis(emojiUnicodeList);
    }
}

// Triggering unicode list call
fetchEmojiUnicodes();