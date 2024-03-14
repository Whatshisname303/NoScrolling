## Description

Small chrome extension to block Youtube recommended videos stripping the site down to only show what you're currently watching, and a search bar.

You can schedule a time frame where the extension will disable if you want to set some time aside to mindlessly scroll, but there is a 5 minute minimum delay to make sure it isn't impulsive. You could just disable the extension, but at least you'll probably feel bad about it.

This likely could have been done through using context scripts to make the code more intuitive and less buggy, although I just built what I could figure out the fastest. The extension sometimes won't disable automatically when it's scheduled to; I couldn't figure out why, but refreshing the page will always get it to the right state.

## Use

1. Clone the repo
2. Go to chrome://extensions
3. Enable developer mode in the top right
4. Press Load Unpacked
5. Select the folder for this repository

The extension will inject css to hide unnecessary content on Youtube pages once it's installed, and scheduling timeframes to disable it should be pretty intuitive.

<img width="167" alt="image" src="https://github.com/Whatshisname303/NoScrolling/assets/120993368/64c16833-1469-48ad-b2bc-2dc6ddd37f28">
