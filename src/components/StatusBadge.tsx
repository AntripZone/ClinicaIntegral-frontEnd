interface StatusBadgeProps {
  activo: boolean;
}

const estilosPorEstado = {
  activo: {
    texto: 'Sistema Operativo',
    clases: 'bg-emerald-100 text-emerald-700',
  },
  inactivo: {
    texto: 'Modo Mantenimiento',
    clases: 'bg-rose-100 text-rose-700',
  },
};

export function StatusBadge({ activo }: StatusBadgeProps) {
  const estado = estilosPorEstado[activo ? 'activo' : 'inactivo'];

  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${estado.clases}`}>
      {estado.texto}
    </span>
  );
}