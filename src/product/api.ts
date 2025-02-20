import axios from "axios";
import Papa from "papaparse";
import { Product } from "./products";

const api = {
    list: async (): Promise<Product[]> => {
        try {
            const response = await axios.get<Blob>(
                "https://docs.google.com/spreadsheets/d/e/2PACX-1vRL66YJq850C5luiGRId3xN55F17Dzci1GNRAB6ZQe5aLT_H_jJPSQDDjTnNeviBHSmaQ3YTUFRxPZm/pub?output=csv",
                { responseType: "blob" }
            );

            const text = await response.data.text(); // Convertir Blob a string

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
