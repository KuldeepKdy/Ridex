import { Connection } from "mongoose";


// global declaration for mongoose connection type
declare global {
   var mongooseConn:{
        conn: Connection | null ,
        promise: Promise<Connection> | null
     }

}

export {};