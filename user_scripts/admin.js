/*

Cheats' V1 COMMANDS


You do NOT need to spell out full username's of users; if the user's username is 2 or more words type the first word/part.
In commands like jump, speed, god, etc. you do not need to say your username, you can use it like /speed 10 (which will set your speed to 10) or /god (which will give you infinite health).

Commands (* means that is a toggle-able command):
/kill player - kills the player.
/kick player - kicks the player from the game.
* /mute player - mutes the player, this is a toggle-able command so if the player is already muted they will be unmuted.
/vchat message - sends a message to everyone in the game that is also an admin.
/ban player - bans the player from the game, resets once the server resets.
/ipban player - bans the player's ip, resets once the server resets.
/unban player id - unbans the player via their user id.
/unipban player IPV4 - unbans the player's IP via their IPV4. This script does not IP log and will NOT help you will that.
* /admin player - gives the player admin, this is a toggle-able command.
/tp player or x,y,z - teleports you to a player or teleports you to a coordinate. Example: /tp cheats OR /tp 0,0,0.
/god ?player - gives you infinite health or the player infinite health.
/speed ?player num - sets the player's speed to the num. *NOTE You can do /speed 10 to set your speed to 10.
/jump ?player num - sets the player's jump power to the num. *NOTE You can do /jump10 to set your jump power to 10.
/size ?player num OR num,num,num - set's the player's size to num. Example: /size 2 OR /size 2,1,2 OR /size cheats 10,10,10 etc.
/weather env - sets the weather of the Game (sun,snow,rain)
/freeze player - freezes the player.
/thaw player - thaws the player. *NOTE can't thaw a player that is not frozen.
/av id or reset - sets your avatar id to the specified one. say /av reset to reset your avatar
/server message - sends a server message
/tpme player - teleports said player to you.
/ambient color - sets the game's ambient color in hexadecimal or hex. Example: /ambient 69 OR /ambient #ff0000.
/sky color - sets the game's sky color hexadecimal or hex. Example: /sky 69 OR /sky #ff0000.
/team name - creates a team with the given name with a random color and puts you on it.

*/

const ADMINS = []
const BANNED = []
const BANNED_IPS = []
const COLORS = [
    blue = "#0066ff",
    red = "#ff0000",
    yellow = "#ffff00",
    purple = "#6f00ff",
    pink = "#ff00d0",
    orange = "#ff8800",
    green = "#22ff00"
]

function getPlayer(name) {
    for (let player of Game.players) {
        if (player.username.toLowerCase().indexOf(String(name).toLowerCase()) == 0) {
            const victim = Array.from(Game.players).find(p => p.username === player.username)
            return victim
        }
    }
}

function isAdmin(userId) {
    return ADMINS.includes(userId)
}

function v1(msg) {
    return `[#ff0000][V1]: [#ffffff]${msg}`
}

Game.on("playerJoin", player => {
    player.on("initialSpawn", () => {
        player.frozen = false;
        if (!BANNED_IPS.includes(String(player.socket.IPV4)) && !BANNED.includes(player.userId)) return;
        return player.kick("You are banned from this game.")
    })
})

Game.command("kill", (p,m) => {
    if (!isAdmin(p.userId)) return;
    const v = getPlayer(m);
    if (!v) return;
    return v.kill();
})

Game.command("kick", (p,m) => {
    if (!isAdmin(p.userId)) return;
    const a = m.split(" ")
    const v = getPlayer(String(a.splice(0,1)));
    if (!v) return;
    if (!a.length) return v.kick();
    return v.kick(a.join(" "))
})

Game.command("mute", (p,m) => {
    if (!isAdmin(p.userId)) return;
    const v = getPlayer(m);
    if (!v) return;
    return v.muted = !v.muted
})

Game.command("vchat", (p,m) => {
    if (!isAdmin(p.userId)) return;
    for (let index of ADMINS) {
        const a = Array.from(Game.players).find(p => p.userId === index)
        a.message(`[#ff0000][V1 Chat]: [#ffffff]${m}`)
    }
})

Game.command("ban", (p,m) => {
    if (!isAdmin(p.userId)) return
    const v = getPlayer(m);
    if (!v) return;

    BANNED.push(v.userId);
    p.message(v1(`You banned [#ff0000]${v.username}[#ffffff].`))
    return v.kick("You are banned from this game.")
})

Game.command("admin", (p,m) => {
    if (!isAdmin(p.userId)) return
    const v = getPlayer(m);
    if (!v) return;

    if (ADMINS.includes(v.userId)) {
        ADMINS.splice(ADMINS.indexOf(v.userId), 1);
        return p.message(v1(`You took away [#ff0000]${v.username}[#ffffff]'s admin.`))
    }

    ADMINS.push(v.userId)
    v.message(v1("You are now an admin."))
    return p.message(v1(`You gave[#ff0000] ${v.username} [#ffffff]admin.`))
})

Game.command("ipban", (p,m) => {
    if (!isAdmin(p.userId)) return
    const v = getPlayer(m);
    if (!v) return;

    BANNED_IPS.push(v.socket.IPV4);
    p.message(v1(`You IP-banned [#ff0000]${v.username}[#ffffff].`))
    return v.kick("You are banned from this game.")
})

Game.command("tp", (p, place) => {
    if (!isAdmin(p.userId)) return;
    if (place.indexOf(',') !== -1) {
        const coords = place.split(',');
        if (coords[0], coords[1], coords[2]) {
            try {
                return p.position = {
                    x: Number(coords[0]),
                    y: Number(coords[1]),
                    z: Number(coords[2])
                }
            } catch {}
        }
    } else {
        const v = getPlayer(place);
        if (v) {
            try {
                return p.position = v.position
            } catch {}
        }
    }
})

Game.command("god", (p,m) => {
    if (!isAdmin(p.userId)) return;
    const v = getPlayer(m)
    return (v) ? v.maxHealth = v.health = Number.POSITIVE_INFINITY : p.maxHealth = p.health = Number.POSITIVE_INFINITY;
});

Game.command("speed", (p,m) => {
    if (!isAdmin(p.userId)) return;
    const a = m.split(" ")
    const v = getPlayer(a[0]);
    return (v) ? v.speed = Number(a[1]) : p.speed = Number(a[0])
})

Game.command("jump", (p,m) => {
    if (!isAdmin(p.userId)) return;
    const a = m.split(" ")
    const v = getPlayer(a[0]);
    return (v) ? v.jumpPower = Number(a[1]) : p.jumpPower = Number(a[0])
})

Game.command("size", (p, m) => {
    if (!isAdmin(p.userId)) return;
    const v = getPlayer(m.split(" ")[0])
    if (v) {
        s = m.split(" ")[1].split(",");
        try {if (s.length < 3) return v.scale = {x:s[0],y:s[0],z:s[0]}} catch {}
        return v.scale = {x:s[0],y:s[1],z:s[2]}
    }

    const a = m.split(",");
    if (a.length < 3) return p.scale = {x:a[0],y:a[0],z:a[0]}
    return p.scale = {x:a[0],y:a[1],z:a[2]}
});

Game.command('weather', (p, e) => {
    if (!isAdmin(p.userId)) return;
    try {
        return Game.setEnvironment({
            weather: e
        })
    } catch {}
});


Game.command("unban", (p, i) => {
    if (!isAdmin(p.userId)) return;
    if (!i || isNaN(i)) return;
    if (!BANNED.includes(Number(i))) return p.message(v1(`${i} is not in the ban list.`))
    p.message(v1(`You unbanned ${i}.`))
    return BANNED.splice(BANNED.indexOf(Number(i)), 1)
})

Game.command("unipban", (p, i) => {
    if (!isAdmin(p.userId)) return;
    if (!i) return;
    if (!BANNED_IPS.includes(i)) return p.message(v1(`${i} is not in the ban list.`))
    p.message(v1(`You unbanned ${i}.`))
    return BANNED_IPS.splice(BANNED_IPS.indexOf(i), 1)
})

Game.command("freeze", (p,m) => {
    if (!isAdmin(p.userId)) return;
    const v = getPlayer(m);
    if (!v) return;
    v.frozen = true
    v.headColor = '#0091ff',
    v.torsoColor = '#0091ff',
    v.leftArmColor = '#0091ff',
    v.rightArmColor = '#0091ff',
    v.leftLegColor = '#0091ff',
    v.rightLegColor = '#0091ff',
    v.speed = 0;
    v.jumpPower = 0;
    return v.centerPrint(v1(`You were frozen by ${p.username}.`),3)
})

Game.command("thaw", async (p,m) => {
    if (!isAdmin(p.userId)) return;
    const v = getPlayer(m);
    if (!v) return;
    if (!v.frozen) return;
    await v.setAvatar(v.userId);
    v.speed = 4
    v.jumpPower = 5
    return v.centerPrint(v1(`You were thawed by ${p.username}.`),3)
})

Game.command("av", async (p,m) => {
    if (!isAdmin(p.userId)) return;
    if (m === "reset") return await p.setAvatar(p.userId)
    if (isNaN(m)) return;
    return await p.setAvatar(m)
})

Game.command("tpme", (p,m) => {
    if (!isAdmin(p.userId)) return;
    const v = getPlayer(m);
    if (!v) return;
    return v.position = p.position
})

Game.command("server", (p,m) => {
    if (!isAdmin(p.userId)) return;
    return Game.messageAll(`[#ff0000][SERVER]: [#ffffff]${m}`)
})

Game.command("ambient", (p,m) => {
    if (!isAdmin(p.userId)) return;
    try {
        return Game.setEnvironment({ambient: m})
    } catch {}
})

Game.command("sky", (p,m) => {
    if (!isAdmin(p.userId)) return;
    try {
        return Game.setEnvironment({skyColor: m})
    } catch {}
})

Game.command("team", (p,m) => {
    if (!isAdmin(p.userId)) return;
    const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)];
    const team = new Team(m, randomColor);
    p.team = team;
    return Game.messageAll(v1(`${p.username} created [#ff0000]${m}[#ffffff].`))
})