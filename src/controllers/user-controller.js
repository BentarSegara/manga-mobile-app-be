import prisma from "../config/database.js";
import { registerSchema } from "../validations/user-validation.js";

export const getUser = async (req, res) => {
  const { id } = req.params;
  const user = await prisma.user.findUnique({
    where: {
      id: parseInt(id),
    },
  });
  return res.status(200).json({
    status: "Ok",
    message: "Data berhasil diambil",
    data: user,
  });
};

export const createUser = async (req, res) => {
  const newUser = req.body;
  const { error } = registerSchema.validate(newUser, { abortEarly: false });

  if (error) {
    const errMessages = error.details.map((detail) => detail.message);
    return res.status(400).json({
      status: "fail",
      message: "gagal mendaftarkan user",
      errors: errMessages,
    });
  }

  const user = await prisma.user.create({
    data: {
      name: newUser.name,
      email: newUser.email,
      password: newUser.password,
    },
  });

  return res.status(201).json({
    status: "success",
    message: "berhasil mendaftarkan user",
    data: user,
  });
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const newUserData = req.body;

  const { error } = registerSchema.validate(newUserData, { abortEarly: false });

  if (error) {
    const errMessages = error.details.map((detail) => detail.message);
    return res.status(400).json({
      status: "fail",
      message: "gagal memperbarui data user",
      errors: errMessages,
    });
  }

  const updateuser = await prisma.user.update({
    where: {
      id: parseInt(id),
    },
    data: newUserData,
  });

  return res.status(204).json({
    status: "success",
    message: "berhasil memperbarui data user",
    data: updateuser,
  });
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  const deleteuser = await prisma.user.delete({
    where: {
      id: parseInt(id),
    },
  });

  res.status(200).json({
    status: "success",
    message: "berhasil menghapus data user",
  });
};
