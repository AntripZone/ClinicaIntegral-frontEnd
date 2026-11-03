import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export type Tema = "claro" | "oscuro";

interface TemaState {
  tema: Tema;
  alternarTema: () => void;
}

const temaDelSistema = (): Tema =>
  window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "oscuro"
    : "claro";

export const useTemaStore = create<TemaState>()(
  devtools(
    persist(
      (set) => ({
        tema: temaDelSistema(),
        alternarTema: () =>
          set(
            (s) => ({ tema: s.tema === "oscuro" ? "claro" : "oscuro" }),
            false,
            "tema/alternar",
          ),
      }),
      { name: "tema-storage" },
    ),
    { name: "TemaStore" },
  ),
);

function aplicarTema(tema: Tema) {
  document.documentElement.classList.toggle("dark", tema === "oscuro");
}

aplicarTema(useTemaStore.getState().tema);
useTemaStore.subscribe((s) => aplicarTema(s.tema));
