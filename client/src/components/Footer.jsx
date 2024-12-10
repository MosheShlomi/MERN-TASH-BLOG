import { Footer } from "flowbite-react";
import React from "react";
import { Link } from "react-router-dom";
import { BsFacebook, BsInstagram, BsLinkedin, BsGithub } from "react-icons/bs";

const FooterComponent = () => {
  return (
    <Footer container className="border border-t-8 border-teal-500">
      <div className="w-full max-w-7xl mx-auto">
        <div className="grid w-full justify-between sm:flex md:grid-cols-1">
          <div className="mt-5">
            <Link
              to="/"
              className="self-center whitespace-nowrap text-lg sm:text-xl font-semibold dark:text-white">
              <span className="px-2 py-1 bg-gradient-to-r from-red-500 via-green-500 to-blue-500  rounded-lg text-white">
                ת"ש
              </span>{" "}
              בלוג
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 sm:gap-6">
            <div>
              <Footer.Title title="זכויות ומידע" />
              <Footer.LinkGroup col>
                <Footer.Link href="#" target="_blank" rel="noopener noreferrer">
                  סיוע כלכלי
                </Footer.Link>
                <Footer.Link
                  href="https://www.nadan.org.il/"
                  target="_blank"
                  rel="noopener noreferrer">
                  סיוע משפטי
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
            {/* <div>
              <Footer.Title title="Follow us" />
              <Footer.LinkGroup col>
                <Footer.Link
                  href="https://github.com/MosheShlomi"
                  target="_blank"
                  rel="noopener noreferrer">
                  Github
                </Footer.Link>
                <Footer.Link href="#" target="_blank" rel="noopener noreferrer">
                  Linkedin
                </Footer.Link>
              </Footer.LinkGroup>
            </div> */}
            <div>
              <Footer.Title title="על הבלוג" />
              <Footer.LinkGroup col>
                <Footer.Link href="#" target="_blank" rel="noopener noreferrer">
                ✍️ אודות הבלוג
                </Footer.Link>
                <Footer.Link href="#" target="_blank" rel="noopener noreferrer">
                  📞 צור קשר
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
          </div>
        </div>
        <Footer.Divider />
        <div className="w-full sm:flex sm:items-center sm:justify-between">
          <Footer.Copyright
            href="#"
            by="Moshe Shlomi"
            year={new Date().getFullYear()}
          />
          <div className="flex gap-6 sm:mt-1 mt-4 sm:justify-center">
            <Footer.Icon href="#" icon={BsFacebook} />
            <Footer.Icon href="#" icon={BsLinkedin} />
            <Footer.Icon href="#" icon={BsInstagram} />
          </div>
        </div>
      </div>
    </Footer>
  );
};

export default FooterComponent;
