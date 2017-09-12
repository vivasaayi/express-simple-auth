const google = {
    clientID: "751325053711-6dkpeb46ce16d4mbnp4173rlphomsgf9.apps.googleusercontent.com",
    clientSecret: "2NZT1JEQwlN1UHjpLEqWDY6X",
    callbackURL: "http://testicl.in:4001/auth/google/callback"
};

const facebook = {
    clientID: "797058693808696",
    clientSecret: "a55f2d9462a52b0efd05be72a23d771c",
    callbackURL: "http://testicl.in:4001/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'photos', 'email']
};

module.exports = {
    google,
    facebook
}