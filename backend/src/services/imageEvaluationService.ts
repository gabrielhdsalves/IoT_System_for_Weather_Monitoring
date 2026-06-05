import { spawn } from "child_process";
import path from "path";
import fs from "fs";

const MODEL_PATH = path.join(__dirname, "../assets/cloud_type_xception.keras");
const TEMP_DIR = path.join(__dirname, "../assets/temp");

// Garante que os diretórios necessários existem
if (!fs.existsSync(path.dirname(MODEL_PATH))) {
    fs.mkdirSync(path.dirname(MODEL_PATH), { recursive: true });
}
if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR, { recursive: true });
}

export interface PredictionResult {
    success: boolean;
    predictions?: number[];
    class_index?: number;
    confidence?: number;
    error?: string;
}

/**
 * Determina o melhor executável do Python para utilizar.
 */
function getPythonExecutable(): string {
    return process.env.PYTHON_PATH || "python";
}

/**
 * Executa o script Python para avaliar uma imagem utilizando o modelo .keras.
 * @param imagePath Caminho local absoluto ou relativo do arquivo de imagem
 */
export function evaluateImageFile(imagePath: string): Promise<PredictionResult> {
    return new Promise((resolve, reject) => {
        const scriptPath = path.join(__dirname, "evaluate_image.py");
        const absoluteImagePath = path.resolve(imagePath);
        const absoluteModelPath = path.resolve(MODEL_PATH);

        const pythonExe = getPythonExecutable();
        // Chama o interpretador python enviando os caminhos da imagem e do modelo
        const pythonProcess = spawn(pythonExe, [scriptPath, absoluteImagePath, absoluteModelPath]);

        let outputData = "";
        let errorData = "";

        pythonProcess.stdout.on("data", (data) => {
            outputData += data.toString();
            console.log(JSON.stringify(outputData, null, 2))
        });

        pythonProcess.stderr.on("data", (data) => {
            errorData += data.toString();
        });

        pythonProcess.on("close", (code) => {
            if (code !== 0) {
                return resolve({
                    success: false,
                    error: `Processo Python encerrou com código ${code}. Erro: ${errorData || "Nenhuma mensagem de erro"}`
                });
            }

            try {
                // Tenta fazer o parse do JSON impresso pelo script Python
                const result = JSON.parse(outputData.trim());
                resolve(result);
            } catch (err: any) {
                resolve({
                    success: false,
                    error: `Falha ao interpretar a saída do Python. Saída: ${outputData}. Erro: ${err.message}`
                });
            }
        });
    });
}

/**
 * Processa uma imagem codificada em base64, salva temporariamente e executa a predição.
 * @param base64Image String base64 (pode conter o prefixo data:image/...)
 */
export async function evaluateImageBase64(base64Image: string): Promise<PredictionResult> {
    // Remove o cabeçalho data:image/png;base64, se existir
    const matches = base64Image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    let dataBuffer: Buffer;
    let extension = "png"; // extensão padrão

    if (matches && matches.length === 3) {
        extension = matches[1].split("/")[1];
        dataBuffer = Buffer.from(matches[2], "base64");
    } else {
        dataBuffer = Buffer.from(base64Image, "base64");
    }

    // Cria um arquivo temporário único
    const tempFileName = `temp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${extension}`;
    const tempFilePath = path.join(TEMP_DIR, tempFileName);

    try {
        // Grava o buffer no arquivo temporário
        fs.writeFileSync(tempFilePath, dataBuffer);

        // Roda a predição
        const result = await evaluateImageFile(tempFilePath);
        
        return result;
    } finally {
        // Sempre limpa o arquivo temporário
        try {
            if (fs.existsSync(tempFilePath)) {
                fs.unlinkSync(tempFilePath);
            }
        } catch (unlinkErr) {
            console.error("Erro ao deletar arquivo temporário de imagem:", unlinkErr);
        }
    }
}
