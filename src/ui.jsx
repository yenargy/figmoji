import * as React from 'react'
import * as ReactDOM from 'react-dom'
import _ from "lodash";
import $ from "jquery";
import './ui.css'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: false,
      emptySearch: false,
      emojiUnicodes: '',
      emojiArrayList: []
    };
  }

  componentDidMount() {
    this.fetchEmojiUnicodes();
  }

  // Listing all the Emojis from the unicode list onto the view
  populateEmojis = (list) => {
    let emojiUnicodesText = '';
    for(let i=0; i<list.length; i++) {
      if(!emojiUnicodesText.includes(list[i].char)) {
        emojiUnicodesText += list[i].char;
      }
    }
    this.setState({ emojiUnicodes: emojiUnicodesText });
    twemoji.parse(document.getElementById('emoji-container'), {
      folder: 'svg',
      ext: '.svg',
      size: 128
    });
    console.log('here 2');
    let imgs = document.getElementsByTagName("img");
    for (let i = 0; i < imgs.length; i++) {
      let src = imgs[i].src;
      imgs[i].onclick = function() {fetchImg(src)};
    }
  }

  /* Fetching the unicodelist from
  * https://github.com/amio/emoji.json
  */
  fetchEmojiUnicodes = () => {
    fetch("https://unpkg.com/emoji.json@12.1.0/emoji.json")
    .then(res => res.json())
    .then((emojiList) => {
      this.state.emojiArrayList = _.groupBy(emojiList, (emoji) => {
          return emoji.category.substr(0, emoji.category.indexOf('(')).trim();
      });
      // console.log(emojiList);
      this.populateEmojis(emojiList);
    })
    .catch(() => {
      console.log('There was an issue while fetching the emoji list');
      this.setState({ error: true });
    });
  }


  render() {
    const { error, emptySearch, emojiUnicodes } = this.state;
    return (
      <div>
        {(!error || !emptySearch) && (
          <div id="emoji-container">{emojiUnicodes}</div>
        )}
        {error && (
          <div id="error">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36" width="50"><circle fill="#FFCB4C" cx="18" cy="17.018" r="17"/><path fill="#65471B" d="M14.524 21.036c-.145-.116-.258-.274-.312-.464-.134-.46.13-.918.59-1.021 4.528-1.021 7.577 1.363 7.706 1.465.384.306.459.845.173 1.205-.286.358-.828.401-1.211.097-.11-.084-2.523-1.923-6.182-1.098-.274.061-.554-.016-.764-.184z"/><ellipse fill="#65471B" cx="13.119" cy="11.174" rx="2.125" ry="2.656"/><ellipse fill="#65471B" cx="24.375" cy="12.236" rx="2.125" ry="2.656"/><path fill="#F19020" d="M17.276 35.149s1.265-.411 1.429-1.352c.173-.972-.624-1.167-.624-1.167s1.041-.208 1.172-1.376c.123-1.101-.861-1.363-.861-1.363s.97-.4 1.016-1.539c.038-.959-.995-1.428-.995-1.428s5.038-1.221 5.556-1.341c.516-.12 1.32-.615 1.069-1.694-.249-1.08-1.204-1.118-1.697-1.003-.494.115-6.744 1.566-8.9 2.068l-1.439.334c-.54.127-.785-.11-.404-.512.508-.536.833-1.129.946-2.113.119-1.035-.232-2.313-.433-2.809-.374-.921-1.005-1.649-1.734-1.899-1.137-.39-1.945.321-1.542 1.561.604 1.854.208 3.375-.833 4.293-2.449 2.157-3.588 3.695-2.83 6.973.828 3.575 4.377 5.876 7.952 5.048l3.152-.681z"/><path fill="#65471B" d="M9.296 6.351c-.164-.088-.303-.224-.391-.399-.216-.428-.04-.927.393-1.112 4.266-1.831 7.699-.043 7.843.034.433.231.608.747.391 1.154-.216.405-.74.546-1.173.318-.123-.063-2.832-1.432-6.278.047-.257.109-.547.085-.785-.042zm12.135 3.75c-.156-.098-.286-.243-.362-.424-.187-.442.023-.927.468-1.084 4.381-1.536 7.685.48 7.823.567.415.26.555.787.312 1.178-.242.39-.776.495-1.191.238-.12-.072-2.727-1.621-6.267-.379-.266.091-.553.046-.783-.096z"/></svg>
            <p>Hmmmmmm</p><p>Looks like there's some issue while fetching the emojis. Please check your internet connectivity and restart the plugin.</p>
            <p>If you still face this issue, send a tweet to <b>@nitinrgupta</b></p>
          </div>
        )}
        {emptySearch && (
          <div id="empty-search">
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 36C27.9411 36 36 27.9411 36 18C36 8.05887 27.9411 0 18 0C8.05887 0 0 8.05887 0 18C0 27.9411 8.05887 36 18 36Z" fill="#FFCC4D"/>
                <path d="M23.485 28.879C23.474 28.835 22.34 24.5 18 24.5C13.66 24.5 12.526 28.835 12.515 28.879C12.462 29.092 12.559 29.31 12.747 29.423C12.935 29.535 13.18 29.509 13.343 29.363C13.352 29.355 14.356 28.5 18 28.5C21.59 28.5 22.617 29.33 22.656 29.363C22.751 29.453 22.875 29.5 23 29.5C23.084 29.5 23.169 29.479 23.246 29.436C23.442 29.324 23.54 29.097 23.485 28.879ZM11.226 15.512C10.909 15.512 10.59 15.551 10.279 15.628C7.409 16.335 6.766 19.749 6.74 19.895C6.7 20.118 6.816 20.338 7.021 20.435C7.088 20.466 7.161 20.482 7.232 20.482C7.377 20.482 7.519 20.419 7.617 20.302C7.627 20.29 8.627 19.124 10.996 18.541C11.71 18.365 12.408 18.276 13.069 18.276C14.173 18.276 14.801 18.529 14.804 18.53C14.871 18.558 14.935 18.57 15.011 18.57C15.283 18.582 15.52 18.349 15.52 18.07C15.52 17.905 15.44 17.759 15.317 17.668C14.95 17.233 13.364 15.512 11.226 15.512V15.512ZM24.774 15.512C25.091 15.512 25.41 15.551 25.721 15.628C28.591 16.335 29.234 19.749 29.26 19.895C29.3 20.118 29.184 20.338 28.979 20.435C28.912 20.466 28.839 20.482 28.768 20.482C28.623 20.482 28.481 20.419 28.383 20.302C28.373 20.29 27.373 19.124 25.004 18.541C24.29 18.365 23.592 18.276 22.931 18.276C21.827 18.276 21.2 18.529 21.196 18.53C21.129 18.558 21.065 18.57 20.99 18.57C20.718 18.582 20.481 18.349 20.481 18.07C20.481 17.905 20.561 17.759 20.684 17.668C21.05 17.233 22.636 15.512 24.774 15.512V15.512Z" fill="#664500"/>
            </svg>
            <p>Looks like there are no emojis with your search query! Please change the search term and try again.</p>
          </div>
        )}
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('react-page'))