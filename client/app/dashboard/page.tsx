"use client";
import React from "react";
import CardPopularProducts from "./CardPopularProducts";
import CardSalesSummary from "./CardSalesSummary";
import CardPurchaseSummary from "./CardPurchaseSummary";
import CardExpenseSummary from "./CardExpenseSummary";

const Dashboard = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 xl:overflow-auto gap-10 pb-4 custom-grid-rows">
      <CardPopularProducts />
      <CardSalesSummary />
      <CardPurchaseSummary />
      <CardExpenseSummary />
      <div className="row-span-3 bg-gray-500" />
      <div className="md:row-span-3 xl:row-span-2 bg-gray-500" />
      <div className="md:row-span-3 xl:row-span-2 bg-gray-500" />
      <div className="md:row-span-3 xl:row-span-2 bg-gray-500" />
    </div>
  );
};

export default Dashboard;
