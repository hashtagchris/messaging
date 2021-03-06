const DocumentDBClient = require('documentdb').DocumentClient;

const config = {
    Host: process.env.DocDb_Host,
    AuthKey: process.env.DocDb_AuthKey,
};

module.exports = function (context, message) {

    let err = null;

    const docDbClient = new DocumentDBClient(config.Host, { masterKey: config.AuthKey });
    const query = 'SELECT * FROM c WHERE (c.twitter[\'$id\'] = \'' + message.userid + '\' AND \'twitter\' = \'' + message.platform + '\') OR (c.instagram[\'$id\'] = \'' + message.userid + '\' AND \'instagram\' = \'' + message.platform + '\') OR (c.facebook[\'$id\'] = \'' + message.userid + '\' AND \'facebook\' = \'' + message.platform + '\')';

    docDbClient.queryDocuments('dbs/user/colls/socials', query).toArray(function (err, results) {

        let userdata = results[0];

        if (!userdata || userdata == undefined) {
            context.log('Not tracking user');

            err = new Error('Not tracking user');
            return;
        }

        if ((!userdata.twitter || userdata.twitter == undefined)
            && (!userdata.facebook || userdata.facebook == undefined)
            && (!userdata.instagram || userdata.instagram == undefined)) {
            context.log('No social profiles');

            err = new Error('No social profiles');
            return;
        }

        if (!userdata.id) {
            context.log('No user id');

            err = new Error('No social profiles');
            return;
        }

        context.bindings.out = {
            requestid: guid(),
            user: userdata,
            request: message,
            triggeredOn: new Date()
        };

        context.done(err);
    });

    function guid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }
};