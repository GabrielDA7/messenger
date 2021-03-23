export interface JwtPayload {
    sub: number
    email: string
    iat: Date
    exp: Date
}
