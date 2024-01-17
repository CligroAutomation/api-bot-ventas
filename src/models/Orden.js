import mongoose from "mongoose";

export const ESTADOS = [
  "pendiente",
  "listo_para_recoger",
  "enviado",
  "entregado",
  "cancelado",
  "rechazado",
  "en_espera_de_pago",
  "en_espera_de_inventario",
  "devuelto",
];

export const TIPOS = ["envio", "retiro"];

const ordenSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  observacion: {
    type: String,
    default: "Sin observaciones",
  },
  items: [
    {
      item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item",
        required: true,
      },
      cantidad: {
        type: Number,
        required: true,
      },
    },
  ],
  total: {
    type: Number,
    required: true,
  },
  estado: {
    type: String,
    enum: ESTADOS,
    default: "pendiente",
  },
  tipo: {
    type: String,
    enum: TIPOS,
    required: true,
  },
  direccion: {
    type: String,
    required: function () {
      return this.tipo === "envio";
    },
  },
  fechaEnvio: {
    type: Date,
  },
  fechaEntrega: {
    type: Date,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.model("Orden", ordenSchema);
