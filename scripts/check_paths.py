from pathlib import Path
import re

BASE_DIR = Path("docs")

# extensões que realmente precisam existir
CHECK_EXTENSIONS = {
    ".css", ".js", ".png", ".jpg", ".jpeg", ".webp", ".svg", ".html"
}

def should_ignore(path: str) -> bool:
    """Ignora caminhos que não devem ser validados"""
    return (
        path.startswith("#") or
        path.startswith("http") or
        path.startswith("mailto:") or
        path.startswith("tel:") or
        path.startswith("javascript:")
    )


def is_valid_file_path(file_path: Path, target: str) -> bool:
    """Resolve e verifica se o caminho existe"""
    try:
        resolved = (file_path.parent / target).resolve()
        return resolved.exists()
    except Exception:
        return False


def main():
    errors = []
    checked = 0

    for file in BASE_DIR.rglob("*.html"):
        content = file.read_text(encoding="utf-8")

        # captura src e href
        matches = re.findall(r'(?:src|href)="([^"]+)"', content)

        for path in matches:
            if should_ignore(path):
                continue

            # remove query params (?v=1.2 etc)
            clean_path = path.split("?")[0]

            # ignora se não tiver extensão relevante
            if Path(clean_path).suffix.lower() not in CHECK_EXTENSIONS:
                continue

            checked += 1

            if not is_valid_file_path(file, clean_path):
                errors.append((file, path))

    # resultado
    print(f"\n🔍 Verificações realizadas: {checked}")

    if not errors:
        print("✅ Todos os caminhos estão corretos!")
        return

    print(f"\n❌ Problemas encontrados: {len(errors)}\n")

    for file, path in errors:
        print(f"{file.relative_to(BASE_DIR)} → {path}")

    print("\n⚠ Corrija os caminhos acima para garantir funcionamento no GitHub Pages.")


if __name__ == "__main__":
    main()