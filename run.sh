launchctl unload -w ~/Library/LaunchAgents/homebrew.mxcl.mongodb-community.plist
launchctl load -w ~/Library/LaunchAgents/homebrew.mxcl.mongodb-community.plist

brew services start mongodb/brew/mongodb-community

npm run start
