import axios from "axios";
import Papa from "papaparse";
import { Product } from "./products";

const api = {
    list: async (): Promise<Product[]> => {
        try {
            const response = await axios.get(
                "https://docs.google.com/spreadsheets/d/e/2PACX-1vRL66YJq850C5luiGRId3xN55F17Dzci1GNRAB6ZQe5aLT_H_jJPSQDDjTnNeviBHSmaQ3YTUFRxPZm/pub?output=csv",
                { responseType: typeof window === "undefined" ? "text" : "blob" }
            );

            const getText = async () => {
                if (typeof window === "undefined") {
                  return response.data as string; //Entorno servidor: devuelve la response.data como string
                } else {
                  return await (response.data as Blob).text(); //Entorno cliente: convierte el fokin blob a string
                }
              };

              const text = await getText();
            return new Promise((resolve, reject) => {
                Papa.parse(text, {
                    header: true,
                    skipEmptyLines: true,
                    complete: (results) => { resolve(results.data as Product[]); },
                    error: (error: Error) => { reject(error.message); },
                });
            });

        } catch (error) {
            console.error("Error fetching or parsing CSV:", error);
            return [];
        }
    },
};

export default api;
