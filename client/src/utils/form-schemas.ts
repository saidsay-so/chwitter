import * as y from "yup";
import { t } from "@lingui/macro";

export const usernameSchema = y
  .string()
  .max(32, {
    message: t`Le nom d'utilisateur est trop long, 32 caractères maximum`,
  })
  .matches(/^[a-z_0-9]+$/, {
    message: t`Le nom d'utilisateur ne peut contenir que des lettres minuscules, des chiffres et des tirets bas`,
  });

export const displayNameSchema = y
  .string()
  .max(16, t`Le pseudo est trop long, 16 caractères maximum`)
  .matches(
    /^[^@]+$/,
    t`Le pseudo ne peut pas être vide ou contenir d'arobase (@)`
  );

export const descriptionSchema = y
  .string()
  .max(64, t`La description est trop longue, 64 caractères maximum`);
