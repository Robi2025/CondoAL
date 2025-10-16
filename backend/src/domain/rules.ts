export function validaQuorum({ unidadesTotales, presentes, materia }) {
  const req = materia === 'extraordinaria' ? 0.66 : 0.5;
  return { requerido: req, alcanza: (presentes / unidadesTotales) >= req };
}
export const permisos = {
  admin: ['import:payments', 'save:payments', 'gen:letters', 'view:all'],
  conserje: ['import:payments', 'view:all'],
  tesoreria: ['save:payments', 'gen:letters', 'view:all'],
  vecino: ['view:self']
}
