from flask import Flask, request, jsonify
import fitz  # PyMuPDF
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langchain_together import TogetherEmbeddings, Together
from langchain.chains import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import PromptTemplate
import os
from dotenv import load_dotenv
load_dotenv()

app = Flask(__name__)

# Load Together AI API key from environment variable
TOGETHER_API_KEY = os.getenv("TOGETHER_AI_API_KEY")

if not TOGETHER_API_KEY:
    raise Exception("TOGETHER_AI_API_KEY not found in environment variables.")

VECTOR_STORE = None
RETRIEVAL_CHAIN = None

def extract_pdf_text(file_bytes):
    with fitz.open(stream=file_bytes, filetype="pdf") as doc:
        text = ""
        for page in doc:
            text += page.get_text()
    return text

def process_and_store(pdf_text):
    splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=100)
    chunks = splitter.split_text(pdf_text)

    embeddings = TogetherEmbeddings(
        model="togethercomputer/m2-bert-80M-32k-retrieval",
        together_api_key=TOGETHER_API_KEY
    )
    vector_store = Chroma.from_texts(chunks, embeddings)

    llm = Together(
        model="meta-llama/Llama-3-8b-chat-hf",
        temperature=0,
        max_tokens=1024,
        together_api_key=TOGETHER_API_KEY
    )

    retriever = vector_store.as_retriever(search_kwargs={"k": 5})

    prompt_template = """
    Answer the question based only on the following context in brief.
    If you don't know the answer, just say that you don't know.

    CONTEXT:
    {context}

    QUESTION:
    {input}

    ANSWER:
    """
    prompt = PromptTemplate.from_template(prompt_template)

    qa_chain = create_stuff_documents_chain(llm, prompt)
    retrieval_chain = create_retrieval_chain(retriever, qa_chain)

    return vector_store, retrieval_chain

@app.route("/upload", methods=["POST"])
def upload_pdf():
    global VECTOR_STORE, RETRIEVAL_CHAIN

    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files['file']

    if not file or file.filename == '':
        return jsonify({"error": "Invalid file"}), 400

    try:
        pdf_text = extract_pdf_text(file.read())
        VECTOR_STORE, RETRIEVAL_CHAIN = process_and_store(pdf_text)
        return jsonify({"message": "File processed and stored"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/ask", methods=["POST"])
def ask_question():
    global RETRIEVAL_CHAIN

    if RETRIEVAL_CHAIN is None:
        return jsonify({"error": "Please upload a PDF first via /upload"}), 400

    data = request.get_json()
    question = data.get("question", "").strip()

    if not question:
        return jsonify({"error": "No question provided"}), 400

    try:
        response = RETRIEVAL_CHAIN.invoke({"input": question})
        return jsonify({"answer": response["answer"]}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
