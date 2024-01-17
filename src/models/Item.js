import mongoose from "mongoose";

export const TIPOS = ["producto", "servicio"];

const itemSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
    },
    descripcion: {
      type: String,
      default: "",
    },
    imagen: [
      {
        public_id: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
      },
    ],
    categoria: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Categoria",
      required: true,
    },
    tipo: {
      type: String,
      enum: TIPOS,
      required: true,
    },
    precio: {
      type: Number,
      required: true,
      min: 0,
    },
    calificacion: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    numCalificaciones: {
      type: Number,
      default: 0,
    },
    opiniones: [
      {
        nombre: {
          type: String,
          required: true,
        },
        calificacion: {
          type: Number,
          required: true,
          min: 0,
          max: 5,
        },
        comentario: {
          type: String,
          required: true,
        },
      },
    ],
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    isActivo: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.model("Item", itemSchema);
