const fs = require('fs');
const tmi = require('tmi.js');
const { getEnabledCategories } = require('trace_events');
const sleep = (waitTimeInMs) => new Promise(resolve => setTimeout(resolve, waitTimeInMs));

function run_client() {

    const jsonConfig = fs.readFileSync('./config.json');
    const Config = JSON.parse(jsonConfig);
    const jsonListe = fs.readFileSync('./liste_runner.json');
    const Liste = JSON.parse(jsonListe);
    
    var client = new tmi.Client({
        identity: {
            username: Config.username,
            password: Config.oauth
        },
        channels: Liste.liste
    });
    
    client.connect();
    console.log(`Connecté dans ${Liste.liste.length} chaînes.`)
    
    client.on('message', (channel, tags, message, self) => {
    
        if(message.toLowerCase() == "!join") {

            if(channel.replace("#", "") != Config.username) return
    
            const jsonListe_Joueur = fs.readFileSync('./liste_runner.json');
            const Liste_Joueur = JSON.parse(jsonListe_Joueur);
    
            if(Liste_Joueur.liste.includes(tags.username)) return client.say(channel, `@${tags.username} tu es déjà un runner spé maths ! SeemsGood`);
    
            Liste_Joueur.liste.push(tags.username);
    
            fs.writeFile(`./liste_runner.json`, JSON.stringify(Liste_Joueur), async err => {
    
                if (err) {
    
                    client.say(channel, `@${tags.username} oops il y a eu une erreur TearGlove`);
                    console.log(err);
    
                } else {
    
                    client.say(channel, `@${tags.username} devient un runner spé maths ! FutureMan`);
                    client.disconnect();
                    await sleep(5)
                    run_client()
    
                }  
    
            })
    
        }
        if(message.toLowerCase() == "!leave") {
    
            if(channel.replace("#", "") != Config.username) return
    
            const jsonListe_Joueur = fs.readFileSync('./liste_runner.json');
            const Liste_Joueur = JSON.parse(jsonListe_Joueur);
    
            let existe = false
    
            for (let step = 0; step < Liste_Joueur.liste.length; step++) {
    
                if(Liste_Joueur.liste[step] == tags.username.replace("#", "")) existe = step
    
            }
    
            if(existe !== false) {
    
                Liste_Joueur.liste.splice(existe,1)
    
                fs.writeFile(`./liste_runner.json`, JSON.stringify(Liste_Joueur), async err => {
    
                    if (err) {
        
                        client.say(channel, `@${tags.username} oops il y a eu une erreur TearGlove`);
                        console.log(err);
        
                    } else {
        
                        client.say(channel, `@${tags.username} n'est plus un runner spé maths BibleThump`);
                        client.disconnect();
                        await sleep(5)
                        run_client()
        
                    }  
        
                })
    
            }
    
        }
        if(message.toLowerCase().startsWith("!calc")) {
    
            args = message.split(" ");
            argsInt = args
            
            if(args.length !== 3) return client.say(channel, `@${tags.username} mauvais format de commande : !calc <angle1> <angle2>`);
    
            args[1] = parseFloat(args[1]);
            args[2] = parseFloat(args[2]);
    
            if(args[1] == NaN) argsInt[1] = parseInt(args[1]);
            if(args[2] == NaN) argsInt[2] = parseInt(args[2]);
    
            if(isNaN(argsInt[1])) return client.say(channel, `@${tags.username} le premier angle n'est pas un nombre CaitlynS`);
            if(isNaN(argsInt[2])) return client.say(channel, `@${tags.username} le deuxième angle n'est pas un nombre CaitlynS`);
    
            if(argsInt[1] > argsInt[2]) {
    
                var distance_overworld = Math.round(1000/(argsInt[1]-argsInt[2]));
                var distance_nether = Math.round(distance_overworld/8);
    
                client.say(channel, `@${channel.replace("#", "")} Overworld: ${distance_overworld}, Nether: ${distance_nether} VoHiYo`);
    
            } else {
    
                var distance_overworld = Math.round(1000/(argsInt[2]-argsInt[1]));
                var distance_nether = Math.round(distance_overworld/8);
    
                client.say(channel, `@${channel.replace("#", "")} Overworld: ${distance_overworld}, Nether: ${distance_nether} VoHiYo`);
    
            }
        }
        if(message.toLowerCase().startsWith("!help")) {

            client.say(channel, `@${tags.username} Lancer une pearl regarder son angle (angle1) tourner de 90° par rapport à l'angle avancer de 4 sauts en sprintant, relancer une pearl et noter son angle (angle2). Puis faire la commande !calc <angle1> <angle2>. Cela vous renverra le nombre de blocs à parcourir.`);

        }
    
    });

}

run_client()