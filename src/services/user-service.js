import prisma from "../config/database.js";
import { mapError } from "../utils/map-error.js";
import {
  confirmEmailSchema,
  loginSchema,
  registerSchema,
  updatePassSchema,
  updateSchema,
} from "../validations/user-validation.js";

import bcrypt from "bcrypt";

export const getUser = async ({ email, password }) => {
  const { error } = loginSchema.validate(
    { email: email, password: password },
    { abortEarly: false }
  );
  if (error) {
    const errors = mapError(error);
    throw errors;
  }

  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (!user) {
    return null;
  }

  const match = await bcrypt.compare(password, user.password);
  if (match) {
    const { password, ...userToSend } = user;
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
};

export const postUser = async (userData) => {
  const { error } = registerSchema.validate(userData, { abortEarly: false });
  if (error) {
    const errors = mapError(error);
    throw errors;
  }

  userData.password = await bcrypt.hash(userData.password, 10);
  const user = await prisma.user.create({
    data: userData,
  });
  const { password, ...userToSend } = user;
  return userToSend;
};

export const updateUser = async ({ id, newData }) => {
  const { error } = updateSchema.validate(newData, { abortEarly: false });
  if (error) {
    const errors = mapError(error);
    throw errors;
  }

  await prisma.user.update({
    where: {
      id: parseInt(id),
    },
    data: newData,
  });
};

export const updateUserPassword = async ({ email, passwords }) => {
  const { error } = updatePassSchema.validate(passwords, { abortEarly: false });
  if (error) {
    const errors = mapError(error);
    throw errors;
  }

  passwords.password = await bcrypt.hash(passwords.password, 10);
  await prisma.user.update({
    where: {
      email: email,
    },
    data: {
      password: passwords.password,
    },
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

export const confirmEmail = async (email) => {
  const { error } = confirmEmailSchema.validate({ email: email });
  if (error) {
    const errors = mapError(error);
    throw errors;
  }
  return await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
};
