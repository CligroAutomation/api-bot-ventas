import mongoose from "mongoose";
export const ESTADOS = ["Pendiente", "Aprobado", "Rechazado"];

const ReservaSchema = new mongoose.Schema({
  bloque: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Bloque",
    required: true,
  },
  items: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      required: true,
    },
  ],
  total: {
    type: Number,
    required: true,
  },
  observacion: {
    type: String,
    default: "Sin observaciones",
  },
  estado: {
    type: String,
    enum: ESTADOS,
    default: "Pendiente",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.model("Reserva", ReservaSchema);
