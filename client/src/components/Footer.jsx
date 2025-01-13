import { Footer } from "flowbite-react";
import React from "react";
import { Link } from "react-router-dom";
import { BsFacebook, BsInstagram, BsLinkedin, BsGithub } from "react-icons/bs";

const FooterComponent = () => {
  return (
    <Footer container className="border-t-4 border-teal-500 bg-gray-50">
      <div className="w-full max-w-7xl mx-auto py-6 px-4">
        <div className="grid w-full sm:flex sm:justify-between">
          <div className="mb-6 sm:mb-0">
            <Link
              to="/"
              className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white">
              <span className="px-2 py-1 bg-gradient-to-r from-red-500 via-green-500 to-blue-500 rounded-lg text-white">
                ת"ש
              </span>{" "}
              בלוג
            </Link>
          </div>

          {/* Categories */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 sm:gap-6">
            {/* Category 1 */}
            <div>
              <Footer.Title
                title="📜 זכויות ומידע"
                className="pb-2 border-b border-gray-600"
              />
              <Footer.LinkGroup col>
                <Footer.Link
                  href="https://www.nadan.org.il/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="!mr-0">
                  ⚖️ סיוע משפטי
                </Footer.Link>
                <Footer.Link
                  href="https://www.hachvana.mod.gov.il/Benefits/Pages/GoodToKnow.aspx"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="!mr-0">
                  🛡️ מידע למשוחררים
                </Footer.Link>
                <Footer.Link
                  href="https://www.kolzchut.org.il/he/%D7%97%D7%99%D7%99%D7%9C%D7%99%D7%9D_%D7%95%D7%97%D7%99%D7%99%D7%9C%D7%95%D7%AA_%D7%91%D7%A9%D7%99%D7%A8%D7%95%D7%AA_%D7%97%D7%95%D7%91%D7%94_(%D7%A6%D7%94%22%D7%9C)"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="!mr-0">
                  🏥 זכויות בכללי
                </Footer.Link>
              </Footer.LinkGroup>
            </div>

            {/* Category 2 */}
            <div>
              <Footer.Title
                title="📌 מידע חשוב"
                className="pb-2 border-b border-gray-600"
              />
              <Footer.LinkGroup col>
                <Footer.Link
                  href="https://www.idf.il/%D7%94%D7%A9%D7%99%D7%A8%D7%95%D7%AA-%D7%A9%D7%9C%D7%99/%D7%AA%D7%A0%D7%90%D7%99-%D7%94%D7%A9%D7%99%D7%A8%D7%95%D7%AA-%D7%91%D7%A6%D7%94-%D7%9C/%D7%9E%D7%A9%D7%90%D7%91%D7%99-%D7%90%D7%A0%D7%95%D7%A9/%D7%90%D7%99%D7%9A-%D7%9E%D7%A7%D7%91%D7%9C%D7%99%D7%9D-%D7%97%D7%95%D7%A4%D7%A9%D7%94-%D7%9E%D7%99%D7%95%D7%97%D7%93%D7%AA-%D7%91%D7%A6%D7%91%D7%90/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="!mr-0">
                  📆 סוגי מיוחדות
                </Footer.Link>
                <Footer.Link
                  href="https://www.kolzchut.org.il/he/%D7%AA%D7%A9%D7%9E%22%D7%A9_-_%D7%AA%D7%A9%D7%9C%D7%95%D7%9E%D7%99_%D7%9E%D7%A9%D7%A4%D7%97%D7%94_(%D7%A1%D7%99%D7%95%D7%A2_%D7%9B%D7%9C%D7%9B%D7%9C%D7%99_%D7%9C%D7%97%D7%99%D7%99%D7%9C%D7%99%D7%9D)"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="!mr-0">
                  💵 תשמ"ש
                </Footer.Link>
              </Footer.LinkGroup>
            </div>

            {/* Category 3 */}
            <div>
              <Footer.Title
                title="🖋️ על הבלוג"
                className="pb-2 border-b border-gray-600"
              />
              <Footer.LinkGroup col>
                <Footer.Link
                  href="/about"
                  rel="noopener noreferrer"
                  className="!mr-0">
                  ✍️ אודות הבלוג
                </Footer.Link>
                <Footer.Link
                  href="/contact"
                  rel="noopener noreferrer"
                  className="!mr-0">
                  📞 צור קשר
                </Footer.Link>
                <Footer.Link
                  href="/privacy"
                  rel="noopener noreferrer"
                  className="!mr-0">
                  📖 מדיניות פרטיות
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
          </div>
        </div>

        {/* Divider */}
        <Footer.Divider />

        {/* Footer Bottom */}
        <div className="flex flex-col sm:flex-row sm:justify-between items-center mt-6">
          <Footer.Copyright
            href="#"
            by="Moshe Shlomi"
            year={new Date().getFullYear()}
          />
          <div className="flex gap-6 mt-4 sm:mt-0">
            {/* <Footer.Icon
              href=""
              icon={BsLinkedin}
            /> */}
            {/* <Footer.Icon href="https://facebook.com" icon={BsFacebook} /> */}
            {/* <Footer.Icon href="https://instagram.com" icon={BsInstagram} />
            <Footer.Icon
              href="#"
              icon={BsGithub}
            /> */}
          </div>
        </div>
      </div>
    </Footer>
  );
};

export default FooterComponent;
