from pathlib import Path

BASE_DIR = Path("docs/curso/git-course")

def fix_paths(content: str) -> str:
    # Corrige caminhos de assets
    content = content.replace('href="assets/', 'href="../../assets/')
    content = content.replace('src="assets/', 'src="../../assets/')

    content = content.replace('href="../assets/', 'href="../../assets/')
    content = content.replace('src="../assets/', 'src="../../assets/')

    return content

def main():
    html_files = list(BASE_DIR.glob("*.html"))

    for file in html_files:
        content = file.read_text(encoding="utf-8")
        new_content = fix_paths(content)
        file.write_text(new_content, encoding="utf-8")
        print(f"✔ Ajustado: {file.name}")

if __name__ == "__main__":
    main()