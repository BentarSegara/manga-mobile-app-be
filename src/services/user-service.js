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
    const errors = {};
    error.details.map((detail) => {
      const label = detail.context.label;
      return (errors[label] = detail.message);
    });
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
    const errors = {};
    error.details.map((detail) => {
      const label = detail.context.label;
      return (errors[label] = detail.message);
    });
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
    const errors = {};
    error.details.map((detail) => {
      const label = detail.context.label;
      return (errors[label] = detail.message);
    });
    throw errors;
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
