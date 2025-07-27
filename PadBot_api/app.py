from flask import Flask, request, jsonify
from flask_cors import CORS
import fitz  # PyMuPDF
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langchain_together import TogetherEmbeddings, Together
from langchain.chains import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import PromptTemplate
import google.generativeai as genai
import requests
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app, origins=["*"])



# Load API Keys
TOGETHER_API_KEY = os.getenv("TOGETHER_API_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# Gemini setup
genai.configure(api_key=GEMINI_API_KEY)
gemini_model = genai.GenerativeModel("gemini-2.5-flash")

if not TOGETHER_API_KEY:
    raise Exception("TOGETHER_AI_API_KEY not found in environment variables.")
if not GEMINI_API_KEY:
    raise Exception("GEMINI_API_KEY not found in environment variables.")

VECTOR_STORE = None
RETRIEVAL_CHAIN = None

# -----------------------------------------
# PDF Parsing and LangChain QA Chain Setup
# -----------------------------------------
def extract_pdf_text(file_bytes):
    with fitz.open(stream=file_bytes, filetype="pdf") as doc:
        return "".join(page.get_text() for page in doc)

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

# -------------------------------
# Gemini Skill Analysis Functions
# -------------------------------
def fetch_github_summary(github_url):
    try:
        username = github_url.rstrip("/").split("/")[-1]
        api_url = f"https://api.github.com/users/{username}/repos"
        repos = requests.get(api_url).json()

        summary = f"GitHub user: {username}\n"
        for repo in repos[:5]:
            summary += f"- {repo['name']}: {repo.get('description', 'No description')}\n"
        return summary
    except Exception as e:
        return f"Error fetching GitHub info: {str(e)}"

def analyze_with_gemini(resume_text, github_summary, desired_role):
    prompt = f"""
You are a career coach. A user wants to become a {desired_role}.
Based on the resume and GitHub data, analyze:

1. Skills they already have
2. Skills they lack
3. A short learning roadmap

Resume:
{resume_text}

GitHub:
{github_summary}
"""
    response = gemini_model.generate_content(prompt)
    return response.text

# -------------------------------
# Routes
# -------------------------------
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
        return jsonify({"error": "Please upload a PDF first"}), 400

    data = request.get_json()
    question = data.get("question", "").strip()
    if not question:
        return jsonify({"error": "No question provided"}), 400

    try:
        response = RETRIEVAL_CHAIN.invoke({"input": question})
        return jsonify({"answer": response["answer"]}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/submit_preferences', methods=['POST'])
def submit_preferences():
    try:
        role = request.form.get("role", "").strip()
        company = request.form.get("company", "").strip()
        github_link = request.form.get("githubLink", "").strip()
        resume_file = request.files.get("resumeFile")

        # ✅ Field validation
        if not (role and company and github_link and resume_file):
            print("❌ Missing fields:", role, company, github_link, resume_file)
            return jsonify({"error": "Missing required fields"}), 400

        # ✅ Debug info
        print(f"\n📥 Received Submission:")
        print(f"  - 📄 Resume: {resume_file.filename} ({resume_file.content_type})")
        print(f"  - 🎯 Role: {role}")
        print(f"  - 🏢 Company: {company}")
        print(f"  - 🐙 GitHub: {github_link}\n")

        # ✅ Process data
        pdf_text = extract_pdf_text(resume_file.read())
        github_summary = fetch_github_summary(github_link)
        gemini_analysis = analyze_with_gemini(pdf_text, github_summary, role)

        print(f"✅ Gemini Analysis:\n{gemini_analysis}\n")

        return jsonify({
            "message": "Analysis complete!",
            "analysis": gemini_analysis
        }), 200

    except Exception as e:
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500
    
if __name__ == "__main__":
    app.run(debug=True)