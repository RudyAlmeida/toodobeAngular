const columns = {
  headers: ["user_id", "owner_name", "account_name", "edit", "delete"],
  titles: {
    user_id: "Id usuário",
    owner_name: "Nome usuário",
    account_name: "Nome conta",
    edit: "Editar",
    delete: "Deletar",
  },
};

const paths = new Map();
paths.set("/bank", "/bank/list");

export { columns, paths };
