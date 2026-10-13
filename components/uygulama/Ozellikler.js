"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const OzellikContext = createContext({ modlarAktif: false, hazir: false });

function modlarBayragi(data) {
  const kayit = Array.isArray(data) ? data[0] : data;
  if (!kayit || typeof kayit !== "object") return false;
  return kayit.modlar_aktif === true || kayit.modlar_aktif === 1;
}

export function modBildirimiMi(tip) {
  return tip === "mod_ek_hak" || tip === "mod_bakiye";
}

export function OzellikSaglayici({ children }) {
  const [modlarAktif, setModlarAktif] = useState(false);
  const [hazir, setHazir] = useState(false);

  const yukle = useCallback(async () => {
    try {
      const { data, error } = await createClient().rpc("uygulama_ozellikleri");
      if (error) throw error;
      setModlarAktif(modlarBayragi(data));
    } catch (error) {
      setModlarAktif(false);
    } finally {
      setHazir(true);
    }
  }, []);

  useEffect(() => {
    yukle();
  }, [yukle]);

  return <OzellikContext.Provider value={{ modlarAktif, hazir }}>{children}</OzellikContext.Provider>;
}

export function useOzellikler() {
  return useContext(OzellikContext);
}
