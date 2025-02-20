import axios from "axios";
import Papa from "papaparse";

import { Product } from "./products";

export default {

    list: async (): Promise<Product[]> => {
        return axios
            .get("https://docs.google.com/spreadsheets/d/e/2PACX-1vRL66YJq850C5luiGRId3xN55F17Dzci1GNRAB6ZQe5aLT_H_jJPSQDDjTnNeviBHSmaQ3YTUFRxPZm/pub?output=csv",
            {
                responseType: "blob",
            },
        ).then((response) => {
            return new Promise((resolve, reject) => {
                Papa.parse(response.data, {
                    header: true,
                    skipEmptyLines: true,
                    complete: (results) => {
                        resolve(results.data as Product[]);
                    },
                    error: (error) => {
                        reject(error.message);
                    },
                });
            });
        });
    }

}