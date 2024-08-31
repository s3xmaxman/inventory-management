import Navbar from "@/components/Navbar";
import React from "react";

type Props = {};

const DashboardWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={`flex bg-gray-50 text-gray-900 w-full min-h-screen`}>
      Sidebar
      <main
        className={`flex flex-col w-full h-full py-7 px-9 bg-grey-50 md:pl-24`}
      >
        <Navbar />
        {children}
      </main>
    </div>
  );
};

export default DashboardWrapper;
