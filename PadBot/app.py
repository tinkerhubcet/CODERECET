import os
import streamlit as st
import fitz  # PyMuPDF provides this import
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langchain_together import TogetherEmbeddings, Together
from langchain.chains import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import PromptTemplate

# --- Page Configuration ---
st.set_page_config(page_title="PadBot", page_icon="🤖")
st.title("🤖 PadBot: Chat with Your Lecture Notes")

# --- THE FIX: Securely load the API key from Streamlit's secrets ---
# The app will stop if the key is not found in the secrets.toml file.
try:
    api_key = st.secrets["TOGETHER_AI_API_KEY"]
except KeyError:
    st.error("TOGETHER_AI_API_KEY not found in secrets.toml.")
    st.info("Please add it to your .streamlit/secrets.toml file.")
    st.stop()

# --- Functions (with caching) ---
@st.cache_data
def extract_pdf_text(pdf_file):
    """Extracts clean text from an uploaded PDF file using PyMuPDF."""
    try:
        file_bytes = pdf_file.getvalue()
        with fitz.open(stream=file_bytes, filetype="pdf") as doc:
            text = ""
            for page in doc:
                text += page.get_text()
        return text
    except Exception as e:
        st.error(f"Error reading PDF file: {e}")
        return None

@st.cache_resource
def process_and_store(pdf_text, file_name):
    """Splits text, creates embeddings, and stores them in a vector database."""
    with st.spinner(f"Processing {file_name}... This may take a moment."):
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=100)
        chunks = text_splitter.split_text(pdf_text)
        
        embeddings = TogetherEmbeddings(
            model="togethercomputer/m2-bert-80M-32k-retrieval",
            together_api_key=api_key
        )
        vector_store = Chroma.from_texts(chunks, embeddings)
    return vector_store

# --- Main App Logic ---
uploaded_file = st.file_uploader("Upload your lecture notes (PDF)", type="pdf")

if uploaded_file is not None:
    pdf_text = extract_pdf_text(uploaded_file)
    
    if pdf_text:
        vector_store = process_and_store(pdf_text, uploaded_file.name)
        
        llm = Together(
            model="meta-llama/Llama-3-8b-chat-hf",
            temperature=0,
            max_tokens=1024,
            together_api_key=api_key
        )
        retriever = vector_store.as_retriever(search_kwargs={"k": 5})
        
        template = """
        Answer the question based only on the following context in brief.
        If you don't know the answer, just say that you don't know."
        
        CONTEXT:
        {context}

        QUESTION:
        {input}

        ANSWER:
        """
        prompt = PromptTemplate.from_template(template)
        
        question_answer_chain = create_stuff_documents_chain(llm, prompt)
        retrieval_chain = create_retrieval_chain(retriever, question_answer_chain)

        st.header("Ask a Question")
        user_query = st.text_input("What would you like to know about your notes?")

        if user_query:
            with st.spinner("Searching for an answer..."):
                try:
                    response = retrieval_chain.invoke({"input": user_query})
                    st.success("Answer:")
                    st.write(response["answer"])

                except Exception as e:
                    st.error(f"An error occurred: {e}")

