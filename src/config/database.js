import mongoose from "mongoose";

export const startDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Se conectó correctamente a la base de datos de MongoDB");
  } catch (error) {
    console.error("Error al conectar a la base de datos", error);
  }
};
