import './ui.css'
import _ from "lodash";
import $ from "jquery";

let emojiUnicodeList = [];

$(document).ready(function () {
    fetchEmojiUnicodes();
});

// On clicking tabs
$(document).on("click","ul.tabs li", function(){
    const category = $(this).attr('data-tab');
    $('ul.tabs li').removeClass('current');
    $('.tab-content').removeClass('current');
    populateEmojis(emojiUnicodeList[category]);
    $(this).addClass('current');
    $('#emoji-container').scrollTop(0);
});

// Adding shadow on scroll
$('#emoji-container').on('scroll', function() {
    if (!$('#emoji-container').scrollTop()) {
        $('.container').removeClass('shadow')    
    } else {
        $('.container').addClass('shadow')
    }
})

// Listing all the Emojis from the unicode list onto the view
const populateEmojis = (list) => {
    let emojiUnicodes = '';
    for(let i=0; i<list.length; i++) {
        if(!emojiUnicodes.includes(list[i].char)) {
            emojiUnicodes += list[i].char;
        }
    }

    document.getElementById('emoji-container').textContent = emojiUnicodes;

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
        emojiUnicodeList = _.groupBy(emojiList, (emoji) => {
            return emoji.category.substr(0, emoji.category.indexOf('(')).trim();
        });

        // Adding appropriate category tabs
        for (const key in emojiUnicodeList) {
            $('#tab-list').append('<li class="tab-link" data-tab="' + key +'">' + key + '</li>');
        }
        $('.tab-link').eq(0).click();
        
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