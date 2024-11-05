from flask import Flask, request, jsonify
import my_local_ai_model  # 로컬 AI 모델이 구현된 모듈을 import하세요

app = Flask(__name__)

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    text = data.get("text", "")

    # 로컬 AI 모델에 텍스트 입력 후 예측 결과 반환
    prediction = my_local_ai_model.predict(text)  # 모델의 예측 함수
    return jsonify({"prediction": prediction})

if __name__ == "__main__":
    app.run(port=5000)
