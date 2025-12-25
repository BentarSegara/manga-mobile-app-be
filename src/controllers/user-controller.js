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
      errors: err,
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
          data: user.user,
        });
      } else {
        return res.status(401).json({
          status: "Fail",
          message: `Gagal login`,
          errors: {
            password: "Password salah",
          },
        });
      }
    } else {
      return res.status(404).json({
        status: "Fail",
        message: `Gagal login user`,
        errors: {
          name: "email tidak ditemukan dalam daftar user",
        },
      });
    }
  } catch (err) {
    return res.status(400).json({
      status: "Fail",
      message: `Gagal login user`,
      errors: err,
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
      errors: err,
    });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const deleteuser = await destroyUser(id);
    res.status(200).json({
      status: "Success",
      message: "Berhasil menghapus data user",
    });
  } catch (err) {
    res.status(400).json({
      status: "Fail",
      message: "Gagal menghapus data user",
    });
  }
};
