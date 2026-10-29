import { Routes, Route } from 'react-router-dom';
import Layout from '@/layouts/Layout';
import { PaginaDashboard } from '@/pages/PaginaDashboard';
import PatientsPage from '@/pages/PatientsPage';
import PaginaDetallePaciente from '@/pages/PaginaDetallePaciente';
import PaginaNuevaCita from '@/pages/PaginaNuevaCita';
import PaginaNotFound from '@/pages/PaginaNotFound';
import CitasPage from '@/pages/CitasPage';
import PaginaReportes from '@/pages/PaginaReportes';
import PaginaLogin from '@/pages/PaginaLogin';
import PaginaSinAcceso from '@/pages/PaginaSinAcceso';
import RutaProtegida from '@/components/RutaProtegida';
import PaginaPerfil from '@/pages/PaginaPerfil';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<PaginaLogin />} />

      <Route element={<RutaProtegida />}>
      <Route element={<Layout />}>
        <Route path="/" element={<PaginaDashboard />} />
        <Route path="/pacientes" element={<PatientsPage />} />
        <Route path="/citas" element={<CitasPage />} />
        <Route path="/pacientes/:id" element={<PaginaDetallePaciente />} />
        <Route path="/citas/nueva" element={<PaginaNuevaCita />} />
        <Route path="/sin-acceso" element={<PaginaSinAcceso />} />
        <Route path="/perfil" element={<PaginaPerfil />} />

        <Route element={<RutaProtegida rolesPermitidos={['GERENCIA']} />}>
           <Route path="/reportes" element={<PaginaReportes />} />
        </Route>

        <Route path="*" element={<PaginaNotFound />} />
      </Route>
      </Route>
    </Routes>
  );
}