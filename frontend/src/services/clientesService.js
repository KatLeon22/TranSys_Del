import "../Styles/clientes.css";


const clientesDummy = [
  { id: 1, nombre: "Juan", apellido: "Perez", telefono: "123456789", email: "juan@mail.com", direccion: "Calle 123" },
  { id: 2, nombre: "Maria", apellido: "Gomez", telefono: "987654321", email: "maria@mail.com", direccion: "Avenida 456" },
];

export default {
  getAll: async () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(clientesDummy), 500);
    });
  },
};
