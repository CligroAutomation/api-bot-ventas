import mongoose from "mongoose";

const BloqueSchema = new mongoose.Schema({
  fecha: {
    type: String,
    required: true,
  },
  start: {
    type: String,
    required: true,
  },
  end: {
    type: String,
    required: true,
  },
  estado: {
    type: String,
    enum: ["libre", "ocupado"],
    default: "libre",
  },
  reserva: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Reserva",
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.model("Bloque", BloqueSchema);
