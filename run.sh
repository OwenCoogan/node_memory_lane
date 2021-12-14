sudo launchctl unload -w ~/Library/LaunchAgents/homebrew.mxcl.mongodb-community.plist
sudo launchctl load -w ~/Library/LaunchAgents/homebrew.mxcl.mongodb-community.plist

sudo brew services start mongodb/brew/mongodb-community

npm run start
