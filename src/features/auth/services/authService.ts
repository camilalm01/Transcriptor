console.log(import.meta.env);
console.log("API_URL =", import.meta.env.VITE_API_URL);


const API_URL = import.meta.env.VITE_API_URL;



export interface LoginRequest {
  correo: string;
  contrasena: string;
}

export interface RegisterRequest {
  nombreCompleto: string;
  correo: string;
  contrasena: string;
}

export const authService = {
  async login( data: LoginRequest
  ) {
    const response = await fetch(
      `${API_URL}/api/usuarios/login`,
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      const message = await response.text();
      throw new Error(message);
    }
    return response.json();
  },

  async register(
    data: RegisterRequest
  ) {
    const response = await fetch(
      `${API_URL}/api/usuarios/registrar`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      const error = await response.text();

      throw new Error(error);
    }

    return response.json();
  },
};
