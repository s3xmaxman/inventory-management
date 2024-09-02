import React from "react";

const Header = ({ name }: { name: string }) => {
  return <h1 className="text-2xl font-semibold text-gray-700">{name}</h1>;
};

export default Header;
