from pathlib import Path
from typing import cast

from mkapi_python import generate_api, Configuration, std_links
import griffe

PROJECT = Path(__file__).parent.parent

print("Generate python API documentation of 'w3gallery_tdse1d'")

NAME = "mkapi_python"
DST = Path(__file__).parent.parent / "assets" / "api" / "tdse-1d"

config = Configuration(
    external_links={**std_links()},
    out=DST,
)
module_path = PROJECT / "backends" / "tdse-1d" / "w3gallery_tdse1d"

global_doc = cast(
    griffe.Module,
    griffe.load(
        module_path,
        submodules=True,
    ),
)
generate_api(global_doc, config)
