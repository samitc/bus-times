import React from 'react';
export default function LoaderComponent({ isLoading }) {
    return isLoading ? <img src="loader.gif" /> : <></>;
}