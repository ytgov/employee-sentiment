import { NextFunction, Request, Response } from "express";
import jwt from "express-jwt";
import axios from "axios";
import jwksRsa from "jwks-rsa";
import { AUTH0_DOMAIN, AUTH0_AUDIENCE } from "../config";
import { UserService } from "../services";
import { UserStatus } from "../data/models";

export const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `${AUTH0_DOMAIN}.well-known/jwks.json`,
  }),

  audience: AUTH0_AUDIENCE,
  issuer: AUTH0_DOMAIN,
  algorithms: ["RS256"],
});

export async function loadUser(req: Request, res: Response, next: NextFunction) {
  const db = new UserService();

  let sub = req.user.sub;
  const token = req.headers.authorization || "";
  let u = await db.getBySub(sub);

  if (u) {
    req.user = { ...req.user, ...u };
    return next();
  }

  await axios
    .get(`${AUTH0_DOMAIN}userinfo`, { headers: { authorization: token } })
    .then(async (resp) => {
      if (resp.data && resp.data.sub) {
        let email = resp.data.email;
        let first_name = resp.data.given_name;
        let last_name = resp.data.family_name;
        sub = resp.data.sub;

        let u = await db.getBySub(sub);

        if (u) {
          req.user = { ...req.user, ...u };
        } else {
          if (!email) email = `${first_name}.${last_name}@yukon-no-email.ca`;

          let e = await db.getByEmail(email);

          if (e && e.USER_ID == "SUB_MISSING") {
            req.user = { ...req.user, ...e };

            await db.update(req.user.email, {
              USER_ID: sub,
              FIRST_NAME: e.FIRST_NAME,
              LAST_NAME: e.LAST_NAME,
              ROLE: e.ROLE,
              STATUS: e.STATUS,
              YNET_ID: e.YNET_ID,
            });

            return next();
          }

          u = await db.create({
            EMAIL: email.toLowerCase(),
            USER_ID: sub,
            STATUS: UserStatus.INACTIVE,
            FIRST_NAME: first_name,
            LAST_NAME: last_name,
            CREATE_DATE: new Date(),
            IS_ADMIN: "N",
            ROLE: "",
          });
          req.user = { ...req.user, ...u };
        }
      } else {
        console.log("Payload from Auth0 is strange or failed for", req.user);
      }

      next();
    })
    .catch((err) => {
      console.log("ERROR pulling userinfo", err);
    });
}
