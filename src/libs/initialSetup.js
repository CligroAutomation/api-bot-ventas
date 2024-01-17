import Role from "../models/Role.js";
import User from "../models/User.js";
import {
  ADMIN_NOMBRE,
  ADMIN_APELLIDO,
  ADMIN_TELEFONO,
  ADMIN_PASSWORD,
} from "../config.js";

export const createRoles = async () => {
  try {
    // Count Documents
    const count = await Role.estimatedDocumentCount();

    // check for existing roles
    if (count > 0) return;

    // Create default Roles
    const values = await Promise.all([
      new Role({ name: "user" }).save(),
      new Role({ name: "admin" }).save(),
      new Role({ name: "asesor" }).save(),
    ]);
  } catch (error) {
    console.error(error);
  }
};

export const createAdmin = async () => {
  // check for an existing admin user
  const userFound = await User.findOne({ telefono: ADMIN_TELEFONO });
  if (userFound) return;

  // get roles _id
  const roles = await Role.find({
    name: { $in: ["admin", "user", "asesor"] },
  });

  // create a new admin user
  const newUser = await User.create({
    nombre: ADMIN_NOMBRE,
    apellido: ADMIN_APELLIDO,
    telefono: ADMIN_TELEFONO,
    password: ADMIN_PASSWORD,
    roles: roles.map((role) => role._id),
  });
};

createRoles();
createAdmin();
