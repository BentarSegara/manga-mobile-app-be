import Joi from "joi";

const nameRule = Joi.string().min(3).messages({
  "string.base": "Username harus berupa teks",
  "string.empty": "Username tidak boleh kosong",
  "string.min": "Username minimal harus memiliki 3 karakter",
  "any.required": "Username wajib diisi",
});

const emailRule = Joi.string().email().messages({
  "string.email": "Format email tidak valid",
  "string.empty": "Email tidak boleh kosong",
  "any.required": "Email wajib diisi",
});

const passwordRule = Joi.string().min(8).messages({
  "string.min": "Password harus memiliki minimal 8 karakter",
  "string.empty": "Password tidak boleh kosong",
  "any.required": "Password wajib diisi",
});

export const registerSchema = Joi.object({
  name: nameRule.required(),
  email: emailRule.required(),
  password: passwordRule.required(),
});

export const loginSchema = Joi.object({
  email: emailRule.required(),
  password: passwordRule.required(),
});

export const updateSchema = Joi.object({
  name: nameRule,
  email: emailRule,
})
  .min(1)
  .messages({
    "object.min":
      "Anda harus mengirimkan setidaknya satu data untuk di-update (nama, email, atau password)",
  });

export const updatePassSchema = Joi.object({
  password: passwordRule.required(),
  confirmedPassword: Joi.string()
    .valid(Joi.ref("password"))
    .required()
    .messages({
      "string.empty": "Password tidak boleh kosong",
      "any.only": "Password konfirmasi tidak cocok",
    }),
});

export const confirmEmailSchema = Joi.object({
  email: emailRule.required(),
});
