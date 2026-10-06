import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

import AuthLayout from "../../../app/layouts/AuthLayout";
import Input from "../../../shared/components/ui/forms/Input";
import Button from "../../../shared/components/ui/buttons/Button";

import { useLoginForm } from "../hooks/useLoginForm";
import { authService } from "../services/authService";

export default function LoginPage() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    email, setEmail,
    password, setPassword,
    isValid,
  } = useLoginForm();

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!isValid || isLoading) {
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const usuario =
        await authService.login({
          correo: email,
          contrasena: password,
        });

      console.log(
        "Usuario autenticado:",
        usuario
      );

      navigate("/roles");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError(
          "Ocurrió un error al iniciar sesión."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div
        className="
          w-full
          px-6
          py-6
        "
      >
        <h1
          className="
            mb-8
            text-center
            text-3xl
            font-bold
          "
        >
          Iniciar sesión
        </h1>

        {error && (
            <div
              className="
                rounded-xl
                border
                border-red-200
                bg-red-50
                px-4
                py-3
                text-sm
                text-red-600
              "
            >
              {error}
            </div>
          )}

        <form
          onSubmit={handleSubmit}
          className=" flex flex-col gap-6 "
        >
          <div>
            <p className="mb-2 font-medium">
              Correo electrónico
            </p>

            <Input
              type="email"
              placeholder="correo@dominio.com"
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
            />
          </div>

          <div>
            <p className="mb-2 font-medium">
              Contraseña
            </p>

            <Input
              type="password"
              placeholder="Ingrese su contraseña"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
            />
          </div>

          <Button
            type="submit" fullWidth size="lg" 
          >
            {isLoading
              ? "Ingresando..."
              : "Iniciar sesión"}
          </Button>
        </form>

        <p className=" mt-10 text-center ">
          ¿No tienes cuenta?{" "}
          <Link to="/register" className=" font-semibold text-blue-600 ">
            Registrarse
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}