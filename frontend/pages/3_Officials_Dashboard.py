# In pages/3_Officials_Dashboard.py
import streamlit as st

# --- ROBUST INITIALIZATION ---
# We add the safety check here as well. This is the key fix.
if 'submissions' not in st.session_state:
    st.session_state.submissions = []

# --- The Streamlit App Interface ---
st.title("Officials' Dashboard | Submitted Ideas 📋")
st.markdown("Here are all the ideas submitted by the community during this session.")

# Now, we check the list and display the content
if st.session_state.submissions:
    # Loop through all the submissions and display them
    for i, submission in enumerate(st.session_state.submissions):
        st.header(f"Idea #{i+1}: {submission['title']}")
        
        with st.expander("Show Full Description"):
            st.write(submission['description'])
            
        st.subheader("AI Analysis:")
        st.info(submission['analysis'])
        
        st.divider()
else:
    st.warning("No ideas have been submitted yet. Go to the Innovation Wing to submit one!")

# Optional: Add the debug line if you still face issues
# st.write(st.session_state)