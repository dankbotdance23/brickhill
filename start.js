const nh = require('node-hill')

nh.startServer({
    gameId: 22904, // Your game id here

    port: 42480, // Your port id here (default is 42480)

    local: false, // Whether or not your server is local

    map: './maps/army.brk',
    
    scripts: './user_scripts', // Your .js files location

    cheatsAdmin: {
        admins: [293276, 293453],
        audit: true,
        safeCommands: false
    }
})