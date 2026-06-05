import { app } from "../../index";
import { evaluateImageBase64 } from "../../services/imageEvaluationService";

app.post("/api/evaluate-image", async (req, res) => {
    try {
        const { image } = req.body;

        if (!image) {
            res.status(400).json({
                error: "O campo 'image' é obrigatório no corpo da requisição (formato base64 ou data URL)."
            });
            return;
        }

        const result = await evaluateImageBase64(image);

        console.log(JSON.stringify(result, null, 2))

        if (result.success) {
            res.json(result);
        } else {
            res.status(500).json({
                error: result.error || "Falha ao processar a imagem."
            });
        }
    } catch (error: any) {
        console.error("Erro na rota de avaliação de imagem:", error);
        res.status(500).json({
            error: `Erro interno no servidor: ${error.message}`
        });
    }
});
