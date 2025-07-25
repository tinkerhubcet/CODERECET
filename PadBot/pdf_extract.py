import pypdf

def extract_pdf_text(pdf_file_path):
    reader = pypdf.PdfReader(pdf_file_path)
    text = ""
    for page in reader.pages:
        text += page.extract_text()
    return text

if __name__ == "__main__":
    # Replace 'your_notes.pdf' with the name of a PDF you want to test
    pdf_file = "mod5-2.pdf"
    content = extract_pdf_text(pdf_file)
    print(content[:1000])  # Just print the first 1000 characters for a quick check
