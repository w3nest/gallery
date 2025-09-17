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

root_pkg_json = parse_json(project_folder / ".." / ".." / ".." / "package.json")
root_deps = root_pkg_json["webpm"]["dependencies"]

# These dependencies are not included in the bundle
# They are fetched from NPM for project setup, and from webpm for runtime linking.
externals_deps = {
    k: root_deps[k]
    for k in ["@w3nest/webpm-client", "mkdocs-ts", "@mkdocs-ts/notebook"]
}
# These dependencies are included in the bundle
in_bundle_deps = {}

# Dev. only dependencies (not used at runtime)
dev_deps = {}

config = ProjectConfig(
    path=project_folder,
    type=PackageType.LIBRARY,
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
            entryFile="./lib/index.ts", loadDependencies=list(externals_deps.keys())
        ),
    ),
    devServer=DevServer(port=3023),
)

template_folder = Path(__file__).parent / ".template"

generate_template(config=config, dst_folder=template_folder)

# Comment out or remove the files that should not be auto-generated
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
