import { Collection } from "discord.js";

declare module "discord.js" {
    export interface Client {
        commands: Collection<any, any>;
        configs: Collection<string, any>;
        sql: NeonQueryFunction<false, false>;
    }
}