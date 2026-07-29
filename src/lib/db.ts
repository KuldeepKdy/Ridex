import mongoose from "mongoose";

const mongodbUrl = process.env.MONGODB_URL;

if (!mongodbUrl) {
  throw new Error("MONGODB_URL is not found");
}

// get the catched connection from global.mongooseConn object
let cached = global.mongooseConn;

// if cached means previous mongodb connection not found then we set the value of conn and promise to null in global.mongooseConn object
if (!cached) {
  cached = global.mongooseConn = { conn: null, promise: null };
}

const connectDB = async () => {
  // if cached.conn is not null then we return the cached connection
  if (cached.conn) {
    return cached.conn;
  }
  // if cached.promise is null then we set the promise to mongoose.connect(mongodbUrl) and return the promise
  if (!cached.promise) {
    cached.promise = mongoose.connect(mongodbUrl).then((c) => c.connection);
  }
  // if cached.promise is not null then we wait to resolve the connection and return the cached promise
  try {
    const conn = await cached.promise;
    return conn;
  } catch (error) {
    console.log(error);
  }
};

export default connectDB;
