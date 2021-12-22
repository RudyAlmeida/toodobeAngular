const columns = {
  headers: ["user_id", "name", "registration_form_type", "edit", "delete"],
  titles: {
    user_id: "Id usuário",
    name: "Nome usuário",
    registration_form_type: "Tipo formulário",
    edit: "Editar",
    delete: "Deletar",
  },
};

const paths = new Map();
paths.set("/registration-form", "/registration-form/list");

export { columns, paths };
