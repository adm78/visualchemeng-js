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
# TODO: add command line arg functionality
# ----------------------------------------------------------
import os.path

from bs4 import BeautifulSoup


class ProductionHTMLGenerator(object):
    # TODO: add sensible defaults

    def __init__(self, test_html_path: str, commit_hash: str, production_html_path: str, vce_repo_path: str, cdn_path_root: str):
        super(ProductionHTMLGenerator, self).__init__()

        self._test_html_path = test_html_path
        self._production_html_path = production_html_path
        self._vce_repo_path = vce_repo_path
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
    test_html_path = r"C:\Users\amcgu\Documents\visualchemeng-js\apps\molecular_dynamics\html\test\edmd.html"
    production_html_path = r"C:\Users\amcgu\Documents\visualchemeng-js\apps\molecular_dynamics\html\production\edmd.html"
    vce_repo_path = r"C:\Users\amcgu\Documents\visualchemeng-js"
    cdn_path_root = "https://rawcdn.githack.com/adm78/visualchemeng_js"
    commit_hash = "8d679b06cab316d2c15cb9070e9dc21d90020367"  #

    generator = ProductionHTMLGenerator(test_html_path=test_html_path, commit_hash=commit_hash, production_html_path=production_html_path,
                                        vce_repo_path=vce_repo_path, cdn_path_root=cdn_path_root)
    generator.generate()
