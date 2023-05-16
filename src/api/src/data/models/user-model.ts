export interface User {
  EMAIL: string;
  SUB: string;
  FIRST_NAME: string;
  LAST_NAME: string;
  STATUS: UserStatus;
  IS_ADMIN: boolean | string;
  YNET_ID: string;
  CREATE_DATE: Date;
  ROLE: string;

  display_name?: string;
}

export enum UserStatus {
  ACTIVE = "Active",
  INACTIVE = "Inactive",
}

export interface User_Create {
  EMAIL: string;
  SUB: string;
  FIRST_NAME: string;
  LAST_NAME: string;
  STATUS: UserStatus;
  CREATE_DATE: Date;
  IS_ADMIN: string;
  ROLE: string;
}

export interface User_Update {
  FIRST_NAME: string;
  LAST_NAME: string;
  STATUS: UserStatus;
  YNET_ID: string;
  ROLE: string;
  SUB?: string;
}

export interface UserRole {
  email: string;
  role: string;
}

export class UserHelper {
  fromDTO(dto: any): User {
    return {
      EMAIL: dto.EMAIL,
      SUB: dto.SUB,
      FIRST_NAME: dto.FIRST_NAME,
      LAST_NAME: dto.LAST_NAME,
      STATUS: dto.STATUS,
      IS_ADMIN: dto.IS_ADMIN,
      YNET_ID: dto.YNET_ID,
      CREATE_DATE: dto.CREATE_DATE,
      ROLE: dto.ROLE,
    };
  }
}
