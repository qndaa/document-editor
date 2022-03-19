def clean_text(input_text: str, output_text: str, contract_type: str) -> str:
    return output_text.replace(input_text, '').replace(f"<<{contract_type}>>", "").strip()
