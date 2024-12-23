import mongoose from "mongoose";

const connect = async () => {
  try {
    console.log(`Trying To Connect To Mongo DB`);
    await mongoose.connect(process.env.MONGO_URI);
    console.log(
      `##################-DB Connected Successfully-##################`
    );
  } catch (error) {
    console.log(`Failed To Connect To Mongo DB ${error}`);
  }
};

export default connect;
