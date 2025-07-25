# In pages/1_Information_Wing.py
import streamlit as st
import google.generativeai as genai

# --- ROBUST INITIALIZATION ---
# We ensure the 'messages' list exists every time this page loads.
if "messages" not in st.session_state:
    st.session_state.messages = []

# --- Get the model from memory ---
# This relies on the model being initialized in app.py
model = st.session_state.get("model", None)


# --- The Streamlit App Interface ---
st.title("Information Wing | Ask the AI")
st.markdown("Ask any question about the **Kerala Student Laptop Scheme 2025**")

knowledge_base = """
Scheme Name: Kerala Student Laptop Scheme 2025
Details: This scheme provides a free laptop to college students from families with an annual income below Rs. 1,00,000.
Eligibility: The student must be enrolled in a government or aided college in Kerala. They must provide a valid college ID and an income certificate from the Village Office.
Application: Students can apply online through the Akshaya portal starting from August 1, 2025.
"""

def answer_question(question):
    if not model:
        return "Model not ready. Please return to the Home page to initialize it."
    
    prompt = f"Context:\n{knowledge_base}\n\nBased ONLY on the context, answer the question: {question}"
    response = model.generate_content(prompt)
    return response.text

# --- Chat Interface ---
# Display prior chat messages
for message in st.session_state.messages:
    with st.chat_message(message["role"]):
        st.markdown(message["content"])

# Get new user input
if user_question := st.chat_input("What is your question?"):
    st.session_state.messages.append({"role": "user", "content": user_question})
    with st.chat_message("user"):
        st.markdown(user_question)

    with st.chat_message("assistant"):
        with st.spinner("Thinking..."):
            ai_answer = answer_question(user_question)
            st.write(ai_answer)
    st.session_state.messages.append({"role": "assistant", "content": ai_answer})