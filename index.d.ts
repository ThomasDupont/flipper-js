import * as Express from "express"

export = Flipper

declare namespace Flipper {
    export class Flipper {
        static init (path?: string): void
        static list (): Promise<Record<string, boolean>>
        static isEnabled (feature: string): Promise<boolean>
        static enable (feature: string): Promise<void>
        static disable (feature: string): Promise<void>
    }
    
    export const FlipperRouter: Express.Router
    
    export class User {
        static addUser (login: string, password: string): Promise<void>
    }
}
