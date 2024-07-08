import passport from "passport";
import { Strategy } from "passport-discord";
import { DiscordUser } from "../mongoose/schema/discord-user.mjs";

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const findUser = await DiscordUser.findById(id); //just passing id value without filter as above
        if (!findUser) throw new Error("User not found");
        done(null, findUser);
    }
    catch (error) {
        done(error, null);
    }
});

export default passport.use(
    new Strategy({
        clientID: "1259956298879864842",
        clientSecret: "OokPgFSugmKWgVU0czWCSsEpiIGBprYG",
        callbackURL: "http://localhost:3000/api/auth/discord/redirect",
        /* scope: ["identify", "guilds" ,"email"] */
        scope: ["identify"]
    }, async (accessToken, refreshToken, profile, done) => {
        console.log(`Discord profile recieved`);
        console.log(profile);
        let findUser;
        try {
            findUser = await DiscordUser.findOne({ discordId: profile.id });
        }
        catch (error) {
            return done(error, null);
        }

        try {
            if (!findUser) {
                const newUser = new DiscordUser({
                    username: profile.username,
                    discordId: profile.id,
                });

                const newSavedUser = await newUser.save();
                return done(null, newSavedUser);

            }
            return done(null, findUser);
        }
        catch (error) {
            console.log({ msg: error });
            return done(error, null);
        }

    })
);


/*  clientID: "1259956298879864842",
    clientSecret: "OokPgFSugmKWgVU0czWCSsEpiIGBprYG",
    callbackURL: "http://localhost:3000/api/auth/discord/redirect",
    scope: ["identify" ,"guild"] 
    //scopes provide access levels like userinfo and email etc.
    */