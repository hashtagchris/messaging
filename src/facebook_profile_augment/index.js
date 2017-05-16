var request = require('request-promise');

module.exports = function (context, message) {

    // connect to facebook graph
    let myPath = '/' + message.facebook.id + '?fields=email,first_name,last_name,birthday,locale,location,picture.width(500),about,education,friends,hometown,photos,relationship_status,religion,political,tagged_places,work';

    let options = {
        uri: "https://graph.facebook.com" + myPath,
        method: 'GET',
        headers: {
            'Authorization': 'OAuth ' + message.facebook.token
        }
    };

    request(options)
        .then((response) => {
            let data = message;
            message.facebook.profile = response;
            context.bindings.out = data;
        })
        .catch((error) => context.log(error))
        .finally(() => context.done());
}