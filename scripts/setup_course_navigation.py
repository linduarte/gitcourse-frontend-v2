from pathlib import Path

BASE_DIR = Path("docs/curso/git-course")

def main():
    files = sorted(BASE_DIR.glob("*.html"))

    for i, file in enumerate(files):
        prev_file = files[i - 1].name if i > 0 else None
        next_file = files[i + 1].name if i < len(files) - 1 else None
        topic_id = i + 1

        content = file.read_text(encoding="utf-8")

        # Atualiza data-topic-id
        content = content.replace(
            'data-topic-id="',
            f'data-topic-id="{topic_id}"'
        )

        # Atualiza links do footer
        if prev_file:
            content = content.replace(
                'href="PREV_LINK"',
                f'href="{prev_file}"'
            )

        if next_file:
            content = content.replace(
                'href="NEXT_LINK"',
                f'href="{next_file}"'
            )

        file.write_text(content, encoding="utf-8")
        print(f"✔ {file.name} → topic_id={topic_id}")

if __name__ == "__main__":
    main()