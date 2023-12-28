import { useContext } from "react";
import { Link } from "react-router-dom";
import { FaBars, HiXMark } from "../../utils/icons";
import Search from "./Search";
import { useDispatch, useSelector } from "react-redux";
import { handleMenu } from "../../features/homeSlice";
import { DarkModeContext } from "../../context/DarkModeStore";


const darkButton = <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 20 20" aria-hidden="true" className="text-primary text-2xl mr-2 " height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd"></path></svg>
const lightButton = <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 20 20" aria-hidden="true" className="text-primary text-2xl mr-2 " height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path></svg>

const Navbar = () => {
  const { menu } = useSelector((store) => store.home);
  const dispatch = useDispatch();

  const { isDarkMode, toggleDarkMode } = useContext(DarkModeContext);

  console.log(isDarkMode, 'lll')


  return (
    // <div className={`relative h-20 md:mr-[4rem] flex items-center justify-between px-2 border-b-2 border-x-2 ${isDarkMode ? 'lg:bg-slate-950' : 'lg:bg-[#c8e6bf]'}`}>
    <div className={`relative h-20  flex items-center justify-between px-2  ${isDarkMode ? 'lg:bg-slate-950' : 'lg:bg-[#c8e6bf]'}`}>

      <div className="flex items-center gap-x-3 md:gap-x-9">
        <div className="px-3 shrink-0">
          <Link to="/">
            {/* <img src={logo} alt="logo" className="w-[70px] sm:w-24 md:w-28" /> */}
            <p className="text-[20px] text-red-500">Tmusic</p>
          </Link>
        </div>
        <Link
          to="/"
          className="font-mono hidden sm:text-xl md:hidden hover:border-b border-red-400 duration-150"
        >
          Home
        </Link>
      </div>
      <Search />
      <div className="gap-6 justify-center mx-16 hidden md:flex font-mono">
        <Link
          to="/"
          className="font-mono text-xl hidden md:flex hover:border-b border-red-400 duration-150"
        >
          Home
        </Link>
      </div>
      <div>
        {/* <button className={`bg-green-600 px-3 lg:py-2 rounded-md ${isDarkMode ? "darkButton" : "lightButton"}`} onClick={toggleDarkMode}>{isDarkMode ? "Enable Light Mode" : "Enable Dark Mode"}</button> */}

        <button onClick={toggleDarkMode} className='flex  '>
          <span>{isDarkMode ? darkButton : lightButton}</span>
          <span>{isDarkMode ? 'Light mode' : 'Dark Mode'}</span>
        </button>

      </div>
      <div className="mr-4 sm:hidden">
        {!menu ? (
          <FaBars size="29px" className="" onClick={() => dispatch(handleMenu("open"))} />
        ) : (
          <HiXMark size="29px" className="scale-125" onClick={() => dispatch(handleMenu("close"))} />
        )}
      </div>
    </div>
  );
};
export default Navbar;
