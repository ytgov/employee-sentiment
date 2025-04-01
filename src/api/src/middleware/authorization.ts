import { NextFunction, Request, Response } from "express";
import { UserStatus } from "../data/models";

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.user.IS_ADMIN != "Y" || req.user.STATUS != UserStatus.ACTIVE)
    return res.status(403).send("You aren't an admin");
  next();
}

export function requireAdminOrOwner(req: Request, res: Response, next: NextFunction) {
  if ((req.user.IS_ADMIN == "N" && req.user.IS_OWNER == "N") || req.user.STATUS != UserStatus.ACTIVE)
    return res.status(403).send("You aren't an admin or owner");
  next();
}

export function requireActive(req: Request, res: Response, next: NextFunction) {
  if (req.user.STATUS != UserStatus.ACTIVE) return res.status(403).send("You aren't active");
  next();
}

export function requireRole(value: any) {
  //let role = value.role;
  return async (req: Request, res: Response, next: NextFunction) => {
    console.log("Checking user:", req.user, "for role", `'${value}'`);
    next();
  };
}
