import { z } from 'zod';
import { PASSWORD_REGEX } from './passwordRules';

export const loginSchema = z.object({
  email: z.string()
           .min(1, 'El correo es obligatorio')
           .email('Ingresa un correo válido'),
  password: z.string()
             .min(1, 'La contraseña es obligatoria')
             .min(8, 'Mínimo 8 caracteres')
});

export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  name: z.string()
    .min(1, 'El nombre es obligatorio')
          .min(2, 'Nombre demasiado corto'),
  email: z.string()
     .min(1, 'El correo es obligatorio')
           .email('Ingresa un correo válido'),
  password: z.string()
       .min(1, 'La contraseña es obligatoria')
             .min(8, 'Mínimo 8 caracteres')
       .regex(PASSWORD_REGEX.upper, 'Debes incluir al menos una mayúscula')
       .regex(PASSWORD_REGEX.lower, 'Debes incluir al menos una minúscula')
       .regex(PASSWORD_REGEX.number, 'Debes incluir al menos un número'),
  confirm: z.string()
      .min(1, 'Confirma tu contraseña')
}).refine((data) => data.password === data.confirm, {
  path: ['confirm'],
  message: 'Las contraseñas no coinciden'
});

export type RegisterInput = z.infer<typeof registerSchema>;

/** Convierte errores de Zod a un diccionario por campo */
export function zodToFieldErrors(err: z.ZodError) {
  const out: Record<string, string> = {};
  for (const e of err.issues) {
    const k = e.path[0]?.toString();
    if (k && !out[k]) out[k] = e.message;
  }
  return out;
}