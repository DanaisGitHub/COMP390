export default interface StdReturn {// need a clear structure for my returns 
    err: any,
    result: any
}
export  // don't think it's used
    interface RTokenModel {
    token: string,
    expiryDate: Date
}
export
    interface UserModel {
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    refreshToken: string | null
    username?: string
}




