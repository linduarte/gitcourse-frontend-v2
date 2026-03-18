from pathlib import Path

BASE_DIR = Path("docs/curso/git-course")

FOOTER_TEMPLATE = """
<footer class="footer">
    <div class="footer-flex">
        <nav class="footer-nav">
            {prev_link}
            {next_link}
        </nav>

        <div class="footer-buttons">
            <button id="logoutButton" class="btn-footer-primary">Logout</button>

            <button 
                id="markCompletedButton" 
                data-topic-id="{topic_id}" 
                class="btn-footer-primary">
                Concluído ✓
            </button>
        </div>
    </div>
</footer>
"""

SCRIPTS = """
<script src="../../assets/js/config.js"></script>
<script src="../../assets/js/progress.js"></script>
"""

def has_authentic_footer(content: str) -> bool:
    """Detecta footer ORIGINAL (com badges)"""
    return "footer-badges" in content


def has_generated_footer(content: str) -> bool:
    """Detecta se já tem footer automático"""
    return "markCompletedButton" in content


def create_link(name, text):
    return f'<a href="{name}" class="footer-link">{text}</a>' if name else ""


def main():
    files = sorted(BASE_DIR.glob("*.html"))

    for i, file in enumerate(files):
        content = file.read_text(encoding="utf-8")

        # 🚫 Proteção 1: não mexer em página com footer autêntico
        if has_authentic_footer(content):
            print(f"🟢 Preservado (footer original): {file.name}")
            continue

        # 🚫 Proteção 2: evitar duplicação
        if has_generated_footer(content):
            print(f"✔ Já possui footer automático: {file.name}")
            continue

        prev_file = files[i - 1].name if i > 0 else None
        next_file = files[i + 1].name if i < len(files) - 1 else None

        footer = FOOTER_TEMPLATE.format(
            prev_link=create_link(prev_file, "← Voltar"),
            next_link=create_link(next_file, "Próximo →"),
            topic_id=i + 1
        )

        # Inserção segura
        if "</body>" in content:
            content = content.replace(
                "</body>",
                footer + "\n" + SCRIPTS + "\n</body>"
            )
        else:
            content += footer + SCRIPTS

        file.write_text(content, encoding="utf-8")

        print(f"🔵 Footer adicionado: {file.name}")

    print("\n✅ Processo finalizado com segurança!")


if __name__ == "__main__":
    main()