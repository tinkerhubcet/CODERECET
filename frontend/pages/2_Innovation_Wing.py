# In pages/2_Innovation_Wing.py
import streamlit as st
import google.generativeai as genai

# --- ROBUST SETUP ---
def setup_ai():
    if "model" not in st.session_state:
        try:
            # IMPORTANT: Replace with your key
            genai.configure(api_key="AIzaSyBVfuwhsmTb7MYRvN0-5Y8bMbAKh8vh9WM")
            st.session_state.model = genai.GenerativeModel('gemini-1.5-flash')
        except Exception as e:
            st.error(f"Error initializing the model: {e}")
            st.session_state.model = None
    if 'submissions' not in st.session_state:
        st.session_state.submissions = []

setup_ai()

# --- AI Function for Analysis (UPDATED) ---
def analyze_idea(idea_text):
    model = st.session_state.model
    if not model:
        return "Model not initialized. Please go to the main Information Wing page first."

    # --- NEW PROMPT ---
    # We are adding a third instruction for the AI.
    prompt = f"""
    Analyze the following user-submitted idea. Your task is to perform THREE actions:
    1. Summarize the core proposal in a single, clear sentence.
    2. Suggest exactly 4 relevant topic tags, starting each with a hashtag.
    3. Analyze the sentiment of the idea and label it as either Positive, Negative, or Neutral.

    Idea: "{idea_text}"

    Your output should be formatted exactly like this, with each part on a new line:
    Summary: [Your one-sentence summary here]
    Tags: [Your #tag1, #tag2, #tag3, #tag4 here]
    Sentiment: [Your Positive/Negative/Neutral label here]
    """
    response = model.generate_content(prompt)
    return response.text

# --- The Streamlit App Interface (No changes here) ---
st.title("Innovation Wing | Submit Your Idea 💡")
st.markdown("Have an idea to improve your community? Share it with us!")

idea_title = st.text_input("1. What is the title of your idea?")
idea_description = st.text_area("2. Please describe your idea in detail:")
uploaded_file = st.file_uploader("3. Optional: Upload a file (like a drawing or photo)")

if st.button("Analyze & Submit My Idea"):
    if idea_title and idea_description:
        with st.spinner("Our AI is analyzing your idea..."):
            analysis_result = analyze_idea(idea_description)
            
            st.session_state.submissions.append({
                "title": idea_title,
                "description": idea_description,
                "analysis": analysis_result
            })
            
            st.success("Analysis Complete! Your idea has been submitted.")
            st.markdown(analysis_result)
            st.balloons()
    else:
        st.warning("Please make sure you have filled out the title and description.")