import { Routes, Route } from 'react-router-dom';
import Layout from '@/layouts/Layout';
import { PaginaDashboard } from '@/pages/PaginaDashboard';
import PatientsPage from '@/pages/PatientsPage';
import PaginaDetallePaciente from '@/pages/PaginaDetallePaciente';
import PaginaNuevaCita from '@/pages/PaginaNuevaCita';
import PaginaNotFound from '@/pages/PaginaNotFound';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<PaginaDashboard />} />
        <Route path="/pacientes" element={<PatientsPage />} />
        <Route path="/pacientes/:id" element={<PaginaDetallePaciente />} />
        <Route path="/citas/nueva" element={<PaginaNuevaCita />} />
        <Route path="*" element={<PaginaNotFound />} />
      </Route>
    </Routes>
  );
}