const BaseRepository = require("./base-repository");
const logger = require("../utils/logger");

const queries = {
  USERS_GET_ACTIVE_BY_EMAIL: `SELECT * FROM users WHERE email=$1 AND "accountActivated"=$2`,
  USERS_GET_BY_EMAIL: "SELECT * FROM users WHERE email=$1",
  USERS_GET_BY_ID: "SELECT * FROM users WHERE _id=$1",
  USERS_INSERT_USERS: `INSERT INTO users (_id, "displayName", "firstName", "lastName", email, password, active, "accountActivated") VALUES (uuid_generate_v4(), $1, $2, $3, $4, $5, $6, $7)`,
  USERS_ACTIVATE: `UPDATE users SET "accountActivated"=true WHERE email=$1`,
  ACTIVATION_LINKS_INSERT: "INSERT INTO activation_links(_id, email) VALUES ($1, $2)",
  ACTIVATION_LINKS_EXPIRE_LINKS: "UPDATE activation_links SET expired = true WHERE email=$1",
  ACTIVATION_LINKS_GET_BY_EMAIL: "SELECT * FROM activation_links WHERE email=$1",
  USERS_RATINGS_SUMMARY: `select "type", status, "redeemSuccess", count(*) from users u
      inner join codes c on c."postedBy"=u._id
      left join transactions t on c._id=t."dealId"
    where u."_id"=$1 AND status='CLAIMED'
    group by "type", status, "redeemSuccess"`,
  USERS_POSTS_SUMMARY: `select "type", status, count(*) from users u
      inner join codes c on c."postedBy"=u._id
    where u."_id"=$1 AND status='ACTIVE'
    group by "type", status`
};

class UsersRepository extends BaseRepository {
  getUsersByEmailOrName(email, displayName, onlyActive) {
    let query = queries.USERS_GET_BY_EMAIL;

    if (onlyActive) {
      query = queries.USERS_GET_ACTIVE_BY_EMAIL;
    }

    logger.log("UsersRepository:getUsersByEmailOrName:", query);

    return this.executeQuery(query, [email, onlyActive])
      .then((results) => {
        logger.log("UsersRepository:getUsersByEmailOrName:", results);
        return results;
      });
  }

  getProfileSummary(userId) {
    logger.log("UsersRepository:getProfileSummary:", userId);

    const summary = {};

    return this.executeQuery(queries.USERS_RATINGS_SUMMARY, [userId])
      .then((results) => {
        logger.log("UsersRepository:getProfileSummary:", results);

        summary.ratings = results;

        return this.executeQuery(queries.USERS_POSTS_SUMMARY, [userId]);
      })
      .then((results) => {
        summary.posts = results;

        return summary;
      });
  }

  getUserById(userId) {
    logger.log("UsersRepository:getUserById:", userId);

    return this.executeQuery(queries.USERS_GET_BY_ID, [userId])
      .then((results) => {
        logger.log("UsersRepository:getUserById:", results);

        const user = results[0];

        return user;
      });
  }

  createUser(user) {
    const params = [
      user.displayName,
      user.firstName,
      user.lastName,
      user.email,
      user.password,
      true,
      false
    ];

    return this.executeQuery(queries.USERS_INSERT_USERS, params)
      .then((results) => {
        logger.log("UsersRepository:createUser:", results);
        return user;
      });
  }

  activateUser(email) {
    return this.executeQuery(queries.USERS_ACTIVATE, [email])
      .then((results) => {
        logger.log("UsersRepository:activateUser:", results);
        return results;
      });
  }

  getActivationLinksForUser(activationId) {
    return this.executeQuery(queries.ACTIVATION_LINKS_GET_BY_EMAIL, [activationId])
      .then((results) => {
        console.log("UsersRepository:getActivationLinksForUser:", results);
        return results;
      });
  }

  expireActivationLinks(email) {
    return this.executeQuery(queries.ACTIVATION_LINKS_EXPIRE_LINKS, [email])
      .then((results) => {
        logger.log("UsersRepository:expireActivationLinks:", results);
      });
  }

  saveActivationId(activationLink) {
    const params = [
      activationLink.activationId,
      activationLink.email
    ];

    return this.executeQuery(queries.ACTIVATION_LINKS_INSERT, params)
      .then((results) => {
        console.log("UsersRepository:saveActivationId:", results);
      });
  }

  deleteUser(email) { // TODO:PGM
    logger.log("Deleting User account");
    return this.getUsersByEmailOrName(email)
      .then((users) => {
        logger.log(users);

        if (users && users.length > 0) {
          return this.delete("users", users[0]);
        }

        return Promise.reject("User Not Found");
      });
  }
}

module.exports = new UsersRepository();
