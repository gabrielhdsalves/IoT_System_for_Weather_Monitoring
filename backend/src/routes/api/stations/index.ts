import { app } from "../../..";

app.get('/api/stations', (req, res) => {
    res.json([
        {
            key: "itajuba_unifei",
            name: "Itajubá",
            station: "Open Mateo",
            country: "Brasil",
        },
        {
            key: "itajuba_iitajub5",
            name: "Itajubá",
            station: "PWS IITAJUB5",
            country: "Brasil",
        },
        {
            key: "itajuba_iitaju16",
            name: "Itajubá",
            station: "PWS IITAJU16",
            country: "Brasil",
        },
        {
            key: "itajuba_iitaju21",
            name: "Itajubá",
            station: "PWS IITAJU21",
            country: "Brasil",
        },
        {
            key: "itajuba_caseira",
            name: "Itajubá",
            station: "Estação Caseira (Planilha)",
            country: "Brasil",
        }
    ]);
});
