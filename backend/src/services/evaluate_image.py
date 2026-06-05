import sys
import os
import json

os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'

try:
    import numpy as np
    import tensorflow as tf
    from tensorflow.keras.models import load_model
    from PIL import Image
except ImportError as e:
    print(json.dumps({
        "error": f"Bibliotecas Python necessárias não instaladas: {str(e)}. "
    }))
    sys.exit(1)

def predict(img_path, model_path):
    if not os.path.exists(model_path):
        return {"error": f"Arquivo do modelo não encontrado em: {model_path}"}
        
    if not os.path.exists(img_path):
        return {"error": f"Arquivo da imagem não encontrado em: {img_path}"}

    try:
        # Carrega o modelo .keras
        model = load_model(model_path)

        # Redimensiona a imagem conforme o esperado pelo modelo
        input_shape = model.input_shape
        target_height = input_shape[1] if input_shape[1] is not None else 224
        target_width = input_shape[2] if input_shape[2] is not None else 224

        # Carrega, converte para RGB e redimensiona a imagem
        img = Image.open(img_path).convert('RGB').resize((target_width, target_height))
        x = np.array(img, dtype=np.float32)
        x = np.expand_dims(x, axis=0)

        # Predição
        predictions = model.predict(x, verbose=0)
        
        # Retorna o array de predições
        return {
            "success": True,
            "predictions": predictions[0].tolist(),
            "class_index": int(np.argmax(predictions[0])),
            "confidence": float(np.max(predictions[0]))
        }
    except Exception as e:
        return {"error": f"Erro durante a predição: {str(e)}"}

if __name__ == '__main__':
    if len(sys.argv) < 3:
        print(json.dumps({"error": "Uso incorreto. Use: python evaluate_image.py <caminho_imagem> <caminho_modelo>"}))
        sys.exit(1)

    img_path_arg = sys.argv[1]
    model_path_arg = sys.argv[2]

    result = predict(img_path_arg, model_path_arg)
    print(json.dumps(result))
