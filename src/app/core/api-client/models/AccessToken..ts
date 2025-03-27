export interface AccessToken {
    jti: string;
    nameIdentifier: string;
    email: string;
    mobilePhone: string;
    fullName: string;
    role: string;
    userData: string;
    exp: number;
    iss: string;
    aud: string;
    CategoryId: string;
  }