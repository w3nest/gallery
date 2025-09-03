from shutil import copyfile
from pathlib import Path

from w3nest.ci.ts_frontend import (
    ProjectConfig,
    PackageType,
    Dependencies,
    RunTimeDeps,
    DevServer,
    Bundles,
    MainModule,
    generate_template,
)

from w3nest.utils import parse_json

project_folder = Path(__file__).parent.parent

pkg_json = parse_json(project_folder / "package.json")

externals_deps = {
    "rxjs": "^7.8.2",
    "rx-vdom": "^0.1.7",
    "mkdocs-ts": "^0.5.3",
    "@mkdocs-ts/notebook": "^0.1.5",
    "@w3nest/webpm-client": "^0.1.12",
    "@w3nest/ui-tk": "^0.1.8",
    "mathjax": "^3.1.4",
}

in_bundle_deps = {}
dev_deps = {}

config = ProjectConfig(
    path=project_folder,
    type=PackageType.APPLICATION,
    name=pkg_json["name"],
    version=pkg_json["version"],
    shortDescription=pkg_json["description"],
    author=pkg_json["author"],
    dependencies=Dependencies(
        runTime=RunTimeDeps(externals=externals_deps, includedInBundle=in_bundle_deps),
        devTime=dev_deps,
    ),
    bundles=Bundles(
        mainModule=MainModule(
            entryFile="./app/main.ts",
            loadDependencies=[
                "rxjs",
                "rx-vdom",
                "mkdocs-ts",
                "@mkdocs-ts/notebook",
                "@w3nest/webpm-client",
                "@w3nest/ui-tk",
                "mathjax",
            ],
        ),
    ),
    devServer=DevServer(port=3023),
)

template_folder = Path(__file__).parent / ".template"

generate_template(config=config, dst_folder=template_folder)

files = [
    ".gitignore",
    "README.md",
    "package.json",
    "tsconfig.json",
    "jest.config.ts",
    "webpack.config.ts",
    "typedoc.js",
]
for file in files:
    copyfile(src=template_folder / file, dst=project_folder / file)
