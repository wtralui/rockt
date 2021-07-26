const venom = require('venom-bot');
const RocketChatApi = require('rocketchat-api');

var vazio = [];

venom
    .create()
    .then((client) => start(client))
    .catch((erro) => {
        console.log(erro);
    });

function start(client) {

    client.onMessage((message) => {
        console.log(message.body);
        console.log(message.from);
        // salve em um array o retorno JSON de 'message'
        var teste = message;
        teste.homeTown
        var nome = teste['sender']['pushname'];
        nome = nome.replace(" ", "");
        var id_user = teste['sender']['id'];
        var name = nome + "-" + id_user.replace("@c.us", "");
        // ~~ loga com o user API para verificar se o usuário com o numero X já contém cadastro
        const rocketChatClientinit = new RocketChatApi(
            'http',
            '10.50.0.144',       // dns/ip rocketchat
            3000,                // port rocketchat
            'api2',               // login rocketchat api 
            'api2',           
            (err, result) => {
                //Lista os usuários existentes no servidor
                rocketChatClientinit.users.list((err, body) => {
                    var usernames = [];
                    for (var z = 0; z < body['count']; z++) {
                        var datausers = body['users'][z]['username'];
                        usernames.push(datausers);
                        //Verifica se o número do usuário que está mandando mensagem já contém cadastro
                        if (name === usernames[z]) {
                            //Inicia a sessão com o nome+numero do usuário 
                            const rocketChatClient = new RocketChatApi(
                                'http',
                                '10.50.0.144',
                                3000,
                                name,
                                name,
                                (err, result) => {
                                    //Envia a mensagem recebida no WHATS para o ROCKET
                                    rocketChatClient.chat.postMessage({ roomId: '@wtralui', text: message.body });
                                    //A cada 0.50s verifica se o usuário enviou uma mensagem nova
                                    //Caso envie, adiciona o valor da msg em uma posição do array VAZIO e verifica se a mensagem ja foi enviada antes
                                    //^Evitando o envio de mensagem duplicada.
                                    setInterval(() => {
                                        rocketChatClient.im.history({ roomId: '@wtralui', count: 5, unreads: true }, (err, body) => {
                                            var msg = body['messages'][0]['msg'];
                                            var uid = body['messages'][0]['u']['username'];
                                            var usernameapi = result['me']['username'];
                                            if (msg !== null) {
                                                if (uid !== usernameapi) {
                                                    var ultimo = vazio[vazio.length - 1];
                                                    if (ultimo !== msg) {
                                                        vazio.push(msg);
                                                        client
                                                            .sendText(message.from, msg)         //(API)Envia a mensagem recebida no ROCKET para o WHATS
                                                    }                                           // Mensagem do técnico(ROCKET) => Enviada para o usuário(WHATS).
                                                }
                                            }
                                        });
                                    }, 50);
                                });
                            break;
                        } else { //Se o usuário não existe, executa
                            console.log("não existe!");
                        }
                        // fim da iteração com o array ~ verificação se o usuário existe
                        // se não existe => cria o usuário
                        if (z == body['count'] - 1) {

                            const userToAdd = {
                                "name": nome,
                                "email": id_user,
                                "password": name,
                                "username": name,
                                "sendWelcomeEmail": false,
                                "joinDefaultChannels": false,
                                "verified": false,
                                "requirePasswordChange": false,
                                "roles": ["admin"]
                            };
                            //Metódio que realizada a criação do usuário
                            rocketChatClientinit.users.create(userToAdd, (err, body) => { }); 
                        }

                    }
                });
            });
    });
}













/*
* L C D 
*/


