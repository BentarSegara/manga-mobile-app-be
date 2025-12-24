import {
  destroyUser,
  getUser,
  postUser,
  updateUser,
} from "../services/user-service.js";

export const register = async (req, res) => {
  const newUser = req.body;
  try {
    const user = await postUser(newUser);
    return res.status(201).json({
      status: "Success",
      message: "Berhasil mendaftarkan user",
      data: user,
    });
  } catch (err) {
    return res.status(400).json({
      status: "Fail",
      message: "Gagal mendaftarkan user",
      errors: err.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const user = await getUser(req.body);

    if (user) {
      if (user.valid) {
        return res.status(200).json({
          status: "Success",
          message: "Berhasil login",
          data: user,
        });
      } else {
        return res.status(401).json({
          status: "Fail",
          message: `Gagal login`,
          error: "Password salah",
        });
      }
    } else {
      return res.status(404).json({
        status: "Fail",
        message: `Gagal login user`,
        errors: "User tidak ditemukan",
      });
    }
  } catch (err) {
    return res.status(400).json({
      status: "Fail",
      message: `Gagal login user`,
      errors: err.message,
    });
  }
};

export const editUser = async (req, res) => {
  const { id } = req.params;
  const newUserData = req.body;

  try {
    const updateuser = await updateUser({ id: id, newData: newUserData });
    return res.status(204).json({
      status: "Success",
      message: "Berhasil memperbarui data user",
      data: updateuser,
    });
  } catch (err) {
    return res.status(400).json({
      status: "Fail",
      message: "Gagal memperbarui data user",
      errors: err.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const deleteuser = await destroyUser(id);
    res.status(200).json({
      status: "Success",
      message: "Berhasil menghapus user",
    });
  } catch (err) {
    res.status(400).json({
      error: "Fail",
      message: "Gagal ",
    });
  }
};
