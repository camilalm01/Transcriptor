import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import AuthLayout from "../../../app/layouts/AuthLayout";

import Input from "../../../shared/components/ui/forms/Input";
import Button from "../../../shared/components/ui/buttons/Button";

import PasswordRules from "../components/PasswordRules";

import {
    validateName,
    validateEmail,
    passwordsMatch,
} from "../utils/authValidators";

import { useRegisterForm } from "../hooks/useRegisterForm";
import { authService } from "../services/authService";

export default function RegisterPage() {
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const {
        fullName, setFullName,
        email, setEmail,
        password,setPassword,
        confirmPassword, setConfirmPassword,
        passwordRules,
        isValid,
    } = useRegisterForm();

    const handleSubmit = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        if (!isValid || isLoading) {
            return;
        }

        setError("");
        setSuccess("");
        setIsLoading(true);

        try {
            await authService.register({
                nombreCompleto: fullName,
                correo: email,
                contrasena: password,
            });

            setSuccess(
                "Cuenta creada correctamente. Redirigiendo al inicio de sesión..."
            );

            setTimeout(() => {
                navigate("/");
            }, 2000);
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError(
                    "No fue posible registrar la cuenta."
                );
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout>
            <div
                className=" w-full px-6 ">
                <h1
                    className=" mb-6 text-center text-3xl font-bold">
                    Crear cuenta
                </h1>

                {error && (
                    <div
                        className=" mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 " >
                        {error}
                    </div>
                )}

                {success && (
                    <div
                        className=" mb-6 rounded-2xl borderborder-green-200 bg-green-50 px-4 py-3 text-sm text-green-600"
                    >
                        {success}
                    </div>
                )}

                <form
                    onSubmit={handleSubmit}
                    className=" flex flex-col gap-5">
                    <div>
                        <p className="mb-2 font-medium">
                            Nombre Completo
                        </p>

                        <Input
                            placeholder="Ingrese su nombre"
                            value={fullName}
                            onChange={(e) =>
                                setFullName(e.target.value)
                            }
                        />

                        {fullName &&
                            !validateName(fullName) && (
                                <p className="mt-2 text-sm text-red-500">
                                    Solo se permiten letras y espacios.
                                </p>
                            )}
                    </div>

                    <div>
                        <p className="mb-2 font-medium">
                            Correo Electrónico
                        </p>

                        <Input
                            type="email"
                            placeholder="correo@dominio.com"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                        />

                        {email &&
                            !validateEmail(email) && (
                                <p className="mt-2 text-sm text-red-500">
                                    Ingrese un correo válido.
                                </p>
                            )}
                    </div>

                    <div>
                        <p className="mb-2 font-medium">
                            Contraseña
                        </p>

                        <Input
                            type="password"
                            placeholder="Ingrese una contraseña"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                        />
                    </div>

                    {password.length > 0 &&
                        !(
                            passwordRules.minLength &&
                            passwordRules.uppercase &&
                            passwordRules.lowercase &&
                            passwordRules.number
                        ) && (
                            <PasswordRules
                                rules={passwordRules}
                            />
                        )}

                    <div>
                        <p className="mb-2 font-medium">
                            Confirmar Contraseña
                        </p>

                        <Input
                            type="password"
                            placeholder="Repita la contraseña"
                            value={confirmPassword}
                            onChange={(e) =>
                                setConfirmPassword(
                                    e.target.value
                                )
                            }
                        />

                        {confirmPassword &&
                            !passwordsMatch(
                                password,
                                confirmPassword
                            ) && (
                                <p className="mt-2 text-sm text-red-500">
                                    ✗ Las contraseñas no coinciden
                                </p>
                            )}
                    </div>

                    <Button
                        type="submit" fullWidth size="lg" disabled={
                            !isValid || isLoading
                        }
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center gap-2">
                                <span
                                    className=" h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent
"                                />

                                Registrando...
                            </span>
                        ) : (
                            "Registrarse"
                        )}
                    </Button>
                </form>

                <p className=" mt-8 text-center">
                    ¿Ya tienes cuenta?{" "}
                    <Link to="/" className=" font-semibold text-blue-600 ">
                        Iniciar sesión
                    </Link>
                </p>
            </div>
        </AuthLayout>
    );
}