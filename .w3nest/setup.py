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
    "rxjs": "^7.5.6",
    "rx-vdom": "^0.1.3",
    "mkdocs-ts": "^0.3.1",
    "@w3nest/webpm-client": "^0.1.4",
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
            entryFile="./main.ts", loadDependencies=list(externals_deps.keys())
        ),
    ),
    userGuide=True,
    devServer=DevServer(port=3023),
)

template_folder = Path(__file__).parent / ".template"

generate_template(config=config, dst_folder=template_folder)

files = [
    Path("src") / "auto-generated.ts",
    "README.md",
    "package.json",
    "tsconfig.json",
    "jest.config.ts",
    "webpack.config.ts",
]
for file in files:
    copyfile(src=template_folder / file, dst=project_folder / file)
