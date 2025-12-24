import Joi from "joi";

const nameRule = Joi.string().min(3).required().messages({
  "string.base": "Username harus berupa teks",
  "string.empty": "Username tidak boleh kosong",
  "string.min": "Username minimal harus memiliki karakter",
  "any.required": "Username wajib diisi",
});

const emailRule = Joi.string().email().required().messages({
  "string.email": "Format email tidak valid",
  "any.required": "Email wajib diisi",
});

const passwordRule = Joi.string().min(8).messages({
  "string.min": "Password harus memiliki minimal 8 karakter",
  "any.required": "Password tidak boleh kosong",
});

export const registerSchema = Joi.object({
  name: nameRule,
  email: emailRule,
  password: passwordRule,
});

export const loginSchema = Joi.object({
  email: emailRule,
  password: passwordRule,
});
