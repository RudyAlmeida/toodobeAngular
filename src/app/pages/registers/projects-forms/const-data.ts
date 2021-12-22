const columns = {
  headers: [
    "user_name",
    "project_desciption",
    "project_value",
    "edit",
    "delete",
  ],
  titles: {
    user_name: "Usuário",
    project_desciption: "Descrição",
    project_value: "Valor do imóvel",
    edit: "Editar",
    delete: "Deletar",
  },
};

const paths = new Map();
paths.set("/projects", "/projects/list");

export { columns, paths };
