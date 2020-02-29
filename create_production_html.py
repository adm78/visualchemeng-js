# VCE Project - create_production_html.py
#
# This script can be used to create an app production html from a test html
#
# Requires:
#  - p5.js or minified equivalent
#  - p5.dom.js or minified equivalent
#  - vce_utils.js
#
# Andrew D. McGuire 2020
# amcguire227@gmail.com
#
# TODO: default production file should be ../production/test_filename (relative to test file), if not provided
# ----------------------------------------------------------
import argparse
import os.path

import git
from bs4 import BeautifulSoup

parser = argparse.ArgumentParser(description=('Create a production ready application html (i.e. one that uses only remote sources) ' +
                                              'from a test hmtl application (i.e. one that uses a mixture of local and remote sources).'),
                                 formatter_class=argparse.ArgumentDefaultsHelpFormatter)
parser.add_argument('-f', dest='test_html_path', type=str, help='path to the test .html file to be processed')
parser.add_argument('-c', dest='commit_hash', type=str, help='the commit hash to be used for remote vce repository files (last local commit if not provided)',
                    default=None)
parser.add_argument('-o', dest='production_html_path', type=str, help='the path of the production .html file to be created')
parser.add_argument('-g', dest='vce_repo_path', required=False,
                    help='the path to the vce git repository that the test html lives in (auto-find is attempted if not provided)')
parser.add_argument('--cdn', dest='cdn_path_root', default="https://rawcdn.githack.com/adm78/visualchemeng_js", required=False,
                    help='the cdn path root to use for remote files')
args = parser.parse_args()

if args.commit_hash is None:
    args.commit_hash = git.Repo(search_parent_directories=True).head.object.hexsha
if args.vce_repo_path is None:
    args.vce_repo_path = git.Repo(search_parent_directories=True).working_tree_dir


class ProductionHTMLGenerator(object):
    # TODO: add sensible defaults

    def __init__(self, test_html_path: str, commit_hash: str, production_html_path: str, vce_repo_path: str, cdn_path_root: str):
        super(ProductionHTMLGenerator, self).__init__()

        self._test_html_path = os.path.abspath(test_html_path)
        self._production_html_path = os.path.abspath(production_html_path)
        self._vce_repo_path = os.path.abspath(vce_repo_path)
        self._cdn_path_root = cdn_path_root
        self._commit_hash = commit_hash  # this is the hash of the commit we want to pull the various source files from

    def generate(self):
        with open(self._test_html_path, "r") as f:
            contents = f.read()
            soup = BeautifulSoup(contents, 'lxml')

            links = soup.find_all('link')
            for link in links:
                src = link['href']
                if self._is_vce_path(src):
                    link['href'] = self._get_remote_path(src)

            images = soup.find_all('img')
            for image in images:
                src = image['src']
                if self._is_vce_path(src):
                    image['src'] = self._get_remote_path(src)

            scripts = soup.find_all('script')
            for script in scripts:
                src = script['src']
                if self._is_vce_path(src):
                    script['src'] = self._get_remote_path(src)

        with open(self._production_html_path, "w") as f:
            f.write(soup.prettify())
            print("Production html output to {}".format(self._production_html_path))

    def _is_vce_path(self, src: str) -> bool:
        return not (src.startswith('https://') or src.startswith('http://'))

    def _get_remote_path(self, src: str) -> str:
        abs_src_path = os.path.normpath(os.path.join(self._test_html_path, '..', src))
        path_rel_to_repo_root = abs_src_path.replace(self._vce_repo_path, '', 1).replace('\\', '/')
        if path_rel_to_repo_root.startswith('/'):
            path_rel_to_repo_root = path_rel_to_repo_root.replace('/', '', 1)
        remote_path = "{}/{}/{}".format(self._cdn_path_root, self._commit_hash, path_rel_to_repo_root)
        return remote_path


if __name__ == '__main__':
    generator = ProductionHTMLGenerator(test_html_path=args.test_html_path, commit_hash=args.commit_hash, production_html_path=args.production_html_path,
                                        vce_repo_path=args.vce_repo_path, cdn_path_root=args.cdn_path_root)
    generator.generate()
