import prisma from "../config/database.js";
import {
  loginSchema,
  registerSchema,
  updateSchema,
} from "../validations/user-validation.js";

import bcrypt from "bcrypt";

export const getUser = async ({ email, password }) => {
  const { error } = loginSchema.validate(
    { email: email, password: password },
    { abortEarly: false }
  );
  if (error) {
    const errorMessages = error.details.map((detail) => detail.message);
    throw new Error(errorMessages);
  }

  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (!user) {
    return null;
  }

  try {
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      const { id, password, ...userToSend } = user;
      return {
        valid: true,
        user: userToSend,
      };
    } else {
      return {
        valid: false,
        user: null,
      };
    }
  } catch (err) {
    throw new Error(err.message);
  }
};

export const postUser = async (userData) => {
  const { error } = registerSchema.validate(userData, { abortEarly: false });
  if (error) {
    const errorMessages = error.details.map((detail) => detail.context);

    throw new Error(errorMessages);
  }

  userData.password = await bcrypt.hash(userData.password, 10);
  console.log(userData);

  const user = await prisma.user.create({
    data: userData,
  });

  return user;
};

export const updateUser = async ({ id, newData }) => {
  const { error } = updateSchema.validate(newData, { abortEarly: false });

  if (error) {
    const errMessages = error.details.map((detail) => detail.message);
    throw new Error(errMessages);
  }

  await prisma.user.update({
    where: {
      id: parseInt(id),
    },
    data: newData,
  });
};

export const destroyUser = async (id) => {
  try {
    const deleteuser = await prisma.user.delete({
      where: {
        id: parseInt(id),
      },
    });
  } catch (err) {
    throw new Error(err.message);
  }
};
