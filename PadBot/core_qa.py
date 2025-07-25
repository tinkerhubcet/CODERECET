import os
import pypdf
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langchain_together import TogetherEmbeddings, Together
from langchain.chains.question_answering import load_qa_chain

# --- IMPORTANT: Set your API Key here ---
# Make sure your API key is set correctly
os.environ["TOGETHER_API_KEY"] = "ed69ec1110a69d86dd63f4cd1937c3b54906ee1704fd2eb4c67c56664163aacb"

def extract_pdf_text(pdf_file_path):
    """Extracts text from a PDF file."""
    try:
        reader = pypdf.PdfReader(pdf_file_path)
        text = ""
        for page in reader.pages:
            text += page.extract_text() or ""
        return text
    except FileNotFoundError:
        print(f"Error: The file '{pdf_file_path}' was not found.")
        return None

def process_and_store(pdf_text):
    """Splits text, creates embeddings, and stores them in ChromaDB."""
    splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=100)
    chunks = splitter.split_text(pdf_text)
    
    # --- THE FIX: Switched to the currently available embedding model ---
    embeddings = TogetherEmbeddings(model="togethercomputer/m2-bert-80M-32k-retrieval")
    
    # Create the vector store
    vectordb = Chroma.from_texts(chunks, embedding=embeddings, collection_name="padbot_notes")
    return vectordb

def answer_question(question, vectordb):
    """Retrieves relevant documents and gets an answer from the LLM."""
    relevant_docs = vectordb.similarity_search(question, k=4)
    
    llm = Together(
        model="meta-llama/Llama-3-8b-chat-hf",
        temperature=0.7,
        max_tokens=512
    )
    
    chain = load_qa_chain(llm, chain_type="stuff")
    answer = chain.run(input_documents=relevant_docs, question=question)
    return answer

if __name__ == "__main__":
    if not os.environ.get("TOGETHER_API_KEY") or os.environ.get("TOGETHER_API_KEY") == "YOUR_API_KEY_HERE":
        print("🔴 Error: TOGETHER_API_KEY is not set.")
        print("Please replace 'YOUR_API_KEY_HERE' in the script with your actual key.")
    else:
        pdf_file = "mod5-2.pdf"
        pdf_text = extract_pdf_text(pdf_file)
        
        if pdf_text:
            print("1. PDF text extracted successfully.")
            
            vector_database = process_and_store(pdf_text)
            print("2. Text processed and stored in vector database.")
            
            my_question = "What is the main topic of this document?"
            print(f"\n❓ Asking question: {my_question}")
            
            final_answer = answer_question(my_question, vector_database)
            print("\n✅ Answer from PadBot:")
            print(final_answer)

