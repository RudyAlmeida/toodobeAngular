const formTypes = [
  { text: "Principal", value: "principal" },
  { text: "Conjuge", value: "conjuge" },
];

const addressTypes = [
  { text: "Própia", value: "propria" },
  { text: "De Familiares", value: "familiares" },
  { text: "Alugada", value: "alugada" },
];

const maritalStatus = [
  { text: "Solteiro(a)", value: "solteiro(a)" },
  {
    text: "Casado(a) com. universal de bens",
    value: "casado(a) com. universal de bens",
  },
  {
    text: "Casado(a) com. parcial de bens",
    value: "casado(a) com. parcial de bens",
  },
  {
    text: "Casado(a) com. separção de bens",
    value: "casado(a) com. separcao de bens",
  },
  { text: "União estável", value: "uniao estavel" },
  { text: "Separado judicialmente", value: "separado judicialmente" },
  { text: "Divorciado(a)", value: "divorciado(a)" },
  { text: "Viúvo(a)", value: "viuvo(a)" },
  { text: "Outro", value: "outro" },
];

const vehicleType = [
  { text: "Moto", value: "moto" },
  { text: "Carro", value: "carro" },
  { text: "Caminhão", value: "caminhao" },
  { text: "Outro", value: "outro" },
];

const educationLevel = [
  { text: "Sem instrução", value: "sem instrução" },
  { text: "Ensino fundamental", value: "ensino fundamental" },
  { text: "Ensino médio", value: "ensino medio" },
  { text: "Ensino superior", value: "ensino superior" },
  { text: "Pós graduação", value: "pos graduacao" },
  { text: "Mestrado", value: "mestrado" },
  { text: "Doutorado", value: "doutorado" },
  { text: "Mba", value: "mba" },
];

export { addressTypes, formTypes, maritalStatus, educationLevel, vehicleType };
