import React from "react";
export default function LoaderComponent({ isLoading = true }) {
  return isLoading ? <img src="loader.gif" /> : <></>;
}
